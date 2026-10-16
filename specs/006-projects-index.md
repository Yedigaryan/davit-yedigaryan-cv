# 006 - Projects index: pinned chapters, figure rail

- **Status:** approved
- **Date:** 2026-10-16 (approved 2026-10-16)
- **Spec:** 006
- **Supersedes / superseded-by:** - (depends on 004 and 005, implemented); amends 005 Req 14 (home Proof featured projects and their captions, Req 17 below); 007 adds the rail's active highlight and the cursor dot on top of this

> **Sources.** Layout comes from the Claude Design canvas
> (https://claude.ai/artifact/TfJcVSRpy5cjufpqJ9U19Q, boards
> "Projects index / desktop", "/ desktop / dark", "/ mobile", read on
> 2026-10-16 at version 1792143390-3cdb). Facts come from
> `src/lib/data.ts` as corrected by spec 005 against Notion. Where the
> board's copy differs from `data.ts`, `data.ts` wins (Davit,
> 2026-10-16). Scope decided by Davit on 2026-10-16: pinning in 006,
> rail highlight and cursor dot in 007; one figure number per project
> across the site; `period` and `nda` fields on `Project`; `projects`
> reordered most recent first; the shared header kept.
>
> **Invariant (repeated from 005).** The target pay figures and the
> trading client's name never appear in any file under `src/`,
> `public/` or `specs/`.

## Intent

Replace the `/projects` card grid with one full-height "chapter" per
project, most recent first, each pinned under the header until the next
one slides over it, with a numbered figure rail beside them. A hiring
engineer reads one project at a time, in the same monograph look as the
home page.

## Behavioral Requirements

### Data (`src/lib/data.ts`)

1. WHEN `Project` is read THEN it has two new required fields:
   `period: string` and `nda: boolean`. No other field changes name or
   type, and no `title`, `description`, `highlights` or `technologies`
   text changes.

2. WHEN `projects` is read THEN it is ordered most recent first and
   carries these values:

   | index | Fig. | project                       | period            | nda   |
   | ----- | ---- | ----------------------------- | ----------------- | ----- |
   | 0     | 3    | Cryptographic Web Platform    | `2025 to present` | true  |
   | 1     | 4    | Real-Time Trading (Scalping) Platform | `2025`    | true  |
   | 2     | 5    | Automotive Retail Marketplace (Prestige Motors) | `2024 to 2025` | false |
   | 3     | 6    | Energy Machines Monitoring    | `2021 to 2024`    | false |
   | 4     | 7    | Mobile Banking: BlackCatCard / GEKKARD | `2021`   | false |
   | 5     | 8    | TERASEYA Admin Panel          | `2021`            | false |
   | 6     | 9    | Cross-Platform Note App       | `Side project`    | false |

   (Titles in this table are shortened labels; the `title` strings in
   `data.ts` stay exactly as they are.) Periods follow the `experiences`
   entry each project belongs to: QDSC Dec 2025 to present (ongoing);
   Confidential Client Feb to Nov 2025; Prestige Motors Feb 2024 to Jan
   2025; Teracloud Nov 2021 to Feb 2024; Codeep Feb to Nov 2021 for both
   BlackCatCard / GEKKARD and TERASEYA (a Codeep project, not Teracloud).
   Ties keep their current relative order; the undated side project goes
   last.

3. WHEN any project is shown anywhere on the site THEN its figure number
   is its index in `projects` plus 3 (index 0 is "Fig. 3", index 6 is
   "Fig. 9"), computed by one exported function in `src/lib/data.ts`
   that both `/projects` and the home Proof section call.

### Page structure (`/projects`)

4. WHEN `/projects` renders THEN `<main>` contains, in order: an intro
   section, the chapters column with the figure rail beside it, and a
   closing call-to-action section. The shared `Header`, `Footer`,
   `LlmChat` launcher, `Analytics` and `ConsentBanner` mount from
   `layout.tsx` exactly as today, and the header marks "Projects" active
   (it already does through `onProjects`).

