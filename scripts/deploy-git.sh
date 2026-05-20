#!/usr/bin/env bash
# deploy-git.sh — build the static site and commit the out/ output to a
# dedicated `deploy` branch as a deployable artifact record.
#
# This does NOT publish anywhere (name.am stays the live host via
# scripts/deploy.sh). It snapshots each build into git history so you
# have a versioned, diffable record of exactly what was shipped.
#
# Usage:
#   bash scripts/deploy-git.sh               # build + commit to `deploy`
#   bash scripts/deploy-git.sh --skip-build  # commit existing out/ as-is
#   bash scripts/deploy-git.sh --push        # also push the branch to origin
#   bash scripts/deploy-git.sh --help
#
# Notes:
#   - out/ is gitignored on `main`; this script writes it to the `deploy`
#     branch via an isolated `git worktree`, so `main` is never touched.
#   - The `deploy` branch is created as an orphan on first run (no shared
#     history with `main` — it only ever holds build output).
#   - --push is opt-in: by default the commit stays local.

set -euo pipefail

BRANCH="${DEPLOY_BRANCH:-deploy}"
LOCAL_DIR="./out"

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"

# Colour helpers (auto-disabled if not a tty).
if [ -t 1 ]; then
    C_INFO=$'\033[1;36m'; C_OK=$'\033[1;32m'; C_WARN=$'\033[1;33m'; C_ERR=$'\033[1;31m'; C_OFF=$'\033[0m'
else
    C_INFO=''; C_OK=''; C_WARN=''; C_ERR=''; C_OFF=''
fi
log()  { printf '%s[%s]%s %s\n' "$C_INFO" "$(date +%H:%M:%S)" "$C_OFF" "$*"; }
ok()   { printf '%s[ ok ]%s  %s\n' "$C_OK"   "$C_OFF" "$*"; }
warn() { printf '%s[warn]%s  %s\n' "$C_WARN" "$C_OFF" "$*" >&2; }
die()  { printf '%s[fail]%s  %s\n' "$C_ERR"  "$C_OFF" "$*" >&2; exit 1; }

# --- parse flags --------------------------------------------------------
SKIP_BUILD=0
PUSH=0
for arg in "$@"; do
    case "$arg" in
        --skip-build) SKIP_BUILD=1 ;;
        --push)       PUSH=1 ;;
        -h|--help)    sed -n '2,20p' "$0"; exit 0 ;;
        *) die "Unknown flag: $arg (try --help)" ;;
    esac
done

# --- preflight ----------------------------------------------------------
command -v git  >/dev/null || die "git not installed."
command -v pnpm >/dev/null || die "pnpm not installed. Run: brew install pnpm"
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Not inside a git repository."

# --- 1. build -----------------------------------------------------------
if [ "$SKIP_BUILD" -eq 1 ]; then
    log "Skipping build (--skip-build); using existing $LOCAL_DIR/."
else
    log "Building static site (pnpm run build) …"
    pnpm run build
fi

[ -d "$LOCAL_DIR" ]            || die "No $LOCAL_DIR/ directory. Build failed or wrong cwd."
[ -f "$LOCAL_DIR/index.html" ] || die "$LOCAL_DIR/index.html missing — build output looks broken."
[ -f "$LOCAL_DIR/.htaccess" ] || warn "$LOCAL_DIR/.htaccess missing — Apache routing would break on a live deploy."

src_sha="$(git rev-parse --short HEAD)"
src_branch="$(git rev-parse --abbrev-ref HEAD)"
src_subject="$(git log -1 --pretty=%s)"

# --- 2. stage the deploy branch in an isolated worktree -----------------
WT="$(mktemp -d -t cv-deploy.XXXXXX)"
cleanup() { git worktree remove --force "$WT" >/dev/null 2>&1 || rm -rf "$WT"; }
trap cleanup EXIT

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
    log "Checking out existing '$BRANCH' branch into a worktree …"
    git worktree add "$WT" "$BRANCH" >/dev/null
else
    log "Creating orphan '$BRANCH' branch (first run) …"
    git worktree add --detach "$WT" >/dev/null
    ( cd "$WT" && git checkout --orphan "$BRANCH" >/dev/null 2>&1 && git rm -rf . >/dev/null 2>&1 || true )
fi

# --- 3. replace branch contents with the fresh build --------------------
# Wipe everything except the worktree's own .git pointer file, then copy.
find "$WT" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R "$LOCAL_DIR"/. "$WT"/

cd "$WT"
git add -A

if git diff --cached --quiet; then
    ok "Build output is identical to the last '$BRANCH' commit — nothing to commit."
    cd "$HERE"
    exit 0
fi

files="$(git diff --cached --name-only | wc -l | tr -d ' ')"
git commit -q -m "Deploy build from ${src_branch}@${src_sha}

Source: ${src_subject}
Built:  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
commit_sha="$(git rev-parse --short HEAD)"
ok "Committed $files file(s) to '$BRANCH' as $commit_sha."

cd "$HERE"

# --- 4. push (opt-in) ---------------------------------------------------
if [ "$PUSH" -eq 1 ]; then
    log "Pushing '$BRANCH' to origin …"
    git push origin "$BRANCH"
    ok "Pushed."
else
    log "Local commit only. To publish the branch:  git push origin $BRANCH"
fi
