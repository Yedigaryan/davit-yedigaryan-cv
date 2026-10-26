'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { FaPaperPlane, FaTelegramPlane, FaTimes, FaTrash } from 'react-icons/fa'
import { type LlmChatApiConfig } from '@/lib/llm-chat'
import { trackEvent } from '@/lib/analytics'
import { useChat } from '@/components/chat/ChatProvider'
import { MessageBubble, OfflineFallbackCard } from '@/components/chat/parts'

export interface LlmChatProps extends Partial<LlmChatApiConfig> {
    title?: string
    subtitle?: string
    welcomeMessage?: string
    placeholder?: string
    position?: 'bottom-right' | 'bottom-left'
    /** Persist the conversation in browser storage (owned by ChatProvider). */
    persist?: boolean
    storageKey?: string
    /** Optional Telegram link shown in the chat header as a human-fallback. */
    telegramUrl?: string
    /** Default open state - useful when embedding without a launcher. */
    defaultOpen?: boolean
    /**
     * URL of the Cloudflare Worker that relays fallback messages to a
     * private Telegram group when the primary chat backend is offline.
     * Defaults to `process.env.NEXT_PUBLIC_TELEGRAM_FALLBACK_URL`.
     * If unset, the fallback card still renders but only shows the
     * Telegram deep-link button (no inline form).
     */
    telegramFallbackUrl?: string
}

export default function LlmChat(
    props: Pick<LlmChatProps, 'title' | 'subtitle' | 'placeholder' | 'position' | 'defaultOpen'>,
) {
    const {
        title = 'Chat with us',
        subtitle,
        placeholder = 'Type your message…',
        position = 'bottom-right',
        defaultOpen = false,
    } = props

    const {
        messages,
        loading,
        error,
        isOffline,
        configured,
        welcomeMessage,
        telegramUrl,
        telegramFallbackUrl,
        send,
        cancel,
        reset,
        hydrated,
        paneMounted,
        acquireProbe,
    } = useChat()
    const pathname = usePathname()
    const reduceMotion = useReducedMotion()
    const headingId = useId()

    const [open, setOpen] = useState(defaultOpen)
    const [input, setInput] = useState('')
    // Inline `style` applied to the chat panel only on mobile (<640px).
    // Tracks `window.visualViewport` so the panel reflows when the soft
    // keyboard opens / the address bar shows-hides. Empty object on
    // desktop so the `sm:` Tailwind classes win.
    const [mobilePanelStyle, setMobilePanelStyle] = useState<React.CSSProperties>({})

    const listRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLTextAreaElement | null>(null)
    const launcherRef = useRef<HTMLButtonElement | null>(null)
    const wasOpen = useRef(false)

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
    // Focus returns to the launcher only on the open-to-closed transition,
    // never on mount (spec 008 Req 10). When the pane closes the panel
    // (`paneMounted`), the pill is already unmounted, so the ref is null
    // and nothing is focused.
    useEffect(() => {
        if (wasOpen.current && !open) launcherRef.current?.focus()
        wasOpen.current = open
    }, [open])

    // The panel never coexists with the Fig. 2 pane (spec 008 Req 5).
    useEffect(() => {
        if (paneMounted) setOpen(false)
    }, [paneMounted])

    // Health probe: held while the panel is open.
    useEffect(() => {
        if (!open) return
        return acquireProbe()
    }, [open, acquireProbe])

    // Mobile-only: track the visual viewport so the panel resizes when
    // the soft keyboard opens or the browser chrome toggles. Without
    // this, an `inset-0` panel keeps its full-viewport height even
    // when half of it is now covered by the keyboard, hiding the input.
    useEffect(() => {
        if (!open) return
        if (typeof window === 'undefined') return
        const vv = window.visualViewport
        if (!vv) return
        const isMobile = window.matchMedia('(max-width: 639.98px)').matches
        if (!isMobile) {
            setMobilePanelStyle({})
            return
        }
        const update = () => {
            setMobilePanelStyle({
                height: `${vv.height}px`,
                // Follow the viewport's vertical offset so iOS doesn't
                // scroll a focused input out from under the keyboard.
                top: `${vv.offsetTop}px`,
            })
        }
        update()
        vv.addEventListener('resize', update)
        vv.addEventListener('scroll', update)
        return () => {
            vv.removeEventListener('resize', update)
            vv.removeEventListener('scroll', update)
        }
    }, [open])

    const submit = () => {
        const text = input.trim()
        if (send(text)) setInput('')
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
        }
    }

    // No pill on `/` (the Fig. 2 pane is the launcher there). Before
    // hydration the route decides, so `out/index.html` carries no pill;
    // afterwards `paneMounted` does (spec 008 Req 5, 6).
    const showPill = !(paneMounted || (!hydrated && pathname === '/'))

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
            {showPill && (
                <button
                    ref={launcherRef}
                    type="button"
                    onClick={() => {
                        setOpen(true)
                        trackEvent('chat_open')
                    }}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    className={`fixed bottom-4 sm:bottom-6 ${launcherPositionClass} z-50 flex min-h-[52px] items-center gap-2 rounded-[var(--r-4)] border border-[var(--term-line)] bg-[var(--term)] px-4 font-mono text-[length:var(--fs-m3)] ${
                        open ? 'pointer-events-none opacity-0' : 'opacity-100'
                    }`}
                >
                    <span className="text-primary" aria-hidden="true">
                        &gt;
                    </span>
                    <span className="text-[var(--term-ink)]">have a question? ask me</span>
                    <span className="block h-[15px] w-[8px] bg-primary" aria-hidden="true" />
                </button>
            )}

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="chat-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={headingId}
                        {...panelMotion}
                        // Inline `style` (mobilePanelStyle) is empty on
                        // desktop and carries `{ height, top }` from
                        // visualViewport on mobile. The `sm:` classes
                        // explicitly override the mobile baseline so the
                        // pop-out card behaviour wins on >=640px.
                        style={mobilePanelStyle}
                        className={`fixed z-50 flex flex-col bg-card border border-border shadow-2xl
                            top-0 left-0 right-0 h-[100dvh]
                            sm:inset-auto sm:top-auto sm:bottom-6 ${panelPositionClass}
                            sm:h-[640px] sm:max-h-[calc(100vh-3rem)] sm:w-[400px] sm:rounded-2xl
                            overflow-hidden`}
                    >
                        <header
                            className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3"
                            style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
                        >
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
                            {error && !isOffline && (
                                <div
                                    role="alert"
                                    className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                                >
                                    {error}
                                </div>
                            )}
                            {isOffline && (
                                <OfflineFallbackCard
                                    telegramUrl={telegramUrl}
                                    fallbackUrl={telegramFallbackUrl}
                                />
                            )}
                            {!configured && (
                                <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                                    Set <code className="font-mono">NEXT_PUBLIC_CHAT_API_URL</code> to point this widget at a backend (Render, Vercel, etc.).
                                </div>
                            )}
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                submit()
                            }}
                            className={`border-t border-border bg-card px-3 py-3 ${isOffline ? 'hidden' : ''}`}
                            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
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
                                        disabled={!input.trim() || !configured}
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
