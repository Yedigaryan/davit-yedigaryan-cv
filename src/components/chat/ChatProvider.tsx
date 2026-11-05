'use client'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react'
import { type ChatMessage, type LlmChatApiConfig } from '@/lib/llm-chat'
import { sendChatWithFallback } from '@/lib/llm-chat-fallback'
import type { LlmChatProps } from '@/components/LlmChat'
import { collapseHistory, parseStoredHistory } from './history'

export interface ChatApi {
    /** True once the stored history has been read (client only). */
    hydrated: boolean
    configured: boolean
    messages: ChatMessage[]
    loading: boolean
    error: string | null
    isOffline: boolean
    welcomeMessage?: string
    telegramUrl?: string
    telegramFallbackUrl?: string
    /** False, with no side effects, when empty, in flight or unconfigured (the last also sets the error). */
    send(text: string): boolean
    cancel(): void
    reset(): void
    paneMounted: boolean
    registerPane(): () => void
    acquireProbe(): () => void
}

type ChatProviderProps = Omit<
    LlmChatProps,
    'title' | 'subtitle' | 'placeholder' | 'position' | 'defaultOpen'
> & { children: ReactNode }

const ChatContext = createContext<ChatApi | null>(null)

export function useChat(): ChatApi {
    const ctx = useContext(ChatContext)
    if (!ctx) throw new Error('useChat must be used inside <ChatProvider>')
    return ctx
}

const newId = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2)

const resolveConfig = (props: ChatProviderProps): LlmChatApiConfig | null => {
    const apiUrl = props.apiUrl ?? process.env.NEXT_PUBLIC_CHAT_API_URL
    if (!apiUrl) return null
    return {
        apiUrl,
        apiKey: props.apiKey ?? process.env.NEXT_PUBLIC_CHAT_API_KEY,
        model: props.model ?? process.env.NEXT_PUBLIC_CHAT_MODEL,
        systemPrompt: props.systemPrompt,
        streaming: props.streaming ?? process.env.NEXT_PUBLIC_CHAT_STREAMING === 'true',
        headers: props.headers,
        buildRequestBody: props.buildRequestBody,
        parseResponse: props.parseResponse,
        parseStreamChunk: props.parseStreamChunk,
    }
}

// Fallback backend (Claude via subscription-mode CLI wrapper). Reuses
// the same auth token + streaming settings by default; only apiUrl and
// model are separately configurable. Returns null when the fallback URL
// isn't set - the widget then behaves as a single-backend one.
const resolveFallbackConfig = (primary: LlmChatApiConfig | null): LlmChatApiConfig | null => {
    const apiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL_FALLBACK
    if (!apiUrl || !primary) return null
    return {
        ...primary,
        apiUrl,
        model: process.env.NEXT_PUBLIC_CHAT_MODEL_FALLBACK ?? primary.model,
    }
}

/**
 * Single owner of the conversation (spec 008 Req 7): one in-memory copy,
 * one localStorage key, one in-flight request. It lives in the root
 * layout, so it survives client-side navigation and a streaming answer
 * keeps streaming into whichever view is shown. Renders children only.
 */
