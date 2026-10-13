# 010 - DY chip mark: header, favicon set, OG image

- **Status:** implemented (2026-10-13)
- **Date:** 2026-10-13
- **Spec:** 010
- **Supersedes / superseded-by:** supersedes 009 (DY tile mark, built on `rebrand/009-logo`, never merged). Amends spec 005 Req 11 "the monogram DY in Fraunces" and its 2026-10-10 amendment "Below 640px the header shows only the DY monogram".

> **Source decision.** MEMORY.md "2026-10-13, Logo switched: B2 chip
> replaces the D2 tile (spec 010 supersedes 009)", which overrides
> "2026-10-13, logo final D2 at 22%". Answers given 2026-10-13: header
> mark 40px (as on the board), favicon an ICO on a paper square, apple
> icon and OG image the light chip on paper.
>
> **Reference design.** The board "DY mark B2, chip refined"
> (`ChipRefined.dc.html`) on the DY logo explorations canvas (claude.ai
> artifact GsARqjYPskhzMmGoUywc2R). The local copy is in a temporary
> session folder and will not survive, so the markup this spec depends
> on is copied here verbatim. Fraunces is loaded from Google Fonts with
> `family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700`.
>
> ```html
> <!-- L: hero 280px, header 40px, favicon cell 64px. Light; dark swaps #9A5B06 -> #E8A33D and #15130F -> #ECE7DA -->
> <svg viewBox="0 0 100 100" width="40" height="40"><path d="M41 20A9 9 0 0 0 59 20Z" fill="#9A5B06"></path><path d="M20 20H43A7 7 0 0 0 57 20H80V80H20Z" fill="none" stroke="#15130F" stroke-width="5"></path><path d="M35 20V8M65 20V8M35 80V92M65 80V92M20 35H8M20 65H8M80 35H92M80 65H92" stroke="#15130F" stroke-width="5" stroke-linecap="square" fill="none"></path><text x="47" y="61" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-weight="600" font-size="30" letter-spacing="-1.5" fill="#15130F">DY</text></svg>
> <!-- M: favicon 32px (drawn 30px inside a 32px paper cell) -->
> <svg viewBox="0 0 100 100" width="30" height="30"><path d="M40 20A10 10 0 0 0 60 20Z" fill="#9A5B06"></path><path d="M20 20H42A8 8 0 0 0 58 20H80V80H20Z" fill="none" stroke="#15130F" stroke-width="7"></path><path d="M35 20V8M65 20V8M35 80V92M65 80V92M20 35H8M20 65H8M80 35H92M80 65H92" stroke="#15130F" stroke-width="7" stroke-linecap="square" fill="none"></path><text x="47" y="63" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-weight="700" font-size="34" letter-spacing="-2" fill="#15130F">DY</text></svg>
> <!-- S: favicon 16px, solid notched block, DY knocked out in paper -->
> <svg viewBox="0 0 100 100" width="16" height="16"><path d="M8 8H38A12 12 0 0 0 62 8H92V92H8Z" fill="#15130F"></path><text x="47" y="70" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-weight="700" font-size="46" letter-spacing="-3" fill="#F4F1EA">DY</text></svg>
> ```
>
> On the board the favicon cells sit on a `#F4F1EA` (light) or
> `#0E0D0B` (dark) square with a 1px border; the border is board
> framing, not part of the icon.
>
> **Relation to spec 009.** Spec 009 and its implementation exist only
> on `rebrand/009-logo` (commits 556bac1 to 779bf2e, not merged, not
> pushed). This spec reuses, from that branch: the outline-and-raster
> pipeline (`scripts/logo/build-logo.mjs`, devDependencies `fontkit
> ^2.0.4`, `@resvg/resvg-js ^2.6.2`, `png-to-ico ^3.0.2`, the pinned
> font URL and SHA-256), the `LogoMark` slot in the header, the OG
> metadata shape (no `metadataBase`, absolute `public/og.png`,
> `twitter: { card: 'summary' }`), the `-my-px` and `shrink-0` fixes
> on the brand link, and the deletions of the headshot icons. Its
> findings carry over unchanged: `metadataBase` strips `#section` from
> the redirect-stub canonicals, any OG image flips `twitter:card` to
> `summary_large_image` (ERRORS.md, spec 009), Tailwind v4
> `not-sr-only` sets `white-space: normal`
> (`node_modules/tailwindcss/dist/lib.js`, checked 2026-10-13), and
> Next emits the ICO link as
> `<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16"/>`
> (spec 009 amendment).
>
> **Flagged: MEMORY.md lines that are now wrong.** MEMORY.md is a
> single gitignored file. Its lines 98 and 373-374 (reference sections
> §3 and §8) were edited on 2026-10-13 to describe the D2 tile as if it
> had shipped; on `main` the headshot icons are still live. They are
> rewritten for the chip when this spec is implemented. Line 723 sits
> inside the dated "2026-10-09, Rebrand direction" decision entry and
> was restored on 2026-10-13 to its original wording ("Typeset "DY"
> monogram, no image mark."); the dated 2026-10-13 entries record the
> change, so line 723 is not touched again.
>
> **Current state on `main` (76f5c9d, read 2026-10-13).**
> - Brand link: `src/components/Header.tsx:79-82`, a Next `<Link
>   href="/">` with `onClick={() => setHash('')}`, a Fraunces "DY"
>   text span at `--fs-d5` in `text-primary`, and the name span
>   `hidden ... sm:inline`, so below 640px the accessible name is "DY".
> - Favicons: `src/app/icon.png` (headshot, 256x256) and
>   `src/app/apple-icon.png` (headshot, 180x180). `public/DY.png`
>   (headshot, 800x800) is unreferenced but deployed at `/DY.png`.
>   Sizes measured with `sips`.
> - OG metadata: `src/app/layout.tsx:29-40`, no image, no
>   `metadataBase`, no `twitter` key. The emitted `twitter:card` value
>   is not verified (the current `out/` is a spec 009 build);
>   Verification 0 records it.
> - Header height: expected 69px at 375px (44px menu button plus
>   `py-3` plus the 1px border) and 67px at 1280px (42px theme toggle
>   plus `py-3` plus the border), by arithmetic. Verification 0
>   measures both.
> - Theme colours: `globals.css` light `--foreground: #15130F`, dark
>   `--foreground: #ECE7DA`; light `--focus-ring: #9A5B06`, dark
>   `--focus-ring: #E8A33D`. Dark `--link-color` is `#F0B454`, so no
>   existing token pairs `#9A5B06` with `#E8A33D` except `--focus-ring`.
>
> **Contrast (WCAG 2.x relative luminance, same formula as spec 009).**
>
> | Pair | Ratio |
> | --- | --- |
> | ink `#15130F` on paper `#F4F1EA` (light chip, 32px favicon) | 16.45:1 |
> | notch `#9A5B06` on paper (light) | 4.81:1 |
> | ink `#ECE7DA` on dark paper `#0E0D0B` (dark chip) | 15.73:1 |
> | notch `#E8A33D` on dark paper | 9.01:1 |
> | paper `#F4F1EA` knocked out of ink `#15130F` (16px favicon) | 16.45:1 |
>
> The notch is decorative; WCAG 1.4.3 exempts logotypes. All pairs
> pass 4.5:1 anyway.

## Intent

Replace the text "DY" in the header and the headshot favicons with the
approved B2 chip mark, and give the site its first OG image, so the
brand reads the same in the header, the browser tab, an iOS home screen
and a link preview. In the header the chip follows the site theme; every
asset is drawn from outlined glyphs, so nothing depends on Fraunces
loading.

## Behavioral Requirements

### Outlined glyphs and chip geometry (shared by every surface)

1. WHEN the outline script runs THEN it computes three "DY" glyph sets
   from the Fraunces italic variable font, as SVG path data in the
   100-unit chip space, placed the way Chrome lays out the reference
   `<text>` (`text-anchor="middle"` at x 47, the given baseline,
   letter-spacing in user units, kerning on):
   - **L:** wght 600, font-size 30, letter-spacing -1.5, baseline 61.
     Used at 40px and larger (header, apple icon, OG image).
   - **M:** wght 700, font-size 34, letter-spacing -2, baseline 63.
     Used in the 32px favicon frame.
   - **S:** wght 700, font-size 46, letter-spacing -3, baseline 70.
     Used in the 16px favicon frame.
   Two layout choices are **unverified** defaults, tested by Req 4:
   - Optical size: opsz 30, 34 and 46, the reference's font-size in
     user units. This assumes Chrome's automatic optical sizing uses
     the SVG user-unit size, not the rendered size.
   - The trailing letter-spacing after "Y" counts in the width that
     `text-anchor="middle"` centres.
   SOFT 0 and WONK 1 (the font's defaults, spec 009 amendment). The
   axis values, the two layout choices as finally used, the font URL
   and the SHA-256 go in the generated file's header comment.

2. WHEN the script and the generated file are read THEN the chip
   shapes for sizes L, M and S (the path `d` strings, stroke widths 5
   and 7, square line caps) match the reference markup above character
   for character. They carry shapes only: no colour literal is
   exported from `src/lib/logo-paths.ts`. That file exports only what
   the header uses (glyph set L and the size-L shapes and stroke
   width); sets M and S, the M and S shapes and the light palette
   literals are constants inside the script, used for the rasters.

3. WHEN `src/lib/logo-paths.ts`, `src/components/LogoMark.tsx` or
   `src/components/Header.tsx` is searched THEN it contains no `<text`
   and no `font-family`.

4. WHEN the reference L markup is rendered in Chrome with the Google
   Fonts link on a `#F4F1EA` page and overlaid at 50% opacity with the
   generated output at the same size THEN the glyph edges differ by at
   most:
   - 1 px at 280px, against the chip in `og.png` (cropped to its
     280px box). At this size a wrong opsz or a 0.75-unit anchor shift
     (about 2px) is visible.
   - 0.5 CSS px at 40px, against the header mark, viewed at 5x zoom
     (2.5 screenshot px).
   If either check fails, the script switches the failing default from
   Req 1 (opsz from the rendered size; trailing letter-spacing left out
   of the centred width), regenerates and the check is rerun; the
   settings that pass are recorded per Req 1. If the opsz switch is
   the one that passes, the header and the 280px chip need different
   opsz values and Open question 3 becomes blocking.
   The 16px and 32px favicon frames are shown beside the reference at
   16 and 32px (M drawn 30px in its 32px cell), at 8x, for Davit's eye
   review, in particular whether the knocked-out "DY" reads at 16px.
   This review is an observation, not a pass condition; Open question
   4 says what happens if he rejects it.

5. WHEN the script runs twice with the same font file THEN every file
   it writes is byte-identical.

6. WHEN `pnpm --ignore-workspace run build` runs THEN it does not run
   the outline script, does not need the font file and makes no network
   request for it.

### Header mark

7. WHEN any page renders THEN the brand link shows, in place of the
   Fraunces "DY" span, an inline `<svg>` 40x40 CSS px, `viewBox="0 0
   100 100"`, drawing the size-L chip and glyph set L with no
   background fill.

8. WHEN the theme is light THEN the chip outline, pins and glyphs are
   `#15130F` and the notch is `#9A5B06`. WHEN the theme is dark, or the
   theme is system and the OS is in dark mode, THEN they are `#ECE7DA`
   and `#E8A33D`. WHEN the theme toggle is used THEN the mark recolours
   without a reload. The ink comes from the existing `--foreground`
   token; the notch from one new token, `--mark-accent`, defined in
   both theme blocks of `globals.css`. Both are applied through CSS,
   not as literal colours in `LogoMark` or `Header`.

9. WHEN web fonts are blocked or have not loaded THEN the mark looks
   the same as when they have loaded (follows from Req 3).

10. WHEN the viewport is 640px or wider THEN the full name shows beside
    the mark with its existing styles (`--fs-m4`, uppercase, tracking
    0.12em, `text-secondary`), 12px from the right edge of the svg box
    (`gap-3`; the visible pins sit 3.2px inside that box), vertically
    centred on it and on one line. This includes a 1024px viewport
    whose layout width is reduced to 1007px by an always-visible
    scrollbar. WHEN the viewport is narrower than 640px THEN only the
    mark is visible.

11. WHEN the brand link is clicked from `/`, `/#<section>` or
    `/projects` THEN the browser goes to `/` at the top and no section
    link carries `aria-current` (the existing `onClick={() =>
    setHash('')}` is kept).

12. WHEN assistive technology reads the brand link THEN its accessible
    name is "Davit Yedigaryan" at every width. The `<svg>` is
    `aria-hidden="true"` and `focusable="false"`; below 640px the name
    span is screen-reader only instead of `display: none`.

13. WHEN the brand link's box is measured at 375px and 1280px THEN it
    is at least 44x44 CSS px and the mark inside is 40x40.

14. WHEN the brand link has keyboard focus THEN the global
    `:focus-visible` outline is visible around the link in light and
    dark mode.

15. WHEN the header renders at 375px and 1280px THEN its height is not
    greater than the `main` baseline measured in Verification 0
    (expected 69px and 67px), and the 375px page has no horizontal
    scroll. On spec 009 the 44px link needed `-my-px` to hold 67px at
    1280px.

### Favicon set

16. WHEN the site is built THEN `out/favicon.ico` exists, produced from
    `src/app/favicon.ico`, with exactly two fully opaque frames, each a
    full `#F4F1EA` square:
    - 16x16: the size-S block in `#15130F` with glyph set S knocked
      out (the paper shows through). The 100-unit box maps to the
      whole 16px square, so the block itself spans units 8 to 92,
      about 13.4px.
    - 32x32: the size-M chip in the light palette (`#15130F` outline,
      pins and glyphs, `#9A5B06` notch) with glyph set M, its 100-unit
      box drawn 30px and centred in the 32px square, as on the board.

17. WHEN any page in `out/` is inspected THEN its only `<link
    rel="icon">` is
    `<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16"/>`
    and no tag points to `icon.png` or a headshot.

18. WHEN a browser tab shows the site THEN the tab icon is one of the
    two ICO frames, never a headshot or the browser's default icon.
    Which frame a browser picks at a given pixel ratio is not
    controlled by this spec; Verification 12 records it as an
    observation.

19. WHEN any page in `out/` is inspected THEN `<link
    rel="apple-touch-icon">` has `sizes="180x180"` and points to
    `apple-icon.png`: 180x180, fully opaque, a full-bleed `#F4F1EA`
    square with no rounded corners, and the size-L chip in the light
    palette with glyph set L, its 100-unit box drawn 140px wide and
    centred (Open question 1).

20. WHEN `src/app/`, `public/` and `out/` are listed THEN none contains
    `icon.png` or `DY.png`, and no icon shows the headshot.

### OG image

21. WHEN `out/index.html` is inspected THEN it has `og:image`
    `https://davit.yedigaryan.pro/og.png`, `og:image:width` 1200,
    `og:image:height` 630, `og:image:type` `image/png` and
    `og:image:alt` "DY monogram of Davit Yedigaryan"; `twitter:card` is
    `summary`; `og:url` and the four redirect stubs' canonical URLs are
    byte-identical to the `main` baseline from Verification 0; the file
    contains no `localhost`.

22. WHEN `og.png` is opened THEN it is 1200x630, opaque, `#F4F1EA`
    background, with the size-L chip in the light palette, its 100-unit
    box drawn 280px wide (the board's hero size) and centred, and no
    other text or imagery (Open question 2).

23. WHEN `out/projects.html` and the four redirect stubs are inspected
    THEN they carry the same `og:image` as the home page.

## Non-goals

- The D2 amber tile, in any surface (superseded).
- An SVG favicon, a theme-following favicon, or a dark favicon. The
  favicon is one fixed light chip on paper (answered 2026-10-13).
- A web app manifest and 192/512 or maskable icons.
- `twitter-image` or `summary_large_image`.
- Hover, press or load animation on the mark (motion is spec 007).
- The footer line "DY · Davit Yedigaryan · Yerevan" stays text.
- Dynamic OG generation and per-page OG images.
- Changes to `public/.htaccess`, `viewport.themeColor` or the
  create-next-app SVGs in `public/`.
- Running the outline script in `pnpm build` or deploy.
- Merging, deleting or rewriting `rebrand/009-logo`; what happens to
  that branch is Davit's call after this spec ships.

## Interface contract

- **Env vars:** none.
- **Tokens:** `globals.css` gains `--mark-accent` (light `#9A5B06`,
  dark `#E8A33D`) in the light block and the `html.dark,
  html[data-theme="dark"]` block. The ink reuses `--foreground`. No
  existing token changes.
- **Component:** `src/components/LogoMark.tsx`, default export
  `LogoMark()` with no props: the 40x40 inline SVG from Req 7-8. Used
  only by `Header.tsx`.
- **Generated file:** `src/lib/logo-paths.ts` (header comment
  "generated by scripts/logo/build-logo.mjs, do not edit", font
  source, SHA-256, axis values, the two layout choices from Req 1).
  Exports glyph set L and the size-L chip shapes and stroke width,
  nothing else (Req 2).
- **Script:** `scripts/logo/build-logo.mjs`, taken from
  `rebrand/009-logo` and changed for the chip; same pinned font URL,
  SHA-256 and devDependencies. Run by hand with the font path. Writes
  `src/lib/logo-paths.ts`, `src/app/favicon.ico`,
  `src/app/apple-icon.png`, `public/og.png`. It checks the HTTP status
  of the font download before hashing (spec 009 deferred minor), and
  fails unless all four rasters are fully opaque: the 16px and 32px
  ICO frames, the apple icon and the OG image.
- **Dependencies:** `package.json` and `pnpm-lock.yaml` gain the three
  devDependencies above. They are new to `main`; spec 009's yes covered
  only its own branch.
- **`layout.tsx`:** `openGraph.images` with the absolute `og.png` URL,
  width, height, type and alt from Req 21, and `twitter: { card:
  'summary' }`. No `metadataBase`.
- **`Header.tsx`:** the brand link gets `LogoMark`, `-my-px`,
  `shrink-0`, `items-center` and the screen-reader-only name span from
  Req 10 and 12.
- **Spec records:** `specs/009-dy-tile-mark.md` is brought onto this
  branch from `rebrand/009-logo` with status "superseded (not
  shipped)" and the field `superseded-by: 010` (`specs/README.md:44`).
  Spec 005 line 6 gets the pointer "; Req 11 and the 2026-10-10 header
  amendment amended by 010 (DY chip mark)".
- **Must land in `out/`:** `favicon.ico`, `apple-icon.png`, `og.png`.
  **Must be absent:** `icon.png`, `DY.png`.
- **Actions that each need Davit's yes in the current message when
  they happen** (CLAUDE.md rules 14 and 15; approving this spec does
  not cover them, the plan lists them again):
  - Adding the three devDependencies to `package.json` and
    `pnpm-lock.yaml`.
  - Deleting `src/app/icon.png` (headshot, 256x256).
  - Overwriting `src/app/apple-icon.png` (headshot, 180x180) with the
    chip from Req 19.
  - Deleting `public/DY.png` (headshot, 800x800; spec 009 Open question
    3: nothing outside links to it).
  - The `lftp mirror -R --delete` deploy (MEMORY.md §11), which also
    removes `/icon.png` and `/DY.png` from the live server.

## Verification

Build with `pnpm --ignore-workspace run build`, and never take a
browser reading from a dev server that was running during the build
(ERRORS.md).

0. Baseline from `main` at 76f5c9d, taken before any change: in a temp
   worktree (`git worktree add --detach <dir> 76f5c9d`, symlink
   `node_modules`, run `./node_modules/.bin/next build`, per ERRORS.md),
   save the `og:url`, `twitter:card` and canonical tags of
   `out/index.html`, `out/projects.html` and the four stubs. Serve that
   `out/` with `npx serve@latest` and measure the header height at
   375px and 1280px in the built-in browser. Remove the worktree after.
1. `rm -rf out`, then the build succeeds; `ls out/favicon.ico
   out/apple-icon.png out/og.png` lists all three; `ls out/icon.png
   out/DY.png src/app/icon.png public/DY.png` fails for all four
   (Req 16, 19, 20, 22).
2. `file src/app/favicon.ico` reports two icons, 16x16 and 32x32;
   `sips` reports 180x180 for `apple-icon.png` and 1200x630 for
   `og.png`; the script's opacity check passes for all four rasters
   (Req 16, 19, 22).
3. `grep -oE '<link rel="(icon|apple-touch-icon)"[^>]*>'` on every
   `out/*.html` shows exactly the tags from Req 17 and 19.
4. On `out/index.html`, `out/projects.html` and the four stubs: the
   `og:image` tags from Req 21, `twitter:card` `summary`, no
   `localhost`; `og:url` and the stub canonicals equal the Verification
   0 baseline byte for byte (Req 21, 23).
5. `grep -nE '<text|font-family' src/components/LogoMark.tsx
   src/components/Header.tsx src/lib/logo-paths.ts` prints nothing;
   `grep -nE '#[0-9A-Fa-f]{6}' src/components/LogoMark.tsx
   src/components/Header.tsx src/lib/logo-paths.ts` prints nothing
   (Req 2, 3, 8).
6. Run the script, record `shasum -a 256` of its four outputs, run it
   again and compare: all four hashes are unchanged. Build with the
   font file moved away still succeeds (Req 5, 6).
7. Contrast arithmetic, expected `16.45 4.81 15.73 9.01`:
   ```
   node -e 'const L=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};const r=(a,b)=>{const[x,y]=[L(a),L(b)].sort((p,q)=>q-p);return((x+.05)/(y+.05)).toFixed(2)};console.log(r("#15130F","#F4F1EA"),r("#9A5B06","#F4F1EA"),r("#ECE7DA","#0E0D0B"),r("#E8A33D","#0E0D0B"))'
   ```
8. Comparison sheet (Req 4): the reference L markup with the Google
   Fonts link at 280px beside the 280px chip cropped from `og.png`, and
   at 40px beside the header mark at 5x zoom, each with a 50% overlay
   column; edges within 1 px and 0.5 CSS px. Below that, the two ICO
   frames beside the reference M and S at 32 and 16px, at 8x, for
   Davit's eye review (observation).
9. Built-in browser on a dev server started after the build:
   - 375px, light then dark: only the mark shows, svg 40x40, ink and
     notch colours from Req 8 (computed `fill`/`stroke`); link at
     least 44x44; no horizontal scroll; header no taller than the
     baseline (Req 7, 8, 10, 13, 15).
   - 1280px, light then dark: mark plus name, 12px from the svg box,
     name centred and on one line; svg 40x40; link at least 44x44;
     header no taller than the baseline (Req 10, 13, 15).
   - 1024px viewport with `document.documentElement.style.width =
     '1007px'`: the name span is one line high (Req 10).
   - Toggle the theme without reloading: computed colours switch
     (Req 8).
   - Theme set to system, `resize_window` with `colorScheme: "dark"`:
     dark colours (Req 8).
10. The rendered `<svg>` contains no `<text>`, and `document.fonts`
    loading state does not change its paths (Req 9).
11. Behaviour and accessibility at 375px and 1280px: a click on the
    mark from `/#stack` and `/projects` lands on `/` at the top with no
    `aria-current`; the accessible name is "Davit Yedigaryan" and the
    `<svg>` is not in the tree; the focus outline is visible in light
    and dark (Req 11, 12, 14).
12. Tab icon (Davit's check): `pnpm --ignore-workspace run serve`, then
    `open -na "Google Chrome" --args --user-data-dir="$(mktemp -d)"
    http://localhost:3000`, once as is and once with
    `--force-device-scale-factor=1` added, then a Safari and a Firefox
    private window. Pass: each tab shows one of the two ICO frames.
    Record which frame each shows (Req 18).
13. Open `out/apple-icon.png`, `out/og.png` and both frames of
    `out/favicon.ico`: opaque paper, one centred light chip (the S
    block with the knockout in the 16px frame), nothing else
    (Req 16, 19, 22).
14. The size-L, M and S `d` strings and stroke widths in
    `src/lib/logo-paths.ts` and the script are found verbatim in the
    reference markup above (`grep -F` per string) (Req 2).
15. Spec 005 regression: six section links, Projects, theme toggle and
    mobile menu behave as before.
16. After a deploy Davit approves only: a link-preview inspector of his
    choice (CLAUDE.md rules 8 and 15).

## Open questions

Blocking: none.

Non-blocking (the default applies if there is no answer):

- [ ] 1. Apple icon composition. Default: the 100-unit chip box drawn
  140px wide on a 180px paper square, so the pins (8 to 92 units,
  about 118px) clear the iOS corner mask. Alternative: 160px, a larger
  chip that sits closer to the mask.
- [ ] 2. OG image composition. Default: the chip alone, box 280px,
  centred on paper. Alternative: chip plus name and title, which needs
  outlined JetBrains Mono as well.
- [ ] 3. Optical size at large sizes. Default: set L (opsz 30) is
  reused for the 140px apple icon and the 280px OG chip. This holds
  only if Req 4 confirms that Chrome sizes optically by user units; if
  it shows Chrome uses the rendered size, this question becomes
  blocking (one set per size, or one compromise value).
- [ ] 4. If Davit rejects the 16px knockout at the comparison sheet.
  Default: ship the board's design. Alternatives: knock out "D" only,
  or drop the letters and keep the bare notched block.

Answered:

- [x] 5. Token names (2026-10-13, from the spec review): reuse
  `--foreground` for the ink and add only `--mark-accent` for the
  notch, rather than `--mark-ink` plus `--mark-accent` or reusing
  `--focus-ring`.

## Verification results (2026-10-13)

Branch `rebrand/010-chip-mark`, commits d004994..8c42944. Final run of
the three task scripts (build, tsc, lint, 227 checks): RUN OK; lint
"✖ 2 problems (0 errors, 2 warnings)", the same as the baseline.

0. Pass. Baseline from 76f5c9d: `og:url` `https://davit.yedigaryan.pro`,
   `twitter:card` `summary`, no canonical on index and projects, stub
   canonicals `#profile`, `#stack`, `#timeline`, `#contact`; header 69px
   at 375px and 67px at 1280px. (In-place baseline, plan Ruling 1.)
1. Pass. `rm -rf out` then build exit 0; the three files are listed; all
   four of `out/icon.png`, `out/DY.png`, `src/app/icon.png`,
   `public/DY.png` are absent.
2. Pass. `file`: "2 icons, 16x16, 32 bits/pixel, 32x32, 32 bits/pixel";
   `sips`: apple-icon 180x180, og 1200x630; the opacity check passes for
   all four rasters.
3. Pass. Every `out/*.html` (404, about, contact, experience, index,
   projects, skills) has exactly
   `<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16"/>`
   and `<link rel="apple-touch-icon" href="/apple-icon.png?…" type="image/png" sizes="180x180"/>`.
4. Pass. Index, projects and the four stubs carry the five `og:image`
   tags with the absolute URL, `twitter:card` `summary`, no `localhost`;
   `og:url` and the four stub canonicals equal the baseline.
5. Pass. Both greps print nothing.
6. Pass. Re-run of the script is byte-identical for all four outputs; a
   run with an unpinned font is refused and leaves the files untouched;
   the build does not run the script and succeeds with the font file
   moved away (exit 0, no tracked file changed).
7. Pass. `16.45 4.81 15.73 9.01`.
8. Pass. Row A (280px reference vs `og.png`): only a uniform
   antialiasing hairline at glyph edges, no offset (≤ 1px). Row B (40px
   at 5x): the 50% overlay shows one crisp glyph, no ghost edge
   (≤ 0.5 CSS px). `document.fonts` loaded. No layout flip: the
   defaults hold (opsz = user-unit font size, trailing letter-spacing in
   the centred width, kerning on), so Open question 3 stays
   non-blocking. Rows C and D observed: the 32px chip is legible; the
   16px knocked-out "DY" reads soft at 1x (Davit's call, see below).
9. Pass (dev server started after the build).
   - 375px light: only the mark shows, svg 40x40, link 44x44, notch
     rgb(154,91,6), body, pins and glyphs rgb(21,19,15); no horizontal
     scroll; header 69px (baseline 69).
   - Dark (toggle without reload): notch rgb(232,163,61), ink
     rgb(236,231,218). A reload in dark shows dark values at load.
   - 1280px light and dark: link 190x44, svg 40x40, gap 12px, name 18px
     high and vertically centred (offset 0); header 67px (baseline 67).
   - 1024px viewport at 1007px layout width: the name is 18px high (one
     line).
   - System theme with OS dark: dark values; with OS light: light
     values.
10. Pass. No `<text>` in the rendered svg; path `d` lengths are the same
    before and after `document.fonts.ready`.
11. Pass. A click on the mark from `/#stack` and from `/projects` lands
    on `/` with scrollY 0 and no `aria-current`. The link's accessible
    content is "Davit Yedigaryan" and the svg is not in the tree. Focus
    outline 2px solid rgb(154,91,6) in light and rgb(232,163,61) in
    dark, visible around the 44px box.
12. Davit's check, pending.
13. Pass. `apple-icon.png`, `og.png` and both ICO frames are opaque
    paper with one centred light chip; the 16px frame is the S block
    with "DY" knocked out.
14. Pass. The L, M and S notch and body strings, the pins string and
    the S block are each found verbatim in the reference markup; stroke
    5 and 7 and `stroke-linecap="square"` are in the script.
15. Pass. The mobile menu opens with 7 links; 03 Stack navigates,
    closes the menu and gets `aria-current`; the theme toggle works.
16. Davit's check, pending (after a deploy he approves).

Req 4 rows C and D (the 16px look): Davit's check, pending. If the
knocked-out "DY" does not read, Open question 4 alternatives are a
follow-up.
