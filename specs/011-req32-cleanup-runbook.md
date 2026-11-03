> This runbook belongs to spec 011, amendment "Workers VPC, 2026-11-03", Req 32 (cleanup after the soak). It is not a numbered spec: it adds no requirement, it only orders the commands Req 32 already names. The amendment itself lives on branch `docs/011-req17-waf`, not on `main`.

# 011 Req 32 - Cleanup runbook

- **Status:** DRAFT (nothing in this file has been run)
- **Date:** 2026-11-03
- **Belongs to:** spec 011, Amendment (Workers VPC, 2026-11-03), Req 32

## Rules for using this file

- **Every step below needs Davit's explicit yes at the moment it runs**
  (CLAUDE.md rules 14-15; approving this runbook, or the soak passing,
  is not that yes). One yes covers one step, not the next one.
- Mutating commands are marked **[NEEDS YES]**. Commands marked
  **[read-only]** change nothing.
- No secret value appears here and none must be pasted into chat, a
  file in the repo, or a commit. The origin secret is only ever read
  inside a shell pipe (rollbacks) and never echoed.
- `$GW` = `/Users/davidyedigaryan/WebstormProjects/davit-yedigaryan-cv/gateway`.
  Worker commands run from `$GW/cloudflare` with `pnpm --ignore-workspace`
  (ERRORS.md entry 1; if `pnpm --ignore-workspace exec wrangler ...`
  fails, use `./node_modules/.bin/wrangler ...` from the same folder).
- Cloudflare API calls need a token with Zone DNS edit and Zone WAF
  edit on `yedigaryan.pro`, exported as `$CLOUDFLARE_API_TOKEN` in the
  shell (never typed into a file). If there is no such token, do the
  same action in the dashboard (DNS > Records; Security > WAF > Custom
  rules) and keep the verification commands.
- Stop at the first failed verification. Do not continue to the next
  step; use that step's rollback.

## Order and why (differs from the order Req 32 lists)

Req 32 names the pieces; this file orders them so there is never a window
where a public hostname reaches the laptop without protection:

1. CNAMEs first (removes the public route),
2. then the WAF rule (it protects those hostnames; nothing left to protect),
3. then the Worker secret,
4. then the ingress rules,
5. local secret files LAST, because the rollbacks of steps 2 and 3 read
   `~/.cloudflared/origin-secret`.

Rollbacks run in the reverse order.

## Step 0 - Preconditions [items 1-4 read-only, item 5 NEEDS YES]

Proceed only when all hold. Each is a fact to confirm, not assume.

1. Davit says the soak passed (Req 32 trigger: cutover live, Req 30 docs
   done, spec 011 Open question on the soak period closed).
2. The deployed Worker is the VPC version and does not use the header:
   `grep -n 'vpc_services\|OLLAMA_UPSTREAM\|CLAUDE_UPSTREAM' "$GW/cloudflare/wrangler.toml"`
   shows `vpc_services` bindings and no `https://` upstream vars;
   `grep -n 'X-Origin-Secret\|ORIGIN_SECRET' "$GW/cloudflare/src/handler.ts" "$GW/cloudflare/src/index.ts"`
   prints nothing; `cd "$GW/cloudflare" && pnpm --ignore-workspace exec wrangler deployments list`
   shows a deployment newer than the VPC code change. If the Worker
   still sends the header, STOP: steps 1-3 would break it.
3. Baseline of the live path, which must still pass after every step
   (Req 4 and 6, V15 pairs). `$LLM_API_TOKEN` comes from the shell
   environment, never pasted:
   - `curl -sS -o /dev/null -w '%{http_code}\n' -X OPTIONS https://cv-llm-gateway.davit-yedigaryan-1993.workers.dev/v1/chat/completions` -> `204`
   - `curl -sS -o /dev/null -w '%{http_code}\n' -X POST https://cv-llm-gateway.davit-yedigaryan-1993.workers.dev/v1/chat/completions` -> `401`
   - an authorized POST with a one-word prompt (`-H "Authorization: Bearer $LLM_API_TOKEN"`, body
     `{"model":"gemma3","messages":[{"role":"user","content":"hi"}],"stream":false}`) -> `200`
4. Look up the ids once (read-only; prints no expression, because the
   rule expression contains the secret):
   ```
   ZONE_ID=$(curl -sS "https://api.cloudflare.com/client/v4/zones?name=yedigaryan.pro" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq -r '.result[0].id')
   curl -sS "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/phases/http_request_firewall_custom/entrypoint" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     | jq '{ruleset_id: .result.id, rules: [.result.rules[] | {id, description, action, enabled}]}'
   ```
   Expected: one rule, id `b9163c2effdf4ab6b2907d9aabac2ddb`, description
   `cv-llm-gateway origin secret`, action `block`. Note the `ruleset_id`
   for step 2. If the rule id or description differs, STOP and tell Davit.
   NEVER add `.expression` to that `jq` filter.
5. Back up the tunnel config (no secret in it, but it is the only copy):
   `cp -p ~/.cloudflared/config.yml ~/.cloudflared/config.yml.bak-pre-req32`
   [NEEDS YES: writes a file]. Do not read or print the file in chat if
   it holds anything beyond hostnames, UUID and credentials path.

