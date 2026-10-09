# 004 — Rebrand foundation: design tokens, fonts, theme palettes

- **Status:** implemented
- **Date:** 2026-10-09 (approved 2026-10-09, implemented 2026-10-09)
- **Spec:** 004
- **Supersedes / superseded-by:** — (amends MEMORY.md §8 "Design / branding decisions" on approval; see Conflicts)

> **Conflicts with MEMORY.md, flagged up front.** §8 records "Primary
> colour: indigo" and "Accent / inline-link colour stays blue". The
> 2026-10-09 entry "Rebrand direction (engineering monograph)" already
> supersedes both (single signal colour: oscilloscope amber). On
> approval of this spec, §8 must be amended to point here. Nothing
> else in MEMORY.md (hard-"no" list, chat invariants, env tiers,
> static-export constraints) is touched.
>
> **Why this gets a spec** although `specs/README.md` exempts "styling
> tweaks": every later rebrand spec (005 home page, 006 projects index,
> 007 live meter + motion, 008 chat terminal restyle) builds on the
> token names and values fixed here, and the change reverses a logged
> MEMORY.md decision. It is a site-wide contract, not a tweak.

## Intent

Replace the generic indigo / Inter / Arial look with the monograph
palette (paper-and-ink light, terminal dark, one amber signal colour)
and type system (Fraunces display serif, JetBrains Mono for everything
else) by changing the *values* behind the CSS variables that already
exist in `src/app/globals.css`, so every later rebrand spec can build on
named tokens. Page structure, routes, copy, components, chat, analytics
and motion stay exactly as they are; after this spec the existing site
renders re-skinned, nothing more.

## Behavioral Requirements

### Palette

1. WHEN the site renders in light mode THEN the CSS variables in
   `:root` of `globals.css` resolve to the "paper" palette below, and
   the `@theme inline` aliases keep their current names so existing
   `bg-background`, `text-foreground`, `bg-primary`, `border-border`
   etc. classes keep working unchanged.

   | Existing variable | New light value | Token name | Note |
   | --- | --- | --- | --- |
   | `--background` | `#F4F1EA` | paper | |
   | `--foreground` | `#15130F` | ink | |
   | `--card-bg` | `#ECE8DE` | paper2 | |
   | `--card-border` | `#D9D3C5` | line | |
   | `--border-color` | `#D9D3C5` | line | |
   | `--text-primary` | `#15130F` | ink | |
   | `--text-secondary` | `#4A463E` | ink2 | |
   | `--text-tertiary` | `#6B665A` | ink3 | |
   | `--link-color` | `#9A5B06` | amberText | amber itself fails AA as text on paper (1.91:1) |
   | `--link-hover` | `#15130F` | ink | links darken to ink on hover |
   | `--button-primary-bg` | `#E8A33D` | amber | |
   | `--button-primary-text` | `#15130F` | ink | ink on amber = 8.60:1 |
   | `--button-primary-hover` | `#D9962F` | amber, one step darker | not in the design canvas; ink on it = 7.38:1; accepted 2026-10-09 |
   | `--input-bg` | `#F4F1EA` | paper | |
   | `--input-border` | `#D9D3C5` | line | |
   | `--input-text` | `#15130F` | ink | |
   | `--hero-background` | `var(--background)` | flat paper | the indigo/blue gradient is removed; the hero itself is rebuilt in spec 005 |
   | `--shadow-sm/md/lg` | unchanged | | shadows are used by cards until 005 replaces them with hairlines |

2. WHEN the site renders in dark mode (`html.dark`) THEN the same
   variables resolve to the "terminal" palette:

   | Existing variable | New dark value | Token name |
   | --- | --- | --- |
   | `--background` | `#0E0D0B` | dark paper |
   | `--foreground` | `#ECE7DA` | dark ink |
   | `--card-bg` | `#16140F` | dark paper2 |
   | `--card-border` / `--border-color` | `#2A2721` | dark line |
   | `--text-primary` | `#ECE7DA` | dark ink |
   | `--text-secondary` | `#B8B2A3` | dark ink2 |
   | `--text-tertiary` | `#8B857A` | dark ink3 |
   | `--link-color` | `#F0B454` | dark amberText |
   | `--link-hover` | `#ECE7DA` | dark ink |
   | `--button-primary-bg` | `#E8A33D` | amber (unchanged across themes) |
   | `--button-primary-text` | `#15130F` | ink |
   | `--button-primary-hover` | `#D9962F` | ink on it = 7.38:1 |
   | `--input-bg` | `#16140F` | dark paper2 |
   | `--input-border` | `#2A2721` | dark line |
   | `--input-text` | `#ECE7DA` | dark ink |
   | `--hero-background` | `var(--background)` | flat |

