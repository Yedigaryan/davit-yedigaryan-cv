'use client'
import { useEffect, useRef } from 'react'

/**
 * Thin line at the top of the viewport showing how far down the page the
 * visitor is (spec 012). Width follows scroll position directly via
 * transform, written at most once per animation frame; the server render
 * is at scaleX(0) so it is invisible before hydration.
 */
export default function ScrollProgress() {
    const bar = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let frame = 0

        const write = () => {
            frame = 0
            const el = bar.current
            if (!el) return
            const max = document.documentElement.scrollHeight - window.innerHeight
            const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
            el.style.transform = `scaleX(${progress})`
        }
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(write)
        }

        schedule()
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', schedule)
        // Page height changes without a scroll or resize: fonts, images, the mobile nav.
        const observer = new ResizeObserver(schedule)
        observer.observe(document.documentElement)

        return () => {
            window.removeEventListener('scroll', schedule)
            window.removeEventListener('resize', schedule)
            observer.disconnect()
            if (frame) cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <div
            id="scroll-progress"
            ref={bar}
            aria-hidden="true"
            style={{ transform: 'scaleX(0)' }}
            className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent motion-reduce:hidden print:hidden"
        />
    )
}
