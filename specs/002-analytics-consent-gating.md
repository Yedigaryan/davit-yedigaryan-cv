# 002 — Analytics with consent gating

- **Status:** implemented
- **Date:** 2026-07-07 (retroactive spec; GA4 DebugView event check still pending → not yet "verified")
- **Spec:** 002
- **Supersedes / superseded-by:** —

## Intent

Consent-respecting analytics (GA4 + Microsoft Clarity) that load in
Consent Mode v2 denied-by-default state and only activate after
explicit opt-in, with the whole subsystem self-disabling when no
analytics IDs are configured.

## Behavioral Requirements

### Enablement gating
1. `analyticsEnabled = GA_ID !== '' || CLARITY_ID !== ''`
   (`src/lib/analytics.ts`).
2. WHEN both IDs are empty THEN `<Analytics>` returns null (no scripts)
   AND `<ConsentBanner>` never becomes visible.
3. WHEN only one ID is set THEN only that tool's script injects.

### Consent-mode defaults
4. GA init calls `gtag('consent','default', {...all four keys
   'denied'})` BEFORE `gtag('config', GA_ID, { send_page_view:false })`.
5. Clarity bootstrap calls `clarity('consent', false)` immediately.
6. `send_page_view:false` — page views are dispatched manually only.

### Consent persistence & update
7. Consent stored at `localStorage['cv-analytics-consent']` as
   `'granted' | 'denied'`; any other value reads as null.
8. `updateConsent(granted)` updates all four gtag consent keys and
   `clarity('consent', granted)`; all calls optional-chained so they
   no-op before scripts load.
9. On mount, stored consent is replayed via `updateConsent` — a
   returning visitor's choice re-applies every page load.

### Banner
10. WHEN `analyticsEnabled && getConsent() === null` THEN banner shows
    (first visit only). Accept/Decline persist + update + hide.
    Buttons ≥44 px tap targets; `role="dialog"`.

### Custom events
11. Manual `page_view` fires on every `pathname` change, guarded by
    `GA_ID`.
12. `trackEvent(name, params?)` fires to both gtag and clarity,
    optional-chained, SSR-guarded.
13. Event names are snake_case — **GA4 rejects hyphens**. Known
    events: `resume_download` (`{location}`), `chat_open`,
    `chat_offline_fallback_sent`, `page_view`.
14. `<ResumeDownloadLink>` wraps `<a href="/resume.pdf" download>` and
    fires `resume_download` on click; client component so it embeds in
    server components (`Hero.tsx` location="hero", home page
    location="home-cta").

## Non-goals

- No analytics collection without explicit opt-in.
- No banner or scripts when IDs are unset.
- No hyphenated event names.
- No GA auto page-view.
- No server-side analytics (static export).

## Interface contract

| Env var | Unset behavior |
|---|---|
| `NEXT_PUBLIC_GA_ID` | No GA scripts; gtag calls no-op |
| `NEXT_PUBLIC_CLARITY_ID` | No Clarity script; clarity calls no-op |
| (both unset) | `<Analytics>` null; banner never shown |

## Verification

1. Unset both IDs, `pnpm run build`, grep `out/` for
   `googletagmanager|clarity.ms` → absent (Req 2).
2. With IDs set + cleared localStorage: no analytics network hits
   before Accept; `gtag('consent','default'…)` all denied (Req 4).
3. Accept → `localStorage['cv-analytics-consent'] === 'granted'`;
   reload → banner stays hidden, consent replayed (Reqs 7-10).
4. Click resume link / open chat → `resume_download` / `chat_open`
   visible in GA4 DebugView (Reqs 13-14). MANUAL — pending.
5. Navigate routes → exactly one `page_view` per change (Req 11).

## Open questions

- [ ] GA4 DebugView confirmation of custom events (blocks "verified").
