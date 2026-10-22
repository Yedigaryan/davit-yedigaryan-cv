# 007 - Live frame meter behind the home hero

- **Status:** approved (2026-10-22)
- **Date:** 2026-10-22
- **Spec:** 007
- **Supersedes / superseded-by:** - (depends on 004 and 005, implemented); amends 005 Req 12 only in that the hero (`#top`) gains the meter: 005 Req 12 says the trace and corner instrument are "not part of this spec (007, 008)", and this spec is where they land. Nothing else in 005 Req 12 changes (portrait, h1, subline, CTAs, location line stay as they are)

> **Sources.** Scope and look decided by Davit, MEMORY.md "2026-10-22,
> Spec 007 is the live frame meter only" (brainstorm 2026-10-21/22,
> mockup "B + grid", an untracked file under `.superpowers/brainstorm/`;
> the look is described in words under "The look" below so this spec
> does not depend on that file). Original idea: MEMORY.md "2026-10-09,
> Rebrand direction". Sticky constraint: MEMORY.md "2026-10-15 ...
> overflow-x: clip".
>
> **How decisions are tagged below.**
> - No tag: Davit's decision (his words or picks).
> - **[accepted]**: Claude's call, accepted by Davit in the 2026-10-22
>   playback.
> - **[decided 2026-10-22, Claude's call]**: ruled after the builder
>   check and spec review of this draft; replaces an earlier drafting
>   call or adds behaviour.
> - **[drafting call]**: made while writing this spec. All of them were
>   accepted by Davit on 2026-10-22 and are now tagged **[accepted
>   2026-10-22, was a drafting call]**; none is still undecided.
>
> **Tension with MEMORY.md, flagged.** The 2026-10-09 rebrand entry says
> "Reduced-motion -> static". Req 13 below keeps the instrument's
> numbers updating about once a second under reduced motion. Davit
> accepted that in the 2026-10-22 playback; it applies to the meter
> only. The 2026-10-09 "memory trace optional/Chrome-only" is dropped
> (Non-goals).
>
> **Invariant (repeated from 005 and 006).** The target pay figures and
> the trading client's name never appear in any file under `src/`,
> `public/` or `specs/`.

## Intent

A faint, real frame-time trace runs behind the home hero, with a small
corner instrument putting numbers on it, so that a visitor who watches
for a few seconds concludes the site itself is fast and well-engineered.
It is the one motion moment on the page, and it must cost the page
nothing measurable.

## The look (in words)

Like a faint oscilloscope screen behind the hero. A graticule of thin
32px squares covers the whole hero section. Across it runs one thin
amber line, scrolling right to left: each point is one real frame, so
when the page is fast the line lies flat and low, and a slow frame
shows as a spike upwards. There is no budget line and no text on the
canvas. At the hero's top right sits a small bordered box (about 200px
wide in the mockup) on a slightly translucent paper backing, with three
rows, label on the left in small muted uppercase mono and value on the
right (`Frame`, `Rate`, `Long tasks 10s`), and below them a tiny
sparkline of the same amber line. Under the box is a "Fig. 0" caption
in the site's figure-caption style. Everything is faint enough that the
hero still reads as text first (Req 17).

## Behavioral Requirements

### What is measured (real data only)

1. WHEN the meter is running THEN every `requestAnimationFrame` callback,
   except those Req 3 excludes, records one sample: the time since the
   previous callback (the frame time, in ms). No sample is invented,
   interpolated, clamped below its real value, or smoothed before it is
   stored. (The drawing may cut a sample off at the scale ceiling; the
   stored value stays real.)

2. WHEN the meter starts (first mount, or a remount after client-side
   navigation back to `/`) THEN the trace starts empty and fills from
   the right as real samples arrive. It is never pre-filled with a flat
   "budget" value (the mockup pre-fills; the real meter must not).
   **[accepted 2026-10-22, was a drafting call]**

