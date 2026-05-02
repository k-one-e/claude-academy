#!/usr/bin/env bash
# deploy/setup.sh — one-command server setup for Claude Academy
# Usage: bash <(curl -fsSL https://raw.githubusercontent.com/k-one-e/claude-academy/main/deploy/setup.sh)
#    or: ./deploy/setup.sh (if you already cloned the repo)
set -euo pipefail

REPO="https://github.com/k-one-e/claude-academy.git"
INSTALL_DIR="${INSTALL_DIR:-$HOME/claude-academy}"
COMPOSE="docker compose -f $INSTALL_DIR/deploy/docker-compose.yml"

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()    { echo -e "${CYAN}▸ $*${NC}"; }
success() { echo -e "${GREEN}✓ $*${NC}"; }
warn()    { echo -e "${YELLOW}⚠ $*${NC}"; }
die()     { echo -e "${RED}✗ $*${NC}" >&2; exit 1; }

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════╗"
echo -e "║        Claude Academy Setup           ║"
echo -e "╚═══════════════════════════════════════╝${NC}"
echo ""

# ── 1. Check Docker ────────────────────────────────────────────────────────────
info "Checking Docker..."
if ! command -v docker &>/dev/null; then
  warn "Docker not found. Installing..."
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker "$USER"
  warn "Added $USER to docker group. You may need to log out and back in."
  # Use sudo for this session
  DOCKER_CMD="sudo docker"
else
  DOCKER_CMD="docker"
fi

if ! $DOCKER_CMD compose version &>/dev/null 2>&1; then
  die "Docker Compose v2 not found. Install Docker Desktop or 'sudo apt install docker-compose-plugin'."
fi
success "Docker ready"

# ── 2. Clone or update repo ────────────────────────────────────────────────────
info "Setting up repo at $INSTALL_DIR..."
if [ -d "$INSTALL_DIR/.git" ]; then
  warn "Repo already exists — pulling latest changes..."
  git -C "$INSTALL_DIR" pull
else
  git clone "$REPO" "$INSTALL_DIR"
fi
success "Repo ready"

# ── 3. Configure environment ───────────────────────────────────────────────────
ENV_FILE="$INSTALL_DIR/.env.local"
if [ ! -f "$ENV_FILE" ]; then
  cp "$INSTALL_DIR/.env.example" "$ENV_FILE"
  info "Generating secrets..."
  SECRET=$(openssl rand -base64 32)
  DB_PASS=$(openssl rand -hex 16)
  sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$SECRET\"|" "$ENV_FILE"
  sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://postgres:$DB_PASS@db:5432/claude_academy\"|" "$ENV_FILE"
  echo "" >> "$ENV_FILE"
  echo "# Internal DB password used by docker-compose" >> "$ENV_FILE"
  echo "DB_PASSWORD=$DB_PASS" >> "$ENV_FILE"

  # Prompt for required values
  echo ""
  echo -e "${YELLOW}A few required settings:${NC}"
  read -rp "  Public URL (e.g. https://yourdomain.com or http://YOUR_SERVER_IP:3000): " APP_URL
  sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=\"$APP_URL\"|" "$ENV_FILE"

  echo ""
  echo -e "${YELLOW}OAuth providers (press Enter to skip and use email/password only):${NC}"
  read -rp "  GitHub Client ID: " GH_ID
  read -rp "  GitHub Client Secret: " GH_SECRET
  read -rp "  Google Client ID: " GG_ID
  read -rp "  Google Client Secret: " GG_SECRET
  [ -n "$GH_ID" ]     && sed -i "s|GITHUB_CLIENT_ID=.*|GITHUB_CLIENT_ID=\"$GH_ID\"|" "$ENV_FILE"
  [ -n "$GH_SECRET" ] && sed -i "s|GITHUB_CLIENT_SECRET=.*|GITHUB_CLIENT_SECRET=\"$GH_SECRET\"|" "$ENV_FILE"
  [ -n "$GG_ID" ]     && sed -i "s|GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=\"$GG_ID\"|" "$ENV_FILE"
  [ -n "$GG_SECRET" ] && sed -i "s|GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=\"$GG_SECRET\"|" "$ENV_FILE"

  success "Environment configured"
else
  warn ".env.local already exists — skipping configuration"
fi

# ── 4. Build & start ───────────────────────────────────────────────────────────
info "Building and starting services (this takes a few minutes on first run)..."
cd "$INSTALL_DIR"
$DOCKER_CMD compose -f deploy/docker-compose.yml pull --ignore-pull-failures 2>/dev/null || true
$DOCKER_CMD compose -f deploy/docker-compose.yml up -d --build

# ── 5. Wait for app to be healthy ─────────────────────────────────────────────
info "Waiting for app to be ready..."
for i in $(seq 1 30); do
  if $DOCKER_CMD compose -f deploy/docker-compose.yml ps app | grep -q "healthy\|running"; then
    break
  fi
  sleep 3
done

# ── 6. Done ────────────────────────────────────────────────────────────────────
APP_URL=$(grep NEXTAUTH_URL "$ENV_FILE" | cut -d'"' -f2)
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗"
echo -e "║     Claude Academy is running! 🚀     ║"
echo -e "╚═══════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${CYAN}App:${NC}      $APP_URL"
echo -e "  ${CYAN}Logs:${NC}     docker compose -f $INSTALL_DIR/deploy/docker-compose.yml logs -f app"
echo -e "  ${CYAN}Stop:${NC}     docker compose -f $INSTALL_DIR/deploy/docker-compose.yml down"
echo -e "  ${CYAN}Update:${NC}   $INSTALL_DIR/deploy/update.sh"
echo ""
