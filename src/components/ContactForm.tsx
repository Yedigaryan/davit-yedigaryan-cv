'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { FaCheckCircle, FaEnvelope, FaUser, FaTag, FaCommentAlt } from 'react-icons/fa'
import { personalInfo } from '@/lib/data'

/**
 * Static contact-form endpoint.
 *
 * The site ships as a `next export` static build, so this form cannot be
 * served by a Node API route. Instead it POSTs JSON to a third-party
 * form-relay service. Anything that accepts JSON and returns 2xx works:
 * Formspree, FormSubmit (ajax), Web3Forms, Getform, etc.
 *
 * Configure at build time via `NEXT_PUBLIC_CONTACT_ENDPOINT`, e.g.:
 *   NEXT_PUBLIC_CONTACT_ENDPOINT="https://formspree.io/f/xyzabc123"
 *   NEXT_PUBLIC_CONTACT_ENDPOINT="https://formsubmit.co/ajax/[your-email]"
 *
 * If the env var is unset we fall back to FormSubmit's ajax endpoint
 * pointing at the CV owner's email — works without an account, but the
 * first submission triggers a one-time confirmation email FormSubmit sends
 * to that address. Click the link in that email once and all subsequent
 * submissions go straight through.
 */
const CONTACT_ENDPOINT =
    process.env.NEXT_PUBLIC_CONTACT_ENDPOINT?.trim() ||
    `https://formsubmit.co/ajax/${personalInfo.gmail}`

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export default function ContactForm() {
    const [status, setStatus] = useState<FormStatus>('idle')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const data = new FormData(form)

        // Honeypot — real users leave this empty; bots fill every field.
        if (((data.get('website') as string) ?? '').length > 0) {
            // Pretend it worked so the bot doesn't retry against another endpoint.
            setStatus('success')
            form.reset()
            return
        }

        const payload: Record<string, string> = {
            name: (data.get('name') as string) ?? '',
            email: (data.get('email') as string) ?? '',
            subject: (data.get('subject') as string) ?? '',
            message: (data.get('message') as string) ?? '',
            // FormSubmit / Formspree meta:
            _subject: `Portfolio contact — ${personalInfo.name}`,
            _template: 'table',
            _captcha: 'false',
        }

        setStatus('sending')
        setErrorMessage(null)

        try {
            const res = await fetch(CONTACT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                let detail = ''
                try {
                    const j = await res.json()
                    detail = j?.message || j?.error || ''
                } catch {
                    /* non-JSON error body — ignore */
                }
                throw new Error(detail || `HTTP ${res.status}`)
            }

            form.reset()
            setStatus('success')
            // Idle the form again after 6s so a returning visitor can send another message.
            setTimeout(() => setStatus('idle'), 6000)
        } catch (err) {
            console.error('Contact form submission failed:', err)
            setErrorMessage(
                err instanceof Error && err.message
                    ? `Couldn't send your message (${err.message}). Please email me directly at ${personalInfo.email}.`
                    : `Couldn't send your message. Please email me directly at ${personalInfo.email}.`,
            )
            setStatus('error')
        }
    }

    return (
        <AnimatePresence mode="wait">
            {status === 'success' ? (
                <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="py-10 text-center"
                    role="status"
                    aria-live="polite"
                >
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <FaCheckCircle className="h-9 w-9" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Message sent</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Thanks — I&apos;ll get back to you within a day.
                    </p>
                </motion.div>
            ) : (
                <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    method="POST"
                    action={CONTACT_ENDPOINT}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                >
                    {/* Honeypot — invisible to users, irresistible to bots. */}
                    <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="hidden"
                    />

                    {/* FormSubmit-friendly meta — also work with Formspree's `_subject` field. */}
                    <input
                        type="hidden"
                        name="_subject"
                        value={`Portfolio contact — ${personalInfo.name}`}
                    />
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_captcha" value="false" />

                    <Field
                        id="contact-name"
                        name="name"
                        label="Name"
                        type="text"
                        autoComplete="name"
                        placeholder="Jane Doe"
                        icon={<FaUser aria-hidden="true" />}
                        required
                    />

                    <Field
                        id="contact-email"
                        name="email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        placeholder="jane@example.com"
                        icon={<FaEnvelope aria-hidden="true" />}
                        required
                    />

                    <Field
                        id="contact-subject"
                        name="subject"
                        label="Subject"
                        type="text"
                        placeholder="What's this about?"
                        icon={<FaTag aria-hidden="true" />}
                        required
                    />

                    <div className="space-y-2">
                        <label
                            htmlFor="contact-message"
                            className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                            Message
                        </label>
                        <div className="relative">
                            <FaCommentAlt
                                className="pointer-events-none absolute left-3.5 top-3.5 text-muted-foreground/70"
                                aria-hidden="true"
                            />
                            <textarea
                                id="contact-message"
                                name="message"
                                required
                                rows={6}
                                placeholder="A few lines about what you're working on…"
                                className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    {status === 'error' && errorMessage && (
                        <div
                            role="alert"
                            className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                        >
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 shadow-md focus:outline-none focus:ring-4 focus:ring-primary/40"
                    >
                        {status === 'sending' ? (
                            <>
                                <span
                                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                                    aria-hidden="true"
                                />
                                Sending…
                            </>
                        ) : (
                            <>
                                <FaEnvelope aria-hidden="true" /> Send message
                            </>
                        )}
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                        Your message goes straight to{' '}
                        <a
                            href={`mailto:${personalInfo.gmail}`}
                            className="underline hover:text-primary transition-colors"
                        >
                            {personalInfo.gmail}
                        </a>
                        .
                    </p>
                </motion.form>
            )}
        </AnimatePresence>
    )
}

interface FieldProps {
    id: string
    name: string
    label: string
    type: 'text' | 'email' | 'tel'
    placeholder?: string
    autoComplete?: string
    required?: boolean
    icon: React.ReactNode
}

function Field({ id, name, label, type, placeholder, autoComplete, required, icon }: FieldProps) {
    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
                {label}
            </label>
            <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70">
                    {icon}
                </span>
                <input
                    id={id}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                />
            </div>
        </div>
    )
}
