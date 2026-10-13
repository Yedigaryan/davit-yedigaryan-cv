# 009 - DY tile mark: header, favicon set, OG image

- **Status:** superseded (not shipped; built on `rebrand/009-logo`, replaced by spec 010 before merge)
- **Date:** 2026-10-13
- **Spec:** 009
- **Supersedes / superseded-by:** superseded-by: 010 (DY chip mark, 2026-10-13); originally amended spec 005 Req 11 "the monogram DY in Fraunces" and its 2026-10-10 amendment "Below 640px the header shows only the DY monogram"

> **Numbering.** 006 (Projects index), 007 (motion, live meter,
> scroll-spy) and 008 (chat terminal restyle) are reserved by spec 004
> lines 17-18 and spec 005 line 6, so this spec takes 009. The README
> rule "next number = highest existing + 1" (specs/README.md:71)
> would have given 006 and collided with the reservation.
>
> **Source decision.** MEMORY.md "2026-10-13, Logo final: D2 amber
> tile at 22% radius" (MEMORY.md:795-798). Reference design: the board
> "D2 · Amber tile, refined" (`TileRefined.dc.html`, row labelled
> "22% · now") and "D · Amber tile" (`Tile.dc.html`) on the DY logo
> explorations canvas (claude.ai artifact GsARqjYPskhzMmGoUywc2R). The
> local copies used while drafting were in a temporary session folder
> and will not survive, so the reference markup this spec depends on
> is copied here verbatim (Fraunces loaded from Google Fonts with
> `family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700`):
>
> ```html
> <!-- 200px tile (TileRefined, hero) -->
> <div style="width: 200px; height: 200px; border-radius: 44px; background: #E8A33D; display: flex; align-items: center; justify-content: center"><span style="font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 103px; line-height: 1; letter-spacing: -0.06em; padding-right: 0.06em; color: #15130F">DY</span></div>
> <!-- 36px header tile, gap 12px to the name -->
> <div style="width: 36px; height: 36px; border-radius: 8px; background: #E8A33D; display: flex; align-items: center; justify-content: center"><span style="font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 19px; line-height: 1; letter-spacing: -0.06em; padding-right: 0.06em; color: #15130F">DY</span></div>
> <!-- 32px favicon, 22% row -->
> <div style="width: 32px; height: 32px; border-radius: 7px; background: #E8A33D; display: flex; align-items: center; justify-content: center"><span style="font-family: 'Fraunces', serif; font-style: italic; font-weight: 700; font-size: 17px; line-height: 1; letter-spacing: -0.06em; padding-right: 0.06em; color: #15130F">DY</span></div>
> <!-- 16px favicon, 22% row, "D" only -->
> <div style="width: 16px; height: 16px; border-radius: 3px; background: #E8A33D; display: flex; align-items: center; justify-content: center"><span style="font-family: 'Fraunces', serif; font-style: italic; font-weight: 700; font-size: 13px; line-height: 1; padding-right: 0.08em; color: #15130F">D</span></div>
> <!-- 240px tile (Tile.dc.html, hero), used for the OG image size -->
> <div style="width: 240px; height: 240px; border-radius: 52px; background: #E8A33D; display: flex; align-items: center; justify-content: center"><span style="font-family: 'Fraunces', serif; font-style: italic; font-weight: 600; font-size: 124px; line-height: 1; letter-spacing: -0.06em; padding-right: 0.06em; color: #15130F">DY</span></div>
> ```
>
> **Flagged: MEMORY.md decisions this spec replaces.**
> - MEMORY.md:373-374 (§8): "Favicon is the rounded headshot at
>   `src/app/icon.png` ... `apple-icon.png` for iOS home-screen." This
>   spec replaces both with the tile.
> - MEMORY.md:724 (2026-10-09 rebrand): "Typeset 'DY' monogram, no
>   image mark." The 2026-10-12 and 2026-10-13 entries already moved to
>   a tile; this spec is where it lands in code.
> - MEMORY.md:98 (§3) describes `public/DY.png` as "logo / OG image".
>   It is neither today (see Current state).
> None of these lines are edited by this spec; they need a MEMORY.md
> update when the spec is approved.
>
> **Flagged tension in the request (blocking, Open question 1).** The
> request asks for an SVG favicon AND "at 16px the favicon shows a
> single D". An SVG is resolution-independent: one SVG file cannot show
> "D" at 16px and "DY" at 32px. If a browser prefers the SVG when both
> an SVG and a bitmap are offered (I believe current Chrome and Firefox
> do; **unverified**), the logged "D at 16" decision would reach almost
> no one. The requirements below follow the recommended option (no SVG
> favicon, a two-frame `favicon.ico`); Open question 1 lists what
> changes under the other options.
>
> **Current state (read 2026-10-13).**
> - Header brand link: `src/components/Header.tsx:79-82`. A Next
>   `<Link href="/">` with `onClick={() => setHash('')}` (line 79), a
>   Fraunces "DY" text span at `--fs-d5` (22px) in `text-primary`
>   (raw amber, line 80), and the name span `hidden ... sm:inline`
>   (line 81), so below 640px the name is `display: none` and the
>   link's accessible name is "DY".
> - Favicons: `src/app/icon.png` and `src/app/apple-icon.png`, both the
>   headshot photo (square with a white margin, not rounded). A past
>   build snapshot, `out/index.html` (build date unknown, possibly
>   stale), shows Next emitted them as
>   `<link rel="icon" href="/icon.png?57e3b7ce8c72e1b8" type="image/png" sizes="256x256"/>`
>   and
>   `<link rel="apple-touch-icon" href="/apple-icon.png?ae2d9da5491242f5" type="image/png" sizes="180x180"/>`,
>   so `icon.png` is 256x256 and `apple-icon.png` is 180x180 per Next's
>   own `sizes`. `file` and `sips` could not be run while drafting;
>   these sizes come from that HTML, not from a measurement.
> - `public/DY.png`: also the headshot, 800x800 (measured with `sips`
>   2026-10-13). Referenced nowhere in
>   `src/`, `scripts/`, `public/.htaccess` or the emitted
>   `out/index.html`; copied to `out/DY.png` and so deployed at
>   `/DY.png`.
> - No `favicon.ico`, `icon.svg`, web manifest, `opengraph-image.*` or
>   `twitter-image.*` exists.
> - OG metadata: `src/app/layout.tsx:29-40` sets `openGraph` with
>   title, description, `type: 'website'` and
>   `url: 'https://davit.yedigaryan.pro'`, but **no image** and **no
>   `metadataBase`**. The snapshot `out/index.html` has no `og:image`
>   and has `twitter:card` = `summary`. No child route sets its own
>   `openGraph`: `src/app/projects/page.tsx:5-9` sets title and
>   description only; the four stubs use `stubMetadata()`
>   (`src/components/RedirectStub.tsx:8-14`: title, robots, and an
>   already absolute `alternates.canonical` built from
>   `https://davit.yedigaryan.pro`).
> - Static export: `next.config.ts:4` `output: 'export'`, Next
>   `15.5.20` (`package.json:27`). The snapshot shows the static image
>   file conventions (`icon.png`, `apple-icon.png`) work under export
>   in this repo, with a content-hash query string that busts the
>   30-day PNG/SVG cache in `public/.htaccess:15-17`.
> - `public/.htaccess:46-49` rewrites any missing file to
>   `/index.html`, so `/favicon.ico` today likely returns the home page
>   HTML with status 200 (**unverified** on the live server).
>
> **Contrast (WCAG 2.x relative luminance).** Linearise each sRGB
> channel `c = v/255`: `c <= 0.04045 ? c/12.92 : ((c + 0.055)/1.055)^2.4`;
> `L = 0.2126 R + 0.7152 G + 0.0722 B`; ratio
> `= (L_lighter + 0.05) / (L_darker + 0.05)`. Computed by hand while
> drafting; Verification 7 re-runs it.
>
> | Colour | R, G, B | Linear R, G, B | L |
> | --- | --- | --- | --- |
> | ink `#15130F` | 21, 19, 15 | 0.00750, 0.00651, 0.00478 | 0.00660 |
> | amber `#E8A33D` | 232, 163, 61 | 0.80695, 0.36625, 0.04667 | 0.43687 |
> | paper `#F4F1EA` | 244, 241, 234 | 0.90466, 0.87962, 0.82279 | 0.88084 |
> | dark paper `#0E0D0B` | 14, 13, 11 | 0.00439, 0.00402, 0.00335 | 0.00405 |
>
> | Pair | Arithmetic | Ratio |
> | --- | --- | --- |
> | ink on amber (the glyphs) | 0.48687 / 0.05660 | **8.60:1** (AA and AAA; matches `globals.css:26`) |
> | ink on paper | 0.93084 / 0.05660 | 16.45:1 |
> | ink on dark paper | 0.05660 / 0.05405 | 1.05:1 (ink never sits on dark paper directly; always on the tile) |
> | amber tile on paper | 0.93084 / 0.48687 | 1.91:1 |
> | amber tile on dark paper | 0.48687 / 0.05405 | 9.01:1 |
>
> The tile edge on light paper is 1.91:1. WCAG 1.4.3 exempts text that
> is part of a logo ("logotypes"), and the tile edge conveys no
> information or state, so this is not a failure. It is recorded so
> nobody "fixes" it with a variant tile (a dark-mode tile was rejected
> 2026-10-13). The keyboard focus ring around the link is unaffected:
> `--focus-ring` is `#9A5B06` light (4.81:1 on paper) and `#E8A33D`
> dark (9.01:1 on dark paper), `globals.css:30,79`.

