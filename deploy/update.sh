#!/usr/bin/env bash
# deploy/update.sh — pull latest changes and restart
set -euo pipefail

INSTALL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE="docker compose -f $INSTALL_DIR/deploy/docker-compose.yml"

echo "▸ Pulling latest code..."
git -C "$INSTALL_DIR" pull

echo "▸ Rebuilding and restarting..."
$COMPOSE up -d --build

echo "✓ Claude Academy updated"
$COMPOSE ps
