# 003 — Deploy pipeline

- **Status:** implemented
- **Date:** 2026-07-07 (retroactive spec; FTP publish currently blocked
  on a rejected credential — see Open questions)
- **Spec:** 003
- **Supersedes / superseded-by:** —

## Intent

Publish the static export (`out/`) to name.am's Apache host over FTP
without a GUI, safely (never nuking host-owned infra, never leaking
the FTP password), plus a git-based build-artifact archive, a
live-vs-local fingerprint check, and a doc-root discovery diagnostic.

## Behavioral Requirements

### scripts/deploy.sh (FTP publish)
1. Flags: `--dry-run`, `--skip-build`, `--delete`, `--no-delete`,
   `-h/--help`; unknown flag dies. `set -euo pipefail`.
2. Preflight: `lftp` and `pnpm` required on PATH.
3. Build unless `--skip-build`; then assert `out/` and
   `out/index.html` exist (die) and `out/.htaccess` exists (warn —
   Apache deep-link routing breaks without it).
4. Password ladder: `$FTP_PASSWORD` env → macOS Keychain
   (`security find-internet-password -s ftp.yedigaryan.pro -a dzdave`)
   → interactive prompt. Empty → die.
5. Credential safety: password never on argv (heredoc `user` line);
   ALL lftp stdout+stderr piped through `mask_creds` so any
   `user:password@host` renders as `user:***@host`.
6. Protected remote paths are always excluded from mirror (and thus
   unreachable by `--delete`): `.well-known`, `cgi-bin`, `.htpasswd`,
   `error_log`, `php_error_log`, `awstats`, `logs`, `tmp`, `.cpanel`,
   `.lastlogin`, `.contactemail`, `.htaccess.bak`.
7. `mirror --reverse --parallel=4` with `--include-glob='.htaccess'`
   (lftp skips dotfiles) and `--exclude-glob='.DS_Store'`.
8. TLS: `ssl-allow yes`, `ssl-force no`, `verify-certificate no`
   (name.am self-signed certs — encrypted, not pinned).
9. WHEN not `--delete` THEN no remote file is ever deleted.

### scripts/deploy-git.sh (artifact archive)
10. Commits `out/` to a dedicated `deploy` branch (override:
    `DEPLOY_BRANCH`) via an isolated `git worktree` in a temp dir —
    `main` (where `out/` is gitignored) is never touched. Temp
    worktree trap-cleaned on EXIT.
11. First run creates the branch as an ORPHAN — no shared history.
12. WHEN the build output is identical to the last deploy commit THEN
    "nothing to commit", exit 0.
13. Commit message records source branch@sha, source subject, UTC
    build time.
14. `--push` is opt-in; default is a local commit only. This script
    does NOT publish to the live host.

### scripts/check-deploy.sh (fingerprint compare)
15. Deliberately NOT `set -e` — empty grep pipelines are reported, not
    fatal.
16. Compares local `out/_next/static/<hash>/` dir name vs the hash the
    live page references in `_buildManifest.js`; match → "deploy is
    live", differ → propagation/doc-root warning.
17. `--verbose` GETs every referenced chunk and reports non-200s.
    Overrides: `URL`, `LOCAL_OUT`.

### scripts/find-docroot.sh (diagnostic)
18. Uploads a unique `DOCROOT=<path>` marker to each candidate FTP
    path, then GETs it over HTTPS to identify the actually-served
    root. Same password ladder + credential masking as deploy.sh.
19. `530/Login failed` → hard exit; `550/no such` → "not writable";
    marker served → print identified root + REMOTE_DIR instruction.

## Non-goals

- deploy.sh never deletes without explicit `--delete`, and protected
  paths are spared even then.
- deploy-git.sh never pushes without `--push`, never touches `main`,
  never publishes to name.am.
- No CI/CD, no git hooks — all deploys are manual invocations.

## Interface contract

| Env var | Consumer | Default |
|---|---|---|
| `FTP_PASSWORD` | deploy.sh, find-docroot.sh | Keychain → prompt |
| `DEPLOY_BRANCH` | deploy-git.sh | `deploy` |
| `URL` | check-deploy.sh, find-docroot.sh | `https://davit.yedigaryan.pro` |
| `LOCAL_OUT` | check-deploy.sh | `./out` |

npm scripts: `deploy`, `deploy:dry`, `deploy:fast`, `deploy:git`,
`deploy:git:push`, `deploy:check`, `deploy:check:full`,
`deploy:find-root`. NOTE: pnpm swallows extra flags after the script
name — run `bash scripts/<name>.sh --flag` directly for ad-hoc flags.

## Verification

1. `pnpm run deploy:dry` → mirror plan prints, nothing transfers
   (Reqs 1, 9).
2. Run any FTP script; confirm no plaintext password in output and
   none on argv (`ps` mid-run) (Req 5).
3. `pnpm run deploy:git` twice: first commits (if changed), second
   reports "nothing to commit"; `git log deploy` shows the snapshot
   (Reqs 10-13). *Verified 2026-05-19 and 2026-07-07.*
