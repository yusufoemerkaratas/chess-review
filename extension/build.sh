#!/usr/bin/env bash
# Builds the browser extension into extension/dist/ (load that folder as an unpacked extension).
# Extension pages may not run inline scripts, so the app's inline <script> becomes app.js.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=extension/dist
[ "$(grep -c '^<script>$' index.html)" = 1 ] && [ "$(grep -c '^</script>$' index.html)" = 1 ] \
  || { echo "index.html must have exactly one inline <script> block on its own lines" >&2; exit 1; }
rm -rf "$OUT"; mkdir -p "$OUT"
cp -r vendor fonts icon.svg openings.json stockfish.js \
  stockfish-17.1-lite-single-03e3232.js stockfish-17.1-lite-single-03e3232.wasm "$OUT/"
cp -r extension/manifest.json extension/background.js extension/content.js extension/review.js extension/icons "$OUT/"
awk '/^<script>$/{f=1; next} /^<\/script>$/{f=0; next} f' index.html > "$OUT/app.js"
awk '/^<script>$/{f=1; print "<script src=\"app.js\"></script>"; print "<script src=\"review.js\"></script>"; next}
     /^<\/script>$/{f=0; next} !f' index.html > "$OUT/review.html"
echo "Built $OUT"