3. WHEN `globals.css` is read THEN three new theme-independent
   variables exist in `:root` for the chat restyle (spec 008) and are
   *not* yet used by any component: `--term: #15130F`,
   `--term-ink: #E6E0D2`, `--term-line: #2E2A23` (14.10:1).

4. WHEN the `@theme inline` block is read THEN the fixed-value aliases
   change as follows and every other alias keeps pointing at the
   variable it points at today:
   - `--color-destructive`: `#9A3B1C` light / `#E07A52` dark
     (both ≥ 6:1 on their background, not in the canvas; accepted
     2026-10-09). Implement via a new `--destructive` variable in
     `:root` / `html.dark` rather than a literal, so it follows the
     theme.
   - `--color-destructive-foreground`: `#F4F1EA`.
   - `--color-ring`: `var(--button-primary-bg)` (amber focus ring)
     instead of the link colour.
   - `--color-accent-foreground`: unchanged (`var(--background)`).
   - Amendment 2026-10-09 (found in the final review of the
     implementation): keeping `--color-primary` on amber makes
     Tailwind's `hover:text-primary` utility render raw amber text,
     1.91:1 on paper. WHEN an element with `hover:text-primary` is
     hovered THEN its text colour is `var(--link-color)` (4.81:1 light,
     10.51:1 dark), via one unlayered rule in `globals.css` next to
     the `.text-primary` helper. `bg-primary` stays amber.

5. WHEN an `input`, `textarea` or `select` has focus THEN the focus
   box-shadow in `globals.css` is amber at 35% alpha
   (`0 0 0 3px rgba(232, 163, 61, 0.35)`) instead of the current blue
   `rgba(37, 99, 235, 0.1)`.

6. WHEN `layout.tsx` `viewport.themeColor` is read THEN it is
   `#F4F1EA` for light and `#0E0D0B` for dark, matching requirement 1
   and 2, so the mobile browser chrome matches the page.

### Typography

7. WHEN `layout.tsx` is built THEN `Inter` from `next/font/google` is
   removed and replaced by two `next/font/google` loaders, each exposed
   as a CSS variable on `<html>` (not `<body>`, so the variables are
   available to the `@theme` block and to portals):
   - `Fraunces`, `variable: '--font-fraunces'`, weights 300 / 400 /
     600, styles normal + italic, `axes: ['opsz']`, `subsets:
     ['latin']`.
   - `JetBrains_Mono`, `variable: '--font-jetbrains'`, weights 400 /
     500 / 700, `subsets: ['latin']`.
   Both are self-hosted by `next/font` at build time; no runtime
   request to Google Fonts is made (static-export constraint and the
   consent model in spec 002 both depend on this).

8. WHEN `globals.css` is read THEN the dangling `--font-geist-sans` /
   `--font-geist-mono` references (nothing defines them today) are
   replaced: `--font-sans: var(--font-jetbrains)`, `--font-mono:
   var(--font-jetbrains)`, and a new `--font-serif: var(--font-fraunces)`
   alias is added so `font-serif` works as a utility.

9. WHEN `body` is styled THEN its `font-family` is
   `var(--font-jetbrains), ui-monospace, monospace` and `Arial,
   Helvetica, sans-serif` no longer appears anywhere in `globals.css`.

10. WHEN `h1`, `h2` and `h3` elements render THEN they use
    `var(--font-fraunces), Georgia, serif` with `font-weight: 400` by
    default, set by one base rule in `globals.css`. `h4` to `h6` stay
    in the body font. (Component-level overrides in later specs win by
    specificity; this spec changes no component.)

11. WHEN `globals.css` is read THEN the type scale and spacing tokens
    exist as CSS variables in `:root` for later specs to consume,
    unused by any component in this spec:
    - display sizes (Fraunces): `--fs-d1: 84px`, `--fs-d2: 56px`,
      `--fs-d3: 44px`, `--fs-d4: 34px`, `--fs-d5: 22px`
    - mono sizes: `--fs-m1: 16px`, `--fs-m2: 15px`, `--fs-m3: 13.5px`,
      `--fs-m4: 12px`, `--fs-m5: 11px`
    - radii: `--r-2: 2px`, `--r-3: 3px`, `--r-4: 4px` (no larger radii
      in the system; existing `rounded-lg` classes in components are
      out of scope until the components are rebuilt)
    - hairline: `--hairline: 1px solid var(--border-color)`

### Theme switching

12. WHEN the visitor uses the existing `ThemeToggle` THEN it still
    cycles light / system / dark exactly as today (`next-themes`,
    `attribute="class"`, `defaultTheme="system"`, `enableSystem`), the
    choice still persists across reloads in `localStorage` under the
    key `next-themes` uses today, and only the palette each state
    resolves to has changed. No change to `ThemeToggle.tsx` or
    `ThemeContext.tsx`.

### Accessibility

