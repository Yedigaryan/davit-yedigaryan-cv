# Specs — Spec-Driven Development (lightweight)

Solo-maintainer workflow for davit-yedigaryan-cv. A spec is a small
contract for *behavior*, written before the code. If writing the spec
takes longer than the change itself, the change probably doesn't need
one — see "When NOT to write a spec".

## When a spec IS required

- **New user-visible feature** (new page, new widget, new fallback
  path, new script with side effects — e.g. anything like LlmChat,
  ConsentBanner, or the Telegram fallback would have gotten one).
- **Behavior change to an already-spec'd feature** — update the
  existing spec first (or supersede it), then implement.
- **New external contract** — a new `NEXT_PUBLIC_*` env var, a new
  endpoint the site calls, a new deploy-time requirement.

## When a spec is NOT required

- Typos, copy edits, styling tweaks with no behavior change.
- Dependency bumps (unless the bump changes behavior you rely on).
- Pure refactors — same inputs, same outputs. If a refactor *would*
  change behavior, it's not a pure refactor; spec it.
- Content updates to `src/lib/data.ts` / `faqs.ts` / `linkedin.ts`
  (the data changes; the behavior doesn't).
- One-off debugging or infra firefighting. Lessons from those go to
  MEMORY.md / ERRORS.md, not specs.

Default when unsure: ask. (CLAUDE.md rule 17 applies to specs too.)

## Lifecycle

`draft` → `approved` → `implemented` → `verified`

1. **draft** — written from the feature request. Open questions allowed.
2. **approved** — Davit has read it and said yes. No open questions
   left that block implementation. Only approved specs get implemented.
3. **implemented** — code merged; commits reference the spec.
4. **verified** — every step in the spec's Verification section has
   been run and passed. Record the date in the metadata block.

A later change that alters behavior either **amends** the spec (small
delta, bump the date, note the change at the bottom) or **supersedes**
it with a new spec (add `superseded-by: NNN` to the old one). Don't
silently edit an implemented spec's requirements.

## How this relates to MEMORY.md and ERRORS.md

Three files, three jobs — no overlap:

| File        | Answers                | Example                                    |
| ----------- | ---------------------- | ------------------------------------------ |
| `specs/NNN` | **What** must it do?   | "WHEN the probe fails twice THEN show the fallback card" |
| `MEMORY.md` | **Why** this way? What broke once? | "Probe the chat URL, not /health — /health lies when the laptop is down" |
| `ERRORS.md` | What approach failed >2 times? | "socat PROXY: silently drops; use SOCKS5-CONNECT" |

Specs do not replace MEMORY.md. When a spec is approved, the *decision*
(what was rejected and why) still gets a MEMORY.md entry per CLAUDE.md
rule 10 — the entry can be two lines plus a pointer:
"See specs/003-... for the behavior contract."

A spec must not contradict a MEMORY.md invariant (e.g. the hard "no"
list, the 2-exchange sliding window, single-source-of-truth rules)
without explicitly flagging the contradiction in the spec's Open
questions and getting it resolved before approval.

## Numbering & naming

`specs/NNN-kebab-name.md` — zero-padded, sequential, never reused.
Example: `specs/001-chat-offline-fallback.md`. Next number = highest
existing + 1. The number is the spec's permanent ID even if the
feature is later removed (mark it superseded instead of deleting).

## Commits reference the spec

Every commit implementing a spec mentions it: `feat: offline fallback
card (spec 001)`. That's the whole traceability story — no tooling,
no hooks, just grep-ability: `git log --grep "spec 001"`.
