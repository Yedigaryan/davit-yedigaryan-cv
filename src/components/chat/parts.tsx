'use client'

import { useState } from 'react'
import { FaPaperPlane, FaTelegramPlane } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { trackEvent } from '@/lib/analytics'

/**
 * Tailwind-styled component map for `react-markdown`. Declared at
 * module scope so React doesn't recreate the object identity on
 * every render of every bubble.
 *
 * Headings are deliberately rendered AS paragraphs with bold weight -
 * a chat bubble shouldn't ever sport a 36px H1, the Markdown semantic
 * is "this line is a header" not "use display typography".
 */
export const markdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => (
        <ul className="mb-2 last:mb-0 list-disc list-inside space-y-0.5">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="mb-2 last:mb-0 list-decimal list-inside space-y-0.5">{children}</ol>
    ),
    li: ({ children }) => <li className="my-0">{children}</li>,
    code: ({ className, children }) => {
        const isFenced = !!className?.startsWith('language-')
        return isFenced ? (
            <code
                className={`block overflow-x-auto rounded bg-black/20 dark:bg-white/10 p-2 text-xs font-mono ${className ?? ''}`}
            >
                {children}
            </code>
        ) : (
            <code className="rounded bg-black/15 dark:bg-white/15 px-1 py-0.5 text-[0.85em] font-mono">
                {children}
            </code>
        )
    },
    pre: ({ children }) => <pre className="mb-2 last:mb-0">{children}</pre>,
    a: ({ children, href }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80"
        >
            {children}
        </a>
    ),
    h1: ({ children }) => <p className="mt-1 mb-1 font-semibold">{children}</p>,
    h2: ({ children }) => <p className="mt-1 mb-1 font-semibold">{children}</p>,
    h3: ({ children }) => <p className="mt-1 mb-1 font-semibold">{children}</p>,
    h4: ({ children }) => <p className="mt-1 mb-1 font-semibold">{children}</p>,
    h5: ({ children }) => <p className="mt-1 mb-1 font-semibold">{children}</p>,
    h6: ({ children }) => <p className="mt-1 mb-1 font-semibold">{children}</p>,
    blockquote: ({ children }) => (
        <blockquote className="my-2 border-l-2 border-current/30 pl-3 italic opacity-90">
            {children}
        </blockquote>
    ),
    hr: () => <hr className="my-3 border-current/20" />,
    table: ({ children }) => (
        <div className="overflow-x-auto">
            <table className="my-2 w-full border-collapse text-xs">{children}</table>
        </div>
    ),
    th: ({ children }) => (
        <th className="border border-current/20 bg-current/5 px-2 py-1 text-left font-semibold">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="border border-current/20 px-2 py-1">{children}</td>
    ),
    img: () => null, // disallow inline images in chat bubbles
}

const markdownPlugins = [remarkGfm]

export function MessageBubble({
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
                className={`max-w-[85%] break-words rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
                    isUser
                        ? 'rounded-br-sm bg-primary text-primary-foreground'
                        : 'rounded-bl-sm bg-card text-card-foreground border border-border'
                }`}
            >
                {pending ? (
                    <TypingDots />
                ) : (
                    <ReactMarkdown remarkPlugins={markdownPlugins} components={markdownComponents}>
                        {content}
                    </ReactMarkdown>
                )}
            </div>
        </div>
    )
}

/**
 * Rendered inside the chat panel when the primary LLM backend is
 * unreachable. Shows a friendly message, a Telegram deep-link button,
 * and (if `fallbackUrl` is configured) an inline form that POSTs to the
 * Cloudflare Worker which relays the message to a private Telegram
 * group. Mirrors the Worker's input limits (4000 / 200 chars).
 */
export function OfflineFallbackCard({
    telegramUrl,
    fallbackUrl,
    className,
}: {
    telegramUrl?: string
    fallbackUrl?: string
    /** Replaces the default surface class (`bg-muted/40`). */
    className?: string
}) {
    const [message, setMessage] = useState('')
    const [contact, setContact] = useState('')
    const [sending, setSending] = useState(false)
    const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!fallbackUrl || !message.trim() || sending) return
        setSending(true)
        setErrorMsg(null)
        try {
            const res = await fetch(fallbackUrl, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    message: message.trim().slice(0, 4000),
                    contact: contact.trim().slice(0, 200),
                    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                }),
            })
            if (!res.ok) throw new Error(`relay returned ${res.status}`)
            setStatus('sent')
            setMessage('')
            setContact('')
            trackEvent('chat_offline_fallback_sent')
        } catch (err) {
            setStatus('error')
            setErrorMsg(err instanceof Error ? err.message : 'Send failed')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className={`rounded-lg border border-border ${className ?? 'bg-muted/40'} p-4 space-y-3`}>
            <div className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <div className="text-sm text-foreground">
                    <p className="font-medium">The assistant is offline right now.</p>
                    <p className="mt-1 text-muted-foreground">
                        It runs on Davit&apos;s laptop and may be sleeping. You can
                        ping him directly on Telegram, or leave a message below
                        and he&apos;ll get it next time he&apos;s online.
                    </p>
                </div>
            </div>

            {telegramUrl && (
                <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('chat_offline_telegram_click')}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#229ED9] px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition"
                >
                    <FaTelegramPlane className="h-4 w-4" aria-hidden="true" />
                    Message David on Telegram
                </a>
            )}

            {fallbackUrl && status !== 'sent' && (
                <form onSubmit={submit} className="space-y-2 pt-1">
                    <div className="text-xs font-medium text-muted-foreground">
                        …or leave a message here
                    </div>
                    <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="What would you like to ask?"
                        maxLength={4000}
                        required
                        disabled={sending}
                        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                    <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Your email or Telegram (optional, so he can reply)"
                        maxLength={200}
                        disabled={sending}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim() || sending}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                    >
                        <FaPaperPlane className="h-3.5 w-3.5" aria-hidden="true" />
                        {sending ? 'Sending…' : 'Send to Davit'}
                    </button>
                    {status === 'error' && (
                        <p role="alert" className="text-xs text-destructive">
                            Couldn&apos;t deliver the message{errorMsg ? ` (${errorMsg})` : ''}.
                            Please use the Telegram button above.
                        </p>
                    )}
                </form>
            )}

            {status === 'sent' && (
                <p className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
                    Thanks — your message is on its way to Davit&apos;s Telegram.
                </p>
            )}

            {!fallbackUrl && !telegramUrl && (
                <p className="text-xs text-muted-foreground">
                    No fallback channel is configured. Try again in a moment.
                </p>
            )}
        </div>
    )
}

export function TypingDots({ animated = true }: { animated?: boolean }) {
    const bounce = animated ? 'animate-bounce ' : ''
    return (
        <span className="inline-flex items-center gap-1" aria-label="Assistant is typing">
            <span className={`h-1.5 w-1.5 ${bounce}rounded-full bg-current opacity-60 [animation-delay:-0.3s]`} />
            <span className={`h-1.5 w-1.5 ${bounce}rounded-full bg-current opacity-60 [animation-delay:-0.15s]`} />
            <span className={`h-1.5 w-1.5 ${bounce}rounded-full bg-current opacity-60`} />
        </span>
    )
}