## Intent

Replace the text "DY" in the header and the headshot favicons with
the approved amber tile mark, and give the site its first OG image, so
the brand reads the same in the header, the browser tab, an iOS home
screen and a link preview. Every asset is pre-rendered from outlined
glyphs, so nothing depends on Fraunces loading.

## Behavioral Requirements

### Outlined glyphs (shared by every surface)

1. WHEN the outline script runs THEN it writes three glyph sets from
   the Fraunces italic variable font, each as SVG path data in a tile
   coordinate space where the side is 100 units, with glyph placement
   reproducing the reference CSS layout above (line-height 1, centred
   line box, the padding-right compensation):
   - **A:** "DY", wght 600, letter-spacing -0.06em, used where the
     tile is larger than 32px (header 36px, apple icon, OG image).
   - **B:** "DY", wght 700, letter-spacing -0.06em, used at 32px.
   - **C:** "D", wght 700, no letter-spacing, used at 16px.
   Default optical size: A at opsz 19, B at opsz 17, C at opsz 13 (the
   CSS font sizes the reference uses at 36, 32 and 16px; assumes the
   reference rendered with the browser's automatic optical sizing,
   **unverified**; see Open question 5). Kerning is applied as the
   browser would. The wght, opsz and any other axis values (SOFT and
   WONK at the font's defaults; which defaults `next/font` serves is
   **unverified**) are written in a header comment of the generated
   file, together with the font file's source URL and SHA-256.

