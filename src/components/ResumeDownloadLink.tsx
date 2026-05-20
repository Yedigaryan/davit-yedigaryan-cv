'use client'

import type { ReactNode } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Resume download link that fires a `resume_download` analytics event.
 * Wraps a plain `<a download>` so it can be used inside server components.
 */
export default function ResumeDownloadLink({
    className,
    children,
    location,
}: {
    className?: string
    children: ReactNode
    /** Where on the site the link was clicked (e.g. "hero", "footer-cta"). */
    location?: string
}) {
    return (
        <a
            href="/resume.pdf"
            download
            className={className}
            onClick={() => trackEvent('resume_download', location ? { location } : undefined)}
        >
            {children}
        </a>
    )
}
