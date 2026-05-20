#!/usr/bin/env bash
# Discover which remote directory is the doc root for davit.yedigaryan.pro.
# Drops a marker file into each candidate path, then GETs each via HTTPS
# to see which one the web actually serves.
#
# NOTE: MEMORY.md already records /public_html as the working doc root —
# this script is a diagnostic for when that assumption stops holding
# (e.g. the host changes its FTP-chroot layout).
set -uo pipefail

FTP_HOST="${FTP_HOST:-ftp.yedigaryan.pro}"
FTP_USER="${FTP_USER:-dzdave}"
FTP_PORT="${FTP_PORT:-21}"
URL="${URL:-https://davit.yedigaryan.pro}"

# Candidate paths, in priority order. /public_html is the known-good one
# (see MEMORY.md §11); the rest cover common name.am / cPanel layouts.
CANDIDATES=(
  "/public_html"
  "public_html"
  "/public_html/davit.yedigaryan.pro"
  "/domains/davit.yedigaryan.pro/public_html"
  "/home/dzdave/public_html"
  "/home/dzdave/davit.yedigaryan.pro"
)

# Password resolution ladder (env → Keychain → prompt).
if [ -z "${FTP_PASSWORD:-}" ]; then
  if command -v security >/dev/null 2>&1 \
     && FTP_PASSWORD=$(security find-internet-password -s "$FTP_HOST" -a "$FTP_USER" -w 2>/dev/null); then
    :
  else
    printf "FTP password for %s@%s: " "$FTP_USER" "$FTP_HOST" >&2
    read -rs FTP_PASSWORD
    echo >&2
  fi
fi

mask_creds() {
  sed -E 's#(ftps?://[^:/[:space:]]+):[^@[:space:]]+@#\1:***@#g'
}

# Stage the marker as a real local file (lftp's `put` wants a path).
PID=$$
marker_name=".dy-docroot-probe-${PID}.txt"
tmp_marker="$(mktemp -t dy-docroot.XXXXXX)"
trap 'rm -f "$tmp_marker"' EXIT

echo "Probing $FTP_USER@$FTP_HOST:$FTP_PORT — looking for the directory that backs $URL/"
echo ""
echo "Uploading marker '$marker_name' to each candidate path…"

for path in "${CANDIDATES[@]}"; do
  echo "DOCROOT=$path" > "$tmp_marker"
  printf "  → %s … " "$path"
  out="$(lftp -p "$FTP_PORT" "$FTP_HOST" <<LFTP 2>&1 | mask_creds
set ftp:passive-mode true
set ftp:ssl-allow yes
set ssl:verify-certificate no
set net:timeout 15
set xfer:clobber yes
user "$FTP_USER" "$FTP_PASSWORD"
cd "$path"
put -O . "$tmp_marker" -o $marker_name
bye
LFTP
)"
  if printf "%s" "$out" | grep -q "Login failed\|530 "; then
    echo "AUTH FAIL"
    echo "$out" | sed 's/^/      /'
    echo ""
    echo "FTP authentication is failing — check the Keychain entry or env vars."
    exit 1
  elif printf "%s" "$out" | grep -qE "550|No such|Failed to change directory"; then
    echo "not writable (cd failed)"
  elif printf "%s" "$out" | grep -q "Transferred\|wrote "; then
    echo "uploaded"
  else
    # On success lftp may just be silent. Treat anything not matching the
    # error patterns above as a probable success.
    echo "uploaded (silent)"
  fi
done

unset FTP_PASSWORD

echo ""
echo "Probing $URL/$marker_name to see which path is served…"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"

body="$(curl -s --max-time 8 -A "$UA" -H "Accept: text/plain" "$URL/$marker_name" 2>/dev/null)"
if [ -z "$body" ]; then
  echo "  empty response — the marker may not be served, or it was placed"
  echo "  outside the doc root. Open $URL/$marker_name in a browser to check."
elif printf "%s" "$body" | head -c 200 | grep -q '^DOCROOT='; then
  served_from="$(printf "%s" "$body" | grep -oE 'DOCROOT=.*' | head -1 | cut -d= -f2)"
  echo "✓ doc root identified: $served_from"
  echo ""
  echo "Set this in scripts/deploy.sh as REMOTE_DIR, then 'pnpm deploy'."
else
  echo "  unexpected response body (first 200 bytes):"
  printf "%s" "$body" | head -c 200 | sed 's/^/      /'
  echo ""
  echo "  None of the candidate paths is the served doc root. Check the"
  echo "  name.am control panel → Domains → Document Root."
fi