2. WHEN the generated outline file, the header component or any icon
   source is searched THEN it contains no `<text>` element and no
   `font-family`: the glyphs are paths only.

3. WHEN the script is run a second time with the same font file THEN
   every file it writes is byte-identical (`git status --porcelain`
   shows nothing).

4. WHEN set A is rendered as a 200px tile beside the reference 200px
   tile markup above (rendered in Chrome with the Google Fonts link)
   and overlaid at 50% opacity THEN glyph edges differ by at most
   2 CSS px. Sets B and C, shown at 400% zoom beside the reference
   32px and 16px tiles, are approved by Davit by eye.

5. WHEN `pnpm --ignore-workspace run build` runs THEN it does not run
   the outline script, does not need the font file and makes no
   network request for it: the generated files are committed.

### Header mark

6. WHEN any page renders THEN the brand link (`Header.tsx:79`) shows,
   in place of the Fraunces "DY" span (`Header.tsx:80`), an inline
   `<svg>` 36x36 CSS px: a rounded square with corner radius 22% of
   the side (7.92px), fill `#E8A33D`, with glyph set A filled
   `#15130F`.

7. WHEN the theme is light, dark or system THEN the mark's colours are
   the literal values `#E8A33D` and `#15130F` (not theme variables), so
   the mark is identical in both themes.

