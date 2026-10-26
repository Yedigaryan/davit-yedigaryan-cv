'use client'

import { useEffect, useId, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { trackEvent } from '@/lib/analytics'
import { captionClass } from '@/components/home/HomeSection'
import { useChat } from './ChatProvider'
import { visibleMessages } from './history'
import { markdownComponents, OfflineFallbackCard, TypingDots } from './parts'

const PLACEHOLDER = "ask me anything: my experience, what I built, or whether I'm a fit for your team"

const markdownPlugins = [remarkGfm]

// The panel's map with the terminal's surfaces: code sits on --term-line, links are underlined
// amber (the token, not text-primary, which is the ink colour), tables and code blocks scroll inside the row.
const paneMarkdown: typeof markdownComponents = {
    ...markdownComponents,
    code: ({ className, children }) =>
        className?.startsWith('language-') ? (
            <code className={`block overflow-x-auto rounded bg-[var(--term-line)] p-2 text-xs font-mono ${className}`}>
                {children}
            </code>
        ) : (
            <code className="rounded bg-[var(--term-line)] px-1 py-0.5 text-[0.85em] font-mono">{children}</code>
        ),
    pre: ({ children }) => <pre className="mb-2 max-w-full overflow-x-auto last:mb-0">{children}</pre>,
    a: ({ children, href }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--button-primary-bg)] underline underline-offset-2 hover:opacity-80"
        >
            {children}
        </a>
    ),
    table: ({ children }) => (
        <table className="my-2 block max-w-full overflow-x-auto border-collapse text-xs">{children}</table>
    ),
}

/**
 * Fig. 2 (spec 008): the assistant as a terminal pane in the hero. A view over the shared
 * ChatProvider; the floating panel is the other view. Fixed 360px box, the log scrolls inside it.
 */