3. WHEN the meter's loop starts, that is after mount, after each resume
   from a pause (Req 10, 11), and after a restore from the back/forward
   cache THEN the first `requestAnimationFrame` callback records no
   sample (there is no previous timestamp; it only stores its own), and
   the delta measured at the second callback is discarded too: not
   stored, not plotted, not fed into the frame-time or frame-rate
   numbers. The first stored sample is the delta at the third callback.
   A pause never shows up as a spike or as a long task.
   **[decided 2026-10-22, Claude's call]** Whether earlier samples are
   kept or cleared on resume is the builder's call.

4. WHEN the instrument shows frame time THEN it is the recent frame
   time, lightly smoothed (exact factor: builder's call), in ms with one
   decimal, for example `16.7 ms`. WHEN it shows frame rate THEN it is
   `1000 / frame time` rounded to a whole number, for example `60 fps`.
   The trace itself is never smoothed (Req 1).

5. WHEN the browser supports the `longtask` entry type
   (`PerformanceObserver.supportedEntryTypes` includes `"longtask"`)
   THEN the instrument shows the number of long tasks whose
   `startTime` lies within the last 10 seconds: a rolling window, not a
   count since page load. A long task leaves the count 10 seconds after
   it started. Only long tasks observed since the meter mounted count:
   the observer does not use `buffered: true`, so hydration long tasks
   from before mount are not shown. **[decided 2026-10-22, Claude's
   call]** (MEMORY.md 2026-10-22 rejected counts that make a fast site
   look slow, and this is the simpler path.)

6. WHEN the browser does not support `longtask` THEN the long-task row
   shows a hyphen (`-`), never a number. A `0` there would be invented
   data. (Believed to be Chromium-only, so Safari and Firefox would
   show `-`. **Unverified**: Verification 9 checks
   `supportedEntryTypes` in each browser.) **[accepted 2026-10-22, was a drafting call: the
   placeholder text]**

6a. WHEN no sample is stored yet (before the third callback after mount,
    Req 3) or the samples were cleared on resume THEN `Frame` and `Rate`
    each show a hyphen (`-`), never `0`, `Infinity` or `NaN`; frame rate
    is never computed by dividing by zero. **[decided 2026-10-22,
    Claude's call]**

### What is drawn

7. WHEN the meter is running on a viewport at least 640px wide AND
   reduced motion is not requested THEN the hero section (`#top`, the
   whole section box from edge to edge, not only the `.container`)
   shows, behind all hero content:
   - a faint scope grid of 32px squares in the border token
     (`--border-color`), and
   - a faint amber trace (`#E8A33D`, the existing
     `--button-primary-bg` / `--color-primary` token) across the full
     hero width, one point per stored frame, newest on the right,
     moving as frames arrive.

   There is **no labelled budget line** and no text on the canvas.
   Scale ceiling (the mockup used 0 to 50 ms), sample buffer length,
   vertical band, line widths and opacities are the builder's call,
   within the two rules below.

   - **Readability.** Every hero text element keeps at least the WCAG
     contrast it needs, 4.5:1 for body text and captions (location
     line, `00 / Index`, subline, portrait caption, CTA labels, the
     Fig. 0 caption, the instrument's text against its own backing) and
     3:1 for the large `h1`, against the worst-case composited
     background that can sit under it: paper, plus the grid line at its
     drawn alpha, plus the trace at its drawn alpha, in both themes.
     Verification 23 checks it. **[decided 2026-10-22, Claude's call]**
     My own arithmetic, not measured: at the mockup's alphas (grid 0.9,
     trace 0.4) light mode fails this, because ink3 and `--link-color`
     captions over a grid line alone come out at about 3.8:1 and 3.6:1.
     So the drawn alphas must be lower than the mockup's, or the layers
     kept out from under the text; the builder chooses which.
   - **Paint order.** The meter layer paints behind all hero content.
     The section `#top` is the containing block and its own stacking
     context (`position: relative` plus `isolation: isolate`); the
     meter's canvas layer is `position: absolute; inset: 0` with
     `z-index: 0` and comes first; the hero `.container` is
     `position: relative` with a higher `z-index` (for example 1). The
     portrait wrapper's own `relative isolate` then stays a nested
     stacking context inside the content layer and cannot fall behind
     the canvas. The instrument and caption sit above the canvas.
     Verification 24 proves the order. **[decided 2026-10-22, Claude's
     call]**

8. WHEN the meter is running on a viewport at least 640px wide AND
   reduced motion is not requested THEN a small instrument sits at the
   hero's top right, showing four things:
   - frame time (Req 4, 6a), label `Frame`
   - frame rate (Req 4, 6a), label `Rate`
   - long tasks in the last 10 s (Req 5, 6), label `Long tasks 10s`
   - a tiny sparkline of the same samples as the hero trace, in amber.

   Its right edge aligns with the hero `.container`'s right content
   edge (the same edge the hero text aligns to on the left), and its
   top aligns with the top of the `00 / Index` caption row, both within
   1px. **[accepted 2026-10-22, was a drafting call: the container edge, not the section edge; at
   1920px the two are about 336px apart, computed from the 80rem
   container plus its 1rem padding, not measured]** Labels are from the
   mockup; label and value styling uses existing tokens only (Req 18).

   Note on spec 008: the Fig. 2 chat pane of spec 008 may take the
   hero's right column at >= 1024px. 007 reserves no space for it; 008
   decides its placement and amends this Req if the instrument has to
   move. **[decided 2026-10-22, Claude's call]**

9. WHEN the instrument is shown THEN a caption sits directly under it in
   the existing caption style (`captionClass` from
   `src/components/home/HomeSection.tsx`, colour `text-muted-foreground`
   as the portrait caption), reading
   `Fig. 0 This page, measured live.`
   with `Fig. 0` in a `text-link` span, exactly like the portrait's
   `Fig. 1`. Wording chosen by Davit on 2026-10-22 (Open question 1,
   option a: one short wording at every width). The caption is one
   line at every width (`white-space: nowrap`). On viewports at least
   640px wide its right edge aligns with the instrument's right edge
   within 1px, and it may be wider than the instrument; it is never
   wrapped to the instrument's width. **[decided 2026-10-22, Claude's
   call: right-aligned and not width-constrained, because the short
   wording is estimated at about 260px against an instrument of about
   200px; estimate from font metrics, not measured]** Figure number 0 **[accepted]**: Fig. 1 is the portrait,
   Fig. 2 is reserved for the spec 008 chat pane, Fig. 3 to Fig. 9 are
   the projects (spec 006).

### When it runs and when it stops **[accepted]**

10. WHEN the hero `#top` has no part inside the viewport below the
    sticky header (IntersectionObserver) THEN no measuring and no
    drawing happen: no `requestAnimationFrame` callback of the meter is
    scheduled, no 1-second update timer (Req 13) runs, the long-task
    PerformanceObserver is disconnected, and the canvas is not redrawn
    (the one exception is the single redraw on a theme change, Req 18).
    WHEN any part of the hero comes back into view THEN the meter
    reconnects the long-task observer and resumes, under Req 3.
    **[decided 2026-10-22, Claude's call]** for the following details:
    - The observer uses a top `rootMargin` of minus the sticky header's
      height, read from the site header element (rendered by
      `src/components/Header.tsx`, `sticky top-0`) once at mount, so
      the strip of hero hidden under the header counts as off-screen.
      `--header-h` is not used: it is only published on `/projects`
      (`ChaptersColumn.tsx`). The selector must not match the chat
      panel's own `<header>` in `LlmChat.tsx`.
    - No meter loop starts before the first IntersectionObserver
      callback has reported the hero visible, also when the page is
      opened at a hash further down (`/#stack`, or a redirect stub such
      as `/about` landing on `/#profile`).
    - Known limitation, accepted: on phones the full-screen chat panel
      can cover the hero without the meter pausing, because the hero
      still intersects the viewport. `LlmChat.tsx` is out of scope.

11. WHEN the document becomes hidden (`visibilitychange`, for example a
    background tab) THEN the same stop as Req 10 applies, including the
    1-second timer and the disconnected long-task observer; WHEN it
    becomes visible again and the hero is in view THEN it resumes under
    Req 3.

12. WHEN the hero unmounts (for example "View projects" is a Next
    `<Link>`, so a client-side navigation to `/projects` unmounts it)
    THEN the meter's animation-frame loop, timers, IntersectionObserver,
    PerformanceObserver and event listeners are all removed. WHEN the
    visitor comes back to `/` (Back, or the header logo) THEN exactly
    one meter loop runs, no matter how many times this happened, and
    also under React StrictMode's double mount in `next dev`.

### Reduced motion, phones, no JavaScript

13. WHEN `prefers-reduced-motion: reduce` matches on a viewport at least
    640px wide THEN there is no moving line: neither the hero trace nor
    the sparkline is drawn **[accepted 2026-10-22, was a drafting call: both lines absent, rather
    than a frozen snapshot that jumps once a second]**. The static grid,
    the instrument (without its sparkline) and the caption stay. The
    instrument's three numbers update about once a second from real
    measurements (Req 1, 4, 5). **[accepted]** Whether a preference
    change while the page is open takes effect live or only after a
    reload is the builder's call; Verification uses a reload.

14. WHEN the viewport is narrower than 640px (Tailwind `sm`, the
    breakpoint the header's name and the chat panel's mobile layout
    already use) **[accepted; the 640px value is the drafting pick
    from existing breakpoints]** AND reduced motion is not requested
    THEN the instrument is not shown; the hero grid and trace stay; the
    caption (Req 9 text) sits at the bottom of the hero, left-aligned
    with the hero text, on one line (Req 9).
    No part of the caption is ever covered by the fixed chat launcher
    (`LlmChat.tsx`: `fixed bottom-4 right-4`, 56px, below 640px) at any
    scroll position. Because the launcher is fixed, in practice this
    means the caption's right edge stays left of the launcher's left
    edge (viewport width minus 72px). At 375px that leaves about 287px
    for the caption (16px gutter on the left, 72px on the right), and
    the short wording is estimated at about 260px (not measured; V17a
    measures it). **[decided
    2026-10-22, Claude's call]**

15. WHEN the viewport is narrower than 640px AND reduced motion is
    requested THEN the meter is absent entirely: no canvas, no grid, no
    instrument, no caption. (A "live" caption with nothing live beside
    it would be untrue.) **[accepted 2026-10-22, was a drafting call]**

16. WHEN JavaScript is off, OR before the meter has mounted THEN the
    hero renders exactly as today: the grid, trace, instrument and
    caption all belong to the meter and are absent from the exported
    HTML (`out/index.html`); they appear only after mount in the
    browser. A client component is still prerendered by the static
    export, so the meter must render nothing on the server pass.
    **[accepted 2026-10-22, was a drafting call: the caption is client-only too]**

### Layout, look, accessibility

17. WHEN the meter mounts, at any width THEN the hero's height and the
    position of every hero element (caption row, location line, h1,
    portrait, subline, CTAs) are unchanged from the hero without the
    meter: the meter adds no layout shift. The instrument and caption
    never overlap hero text, the portrait or the CTAs at 640px, 768px,
    1024px, 1440px and 1920px, and the phone caption never overlaps the
    CTAs at 375px. The canvas never intercepts pointer input
    (`pointer-events: none`): every hero link and the text stay
    clickable and selectable. The hero text stays readable over the
    meter (Req 7, readability rule).

18. WHEN the theme changes from any source (the `ThemeToggle`, or an OS
    appearance change while the toggle is on "system") THEN the grid,
    instrument border, backing and text use the new theme's existing
    token values within one second, also while the meter is paused
    (Req 10, 11) and under reduced motion (Req 13): the static canvas
    layers redraw once on the change, and the first frame after a
    resume already uses the current colours (no frame in the old
    theme). **[decided 2026-10-22, Claude's call]** The trace and
    sparkline stay amber `#E8A33D` in both themes **[accepted]**.
    No new CSS variable and no colour literal appears in the meter's
    component files: no hex, `rgb()`/`rgba()`, `hsl()`/`hsla()` or named
    colour (such as `white`, `black`, `orange`); colours are read from
    existing tokens. **[decided 2026-10-22, Claude's call]** Raw amber is
    used for lines only, never as text in light mode (spec 004 Req 13:
    1.91:1 on paper). Instrument values and labels use text tokens that
    already pass AA on paper (`--foreground`, `--text-secondary`,
    `--text-tertiary`, `--link-color`).

19. WHEN a screen reader reads the hero THEN the canvas, the instrument
    and its numbers are skipped (`aria-hidden="true"`) **[accepted]**,
    and the caption is read as ordinary text, after the hero's CTAs in
    reading order (its visual place at the top right does not move it
    earlier in the DOM) **[accepted 2026-10-22, was a drafting call: DOM position]**. The meter
    adds nothing focusable: tab order through the hero is unchanged.

20. WHEN any element wraps the hero or the meter THEN its computed
    `overflow-x` and `overflow-y` are `visible` or `clip`, never
    `hidden`, `auto` or `scroll` (no Tailwind `overflow-hidden` or
    `overflow-x-hidden`). If clipping is needed, `overflow-x: clip` is
    used (MEMORY.md 2026-10-15). There is no horizontal page scroll at
    375px.

### Cost

21. WHEN the meter runs on the static build (`out/`) with DevTools CPU
    throttling at 4x slowdown and the page idle on the hero for 10
    seconds THEN:
    - no long task (50 ms or more) is attributed to the meter's code.
      Long tasks attributed to other code are noted in Implementation
      notes, not counted as a failure of this Req;
    - the meter's average work per frame, computed as the meter's total
      self time in the recording divided by the number of frames in it,
      is under 2 ms;
    - the meter's own `Frame` reading stays within 2 ms of the display's
      refresh interval (for example 14.7 to 18.7 ms at 60 Hz, 6.3 to
      10.3 ms at 120 Hz), and after the first 10 seconds `Long tasks
      10s` reads 0 in a Chromium browser unless a long task from other
      code was noted.

    How the meter's time is isolated in a minified build is in
    Verification 12. **[decided 2026-10-22, Claude's call]** (the 4x,
    2 ms and 2 ms-tolerance thresholds)

22. WHEN the meter is built THEN it uses canvas 2D and
    `requestAnimationFrame`: no WebGL, and no new entry in
    `package.json` (`dependencies` or `devDependencies`). framer-motion
    is already installed and is not required.

23. WHEN any page or the chat system prompt renders THEN neither the
    target pay figures nor the trading client's name appear.

## Non-goals

Moved to later specs, one at a time (MEMORY.md 2026-10-22):

- Boot counter on first load.
- Scroll-scrubbed paragraph reveals and count-up stats.
- The amber cursor dot (on project cards or anywhere).
- Scroll-spy for the header nav and the `/projects` figure rail's
  active highlight.
- The four pedanyan.com effects (typed headline, dark scope stage,
  pinned stats, pinned timeline; their design boards were never
  approved).
- The interim Profile / Proof h2 copy.
- The spec 008 chat terminal pane (Fig. 2) and the Projects launcher
  pill.
- The `#proof` paragraph "about the page measuring itself" that spec
  005 Req 14 assigned to 007.

Ruled out for the meter itself:

- The Chrome-only memory trace (2026-10-09 idea, dropped 2026-10-22).
- Any click, hover or focus interaction on the instrument or the trace
  (no tooltip, no toggle, no "heavy frame" button like the mockup's).
- A labelled budget line (mockup C), mockup A "Whisper".
- WebGL, new dependencies, a worker thread.
- A config flag, env var or user setting to turn the meter off.
- Any meter on pages other than `/`.
- Pausing the meter when the phone chat panel covers the hero (known
  limitation, Req 10).
- Changes to `Header.tsx`, `LlmChat.tsx`, `ThemeToggle.tsx`,
  `ThemeContext.tsx`, `data.ts` or the chat system prompt.

## Pointers this spec invalidates

These still say spec 007 covers something it no longer covers, or do
not record that 007 amends 005 Req 12. 007 does **not** edit them now;
the implementation plan updates each to say "a later spec" (and, for
005's metadata line, adds "Req 12 amended by 007 (live frame meter)").
Line numbers as of 2026-10-22.

- `specs/005-monograph-home-page.md`
  - line 6, metadata: "007 motion + live meter", and no record that 007
    amends Req 12.
  - line 158, Req 11: "no scroll-spy; that is spec 007".
  - line 183, Req 13: "the scroll reveal is 007".
  - line 195, Req 14: the paragraph about the page measuring itself "is
    007's".
  - line 270, Non-goals: boot counter, scroll reveal, count-up, cursor
    dot, scroll-spy "spec 007".
- `specs/006-projects-index.md`
  - line 6, metadata: "007 adds the rail's active highlight and the
    cursor dot".
  - line 15, Sources: "rail highlight and cursor dot in 007".
  - line 161, Req 10: "(that is 007)".
  - line 219, Non-goals: "... **spec 007**".
  - line 246, Interface contract: "007's rail highlight ...".
- `src/components/Hero.tsx` line 8 comment: "The trace, boot overlay and
  chat pane are specs 007 and 008" (the boot overlay is no longer 007).

## Interface contract

- **Env vars:** none.
- **Component props / exports:** none other code relies on. `Hero.tsx`
  stays a server component and renders one client meter component
  inside `#top`; the section becomes the containing block and stacking
  context for the meter (Req 7, paint order). The `#top` id and every
  existing hero element keep their markup and classes apart from what
  positioning and stacking need. The meter's strings (labels, caption
  text) live inside the client component, and `Hero.tsx` passes it no
  text props, so the caption cannot reach `out/index.html` through the
  serialized client-component props either (Req 16, Verification 1).
- **Tokens:** existing only: `--border-color` (grid, instrument
  border), `--button-primary-bg` / `--color-primary` (amber lines),
  `--background` (instrument backing), `--foreground`,
  `--text-secondary`, `--text-tertiary`, `--link-color` (text),
  `--fs-m5` and the other existing type-scale variables. No new
  variable in `globals.css`.
- **Files:** `src/components/Hero.tsx` (mounts the meter, positioning
  and stacking context); new client component file(s) for the meter
  (location and split are the builder's call). `globals.css` only if a
  rule cannot be expressed in the component, and then without new
  variables.
- **Artifacts in `out/`:** `index.html` contains no `<canvas` and no
  `Fig. 0` (Req 16).

### Left to the builder (say so in the plan)

Canvas sizing and devicePixelRatio handling, resize handling, sample
buffer length, scale ceiling (mockup: 0 to 50 ms), the trace's vertical
band, line widths and alphas (within the Req 7 readability rule), the
exact smoothing factor (Req 4), how colours are read from the tokens
and how a theme change is detected (without reading computed style
every frame if that shows up in Req 21), live vs reload reaction to a
reduced-motion change (Req 13), keeping or clearing samples on resume
(Req 3), whether the long-task observer runs on phones where the
instrument is hidden (Req 14), and the component file split.

## Verification

All pnpm commands use `--ignore-workspace` (ERRORS.md, 2026-10-09).
Restart the dev server after any build before trusting a browser
reading (ERRORS.md, same date). Run every meter check in a **visible**
browser window: in a hidden preview pane `requestAnimationFrame` never
fires and smooth scrolling never runs (ERRORS.md), so the meter would
look broken. Cost checks (V12, V13), the bfcache check (V8) and the
start-order check (V25) run on the static build served by
`pnpm --ignore-workspace run serve`, not `next dev`.

To force a real long task as a page task, paste in the console:
`setTimeout(() => { const e = performance.now() + 200; while (performance.now() < e) {} }, 0)`
(the "jank snippet" below). Whether a busy loop typed directly into the
console is counted as a page long task is unverified, so use the
`setTimeout` form.

**Source-mapped profiling build** (used by V12, V13, V25): in a local,
**uncommitted** change, set `productionBrowserSourceMaps: true` in
`next.config.ts`, run `pnpm --ignore-workspace run build` and `serve`.
The Performance panel then shows the meter's functions under their
source names and file, so its self time and its callbacks can be
filtered by file name. Revert `next.config.ts` afterwards
(`git diff next.config.ts` is empty) and rebuild before anything is
deployed. No `performance.mark`/`measure` instrumentation is added to
the shipped code.

1. `pnpm --ignore-workspace run build` succeeds;
   `grep -c '<canvas' out/index.html` is 0 and
   `grep -c 'Fig\. 0' out/index.html` is 0 (Req 16; the second count
   also covers the serialized client-component props, see Interface
   contract). V16 checks the same with JavaScript off in the browser.
2. `git diff main -- package.json` shows no change, and
   `grep -rnE "getContext\(['\"](webgl|webgl2|experimental-webgl)" src/`
   returns nothing; any hit for `grep -rni webgl src/` is reviewed by
   hand and may only be a comment (Req 22).
3. On the meter's component files:
   `grep -nE "#[0-9A-Fa-f]{3,8}\b|rgba?\(|hsla?\(" <files>` returns
   nothing outside comments, and every `fillStyle`, `strokeStyle`,
   `shadowColor`, `color` or `background` assignment found by
   `grep -nE "(fillStyle|strokeStyle|shadowColor|color|background)" <files>`
   is read by hand to confirm it takes a token value, not a hex, rgb,
   hsl or named colour. Comment hits are reviewed by hand. And
   `git diff main -- src/app/globals.css` adds no `--` variable
   (Req 18).
4. `pnpm --ignore-workspace run dev`, http://localhost:3000/ at
   1440x900, light theme: a faint 32px grid and a faint amber trace
   cover the whole hero section edge to edge, the trace moves, there is
   no budget line and no text on the canvas; the instrument at the top
   right shows `Frame`, `Rate`, `Long tasks 10s` and a moving sparkline;
   the caption under it reads "Fig. 0 This page, measured live." with "Fig. 0" in the link colour (Req 7,
   8, 9).
5. Reload and watch the first second: the trace grows from empty; there
   is no flat pre-filled line across the hero; `Frame` and `Rate` show
   `-` until the first sample, never `0`, `Infinity` or `NaN` (Req 2,
   6a).
6. In Chrome, run the jank snippet: within about a second the trace
   shows a spike at the top of its scale, the frame time number rises
   above its idle value, and `Long tasks 10s` goes up by 1; about 10
   seconds later it goes back down by 1 (Req 1, 4, 5).
7. Scroll down to `#stack`, wait 5 seconds, scroll back: no spike at the
   top of the scale appears at the resume point, and the long-task
   count does not rise. Switch to another tab for 5 seconds and come
   back: same result. If samples are cleared on resume, `Frame` and
   `Rate` show `-` until new samples arrive (Req 3, 6a, 10, 11).
8. Back/forward cache, on the served static build: in the same tab, type
   another URL into the address bar (for example https://example.com),
   wait 5 seconds, press Back: no spike at the resume point (Req 3).
   If DevTools Application > Back/forward cache reports the page was
   not restored from bfcache, note why and treat this step as not
   applicable.
9. In the console of Chrome, Safari and Firefox, run
   `PerformanceObserver.supportedEntryTypes.includes('longtask')`.
   Where it is `false`, the long-task row shows `-` and never a number
   (Req 6). Record the three results, with browser versions, under
   Implementation notes at the end of this spec.
10. Performance panel (Chrome), page on `/`, scroll to `#stack`, record
    3 seconds: no "Animation frame fired" event, no timer and no
    long-task observer callback from the meter's code. Then, starting
    on the hero, record, switch to another tab for 3 seconds, come back
    and stop: during the hidden interval only, there is no meter
    callback of any kind (activity before and after it is expected)
    (Req 10, 11).
11. Click "View projects", then Back; repeat three times. Record 2
    seconds on the hero: exactly one meter animation-frame callback per
    frame. Repeat once in `next dev` (StrictMode) (Req 12).
12. Cost, on the source-mapped profiling build: open the served URL in
    Chrome, DevTools Performance with CPU 4x slowdown, idle on the hero,
    record 10 seconds after the first 10 seconds on the page.
    - Bottom-up view, grouped by URL or filtered to the meter's source
      file: total meter self time divided by the number of frames in
      the Frames track is under 2 ms.
    - No long task in the recording has the meter's functions in its
      call stack. Long tasks from other code are listed in
      Implementation notes, not a failure.
    - The meter's `Frame` value stays within 2 ms of the refresh
      interval (14.7 to 18.7 ms at 60 Hz), and `Long tasks 10s` reads 0
      unless a noted long task from other code is inside the window
      (Req 21).
13. Same as V12 with the hero scrolled out of view: the meter's source
    file does not appear in the recording at all (Req 10, 21).
14. DevTools Rendering > emulate `prefers-reduced-motion: reduce`,
    reload at 1440x900: no trace and no sparkline are drawn, the grid
    is static, the three numbers change about once a second, and the
    jank snippet still moves the frame-time and long-task numbers
    within about a second (Req 13).
15. Device mode at 375px: no instrument; grid and trace present; the
    caption sits at the bottom of the hero, left-aligned with the text,
    not over the CTAs; `document.documentElement.scrollWidth ===
    innerWidth`. Scroll so the hero's bottom edge sits at the bottom of
    the viewport and compare rects: the caption's `right` is less than
    the chat launcher button's `left` (Req 14, 17, 20). At 375px with
    reduced motion emulated and a reload: no grid, no caption, no canvas
    in the DOM (Req 15).
16. Layout shift: at 1440x900 and 375px, compare
    `document.getElementById('top').getBoundingClientRect().height` and
    the h1, portrait and CTA rects with JavaScript on (after mount) and
    with JavaScript off (DevTools > Settings > Disable JavaScript,
    reload): identical, and with JavaScript off the hero has no canvas
    and no "Fig. 0" text. The Performance panel shows no layout shift
    from the meter on load (Req 16, 17).
17. At 640, 768, 1024, 1440 and 1920 wide, compare the instrument's and
    caption's `getBoundingClientRect()` with the location line, h1,
    portrait, subline and CTAs: no intersection. At the same widths the
    instrument's `right` equals the hero `.container`'s right content
    edge (its `right` minus its right padding) and its `top` equals the
    `00 / Index` caption's `top`, both within 1px (Req 8).
    `document.elementFromPoint` at the centre of "View projects" and
    "Resume (PDF)" returns the link, not the canvas (Req 17).
17a. Caption width (Req 9, 14). At 375, 640, 1024 and 1440 wide, the
    caption's `getBoundingClientRect().height` equals one line of
    `captionClass` (no wrap). At 640 and above its `right` equals the
    instrument's `right` within 1px. At 375 its `right` is at most
    `innerWidth - 72`. Record the measured caption width at 375 in
    Implementation notes.
18. Theme changes (Req 18):
    - On the hero, toggle light, dark, system: within a second the grid,
      instrument border, backing and text switch; trace and sparkline
      stay amber; no light patch remains in dark mode.
    - With the toggle on "system", change the OS appearance: same
      result.
    - Paused: scroll to `#stack`, toggle the theme, scroll back: the
      first visible frame of the grid and instrument is already in the
      new theme (no flash of the old colours).
    - Reduced motion emulated (V14 set-up): toggle the theme: the static
      grid redraws in the new colours within a second.
19. Screen reader (VoiceOver, rotor or linear reading): the hero reads
    "00 / Index", location, h1, the portrait image as "Portrait of
    Davit Yedigaryan", the portrait caption, subline, the two CTAs, then
    "Fig. 0 This page, measured live.";
    no numbers from the instrument are read. Tab through the hero: same
    stops as on `main` (Req 19).
20. In DevTools, from the canvas walk `parentElement` up to `html`: each
    computed `overflow-x` and `overflow-y` is `visible` or `clip`
    (Req 20).
21. `grep -ri "<trading client name>\|<target pay figures>" src/ out/
    specs/` returns nothing; run it with the real name and figures typed
    locally, never written into a file (Req 23).
22. Regression: the chat widget opens and answers on `/`; the consent
    banner appears on a fresh profile; the sticky header still sticks
    while scrolling past the hero (specs 001, 002, 005).
23. Contrast (Req 7, readability). Put the drawn alphas the build uses
    into `AG` (grid) and `AT` (trace) and run:

    ```bash
    AG=0.3 AT=0.25 node -e 'const c=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));const lin=v=>{v/=255;return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4};const L=x=>.2126*lin(x[0])+.7152*lin(x[1])+.0722*lin(x[2]);const mix=(top,a,bot)=>top.map((t,i)=>t*a+bot[i]*(1-a));const R=(x,y)=>{const[a,b]=[L(x),L(y)].sort((p,q)=>q-p);return((a+.05)/(b+.05)).toFixed(2)};const AG=+process.env.AG,AT=+process.env.AT;for(const[t,paper,grid,texts]of[["light","#F4F1EA","#D9D3C5",{"ink h1 (needs 3)":"#15130F",ink2:"#4A463E",ink3:"#6B665A",link:"#9A5B06"}],["dark","#0E0D0B","#2A2721",{"ink h1 (needs 3)":"#ECE7DA",ink2:"#B8B2A3",ink3:"#8B857A",link:"#F0B454"}]]){const p=c(paper);const worst=[mix(c(grid),AG,p),mix(c("#E8A33D"),AT,p),mix(c("#E8A33D"),AT,mix(c(grid),AG,p))];for(const[k,v]of Object.entries(texts))console.log(t,k,Math.min(...worst.map(b=>+R(c(v),b))))}'
    ```

    (The alphas in the command are placeholders; use the real ones.)
    Every line is at least 4.5, except the `h1` lines, which must be at
    least 3. If the instrument backing is translucent, repeat the check
    for the instrument's text against the backing composited over the
    same worst case, or sample pixels instead: take a screenshot at
    1440x900 in each theme, and for each text element sample the
    darkest (light theme) or lightest (dark theme) background pixel
    under it where a grid line and the trace cross, then compute the
    ratio against the text token.
24. Paint order (Req 7). At 1440x900, in the console, temporarily make
    the canvas opaque and loud: `document.querySelector('#top
    canvas').style.background = 'magenta'` (a console-only test value,
    never in source). Screenshot: the location line, `00 / Index`, h1,
    portrait, subline, both CTAs, instrument and caption are all drawn
    on top of the magenta; none is hidden or tinted by it. Also check
    the computed styles: `#top` has `position: relative` and
    `isolation: isolate`; the canvas layer is `absolute` with `z-index`
    0; the hero `.container` is positioned with a higher `z-index`.
    Reload to remove the test value.
25. Start order (Req 10), on the source-mapped profiling build:
    Performance panel > "Start profiling and reload page" on
    `http://localhost:<port>/#stack`: the recording contains no meter
    animation-frame callback at all. Repeat by opening `/about` (the
    stub redirects to `/#profile`) and recording the landing page: no
    meter animation-frame callback occurs before the meter's
    IntersectionObserver callback; if that callback reports the hero
    out of view (below the header, given the top `rootMargin`), there is
    no meter animation-frame callback at all.

## Open questions

Blocking:

None. Open question 1 (caption width and wording) was decided by
Davit on 2026-10-22: option (a), one short wording at every width,
`Fig. 0 This page, measured live.` (Req 9, 14, V17a).

Non-blocking (the default stands unless Davit says otherwise):

- **Long-task row where the API is unsupported** (Req 6): default `-`.
   Alternative: hide the row in those browsers.

Drafting calls: all accepted by Davit on 2026-10-22 (Req 2, 6, 8, 13,
14, 15, 16, 19; tagged in the Requirements).

Ruled on 2026-10-22 as Claude's calls (tagged in the Requirements; no
longer open): Req 3 gap handling, Req 5 counting from mount only (the
former Open question 3, removed), Req 6a empty state, Req 7 readability
and paint order, Req 8 note on spec 008, Req 10 header `rootMargin`,
observer disconnect and start order, Req 14 chat launcher clearance,
Req 18 theme changes from any source and no colour literals, Req 21
thresholds and isolation method.

## Implementation notes

Filled in during implementation and verification.

- V9 `longtask` support (browser, version, result): -
- V12 long tasks from other code seen while profiling: -
- V17a caption width at 375px (measured): -