8. WHEN web fonts are blocked or have not loaded yet THEN the mark
   looks exactly as when they have loaded (follows from Req 2).

9. WHEN the viewport is 640px or wider THEN the full name shows beside
   the tile with its existing styles (`--fs-m4`, uppercase, tracking
   0.12em, `text-secondary`, `Header.tsx:81`), 12px from the tile and
   vertically centred on it. WHEN the viewport is narrower than 640px
   THEN only the tile is visible (spec 005 amendment kept; Open
   question 6).

10. WHEN the brand link is clicked from `/`, from `/#<section>` or from
    `/projects` THEN the browser goes to `/` at the top and no section
    link carries `aria-current` (the existing `onClick={() =>
    setHash('')}` at `Header.tsx:79` is kept unchanged).

11. WHEN assistive technology reads the brand link THEN its accessible
    name is "Davit Yedigaryan" at every viewport width. The `<svg>` is
    `aria-hidden="true"` and `focusable="false"`; below 640px the name
    span is visually hidden (screen-reader only) instead of
    `display: none`. Today `hidden` drops the name below 640px and the
    name is "DY"; with the SVG hidden and nothing else changed, it
    would be empty.

12. WHEN the brand link's box is measured at 375px and at 1280px THEN
    it is at least 44x44 CSS px (MEMORY.md §8 tap targets); the tile
    inside stays 36x36.

13. WHEN the brand link has keyboard focus THEN the global
    `:focus-visible` outline (`globals.css:198-204`, 2px
    `--focus-ring`, offset 2px) is visible around the link box in
    light and dark mode.

14. WHEN the header renders at 375px and 1280px THEN its height is not
    greater than on `main` at 76f5c9d and the 375px page has no
    horizontal scroll.

### Favicon set (recommended Open question 1 option)

15. WHEN the site is built THEN `out/favicon.ico` exists, produced from
    `src/app/favicon.ico`, with exactly two frames:
    - 16x16: the tile, radius 22% (3.52px), transparent outside the
      rounded corners, glyph set C ("D").
    - 32x32: the tile, radius 22% (7.04px), transparent corners, glyph
      set B ("DY").
    (The reference rounds the 16px radius to 3px and the 32px radius
    to 7px; the generated files use 22% exactly, a difference under
    0.6px.)

16. WHEN any page in `out/` is inspected THEN its `<link rel="icon">`
    tags point only to the favicon from Req 15; no tag points to
    `icon.png` or any headshot. (The exact tag Next emits for
    `favicon.ico`, including its `sizes` value, is **unverified**.)

17. WHEN a browser tab shows the site THEN the tab icon is the amber
    tile: on a 1x display the "D" frame, on a 2x display the "DY"
    frame. That browsers pick the ICO frame by device pixel ratio is
    **unverified** and is checked in Verification 12.

18. WHEN any page in `out/` is inspected THEN
    `<link rel="apple-touch-icon">` has `sizes="180x180"` and points
    to `apple-icon.png`, which is 180x180, fully opaque, a full-bleed
    `#E8A33D` square with **no** rounded corners, and glyph set A at
    the tile's proportions. This is a deliberate exception to the 22%
    radius: iOS applies its own corner mask and fills transparent
    pixels with black.

19. WHEN `src/app/` and `out/` are listed THEN neither contains
    `icon.png`, and no icon in the site shows the headshot.

### OG image

