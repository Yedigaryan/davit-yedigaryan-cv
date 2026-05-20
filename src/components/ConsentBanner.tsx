'use client'

import { useEffect, useState } from 'react'
import { analyticsEnabled, getConsent, setConsent, updateConsent, type Consent } from '@/lib/analytics'

export default function ConsentBanner() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (analyticsEnabled && getConsent() === null) setVisible(true)
    }, [])

    if (!visible) return null

    function choose(consent: Consent) {
        setConsent(consent)
        updateConsent(consent === 'granted')
        setVisible(false)
    }

    return (
        <div
            role="dialog"
            aria-label="Cookie consent"
            className="fixed bottom-0 left-0 right-0 z-[90] border-t border-border bg-background text-foreground shadow-lg"
        >
            <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    This site uses Google Analytics and Microsoft Clarity to understand
                    traffic and improve the experience. Analytics cookies are only set if
                    you accept.
                </p>
                <div className="flex shrink-0 gap-2">
                    <button
                        type="button"
                        onClick={() => choose('denied')}
                        className="min-h-11 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        Decline
                    </button>
                    <button
                        type="button"
                        onClick={() => choose('granted')}
                        className="min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    )
}
