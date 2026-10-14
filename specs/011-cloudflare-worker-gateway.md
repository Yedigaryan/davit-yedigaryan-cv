# 011 - Cloudflare Worker gateway over a Cloudflare Tunnel

- **Status:** approved (2026-10-14)
- **Date:** 2026-10-14 (revised after spec review and Davit's answers)
- **Spec:** 011
- **Supersedes / superseded-by:** - (replaces the Render gateway, which has no spec; changes the env values spec 001 reads, and amends spec 001's docs at cutover, Req 30)

> **Source decisions.** MEMORY.md "2026-10-14, Gateway moves from Render
> to a Cloudflare Worker" and "2026-10-14, Gateway Worker lives in
> ../gateway; yedigaryan.pro DNS moves to Cloudflare". Spec 003 (FTP
> deploy) is unchanged; the static site stays on name.am.
>
> **Decisions (Davit, 2026-10-14).** Tunnel protection: Cloudflare
> Access service token, checked at the edge (Req 17). Worker URL:
> workers.dev, `cv-llm-gateway.<subdomain>.workers.dev` (Req 24).
> Cutover: the rebrand on current `main` is deployed first as its own
> deploy (outside this spec); the gateway cutover is a second rebuild
> that changes only the two chat URLs (Req 27). Spec 001 Req 18 and
> Verifications 2/5 and the MEMORY.md probe note are amended inside this
> spec at cutover, behavior unchanged (Req 30).
>
> **Flags.**
> - CORS stays `*` (Caddyfile line 33); no origin is "disallowed" today
>   (Open question 6).
> - The offline probe is answered at the edge and never reaches the
>   laptop; spec 001 and MEMORY.md say otherwise. Behavior kept,
>   docs corrected at cutover (Reqs 14, 30).
> - Both `NEXT_PUBLIC_CHAT_API_URL` and `NEXT_PUBLIC_CHAT_API_URL_FALLBACK`
>   point at Render today (`.env.example:16,40`, `LlmChat.tsx:41,61`).

## Intent

The chat widget reaches the laptop's Ollama and claude-wrapper through a
Cloudflare Worker and a named Cloudflare Tunnel instead of Render Free,
with the same auth, routing and CORS behavior. This removes the ~50 s
Render cold start and the Tailscale/socat chain.

## Behavioral Requirements

Names: `$WORKER` = `https://cv-llm-gateway.<subdomain>.workers.dev`.
`$OLLAMA_TUNNEL_HOST`, `$CLAUDE_TUNNEL_HOST` = tunnel **hostnames**, no
scheme (Open question 3). `$GW` =
`/Users/davidyedigaryan/WebstormProjects/davit-yedigaryan-cv/gateway`.
Caddyfile = `$GW/gateway/Caddyfile`. Package manager for the Worker:
pnpm, always with `--ignore-workspace` (ERRORS.md entry 1). Unverified:
ERRORS.md only shows the flag with `install` and `run`; if
`pnpm --ignore-workspace exec wrangler ...` fails, call
`./node_modules/.bin/wrangler ...` from `$GW/cloudflare` instead.

**Order of work** (no window where a tunnel hostname is reachable
unprotected): add zone -> copy records -> DNSSEC off -> nameserver switch
-> V1 -> `cloudflared tunnel login` -> `tunnel create` -> Access
application, service token and Service Auth policy for both hostnames ->
`tunnel route dns` -> launchd bootstrap -> **V8 immediately** -> Worker
secrets + deploy -> V2-V7, V15 (204/401/200 pairs), V16-V18 -> scheduled
V9 with V15's 5xx pair, V10, V19 -> V11, V12 -> rebrand deploy (outside
this spec) -> cutover + V13 -> Req 30 docs + V20 -> soak -> decommission
+ V14.