20. WHEN `out/index.html` is inspected THEN it has an `og:image` whose
    URL is absolute and starts with
    `https://davit.yedigaryan.pro/opengraph-image.png` (Next may append
    a hash query), with `og:image:width` 1200, `og:image:height` 630
    and `og:image:type` `image/png`. This needs
    `metadataBase: new URL('https://davit.yedigaryan.pro')` in the
    `metadata` export (`layout.tsx:29`); without it the URL would be
    relative or `localhost`. `og:url` stays as today, and the stubs'
    canonical URLs stay exactly as today (they are already absolute,
    `RedirectStub.tsx:12`).

21. WHEN `opengraph-image.png` is opened THEN it is 1200x630, opaque,
    paper `#F4F1EA` background, with one 240x240 tile (radius 22% =
    52.8px, the `Tile.dc.html` hero size) centred, glyph set A, and no
    other text or imagery (Open question 4).

22. WHEN `out/index.html` is inspected THEN `og:image:alt` reads
    "DY monogram of Davit Yedigaryan" (from an
    `opengraph-image.alt.txt` next to the image; emission under static
    export is **unverified**).

23. WHEN `out/projects.html` and the four redirect stubs are
    inspected THEN they carry the same `og:image` as the home page.
    Expected because the image sits at the app root and no child route
    sets its own `openGraph` (see Current state); that a root-level
    `opengraph-image.png` reaches child routes under static export is
    **unverified** and checked in Verification 4.

## Non-goals

- An SVG favicon (`icon.svg`), unless Open question 1 picks option b
  or c.
- A web app manifest and 192/512 or maskable icons. None exists today
  (Open question 8).
- `twitter-image`, or switching `twitter:card` from `summary` to
  `summary_large_image` (Open question 9).
- A dark-mode tile, the B2 chip, radii of 8% or 30% (rejected
  2026-10-13).
- Hover, press or load animation on the tile. Motion is spec 007.
- The footer line "DY · Davit Yedigaryan · Yerevan"
  (`Footer.tsx:13`) stays text; its colour is not touched here.
- Dynamic OG generation (`opengraph-image.tsx` with `ImageResponse`)
  and per-page OG images. A static PNG avoids font loading entirely.
- Per-page OG titles (the Projects page inherits the home `og:title`
  today; unchanged).
- Changes to `public/.htaccess` (for example caching rules for
  `.ico`), `viewport.themeColor` (`layout.tsx:46-49`) or the
  create-next-app SVGs in `public/`.
- Running the outline script as part of `pnpm build` or deploy.
- Safari pinned-tab `mask-icon`.
- Editing MEMORY.md or spec 005; that happens after approval, per the
  README.

## Interface contract

- **Env vars:** none.
- **Component props / exports:**
  - New `src/components/LogoMark.tsx`, default export `LogoMark()`
    with no props: the 36x36 inline SVG from Req 6. Used only by
    `Header.tsx`.
  - New generated file `src/lib/logo-paths.ts` (header comment
    "generated by scripts/logo/build-logo.*, do not edit", plus the
    font source, SHA-256 and axis values from Req 1), exporting the
    path data of sets A, B and C in the 100-unit tile space. Both
    `LogoMark.tsx` and the script's raster output use this data, so
    there is one source for the glyph shapes.
  - `layout.tsx` `metadata` gains `metadataBase`; nothing else in
    `metadata` or `viewport` changes.
- **Script:** `scripts/logo/build-logo.*`, run by hand with the path
  to the Fraunces italic variable font as its argument. It writes
  `src/lib/logo-paths.ts`, `src/app/favicon.ico`,
  `src/app/apple-icon.png`, `src/app/opengraph-image.png`. Tooling
  and new dependencies are Open question 2.
- **Files/artifacts that must land in `out/`:** `favicon.ico`,
  `apple-icon.png`, `opengraph-image.png`. Must be absent from
  `out/`: `icon.png` and `DY.png` (Open question 3: delete).
- **Static export checks for implementation (unverified):**
  `favicon.ico`, `opengraph-image.png` and `opengraph-image.alt.txt`
  as app-root file conventions under `output: 'export'`. If any of
  them is not emitted, the fallback is the same file in `public/`
  declared through `metadata.icons` or `metadata.openGraph.images`;
  that loses Next's hash query, so the 30-day cache in
  `.htaccess:15-17` applies to returning visitors.
