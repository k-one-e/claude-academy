#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# Check .env.local exists
if [ ! -f .env.local ]; then
  if [ -f .env.example ]; then
    cp .env.example .env.local
    echo "⚠️  Created .env.local from .env.example — fill in your secrets before running in production."
  else
    echo "❌ Missing .env.local. Create it with DATABASE_URL, NEXTAUTH_SECRET, etc."
    exit 1
  fi
fi

# Install dependencies if node_modules is missing
if [ ! -d node_modules ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Generate Prisma client if needed
if [ ! -d node_modules/.prisma/client ]; then
  echo "🔧 Generating Prisma client..."
  npx prisma generate
fi

# Push schema to DB (safe for dev — skips if already up to date)
echo "🗄️  Syncing database schema..."
npx prisma db push --skip-generate 2>/dev/null || echo "⚠️  DB push failed — check DATABASE_URL in .env.local"

echo ""
echo "🚀 Starting Claude Academy..."
echo "   http://localhost:3000"
echo ""

npm run dev
