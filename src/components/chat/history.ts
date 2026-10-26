import type { ChatMessage } from '@/lib/llm-chat'

const ROLES = new Set(['user', 'assistant', 'system'])

function isChatMessage(value: unknown): value is ChatMessage {
    if (typeof value !== 'object' || value === null) return false
    const m = value as Record<string, unknown>
    return (
        typeof m.id === 'string' &&
        typeof m.content === 'string' &&
        typeof m.role === 'string' &&
        ROLES.has(m.role)
    )
}

export function parseStoredHistory(raw: string | null): ChatMessage[] {
    if (!raw) return []
    try {
        const parsed: unknown = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed.filter(isChatMessage) : []
    } catch {
        return []
    }
}

// Two-exchange sliding window (spec 001 Req 14): after every even-numbered
// completed exchange keep only the latest Q&A pair.
export function collapseHistory(messages: ChatMessage[]): ChatMessage[] {
    const exchanges = Math.floor(messages.length / 2)
    if (exchanges > 0 && exchanges % 2 === 0) {
        return messages.slice(-2)
    }
    return messages
}

// An empty assistant row is only shown while it is the streaming reply
// (the typing dots); once the request settles it is dropped.
export function visibleMessages(messages: ChatMessage[], loading: boolean): ChatMessage[] {
    return messages.filter((m, i) => {
        if (m.role !== 'assistant' || m.content !== '') return true
        return loading && i === messages.length - 1
    })
}
