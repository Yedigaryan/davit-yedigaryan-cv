export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
    id: string
    role: ChatRole
    content: string
    createdAt: number
}

export interface LlmChatApiConfig {
    /** Endpoint URL of an OpenAI-compatible chat completions API, or any backend you control. */
    apiUrl: string
    /** Optional bearer token. Public env vars are visible to clients — prefer a backend proxy for sensitive keys. */
    apiKey?: string
    /** Extra headers to merge into the request. */
    headers?: Record<string, string>
    /** Model identifier to forward to the backend. */
    model?: string
    /** System prompt prepended on every request. */
    systemPrompt?: string
    /** Enable Server-Sent-Events streaming. The backend must respond with `text/event-stream`. */
    streaming?: boolean
    /**
     * Customize the request body. Defaults to OpenAI/Anthropic-compatible:
     * `{ model, messages: [{role, content}], stream }`.
     */
    buildRequestBody?: (messages: ChatMessage[], cfg: LlmChatApiConfig) => unknown
    /**
     * Extract assistant text from a non-streaming JSON response.
     * Defaults to OpenAI shape `data.choices[0].message.content`, with fallbacks
     * for `data.message.content`, `data.content`, `data.reply`, `data.output`.
     */
    parseResponse?: (data: unknown) => string
    /**
     * Extract a delta string from a single SSE event payload (the JSON after `data: `).
     * Defaults to OpenAI shape `delta.choices[0].delta.content`.
     */
    parseStreamChunk?: (chunk: unknown) => string
}

const DEFAULT_BODY: NonNullable<LlmChatApiConfig['buildRequestBody']> = (messages, cfg) => {
    const payload: Record<string, unknown> = {
        messages: messages.map(({ role, content }) => ({ role, content })),
    }
    if (cfg.model) payload.model = cfg.model
    if (cfg.streaming) payload.stream = true
    return payload
}

const get = (obj: unknown, path: string): unknown => {
    return path.split('.').reduce<unknown>((acc, key) => {
        if (acc && typeof acc === 'object') {
            const idx = /^\d+$/.test(key) ? Number(key) : key
            return (acc as Record<string | number, unknown>)[idx as never]
        }
        return undefined
    }, obj)
}

const DEFAULT_PARSE_RESPONSE: NonNullable<LlmChatApiConfig['parseResponse']> = (data) => {
    const candidates = [
        'choices.0.message.content',
        'message.content',
        'content',
        'reply',
        'output',
        'response',
    ]
    for (const path of candidates) {
        const value = get(data, path)
        if (typeof value === 'string' && value.length > 0) return value
    }
    if (typeof data === 'string') return data
    throw new Error('Could not extract assistant content from response')
}

const DEFAULT_PARSE_CHUNK: NonNullable<LlmChatApiConfig['parseStreamChunk']> = (chunk) => {
    const candidates = ['choices.0.delta.content', 'delta.content', 'content', 'text']
    for (const path of candidates) {
        const value = get(chunk, path)
        if (typeof value === 'string') return value
    }
    return ''
}

export interface SendOptions {
    signal?: AbortSignal
    onDelta?: (text: string) => void
}

export async function sendChat(
    history: ChatMessage[],
    cfg: LlmChatApiConfig,
    opts: SendOptions = {},
): Promise<string> {
    const messages: ChatMessage[] = cfg.systemPrompt
        ? [
              {
                  id: 'system',
                  role: 'system',
                  content: cfg.systemPrompt,
                  createdAt: 0,
              },
              ...history,
          ]
        : history

    const body = (cfg.buildRequestBody ?? DEFAULT_BODY)(messages, cfg)

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(cfg.headers ?? {}),
    }
    if (cfg.apiKey && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${cfg.apiKey}`
    }
    if (cfg.streaming && !headers['Accept']) {
        headers['Accept'] = 'text/event-stream'
    }

    const res = await fetch(cfg.apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: opts.signal,
    })

    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`Chat API error ${res.status}: ${text || res.statusText}`)
    }

    if (!cfg.streaming) {
        const data = await res.json()
        return (cfg.parseResponse ?? DEFAULT_PARSE_RESPONSE)(data)
    }

    if (!res.body) throw new Error('Streaming response has no body')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    const parseChunk = cfg.parseStreamChunk ?? DEFAULT_PARSE_CHUNK
    let buffer = ''
    let acc = ''

    while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        // SSE events are separated by a blank line.
        let sep
        while ((sep = buffer.indexOf('\n\n')) !== -1) {
            const event = buffer.slice(0, sep)
            buffer = buffer.slice(sep + 2)

            for (const line of event.split('\n')) {
                if (!line.startsWith('data:')) continue
                const data = line.slice(5).trim()
                if (!data || data === '[DONE]') continue
                try {
                    const json = JSON.parse(data)
                    const delta = parseChunk(json)
                    if (delta) {
                        acc += delta
                        opts.onDelta?.(delta)
                    }
                } catch {
                    // Ignore malformed event; some backends emit keepalive lines.
                }
            }
        }
    }
    return acc
}
