> This checklist belongs to spec 011, Req 27 (site cutover edits) and Req 30 (spec 001 amendment). It is not a numbered spec and it adds no requirement. It only turns those two requirements into exact text edits.

# 011 Req 27 / Req 30 - Cutover documentation edits

- **Status:** DRAFT (no edit below has been applied to `.env.example`, `README.md` or `specs/001-*.md`)
- **Date:** 2026-11-03
- **Belongs to:** spec 011 Req 27 (`.env.example`, site README) and Req 30 (spec 001 amendment)
- **Source lines read from:** `main` at 98572b3 (`.env.example`, `README.md`, `specs/001-chat-widget-silent-fallback.md`)

## When these edits take effect

Not before the cutover. Req 27 makes them part of the same change as the
second rebuild, and Req 30 fires "WHEN the cutover deploy is live". Applying
them earlier would make the repo describe a gateway that is not serving the
site yet. Each application is a normal edit in its own commit, with
Davit's yes at that time (CLAUDE.md rules 5, 6, 13).

Conventions in this file: `-` lines are the current text, `+` lines the new
text, line numbers are the current ones. Wherever a current line contains an
em dash (U+2014) it is shown here as a hyphen (output rule), so apply those
edits by line range, never by matching the text.

Worker URL used everywhere below (spec 011 Req 24, wrangler.toml):
`https://cv-llm-gateway.davit-yedigaryan-1993.workers.dev`.

## Part A - `.env.example` (Req 27)

Build-time values for the real site come from `.env.local`, which is
gitignored and not part of this checklist (not opened here). The cutover
rebuild must also set the same two URLs there (Req 27); `.env.example` only
documents them.

### A1. Lines 10-13 (comment block)

```diff
-# LLM chat widget - point at the gateway service in this repo (or any
-# OpenAI-compatible backend you control). The default below assumes you've
-# deployed `gateway/` to Render via the bundled render.yaml; see
-# DEPLOY-RENDER-GATEWAY.md for the full setup.
+# LLM chat widget - point at the gateway Worker (the `cloudflare/` folder of
+# the gateway repo) or any OpenAI-compatible backend you control. The
+# default below is the Cloudflare Worker `cv-llm-gateway`; see
+# `cloudflare/README.md` in the gateway repo for the full setup.
```

Four lines replace four lines, so line numbers 16 and 40 do not move.
Open point: the old text points at files in "this repo" (`gateway/`,
`render.yaml`, `DEPLOY-RENDER-GATEWAY.md`) which are not in the site repo
at all (the gateway is a separate repo). The new text names the gateway
repo explicitly. If Davit wants the wording closer to the old, say so.

### A2. Line 16 (`NEXT_PUBLIC_CHAT_API_URL`)

```diff
-NEXT_PUBLIC_CHAT_API_URL="https://cv-llm-gateway.onrender.com/v1/chat/completions"
+NEXT_PUBLIC_CHAT_API_URL="https://cv-llm-gateway.davit-yedigaryan-1993.workers.dev/v1/chat/completions"
```

### A3. Line 40 (`NEXT_PUBLIC_CHAT_API_URL_FALLBACK`)

```diff
-NEXT_PUBLIC_CHAT_API_URL_FALLBACK="https://cv-llm-gateway.onrender.com/v1/claude/chat/completions"
+NEXT_PUBLIC_CHAT_API_URL_FALLBACK="https://cv-llm-gateway.davit-yedigaryan-1993.workers.dev/v1/claude/chat/completions"
```

Format gotchas (spec 011 V13): double quotes stay as they are, no trailing
slash, no `%22` after the build.

### A4. Left untouched on purpose

- Line 55 `NEXT_PUBLIC_TELEGRAM_FALLBACK_URL` (Req 27: untouched).
- Line 51, current text: `# group when the chat backend is offline (laptop sleeping, Tailscale`.
  The mention of Tailscale is now stale, but it sits in the Telegram
  comment, which Req 27 leaves untouched. Mentioned for Davit's decision,
  not part of the edit.
- Lines 34-39 (fallback comment): "the same gateway on the `/v1/claude/*`
  path" is still true.

## Part B - `README.md` gateway lines (Req 27)

### B1. Lines 14-18 (where the backend lives)

Current:

```
14  The chat widget's backend (Caddy + Tailscale gateway on Render → Ollama on
15  the M1 Pro) lives in a **separate repository**:
16  [`yedigaryan-cv-gateway`](https://github.com/Yedigaryan/yedigaryan-cv-gateway).
17  That repo carries its own `render.yaml`, Dockerfile, deploy guide, and the
18  Ollama launchd plist.
```

New:

```diff
-The chat widget's backend (Caddy + Tailscale gateway on Render → Ollama on
-the M1 Pro) lives in a **separate repository**:
+The chat widget's backend (a Cloudflare Worker, `cv-llm-gateway`, reaching
+Ollama on the M1 Pro through a Cloudflare Tunnel) lives in a **separate repository**:
 [`yedigaryan-cv-gateway`](https://github.com/Yedigaryan/yedigaryan-cv-gateway).
-That repo carries its own `render.yaml`, Dockerfile, deploy guide, and the
-Ollama launchd plist.
+That repo carries the Worker (`cloudflare/`), the tunnel config example and
+cloudflared launchd plist, the deploy guide, and the Ollama launchd plist.
```

