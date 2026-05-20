#!/usr/bin/env bash
# deploy.sh — build the static site and sync to name.am via FTP.
# No git involvement, no Cyberduck GUI needed.
#
# Usage:
#   ./deploy.sh                  # build + upload (NEVER deletes remote files)
#   ./deploy.sh --dry-run        # show plan, change nothing
#   ./deploy.sh --skip-build     # sync existing out/ as-is (faster iteration)
#   ./deploy.sh --delete         # ALSO delete remote files missing locally
#                                # (protected dirs below are always spared)
#
# One-time setup (recommended):
#   brew install lftp
#   security add-internet-password -s ftp.yedigaryan.pro -a dzdave -w -U
#   (type the password when prompted; -U updates if it already exists)
#
# Password resolution order:
#   1. $FTP_PASSWORD env var
#   2. macOS Keychain (added by the command above)
#   3. Interactive prompt
#
# SECURITY:
#   - The password is never put on lftp's argv (so `ps` can't see it).
#   - All lftp output is piped through a sed filter that masks any
#     `://user:password@host` URL form lftp may print on verbose log
#     lines or error messages, so transcripts / CI logs stay clean.

set -euo pipefail

# --- config (edit if your hosting layout differs) -----------------------
FTP_HOST="ftp.yedigaryan.pro"
FTP_USER="dzdave"
FTP_PORT="21"
LOCAL_DIR="./out"
REMOTE_DIR="/public_html"
PUBLIC_URL="https://davit.yedigaryan.pro/"

# Directories/paths on the remote that must NEVER be touched by mirror's
# --delete pass. These are infrastructure folders the hosting provider
# or other services own; nuking them breaks HTTPS / cron / mail / etc.
# Patterns are lftp glob fragments matched against remote names.
PROTECTED_PATHS=(
    '.well-known'        # Let's Encrypt ACME challenge (HTTPS cert renewal)
    'cgi-bin'            # cPanel / name.am infrastructure
    '.htpasswd'          # any basic-auth file you might have set
    'error_log'          # PHP / Apache logs
    'php_error_log'
    'awstats'            # name.am stats dir
    'logs'
    'tmp'
    '.cpanel'
    '.lastlogin'
    '.contactemail'
    '.htaccess.bak'      # don't overwrite your own backups
)
# Anything you've added manually under /public_html that lives outside
# the static build also belongs here. Add lines as needed.
# -----------------------------------------------------------------------

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

# Mask any `user:password@host` substring that may slip into lftp output.
# Applied to BOTH stdout and stderr of every lftp invocation.
mask_creds() {
    sed -E 's#(ftp[s]?://[^:/[:space:]]+):[^@[:space:]]+@#\1:***@#g'
}

# --- parse flags --------------------------------------------------------
DRY_RUN=0
SKIP_BUILD=0
DELETE=0
for arg in "$@"; do
    case "$arg" in
        --dry-run)    DRY_RUN=1 ;;
        --skip-build) SKIP_BUILD=1 ;;
        --delete)     DELETE=1 ;;
        --no-delete)  DELETE=0 ;;        # explicit no-op; kept for clarity
        -h|--help)    sed -n '2,30p' "$0"; exit 0 ;;
        *) die "Unknown flag: $arg (try --help)" ;;
    esac
done

# --- preflight ----------------------------------------------------------
command -v lftp >/dev/null || die "lftp not installed. Run: brew install lftp"
command -v pnpm >/dev/null || die "pnpm not installed. Run: brew install pnpm"

# --- 1. build -----------------------------------------------------------
if [ "$SKIP_BUILD" -eq 1 ]; then
    log "Skipping build (--skip-build); using existing $LOCAL_DIR/."
else
    log "Building static site (pnpm run build) …"
    pnpm run build
fi

[ -d "$LOCAL_DIR" ] || die "No $LOCAL_DIR/ directory. Build failed or you ran from the wrong cwd."
[ -f "$LOCAL_DIR/.htaccess" ] || warn "$LOCAL_DIR/.htaccess is missing — Apache routing will break. Check public/.htaccess + the postbuild copy step."
[ -f "$LOCAL_DIR/index.html" ] || die "$LOCAL_DIR/index.html is missing — build output looks broken."