## Step 1 - Delete the two proxied CNAMEs [NEEDS YES]

- **Affects:** DNS records `cv-ollama.yedigaryan.pro` and
  `cv-claude.yedigaryan.pro` in the Cloudflare zone `yedigaryan.pro`
  (created by `cloudflared tunnel route dns`). The zone is not
  authoritative (name.am nameservers, reverted 2026-11-02), so public
  resolvers do not see these records either way; this removes the dashboard
  entries and any future route if the zone ever becomes authoritative. No
  other record is touched. The Worker uses the VPC binding, not these
  hostnames.
- **Commands:**
  ```
  for h in cv-ollama.yedigaryan.pro cv-claude.yedigaryan.pro; do
    curl -sS "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=$h" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq '.result[] | {id, type, name, content, proxied}'
  done
  ```
  [read-only] Confirm exactly one CNAME per name, `proxied: true`,
  content ending `.cfargotunnel.com`. Then, per record id from that output:
  ```
  curl -sS -X DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/<RECORD_ID>" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq '{success, errors}'
  ```
  (one call per name, each with its own yes). There is no `cloudflared`
  command to delete a DNS route that I can confirm; I am not certain, so
  use the API or the dashboard.
- **Verify:** the listing above returns an empty `result` for both names;
  `dig @<assigned-cf-ns> +short cv-ollama.yedigaryan.pro` and the same for
  `cv-claude.` print nothing (`<assigned-cf-ns>` is the zone's assigned
  Cloudflare nameserver, as in V1); V8': the same `dig` against name.am's
  nameservers prints nothing and `curl -sS -m 10
  https://cv-ollama.yedigaryan.pro/api/tags` fails to connect. Re-run the
  Step 0 item 3 baseline: `204`, `401`, `200`.
- **Rollback:** `cloudflared tunnel route dns cv-llm-gateway cv-ollama.yedigaryan.pro`
  and the same for `cv-claude.` (needs `~/.cloudflared/cert.pem`; its own yes).
  Only do this together with a restored WAF rule (Step 2 rollback FIRST),
  or the hostnames are reachable unprotected. In the zone as it stands
  (not authoritative) the records would not resolve publicly anyway, but
  do not rely on that.

## Step 2 - Delete the WAF custom rule [NEEDS YES]

- **Affects:** WAF custom rule `cv-llm-gateway origin secret` (id
  `b9163c2effdf4ab6b2907d9aabac2ddb`) on zone `yedigaryan.pro`. It only
  matched the two hostnames removed in Step 1. Other WAF rules, if any,
  are untouched (Step 0 item 4 showed the list).
- **Command:** (`<RULESET_ID>` from Step 0 item 4)
  ```
  curl -sS -X DELETE "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/<RULESET_ID>/rules/b9163c2effdf4ab6b2907d9aabac2ddb" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq '{success, errors}'
  ```
  Dashboard alternative: Security > WAF > Custom rules > the rule > Delete.
- **Verify:** re-run the `entrypoint` listing from Step 0 item 4: the rule
  id is gone (the list is empty or holds only other rules). Baseline
  `204`, `401`, `200` still pass (the Worker never touched the rule on
  the VPC path).
- **Rollback:** recreate the rule per Req 17 (block when `http.host` is one of
  the two hostnames and the `X-Origin-Secret` header is absent or different).
  The secret is read inside the shell from the local file (only possible
  while Step 5 has NOT run), never printed. The expression syntax below is
  from memory and unverified; the dashboard editor validates it:
  ```
  SECRET=$(tr -d '\n' < ~/.cloudflared/origin-secret)
  curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/<RULESET_ID>/rules" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H 'Content-Type: application/json' --data-binary @- <<EOF | jq '{success, errors}'
  {"action":"block","description":"cv-llm-gateway origin secret","enabled":true,
   "expression":"(http.host in {\"cv-ollama.yedigaryan.pro\" \"cv-claude.yedigaryan.pro\"} and not any(http.request.headers[\"x-origin-secret\"][*] eq \"$SECRET\"))"}
  EOF
  unset SECRET
  ```
  The new rule gets a NEW id; update this file and the spec if it is reused.
  After Step 5 the secret no longer exists, so this rollback is then
  impossible; the only way back is a fresh `openssl rand -hex 32` and
  re-doing Req 17 and the Worker secret.

## Step 3 - Delete the Worker secret ORIGIN_SECRET [NEEDS YES]

- **Affects:** Worker `cv-llm-gateway` only. Deleting a secret makes
  Cloudflare roll a new Worker version (a new deployment entry). The
  deployed VPC code does not read it (Step 0 item 2). `LLM_API_TOKEN` is
  not touched.
- **Command:** (from `$GW/cloudflare`)
  ```
  pnpm --ignore-workspace exec wrangler secret delete ORIGIN_SECRET
  ```
  It asks for a confirmation prompt; that prompt is a second gate, not a
  substitute for Davit's yes.