### Worker: parity with the Caddyfile
1. WHEN any response leaves the Worker (200, 204, 401, 5xx, proxied)
   THEN it carries `X-Content-Type-Options: nosniff`, `X-Frame-Options:
   DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
   `Strict-Transport-Security: max-age=31536000; includeSubDomains;
   preload`, `Access-Control-Allow-Origin: *`,
   `Access-Control-Allow-Methods: POST, GET, OPTIONS`,
   `Access-Control-Allow-Headers: Authorization, Content-Type`,
   `Access-Control-Max-Age: 86400`, and no
   `Access-Control-Allow-Credentials` (lines 26-37).
2. WHEN the path is exactly `/health` (any method) THEN 200, body `OK`,
   no auth, no tunnel call (lines 40-42).
3. WHEN the method is OPTIONS on any other path (including
   `/v1/claude/*`) THEN 204, empty body, no auth check, no tunnel call
   (lines 46-49).
4. WHEN a request on any other route lacks `Authorization` exactly equal
   to `Bearer <LLM_API_TOKEN>` THEN 401, body `Unauthorized` (lines
   64/92-96, 101/158-162).
5. WHEN an authorized path starts with `/v1/claude/` THEN the Worker
   strips `/v1/claude`, keeps the query string, and forwards to
   `CLAUDE_UPSTREAM`, e.g. `/v1/claude/chat/completions` ->
   `/chat/completions` (lines 63-91, `handle_path`).
6. WHEN any other authorized request arrives (including `/v1/claude`
   without a trailing slash) THEN it is forwarded path- and
   query-unchanged to `OLLAMA_UPSTREAM` (lines 101-156).
7. WHEN forwarding THEN the upstream receives the original method, body
   and `Authorization` header (observable: claude-wrapper, which checks
   the bearer itself at `server.mjs:352-357`, answers 200 in V6a instead
   of 401). The Worker adds only `CF-Access-Client-Id` and
   `CF-Access-Client-Secret` and sends the subrequest with
   `redirect: 'manual'` (checked by code inspection, V18).
8. WHEN an upstream response comes back THEN every upstream
   `Access-Control-Allow-Origin/-Methods/-Headers/-Credentials/-Max-Age/
   -Expose-Headers` header is removed before Req 1's set is applied, so
   each appears once (lines 75-80, 134-139; gateway commit 96334ee).
   Status and other headers pass through, except Req 9.
9. WHEN the upstream fetch throws THEN 502. WHEN upstream answers 3xx,
   401 or 403 (an Access rejection or login redirect; which one Access
   returns is unverified) THEN 502, so the widget treats it as offline
   instead of showing a raw 4xx banner (`LlmChat.tsx:335-342`). WHEN
   upstream returns a 5xx (e.g. the tunnel-down error, believed 530,
   unverified) THEN that status passes through. All carry Req 1's
   headers. (Deviation from pure pass-through: Open question 10.)

Caddy behavior replaced or dropped:
- `read_timeout 300s` (lines 85, 144): replaced by Cloudflare's own
  limits, see Req 10.
- `write_timeout 300s` (lines 86, 145): dropped; a Worker has no write
  timeout setting, the client stream ends when upstream ends.
- `dial_timeout 10s` (lines 87, 146): no Worker equivalent; the
  resulting bound is Req 11.
- `keepalive off` (lines 88, 153): dropped; it existed because each socat
  connection was one SOCKS/CONNECT stream. The tunnel multiplexes
  requests, so nothing replaces it.
- JSON access log to stdout (lines 164-167): replaced by on-demand
  `wrangler tail`; no persistent log (Non-goal).
- `close` on the 401 (lines 94, 160): cannot be set from a Worker.
- `X-Forwarded-For` (lines 68, 113): dropped; nothing reads it.

### Streaming and latency
10. WHEN upstream responds with `text/event-stream` (or any chunked body)
    THEN the Worker returns `upstream.body` as a stream without reading
    or transforming it, and adds `X-Accel-Buffering: no` (lines 70-71,
    122-126). Pass condition is V7. Unverified: whether the Cloudflare
    edge or cloudflared buffers `text/event-stream`; whether a long
    stream stays inside the Free-plan CPU limit when the body is passed
    through untouched; Cloudflare's ~100 s limit for the origin to send
    headers (524), against Caddy's 300 s, which may also apply to idle
    gaps between chunks. A cold model load over ~100 s would fail; the
    widget's 12 s first-byte fallback (spec 001 Req 7) covers that.
11. WHEN cloudflared is stopped THEN authorized POSTs to either chat
    route return a 5xx with Req 1's headers within 5 s (the tunnel has no
    connector). WHEN the laptop is asleep THEN the same 5xx is expected,
    but the time to it is unverified: the edge may keep using stale
    tunnel connections until they time out, and the fallback request
    has no client timeout (`llm-chat-fallback.ts:77-80`), so a visitor
    could wait. V19 measures it; if over 12 s, the Req 27 cutover is
    blocked until Open question 11 is decided.
12. WHEN `$WORKER/health` is requested after 20 minutes without traffic
    THEN the first byte arrives in under 1 s (the Render cold start is
    gone; the laptop's own model load, `OLLAMA_KEEP_ALIVE=30m`, is
    unchanged).

### Laptop down (widget)
13. WHEN only Ollama is down THEN a widget send is answered silently by
    the Claude fallback (spec 001 Reqs 9, 12). WHEN both backends are
    unreachable during a send THEN primary and fallback fail with
    `Chat API error 5xx` and the offline card appears on that send
    (`LlmChat.tsx:335-340`, spec 001 Req 21).
14. WHEN the panel stays open after Req 13 THEN the next probe succeeds
    (the Worker answers OPTIONS) and clears the card within 30 s
    (`LlmChat.tsx:244-247`, interval at `:255`). Existing behavior, kept.

### Tunnel (laptop)
15. WHEN the launchd agent `dev.local.cloudflared` is bootstrapped and
    kickstarted THEN `cloudflared tunnel info <name>` shows active
    connections for the one named, locally managed tunnel. Agent shape
    as `ollama/dev.local.ollama.plist` (RunAtLoad, KeepAlive, logs in
    `/tmp`).
16. WHEN a request arrives for `$OLLAMA_TUNNEL_HOST` THEN cloudflared
    sends it to `http://127.0.0.1:11434` with
    `originRequest.httpHostHeader: localhost:11434`; for
    `$CLAUDE_TUNNEL_HOST` to `http://127.0.0.1:11435` with
    `localhost:11435`; any other hostname gets `http_status:404`. The
    Host rewrite replaces Caddyfile lines 67/112 (a Worker cannot set
    `Host`). `127.0.0.1`, not `localhost`: the IPv6-first gotcha from
    MEMORY.md section 5.
17. WHEN a request reaches `$OLLAMA_TUNNEL_HOST` or `$CLAUDE_TUNNEL_HOST`
    without a valid service token THEN Cloudflare Access rejects it at
    the edge before it enters the tunnel; no Ollama or wrapper output is
    returned. Ollama cannot check headers, so the check cannot live on
    the laptop. One Access self-hosted application covers both
    hostnames with a Service Auth policy for one service token. The
    Access setup exists before `tunnel route dns` runs (order of work).
    Unverified: whether Zero Trust Free asks for a payment method.
18. WHEN the gateway repo is inspected THEN no tunnel credential is
    tracked: `~/.cloudflared/cert.pem` (account-level, created by
    `tunnel login`, more powerful than the tunnel file),
    `<TUNNEL_UUID>.json` and `config.yml` live only on the laptop; the
    repo holds `cloudflare/tunnel/config.example.yml` with placeholders.

### DNS move (manual runbook, Davit performs)
19. WHEN preparing the switch THEN the full record list from the name.am
    DNS panel is saved as the "before" source of truth (including DKIM,
    `_dmarc`, `mail.`/`webmail.`/`cpanel.` if present), plus `dig`
    answers and the current certificate issuer and expiry for
    `davit.yedigaryan.pro` (V1 commands).
20. WHEN `yedigaryan.pro` is added to Cloudflare Free THEN every "before"
    record exists there **DNS-only (grey cloud)**; proxying `davit.`
    would move the site behind Cloudflare (rejected). The two tunnel
    CNAMEs created later by `tunnel route dns` are the only proxied
    records (tunnels require it).
21. WHEN DNSSEC is on at the registrar THEN it is turned off before the
    nameserver switch (registrar identity and DNSSEC state unverified;
    presumably name.am).
22. WHEN the zone shows Active THEN V1 runs at once: `dig` answers match
    "before" (NS and SOA excluded), the site serves name.am's
    certificate, and mail to `davit@yedigaryan.pro` arrives.

### Worker repo and config
23. WHEN the Worker is built THEN its files are in `$GW/cloudflare/`
    (`wrangler.toml`, `src/index.ts`, `package.json`, `pnpm-lock.yaml`,
    `tsconfig.json`, `README.md`, `.gitignore` covering `node_modules/`,
    `.wrangler/`, `.dev.vars`, and
    `tunnel/{config.example.yml,dev.local.cloudflared.plist}`), and
    `render.yaml` and `gateway/` are unchanged until Req 29.
24. WHEN `wrangler.toml` is read THEN it has `name = "cv-llm-gateway"`,
    `main = "src/index.ts"`, `compatibility_date` (implementation day),
    `workers_dev = true`, no `routes`, and `[vars]` `OLLAMA_UPSTREAM`,
    `CLAUDE_UPSTREAM` (full `https://` URL of the tunnel hostname, no
    trailing slash, no quotes inside the value).
25. WHEN `pnpm --ignore-workspace exec wrangler secret list` runs THEN it
    shows exactly `LLM_API_TOKEN`, `CF_ACCESS_CLIENT_ID`,
    `CF_ACCESS_CLIENT_SECRET`, each set without a trailing newline
    (MEMORY.md 2026-05-31 gotcha 2), e.g.
    `printf %s "$LLM_API_TOKEN" | pnpm --ignore-workspace exec wrangler secret put LLM_API_TOKEN`.
    `LLM_API_TOKEN` keeps its current value, so the wrapper plist and
    `NEXT_PUBLIC_CHAT_API_KEY` do not change.
26. WHEN deploying THEN `pnpm --ignore-workspace exec wrangler deploy`
    runs from `$GW/cloudflare/`, and the repo root has no
    `wrangler.toml` or `package.json`. The gateway repo has no Next.js
    root, so the OpenNext auto-detect (gotcha 1) does not apply.

### Site cutover, docs, rollback, decommission
27. Precondition: the rebrand on current `main` (specs 004, 005, 010) is
    already live from its own deploy (outside this spec, spec 003 path,
    including the open FTP 530 issue, Davit's yes at that time). WHEN
    that holds and V1-V12, V15-V19 pass THEN a second rebuild from the
    same commit the rebrand deploy was built from (recorded at that
    deploy) changes only `NEXT_PUBLIC_CHAT_API_URL` ->
    `$WORKER/v1/chat/completions` and `NEXT_PUBLIC_CHAT_API_URL_FALLBACK`
    -> `$WORKER/v1/claude/chat/completions`, and is FTP-deployed (spec
    003). Same change: `.env.example` lines 10-13 (comment), 16 and 40;
    the site README gateway lines; MEMORY.md section 1 table/diagram,
    section 4 (line ~121, and the Render configuration tier at ~132-139
    replaced by Worker vars/secrets and laptop cloudflared tiers) and the
    section 11 cheatsheet (~439-484); a new MEMORY.md decision entry. Render and the laptop's Tailscale keep
    running unchanged until Req 29. `NEXT_PUBLIC_TELEGRAM_FALLBACK_URL`
    is untouched.
28. WHEN a rollback is needed before Req 29 THEN both env vars go back to
    the Render URLs, the site is rebuilt and redeployed.
29. WHEN the live site has run on the Worker for the soak period (Open
    question 8) THEN the Render service `cv-llm-gateway` is suspended
    then deleted, `render.yaml` and `gateway/` are removed from the
    gateway repo, its README/DEPLOY are updated, and the
    `cv-llm-gateway` tailnet node and its auth key are removed. Laptop
    Tailscale per Open question 5.
30. WHEN the cutover deploy is live THEN, with no behavior change:
    spec 001 gets a dated amendment note rewording Req 18's rationale
    (the OPTIONS probe is answered by the gateway edge and does not
    exercise the laptop; offline is detected by failed sends, and the
    card may clear on the next probe, Req 14), pointing Verification 2
    at `$WORKER`, and replacing "kill Tailscale" in Verification 5 with
    stopping cloudflared; and MEMORY.md gets a correction entry for the
    "probe the chat URL, not /health" note (2026-05-27 entry and the
    2026-05-31 session summary).

**Needs Davit's explicit yes at the moment it runs** (CLAUDE.md rules
14-15; approving this spec is not that yes):
- Adding the zone to Cloudflare; DNS record changes; the DNSSEC change
  at the registrar; the nameserver change.
- `cloudflared tunnel login` (creates `cert.pem`, grants account
  access); `tunnel create`; `tunnel route dns`; the Zero Trust/Access
  setup; `launchctl bootstrap` of the cloudflared agent (makes the
  laptop reachable from the internet).
- `wrangler secret put`; `wrangler deploy`; any push to the gateway repo
  (README line 111 says every push to `main` redeploys Render;
  unverified whether `rootDir: gateway` limits that, gated anyway); any
  push of the site repo.
- V1's test email; V13's Telegram relay post.
- V9's `launchctl bootout` of Ollama: it takes the live primary down
  while Render still serves the site (the Claude fallback should cover
  it silently); schedule it. Same for V19's real sleep, which takes the
  whole live chat down.
- The site FTP deploy; every Render change; removing the Render files;
  deleting the Tailscale node and auth key.

## Non-goals

- Workers AI, a paid hosted LLM API, moving the static site to
  Cloudflare, Workers VPC private binding, a separate domain, quick
  tunnels (trycloudflare): all rejected (MEMORY.md 2026-10-14).
- Workers Builds git integration (if enabled later: Root directory
  `cloudflare`, Framework preset None).
- A custom domain or route for the Worker.
- An origin allowlist for CORS (Open question 6).
- A path allowlist: as today, any authorized path reaches Ollama
  (including `/api/pull`, `/api/delete`) with the public bearer.
- Making the OPTIONS probe or `/health` reach the laptop.
- Persistent request logging (Workers Logs); token rotation; rate
  limiting; Turnstile.
- Rebinding Ollama/claude-wrapper from `0.0.0.0` to `127.0.0.1`
  (possible once Tailscale is gone; follow-up).
- cloudflared's own Access JWT check (`originRequest.access`).
- Any change to `src/` code, spec 001 behavior, or the Telegram Worker.
- The rebrand deploy itself (precondition of Req 27, not part of it).

## Interface contract

- **Static site env (`.env.local`, build time):**
  `NEXT_PUBLIC_CHAT_API_URL` = `$WORKER/v1/chat/completions`;
  `NEXT_PUBLIC_CHAT_API_URL_FALLBACK` =
  `$WORKER/v1/claude/chat/completions`. No surrounding quotes in hosting
  UIs, no trailing slash (MEMORY.md gotcha 3). Key, model, streaming,
  timeout and Telegram vars unchanged.
- **Worker vars:** `OLLAMA_UPSTREAM`, `CLAUDE_UPSTREAM` (e.g.
  `https://<ollama-tunnel-host>.yedigaryan.pro`). **Worker secrets:**
  `LLM_API_TOKEN`, `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET`.
- **Laptop:** `~/.cloudflared/{cert.pem,config.yml,<TUNNEL_UUID>.json}`,
  `~/Library/LaunchAgents/dev.local.cloudflared.plist`. Ollama and
  wrapper plists unchanged.
- **Endpoints:** `GET $WORKER/health` 200; `OPTIONS $WORKER/*` 204;
  `POST $WORKER/v1/chat/completions` and
  `POST $WORKER/v1/claude/chat/completions` with `Authorization: Bearer
  $LLM_API_TOKEN`: 200 (SSE when `stream: true`), 401 without, 5xx when
  the laptop is unreachable.

## Verification

`$LLM_API_TOKEN` comes from the shell environment; never paste it.
`$WORKER`, `$RENDER` are base URLs; `$WORKER_HOST` is `$WORKER` without
`https://`; `$OLLAMA_TUNNEL_HOST`, `$CLAUDE_TUNNEL_HOST` are hostnames;
`$GW` as above. `AUTH=(-H "Authorization: Bearer $LLM_API_TOKEN")`.
Run order: see Order of work.

1. DNS, right after the nameserver switch (Reqs 19-22). Before and after:
   `for n in yedigaryan.pro davit.yedigaryan.pro www.yedigaryan.pro ftp.yedigaryan.pro; do for t in A AAAA CNAME MX TXT; do echo "$n $t $(dig +short $n $t | sort | tr '\n' ' ')"; done; done`
   plus the same for every other name in the panel list -> identical
   (NS and SOA excluded). The "after" capture queries Cloudflare's
   assigned nameserver directly (`dig @<assigned-cf-ns> +short $n $t`),
   so cached name.am answers cannot hide a record that was not copied. `openssl s_client -connect
   davit.yedigaryan.pro:443 -servername davit.yedigaryan.pro </dev/null
   2>/dev/null | openssl x509 -noout -issuer -enddate` -> same issuer;
   `curl -sS -o /dev/null -w '%{http_code}\n' https://davit.yedigaryan.pro`
   -> 200. A test mail to `davit@yedigaryan.pro` arrives (needs yes).
2. Repo hygiene (Reqs 15, 18, 23, 25): `cloudflared tunnel info <name>`
   shows connections. `git -C "$GW" ls-files cloudflare` lists only the
   Req 23 files (JSON only `package.json`, `tsconfig.json`; lockfile
   `pnpm-lock.yaml`). `git -C "$GW" ls-files | grep -E
   'cert\.pem|\.dev\.vars|\.cloudflared'` and `git -C "$GW" grep -lE
   'TunnelSecret|ARGO TUNNEL TOKEN'` print nothing. `cd "$GW/cloudflare"
   && pnpm --ignore-workspace exec wrangler secret list` shows the three
   names.
3. `curl -i $WORKER/health` -> 200 `OK` with all Req 1 headers (Reqs
   1-2).
4. `curl -i $WORKER/api/tags`, the same with `-H "Authorization: Bearer
   wrong"`, and `curl -i -X POST $WORKER/v1/claude/chat/completions` ->
   401 `Unauthorized` with CORS headers. `curl -sS $WORKER/api/tags
   "${AUTH[@]}" | jq '.models[].name'` lists models (Reqs 4, 6).
5. For each of `$WORKER/v1/chat/completions` and
   `$WORKER/v1/claude/chat/completions`: `curl -i -X OPTIONS <url> -H
   "Origin: https://davit.yedigaryan.pro" -H
   "Access-Control-Request-Method: POST" -H
   "Access-Control-Request-Headers: authorization,content-type"` -> 204,
   ACAO `*`; repeat with `-H "Origin: https://example.com"` -> also 204,
   ACAO `*` (parity, Req 3; not a rejection).
6. Req 5, 7, 8:
   - 6a. `curl -sS -D - -X POST $WORKER/v1/claude/chat/completions
     "${AUTH[@]}" -H "Content-Type: application/json" -d
     '{"messages":[{"role":"user","content":"ping"}]}'` -> 200, JSON with
     `choices[0].message.content`, `access-control-allow-origin`
     exactly once in the headers.
   - 6b. `curl -sS -D - -o /dev/null -X POST $WORKER/v1/chat/completions
     "${AUTH[@]}" -H "Content-Type: application/json" -d
     '{"model":"gemma4:e4b","messages":[{"role":"user","content":"ping"}]}'
     | grep -ci access-control-allow-origin` -> `1`.
7. Streaming (Req 10): `curl -sS -N --trace-time --trace-ascii - -o
   /dev/null -X POST $WORKER/v1/chat/completions "${AUTH[@]}" -H
   "Content-Type: application/json" -H "Accept: text/event-stream" -d
   '{"model":"gemma4:e4b","stream":true,"messages":[{"role":"user","content":"Count from 1 to 40, one per line."}]}'
   | grep 'Recv data'` -> many receive events spanning more than 1 s,
   not one burst. Headers in a separate call: the same request with
   `curl -sS -D - -o /dev/null` -> `x-accel-buffering: no`. Repeat both
   on `/v1/claude/chat/completions`.
8. Origin protection, immediately after the launchd bootstrap (Req 17):
   `curl -sS -i https://$OLLAMA_TUNNEL_HOST/api/tags` and `curl -sS -i
   https://$CLAUDE_TUNNEL_HOST/health` (no Access headers) -> not 200,
   no model list or `OK` body. If either returns upstream output,
   `launchctl bootout` the agent at once.
9. Only Ollama down (scheduled, needs yes; Req 13):
   `launchctl bootout gui/$(id -u)/dev.local.ollama`; a local dev build
   pointed at `$WORKER` (both URLs as env vars on the command line,
   `pnpm --ignore-workspace run dev`) answers through the Claude
   fallback with no visible difference. Run V15's 5xx diff in this
   window. Bootstrap Ollama again.
10. cloudflared stopped (Reqs 11, 13, 14):
    `launchctl bootout gui/$(id -u)/dev.local.cloudflared`; V3 and V5
    still pass; `curl -sS -o /dev/null -w '%{http_code} %{time_total}\n'
    -X POST $WORKER/v1/chat/completions "${AUTH[@]}"` and the claude
    route -> 5xx in under 5 s, with ACAO `*`. In the local dev build,
    send a message -> offline card on that send; within 30 s it clears.
    Bootstrap the agent again.
11. Cold start (Req 12): after 20 min with no traffic, `curl -o /dev/null
    -sS -w '%{time_starttransfer}\n' $WORKER/health` -> under 1 s. Same
    against `$RENDER/health` for the record (informational).
12. Rollback check (Req 28): the local dev build with the Render URLs
    still chats.
13. After the cutover build (Req 27): `grep -rl onrender
    out/_next/static/` finds nothing; `grep -r "$WORKER_HOST"
    out/_next/static/ | head -3` shows both URLs with no `%22` and no
    trailing slash; the live widget streams an answer; the Telegram
    relay still posts (MEMORY.md 2026-05-31 check 2; needs yes).
14. After decommission (Req 29): `curl -sS -f -m 90 $RENDER/health`
    exits non-zero; `tailscale status | grep cv-llm-gateway` prints
    nothing.
15. Parity diff (Reqs 1-4, 8), header names only, edge noise filtered:
    `hdrs() { curl -sS -m 90 -o /dev/null -D - "$@" | tr -d '\r' | cut -d: -f1 | tr 'A-Z' 'a-z' | grep -vE '^(http/.*|date|server|cf-ray|cf-cache-status|nel|report-to|alt-svc|via|rndr-id|x-render-origin-server|content-length|connection|vary|)$' | sort -u; }`
    then `diff <(hdrs -X OPTIONS $RENDER/v1/chat/completions) <(hdrs -X
    OPTIONS $WORKER/v1/chat/completions)`, and the same pair for 401
    (`/api/tags`, no auth), proxied 200 (`/api/tags` with
    `"${AUTH[@]}"`) and 5xx (`/api/tags` with auth during V9). Status
    codes must match, checked separately for each pair with
    `curl -sS -m 90 -o /dev/null -w '%{http_code}\n'` against `$RENDER`
    and `$WORKER` (`hdrs()` filters status lines out); any remaining
    header-name difference is listed and explained in the verification
    record.
16. Req 9 mapping, locally: in `$GW/cloudflare`, with
    `$CF_ACCESS_CLIENT_ID` in the shell environment (never pasted),
    `printf 'LLM_API_TOKEN=%s\nCF_ACCESS_CLIENT_ID=%s\nCF_ACCESS_CLIENT_SECRET=wrong\n' "$LLM_API_TOKEN" "$CF_ACCESS_CLIENT_ID" > .dev.vars`
    (real token and client ID, wrong secret),
    `pnpm --ignore-workspace exec wrangler dev`, then `curl -sS -o
    /dev/null -w '%{http_code}\n' -X POST
    http://localhost:8787/v1/chat/completions "${AUTH[@]}"` -> `502`.
    Delete `.dev.vars` afterwards.
17. Routing edges: `curl -sS -i -X POST $WORKER/v1/claude "${AUTH[@]}"`
    -> Ollama's 404 body, not the wrapper's `not found` (Req 6).
    `cloudflared tunnel ingress rule https://other.yedigaryan.pro` ->
    matches the `http_status:404` catch-all; `cloudflared tunnel ingress
    validate` passes (Req 16).
18. Inspection (Reqs 5, 7, 24, 26): `cat "$GW/cloudflare/wrangler.toml"`
    matches Req 24; `ls "$GW"` shows no `wrangler.toml` or
    `package.json`; `pnpm --ignore-workspace exec wrangler deployments
    list` (from `$GW/cloudflare`) shows the deploy. Code review of
    `src/index.ts` confirms: query string kept on both routes, only the
    two `CF-Access-*` headers added, `redirect: 'manual'`.
19. Real sleep (scheduled, needs yes; Req 11): put the laptop to sleep
    (`pmset sleepnow` or lid closed); from another device, `curl -sS -o
    /dev/null -w '%{http_code} %{time_total}\n' -X POST
    $WORKER/v1/chat/completions` with the bearer header -> record status
    and time. Pass: a 5xx in 12 s or less. Over 12 s blocks the Req 27
    cutover until Open question 11 is decided.
20. Docs (Reqs 27, 30), after the cutover commit: `grep -n onrender
    .env.example README.md` prints nothing; `grep -n
    'cv-llm-gateway.onrender' MEMORY.md` matches only dated history
    entries, not sections 1, 4 or 11; `specs/001-*.md` has a dated
    amendment note citing 011, Verification 2 names `$WORKER`, and
    Verification 5 says to stop cloudflared, not Tailscale; MEMORY.md has
    the probe correction entry and the cutover decision entry.

## Open questions

Resolved 2026-10-14 (see Decisions): 2 tunnel protection, 4 Worker URL,
7 cutover commit.

All questions below are non-blocking for approval: approving this spec
accepts each stated default, and the requirements are already written to
it. Question 9 must be answered before the DNS step; question 11 can
block the cutover (Req 11, V19), not the approval.

- [ ] 1. Cloudflare account. Default: the account that runs
      `cv-telegram-fallback`. Note: Workers Free's ~100k requests/day is
      account-wide, shared with the Telegram relay, and the bearer is
      public in the site bundle, so anyone could spend that quota.
- [ ] 3. Hostname layout. Default: two hostnames (Req 16): each backend
      routed, protected and tested on its own, no path regex. One
      hostname with path ingress could also work (after the Worker's
      strip, the wrapper path is `/chat/completions`, which Ollama does
      not serve; Ollama's is `/v1/chat/completions`), but it ties tunnel
      config to both path sets. Names e.g. `cv-ollama.yedigaryan.pro`,
      `cv-claude.yedigaryan.pro`.
- [ ] 5. Tailscale on the laptop after decommission. Default: keep it
      installed (MEMORY.md section 13: exit node for other tailnet
      members); remove only the `cv-llm-gateway` node and its key.
- [ ] 6. CORS: keep `*` (default, parity) or an allowlist like the
      Telegram Worker's `ALLOWED_ORIGINS`.
- [ ] 8. Soak period before decommission. Default: 7 days.
- [ ] 9. Is name.am also the registrar, and is DNSSEC on (Req 21)?
      Non-blocking until the DNS step.
- [ ] 10. Req 9 maps upstream 3xx/401/403 to 502. Default: yes.
      Alternative: pure pass-through (visitor sees a raw error banner).
- [ ] 11. A Worker-side timeout until upstream headers (Caddy had
      `dial_timeout 10s`). Default: none, unless V19 shows a hang over
      12 s; it would have to exceed cold model loads on the Ollama route.
- [ ] 12. Does name.am's certificate for `davit.yedigaryan.pro` still
      renew after the nameserver move (unverified whether it uses DNS
      validation)? Default: re-run V1's `openssl` check after the
      current `enddate`.

## Amendments (implementation, 2026-10-14)

Approved by Davit after the Part A final review (gateway branch
`011-cloudflare-worker`, commits 67a2c09..f6adb76).

- **Req 8:** upstream `Set-Cookie` is removed as well, so an Access
  `CF_Authorization` cookie can never reach the browser as a credential
  for the tunnel hostnames. Neither Ollama nor claude-wrapper sets
  cookies, so nothing legitimate is lost.
- **Req 4:** WHEN `LLM_API_TOKEN` is unset or empty THEN every request on
  a proxied route gets 401 (without this, `Bearer undefined` matched).
- **Req 23:** the file list also includes `src/handler.ts` (the pure
  handler; `src/index.ts` only binds it to `fetch`) and
  `test/handler.test.ts` (node:test). V2's "only the Req 23 files"
  includes both.
- **Req 24:** `wrangler.toml` also has `send_metrics = false` (no wrangler
  usage telemetry).
- **V18:** the code review of the query string, the two `CF-Access-*`
  headers and `redirect: 'manual'` is done on `src/handler.ts`.
