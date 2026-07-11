# 001 — LLM chat widget with silent Claude fallback

- **Status:** verified
- **Date:** 2026-07-07 (retroactive spec; fallback verified end-to-end with Ollama disabled)
- **Spec:** 001
- **Supersedes / superseded-by:** —

## Intent

A floating chat widget that answers CV questions from a laptop-backed
Ollama gateway, staying usable despite that backend's intrinsic
intermittency (Render cold starts, laptop sleep, Tailscale drops) by
silently falling over to a Claude backend and, when both are down,
degrading to a Telegram lead-capture card.

## Architectural contract

- `sendChat(history, cfg, opts)` in `src/lib/llm-chat.ts` is **dumb**:
  prepends the system prompt exactly once, forwards history verbatim
  (no truncation, no validation). Reusable outside the CV context.
- `LlmChat` in `src/components/LlmChat.tsx` is **opinionated**: owns
  `messages` state, truncation, localStorage persistence, the mobile
  `visualViewport` hook, and `react-markdown` rendering.
- `sendChatWithFallback(history, primary, fallback, opts)` in
  `src/lib/llm-chat-fallback.ts` wraps `sendChat`; when `fallback` is
  null it is a pass-through.

## Behavioral Requirements

### Config resolution
1. WHEN neither `props.apiUrl` nor `NEXT_PUBLIC_CHAT_API_URL` is set
   THEN config is null: setup hint shown, send disabled, no fetch.
2. Per-field precedence: explicit prop, then `NEXT_PUBLIC_CHAT_*` env.
3. WHEN `NEXT_PUBLIC_CHAT_API_URL_FALLBACK` is unset THEN fallback
   config is null and the widget is single-backend.
4. Fallback config = spread of primary overriding only `apiUrl` and
   `model` (`NEXT_PUBLIC_CHAT_MODEL_FALLBACK ?? primary.model`) — same
   token, headers, streaming flag by design.
5. `config` is memoised on primitive prop VALUES, never on `[props]`
   identity (React 18 StrictMode cascade — MEMORY.md §6).

### Silent fallback
6. Timeout = `NEXT_PUBLIC_CHAT_FALLBACK_TIMEOUT_MS`; unset,
   non-numeric, or 0 all resolve to 12000 ms.
7. Timeout measures TIME-TO-FIRST-BYTE only. WHEN no assistant byte
   within the window THEN abort primary and retry against fallback.
8. WHEN the first byte HAS arrived THEN commit to primary; the timeout
   becomes a no-op.
9. WHEN primary fails cleanly BEFORE any byte (network error, non-OK,
   timeout) THEN retry silently against fallback.
10. WHEN primary fails AFTER the first byte THEN rethrow — never
    restart on fallback (would double-render partial content).
11. WHEN the user's own abort signal fires THEN rethrow immediately —
    user cancellation never triggers fallback.
12. The fallback is SILENT — caller and visitor cannot tell which
    backend answered.

### Send flow & context window
13. AbortController-per-send: previous controller aborted before the
    new one is assigned; unmount cleanup aborts in-flight.
14. **2-exchange sliding window:** after every even-numbered completed
    exchange, state collapses to the most recent Q&A pair
    (`messages.slice(-2)`). System prompt unaffected (lives outside
    `messages`). Persistence follows the truncation.
15. `AbortError` from a send returns silently (no error banner).
16. Error classification: transport failures and 5xx are
    "offline-like" → `isOffline` set, no error banner; 4xx surfaces as
    a normal error. On any failure the assistant placeholder is removed.
17. WHEN a send succeeds via either backend THEN `isOffline` resets.

### Offline probe & fallback card
18. While the panel is open: OPTIONS probe on open and every 30 s,
    3 s timeout each. Probes the chat URL, NOT `/health` (`/health`
    only proves Render is up, not the tunnel chain).
19. WHEN a fallback backend is configured THEN probe BOTH URLs; site
    is "up" if ANY succeeds.
20. `isOffline` flips only after 2 consecutive all-fail probes — first
    failure is silent (Render cold start must not flash the card).
21. WHEN `isOffline` THEN hide the input form, show the offline card:
    Telegram deep-link always (if `telegramUrl`), inline relay form if
    `NEXT_PUBLIC_TELEGRAM_FALLBACK_URL` is set. Form limits: message
    ≤4000 chars, contact ≤200 (mirrors Worker limits).

### Persistence, mobile, rendering
22. History persists to `localStorage['llm-chat-history']`; corrupted
    JSON and quota errors are swallowed; `mounted` guard prevents
    clobbering stored history during hydration.
23. Mobile (<640px): inline `style` tracks `visualViewport`
    height/offsetTop so the iOS keyboard doesn't cover the input;
    desktop gets `{}` so `sm:` classes win. Safe-area insets on
    header/form.
24. Markdown via `react-markdown` + `remark-gfm` only — NO
    `dangerouslySetInnerHTML`, NO `rehype-raw`. Re-parses per delta.
25. Opening the panel fires `trackEvent('chat_open')`.

## Non-goals

- No "answered by Claude" UI indicator (deliberate — silent fallback).
- No mid-stream backend switching.
- No fallback on user cancellation.
- No probing `/health`.
- No truncation/validation in the library layer.
- No syntax highlighting, no RAG/vector DB (MEMORY.md hard-"no" list).

## Interface contract

| Env var | Unset behavior |
|---|---|
| `NEXT_PUBLIC_CHAT_API_URL` | Widget disabled; setup hint |
| `NEXT_PUBLIC_CHAT_API_KEY` | No Authorization header |
| `NEXT_PUBLIC_CHAT_MODEL` | `model` omitted from body |
| `NEXT_PUBLIC_CHAT_STREAMING` | non-`"true"` → non-streaming |
| `NEXT_PUBLIC_CHAT_API_URL_FALLBACK` | Fallback disabled entirely |
| `NEXT_PUBLIC_CHAT_MODEL_FALLBACK` | Fallback uses primary's model |
| `NEXT_PUBLIC_CHAT_FALLBACK_TIMEOUT_MS` | 12000 ms |
| `NEXT_PUBLIC_TELEGRAM_FALLBACK_URL` | Offline card: deep-link only |

## Verification

1. Unset `NEXT_PUBLIC_CHAT_API_URL`, build, open widget → setup hint,
   send disabled (Req 1).
2. Streaming end-to-end: MEMORY.md §11 layer-4 curl against
   `$RENDER/v1/chat/completions` → SSE frames + `[DONE]` (Req 2).
3. Fallback: stop Ollama (`launchctl bootout …/dev.local.ollama`),
   send a message in the widget → primary POST 502, fallback POST 200,
   answer renders with no visible difference (Reqs 7, 9, 12).
   *Verified 2026-07-07 via preview_network trace.*
4. Send 4+ messages → `localStorage['llm-chat-history']` collapses to
   the last pair after even exchanges (Req 14).
5. Kill Tailscale on the laptop, wait ~60 s with panel open → offline
   card appears after 2nd probe failure (Reqs 18-21). MANUAL.

## Open questions

None.