13. WHEN any text token is placed on its intended surface THEN the
    pair meets WCAG AA. Ratios computed on 2026-10-09 from the hex
    values above:

    | Pair | Ratio | AA |
    | --- | --- | --- |
    | ink on paper | 16.45 | pass |
    | ink2 on paper | 8.32 | pass |
    | ink3 on paper | 5.07 | pass (body) |
    | amberText on paper | 4.81 | pass (body) |
    | ink on amber (button) | 8.60 | pass |
    | ink on hover amber `#D9962F` | 7.38 | pass |
    | ink on paper2 (card) | 15.16 | pass |
    | destructive on paper | 6.17 | pass |
    | dark ink on dark paper | 15.73 | pass |
    | dark ink2 on dark paper | 9.19 | pass |
    | dark ink3 on dark paper | 5.30 | pass |
    | dark amberText on dark paper | 10.51 | pass |
    | amber on dark paper | 9.01 | pass (amber may be used as text in dark mode only) |
    | dark ink on dark card | 14.91 | pass |
    | dark destructive on dark paper | 6.54 | pass |
    | term-ink on term | 14.10 | pass |

    Raw amber `#E8A33D` is **not** text on light surfaces (1.91:1);
    it is a fill, rule, cursor-dot and focus-ring colour there.

### Dark-variant utilities (bug found while drafting; accepted 2026-10-09)

14. WHEN `globals.css` is read THEN it declares, directly after
    `@import "tailwindcss";`:

    ```css
    @custom-variant dark (&:where(.dark, .dark *));
    ```

    so that the 30 `dark:` utility classes in `src/app/page.tsx`,
    `about/page.tsx`, `experience/page.tsx`, `skills/page.tsx`,
    `components/ContactForm.tsx` and `components/LlmChat.tsx` follow
    the `ThemeToggle` choice. Today nothing declares this variant:
    under Tailwind v4 `dark:` defaults to the `prefers-color-scheme`
    media query, and the v3-style `darkMode: 'class'` in
    `tailwind.config.mjs` is not read (no `@config` directive). So a
    visitor who picks "light" on an OS set to dark currently gets
    those 30 spots in dark styling (**inferred from the config, not
    yet reproduced in a browser**; Verification 11 reproduces it).
    Included here because it is the theme-switching contract this
    spec owns; if declined, it moves to its own fix.

## Non-goals

- Page structure, section order, or route changes. The six routes
  stay. Collapsing them into the monograph home page with redirect
  stubs is **spec 005**.
- Header / footer redesign (DY monogram, numbered nav). **Spec 005.**
- Any copy change, including `personalInfo.title` and the bio.
  **Spec 005** (and the `data.ts` corrections agreed on 2026-10-09).
- Projects index redesign (sticky chapters, figure rail). **Spec 006.**
- The live frame-timing meter, boot counter, scroll-reveal, count-up
  stats, cursor dot, any animation. **Spec 007.** This spec removes
  no existing transition rule either.
- Chat widget: no change to `LlmChat.tsx`, its fallback behaviour
  (spec 001), or its look beyond what the shared variables cause. The
  terminal-pane restyle and the Projects launcher are **spec 008**.
  The Telegram button's brand blue `bg-[#229ED9]` stays.
- Analytics / consent (spec 002) untouched.
- English / Armenian toggle: deferred entirely (decision 2026-10-09).
- Touching component files that carry hard-coded Tailwind palette
  classes. They will **not** re-skin from this spec alone and will look
  mixed until their own spec rebuilds them. Counted on 2026-10-09
  (`grep -rEo '(bg|text|border|from|to|via|ring|shadow)-(indigo|sky|fuchsia|slate|gray|...)...' src`):

  | File | Hard-coded palette classes | Rebuilt by |
  | --- | --- | --- |
  | `src/app/skills/page.tsx` | 54 | 005 |
  | `src/components/Hero.tsx` | 30 | 005 |
  | `src/components/LlmChat.tsx` | 10 | 008 |
  | `src/app/page.tsx` | 6 | 005 |
  | `src/app/experience/page.tsx` | 5 | 005 |
  | `src/components/ContactForm.tsx` | 4 | 005 |
  | `src/app/about/page.tsx` | 2 | 005 |
  | `src/lib/data.ts` | 1 | 005 |

- Removing `tailwind.config.mjs`. It is a Tailwind v3-style file;
  under v4 (`@import "tailwindcss"` + `@tailwindcss/postcss`) its
  `content` and `darkMode: 'class'` entries are not read without an
  `@config` directive. Req 14 makes it fully redundant; deleting the
  file is a separate one-line cleanup (CLAUDE.md rule 14 applies) and
  is not part of this spec.
- New dependencies. `next/font/google` ships with Next; nothing is
  added to `package.json`.

## Interface contract