export function ChatProvider(props: ChatProviderProps) {
    const {
        children,
        welcomeMessage,
        persist = true,
        storageKey = 'llm-chat-history',
        telegramUrl,
        telegramFallbackUrl = process.env.NEXT_PUBLIC_TELEGRAM_FALLBACK_URL,
    } = props

    // Memoise on the actual values we read from props, NOT on `props` itself
    // (which is a new object identity on every parent render and would force
    // useMemo to recompute, cascading into a new `send` callback every render).
    const config = useMemo(
        () => resolveConfig(props),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            props.apiUrl,
            props.apiKey,
            props.model,
            props.systemPrompt,
            props.streaming,
            props.headers,
            props.buildRequestBody,
            props.parseResponse,
            props.parseStreamChunk,
        ],
    )
    // Fallback config is a pure derivation of primary, so it stays in sync.
    const fallbackConfig = useMemo(() => resolveFallbackConfig(config), [config])
    const fallbackTimeoutMs = Number(process.env.NEXT_PUBLIC_CHAT_FALLBACK_TIMEOUT_MS ?? '12000') || 12000

    const [hydrated, setHydrated] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    // Offline detection: flips to true after either (a) two consecutive
    // health-probe failures, or (b) a chat send that fails with a
    // network/5xx error. First probe failure is silent so Render
    // cold-starts don't flash the fallback UI for no reason.
    const [isOffline, setIsOffline] = useState(false)
    const [probeHolders, setProbeHolders] = useState(0)
    const [paneMounted, setPaneMounted] = useState(false)
    const probeFailuresRef = useRef(0)
    const abortRef = useRef<AbortController | null>(null)

    // The save effect below waits for `hydrated`, which is set in the same
    // batch as the loaded messages, so an empty or stale copy can never
    // overwrite stored history.
    useEffect(() => {
        setHydrated(true)
        if (!persist) return
        try {
            const stored = parseStoredHistory(window.localStorage.getItem(storageKey))
            if (stored.length > 0) setMessages(stored)
        } catch {
            // storage unavailable
        }
    }, [persist, storageKey])

    useEffect(() => {
        if (!persist || !hydrated) return
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(messages))
        } catch {
            // quota or unavailable storage
        }
    }, [messages, persist, storageKey, hydrated])

    // Provider-level, so navigation never aborts an answer that is streaming.
    useEffect(() => {
        return () => abortRef.current?.abort()
    }, [])

    // Health probe - runs while at least one view holds it (the open panel).
    // Sends a preflight OPTIONS to the chat URL with a 3s timeout. Exercises the
    // same DNS+Render+Caddy path as a real send and trips Caddy's
    // explicit preflight handler (cheap 204). First failure is silent;
    // second consecutive failure flips `isOffline`. A success resets the
    // counter and clears the offline flag.
    const probing = probeHolders > 0
    useEffect(() => {
        if (!probing || !config) return
        let cancelled = false

        const probeOne = async (url: string) => {
            const ctrl = new AbortController()
            const timer = window.setTimeout(() => ctrl.abort(), 3000)
            try {
                await fetch(url, { method: 'OPTIONS', signal: ctrl.signal })
                return true
            } catch {
                return false
            } finally {
                window.clearTimeout(timer)
            }
        }

        const probe = async () => {
            // With a fallback backend configured, we're offline only if
            // BOTH probes fail - Claude alone can carry the conversation.
            const urls = fallbackConfig
                ? [config.apiUrl, fallbackConfig.apiUrl]
                : [config.apiUrl]
            const results = await Promise.all(urls.map(probeOne))
            if (cancelled) return
            const anyUp = results.some(Boolean)
            if (anyUp) {
                probeFailuresRef.current = 0
                setIsOffline(false)
            } else {
                probeFailuresRef.current += 1
                if (probeFailuresRef.current >= 2) setIsOffline(true)
            }
        }

        void probe()
        const id = window.setInterval(probe, 30000)
        return () => {
            cancelled = true
            window.clearInterval(id)
        }
    }, [probing, config, fallbackConfig])

    const acquireProbe = useCallback(() => {
        setProbeHolders((n) => n + 1)
        let released = false
        return () => {
            if (released) return
            released = true
            setProbeHolders((n) => n - 1)
        }
    }, [])

    const registerPane = useCallback(() => {
        setPaneMounted(true)
        return () => setPaneMounted(false)
    }, [])

    const send = useCallback(
        (rawText: string): boolean => {
            const text = rawText.trim()
            if (!text || loading) return false
            if (!config) {
                setError('Chat is not configured. Set NEXT_PUBLIC_CHAT_API_URL or pass apiUrl prop.')
                return false
            }

            const userMsg: ChatMessage = {
                id: newId(),
                role: 'user',
                content: text,
                createdAt: Date.now(),
            }
            const assistantId = newId()
            const placeholderMsg: ChatMessage = {
                id: assistantId,
                role: 'assistant',
                content: '',
                createdAt: Date.now(),
            }

            const nextHistory = [...messages, userMsg]
            setMessages([...nextHistory, placeholderMsg])
            setLoading(true)
            setError(null)

            const controller = new AbortController()
            abortRef.current?.abort()
            abortRef.current = controller

            void (async () => {
                try {
                    const final = await sendChatWithFallback(nextHistory, config, fallbackConfig, {
                        signal: controller.signal,
                        timeoutMs: fallbackTimeoutMs,
                        onDelta: (delta) => {
                            setMessages((prev) =>
                                prev.map((m) =>
                                    m.id === assistantId ? { ...m, content: m.content + delta } : m,
                                ),
                            )
                        },
                    })
                    // A successful send - via primary or the silent Claude
                    // fallback - means the widget is healthy. Reset any offline
                    // flag the probe or a prior failure may have set.
                    setIsOffline(false)
                    probeFailuresRef.current = 0
                    // Two-exchange sliding context window (collapseHistory).
                    // System-prompt injection happens in sendChat outside of
                    // this state, so it's never affected.
                    setMessages((prev) =>
                        collapseHistory(
                            prev.map((m) =>
                                m.id === assistantId ? { ...m, content: final || m.content } : m,
                            ),
                        ),
                    )
                } catch (err) {
                    if ((err as Error).name === 'AbortError') return
                    const msg = err instanceof Error ? err.message : 'Something went wrong'
                    // Treat fetch-network failures and gateway 5xx as "offline"
                    // - sendChat throws `Chat API error <status>: ...` for non-OK
                    // responses and `TypeError: Failed to fetch` for transport
                    // failures. 4xx (auth, validation) is NOT offline; surface as
                    // a normal error.
                    const offlineLike =
                        /failed to fetch|networkerror|load failed/i.test(msg) ||
                        /chat api error 5\d\d/i.test(msg)
                    if (offlineLike) {
                        setIsOffline(true)
                        setError(null)
                    } else {
                        setError(msg)
                    }
                    setMessages((prev) => prev.filter((m) => m.id !== assistantId))
                } finally {
                    setLoading(false)
                    abortRef.current = null
                }
            })()
            return true
        },
        [config, fallbackConfig, fallbackTimeoutMs, loading, messages],
    )

    const reset = useCallback(() => {
        abortRef.current?.abort()
        setMessages([])
        setError(null)
        setLoading(false)
    }, [])

    const cancel = useCallback(() => {
        abortRef.current?.abort()
        abortRef.current = null
        setLoading(false)
    }, [])

    const api = useMemo<ChatApi>(
        () => ({
            hydrated,
            configured: config !== null,
            messages,
            loading,
            error,
            isOffline,
            welcomeMessage,
            telegramUrl,
            telegramFallbackUrl,
            send,
            cancel,
            reset,
            paneMounted,
            registerPane,
            acquireProbe,
        }),
        [
            hydrated,
            config,
            messages,
            loading,
            error,
            isOffline,
            welcomeMessage,
            telegramUrl,
            telegramFallbackUrl,
            send,
            cancel,
            reset,
            paneMounted,
            registerPane,
            acquireProbe,
        ],
    )

    return <ChatContext.Provider value={api}>{children}</ChatContext.Provider>
}