4. Post-deploy: `curl -I` on `/`, `/skills` (deep-link 200),
   `/resume.pdf` (200 application/pdf) (Req 3's .htaccess purpose).
5. `pnpm run deploy:check` → hash match on a fresh deploy (Req 16).

## Open questions

- [ ] FTP credential for `dzdave@ftp.yedigaryan.pro` is currently
      rejected (530) — Keychain entry stale or password changed on
      name.am. Blocks live FTP verification of Reqs 1-9.

## Amendment (cPanel Git publish path, 2026-11-03) - DRAFT, needs Davit's approval

Not approved. Nothing below changes a script; it records a publish path
found on 2026-11-03 and corrects statements above that it makes untrue.
Approving this draft is not the yes for any deploy: every publish still
needs Davit's explicit yes at the moment it runs (CLAUDE.md rules 14-15).

### Facts established 2026-11-03

- The cPanel account has a Git Version Control repository
  `davit.yedigaryan.pro` at `/home/dzdave/davit.yedigaryan.pro`, which is
  the document root of `https://davit.yedigaryan.pro`. It tracks branch
  `deploy` of `origin` (the branch `scripts/deploy-git.sh` writes).
- The host does NOT auto-pull. Pushing `deploy` to origin alone changes
  nothing on the live site; a pull on the host is a separate step.
- The FTP path (`scripts/deploy.sh`) currently fails with `530`: the
  Keychain password is stale (the open question below is unchanged).

### What this amendment changes in the text above

- **Req 14 and Non-goals** ("does NOT publish to the live host", "never
  publishes to name.am"): still true of the script itself, which only
  commits and pushes. They stop being true of the pipeline: `deploy-git.sh
  --push` followed by a host-side pull publishes the live site. The
  script's own header comment ("This does NOT publish anywhere") is now
  misleading and is left unchanged here (no script change in this
  amendment).
- **Intent:** the live-publish route is no longer FTP only; there are two
  routes, FTP (Reqs 1-9) and git-pull (Reqs 20-22 below).

### New Behavioral Requirements

#### Git-pull publish (cPanel Git Version Control)
20. WHEN publishing via git THEN the sequence is, in order:
    1. `bash scripts/deploy-git.sh --skip-build --push` (after a
       successful `pnpm run build`; commits `out/` to the orphan `deploy`
       branch and pushes it to origin; Reqs 10-14 unchanged);
    2. a host-side update of repository `/home/dzdave/davit.yedigaryan.pro`
       to branch `deploy`, by either route:
       - cPanel UAPI `VersionControl::update` with branch `deploy`,
         called through the WebPros MCP write tool
         (`si_cpanel_user_api_method_execute_on_host_write`), or
       - the cPanel Git Version Control UI, "Update from Remote".
21. WHEN step 1 reports "nothing to commit" THEN step 2 may still run
    (the host may be behind origin) but publishes nothing new.
22. WHEN either step fails THEN the live site is whatever the host last
    successfully updated to; no partial state is created by step 1
    (the push is a single branch update). Step 2 failing after step 1
    leaves origin ahead of the host, which is safe.

### Interface contract (additions)

| Item | Value |
|---|---|
| cPanel account / host path | `dzdave` / `/home/dzdave/davit.yedigaryan.pro` (document root) |
| Tracked branch | `deploy` of `origin` (override name: `DEPLOY_BRANCH`, but the host tracks `deploy`) |
| Host update call | UAPI `VersionControl::update`, branch `deploy`. Parameter names (expected `repository_root`, `branch`) are NOT verified; read `si_cpanel_user_api_method_usage` for `VersionControl::update` before the first call |
| Script flags used | `--skip-build --push` (flags already exist) |

### Verification (additions)

6. After step 2, the live page is byte-identical to the local build
   (Req 20). From the repo root, with `out/` as just built:
   `curl -sS https://davit.yedigaryan.pro/ | shasum -a 256` and
   `shasum -a 256 out/index.html` print the same digest. Do not pass
   `--compressed` to curl (it must return the stored bytes). Then
   `pnpm run deploy:check` reports "deploy is live" (Req 16), and
   Verification 4's `curl -I` checks (`/`, `/skills`, `/resume.pdf`)
   pass.
7. Before step 2 (right after step 1), the same two digests DIFFER when
   `out/index.html` changed, proving the host does not auto-pull (Req 20).
   Skip when the build output did not change.
8. `curl -sS -o /dev/null -w '%{http_code}\n'
   https://davit.yedigaryan.pro/.git/config` prints 403 or 404, not 200
   (see Open questions).

### Open questions (added)

- [ ] 4. Exposure of `/.git/` in the document root: a repository whose
      work tree is the document root can serve `.git/` over HTTP unless
      the host blocks it. Verification 8 settles it; if it prints 200,
      stop and fix before the next publish. Not checked by the author of
      this draft.
- [ ] 5. What `VersionControl::update` does to files that exist in the
      document root but not in `deploy` (host-owned `.well-known`,
      `cgi-bin`, `error_log`, `.htaccess` variants - the protected list in
      Req 6). A git update touches only tracked paths, which would make
      those safe, but this is expected behavior, not verified. Also
      whether the update fails on a dirty work tree. Check before the
      first real publish.
- [ ] 6. Does the FTP path stay supported (fix the Keychain entry) or is
      git-pull the primary route from now on? If git-pull becomes
      primary, Reqs 1-9 and the `--delete` protections apply only to the
      fallback route.
- [ ] 7. Credential for the host-side update: it uses the existing cPanel
      access of the WebPros MCP tool (no password in the repo or the
      scripts). Confirm this is the intended long-term mechanism, or
      whether the UI route is the only one Davit wants.
