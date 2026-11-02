# 012 - Scroll progress bar

- **Status:** approved (2026-11-02)
- **Date:** 2026-11-02
- **Spec:** 012
- **Supersedes / superseded-by:** - (adds one element to the root layout; amends nothing in 004 to 011. Sits above the sticky header from 005 Req 11, which is `z-50`)

> **Source decision.** Davit, 2026-11-02: "add a loader of page completeness
> with one line on the top of my site", with the reference
> https://haykarevshatyan.freedev.app/?i=2. Read from the rendered
> reference only (code not inspected): a fixed `#scrollProgress` div, 2px
> tall, accent blue, at the very top of the viewport, whose width grows from
> 0 to 100% of the viewport width as the visitor scrolls down the page
> (554px of 1024px at half scroll). It tracks scroll position, not network
> loading. Answers given 2026-11-02: spec first, then build; a small JS
> client component, rAF-throttled (not CSS `animation-timeline`).

## Intent

A thin line across the top of every page shows the visitor how far down
the page they are. It adds no content, no layout shift, and no new colour.

## Behavioral Requirements

1. WHEN any page that renders the root layout is open THEN exactly one
   element `#scroll-progress` exists, fixed to the top-left of the
   viewport, full viewport width, 2px tall, with `aria-hidden="true"` and
   no text.
2. WHEN the page is scrolled to the top (`scrollY` is 0) THEN the bar's
   visible width is 0.
3. WHEN the visitor scrolls THEN the visible width is
   `scrollY / (scrollHeight - innerHeight)` of the viewport width, clamped
   to 0 to 1, so it is 100% when the bottom of the page is reached and
   about 50% at half way (within 1 percentage point).
4. WHEN the page is not scrollable (`scrollHeight <= innerHeight`) THEN
   the bar's visible width is 0, never `NaN` or 100%.
5. WHEN the viewport is resized, or the page height changes (fonts load,
   the mobile nav opens, images or sections resize) THEN the width
   recalculates without a scroll event, so it never stays stale.
6. WHEN scroll events fire faster than frames THEN at most one width
   update is written per animation frame, and the width follows the scroll
   position directly with no easing or transition.
7. WHEN the bar is drawn THEN it sits above the sticky header (higher
   z-index than `z-50`), does not move or resize any other element
   (no layout shift), and ignores pointer events so every click and tap
   reaches what is beneath it.
8. WHEN the theme is light or dark (system or toggle, spec 004) THEN the
   bar uses `var(--color-accent)` (amber text token: #9A5B06 light,
   #F0B454 dark) and follows the theme change with no extra colour added.
9. WHEN `prefers-reduced-motion: reduce` is requested THEN the bar is not
   shown (`display: none`).
10. WHEN the page is printed THEN the bar is not shown.
11. WHEN JavaScript has not run (before hydration, or disabled) THEN the
    bar is present at width 0 and nothing breaks; the static `out/` build
    still serves.
12. WHEN the component mounts or unmounts THEN it adds and removes every
    listener and observer it created, with no console errors or warnings.

## Non-goals

- Network or asset loading progress, a spinner, or any change to
  `PageLoader.tsx`.
- A percentage readout, section markers, or a scroll-to-top control.
- Tracking the chat pane's own scroll (spec 008), or any element other
  than the document.
- Easing, spring or other animation, a user setting to turn it off, an
  analytics event, or a new env var.
- Deploying. The site's hosting is suspended at the time of writing (see
  MEMORY.md 2026-11-02); shipping follows spec 003 only after Davit says
  yes to a deploy.

## Interface contract

- **Component:** `src/components/ScrollProgress.tsx`, default export,
  `"use client"`, no props, returns the single `<div id="scroll-progress"
  aria-hidden="true">`.
- **Mount point:** `src/app/layout.tsx`, inside `ThemeProvider`, before
  `<Header />`.
- **Width mechanism:** the element is full width with
  `transform: scaleX(p)`, `transform-origin: left`, written from a
  `requestAnimationFrame` callback. No `width` animation. The server
  render includes the initial `style={{ transform: "scaleX(0)" }}` so the
  bar is at 0 before hydration.
- **Styling:** Tailwind utilities only (`fixed inset-x-0 top-0 h-0.5
  z-[60] pointer-events-none bg-accent origin-left print:hidden
  motion-reduce:hidden`). No new CSS variable.
- **Files/artifacts:** `out/index.html` contains `id="scroll-progress"`
  once per page that uses the root layout.

## Verification

No test runner exists in this repo (`package.json` has lint and build
only), so checks are commands plus browser steps on the dev server.
Stop the preview before any build (`.next` is shared).

1. `pnpm --ignore-workspace run lint` passes with no new warnings (Req 12).
2. `pnpm --ignore-workspace run build` succeeds, then
   `grep -c 'id="scroll-progress"' out/index.html` prints 1 and
   `grep -o 'aria-hidden="true"[^>]*id="scroll-progress"\|id="scroll-progress"[^>]*aria-hidden="true"' out/index.html`
   matches (Req 1, 11).
3. Dev server, any page, in the browser: `getComputedStyle` of
   `#scroll-progress` shows `position: fixed`, height `2px`,
   `pointer-events: none`, and a z-index greater than the header's
   (Req 1, 7). `getBoundingClientRect().width` equals `innerWidth`.
4. Scroll to 0, to 50% and to the bottom; read the element's `transform`
   matrix `a` value: 0, 0.50 (plus or minus 0.01), 1 (Req 2, 3).
5. On a page that is not scrollable (resize the window tall, or open a
   short route if one exists) the matrix `a` is 0 (Req 4).
6. Narrow the window by 300px with no scroll event: the `a` value
   recalculates on the next frame (Req 5).
7. In a script, dispatch 200 scroll events in one frame and count writes
   to `style.transform` via a MutationObserver: at most 1 per frame
   (Req 6).
8. `document.elementFromPoint(100, 1)` is not `#scroll-progress`
   (Req 7); the header height and `document.scrollHeight` are unchanged
   with the element removed (no layout shift).
9. Toggle the theme: the computed `background-color` changes from
   rgb(154, 91, 6) to rgb(240, 180, 84) (Req 8).
10. `grep` the built CSS for the `prefers-reduced-motion` and `print`
    rules that hide it (Req 9, 10).
11. Open the page with JavaScript disabled: the element is present with
    inline `transform: scaleX(0)` (matrix `a` 0) and the page renders
    (Req 11). `out/index.html` carries that inline style.
12. Mount and unmount via client-side navigation or HMR 5 times: the
    console shows no errors or warnings, and the listener count does not
    grow (Req 12).
13. Zero console errors on a full scroll of `/` (Req 12).

## Open questions

None. Davit approved the spec on 2026-11-02 without changing either default:

- [x] Colour: the theme-aware amber text token `--color-accent`. The brand
  amber `#E8A33D` was rejected for light paper (about 2:1 contrast, below
  the 3:1 floor for UI).
- [x] Reduced motion: the bar is hidden (Req 9).