export default function ChatPane() {
    const {
        hydrated,
        configured,
        messages,
        loading,
        error,
        isOffline,
        welcomeMessage,
        telegramUrl,
        telegramFallbackUrl,
        send,
        cancel,
        registerPane,
        acquireProbe,
    } = useChat()
    const fieldId = useId()
    const [input, setInput] = useState('')
    // Req 9: the first typed character after mount counts as opening the chat and starts the probe.
    const [engaged, setEngaged] = useState(false)
    const logRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => registerPane(), [registerPane])
    useEffect(() => (engaged ? acquireProbe() : undefined), [engaged, acquireProbe])

    useEffect(() => {
        const node = logRef.current
        if (node) node.scrollTop = node.scrollHeight
    }, [messages, loading])

    const rows = visibleMessages(messages, loading)

    const submit = () => {
        if (send(input.trim())) setInput('')
    }

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        setInput(value)
        if (!engaged && value.length > 0) {
            setEngaged(true)
            trackEvent('chat_open')
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
        }
    }

    return (
        <figure id="chat-pane" data-meter-skip className="min-w-0">
            <figcaption className={`${captionClass} mb-3 leading-relaxed text-muted-foreground`}>
                <span className="text-link">Fig. 2</span> Assistant
            </figcaption>
            <div
                id="chat-pane-box"
                className="flex h-[360px] flex-col rounded-[var(--r-4)] border border-[var(--term-line)] bg-[var(--term)] font-mono text-[length:var(--fs-m3)] text-[var(--term-ink)]"
            >
                <div
                    ref={logRef}
                    role="log"
                    tabIndex={0}
                    aria-label="Conversation"
                    aria-live="polite"
                    aria-busy={loading}
                    className="min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden break-words px-[22px] pt-5 pb-4 leading-[1.7] [overflow-wrap:anywhere]"
                >
                    {rows.length === 0 && welcomeMessage && (
                        <div className="grid grid-cols-[24px_minmax(0,1fr)]">
                            <span aria-hidden="true" className="text-[var(--term-muted)]">
                                {'//'}
                            </span>
                            <p className="text-[var(--term-muted)]">{welcomeMessage}</p>
                        </div>
                    )}
                    {rows.map((m) => {
                        const isUser = m.role === 'user'
                        const isSystem = m.role === 'system'
                        const pending = loading && m.role === 'assistant' && m.content === ''
                        return (
                            <div key={m.id} className="grid grid-cols-[24px_minmax(0,1fr)]">
                                <span
                                    aria-hidden="true"
                                    className={isUser ? 'text-[var(--button-primary-bg)]' : isSystem ? 'text-[var(--term-muted)]' : ''}
                                >
                                    {isUser ? '>' : isSystem ? '//' : 'dy'}
                                </span>
                                <div className={`min-w-0 ${isSystem ? 'text-[var(--term-muted)]' : ''}`}>
                                    {!isSystem && <span className="sr-only">{isUser ? 'You' : 'Assistant'}</span>}
                                    {pending ? (
                                        <TypingDots animated={false} />
                                    ) : (
                                        <ReactMarkdown remarkPlugins={markdownPlugins} components={paneMarkdown}>
                                            {m.content}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    {error && !isOffline && (
                        <div role="alert" className="rounded-md bg-card px-3 py-2 text-destructive">
                            {error}
                        </div>
                    )}
                    {isOffline && (
                        <OfflineFallbackCard
                            telegramUrl={telegramUrl}
                            fallbackUrl={telegramFallbackUrl}
                            className="bg-card"
                        />
                    )}
                    {!configured && (
                        <div className="rounded-md bg-card px-3 py-2 text-xs text-card-foreground">
                            Set <code className="font-mono">NEXT_PUBLIC_CHAT_API_URL</code> to point this widget at a backend (Render, Vercel, etc.).
                        </div>
                    )}
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        submit()
                    }}
                    className={`border-t border-[var(--term-line)] px-[22px] py-3 ${isOffline ? 'hidden' : ''}`}
                >
                    <div className="flex items-start gap-3">
                        <span aria-hidden="true" className="pt-[10px] leading-6 text-[var(--button-primary-bg)]">
                            &gt;
                        </span>
                        <label htmlFor={fieldId} className="sr-only">
                            Message
                        </label>
                        {/* The hidden twin sizes the cell to the typed text, or to the placeholder while
                            the field is empty, so a wrapped placeholder is never clipped (Req 15). */}
                        <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)]">
                            <div
                                aria-hidden="true"
                                className="invisible col-start-1 row-start-1 max-h-40 overflow-hidden whitespace-pre-wrap break-words py-[10px] leading-6 [overflow-wrap:anywhere] max-sm:text-[16px]"
                            >
                                {`${input || PLACEHOLDER} `}
                            </div>
                            <textarea
                                id={fieldId}
                                rows={1}
                                value={input}
                                onChange={onChange}
                                onKeyDown={onKeyDown}
                                placeholder={PLACEHOLDER}
                                disabled={!hydrated || loading}
                                className="col-start-1 row-start-1 max-h-40 min-h-[44px] w-full resize-none py-[10px] leading-6 disabled:opacity-60"
                            />
                        </div>
                        {loading ? (
                            <button
                                type="button"
                                onClick={cancel}
                                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--r-3)] border border-[var(--term-ctl)] text-[var(--button-primary-bg)]"
                                aria-label="Stop response"
                                title="Stop response"
                            >
                                <span className="block h-3 w-3 rounded-sm bg-current" aria-hidden="true" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!hydrated || !input.trim() || !configured}
                                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--r-3)] border border-[var(--term-ctl)] text-[var(--button-primary-bg)] disabled:opacity-60"
                                aria-label="Send message"
                            >
                                <span aria-hidden="true">↵</span>
                            </button>
                        )}
                    </div>
                    <p className="mt-2 text-[length:var(--fs-m4)] text-[var(--term-muted)]">
                        Press Enter to send · Shift+Enter for newline
                    </p>
                </form>
            </div>
        </figure>
    )
}