5. WHEN the intro renders THEN it shows the mono caption "Figures 3 to 9
   / Projects" in `--link-color`, the only `h1` on the page, "Things that
   shipped." in Fraunces light, and beside it (stacked below 1024px) the
   paragraph "Seven figures, most recent first. Each one names the stack
   and the part I personally owned. Scroll: every project takes the full
   page before the next one slides over it." The last figure number and
   the count word are derived from `projects.length`, not typed in.

6. WHEN the chapters render THEN there is one `<article>` per project,
   labelled by its own `h2` (`aria-labelledby`), and immediately before
   each article a zero-height, non-sticky anchor element with
   `id="figN"`, N being the figure number (`fig3` to `fig9`). The ids sit
   on the in-flow anchors, not on the sticky articles, so a jump to an
   earlier figure lands even while later chapters are pinned (Req 11).
   Each chapter has two columns at ≥ 1024px (one column below; the
   board's 420px column bases wrap at about 1010px anyway), separated
   from the previous chapter by a 1px ink rule on top:
   - **Text column:** a mono caption row with "Fig. N" in
     `--link-color` on the left and `period` in ink3 on the right; the
     `title` as an `h2` in Fraunces light (56px desktop, `clamp(32px,
     9vw, 44px)` below 721px); the `description` in ink2; the
     `highlights` as a list, each item preceded by an amber dash marker
     that is `aria-hidden`; the `technologies` as hairline mono chips;
     then the actions row.
   - **Actions row:** "Live site ↗" (ink button) when `liveUrl` is set;
     "Code ↗" (the hairline button style of the home hero's "Resume
     (PDF)") when `githubUrl` is set; both open in a new tab with
     `rel="noopener noreferrer"`. A non-interactive dashed chip "Under
     NDA · ask in chat" when `nda` is true. Every button is at least
     44px tall.
   - **Figure column:** a bordered panel on a faint amber wash, at least
     360px tall at ≥ 1024px and 4:3 below. When `image` is set, the
     image fills it in the amber duotone (`grayscale(1)` plus contrast,
     `mix-blend-mode: multiply` in light, `screen` in dark), with
     `alt="{title} screenshot"`, `loading="lazy"`. When `image` is null,
     the panel shows a faint 48px grid (`aria-hidden`) and the caption
     "No public figure · client confidential". A "Fig. N" tag sits in
     the panel's top-left corner either way.

7. WHEN the viewport is at least 1024px wide AND at least H px tall AND
   `prefers-reduced-motion: reduce` does not match THEN every chapter is
   `position: sticky` directly below the header, at least as tall as the
   viewport below the header, on an opaque paper background, so that
   scrolling slides the next chapter over the current one. H is the
   smallest viewport height at which the tallest chapter, with the
   header at its tallest at 1024px, fits completely below the header;
   the plan measures it and writes it down. A second band (Davit,
   2026-10-16) also pins every chapter when the viewport is at least
   1280px wide AND at least H2 px tall AND reduced motion does not match;
   H2 is the same fit rule measured at 1280px wide, where the chapters
   column reaches its full width and chapters are shorter. Either band
   pins all chapters; outside both, Req 8 applies.
   Measured 2026-10-17 on the real chapters: H = 780px (tallest chapter
   711px at 1024px wide plus the 67px header); H2 = 670px (tallest
   603px at 1280px wide plus the header).
   The rule is a CSS media query: it holds before JavaScript runs, with JavaScript off, after
   the web-font swap and on resize. No scroll listener, no
   IntersectionObserver. "Below the header" means the header's real
   rendered height, which is not a fixed 64px while the header nav-wrap
   bug is open.

8. WHEN any condition in Req 7 does not hold THEN no chapter pins: all
   chapters are static, in normal flow, with no minimum height.
   Pinning is all or nothing per page view, because a static chapter
   after pinned ones would scroll underneath them. Every part of every
   chapter (chips, "Live site", "Code", the NDA chip) is on screen at
   some scroll position; nothing is reachable only under a later
   chapter. (Reduced motion gets a static page: rebrand decision
   2026-10-09.)

9. WHEN `prefers-reduced-motion: reduce` matches THEN in-page jumps on
   every page are instant, not smooth: `globals.css` keeps
   `html { scroll-behavior: smooth }` only outside reduced motion. This
   is a one-rule, site-wide change.

10. WHEN the viewport is ≥ 1024px THEN a `nav aria-label="Figures"` rail,
    44px wide with a hairline left border, sits to the right of the
    chapters column and stays in view while the chapters scroll
    (sticky). It holds one link per project, in figure order: visible
    text "03" to "09", a short hairline tick before the number, colour
    ink3, each link at least 44px tall. Each link's accessible name
    starts with its visible number, for example "03, Figure 3:
    {title}". The links use Next `<Link>` like the header's section
    links, so Back and Forward keep Next's history state. Below 1024px
    the rail is not rendered visibly (`display: none`). No link is
    marked active in this spec (that is 007).

11. WHEN a rail link is activated (forwards or backwards, including
    while a later chapter is pinned), OR `/projects#figN` is opened
    directly, OR a home Proof card is followed to `/projects#figN`, at
    any viewport width THEN the page scrolls so chapter N's top rule
    sits directly below the header, not under it, and chapter N is the
    one on top.

12. WHEN keyboard focus moves to a link or button inside any chapter
    THEN that control is visible on screen and not covered by a later
    chapter or by the header. (With stacked sticky chapters a focused
    control in an earlier chapter can sit under a later one; the
    implementation must prevent that. How is a plan decision.)

13. WHEN the closing section renders THEN it sits on paper2 with a 1px
    ink rule on top and shows the `h2` "Want the one that is under NDA
    explained? Ask the assistant." (the board's copy, Davit 2026-10-16)
    and an ink button "Back to index" linking to `/`.

14. WHEN any element on `/projects` wraps the sticky chapters or the
    rail THEN its computed `overflow-x` and `overflow-y` are `visible`
    or `clip`: never `hidden`, `auto` or `scroll` (no Tailwind
    `overflow-hidden`, `overflow-x-hidden`, `overflow-auto` and so on).
    Where sideways overflow must be cut off, `overflow-x: clip`
    (`overflow-x-clip`) is used. (MEMORY.md 2026-10-15: `hidden` turns
    the wrapper into a scroll container and sticky stops working.)
    Clipping inside a figure panel, which wraps nothing sticky, is fine.

15. WHEN the viewport is 375px wide THEN there is no horizontal page
    scroll, every chapter is a single column, and the intro and closing
    headings use the board's phone sizes (intro `h1` `clamp(40px, 11vw,
    48px)`, closing `h2` 30px).

16. WHEN the theme is toggled THEN every colour on the page comes from
    existing spec 004 variables in `globals.css`: paper `--background`,
    paper2 `--card-bg`, ink `--foreground`, ink2 `--text-secondary`,
    ink3 `--text-tertiary`, line `--card-border` / `--border-color`,
    `--link-color`, and amber `--color-primary` (the figure panel's wash
    is amber at low opacity through a Tailwind opacity modifier). No new
    variables, and no hex values in the components.

### Home page (amends spec 005 Req 14)

17. WHEN `#proof` renders on `/` THEN the three featured cards are the
    same three projects as today (trading platform, Prestige Motors,
    Energy Machines), now at indexes 1, 2, 3, shown in figure order and
    captioned "Fig. 4", "Fig. 5", "Fig. 6" (Req 3). Each card links to
    `/projects#figN` for its own figure instead of `/projects`. Nothing
    else in `#proof` changes. Spec 005 gets an amendment line pointing
    here.

18. WHEN any page or the chat system prompt renders THEN neither the
    target pay figures nor the trading client's name appear.

## Non-goals

- Rail active highlight and any scroll-spy, the amber "read" cursor dot,
  `cursor: none`, scroll reveals or count-ups: **spec 007**.
- The restyled chat launcher pill shown on the board ("have a question?
  ask me"): **spec 008**. `LlmChat.tsx` is untouched.
- The board's slim header (Index / Projects / 06 Contact) and the EN/HY
  toggle: the shared `Header.tsx` is kept, unchanged. The header
  nav-wrap fix is its own later task.
- Rewording `title`, `description`, `highlights` or `technologies` in
  `data.ts` (Davit, 2026-10-16: use as is). `system-prompt.ts` is not
  changed: it reads only those four fields, so the chat sees the same
  project text as today, in the new order, and never sees `period` or
  `nda`.
- The fixed consent banner (until dismissed) and the chat launcher may
  overlap the bottom edge of a pinned chapter, as they overlap the
  bottom of every page today. Req 7's fit rule does not reserve space
  for them.
- New images or new image files. Alt text stays `"{title} screenshot"`.
- Changing `/projects` metadata (title and description stay as today).

## Interface contract

- **Component props / exports:** `Project` gains `period: string` and
  `nda: boolean` (both required; all seven entries set them). One
  exported function in `src/lib/data.ts` returns a project's figure
  number (index + 3; name is a plan decision). The `projects` order is a
  contract: most recent first, figure numbers follow it, home Proof uses
  indexes 1, 2, 3.
- **Anchors other specs rely on:** `#fig3` to `#fig9` on `/projects`,
  on in-flow anchor elements before each article. 007's rail highlight
  must not treat "intersecting" as "active" for the sticky articles
  themselves: pinned articles stay intersecting while covered.
- **Files:** `src/app/projects/page.tsx` rewritten; new chapter and rail
  components under `src/components/projects/` (names are a plan
  decision); `src/components/home/ProofSection.tsx` featured indexes,
  captions and links; `src/lib/data.ts` order, two fields, figure-number
  function; `src/app/globals.css` the reduced-motion scroll rule
  (Req 9); `specs/005-monograph-home-page.md` one amendment line (Req
  17). `src/components/ProjectCard.tsx` is imported only by
  `src/app/projects/page.tsx` today and becomes unused; deleting it
  falls under CLAUDE.md rule 14, so the implementation plan lists it and
  Davit confirms then.
- **Routes in `out/`:** `projects.html` (unchanged path).

## Verification

All pnpm commands use `--ignore-workspace` (ERRORS.md, 2026-10-09).
After any build, restart the dev server before trusting a browser
reading (ERRORS.md, same date).

1. `pnpm --ignore-workspace run build` succeeds; `out/projects.html`
   exists (Req 4).
2. In `out/projects.html` (a single-line file, so count matches, not
   lines): `grep -o 'id="fig[3-9]"' out/projects.html | sort -u` lists
   `fig3` to `fig9`; `grep -o '<h1' out/projects.html | wc -l` is 1;
   `grep -o '<h2' out/projects.html | wc -l` is 8 (seven chapters plus
   the closing heading); `grep -o 'aria-labelledby' out/projects.html |
   wc -l` is at least 7; `grep -o 'Fig\. [3-9]' out/projects.html | sort
   -u` lists Fig. 3 to Fig. 9 (Req 3, 5, 6).
3. `grep -n "period:\|nda:" src/lib/data.ts` shows the values and order
   of the Req 2 table, and `pnpm --ignore-workspace exec tsc --noEmit`
   passes (Req 1, 2).
4. In `out/index.html`, the Proof captions read Fig. 4, Fig. 5, Fig. 6
   in that order, over the trading, Prestige Motors and Energy Machines
   cards, and the card links go to `/projects#fig4`, `#fig5`, `#fig6`
   (Req 3, 17).
5. In `out/projects.html`: every `target="_blank"` carries
   `rel="noopener noreferrer"`; every chapter image has `alt="... screenshot"`
   and `loading="lazy"`. `grep -rnE '#[0-9A-Fa-f]{3,8}\b'
   src/components/projects src/app/projects` returns nothing (Req 6,
   16).
6. `pnpm --ignore-workspace run dev`, http://localhost:3000/projects at
   1440x900: scroll from the intro to the end; each chapter pins under
   the header and the next one slides over it; the rail stays in view on
   the right (Req 7, 10).
7. Same at 1024x768, 1280x720 and 1366x768: either every chapter pins
   and the tech chips and action buttons of each come fully into view
   before the next chapter covers them, or (outside both Req 7 bands) no
   chapter pins at all. A mix never occurs (Req 7, 8).
8. Same at 900x900: chapters are single column and static, rail hidden
   (Req 6, 8, 10).
9. Click rail "05": chapter Fig. 5's top rule sits directly below the
   header. Scroll until Fig. 8 is pinned, then click "05": Fig. 5 is on
   top again. Open http://localhost:3000/projects#fig8 in a new tab:
   same for Fig. 8 (Req 11).
10. At 1440x900 and at 375px, on `/`, click the Fig. 5 Proof card: the
    page lands on `/projects` with Fig. 5's top rule directly below the
    header (Req 11, 17).
11. Click rail "05", then the header's "02 Proof" link, then Back: the
    browser returns to `/projects` at Fig. 5 and the page renders (Req
    10).
12. Tab from the top of the page to the footer, then Shift+Tab back up:
    every focused control is visible and none sits under a later chapter
    or the header (Req 12).
13. DevTools rendering: emulate `prefers-reduced-motion: reduce`;
    chapters no longer pin and scroll as a plain list, and a rail or
    hash jump is instant (Req 8, 9).
14. DevTools device mode at 1023px, 720px and 375px: chapters static and
    single column, rail hidden, no horizontal scroll
    (`document.documentElement.scrollWidth === innerWidth`); at 375px
    the intro `h1` and closing `h2` match the Req 15 sizes (Req 8, 10,
    15).
15. Fig. 3 (cryptographic platform) shows the grid placeholder and
    "No public figure · client confidential"; Fig. 3 and Fig. 4 show the
    NDA chip; Fig. 5 shows "Live site ↗" to `https://pgm.am`; Fig. 9
    shows "Code ↗" to GitHub; every button and rail link measures at
    least 44px tall in DevTools (Req 6, 10).
16. The closing section shows "Want the one that is under NDA
    explained? Ask the assistant." and "Back to index" goes to `/`
    (Req 13).
17. In DevTools, for the article after `#fig5`, walk `parentElement` up
    to `html` and check each computed `overflow-x` and `overflow-y`:
    each is `visible` or `clip` (Req 14).
18. Toggle dark theme: text, rules, chips and the duotone (screen blend)
    all switch; no element stays light (Req 16).
19. `grep -ri "<trading client name>\|<target pay figures>" src/ out/
    specs/` returns nothing; run it with the real name and figures
    typed locally, never written into a file (Req 18).
20. Chat widget opens and answers on `/projects`; consent banner appears
    on a fresh profile (regression of specs 001, 002).

## Open questions

All six from the first draft answered by Davit on 2026-10-16:

1. TERASEYA period: `2021` (a Codeep project).
2. Cryptographic platform period: `2025 to present` (ongoing role).
3. Chapter copy: `data.ts` text as is.
4. Order: `projects` reordered most recent first; the intro says so.
5. Closing heading: the board's singular.
6. NDA chip: both the trading and the cryptographic platform.

Answered by Davit on 2026-10-16 (the defaults stand):

7. Home Proof card order: figure order (trading, Prestige Motors, Energy
   Machines), captioned Fig. 4, Fig. 5, Fig. 6.
8. Equal periods: BlackCatCard / GEKKARD before TERASEYA (today's relative
   order), and the undated note app last.
9. Req 9 scope confirmed: the reduced-motion smooth-scroll override is
   site-wide, one rule in `globals.css`.

No open questions remain.