Lines 16 unchanged. The phrase "Cloudflare Tunnel" is accurate for both the
hostname design (011 Req 16) and the approved Workers VPC amendment; the
VPC binding detail goes in the diagram (B2).

### B2. Lines 22-33 (architecture diagram)

Current lines 22-33 (box characters kept; the arrow on line 32 is not a
dash):

````
22  ```
23  chat widget on davit.yedigaryan.pro      (this repo, name.am Apache, static)
24          │  POST /v1/chat/completions
25          │  Authorization: Bearer $LLM_API_TOKEN
26          ▼
27  https://cv-llm-gateway.onrender.com      (yedigaryan-cv-gateway repo, Render Free)
28          │  Caddy + socat + Tailscale
29          ▼
30  <MacBook tailnet IP>:11434               (M1 Pro, Ollama bound on 0.0.0.0)
31          ▼
32  ollama serve  →  Metal GPU
33  ```
````

New (lines 27-30 change; 22-26 and 31-33 stay):

```diff
-https://cv-llm-gateway.onrender.com      (yedigaryan-cv-gateway repo, Render Free)
-        │  Caddy + socat + Tailscale
+https://cv-llm-gateway.davit-yedigaryan-1993.workers.dev
+                                         (yedigaryan-cv-gateway repo, Cloudflare Worker)
+        │  Workers VPC binding -> Cloudflare Tunnel (cloudflared on the M1 Pro)
         ▼
-<MacBook tailnet IP>:11434               (M1 Pro, Ollama bound on 0.0.0.0)
+localhost:11434                          (M1 Pro, Ollama; /v1/claude/* -> claude-wrapper :11435)
```

Assumption to confirm: this wording uses the approved Workers VPC
amendment (2026-11-03). If the cutover instead ships the public-hostname
design (Req 16), line 2 of the new text must say "Cloudflare Tunnel
(cloudflared on the M1 Pro)" with no "Workers VPC binding". Not
decided here.

### B3. Lines 74-76 (where the setup guide lives)

Current:

```
74  For the LLM gateway (Render service) and the Ollama-on-M1-Pro setup,
75  see the **gateway repo's `DEPLOY.md`** -
76  <https://github.com/Yedigaryan/yedigaryan-cv-gateway/blob/main/DEPLOY.md>.
```

New:

```diff
-For the LLM gateway (Render service) and the Ollama-on-M1-Pro setup,
-see the **gateway repo's `DEPLOY.md`** -
-<https://github.com/Yedigaryan/yedigaryan-cv-gateway/blob/main/DEPLOY.md>.
+For the LLM gateway (Cloudflare Worker and tunnel) and the Ollama-on-M1-Pro
+setup, see the **gateway repo's `cloudflare/README.md`** -
+<https://github.com/Yedigaryan/yedigaryan-cv-gateway/blob/main/cloudflare/README.md>.
```

Unverified: that `cloudflare/README.md` is the right guide at cutover (it is
a Req 23 file) and that the gateway repo's `DEPLOY.md` is still Render-only
until Req 29 updates it. Check the gateway repo on the cutover day before
applying B3; the Req 29 decommission step can switch the link back to
`DEPLOY.md` if that is where the guide ends up.

### B4. Check after Part A and B (spec 011 V20)

`grep -n onrender .env.example README.md` prints nothing. For a wider net:
`grep -n -i 'render\|tailscale' README.md .env.example` should list only
the Tailscale mention in `.env.example` line 51 (A4), until Davit decides.

### B5. Left untouched on purpose (noticed, not in Req 27)

