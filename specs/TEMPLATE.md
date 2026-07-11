# NNN — <feature name>

- **Status:** draft | approved | implemented | verified
- **Date:** YYYY-MM-DD (update on status change)
- **Spec:** NNN
- **Supersedes / superseded-by:** — (if applicable)

## Intent

One or two sentences: what the user/visitor gets and why it's worth
building. If you can't say it in two sentences, the scope is too big —
split it.

## Behavioral Requirements

Numbered, testable, WHEN/THEN. Each one should be checkable by a
human or a command in Verification below.

1. WHEN <trigger/condition> THEN <observable outcome>.
2. WHEN <trigger/condition> THEN <observable outcome>.
3. ...

## Non-goals

What this spec deliberately does NOT cover, so nobody "helpfully"
builds it. Include anything ruled out by MEMORY.md's hard-"no" list
if adjacent.

- ...

## Interface contract

Only sections that apply — delete the rest.

- **Env vars:** name, tier (static site `.env.local` / Worker secret /
  laptop), example value, format gotchas (quotes, trailing slash).
- **Component props / exports:** signatures that other code relies on.
- **Endpoints called:** method, URL, auth, expected status codes.
- **Files/artifacts:** anything that must land in `out/` on build.

## Verification

Concrete steps a future you can run cold. Prefer commands over prose.
Each requirement above should be covered by at least one step.

1. `pnpm run build` succeeds; `grep ... out/...` shows ...
2. Open http://localhost:3000/..., do X, observe Y (Req 1).
3. `curl -i ...` returns 200 (Req 3).

## Open questions

Must be empty (or explicitly deferred as non-blocking) before status
moves to approved.

- [ ] ...