- **Verify:** `pnpm --ignore-workspace exec wrangler secret list` shows
  exactly `LLM_API_TOKEN` (V2). Baseline `204`, `401`, `200` pass.
  Unverified: whether the roll creates a visible new version; the
  baseline is the real check.
- **Rollback:** (only while Step 5 has not run; no trailing newline,
  MEMORY.md 2026-05-31 gotcha 2)
  ```
  tr -d '\n' < ~/.cloudflared/origin-secret | pnpm --ignore-workspace exec wrangler secret put ORIGIN_SECRET
  ```
  Its own yes. Pointless unless the Worker code is also rolled back to a
  version that sends the header.

## Step 4 - Remove the public-hostname ingress rules [NEEDS YES]

- **Affects:** `~/.cloudflared/config.yml` and the running cloudflared
  agent `dev.local.cloudflared`. The two `hostname:` rules for
  `cv-ollama.` and `cv-claude.` are removed. The final catch-all rule
  (`service: http_status:404`) MUST stay: cloudflared refuses an ingress
  list without it. The tunnel, its UUID, `credentials-file` and the VPC
  services are not touched. Restarting drops the tunnel connections for a
  few seconds, during which the live chat fails over per spec 001 (Claude
  fallback does not help: both go through the same tunnel; expect the
  offline card for that moment). Do it when nobody is chatting.
- **Unverified:** whether VPC traffic needs any ingress rule on the
  tunnel (the amendment says docs say no). The post-restart baseline in
  this step is what settles it.
- **Commands:**
  1. Edit `~/.cloudflared/config.yml` by hand: delete the two
     `- hostname: ...` blocks (each with its `service:` and
     `originRequest:`), keep everything else and the `- service:
     http_status:404` line.
  2. `cloudflared tunnel --config ~/.cloudflared/config.yml ingress validate`
     [read-only] -> `OK`. Do not restart if this is not OK.
  3. `launchctl kickstart -k gui/$(id -u)/dev.local.cloudflared`
     (the `gui/<uid>` domain is the usual place for a LaunchAgent, not
     checked here).
- **Verify (restart check):** `cloudflared tunnel info cv-llm-gateway`
  shows connections again within about a minute (it ran 4 on 2026-11-03);
  the Step 0 item 3 baseline passes, in particular the authorized POST
  -> `200` (proves the VPC path survives without the ingress rules);
  `launchctl print gui/$(id -u)/dev.local.cloudflared | grep -i 'state\|last exit'`
  shows it running. If the authorized POST fails, roll back at once.
- **Rollback:** `cp -p ~/.cloudflared/config.yml.bak-pre-req32 ~/.cloudflared/config.yml`
  then `launchctl kickstart -k gui/$(id -u)/dev.local.cloudflared`, then
  re-run the baseline.

## Step 5 - Delete the local secret files [NEEDS YES, irreversible]

- **Affects:** `~/.cloudflared/origin-secret` and
  `~/.cloudflared/origin-header` only. Neither is read by this runbook.
  `~/.cloudflared/cert.pem`, `<TUNNEL_UUID>.json`, `config.yml` and the
  backup from Step 0 are NOT touched. After this step the secret value
  exists nowhere (WAF rule deleted, Worker secret deleted, file gone):
  steps 2 and 3 can no longer be rolled back, only redone with a new secret.
- **Preconditions:** Steps 1-4 verified; Davit confirms no other consumer
  of those files (for example a script or plist outside this repo; not
  checked here: `grep -rn 'origin-secret\|origin-header' ~/Library/LaunchAgents "$GW" 2>/dev/null`
  [read-only] should print nothing).
- **Command:**
  ```
  ls -l ~/.cloudflared/origin-secret ~/.cloudflared/origin-header
  rm ~/.cloudflared/origin-secret ~/.cloudflared/origin-header
  ```
  Run the `ls` first and let Davit see exactly two files. Do not use a
  glob. (`rm -P` overwrite is not relied on: it is not reliable on APFS.)
- **Verify:** `ls ~/.cloudflared/` no longer lists either file and still
  lists `cert.pem`, `config.yml` and `<TUNNEL_UUID>.json`; the baseline
  passes.
- **Rollback:** none. See Affects.

## Step 6 - Final check [read-only]

- Step 0 item 3 baseline: `204`, `401`, `200`.
- `pnpm --ignore-workspace exec wrangler secret list` -> `LLM_API_TOKEN` only.
- `pnpm --ignore-workspace exec wrangler vpc service list` shows both
  VPC services on the tunnel (V2).
- WAF entrypoint listing shows no `cv-llm-gateway origin secret` rule.
- Record the result and the date in spec 011's verification record, and
  add a MEMORY.md entry (CLAUDE.md rule 10). Both are separate edits that
  need their own approval.

## Left alone on purpose (not in Req 32)

- The VPC service `cv-ollama-gate` left by the 2026-11-03 gate (reuse or
  rename is Davit's separate decision).
- The `yedigaryan.pro` zone on Cloudflare (113 records, DNS-only; spec
  011 Open question 17, default keep).
- `~/.cloudflared/cert.pem`, the tunnel itself, `LLM_API_TOKEN`.
- Render and Tailscale decommissioning (Req 29), a different step.
