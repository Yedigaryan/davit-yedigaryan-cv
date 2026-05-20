export const CONSENT_KEY = 'cv-analytics-consent'

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? ''

export const analyticsEnabled = GA_ID !== '' || CLARITY_ID !== ''

export type Consent = 'granted' | 'denied'

declare global {
    interface Window {
        dataLayer?: unknown[]
        gtag?: (...args: unknown[]) => void
        clarity?: (...args: unknown[]) => void
    }
}

export function getConsent(): Consent | null {
    if (typeof window === 'undefined') return null
    const value = window.localStorage.getItem(CONSENT_KEY)
    return value === 'granted' || value === 'denied' ? value : null
}

export function setConsent(consent: Consent): void {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(CONSENT_KEY, consent)
}

export function updateConsent(granted: boolean): void {
    if (typeof window === 'undefined') return
    const value: Consent = granted ? 'granted' : 'denied'

    window.gtag?.('consent', 'update', {
        analytics_storage: value,
        ad_storage: value,
        ad_user_data: value,
        ad_personalization: value,
    })

    window.clarity?.('consent', granted)
}

/**
 * Fire a custom event to GA4 + Clarity. Safe to call before scripts load
 * or without consent — GA4 Consent Mode queues/drops as configured.
 * Names use snake_case (GA4 rejects hyphens in event names).
 */
export function trackEvent(name: string, params?: Record<string, unknown>): void {
    if (typeof window === 'undefined') return
    window.gtag?.('event', name, params)
    window.clarity?.('event', name)
}