- README lines 3-6 ("provider-agnostic ... whatever URL
  `NEXT_PUBLIC_CHAT_API_URL` points at"): still true.
- README line 12 says `rsync out/` and lines 51-53 say "no git
  involvement on the hosting side" / sync via `lftp`. The 2026-11-03
  cPanel Git route (spec 003 amendment draft) makes those stale; that is a
  separate edit tied to that amendment, not to this checklist.
- README lines 44-45 say "the four `NEXT_PUBLIC_CHAT_*` vars"; the example
  file has more. Unrelated to the gateway move.

## Part C - spec 001 amendment (Req 30)

Req 30: no behavior change; a dated amendment note rewords Req 18's
rationale, Verification 2 points at `$WORKER`, Verification 5 stops
cloudflared instead of killing Tailscale. Spec 011 V20 checks all three.
The MEMORY.md corrections that Req 30 also names are out of scope here
(MEMORY.md is not a repo file).

Fill in `<CUTOVER DATE>` (the day the cutover deploy goes live) at
application time. Original requirement lines stay as written; the rationale
lives in the amendment note (specs/README.md: "Don't silently edit an
implemented spec's requirements"). Verifications are steps, so V2 and V5
are edited in place.

### C1. Line 4 (header date)

Current:

```
4  - **Date:** 2026-07-07 (retroactive spec; fallback verified end-to-end with Ollama disabled)
```

New:

```diff
-- **Date:** 2026-07-07 (retroactive spec; fallback verified end-to-end with Ollama disabled)
+- **Date:** <CUTOVER DATE> (retroactive spec 2026-07-07; fallback verified end-to-end with Ollama disabled; amended <CUTOVER DATE>, see end of file)
```

### C2. Verification 2 (lines 122-123), in place

Current:

```
122  2. Streaming end-to-end: MEMORY.md §11 layer-4 curl against
123     `$RENDER/v1/chat/completions` → SSE frames + `[DONE]` (Req 2).
```

New:

```diff
-2. Streaming end-to-end: MEMORY.md §11 layer-4 curl against
-   `$RENDER/v1/chat/completions` → SSE frames + `[DONE]` (Req 2).
+2. Streaming end-to-end: the curl of spec 011 Verification 7 against
+   `$WORKER/v1/chat/completions` (`$WORKER` =
+   `https://cv-llm-gateway.davit-yedigaryan-1993.workers.dev`) → SSE frames
+   + `[DONE]` (Req 2). Amended <CUTOVER DATE>, spec 011 Req 30.
```

The `→` on that line is an existing non-dash symbol and stays.
Reason for citing spec 011 V7 instead of "MEMORY.md §11": Req 27 rewrites
the §11 cheatsheet at cutover, so the old pointer's content changes.

### C3. Verification 5 (lines 130-131), in place

Current:

```
130  5. Kill Tailscale on the laptop, wait ~60 s with panel open → offline
131     card appears after 2nd probe failure (Reqs 18-21). MANUAL.
```

New:

```diff
-5. Kill Tailscale on the laptop, wait ~60 s with panel open → offline
-   card appears after 2nd probe failure (Reqs 18-21). MANUAL.
+5. Stop cloudflared on the laptop (`launchctl bootout
+   gui/$(id -u)/dev.local.cloudflared`), open the panel and send a message
+   → both backends fail with 5xx and the offline card appears on that send
+   (Reqs 16, 21; spec 011 Req 13); within 30 s the next probe succeeds and
+   the card clears (spec 011 Req 14). Bootstrap the agent again. MANUAL.
+   Amended <CUTOVER DATE>, spec 011 Req 30.
```

This is NOT the literal "replace Tailscale with cloudflared" of Req 30, and
that needs Davit's decision: with the Worker answering OPTIONS at the edge,
waiting with the panel open can no longer trigger the card (the probe keeps
succeeding), so the old step would fail. The new step matches spec 011 V10
("send a message -> offline card on that send; within 30 s it clears").
If Davit prefers the literal swap, the step as written would fail verification.

### C4. Amendment note appended after line 135 (end of file)

```
## Amendment (gateway moved to a Cloudflare Worker, <CUTOVER DATE>)

Spec 011 Req 30. Wording only; no behavior changes and no code changes.

- **Req 18 (rationale):** the OPTIONS probe is answered by the gateway edge
  (the Cloudflare Worker, spec 011 Req 3) and does not exercise the laptop,
  so a passing probe only shows that the Worker is up. The probe still
  targets the chat URL, as before; the sentence "`/health` only proves
  Render is up, not the tunnel chain" no longer applies (there is no
  Render, and `/health` is also answered at the edge). Offline is
  detected by failed sends (Req 16), and the offline card may clear on
  the next probe while the laptop is still down (spec 011 Req 14).
- **Verification 2 and 5:** reworded in place, see above.
- **Not changed:** Req 20's "Render cold start must not flash the card" and
  the Intent's "Render cold starts, laptop sleep, Tailscale drops" are
  historical wording; left as written (see Open points).
```

(The note body above is the exact text to append; it is not inside the
amendment itself.)

### C5. Open points for Davit (Part C)

- Req 20's rationale ("first failure is silent - Render cold start must
  not flash the card") and spec 001 Intent line 12 still say Render and
  Tailscale. Req 30 does not list them, so this draft leaves them. Say if
  they should be reworded in the same amendment.
- Req 20 and 21 as written say the card appears after two failed probes.
  With the edge-answered probe that cannot happen while the Worker is up;
  the card appears on a failed send. The amendment note covers Req 18 only,
  per Req 30; a fuller correction of Reqs 20-21 is a separate decision.
- Spec 001 `Status: verified` is kept. A re-verification of V2 and V5 on
  the Worker is spec 011 V20/V10, not repeated here.

## Apply order at cutover (for later, each with Davit's yes)

1. Req 27 rebuild commit: `.env.example` (A1-A3), `README.md` (B1-B3);
   `.env.local` values are set for the build only (not committed).
2. Run B4's grep.
3. After the cutover deploy is live (Req 30): spec 001 edits C1-C4 as a
   separate commit citing spec 011.
4. Spec 011 V20: confirm `grep -n onrender .env.example README.md` prints
   nothing, `specs/001-*.md` has the dated note, V2 names `$WORKER`, V5
   stops cloudflared.