- **Deletions and overwrites (CLAUDE.md rule 14; approving this spec
  is the confirmation, the implementation plan lists them again):**
  - Delete `src/app/icon.png` (headshot, 256x256 per the emitted
    `sizes`).
  - Overwrite `src/app/apple-icon.png` (headshot, 180x180 per the
    emitted `sizes`) with the tile from Req 18.
  - Delete `public/DY.png` (headshot, 800x800 measured with `sips`
    2026-10-13; Open question 3 answered: nothing outside links to it).
  - The deploy command in MEMORY.md §11 (`lftp mirror -R --delete`)
    then also removes `/icon.png` and `/DY.png` from the
    live server.

## Verification

Build with the working command (ERRORS.md: plain `pnpm run build`
fails in this repo), and never take a browser reading from a dev
server that was running during the build (ERRORS.md).

1. `pnpm --ignore-workspace run build` succeeds;
   `ls out/favicon.ico out/apple-icon.png out/opengraph-image.png`
   lists all three; `ls out/icon.png src/app/icon.png` fails for both
   (Req 15, 18, 19, 21).
2. `file src/app/favicon.ico` reports two icons, 16x16 and 32x32;
   `sips -g pixelWidth -g pixelHeight src/app/apple-icon.png
   src/app/opengraph-image.png` reports 180x180 and 1200x630 (Req 15,
   18, 21).
3. `grep -oE '<link rel="(icon|apple-touch-icon)"[^>]*>' out/index.html`
   shows the favicon and the 180x180 apple icon and nothing with
   `icon.png` (Req 16, 18).
4. OG and canonical (Req 20, 22, 23):
   - `grep -oE '<meta property="og:image[^>]*>' out/index.html` shows
     the URL starting `https://davit.yedigaryan.pro/opengraph-image.png`,
     width 1200, height 630, type `image/png` and the alt text.
   - `grep -c 'localhost' out/index.html` is 0.
   - Repeat the first grep on `out/projects.html`, `out/about.html`,
     `out/skills.html`, `out/experience.html`, `out/contact.html`:
     same `og:image`.
   - `grep -o '<link rel="canonical"[^>]*>' out/about.html` shows
     `https://davit.yedigaryan.pro/#profile`, unchanged from before
     (same check for the other three stubs).
5. `grep -nE '<text|font-family' src/components/LogoMark.tsx
   src/lib/logo-paths.ts` prints nothing (Req 2).
6. Run the outline script twice with the same font file;
   `git status --porcelain src/lib/logo-paths.ts src/app/` is empty
   after the second run (Req 3). `pnpm --ignore-workspace run build`
   with the font file moved away still succeeds (Req 5).
7. Contrast arithmetic (expected output `8.60 16.45 1.91 9.01 1.05`):
   ```
   node -e 'const L=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};const r=(a,b)=>{const[x,y]=[L(a),L(b)].sort((p,q)=>q-p);return((x+.05)/(y+.05)).toFixed(2)};console.log(r("#15130F","#E8A33D"),r("#15130F","#F4F1EA"),r("#E8A33D","#F4F1EA"),r("#E8A33D","#0E0D0B"),r("#15130F","#0E0D0B"))'
   ```
8. Save the reference markup from the top of this spec as an HTML file
   in a scratch folder (with the Google Fonts link), open it in Chrome
   beside a 200px render of set A, and overlay at 50% opacity: edges
   within 2px. Show sets B and C at 400% beside the reference 32px and
   16px tiles for Davit's approval (Req 4).
9. Restart the dev server after the build, then
   `pnpm --ignore-workspace run dev`, http://localhost:3000/:
   - DevTools device mode 375px, light then dark: only the tile shows,
     36x36, amber with ink "DY", the same in both themes; the link's
     box is at least 44x44 (Elements, box model); no horizontal
     scroll; header height not greater than on 76f5c9d (Req 6, 7, 9,
     12, 14).
   - 1280px, light then dark: tile plus mono name, the name vertically
     centred on the tile, 12px gap (Req 9).
