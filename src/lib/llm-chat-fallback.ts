import { sendChat, type ChatMessage, type LlmChatApiConfig, type SendOptions } from './llm-chat'

export interface FallbackOptions extends SendOptions {
    /**
     * Milliseconds to wait for the FIRST assistant byte from the primary
     * backend before giving up and retrying against the fallback. Only
     * counts to-first-byte; once streaming has begun we let it finish
     * even if generation takes longer.
     * Defaults to 12 000 ms.
     */
    timeoutMs?: number
}

/**
 * Combine two AbortSignals into one that aborts when either does.
 * Uses AbortSignal.any if the runtime has it (modern browsers + Node 20+),
 * else falls back to a manual controller.
 */
function combineSignals(a: AbortSignal | undefined, b: AbortSignal): AbortSignal {
    if (!a) return b
    // Prefer native AbortSignal.any when available.
    const anyFn = (AbortSignal as unknown as { any?: (signals: AbortSignal[]) => AbortSignal }).any
    if (typeof anyFn === 'function') return anyFn([a, b])

    const ctrl = new AbortController()
    if (a.aborted) ctrl.abort((a as AbortSignal & { reason?: unknown }).reason)
    else a.addEventListener('abort', () => ctrl.abort((a as AbortSignal & { reason?: unknown }).reason))
    if (b.aborted) ctrl.abort((b as AbortSignal & { reason?: unknown }).reason)
    else b.addEventListener('abort', () => ctrl.abort((b as AbortSignal & { reason?: unknown }).reason))
    return ctrl.signal
}

/**
 * Send a chat request against `primary`, falling back to `fallback` if
 * primary fails or produces no bytes within `timeoutMs`. The fallback
 * is silent — the caller sees a single answer and cannot tell which
 * backend produced it.
 *
 * Fallback fires only BEFORE the first byte arrives. Once primary has
 * started streaming, we commit to it: a mid-stream failure surfaces as
 * a normal error rather than restarting the response.
 */
export async function sendChatWithFallback(
    history: ChatMessage[],
    primary: LlmChatApiConfig,
    fallback: LlmChatApiConfig | null,
    opts: FallbackOptions = {},
): Promise<string> {
    // No fallback configured — behave exactly like sendChat.
    if (!fallback) return sendChat(history, primary, opts)

    const timeoutMs = opts.timeoutMs ?? 12_000
    const timeoutCtrl = new AbortController()
    let firstByte = false

    const primarySignal = combineSignals(opts.signal, timeoutCtrl.signal)
    const timer = setTimeout(() => {
        if (!firstByte) timeoutCtrl.abort(new Error('primary_first_byte_timeout'))
    }, timeoutMs)

    try {
        return await sendChat(history, primary, {
            signal: primarySignal,
            onDelta: (delta) => {
                firstByte = true
                opts.onDelta?.(delta)
            },
        })
    } catch (err) {
        // User cancelled — propagate, do NOT fall back.
        if (opts.signal?.aborted) throw err
        // Mid-stream failure after first byte — the caller already has
        // partial content in the UI; restarting with a different backend
        // would double-render. Surface as normal error.
        if (firstByte) throw err
        // Primary failed cleanly before any bytes — retry with fallback.
        return await sendChat(history, fallback, {
            signal: opts.signal,
            onDelta: opts.onDelta,
        })
    } finally {
        clearTimeout(timer)
    }
}
