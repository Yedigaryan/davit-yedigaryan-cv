#!/usr/bin/env bash
# Quick post-deploy fingerprint check.
# Compares the static-build hash of out/ vs https://davit.yedigaryan.pro/.
# Pass --verbose to also list any chunk URL the live page references that
# returns non-200 from the origin.
# Deliberately NOT using `set -e` — many of the grep/head pipelines may
# legitimately produce no output, and that should be reported, not crash.
set -uo pipefail

URL="${URL:-https://davit.yedigaryan.pro}"
LOCAL_OUT="${LOCAL_OUT:-./out}"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
ACCEPT="text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"

verbose=0
[ "${1:-}" = "--verbose" ] && verbose=1

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"

if [ ! -d "$LOCAL_OUT" ]; then
  echo "check-deploy: $LOCAL_OUT not found — run 'pnpm build' first." >&2
  exit 1
fi

local_id="$(cat "$LOCAL_OUT/_next/BUILD_ID" 2>/dev/null || echo "")"
local_chunks_dir="$(ls -1d "$LOCAL_OUT/_next/static/"*/ 2>/dev/null | head -1 | xargs basename 2>/dev/null || echo "")"

echo "local build:"
echo "  BUILD_ID:        ${local_id:-(none)}"
echo "  static dir hash: ${local_chunks_dir:-(none)}"
echo ""

live_html="$(curl -s --max-time 8 -A "$UA" -H "Accept: $ACCEPT" "$URL/" || echo "")"
live_size="$(printf "%s" "$live_html" | wc -c | tr -d ' ')"
live_title="$(printf "%s" "$live_html" | grep -oE '<title>[^<]*</title>' | head -1 || true)"
# Anchor on /_next/static/ chunks specifically.
live_static="$(printf "%s" "$live_html" | grep -oE '/_next/static/[A-Za-z0-9_~-]+/_buildManifest\.js' | head -1 | sed -E 's|/_next/static/||;s|/_buildManifest\.js||')"

echo "live $URL:"
echo "  body size:       $live_size bytes"
echo "  title:           ${live_title:-(none)}"
echo "  static dir hash: ${live_static:-(none)}"
echo ""

if [ -n "$local_chunks_dir" ] && [ -n "$live_static" ]; then
  if [ "$local_chunks_dir" = "$live_static" ]; then
    echo "✓ static-dir hashes match — deploy is live."
  else
    echo "✗ static-dir hashes DIFFER:"
    echo "    local: $local_chunks_dir"
    echo "    live:  $live_static"
    echo "  → either the deploy hasn't propagated yet, or the live page is"
    echo "    serving from a different document root."
  fi
elif [ -z "$live_static" ]; then
  echo "⚠  Could not read a static-dir hash from the live page."
  echo "   Open $URL/ in a browser — the hash comparison is best-effort."
fi

if [ "$verbose" -eq 1 ]; then
  echo ""
  echo "checking every chunk the live page references…"
  miss=0; total=0
  while IFS= read -r c; do
    [ -z "$c" ] && continue
    total=$((total + 1))
    code="$(curl -s -o /dev/null -w "%{http_code}" -A "$UA" -H "Accept: */*" "$URL$c")"
    if [ "$code" != "200" ]; then
      miss=$((miss + 1))
      printf "  %s  %s\n" "$code" "$c"
    fi
  done < <(printf "%s" "$live_html" | grep -oE '/_next/static/chunks/[^"]+\.(js|css)' | sort -u)
  echo "  $total chunks referenced, $miss missing"
fi