10. DevTools, Network, block request URL pattern `*.woff2`, hard
    reload: the tile glyphs look the same as before blocking (Req 8).
11. Behaviour and accessibility at 375px and 1280px:
    - From `/#stack`, click the tile: URL is `/`, page at the top, no
      section link has `aria-current`. Same from `/projects` (Req 10).
    - Accessibility pane on the brand link: name "Davit Yedigaryan" at
      both widths; the `<svg>` is not in the tree (Req 11).
    - Tab to the brand link: focus outline visible in light and dark
      (Req 13).
12. Tab icon against the built site, in a fresh browser profile
    (browsers cache favicons hard): `pnpm --ignore-workspace run
    serve`, then
    `open -na "Google Chrome" --args --user-data-dir="$(mktemp -d)" http://localhost:3000`.
    On the Retina screen the tab shows the amber tile with "DY". Repeat
    with `--force-device-scale-factor=1` added: the tab shows "D".
    Repeat the plain check in a Safari and a Firefox private window
    (Req 17).
13. Open `out/apple-icon.png` in Preview on a dark background: no
    transparent or rounded corners (Req 18). Open
    `out/opengraph-image.png`: paper background, one centred tile,
    nothing else (Req 21).
14. Regression of spec 005: the six section links, Projects, theme
    toggle and mobile menu behave as before (spec 005 Verification 8).
15. After deploy only, and only when Davit decides to: check the live
    preview in a link-preview inspector of his choice. Not part of the
    pre-merge checks (CLAUDE.md rules 8 and 15).

## Open questions

Blocking:

- [x] **1. Favicon format vs "D at 16".** Answered 2026-10-13: **a**
  (ICO only, no SVG favicon). One SVG cannot show "D" at
  16px and "DY" at 32px.
  - a. *(Recommended)* `favicon.ico` with a 16px "D" frame and a 32px
    "DY" frame, no SVG favicon. This is the only option where the
    logged "D at 16" holds in every browser, and it needs the fewest
    files. It drops the SVG favicon from the brief.
  - b. Option a plus `icon.svg` showing "DY" (set B). This matches the
    brief. Browsers that prefer the SVG (I believe Chrome and Firefox;
    unverified) show "DY" at 16 CSS px, so on 1x screens the tab gets
    "DY", not "D". Adds a requirement for `icon.svg` and changes Req
    16-17; whether `icon.svg` can sit beside `favicon.ico` as file
    conventions is unverified.
  - c. Option a plus `icon.svg` showing "D" only. Every tab shows "D",
    on Retina too; "DY" appears only where a 32px bitmap is
    requested.
- [x] **2. Outlining and rasterising toolchain.** Answered 2026-10-13:
  **a** (Node script plus devDependencies). Sub-question answered:
  the font is not committed; the script fetches a pinned google/fonts
  URL and checks its SHA-256. Any new dependency
  needs your yes.
  - a. *(Recommended)* A Node script, `scripts/logo/build-logo.mjs`,
    with devDependencies for variable-font outlines (`fontkit`), SVG
    to PNG (`@resvg/resvg-js`) and ICO packing (`png-to-ico`). The
    package names are my picks, and their exact abilities (for
    example opsz instancing in fontkit) are unverified.
  - b. Python (`fonttools` plus `Pillow`) outside pnpm. `package.json`
    stays unchanged, but you need a Python install.
  - c. A one-off manual outline in a design tool, with the outputs
    committed. This is not reproducible, so Req 3 is dropped.
  - Sub-question: is the font file committed? Fraunces is OFL, which I
    believe allows that (unverified). Or do we record a pinned
    google/fonts URL and its SHA-256 only?
- [x] **3. `public/DY.png`.** Answered 2026-10-13: nothing outside
  links to it; **delete it**. It is unreferenced in the code and the
  built HTML, but it is live at `/DY.png`, and the `--delete` mirror
  will remove it. Does anything outside the site link to it (LinkedIn
  featured section, email signature, an old CV)? If not, delete it
  (recommended). If so, keep it.

