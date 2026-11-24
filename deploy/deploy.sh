#!/usr/bin/env bash
# Copies the app to the home server and (re)starts it with Docker.
# Usage: deploy/deploy.sh [user@host]   (default: the Tailscale address of ubuntu-server)
set -euo pipefail
HOST="${1:-yusuf@100.122.73.118}"
KEY="$HOME/.ssh/ubuntu-server-ed25519"
DIR="chess-review"
cd "$(dirname "$0")/.."
SSH=(ssh -i "$KEY" -o UserKnownHostsFile="$HOME/.ssh/ubuntu-server-known-hosts" -o StrictHostKeyChecking=yes)

"${SSH[@]}" "$HOST" "mkdir -p ~/$DIR/site ~/$DIR/deploy"
rsync -az --delete -e "${SSH[*]}" \
  index.html sw.js manifest.webmanifest icon.svg openings.json stockfish.js \
  stockfish-17.1-lite-single-03e3232.js stockfish-17.1-lite-single-03e3232.wasm \
  vendor fonts "$HOST:~/$DIR/site/"
rsync -az -e "${SSH[*]}" deploy/docker-compose.yml "$HOST:~/$DIR/deploy/"
"${SSH[@]}" "$HOST" "cd ~/$DIR/deploy && docker compose up -d && docker compose ps"
echo "Ready: http://${HOST#*@}:8088"
