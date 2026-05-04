'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { FaCommentDots, FaPaperPlane, FaTelegramPlane, FaTimes, FaTrash } from 'react-icons/fa'
import { sendChat, type ChatMessage, type LlmChatApiConfig } from '@/lib/llm-chat'

export interface LlmChatProps extends Partial<LlmChatApiConfig> {
    title?: string
    subtitle?: string
    welcomeMessage?: string
    placeholder?: string
    position?: 'bottom-right' | 'bottom-left'
    /** Persist conversation in localStorage. */
    persist?: boolean
    storageKey?: string
    /** Optional Telegram link shown in the chat header as a human-fallback. */
    telegramUrl?: string
    /** Default open state — useful when embedding without a launcher. */
    defaultOpen?: boolean
}

const newId = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2)

const resolveConfig = (props: LlmChatProps): LlmChatApiConfig | null => {
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

export default function LlmChat(props: LlmChatProps) {
    const {
        title = 'Chat with us',
        subtitle,
        welcomeMessage,
        placeholder = 'Type your message…',
        position = 'bottom-right',
        persist = true,
        storageKey = 'llm-chat-history',
        telegramUrl,
        defaultOpen = false,
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
    const reduceMotion = useReducedMotion()
    const headingId = useId()

    const [open, setOpen] = useState(defaultOpen)
    const [mounted, setMounted] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const abortRef = useRef<AbortController | null>(null)
    const listRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLTextAreaElement | null>(null)
    const launcherRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        setMounted(true)
        if (!persist) return
        try {
            const raw = window.localStorage.getItem(storageKey)
            if (raw) setMessages(JSON.parse(raw) as ChatMessage[])
        } catch {
            // ignore corrupted history
        }
    }, [persist, storageKey])

    useEffect(() => {
        if (!persist || !mounted) return
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(messages))
        } catch {
            // quota or unavailable storage
        }
    }, [messages, persist, storageKey, mounted])

    useEffect(() => {
        if (!open) return
        const node = listRef.current
        if (node) node.scrollTop = node.scrollHeight
    }, [messages, open, loading])

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation()
                setOpen(false)
            }
        }
        window.addEventListener('keydown', onKey)
        const t = window.setTimeout(() => inputRef.current?.focus(), 50)
        return () => {
            window.removeEventListener('keydown', onKey)
            window.clearTimeout(t)
        }
    }, [open])

    useEffect(() => {
        if (!open) launcherRef.current?.focus()
    }, [open])

    useEffect(() => {
        return () => abortRef.current?.abort()
    }, [])

    const send = useCallback(async () => {
        const text = input.trim()
        if (!text || loading) return
        if (!config) {
            setError('Chat is not configured. Set NEXT_PUBLIC_CHAT_API_URL or pass apiUrl prop.')
            return
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
        setInput('')
        setLoading(true)
        setError(null)

        const controller = new AbortController()
        abortRef.current?.abort()
        abortRef.current = controller

        try {
            const final = await sendChat(nextHistory, config, {
                signal: controller.signal,
                onDelta: (delta) => {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantId ? { ...m, content: m.content + delta } : m,
                        ),
                    )
                },
            })
            setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: final || m.content } : m)),
            )
        } catch (err) {
            if ((err as Error).name === 'AbortError') return
            const msg = err instanceof Error ? err.message : 'Something went wrong'
            setError(msg)
            setMessages((prev) => prev.filter((m) => m.id !== assistantId))
        } finally {
            setLoading(false)
            abortRef.current = null
        }
    }, [config, input, loading, messages])

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            void send()
        }
    }

    const reset = () => {
        abortRef.current?.abort()
        setMessages([])
        setError(null)
        setLoading(false)
    }

    const cancel = () => {
        abortRef.current?.abort()
        abortRef.current = null
        setLoading(false)
    }

    const launcherPositionClass =
        position === 'bottom-right' ? 'right-4 sm:right-6' : 'left-4 sm:left-6'
    const panelPositionClass =
        position === 'bottom-right' ? 'sm:right-6' : 'sm:left-6'

    const panelMotion = reduceMotion
        ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : {
              initial: { opacity: 0, y: 16, scale: 0.98 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: 16, scale: 0.98 },
              transition: { type: 'spring' as const, stiffness: 320, damping: 28 },
          }

    return (
        <>
            <motion.button
                ref={launcherRef}
                type="button"
                onClick={() => setOpen(true)}
                initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                aria-label="Open chat"
                aria-haspopup="dialog"
                aria-expanded={open}
                className={`fixed bottom-4 sm:bottom-6 ${launcherPositionClass} z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-shadow hover:shadow-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/40 ${
                    open ? 'pointer-events-none opacity-0' : 'opacity-100'
                }`}
            >
                <FaCommentDots className="h-6 w-6" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-primary border-2 border-background" />
                </span>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="chat-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={headingId}
                        {...panelMotion}
                        className={`fixed z-50 flex flex-col bg-card border border-border shadow-2xl
                            inset-0 sm:inset-auto sm:bottom-6 ${panelPositionClass}
                            sm:h-[640px] sm:max-h-[calc(100vh-3rem)] sm:w-[400px] sm:rounded-2xl
                            overflow-hidden`}
                    >
                        <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
                            <div className="min-w-0">
                                <h2 id={headingId} className="text-base font-semibold text-card-foreground truncate">
                                    {title}
                                </h2>
                                {subtitle && (
                                    <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                {telegramUrl && (
                                    <a
                                        href={telegramUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Chat on Telegram instead"
                                        title="Chat on Telegram instead"
                                        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                                    >
                                        <FaTelegramPlane className="h-4 w-4" aria-hidden="true" />
                                    </a>
                                )}
                                {messages.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={reset}
                                        aria-label="Clear conversation"
                                        title="Clear conversation"
                                        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                                    >
                                        <FaTrash className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    aria-label="Close chat"
                                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    <FaTimes className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </div>
                        </header>

                        <div
                            ref={listRef}
                            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background"
                            aria-live="polite"
                            aria-busy={loading}
                        >
                            {messages.length === 0 && welcomeMessage && (
                                <MessageBubble role="assistant" content={welcomeMessage} />
                            )}
                            {messages.map((m) => (
                                <MessageBubble
                                    key={m.id}
                                    role={m.role}
                                    content={m.content}
                                    pending={loading && m.role === 'assistant' && m.content === ''}
                                />
                            ))}
                            {error && (
                                <div
                                    role="alert"
                                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                                >
                                    {error}
                                </div>
                            )}
                            {!config && (
                                <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                                    Set <code className="font-mono">NEXT_PUBLIC_CHAT_API_URL</code> to point this widget at a backend (Render, Vercel, etc.).
                                </div>
                            )}
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                void send()
                            }}
                            className="border-t border-border bg-card px-3 py-3"
                        >
                            <div className="flex items-end gap-2">
                                <label htmlFor="llm-chat-input" className="sr-only">
                                    Message
                                </label>
                                <textarea
                                    id="llm-chat-input"
                                    ref={inputRef}
                                    rows={1}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    placeholder={placeholder}
                                    disabled={loading}
                                    className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 max-h-32"
                                />
                                {loading ? (
                                    <button
                                        type="button"
                                        onClick={cancel}
                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground hover:bg-muted/70 transition"
                                        aria-label="Stop response"
                                        title="Stop response"
                                    >
                                        <span className="block h-3 w-3 rounded-sm bg-current" aria-hidden="true" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || !config}
                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                                        aria-label="Send message"
                                    >
                                        <FaPaperPlane className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                            <p className="mt-1 px-1 text-[10px] text-muted-foreground">
                                Press Enter to send · Shift+Enter for newline
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

function MessageBubble({
    role,
    content,
    pending,
}: {
    role: 'user' | 'assistant' | 'system'
    content: string
    pending?: boolean
}) {
    if (role === 'system') return null
    const isUser = role === 'user'
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
                    isUser
                        ? 'rounded-br-sm bg-primary text-primary-foreground'
                        : 'rounded-bl-sm bg-card text-card-foreground border border-border'
                }`}
            >
                {pending ? <TypingDots /> : content}
            </div>
        </div>
    )
}

function TypingDots() {
    return (
        <span className="inline-flex items-center gap-1" aria-label="Assistant is typing">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-60 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-60 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current opacity-60" />
        </span>
    )
}
