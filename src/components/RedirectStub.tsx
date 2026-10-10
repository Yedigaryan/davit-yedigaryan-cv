import type { Metadata } from 'next'
import { personalInfo } from '@/lib/data'
import { captionClass } from './home/HomeSection'

const SITE = 'https://davit.yedigaryan.pro'

/** Metadata for a retired route (spec 005 Req 20): noindex, canonical to the home-page section. */
export function stubMetadata(to: string): Metadata {
    return {
        title: `Moved | ${personalInfo.name}`,
        robots: { index: false, follow: true },
        alternates: { canonical: `${SITE}${to}` },
    }
}

/**
 * Body of a retired route. React 19 hoists the <meta> into <head>, so the
 * static page redirects without JavaScript. The link is the visible fallback.
 */
export default function RedirectStub({ to, label }: { to: string; label: string }) {
    return (
        <>
            <meta httpEquiv="refresh" content={`0;url=${to}`} />
            <div className="container mx-auto py-24">
                <p className={`${captionClass} text-muted-foreground`}>
                    <a href={to} className="text-link underline underline-offset-4">{`Moved to ${label}`}</a>
                </p>
            </div>
        </>
    )
}