- **Env vars:** none.
- **Files changed (the whole surface of this spec):**
  - `src/app/globals.css` — variable values, three `--term*`
    variables, `--destructive`, `@theme inline` alias changes, font
    aliases, body/heading font rules, type-scale/radii/hairline
    tokens, input focus shadow.
  - `src/app/layout.tsx` — font loaders and `className` on `<html>`;
    `viewport.themeColor` values. Nothing else in the file.
- **CSS variables other code relies on (names unchanged):**
  `--background`, `--foreground`, `--card-bg`, `--card-border`,
  `--text-primary`, `--text-secondary`, `--text-tertiary`,
  `--link-color`, `--link-hover`, `--border-color`, `--input-bg`,
  `--input-border`, `--input-text`, `--button-primary-bg`,
  `--button-primary-text`, `--button-primary-hover`,
  `--hero-background`, `--shadow-*`, and every `--color-*` alias in
  `@theme inline`.
- **CSS variables introduced (for specs 005 to 008):** `--term`,
  `--term-ink`, `--term-line`, `--destructive`, `--font-fraunces`,
  `--font-jetbrains`, `--font-serif`, `--fs-d1..d5`, `--fs-m1..m5`,
  `--r-2`, `--r-3`, `--r-4`, `--hairline`.
- **Files/artifacts in `out/`:** self-hosted `.woff2` files for
  Fraunces and JetBrains Mono under `out/_next/static/media/`; no
  Inter files.

## Verification

1. `pnpm run build` succeeds with no new warnings.
2. `grep -rl "Fraunces" out/_next/static/css/ | wc -l` is ≥ 1 and
   `grep -rl "JetBrains" out/_next/static/css/ | wc -l` is ≥ 1
   (Req 7, 8).
3. `grep -rli "inter" out/_next/static/css/` returns nothing, and
   `grep -n "Inter" src/app/layout.tsx` returns nothing (Req 7).
4. `grep -n "Arial\|geist" src/app/globals.css` returns nothing
   (Req 8, 9).
5. `grep -c "fonts.googleapis.com\|fonts.gstatic.com" -r out/` is 0:
   no runtime font request (Req 7, static-export + consent).
6. `pnpm run dev`, open http://localhost:3000/ in light mode: page
   background is `#F4F1EA`, body text is monospace, the `h1` is a
   serif, the primary CTA is amber with dark text, inline links are
   `#9A5B06`. Check with DevTools computed styles on `body` and `h1`
   (Req 1, 9, 10).
7. Switch the toggle to dark: background `#0E0D0B`, text `#ECE7DA`,
   links `#F0B454`, CTA still amber. Reload: the choice persists.
   Switch to system and change the OS appearance: the page follows
   (Req 2, 12).
8. Open http://localhost:3000/contact, focus the first input: the
   focus ring is amber, not blue (Req 5).
9. Contrast: run the Node one-liner below (or any WCAG tool) and
   confirm every ratio matches the table in Req 13 within ±0.05:

   ```bash
   node -e 'const L=h=>{const c=h.slice(1);const [r,g,b]=[0,2,4].map(i=>parseInt(c.substr(i,2),16)/255).map(v=>v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b};const R=(a,b)=>{const [x,y]=[L(a),L(b)].sort((p,q)=>q-p);return((x+.05)/(y+.05)).toFixed(2)};for(const [a,b] of [["#15130F","#F4F1EA"],["#4A463E","#F4F1EA"],["#6B665A","#F4F1EA"],["#9A5B06","#F4F1EA"],["#15130F","#E8A33D"],["#ECE7DA","#0E0D0B"],["#B8B2A3","#0E0D0B"],["#8B857A","#0E0D0B"],["#F0B454","#0E0D0B"]])console.log(a,b,R(a,b))'
   ```
10. Mobile: in DevTools device mode the `theme-color` meta reports
    `#F4F1EA` / `#0E0D0B` (Req 6).
11. Dark-variant bug reproduction and fix (Req 14): before the
    change, set the OS to dark appearance, pick "Light" in the toggle,
    open http://localhost:3000/skills: skill cards still show their
    `dark:` colours. After the change, the same steps show light
    colours, and picking "Dark" with the OS in light appearance shows
    dark colours.
12. Regression: every existing route (`/`, `/about`, `/experience`,
    `/skills`, `/projects`, `/education`, `/contact`) still builds and
    renders; the chat widget opens and sends; the consent banner
    appears on a fresh profile. Visual mixing on pages with hard-coded
    palette classes is expected and listed under Non-goals.

## Open questions

None blocking. All five resolved by Davit on 2026-10-09:

1. Hover shade `#D9962F` accepted.
2. Destructive `#9A3B1C` / `#E07A52` accepted.
3. Merge to `main` when implemented; deploy only together with spec 005.
4. The `dark:` variant fix (Req 14) is part of this spec.
5. `--font-sans` pointing at JetBrains Mono accepted.