local_files=$(find "$LOCAL_DIR" -type f | wc -l | tr -d ' ')
local_bytes=$(du -sh "$LOCAL_DIR" | awk '{print $1}')
ok "Built: $local_files files, $local_bytes."

# --- 2. resolve password -----------------------------------------------
if [ -n "${FTP_PASSWORD:-}" ]; then
    log "Using FTP_PASSWORD from environment."
elif FTP_PASSWORD=$(security find-internet-password -s "$FTP_HOST" -a "$FTP_USER" -w 2>/dev/null); then
    log "Using FTP password from macOS Keychain ($FTP_USER@$FTP_HOST)."
else
    warn "No \$FTP_PASSWORD and no Keychain entry."
    warn "Stash it once with:  security add-internet-password -s $FTP_HOST -a $FTP_USER -w -U"
    printf '%sFTP password for %s@%s:%s ' "$C_INFO" "$FTP_USER" "$FTP_HOST" "$C_OFF" >&2
    read -rs FTP_PASSWORD
    echo
fi
[ -n "$FTP_PASSWORD" ] || die "Empty password; aborting."

# --- 3. build lftp command --------------------------------------------
# Flags:
#   `mirror --reverse`        = local → remote.
#   `--delete` (opt-in)       = remove remote files not present locally.
#   `--include-glob=.htaccess`= lftp skips dotfiles; explicit include.
#   `--exclude .DS_Store$`    = never upload macOS metadata.
#   `--exclude` per protected path = mirror skips them entirely, so
#                              --delete cannot reach them either.
#   `--parallel=4`            = up to 4 concurrent uploads.
#   `--dry-run` (toggled)     = plan only, no transfers.
#
# TLS:
#   `set ftp:ssl-allow yes`           = attempt AUTH TLS (FTPS).
#   `set ftp:ssl-force no`            = fall back to plain FTP if no TLS.
#   `set ssl:verify-certificate no`   = name.am free FTP often has
#                              self-signed certs; the channel is still
#                              encrypted, just not pinned.

delete_flag=""; [ "$DELETE"  -eq 1 ] && delete_flag="--delete"
dryrun_flag=""; [ "$DRY_RUN" -eq 1 ] && dryrun_flag="--dry-run"

# Compose --exclude-glob lines for protected paths.
protected_excludes=""
for p in "${PROTECTED_PATHS[@]}"; do
    protected_excludes+=" --exclude-glob='${p}' --exclude-glob='${p}/*'"
done

# Friendly banner.
log "Syncing $LOCAL_DIR/ → ftp://$FTP_HOST:$FTP_PORT$REMOTE_DIR/  $( [ "$DRY_RUN" -eq 1 ] && echo '(DRY RUN)' )$( [ "$DELETE" -eq 1 ] && echo ' [WITH --delete]')"
if [ "$DELETE" -eq 1 ]; then
    warn "--delete enabled: remote files NOT in local will be removed (except protected paths)."
fi

# Run lftp with creds fed via stdin (not argv). Pipe both fd1+fd2 through
# the credentials masker so any URL form lftp prints shows `user:***@host`
# instead of the real password — keeps terminals, scrollback, CI logs,
# and pasted snippets safe.
{
    lftp -p "$FTP_PORT" "$FTP_HOST" <<EOF 2>&1
set ftp:passive-mode true
set ftp:ssl-allow yes
set ftp:ssl-force no
set ssl:verify-certificate no
set net:max-retries 3
set net:timeout 30
set net:reconnect-interval-base 5
set xfer:log no
set cmd:fail-exit yes
user "$FTP_USER" "$FTP_PASSWORD"
mirror --reverse --verbose --parallel=4 \\
       $delete_flag $dryrun_flag \\
       --include-glob='.htaccess' \\
       --exclude-glob='.DS_Store' \\
       $protected_excludes \\
       "$LOCAL_DIR/" "$REMOTE_DIR/"
bye
EOF
} | mask_creds

ok "Deploy finished."
log "Smoke-test:"
log "  curl -I $PUBLIC_URL"
log "  curl -I ${PUBLIC_URL}skills      # deep-link, should be 200"
log "  curl -I ${PUBLIC_URL}resume.pdf  # should be 200 application/pdf"
