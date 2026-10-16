'use client'
import { useEffect, type FocusEvent, type ReactNode } from 'react'

/**
 * The chapters column on /projects (spec 006).
 * - Publishes the header's real rendered height as --header-h on <html>, for
 *   the sticky offset and the #figN anchor margins (Req 7, 11). Until this
 *   runs, CSS falls back to the measured header: 69px below lg, 67px from lg.
 * - Keeps a focused control visible (Req 12): focus inside a pinned chapter
 *   brings that chapter back on top; with static chapters a control under
 *   the header is scrolled just below it.
 */
export default function ChaptersColumn({ children }: { children: ReactNode }) {
    useEffect(() => {
        const header = document.querySelector<HTMLElement>('body > header')
        if (!header) return
        const root = document.documentElement
        const publish = () => root.style.setProperty('--header-h', `${header.offsetHeight}px`)
        publish()
        const observer = new ResizeObserver(publish)
        observer.observe(header)
        return () => {
            observer.disconnect()
            root.style.removeProperty('--header-h')
        }
    }, [])

    const onFocus = (e: FocusEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement
        // Keyboard focus only: a mouse press focuses links too, and jumping then would lose the click.
        if (!target.matches(':focus-visible')) return
        const article = target.closest('article')
        if (!article) return
        const headerBottom = document.querySelector('body > header')?.getBoundingClientRect().bottom ?? 0
        if (getComputedStyle(article).position === 'sticky') {
            const anchor = article.previousElementSibling
            if (anchor && Math.abs(anchor.getBoundingClientRect().top - headerBottom) > 1) {
                anchor.scrollIntoView({ block: 'start', behavior: 'instant' })
            }
            return
        }
        const top = target.getBoundingClientRect().top
        if (top < headerBottom) window.scrollBy({ top: top - headerBottom - 8, behavior: 'instant' })
    }

    return (
        <div onFocus={onFocus} className="min-w-0 flex-1">
            {children}
        </div>
    )
}
