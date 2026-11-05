# 008 - Chat terminal pane in the home hero, Projects launcher pill

- **Status:** approved 2026-10-27
- **Date:** 2026-10-23 (revised 2026-10-27 after review and Davit's answers)
- **Spec:** 008
- **Supersedes / superseded-by:** - (depends on 004, 005, 006 implemented and 007 implemented on the unmerged `rebrand/007-meter`, whose own status still reads approved; amends 004 Req 3, 005 Req 12 and Req 24, 006 Non-goals and its launcher clause, 007 Req 8, 9, 10, 14, 17, 19 and their Verifications, and adds a dated note to 001 Req 18 / Req 25 and 002 Req 13; see "Amendments this spec makes")

> **Sources.** Scope: spec 005 Non-goals ("Chat terminal pane in the
> hero, Projects launcher pill - spec 008"), spec 006 Non-goals (the
> pill), spec 007 Req 8 note and Req 9 (Fig. 2 reserved). Direction:
> MEMORY.md "2026-10-09, Rebrand direction" ("the chat assistant as an
> inline terminal pane in the hero (floating launcher on Projects).
> Chat/analytics behaviour unchanged, restyle only; fallback stays
> silent (no backend label)"). Look: a local export of the Claude Design
> canvas, boards `Main` (hero and pane), `Projects` (pill) and `Mobile`
> (Main at 390px), read on 2026-10-23. Whether that export is the same
> version as the artifact URL in spec 005 is **unverified**. The look is
> described in words under "The look" so this spec does not depend on
> the export. Davit asked for this draft straight from 005 and the
> boards, with no interview.
>
> **How decisions are tagged below.**
> - No tag: from the sources above (Davit's earlier decisions or the
>   boards).
> - **[accepted]**: an earlier decision Davit already accepted, repeated
>   here.
> - **[decided 2026-10-23, Claude's call]**: made while drafting; Davit
>   can overturn any of them at approval.
> - Anything else that needs Davit is under Open questions, with a
>   recommended default.
>
> **Conflicts with MEMORY.md and the sources, flagged.**
> 1. *"Chat behaviour unchanged" cannot hold literally.* Spec 001 Req 18
>    starts the offline probe "while the panel is open" and Req 25 (and
>    002 Req 13) fire `chat_open` when the panel opens. An inline pane is
>    never opened, so both need a new trigger (Req 9, Open question 4).
>    Everything else in 001 and 002 stays as it is.
> 2. *Board copy vs the silent fallback.* The board shows an "online"
>    dot, "Assistant, self-hosted", the system line "assistant online ·
>    answers come from Davit's own laptop · this chat stays in your
>    browser" and the note "This assistant runs on my own computer, not a
>    third-party service". Each claim can be false: the offline probe is
>    answered at the gateway edge and never reaches the laptop (spec 011
>    flags), so "online" would show while the laptop is off; when the
>    silent fallback answers, the answer comes from Claude through the
>    claude-wrapper (`LlmChat.tsx:56`), a third-party model; and every
>    message leaves the browser for the gateway, so "stays in your
>    browser" is untrue (only the history is stored locally). Open
>    question 1.
> 3. *Board colour fails contrast.* The board draws the light-mode `//`
>    system line in ink3 `#6B665A` on the terminal `#15130F`: about
>    3.25:1 by my arithmetic, below 4.5:1. Open question 2.
> 4. *Spec 004 Req 3 says `--term`, `--term-ink`, `--term-line` are
>    theme-independent.* The board gives the pane different dark values.
>    Using them amends 004 (Req 18).
> 5. *Board accessibility defects.* The pill's `aria-label="Open the
>    assistant"` does not contain its visible text (WCAG 2.5.3, Label in
>    Name). Its cursor blinks forever (WCAG 2.2.2 applies to every
>    visitor, not only reduced motion). The pane's visible `>` label is
>    the input's only name. Reqs 14, 15, 19, 25.
> 6. *Board sample data.* The board pre-fills a user question and an AI
>    answer, and that answer uses pre-005 facts ("senior frontend
>    developer at Hapalas Technology"). Real data only (Req 13).
>
> **Invariant (repeated from 005 to 007).** The target pay figures and
> the trading client's name never appear in any file under `src/`,
> `public/` or `specs/`.

## Intent

On the home page the assistant becomes a visible terminal pane beside
(or, on narrow screens, under) the hero text, captioned "Fig. 2", so a
hiring engineer sees it can be asked straight away. On every other page
the round chat button becomes a small terminal-style "Projects launcher
pill". The look changes; the chat, its fallback and its analytics
behave as today except for the pane trigger in Req 9, the focus rule in Req 10 and the welcome-message wording fix in Req 13.

## The look (in words)

The pane is a dark terminal box with a thin border and 4px corners. A
small caption row above it reads like the other figure captions. Inside,
each message is one row: a short prefix column on the left (`>` in
amber for the visitor, `dy` for the assistant, `//` for a system line)
and the text on the right, in a light mono ink. At the bottom, under a
thin divider line, an amber `>` prompt sits before the text field, and a
square bordered button with an amber `↵` sends. No chat bubbles.

The pill is a fixed button at the bottom right: the same dark terminal
surface, an amber `>`, the words "have a question? ask me", and a small
solid amber block like a text cursor.

Board palette (hex values from the `Main` board, light / dark):

| Board name | Light     | Dark      | Used for                          |
| ---------- | --------- | --------- | --------------------------------- |
| `term`     | `#15130F` | `#070706` | pane and pill surface             |
| `termInk`  | `#E6E0D2` | `#D9D3C4` | message text, `dy` prefix         |
| `termLine` | `#2E2A23` | `#2A2721` | pane border, divider, pill border |
| `termCtl`  | `#6B665A` | `#6B665A` | send button border                |
| `ink3` on term (`//`) | `#6B665A` | `#8B857A` | system line (see Open question 2) |
| `amber`    | `#E8A33D` | `#E8A33D` | `>` prefix, prompt, `↵`, cursor   |

The `Projects` board's pill hard-codes the light values in both themes.

## Behavioral Requirements

### Placement on `/`

1. WHEN `/` renders on a viewport at least 1024px wide THEN the hero
   `.container` holds two columns: on the left, the existing hero
   content unchanged (005 Req 12 as amended: caption row, location line,
   h1, Fig. 1, subline, CTAs); on the right, the Fig. 2 pane (Req 12
   caption above the terminal box). The pane column is between 380px
   and 520px wide, the gap between the columns is 48px, and the top of
   the pane's caption aligns with the top of the `00 / Index` caption
   within 1px. No left-column element intersects the pane, and there is
   no horizontal page scroll. **[decided 2026-10-23, Claude's call:
   widths and gap from the board]** Whether the h1's longest word fits
   the narrower left column at 1024 to 1279px is **unmeasured**
   (Open question 3).

2. WHEN `/` renders on a viewport narrower than 1024px THEN the pane
   sits under the CTA row inside `#top`, left-aligned with the hero
   text, as wide as the container's content box up to 520px. At 375px
   and 320px there is no horizontal page scroll. (Board `Mobile`: the
   pane wraps below the hero text.)

3. WHEN the pane renders THEN its terminal box has a fixed height of
   360px at every width, and the message log scrolls inside the box,
   never the page. WHEN a message is added or a streamed chunk arrives
   THEN the log scrolls to its bottom, as the panel's list does today.
   The log is a scroll container (`overflow-y: auto`); this is allowed
   because it wraps no sticky content and wraps neither the hero nor the
   meter (007 Req 20). **[decided 2026-10-23, Claude's call: the board's
   `min-height: 360px` used as a fixed height, so the hero never grows
   with the conversation and the meter's layout stays stable]**

4. WHEN JavaScript is off, OR before hydration THEN `out/index.html`
   already contains the pane's caption, its terminal box at full height
   and the empty-state line (Req 13), with the text field and the send
   button `disabled`; nothing in the pane can submit a form or navigate.
   WHEN the page hydrates THEN the controls enable and any stored history
   (001 Req 22) appears inside the fixed box: the hero's height and the
   position of every hero element are the same as with JavaScript off
   (no layout shift). **[decided 2026-10-23, Claude's call]**

### One assistant, one conversation

5. WHEN the Fig. 2 pane is mounted THEN no floating launcher or pill is
   rendered and the floating panel cannot be opened; WHEN the pane is not
   mounted THEN the pill is rendered (Req 6). The condition is whether
   the pane is mounted, not a path string, so a URL that Apache answers
   with `index.html` (the SPA fallback for unknown routes,
   `public/.htaccess:47-49`) shows either the pane or the pill, never
   both and never neither. WHEN the route changes to `/` while the
   floating panel is open THEN the panel closes. **[decided 2026-10-23,
   Claude's call: hidden on home entirely, as the `Main` board shows and
   MEMORY.md says "floating launcher on Projects". Rejected: shown only
   while the pane is out of view (more logic, and the hero is one scroll
   away through the header's DY link)]**

6. WHEN the pane is not mounted (any route other than `/`: `/projects`, the four redirect stubs, the not-found page) THEN the pill (Req 24 to
   Req 27) is shown where the round launcher is today, and opening it
   shows today's floating panel. The Fig. 2 pane exists only on `/`.

7. WHEN a visitor completes an exchange in the pane, then navigates
   client-side to `/projects` and opens the pill THEN the panel shows
   the same messages in the same order; and the reverse (an exchange in
   the panel shows in the pane after a client-side navigation to `/`).
   WHEN either page is reloaded THEN the same history loads from
   `localStorage['llm-chat-history']` (001 Req 22, key unchanged). There
   is one history, so the 2-exchange sliding window (001 Req 14) counts
   exchanges from both places together. A stale in-memory copy never
   overwrites newer stored history. WHEN the visitor navigates
   client-side while an answer is streaming THEN the request is not
   aborted and no second request is made: the answer keeps streaming
   into the shared conversation, appears in whichever view is shown, and
   its stop button works there. **[decided 2026-10-23, Claude's call: one
   shared conversation. Rejected: separate conversations (a second
   storage key and a second context window, which is a behaviour
   change). Streaming rule decided 2026-10-27, Claude's call: today's
   `LlmChat` lives in `layout.tsx` and survives navigation, so the
   stream continues today; aborting on leaving `/` would be new
   behaviour, and the unmount abort returns before cleanup
   (`LlmChat.tsx:209-211`, `:328`), leaving a partial answer in the
   stored history]** How the state is shared is the builder's call, but
   it must satisfy the streaming rule.

8. WHEN `out/index.html` is built THEN the chat system prompt
   (`buildCvSystemPrompt()`) is serialized into it no more times than in
   the `main` build: adding the pane does not ship a second copy.

### Chat behaviour in the pane

9. WHEN the visitor types the first character into the pane's text
   field after the pane mounts THEN `trackEvent('chat_open')` fires once
   for that mount, and the offline probe cycle of 001 Req 18 to Req 20
   (OPTIONS on start, then every 30 s, 3 s timeout, 2 failures to flip)
   starts and runs until the pane unmounts. A client-side return to `/`
   mounts the pane again, so the next first character fires again.
   Before that first character the pane sends no probe and fires no
   `chat_open`. The pill keeps today's trigger (click fires `chat_open`,
   opening starts the probe). **[decided 2026-10-23, Claude's call; Open
   question 4]** Probing from page load was rejected: every home visit
   would send probes to the gateway, against the Workers Free daily
   request limit noted in spec 011.

10. WHEN `/` loads THEN the pane takes no focus and causes no scroll (the
    panel's focus-on-open does not apply). WHEN any other route loads
    THEN the pill takes no focus either: the mount-time focus of the
    launcher (`LlmChat.tsx:174-176`, an effect that runs with `open`
    false on mount, **unverified** in a browser) is dropped, and focus
    returns to the pill only after the panel closes (Req 26). WHEN
    Escape is pressed in the pane THEN nothing happens (there is nothing
    to close). **[decided 2026-10-27, Claude's call: the focus rule is
    the second behaviour change beyond Req 9, because a pill that grabs
    focus on every page load would scroll and announce on arrival]**

11. WHEN the visitor sends from the pane THEN everything in spec 001
    applies unchanged: streaming, the silent fallback (Req 6 to 12), the
    per-send AbortController and the stop button (Req 13, 15), error
    classification and the offline card replacing the form (Req 16, 17,
    21), Markdown through `react-markdown` + `remark-gfm` only (Req 24).
    Enter sends and Shift+Enter inserts a newline (today's
    `<textarea>`, not the board's single-line `<input>`). Nothing in the
    pane says which backend answered.

### Pane look

12. WHEN the pane renders THEN it is a `<figure>` whose `<figcaption>`
    sits above the terminal box in `captionClass`
    (`src/components/home/HomeSection.tsx`), `text-muted-foreground`,
    reading `Fig. 2 Assistant` with `Fig. 2` in a `text-link` span,
    exactly like `Fig. 1`. There is no status dot, no "online", no
    "self-hosted" and no note under the pane. **[decided 2026-10-27, Davit: Open question 1, option B]**

13. WHEN the conversation is empty THEN the log shows exactly one system
    line, prefix `//`, whose text is the `welcomeMessage` prop from `src/app/layout.tsx` with one
    wording fix, "trained on" becomes "answers from", so it reads: "Hi!
    I'm an AI assistant that answers from ${personalInfo.name}'s CV,
    LinkedIn, and a curated FAQ. Ask me about his experience, skills, or
    projects." The assistant is a stuffed system prompt, not a trained
    model (MEMORY.md hard "no" on fine-tuning). The same prop feeds the
    floating panel, so it gets the fix too. **[decided 2026-10-27,
    Davit: Open question 1, option B with the reword; the exact wording
    is Claude's call, for Davit to confirm when approving this spec]** WHEN there are
    messages THEN only real messages are shown. No sample question or
    answer is ever pre-filled, in the exported HTML or after mount.
    **[decided 2026-10-23, Claude's call: real data only, as 007
    Req 1 and 2 [accepted]]**

14. WHEN a message renders in the pane THEN it is one row: a 24px prefix
    column and the text. Visitor rows show `>` in amber; assistant rows
    show `dy` in `--term-ink`; message text is `--term-ink`; the system
    line's prefix and text use `--term-muted` (Req 18). The prefixes are
    `aria-hidden="true"`; each row carries a visually hidden speaker
    label, "You" or "Assistant". While an answer is pending, three static dots (today's `TypingDots` without `animate-bounce`; the floating panel keeps the bounce) show in the assistant row. **[decided 2026-10-27, Davit: Open question 7]** **[decided 2026-10-23,
    Claude's call: the speaker labels, because the board removes the
    left/right bubble alignment that told speakers apart]**

15. WHEN the pane's form renders THEN, under a 1px `--term-line`
    divider: an amber `>` (`aria-hidden="true"`); the `<textarea>` with
    today's visually hidden `<label>` "Message" as its accessible name,
    transparent background, `--term-ink` text, amber caret, placeholder
    "ask me anything: my experience, what I built, or whether I'm a fit
    for your team" (board text) in `--term-muted`, at least 44px tall and tall enough that the placeholder is never clipped (it wraps to two lines at 320 and 1024px); a send button at least 44x44px with a 1px `--term-ctl` border and an
    amber `↵`, accessible name "Send message"; while loading, a stop
    button in the same frame, accessible name "Stop response"; under
    them today's hint "Press Enter to send · Shift+Enter for newline" in
    `--term-muted`. The pane's field and focus styles override the unlayered `input, textarea` rules (`globals.css:197-211`) and the global `:focus-visible` rule (`globals.css:216-222`), which would otherwise paint the field with the site's surface colours and the paper-theme `--focus-ring`. Below 640px the textarea's font size is at least 16px. **[decided 2026-10-23, Claude's call: the 16px floor, because
    iOS Safari is widely reported to zoom the page when a field under
    16px gets focus; **unverified** on a device, Verification 15]**

16. WHEN the error banner (`role="alert"`), the offline card (001
    Req 21) or the setup hint (001 Req 1) shows inside the pane THEN it
    sits on the `--card-bg` surface with its existing token colours, not
    on the terminal surface. (By my arithmetic `--destructive` `#9A3B1C`
    on `#15130F` is about 2.66:1, which fails.) **[decided 2026-10-23,
    Claude's call]**

17. WHEN the pane renders in either theme, hydrated, THEN every text on the terminal surface is at
    least 4.5:1 against the background directly under it, the send and
    stop button borders are at least 3:1 against the terminal surface,
    and every focusable control in the terminal box shows a focus
    indicator of at least 3:1: inside the box the ring is amber
    `--button-primary-bg` in both themes. **[decided 2026-10-23,
    Claude's call: the light `--focus-ring` `#9A5B06` would give about
    3.42:1 on `#15130F`, a pass with no margin]** The Req 16 card surfaces (error banner, offline card, setup hint) follow
    the site's existing tokens and are outside this table; the Telegram
    button, white on `#229ED9`, is about 3.0:1 today and spec 004 keeps
    it. Before hydration the disabled field and button are inactive
    components, exempt from WCAG 1.4.3 and 1.4.11, and may be dimmed. My
    arithmetic with the WCAG formula, not measured in a browser
    (Verification 17 checks the table):

    | Pair | Light | Dark |
    | ---- | ----- | ---- |
    | `--term-ink` on `--term` | 14.10 | 13.50 |
    | amber `#E8A33D` (`>`, `↵`, ring) on `--term` | 8.60 | 9.35 |
    | `--term-muted` `#8B857A` on `--term` | 5.07 | 5.50 |
    | board light `//` `#6B665A` on `#15130F` | 3.25 (fails) | n/a |
    | `--term-ctl` `#6B665A` border on `--term` (needs 3) | 3.25 | 3.53 |

18. WHEN `src/app/globals.css` is read THEN:
    - `:root` keeps spec 004's `--term: #15130F`, `--term-ink: #E6E0D2`,
      `--term-line: #2E2A23`, and gains `--term-ctl: #6B665A` and
      `--term-muted: #8B857A`;
    - `html.dark` (and `html[data-theme="dark"]`) sets `--term: #070706`,
      `--term-ink: #D9D3C4`, `--term-line: #2A2721`, `--term-ctl:
      #6B665A`, `--term-muted: #8B857A`.

    All are the board's values except `--term-muted` in light mode
    **[decided 2026-10-27, Davit: Open question 2, `#8B857A` in both themes]**. The chat component files contain no colour
    literal except the Telegram button's `bg-[#229ED9]` and its
    `text-white`, which spec 004 keeps, and the Tailwind opacity classes
    `bg-black/*` and `bg-white/*` of the Markdown code spans in the
    floating panel; spec 004's Tailwind palette
    classes in `LlmChat.tsx` (`bg-amber-500` on the offline dot, the
    four `emerald` classes on the "sent" note) are replaced by existing
    tokens. Inside the pane, Markdown code backgrounds use `--term-line`;
    the panel keeps its code-span classes. **[decided 2026-10-23, Claude's call: named tokens,
    and theme-dependent `--term*`, which amends 004 Req 3]**

19. WHEN the pane or the pill renders, under any motion setting THEN
    nothing in them animates on its own: no entrance animation (the
    board's `dy-rise`), no blinking cursor, no ping dot, no scale on
    hover or press, and the typing dots (Req 14) are static. The floating panel's existing open and close
    animation stays as today (it already honours reduced motion).
    **[decided 2026-10-23, Claude's call: motion beyond what is needed
    goes to a later spec, which must keep any blink to 5 seconds or less
    (WCAG 2.2.2) and none under reduced motion]**

### Living with the spec 007 meter on `/`

20. WHEN `/` renders at least 1024px wide with the meter's instrument
    shown (007 Req 8, 13) THEN:
    - the instrument and its Fig. 0 caption never intersect the Fig. 2
      caption, the terminal box or any left-column element at 1024,
      1280, 1440 and 1920px, and the instrument's right edge stays
      within the `.container`'s right content edge (007 Req 8);
    - the meter's newest samples stay visible: at idle, the rightmost
      200px of the trace lie outside the rects of the pane and of the
      instrument (spikes may pass behind them; only the idle tip and its
      200px lead-in must show);
    - the instrument stays absolutely positioned and client-only, so it
      adds no layout shift (007 Req 17).

    Between 640 and 1023px the instrument stays at the top right as in
    007 and never intersects the stacked pane. Placement at >= 1024px is
    provisional: the idle trace sits at about 75% of the hero's height
    (a reviewer's reading of `meter/loop.ts:12-13` and
    `meter/model.ts:107-110`, **unverified**) and the pane's bottom at
    about 53% (estimate), so the free slot is the right column between
    them, about 20% of the hero (unmeasured). The plan measures the hero
    at the four widths and picks the placement; if no placement meets
    all three bullets the plan stops and asks Davit. **[decided
    2026-10-27, Davit: keep the tip visible (Open question 8). Claude's
    call: the instrument is opaque (`bg-background`, `FrameMeter.tsx:77`)
    as well as a `data-meter-clear` box, so dropping the clear box alone
    would not show the trace under it. Rejected: above the pane (space
    would have to be reserved in server markup and would show as a gap
    with JavaScript off); the board's section corner (the board itself
    overlaps the pane there below about 1700px wide)]**

21. WHEN the meter draws behind the hero THEN the Fig. 2 caption is
    cleared like the other captions (it is a `figcaption`, which
    `measureClearBoxes` in `src/components/home/meter/draw.ts` already
    selects); the terminal box needs no clear box (it is opaque and
    paints above the canvas, inside the hero `.container`, `z-[1]`); and
    links inside the pane (Markdown links in answers, the Telegram button
    in the offline card) are excluded from the clear boxes: the pane
    root carries `data-meter-skip` and the link selector in `draw.ts`
    (`'[data-meter-clear], .container a'`) skips `a` inside it, because
    `measureClearBoxes` measures rects once in `layout()` and a link
    scrolled out of the 360px log would otherwise punch a hole in the
    grid on the paper. This is the only `draw.ts` change; 007's draw
    tests gain a case for it. `document.elementFromPoint` at the centre
    of the textarea and of the send button returns that control (the
    meter overlay is `pointer-events-none`). **[decided 2026-10-27,
    Claude's call, from the spec review; the draft said `draw.ts` needs
    no change]**

22. WHEN `/` renders narrower than 640px with the meter in phone mode
    (007 Req 14) THEN the Fig. 0 caption stays at the bottom left of the
    hero, inside its bottom padding, and never intersects the stacked
    pane. Because no launcher or pill exists on `/` (Req 5), none covers
    the caption at any width, including below 349px; the consent banner
    (`ConsentBanner.tsx`, fixed at the bottom) may cover it while it is
    shown, as today.

23. WHEN a screen reader reads the hero, or the keyboard tabs through it
    THEN the order is: `00 / Index`, location line, h1, Fig. 1, subline,
    the two CTAs, the Fig. 2 caption, the log (empty-state line or
    messages), the text field, the send (or stop) button, then the Fig. 0
    caption (read, not focusable). The log is a scroll container, so it
    is made keyboard-scrollable on purpose (WCAG 2.1.1): `role="log"`,
    `tabindex="0"` and the accessible name "Conversation". Tab stops in
    the hero: "View projects", "Resume (PDF)", the log, the text field,
    and the send button once the field has text (today it is `disabled`
    while the field is empty, `LlmChat.tsx:553`, so it is not a tab stop
    then). The log keeps today's `aria-live="polite"` with `aria-busy`
    while loading (`LlmChat.tsx:482-483`). History restored from
    storage after hydration must not be announced as new content;
    whether it would be, and whether screen readers announce a streamed
    Markdown answer once or in pieces, are **unverified** (Verification
    23 records both).

### The pill (every route except `/`)

24. WHEN the pill renders THEN it is a fixed button at the bottom right
    with today's launcher offsets (`bottom-4 right-4`, `sm:bottom-6
    sm:right-6`), at least 52px tall, on `--term` with a 1px
    `--term-line` border, `--r-4` corners, showing an amber `>`
    (`aria-hidden`), the text "have a question? ask me" in `--term-ink`,
    and a solid amber block about 8x15px (`aria-hidden`), with no shadow
    other than an existing `--shadow-*` token. In dark mode it uses the
    dark `--term*` values (Req 18). **[decided 2026-10-23, Claude's
    call: today's offsets, not the board's 24px, so on phones the pill
    sits 8px closer to the corner and covers less content; the dark
    values, not the board's fixed light ones (Open question 6)]**

25. WHEN assistive technology reads the pill THEN its accessible name is
    its visible text, "have a question? ask me" (no `aria-label`), and it
    keeps `aria-haspopup="dialog"` and `aria-expanded`. Its focus ring
    is the site's `--focus-ring` and is visible against the paper in
    both themes. **[decided 2026-10-23, Claude's call: WCAG 2.5.3]**

26. WHEN the pill is clicked THEN today's behaviour applies unchanged:
    `chat_open` fires, the panel opens and takes focus, the pill hides
    while the panel is open (`pointer-events-none opacity-0`), and on
    close focus returns to the pill.

27. WHEN `/projects` is shown at 1024x780, 1280x670 (the spec 006 pin
    bands) and 375x812 THEN, for each chapter while it is pinned (or, at
    375px, scrolled so the chapter's last control is at the viewport
    bottom), no link or button in the chapter is fully covered by the
    pill. Whether this holds with a pill about 246px wide (estimate from
    23 characters of JetBrains Mono at 12.5px, not measured) is
    **unverified**; if it fails, the plan stops and asks Davit.

### Not changed

28. WHEN the floating panel is open on any route other than `/` THEN its
    frame, header (title, Telegram, clear, close), list, form and
    offline card look and behave as today, apart from the colour-class
    replacement in Req 18. (Open question 5.)

29. WHEN any page or the chat system prompt renders THEN neither the
    target pay figures nor the trading client's name appear.

## Non-goals

- Any chat behaviour change beyond Req 9, Req 10 and Req 13: streaming, the silent
  fallback, the offline probe logic and card, error handling, the
  2-exchange window, the storage key, the system prompt, the model,
  `src/lib/llm-chat.ts`, `src/lib/llm-chat-fallback.ts`,
  `src/lib/system-prompt.ts`.
- Analytics and consent changes: no new event names, `src/lib/analytics.ts`
  and `ConsentBanner.tsx` untouched (spec 002).
- A live "online" status, a backend label, or any text saying which
  model answered (spec 001 Non-goals, MEMORY.md 2026-10-09).
- A pre-filled sample conversation.
- The English / Armenian toggle (deferred 2026-10-09), the boot counter
  and the board's `● live` caption (later specs).
- The `dy-rise` entrance, a blinking cursor, any pill or pane animation:
  a later motion spec.
- Restyling the floating panel's interior as a terminal (Open question
  5).
- Any welcome-message change other than the "trained on" fix of
  Req 13, or the footer's "Self-hosted assistant" (005 Req 19); see
  "Noticed, not changed".
- The board's pane drop shadow, the board's 13.5px pane font as a new
  token, a config flag or env var to turn the pane or pill off.
- A pane on any page other than `/`; a launcher on `/`.
- Pausing the meter while an answer streams. If streaming causes long
  tasks, the meter counting them is real data (007 Req 1, 5).
- New dependencies.

## Interface contract

- **Env vars:** none new. The pane reads the same `NEXT_PUBLIC_CHAT_*`
  and `NEXT_PUBLIC_TELEGRAM_FALLBACK_URL` values as today (spec 001
  table), static-site tier.
- **Tokens (`src/app/globals.css`):** `--term`, `--term-ink`,
  `--term-line` gain dark values; new `--term-ctl`, `--term-muted`
  (Req 18). No other new variable.
- **Storage:** `localStorage['llm-chat-history']`, unchanged and shared
  by pane and panel (Req 7).
- **Analytics events:** `chat_open` (pane trigger per Req 9, pill as
  today), `chat_offline_fallback_sent`, `chat_offline_telegram_click`,
  names unchanged.
- **Files:** `src/components/LlmChat.tsx` (pill, route awareness,
  shared state, pane view; any split into new files is the builder's
  call); `src/components/Hero.tsx` (two columns, mounts the pane);
  `src/components/home/FrameMeter.tsx` (instrument position at
  >= 1024px, Req 20); `src/app/globals.css` (Req 18);
  `src/app/layout.tsx` (the welcome wording of Req 13, and the shared
  state if it needs it); `src/components/home/meter/draw.ts` (the link
  selector only, Req 21) and its test. Not touched: `src/lib/*`,
  `Header.tsx`, `ConsentBanner.tsx`, `meter/loop.ts`.
- **Artifacts in `out/`:** `index.html` contains `Fig. 2` exactly once
  (`grep -o ... | wc -l` is 1), the pane's disabled `<textarea>`, no
  "have a question", no "trained on" and no sample conversation.
  `projects.html` contains "have a question? ask me" once.
  That the pill's absence on `/` is decided at prerender (route read
  during the static export) is **unverified**; if the route is only
  known after mount, `out/index.html` may contain the pill markup, and
  Verification 5 checks the browser DOM instead.

### Left to the builder (say so in the plan)

How pane and panel share one conversation (one `LlmChat` instance with
two views, a portal into a slot in `Hero.tsx`, or a shared store).
Whatever is chosen, the pane's caption, terminal box and empty-state
line are prerendered into `out/index.html` (Req 4); a client-only portal
alone does not meet that. Also: component split; how the route is read;
the pill's font size (nearest existing `--fs-m*`; the board's 12.5px is not a token); the pane's padding
and line height (board: 20px 22px 16px, 13.5px, 1.7); the empty-state
line's wrapping; how the "stale copy never overwrites" rule of Req 7 is
enforced.

## Amendments this spec makes

Applied by the implementation plan, not edited now. Line numbers as of
2026-10-23.

- **001** (verified): dated note under Req 18 and Req 25: in the home
  pane the probe and `chat_open` start on the first typed character
  (008 Req 9); behaviour otherwise unchanged.
- **002**: dated note under Req 13: `chat_open` also fires from the
  pane's first typed character.
- **004** Req 3 (line 86-89): `--term*` are no longer theme-independent;
  dark values and two new tokens per 008 Req 18. Non-goals table
  (line 250): the `LlmChat.tsx` palette classes are handled by 008
  Req 18.
- **005** line 6 metadata: add "Req 12 and Req 24 amended by 008";
  Req 12 (line 175-176, "the Fig. 2 chat pane are not part of this
  spec"): lands in 008; Req 24 (line 259-261, "`LlmChat` (today's
  floating widget, unchanged)"): no launcher on `/`, pill elsewhere,
  pane in the hero; Non-goals line 272-273.
- **006** line 71-73 ("`LlmChat` launcher exactly as today") and Non-goals
  line 220-221 (pill is 008, `LlmChat.tsx` untouched)
  and line 230-233 (launcher may overlap pinned chapters): now the pill,
  checked by 008 Req 27.
- **007** Req 8 (line 170-181): at >= 1024px the instrument is placed per
  008 Req 20, and the "Note on spec 008" is resolved;
  Req 9 (line 197-199): Fig. 2 is used by 008; Req 10 known limitation
  (line 223-225): moot on `/`, no panel opens there; Req 14 (line
  260-273): the launcher clause and the accepted limit below 349px no
  longer apply, since no launcher exists on `/`; Req 17: the pane joins
  the no-overlap list; Req 19 and V19: Fig. 0 is read after the Fig. 2
  pane; V15 and V17a: the launcher comparison becomes "no launcher in
  the DOM on `/`"; V22 (line 617, "chat opens on `/`"): there is no launcher
  on `/`; V17: the >= 1024px instrument position; Non-goals
  line 375-376.

## Verification

All pnpm commands use `--ignore-workspace` (ERRORS.md, 2026-10-09).
Restart the dev server after any build before trusting a browser
reading, and run meter checks in a visible browser window (ERRORS.md).

1. At 1024, 1280, 1440 and 1920 wide on `/`: the pane is in the right
   column; its width is 380 to 520px; the gap to the left column is
   48px; its caption's `top` equals the `00 / Index` caption's `top`
   within 1px; no left-column element's `getBoundingClientRect()`
   intersects the pane's; `document.documentElement.scrollWidth ===
   innerWidth`. Record the h1's widest line at 1024px in Implementation
   notes (Req 1, Open question 3).
2. At 1023, 768, 640, 375 and 320 wide: the pane is below the CTA row,
   its `left` equals the h1's `left`, its width is `min(content width,
   520)`; no horizontal scroll (Req 2).
3. The terminal box's height is 360px at 320, 768 and 1440 wide. Send
   four long questions: the log scrolls inside the box, the box and the
   hero keep their height, `window.scrollY` does not change while an
   answer streams (Req 3).
4. `pnpm --ignore-workspace run build`; `grep -o 'Fig\. 2' out/index.html
   | wc -l` is 1, the pane's `<textarea` and send button carry
   `disabled`. With JavaScript off, compare `#top`'s height and the h1,
   portrait, CTA and pane rects with JavaScript on after mount, at
   1440x900 and 375px: identical (Req 4).

5. On `/` after mount: `document.body.innerText.includes('have a
   question')` is `false` and no element in the DOM carries that text.
   Open the panel on `/projects`, click the header's DY link: the panel
   is gone on `/` (Req 5).
6. On `/projects` and on a non-existent URL served by
   `pnpm --ignore-workspace run serve` (which serves `404.html`): the pill
   is present and opens the panel; no Fig. 2 pane exists there.
   `grep -c 'have a question' out/projects.html` is 1, or, if the route
   is only known after mount (Interface contract), the pill is checked in
   the browser DOM on `/projects` only. Then serve `out/` with a
   throwaway static server that rewrites unknown paths to `index.html`
   (the `public/.htaccess:47-49` fallback; `serve` does not reproduce
   it) and open an unknown URL: exactly one of pane and pill is in the
   DOM, and the console shows no hydration error (Req 5, 6).

7. Clear storage. Ask one question in the pane, wait for the answer,
   click "View projects", open the pill: the panel shows the same two
   messages. Ask one question in the panel (the 2nd completed exchange,
   so the history collapses to that pair, 001 Req 14), click the DY link:
   the pane shows that pair only. Reload `/`: the same pair loads. Then
   start a long answer in the pane, click "View projects" while it
   streams and open the pill: the answer continues to completion, Network
   shows one request, and the stop button works in the panel (Req 7).

8. Pick a distinctive phrase from `buildCvSystemPrompt()` output; `grep -o
   '<phrase>' out/index.html | wc -l` equals the same count on a `main`
   build made in a temp worktree (Req 8).
9. DevTools Network on `/`, fresh load, idle 40 s: no OPTIONS request
   to the chat URL, and (with analytics consent granted) no `chat_open`.
   Type one character in the pane: one `chat_open` and an OPTIONS probe
   follow; another follows about 30 s later; typing more fires no
   second `chat_open`. Click "View projects", click the DY link, type
   one character: a new `chat_open` fires (once per pane mount)
   (Req 9).

10. Reload `/` at 375px and 1440px, and `/projects` at 375px and
    1440px: `document.activeElement` is `body` and `scrollY` is 0. Focus
    the pane and press Escape: nothing changes (Req 10).

11. From the pane, rerun spec 001 Verification 3, 4 and 5 with the
    primary backend simulated down by DevTools request blocking on the
    chat URL (the gateway answers the probe at the edge, so stopping the
    laptop would not fail it): the answer arrives from the fallback with
    no visible difference; the offline card replaces the form after the
    second failed probe, or at once on a 5xx send. Press Enter: sends.
    Shift+Enter: newline. Stop mid-answer: the stop button aborts
    (Req 11).

12. The pane is a `figure`; its `figcaption` reads "Fig. 2 Assistant"
    with "Fig. 2" in the link colour, above the box; no "online",
    "self-hosted" or "own computer" text in or around the pane (`#top`
    `innerText` search), and no "laptop" unless the offline card is shown
    (that card says it, `LlmChat.tsx:733`) (Req 12).

13. Clear storage, reload: the log holds one `//` line with the new
    `welcomeMessage` text and nothing else, before and after mount;
    `grep -c 'trained on' out/index.html` is 0 and `grep -c 'answers
    from' out/index.html` is at least 1; `grep -c 'what have you worked
    on recently' out/index.html` is 0 (Req 13).

14. After one exchange: rows show `>` and `dy` prefixes, no bubbles;
    the accessibility tree shows "You" and "Assistant" for the rows and
    no `>` or `dy` (Req 14).
15. Accessibility tree: the text field's name is "Message"; send is
    "Send message", 44x44px or larger; stop is "Stop response". The
    textarea's computed `background-color` is transparent, its `color`
    is `--term-ink`, and its focus ring is amber (not the global
    `--focus-ring`); the placeholder is fully visible in a zoomed
    screenshot at 320 and 1024px. At 375px the textarea's computed
    `font-size` is at least 16px; on a real iPhone in Safari, tapping the
    field does not zoom the page (record the device and iOS version)
    (Req 15).

16. Force an error and the offline card in the pane (DevTools request
    blocking on the chat URL): both render on the card surface;
    computed `background-color` equals `--card-bg` (Req 16).
17. Run (arithmetic check of the Req 17 table):

    ```bash
    node -e 'const c=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));const lin=v=>{v/=255;return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4};const L=x=>.2126*lin(x[0])+.7152*lin(x[1])+.0722*lin(x[2]);const R=(a,b)=>{const[p,q]=[L(c(a)),L(c(b))].sort((x,y)=>y-x);return((p+.05)/(q+.05)).toFixed(2)};for(const[n,f,b]of[["light term-ink","#E6E0D2","#15130F"],["dark term-ink","#D9D3C4","#070706"],["light amber","#E8A33D","#15130F"],["dark amber","#E8A33D","#070706"],["light term-muted","#8B857A","#15130F"],["dark term-muted","#8B857A","#070706"],["board light sys line","#6B665A","#15130F"],["light term-ctl border","#6B665A","#15130F"],["dark term-ctl border","#6B665A","#070706"],["light focus-ring on term","#9A5B06","#15130F"],["light destructive on term","#9A3B1C","#15130F"]])console.log(n,R(f,b))'
    ```

    Every text line is at least 4.5 and every border or ring line at
    least 3, except the two rows the spec marks as failing. Then, in the
    browser in both themes, Tab to the textarea, type one character and
    Tab to the send button: on both the ring is amber (Req 17).
18. `git diff main -- src/app/globals.css` shows exactly the variables
    of Req 18 and no other new `--` variable;
    `grep -nE "amber-|emerald-" src/components/LlmChat.tsx` (and any new
    chat component file) returns nothing;
    `grep -nE "#[0-9A-Fa-f]{3,8}\b" <chat component files>` returns only
    `#229ED9` (Req 18).
19. With and without DevTools `prefers-reduced-motion: reduce`: reload
    `/` and `/projects`; record 5 s in the Performance panel, including
    while an answer is pending: no animation on the pane or pill; the
    pill's cursor block is solid and the pane's typing dots are static
    the whole time (Req 19).

20. At 1024, 1280, 1440 and 1920 wide: neither the instrument nor the
    Fig. 0 caption intersects the pane's caption or box or any
    left-column element, and the instrument's right edge is within the
    `.container`'s right content edge. With the meter idle for 10 s at
    each width, find the trace's y at the canvas's right edge (from the
    canvas pixels, or from the idle constant in `meter/loop.ts` and
    `meter/model.ts`, whichever the plan verified) and assert the points
    from 200px left of the canvas's right edge to the edge at that y fall
    outside the `getBoundingClientRect()` of both the pane and the
    instrument; save a zoomed screenshot of the hero's right 400px in
    Implementation notes. At 640 and 768: instrument at the top right as
    in 007 V17, no intersection with the pane. Repeat at 1440 with
    reduced motion (instrument without sparkline) (Req 20).

21. At 1440x900, run 007 V24's magenta test: the pane is drawn above the
    magenta. Seed `localStorage['llm-chat-history']` (shape per
    `LlmChat.tsx`) with an answer holding a Markdown link followed by
    enough lines that the link scrolls out of the log; reload and scroll
    the log to its end: where the link's `getBoundingClientRect()` centre
    lies outside the pane's rect, the canvas alpha there equals the
    grid's alpha, not 0. `document.elementFromPoint` at the centre of the
    textarea and the send button returns those elements, at 1440 and 375
    (Req 21).

22. At 375 and 320 wide, scroll so the hero's bottom is at the viewport
    bottom (consent dismissed): the Fig. 0 caption's rect does not
    intersect the pane's, and intersects no `position: fixed` element's
    rect (Req 22).

23. VoiceOver on `/`, linear reading, then Tab with the field empty and
    again after typing one character: the order and tab stops of Req 23,
    including the log as a tab stop that scrolls with the arrow keys.
    Reload with stored history and record in Implementation notes whether
    the restored messages are announced; send a question and record how
    the streamed answer is announced (Req 23).

24. On `/projects` at 375 and 1440: the pill's rect has `bottom` 16px
    (375) or 24px (1440) above the viewport bottom and `right` the same
    from the right edge; height at least 52px; computed `background-color`
    equals `--term`, border is 1px `--term-line`, border radius `--r-4`,
    the cursor block is about 8x15px and `--button-primary-bg`, in light
    and dark (Req 24).

25. Accessibility tree: the pill's name is "have a question? ask me";
    it has `aria-haspopup="dialog"` and `aria-expanded="false"`; Tab to
    it in both themes: the ring is visible (Req 25).
26. Click the pill: GA4 DebugView (or the `trackEvent` call in the
    console) shows `chat_open`; the panel opens with the text field
    focused; Escape closes it and focus returns to the pill (Req 26).
27. On `/projects` at 1024x780, 1280x670 and 375x812, for each chapter:
    scroll until it is pinned (or its last control is at the viewport
    bottom at 375) and run `document.elementFromPoint` at the centre of
    every link and button in it: each returns that control or its child,
    never the pill. Record the pill's measured width (Req 27).
28. Open the panel on `/projects` at 1440 and 375: frame, header
    buttons, list, form and offline card match `main` except the
    colours replaced in Req 18 (Req 28).
29. `grep -ri "<trading client name>\|<target pay figures>" src/ out/
    specs/` returns nothing; type the real name and figures locally,
    never into a file (Req 29).

## Open questions

Decided 2026-10-27 (Davit, in answer to the review round):

1. **Pane copy** (Req 12, 13; conflict 2): option B, caption "Fig. 2
   Assistant", no status, no note, the `//` line is the welcome message
   with "trained on" reworded. Rejected: (A) the board copy as drawn,
   whose claims can be false; (C) a probe-driven status dot, which would
   still say "online" while the laptop is off because the probe is
   answered at the gateway edge (spec 011).
2. **`//` colour** (Req 14, 17, 18; conflict 3): `--term-muted: #8B857A`
   in both themes (about 5.07:1 light, 5.50:1 dark). Rejected: the
   board's `#6B665A`, 3.25:1.
7. **Typing dots** (Req 14, 19): static in the pane. Rejected: bounce
   with a reduced-motion exception.
8. **Trace tip** (Req 20): the meter's newest samples stay visible;
   placement of the instrument is measured in the plan. Rejected:
   accepting that the live tip is hidden behind the instrument.

Non-blocking (the default stands unless Davit says otherwise):

3. **h1 fit at 1024 to 1279px** (Req 1). The left column is about 564px
   there (992px content minus 48px gap minus 380px pane; arithmetic).
   Whether "Systems-minded" at 84px Fraunces fits is unmeasured.
   **Default:** if Verification 1 shows it does not fit, the two columns
   start at 1280px and the pane stacks below 1280px; Req 20's
   bottom-right instrument position then applies from 1280px, and the
   top-right position from 640 to 1279px.
4. **Pane trigger for `chat_open` and the probe** (Req 9).
   **Default:** first typed character. Alternatives: first focus (also
   fires when a keyboard user only tabs past) or first send (the offline
   card would then appear only after a failed send).
5. **Floating panel interior** (Req 28). **Default:** unchanged except
   the colour classes. Alternative: the same terminal rows and form as
   the pane, for one look across pages.
6. **Pill colours in dark mode** (Req 24). **Default:** the dark
   `--term*` values (`#070706` surface; against the dark paper `#0E0D0B`
   that is about 1.04:1 and the `--term-line` border about 1.3:1, so
   the pill reads mostly through its amber text and cursor; not a WCAG
   failure, a look note). Alternative: the `Projects`
   board's fixed light values in both themes (needs separate pill
   tokens).

## Noticed, not changed

- The welcome message's "trained on" is fixed by Req 13. Voice is
  mixed: the welcome message says "his experience" (third person) while
  the placeholder and the pill say "ask me" (first person); not changed.
- The footer's "Self-hosted assistant" (005 Req 19) has the same
  fallback problem as conflict 2.
- Today's send and stop buttons are 40x40px (`h-10 w-10`), under the
  44px target in MEMORY.md §8; the pane fixes it (Req 15), the panel
  keeps it (Req 28).
- `TypingDots` uses `animate-bounce` with no reduced-motion guard; the
  pane's dots are static (Req 14), the panel keeps today's.
- `chat_offline_telegram_click` fires today but is not in spec 002's
  list of known events.

## Implementation notes

Filled in during implementation and verification.

- V1 h1 widest line at 1024px (measured, 2026-10-27, dev server): 559.95px, 2 lines (530.48 and 559.95), in the shipped layout, where the hero is one column at 1024 (see "Two columns start at 1280px" below). With the two-column grid at 1024 the h1 wrapped to 4 lines (widest 288.44px) in a 424px left column. Baseline (Task 0): 559.95px at 1024, 1280, 1440 and 1920 alike; #top is 904.86px tall at every width.
- V23 streamed answer announcement (screen reader, browser): Davit. Also Davit: whether restored history is announced as new content.
- V27 pill width (measured): 252.41px (x 52) at 1024x780, 1280x670 and 375x812, against the 246px estimate in Req 27. At those sizes `document.elementFromPoint` never returned the pill for the chapter controls checked, and the pill never sat above them in `elementsFromPoint`. Thin coverage: only 2 links exist inside the chapters and both centres were under the consent banner, so the stack check carried it.
- Pathname result (Req 5, Task 3): `usePathname()` is `/` during the static export, so `out/index.html` has no pill markup (`have a question? ask me` 0) and `out/projects.html` has it once; the fallback of reading the route after mount was not needed. Not provable here: on an unknown URL served through a fallback page `usePathname()` is not `/` during hydration, so the pill markup could mismatch the server HTML (V6, Davit).
- Placement of the instrument (Req 20, Task 5, measured at 1280, 1440 and 1920): the Fig. 2 figure (caption plus box) 96px to 485.88px below the top of #top (96 + 17.875 caption + 12 margin + 360 box = 485.875); the idle trace at 60 Hz is at 681.01px (0.38 H + 0.56 H x (1 - 16.67/50) = 0.7533 H, computed from `meter/loop.ts` and `meter/model.ts`; 0.7526 of the 904.86px hero). Not pixel-confirmed: in a hidden pane `requestAnimationFrame` never fires and `drawTrace` draws nothing with fewer than 2 samples. The 30 Hz idle is at 0.567 H (512px), not the 0.627 in the Task 0 baseline file (arithmetic slip; not used for placement). Classes `xl:top-auto xl:right-[204px] xl:bottom-60`: the instrument wrapper (box 116.09px, `mt-2`, Fig. 0 caption 16.5px, 140.59px in all) sits at 523.27 to 663.86px, 37.4px under the pane and 17.2px above the 60 Hz idle line. Saved screenshots (workspace, git-ignored): `.superpowers/sdd/2026-10-27-chat-terminal-pane/t5-hero-right-400-1440.png` (hero's right 400px, 1440 wide, paper), `.../t5-magenta-right-400-1440.png` and `.../t5-magenta-1440.jpg` (V21 magenta test). V4 (JavaScript off, sandboxed iframe): #top height, h1, portrait, both CTAs, Fig. 2 caption and `#chat-pane-box` rects identical to the hydrated page, max difference 0px, at 1440x900 and 375x812.
- Two columns start at 1280px (xl), not 1024px (Req 1, 2, 20; Open question 3 default applied): with the shipped `minmax(380px, 520px)` track the grid gives the pane its 520px maximum first, so the left column is 424px at 1024 and 500px at 1100 and the h1 wraps to 4 lines (it fits on 2 lines at 1180 and 1279, left column 580 and 679px). The Req 1 estimate of 564px assumed a 380px pane; a fixed 380px pane would have fit at 1024 by about 4px. So: two columns and the instrument's bottom placement from 1280px; the pane stacks under the CTAs below 1280px; the instrument stays at the top right from 640 to 1279px. The Req 1, 2 and 20 text above still says 1024; the 1280 figure is this note and Open question 3. The instrument is `xl:top-auto xl:right-[204px] xl:bottom-60` from 1280 (right edge = the container's right edge minus 204px (FrameMeter's own centred 80rem `.container`), about canvas width minus 284px at 1440 and minus 524px at 1920, so the idle trace's last 200px stay clear, with more room than a bare 204px, whatever the frame-time jitter), `top-16 lg:top-24` at the right from 640 to 1279. It sits 188px left of the pane's right edge; one class if Davit wants it flush right (then the vertical slot alone clears the idle tip at 60 Hz, not at 30 Hz).
- Req 9, probe while offline: the pane holds the probe while `engaged || isOffline`. Without `isOffline` a remount of the pane while the app was offline would never restart the probe (nothing is typed). `isOffline` is only true after an earlier failure in the same session, so there is no probe on a fresh first visit and the purpose of Req 9 holds.
- Req 15, placeholder line count: the verbatim placeholder wraps to 5 lines at 320px, 4 at 360 to 414, 3 at 480 and 2 at 600 and wider, not "2 at 320 and 1024". The binding rule, never clipped, is met by a hidden twin that sizes the field; the log is 149px at 320 (the 120px floor holds). The placeholder text is kept verbatim; Davit may shorten it for a shorter form at 320.
- Req 17, log focus ring: the log's focus ring is inset (`outline-offset: -2px`) so it stays on `--term`; outside the box it sat on the paper at 1.91:1 (light).
- Enter during IME composition does not send in the pane (`isComposing` or `keyCode` 229). The floating panel has the same gap and was left unchanged (Req 28, behaviour unchanged).
- Probe cadence with a fallback backend: `resolveFallbackConfig` in `ChatProvider.tsx` has memo deps `[config]`. On `main`, `LlmChat.tsx` had `[config, props]`; `props` is a new object on every render, so with `NEXT_PUBLIC_CHAT_API_URL_FALLBACK` set the memo and the probe effect that depends on `fallbackConfig` ran again on every render. Now the probe restarts only when `config` changes. Same value, different cadence from `main` in that case only; no effect without a fallback URL.
- Noticed, not changed: a cancel followed by an immediate resend can race in the `finally` of the send path (pre-existing). The visible copy "Message David on Telegram" in `parts.tsx` misspells the name (pre-existing). The "sent" note keeps its em dash (site copy, Req 28).
- Davit's list (not provable from a hidden pane or without a configured backend; the executor did not tick these):
  - V7: pane exchange, navigate, open the pill; panel exchange, navigate home; reload; a stream continues across navigation with one Network request and the stop button works.
  - V9: no OPTIONS or `chat_open` over 40s idle on `/`; the first character fires one `chat_open` and a probe, another about 30s later; a remount fires again.
  - V11: send from the pane with request blocking on the chat URL; fallback answer; offline card; Enter, Shift+Enter, stop.
  - V15: on a real iPhone, no zoom on focus.
  - V19: Performance recording. V23: screen reader order, restored history, streamed answer. V28: panel against `main`. V29: client-name grep with the real name typed locally.
  - The live trace tip at 1024, 1280, 1440 and 1920 with the meter running, with and without reduced motion; reduced-motion instrument at 1440; whether the instrument should sit flush right.
  - The pill flash on client-side navigation to `/` (`registerPane` is in `useEffect`; switch to a layout effect if a frame shows both); the panel unmounting on arrival at `/` (its exit animation needs frames).
  - Real IME composition (checked by proxy: `defaultPrevented` on an empty field).
  - 640 to 735px stacked pane against the idle tip's x range (new compared with 007, not a Req 20 violation).
  - V6: unknown-URL fallback hydration (pill markup versus server HTML).
  - The `!configured` setup hint and the error banner on `--card-bg`.
  - 1024 to 1279px now shows the stacked pane under a 2-line h1: check it reads well on a real laptop width. The consent banner overlaps the pill centre at 375 and 1440 on first load (pre-existing): eyeball on a real phone. The Next dev overlay "1 issue" badge is probably the test guard's own rejections (unproven; check on a guard-free load).
- Disclosures: during Task 2, opening the panel in the configured dev environment sent the app's own OPTIONS health probe to the chat gateway (no message, no data). During Task 4, two real `chat_open` events reached the site's analytics from the localhost dev page before and during the stubs being installed. Clarity requests between page load and the guard being pasted were not covered in any browser run.
- Verification run (2026-10-27, tree at the Task 5 commit): `bash run.sh t2-static.sh t3-pill.sh t4-pane.sh t5-static.sh t6-final.sh` (build, tsc, eslint src, 9 model tests, then the five check scripts) reports RUN OK. The browser checks of Tasks 2 to 5 ran in the hidden dev pane; see the ledger.
