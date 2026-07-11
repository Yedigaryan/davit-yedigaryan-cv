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