Non-blocking (the default applies if there is no answer):

- [ ] 4. OG image content. The default is the tile alone on paper.
  The alternatives are tile plus name and title, which needs more
  outlined glyphs (JetBrains Mono too), or dark paper behind the
  tile.
- [ ] 5. Optical size. Set A is outlined at opsz 19 and reused at
  180px and 240px, where the reference rendered it at opsz of roughly
  93 to 124, so the large uses look slightly sturdier. The default is
  to accept that. The alternative is a fourth set at opsz 124 for the
  apple icon and the OG image.
- [ ] 6. Below 640px, only the tile shows. The default keeps this
  (spec 005 amendment).
- [ ] 7. Accessible name. The default is "Davit Yedigaryan". The
  alternative is "Davit Yedigaryan, home".
- [ ] 8. Web manifest with 192 and 512 icons. The default is none,
  because the site is not an installable app.
- [ ] 9. Twitter card. The default leaves `twitter:card` as `summary`
  (a small square crop on X). The alternative is to set
  `summary_large_image`.

## Amendments (implementation plan, 2026-10-13)

Source: `docs/superpowers/plans/2026-10-13-dy-tile-mark.md`, "Rulings".
Three throwaway builds of `main` with the generated icons in place
were run on 2026-10-13.

- **Req 20, 21, 22 and the Interface contract: OG image without
  `metadataBase`.** With `metadataBase` set, Next rewrote the four stub
  canonicals from `https://davit.yedigaryan.pro/#profile` (etc.) to
  `https://davit.yedigaryan.pro`, breaking "stay exactly as today".
  The OG image is therefore `public/og.png` (served at `/og.png`),
  declared in `layout.tsx` as
  `openGraph.images: [{ url: 'https://davit.yedigaryan.pro/og.png',
  width: 1200, height: 630, type: 'image/png', alt: 'DY monogram of
  Davit Yedigaryan' }]`. No `metadataBase`, no
  `src/app/opengraph-image.png`, no `opengraph-image.alt.txt`. The
  script writes `public/og.png`. `og:image` carries no hash query.
- **Non-goal "twitter:card stays summary":** Next switches to
  `summary_large_image` whenever an OG image exists, so `layout.tsx`
  sets `twitter: { card: 'summary' }`.
- **Req 4:** the overlay comparison runs at the use sizes (set A at
  36px, B at 32px, C at 16px). Set A is outlined at opsz 19, so a 200px
  overlay against a browser render at opsz about 103 differs by design
  (Open question 5 default).
- **Req 16:** Next emits exactly
  `<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16"/>`.
- **Req 1:** fontkit 2.0.4 instances the variable font; SOFT and WONK
  use the font's own defaults (0 and 1). Pinned source: google/fonts
  commit `4024282d9b0cffcdb8e3024560862746178d741f`, SHA-256
  `b24448c43702fac4ee856781d461a0dfba8d8e594b6e8e190234b75fed2c0e01`.
- **Verification 1 and 4:** read `out/og.png` for
  `out/opengraph-image.png`, and `https://davit.yedigaryan.pro/og.png`
  for the `og:image` prefix.
- **Verification 10:** replaced by a structural check (no `<text>` in
  the rendered mark), because the built-in browser cannot block
  requests. Verification 12 and the Req 4 approval of sets B and C are
  Davit's checks.

## Verification results (2026-10-13)

- Verification 1-7: pass (`t1-generator.sh`, `t2-header.sh`,
  `t3-icons-og.sh`, contrast `8.60 16.45 1.91 9.01 1.05`).
- Verification 8 (Req 4, amended): sets A, B and C overlay the
  reference at 36, 32 and 16px; B and C await Davit's approval.
- Verification 9, 11, 14: pass in the built-in browser at 375 and
  1280px, light and dark (values in the plan ledger).
- Verification 10 (amended): no `<text>` in the rendered mark.
- Verification 12, 15: Davit's checks, not yet run.
