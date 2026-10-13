# 005 — Monograph home page, route collapse, content corrections

- **Status:** implemented (2026-10-10)
- **Date:** 2026-10-09 (approved 2026-10-09)
- **Spec:** 005
- **Supersedes / superseded-by:** — (depends on 004 approved; 006 Projects index, 007 motion + live meter, 008 chat terminal restyle follow); Req 11 and the 2026-10-10 header amendment amended by 010 (DY chip mark)

> **Sources.** Layout and copy come from the Claude Design canvas
> (https://claude.ai/artifact/TfJcVSRpy5cjufpqJ9U19Q, Main artboard).
> Facts come from the Notion page "Career Profile - Source of Truth
> (private)", last aligned 2026-10-07, read on 2026-10-09. Where the
> two disagree with `src/lib/data.ts`, the Notion page wins and the
> delta is listed under *Content corrections*. Items the Notion page
> tags ON REQUEST or RESTRICTED (target pay, the trading client's
> name) must never appear on the site; this spec repeats that as a
> requirement.
>
> **Flagged tension, not a blocker.** The Notion identity line reads
> "full-stack engineer". The rebrand headline agreed on 2026-10-09 is
> "Systems-minded frontend engineer" (MEMORY.md entry of that date).
> The profile paragraph and the timeline carry the full-stack facts;
> the headline stays as decided. See Open question 9 if you want the
> identity line itself changed on Notion.

## Intent

Replace the five-route site with one long, numbered home page
(Profile, Proof, Stack, Timeline, Teaching, Contact) built from a
`data.ts` corrected against the Notion source of truth, so a hiring
engineer reads the whole story on one scroll. `/projects` stays its
own page; `/about`, `/skills`, `/experience`, `/contact` become
redirect stubs so existing links keep working.

## Behavioral Requirements

### Content corrections in `src/lib/data.ts` (facts from Notion)

1. WHEN `experiences` is read THEN the two entries with period
   "Dec 2025 – Apr 2026" (ids 0 "Confidential Client" and 3 "Hapalas
   Technology") are replaced by one entry:
   - company `QDSC Armenia (formerly Hapalas Technology)`
   - role `Senior Full-Stack Engineer`
   - period `Dec 2025 – Present`, location `Yerevan, Armenia · hybrid`
   - description: sole architect and lead for a high-security
     cryptographic web platform on Angular inside a Tauri desktop app.
   - achievements (merged from both Notion versions): client-side
     cryptographic protocols (key handling, encryption/decryption
     flows); Angular Signals and RxJS state; XSS/CSRF/CSP hardening;
     REST contracts between Angular and Go backend services; OAuth/OIDC
     add-and-sync flows for identity management; architecture and
     schema ownership (PostgreSQL, MySQL); C/C++ build environment
     (CMake) under the Rust/Go layer; custom Claude Code agents (code
     review, architecture review, test generation) under spec-driven
     development.
   - technologies: TypeScript, Angular, Signals, RxJS, Tauri, Go,
     OAuth/OIDC, PostgreSQL, MySQL, Python, Web Crypto, C/C++ (CMake),
     Claude Code.
   - website `https://cyphergenics.com/` (PUBLIC on Notion; shown only
     if Open question 11 is a yes).
   The logo stays `/images/companies/ndaglobal.png` until a real one
   exists.

2. WHEN `experiences` is read THEN a new entry exists between the
   QDSC entry and the trading-platform entry: company `Optimum
   Partners Global`, role `Software and Quality Engineer · TechX
   Trainer`, period `Nov 2025 – Dec 2025`, location `Yerevan, Armenia
   · contract`, description and achievements from Notion (led the
   TechX initiative: recruited, assessed and trained pre-intern
   candidates into client-ready engineers across modern Angular, React
   and Python/FastAPI; designed the curriculum, code-review standards
   and readiness assessments). No cohort or hiring numbers (Open
   question 8). Technologies: Angular, React, Python, FastAPI, Quality
   Engineering, Agile, Mentorship. Logo: `ndaglobal.png` placeholder.

3. WHEN the trading-platform entry (id 2) is read THEN its
   achievements include the Notion metric "live charting dashboard
   scaled from 4 to 20 to 30 widgets per device at the same
   performance", its technologies include SignalR, SCSS and WebSockets,
   and its company stays `Confidential Client` with the chip "NDA".
   The client's name never appears in any file under `src/`,
   `public/` or `specs/` (RESTRICTED). Technologies not on Notion
   (Blazor, Microservices, SQL Server, MongoDB, Docker) are kept or
   dropped per Open question 3.

4. WHEN the Prestige Motors entry (id 5) is read THEN its achievements
   also cover: migration of the client-facing API from Django to
   FastAPI; TecDoc Alliance catalog API integration with response
   caching; a separate React store-management app; Socket.io /
   WebSockets. Technologies add FastAPI, React, pandas, WebSockets.
   `liveUrl` stays `https://pgm.am` (Notion: "pgm.am suggested, not
   verified" then added to Strider as pgm.am; flagged **unverified**).

5. WHEN `skills` is read THEN every note that says "Hapalas
   Technology" says "QDSC Armenia (formerly Hapalas Technology)", and
   the C / C++ note no longer claims "core business logic at QDSC"
   but "C/C++ build environment (CMake) under the Rust/Go layer at
   QDSC; OOP-in-C++ instructor" (Notion wording; Open question 5 if
   you want it stronger). The Polytechnic study description keeps
   "current C/C++ work at QDSC".

6. WHEN `personalInfo` is read THEN:
   - `title` is `Systems-minded Frontend Engineer`
   - `tagline` is `Angular · TypeScript · C/C++`
   - `shortBio` is the hero subline: "I build Angular interfaces and
     I know what the bytes underneath are doing. {yoe} years from
     C/C++ and VLSI to Signals and zoneless Angular, with C#/.NET on
     the other side of the socket." (`{yoe}` from
     `yearsOfExperience()`, spelled out as a word when ≤ 9).
   - `bio` is the profile paragraph: "I came to the browser from the
     other direction: a VLSI and C/C++ education, then C# services and
     sockets, then {yoe} years of Angular where I now care most about
     change detection, memory and the frame budget. I ship whole
     features, I read the low-level code when the product depends on
     it, and I teach the fundamentals at university level so they never
     go soft."
   - `location` stays `Yerevan, Armenia`, `locationNote` stays `Open
     to remote` (relocation line per Open question 6).
   `system-prompt.ts` and `layout.tsx` metadata pick these up without
   change because they read `personalInfo`.

7. WHEN `src/lib/faqs.ts` is read THEN the answers at the current
   lines 68 and 108 no longer call Hapalas "most recent industry role"
   or the QDSC role "Senior Frontend Developer"; both say Senior
   Full-Stack Engineer at QDSC Armenia (formerly Hapalas Technology),
   Dec 2025 to present. No other FAQ text changes.

8. WHEN `experiences` is read THEN the OHANYAN Educational Complex
   entry (current id 4, "Jan 2026 – Present") no longer exists
   (decision 2026-10-09: not in the Notion work history), and the
   `faqs.ts` answers at the current lines 68 and 159 no longer mention
   OHANYAN or IBDP teaching; Eurasia International University is the
   only teaching role on the site. `linkedin.ts` keeps its OHANYAN
   entry until the live LinkedIn profile is changed (it mirrors
   LinkedIn; see Non-goals). Deleting the entry falls under CLAUDE.md
   rule 14: the implementation plan lists it and this approval is the
   confirmation.

9. WHEN any page or the chat system prompt renders THEN neither the
   target pay figures nor the trading client's name appear
   (`grep -ri` in Verification 3).

### Page structure

10. WHEN `/` renders THEN `<main>` contains, in order, sections with
   these ids and heading labels: `top` (hero, label "00 / Index"),
   `profile` ("01 / Profile"), `proof` ("02 / Proof"), `stack`
   ("03 / Stack"), `timeline` ("04 / Timeline"), `teaching`
   ("05 / Teaching"), `contact` ("06 / Contact"). Each numbered label
   is an uppercase mono caption in `--link-color` above a Fraunces
   `h2`. Only the hero `h1` exists on the page.

11. WHEN the header renders THEN it shows: the monogram "DY" in
    Fraunces linking to `/`, the full name in mono beside it, six
    hash links "01 Profile … 06 Contact" to the section ids, a
    "Projects" link to `/projects`, and the existing `ThemeToggle`.
    The existing mobile menu button and panel pattern in `Header.tsx`
    is kept with the new items. Active state: the link whose hash
    matches `location.hash` (no scroll-spy; that is spec 007). No
    EN/HY toggle (deferred 2026-10-09).

12. WHEN the hero renders on a viewport ≥ 1024px THEN it is two
    columns: left, the `h1` "Systems-minded *frontend* engineer." with
    "frontend" in Fraunces italic, the `shortBio` subline, and two
    CTAs: "View projects" (primary, amber) to `/projects` and
    "Resume (PDF)" (hairline button) to `/resume.pdf`; right, "Fig. 1"
    — the existing `public/images/about-image.png` cropped square at
    148px with the amber duotone (`filter: grayscale(1) contrast(1.15);
    mix-blend-mode: multiply` over an amber block; no new image file),
    captioned "Davit Yedigaryan · Yerevan · EN / HY / RU". A location
    line "Yerevan, Armenia · Open to remote" sits above the `h1`.
    The frame-time trace, corner instrument, boot overlay and the
    Fig. 2 chat pane are **not** part of this spec (007, 008); the
    right column is the portrait only until 008 adds the pane beside
    it.

13. WHEN `#profile` renders THEN it shows the `bio` paragraph at
    `--fs-d5` (22px) Fraunces, max-width 68ch, fully opaque (the
    scroll reveal is 007).

14. WHEN `#proof` renders THEN it shows four figures with mono
    labels, static values: years of experience (`yearsOfExperience()`,
    zero-padded, "+"), "06+" Angular years, "03+" C#/.NET years
    (kept, Open question 4), "04" degrees (`studies` ids 0 to 3; the
    canvas showed "02 institutions", which no longer holds); then the intro
    paragraph "Selected figures" and three featured project cards
    from `projects` indexes 0 (trading platform), 2 (Energy Machines)
    and 3 (Prestige Motors), each with its image in duotone, "Fig. 3"
    to "Fig. 5" captions, title, one-line description and a link to
    `/projects`. The paragraph about the page measuring itself is
    007's and is not rendered here. An "All projects ↗" link to
    `/projects` closes the section.

15. WHEN `#stack` renders THEN it shows the five `skills` categories
    as lettered tables (A to E) with columns name / level / years and
    the note under the row where present, preceded by the three-line
    legend "Expert means I have led architecture and mentored on it.
    Proficient means I have shipped it alone. Familiar means I can
    read, debug and contribute." Level labels are mono uppercase
    chips: Expert in amber, Proficient in ink2, Familiar in ink3.

16. WHEN `#timeline` renders THEN every entry in `experiences` after
    the corrections above is listed most-recent-first as a row:
    period (mono, ink3), role (Fraunces), company (mono), description,
    and the technologies as a single mono line. Entries whose company
    is `Confidential Client` carry an "NDA" chip. Achievements render
    as a hairline-separated list under the description. No logos.

17. WHEN `#teaching` renders THEN it shows the Eurasia entry alone
    (single column, copy from the canvas; the intro line drops "and IB
    Computer Science"), then "Degrees" listing `studies` ids 0 to 3 as one line
    each (degree, institution, year), then "Certificates" listing
    `certifications`. The Vineti entry (id 4) moves to Certificates
    since it already exists there.

18. WHEN `#contact` renders THEN it shows the heading "Hiring for a
    product team?", the line "Based in Yerevan, open to remote.
    Fastest reply on Telegram; email works for anything with an
    attachment.", four channel links (email `personalInfo.email`,
    Telegram `https://t.me/mr_yedigaryan`, LinkedIn, GitHub), and the
    existing `ContactForm` unchanged in behaviour (`NEXT_PUBLIC_CONTACT_ENDPOINT`,
    same fetch, same fallback `mailto:`). The caption under the form
    reads "Relayed by a form service. No tracking unless you accepted
    analytics." Phone is not shown (decision 2026-10-09).

19. WHEN the footer renders THEN it shows "DY · Davit Yedigaryan ·
    Yerevan", the line "Static export · Next.js · Self-hosted
    assistant · © {year}", and the existing social icon links at
    ≥ 44×44 px tap targets.

20. WHEN `/about`, `/skills`, `/experience` or `/contact` is opened
    THEN the static page redirects to `/#profile`, `/#stack`,
    `/#timeline`, `/#contact` respectively: a `<meta http-equiv="refresh"
    content="0;url=…">` in the document head so it works without
    JavaScript, plus a visible link "Moved to …" as the only body
    content, plus `<link rel="canonical">` to the target. Each stub is
    `noindex`. Mechanism for emitting the http-equiv meta from the App
    Router is **unverified** (Open question 10). The `Header` nav no
    longer links to these routes.

21. WHEN `/projects` is opened THEN it still renders the existing
    projects page with the new header/footer; its redesign is spec 006.

22. WHEN `layout.tsx` metadata is built THEN `title` is
    "Davit Yedigaryan - Systems-minded Frontend Engineer | Angular,
    TypeScript, C/C++", `description` is `shortBio`, `keywords` are
    ["Frontend Engineer", "Angular", "TypeScript", "C++", "Systems",
    "Yerevan"], and OpenGraph mirrors title and description.

23. WHEN the viewport is < 768px THEN every section is a single column
    in the same order, the hero portrait sits below the CTAs at 120px,
    the stack tables scroll horizontally inside their container rather
    than breaking the page width, and no horizontal page scroll exists.

24. WHEN the page loads THEN the skip link, `LlmChat` (today's
    floating widget, unchanged), `Analytics` and `ConsentBanner` mount
    exactly as today from `layout.tsx`.

25. WHEN keyboard focus lands on any link, button or input THEN the
    focus ring is the amber `--color-ring` from spec 004 and the tab
    order follows the section order.

## Non-goals

- Live frame meter, boot counter, scroll-reveal, count-up numbers,
  cursor dot, scroll-spy nav — **spec 007**.
- Chat terminal pane in the hero, Projects launcher pill — **spec
  008**. `LlmChat.tsx` is untouched here.
- Projects index redesign — **spec 006**. TERASEYA as a seventh
  chapter is decided there (Open question 12 collects the answer now).
- English / Armenian toggle (deferred).
- `src/lib/linkedin.ts`: it mirrors the live LinkedIn profile, which
  Notion says is not yet aligned for QDSC. Update it when LinkedIn is.
- New images, logos or a new portrait crop file. Duotone is CSS only.
- Adding Techwings / Alison contract engagements (Open question 2;
  default: not added).
- Changing `certifications`, `studies` facts, `yearsOfExperience`
  anchor, or the chat system prompt beyond what `personalInfo` feeds
  it.
- Deleting the old route directories' components beyond the page
  files themselves (CLAUDE.md rule 14: list before deleting; the
  implementation plan must enumerate `src/app/{about,skills,experience,contact}/page.tsx`
  rewrites and any component that becomes unused).

## Interface contract

- **Env vars:** `NEXT_PUBLIC_CONTACT_ENDPOINT` unchanged (static site
  `.env.local`, optional; see `ContactForm.tsx` header comment).
- **Component props / exports:** `personalInfo.title`, `.tagline`,
  `.shortBio`, `.bio` keep their names and types (consumed by
  `Footer.tsx`, `system-prompt.ts`, `layout.tsx`). `experiences`,
  `skills`, `studies`, `projects`, `certifications` keep their
  shapes; only values change.
- **Routes in `out/`:** `index.html`, `projects.html`, and the
  four stub pages `about.html`, `skills.html`, `experience.html`,
  `contact.html`. `resume.pdf` is
  already in `public/`.
- **Section anchors other specs rely on:** `#top`, `#profile`,
  `#proof`, `#stack`, `#timeline`, `#teaching`, `#contact`.

## Verification

1. `pnpm run build` succeeds; `out/about.html`, `out/skills.html`,
   `out/experience.html`, `out/contact.html` and `out/projects.html`
   exist (flat export; `public/.htaccess` serves `/about` from
   `about.html`) (Req 20, 21).
2. `grep -c 'http-equiv="refresh"' out/about.html` is 1 and the
   `url=` is `/#profile`; same for the other three stubs (Req 20).
3. `grep -ri "<trading client name>\|5,600\|7,600" src/ out/ specs/`
   returns nothing (Req 9). Run with the real client name typed
   locally, never written into a file.
4. `grep -n "Hapalas" src/lib/data.ts src/lib/faqs.ts` shows only the
   "(formerly Hapalas Technology)" form (Req 1, 5, 7).
5. `grep -c "Dec 2025 – Present" src/lib/data.ts` is 1 and
   `grep -c "Dec 2025 – Apr 2026" src/lib/data.ts` is 0 (Req 1).
6. `grep -n "Optimum Partners Global" src/lib/data.ts` returns the new
   entry (Req 2).
6b. `grep -n "OHANYAN\|IBDP" src/lib/data.ts src/lib/faqs.ts` returns
   nothing (Req 8).
7. `pnpm run dev`, open http://localhost:3000/: sections `#top` to
   `#contact` exist in order (`document.querySelectorAll('main section[id]')`
   in DevTools lists the seven ids) and only one `h1` exists (Req 10).
8. Header shows DY, six numbered hash links, Projects, theme toggle;
   clicking "03 Stack" scrolls to the tables and the link is marked
   active (Req 11).
9. Hero: "frontend" is italic serif; "View projects" goes to
   `/projects`; "Resume (PDF)" opens `/resume.pdf`; the portrait is
   square and amber-tinted (Req 12).
10. `#proof` shows four static figures and three cards with images;
    "All projects ↗" goes to `/projects` (Req 14).
11. `#timeline` lists the corrected entries most-recent-first; the
    trading entry shows the NDA chip and the 4 → 20 → 30 widgets
    line (Req 3, 16).
12. `#contact`: submit the form with `NEXT_PUBLIC_CONTACT_ENDPOINT`
    unset and confirm the same fallback behaviour as before the
    change (Req 18).
13. Open http://localhost:3000/about with JavaScript disabled: the
    browser lands on `/#profile` (Req 20).
14. DevTools device mode at 375px: no horizontal scroll, single
    column, stack tables scroll inside their box (Req 23).
15. Chat widget opens and answers; consent banner appears on a fresh
    profile; GA4 DebugView shows the page view after accepting (Req
    23, regression of specs 001/002).
16. Tab through the page: focus ring amber, order top to bottom (Req
    24).

## Open questions

None blocking. Resolved by Davit on 2026-10-09 ("defaults for all"
plus three explicit answers):

1. OHANYAN: **remove** (Req 8).
2. Techwings / Alison: not added.
3. Trading-platform technologies: kept as in `data.ts` today.
4. C# / .NET claim and the "03+" figure: kept.
5. C / C++ note: Notion wording.
6. Relocation line: **not shown**.
7. Phone: off the home page.
8. Optimum Partners numbers: stay generic.
9. Headline stays **Systems-minded Frontend Engineer**; Notion's
   identity line is left to Davit.
10. Redirect mechanism: resolved during implementation.
11. cyphergenics.com: not shown.
12. TERASEYA: seventh chapter in spec 006.

## Amendments (implementation, 2026-10-10)

- Static export is flat: stubs are `out/<route>.html`, not `out/<route>/index.html` (Verification 1-2, Interface contract updated).
- FAQ "systems-cs-background" answer also changed "Hapalas / QDSC" to "QDSC Armenia (formerly Hapalas Technology)" so Verification 4 holds.
- Stubs render "Moved to …" inside the root layout, so the header, footer and chat still surround it.
- Redirect meta: React 19 hoists `<meta httpEquiv="refresh">` from the stub body into `<head>` (Open question 10 resolved).
- Expert chips and amber labels use `--link-color`, not raw amber, for AA contrast.
- Teaching intro reads "Lecturing OOP in C++ and C# and computer networks keeps the fundamentals sharp …".
- Profile h2 "The short version." and Proof h2 "Numbers, then the work." approved by Davit as final copy (2026-10-10).
- Req 6 `bio`: "six years of Angular" is hand-set, not `{yoe}` (Davit, 2026-10-10), to match the Angular "6+ years" skill row; `shortBio` keeps `{yoe}` (career length).
- Non-goal reversed (Davit, 2026-10-10): `linkedin.ts` no longer mirrors LinkedIn where the site disagrees. `extraExperience` is empty (OHANYAN, Hapalas "Dec 2025 - Apr 2026", and the Optimum and NDA duplicates removed), the headline drops "IBDP CS Teacher", and `geographicArea` (Valencia) is gone, so the chat follows `data.ts`. `system-prompt.ts` omits the "Additional experience" heading when the list is empty.
- Req 25 focus ring: light mode uses `--focus-ring: #9A5B06` (4.81:1 on paper, 4.43:1 on cards); dark mode keeps `#E8A33D` (Davit, 2026-10-10).
- "Resume (PDF)" downloads the file (keeps the `resume_download` analytics event) rather than opening it.
- Desktop nav shows from 1024px; below that the mobile menu is used.
- Below 640px the header shows only the "DY" monogram; the mono full name appears from 640px up, so the 375px header fits without horizontal scroll.
- Header section links are Next `<Link>`, not plain `<a>`, so Back and Forward keep Next's history state (a native fragment jump left an entry Next ignores on popstate).
- Verification 1-11, 14 and 16 pass in the browser (2026-10-10, 1024px and 375px). Verification 13 passed with JavaScript on (all four stubs land on their section); the JavaScript-off run, Verification 12 (form submit), the client-name half of Verification 3 and the GA4 half of Verification 15 are Davit's to run.
