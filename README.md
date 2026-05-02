# Claude Academy

> Learn to master Claude prompting through a structured, interactive curriculum — 12 skills, real-time scoring, gamified progress, and full bilingual (English / Persian) support.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?logo=prisma)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What is Claude Academy?

Most people use Claude like a search engine — one-line questions, vague requests, disappointing results. Claude Academy fixes that.

You work through 12 skills across 4 levels, writing real prompts, getting instant scored feedback, and building muscle memory for the **RCTCF framework**:

| | Element | What it adds |
|---|---|---|
| **R** | Role | Who Claude should be |
| **C** | Context | Background and constraints |
| **T** | Task | Exactly what you need |
| **C** | Constraints | Limits, tone, scope |
| **F** | Format | How to structure the output |

---

## Features

- Real-time prompt scoring across 5 dimensions (completeness, clarity, context, structure, efficiency)
- Live RCTCF checklist as you type
- Before/after prompt comparisons in every lesson
- Daily timed challenge arena with XP rewards
- Personal prompt library — save, tag, reuse
- Streaks, badges, XP — full gamification loop
- English + Persian (RTL) — switch at any time
- Email / password auth
- Dark / light mode

---

## Quick Deploy (Docker — any Linux server)

One command. Installs Docker if needed, configures secrets, builds and starts everything:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/k-one-e/claude-academy/main/deploy/setup.sh)
```

The script will:
1. Install Docker if not present
2. Clone the repo
3. Auto-generate `NEXTAUTH_SECRET` and a database password
4. Ask for your public URL
5. Build the image and start PostgreSQL + app

**To update later:**
```bash
~/claude-academy/deploy/update.sh
```

**To stop:**
```bash
docker compose -f ~/claude-academy/deploy/docker-compose.yml down
```

---

## Local Development

**Prerequisites:** Node.js 20+, PostgreSQL

```bash
git clone https://github.com/k-one-e/claude-academy.git
cd claude-academy
./start.sh
```

Open [http://localhost:3000](http://localhost:3000).

`start.sh` handles everything — `npm install`, Prisma client generation, schema push, and `npm run dev`. On first run it copies `.env.example` → `.env.local`.

**Minimum `.env.local` for local dev:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/claude_academy"
NEXTAUTH_SECRET="any-random-string"
NEXTAUTH_URL="http://localhost:3000"
```

See `.env.example` for all options.

---

## Manual Server Setup (Docker Compose)

If you prefer to configure things yourself:

```bash
git clone https://github.com/k-one-e/claude-academy.git
cd claude-academy
cp .env.example .env.local

# Generate a secure NEXTAUTH_SECRET:
openssl rand -base64 32

# Edit .env.local, then:
DB_PASSWORD=yourpassword docker compose -f deploy/docker-compose.yml up -d
```

Stack: **PostgreSQL** → **migration** (runs once) → **app** on port 3000.

---

## Kubernetes / k3s

```bash
# 1. Build the image directly on the k3s node (no registry needed)
sudo docker build -t kay1e/claude-academy:latest .
sudo docker save kay1e/claude-academy:latest | sudo k3s ctr images import -

# 2. Fill in deploy/k8s/secret.yaml (never commit filled values)
#    Make sure AUTH_TRUST_HOST="true" is set (required behind Traefik)

# 3. Apply manifests — replace yourdomain.com inline:
kubectl apply -f deploy/k8s/namespace.yaml
kubectl apply -f deploy/k8s/secret.yaml
kubectl apply -f deploy/k8s/postgres.yaml
sed 's/yourdomain.com/your.actual.domain/g' deploy/k8s/app.yaml | kubectl apply -f -

# 4. Verify
kubectl get pods,ingress,certificate -n claude-academy
```

k3s uses its own containerd image store — `docker push` is not needed; import directly with `k3s ctr images import`.

Traefik ingress and cert-manager TLS work out of the box on k3s.

**Zero-downtime update (build on node):**
```bash
sudo docker build -t kay1e/claude-academy:latest .
sudo docker save kay1e/claude-academy:latest | sudo k3s ctr images import -
kubectl rollout restart deployment/claude-academy -n claude-academy
```

---

## Project Structure

```
claude-academy/
├── app/
│   ├── [locale]/               # All pages (EN + FA routing)
│   │   ├── page.tsx            # Landing page
│   │   ├── auth/               # Login + register
│   │   └── dashboard/          # Learn, practice, library, progress, settings
│   └── api/                    # REST endpoints
├── components/
│   ├── layout/                 # Sidebar, Navbar, LanguageSwitcher, ThemeToggle
│   ├── lesson/                 # ProgressRing, BeforeAfterDemo
│   ├── practice/               # PromptEditor, FeedbackPanel, ScoreBreakdown
│   └── gamification/           # StreakCounter
├── content/                    # Lesson metadata + challenge definitions (JSON)
├── lib/                        # auth, db, i18n, scoring, utils
├── messages/                   # en.json + fa.json
├── prisma/schema.prisma        # Database schema
├── deploy/
│   ├── setup.sh                # One-command server deployment
│   ├── update.sh               # Pull + rebuild + restart
│   ├── docker-compose.yml      # Full stack (db + migrate + app)
│   └── k8s/                    # Kubernetes / k3s manifests
│       ├── namespace.yaml
│       ├── secret.yaml         # Fill before applying — gitignored
│       ├── postgres.yaml
│       └── app.yaml            # Deployment + Traefik ingress
├── Dockerfile                  # Multi-stage production build
├── .dockerignore
├── start.sh                    # Local dev quick-start
└── .env.example                # All environment variables documented
```

---

## Curriculum

| Level | Name | Skills |
|---|---|---|
| 1 | Beginner | Claude as Collaborator, Context & Clarity |
| 2 | Apprentice | Iterative Refinement, Task Decomposition, RCTCF Mastery, Output Calibration |
| 3 | Practitioner | Research & Synthesis, Code & Debug, Fact Verification, Prompt Library |
| 4 | Expert | Understanding Limits, Teaching Others |

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 + Framer Motion |
| i18n | next-intl — EN + FA with RTL |
| Auth | NextAuth.js v5 (email / password) |
| Database | PostgreSQL via Prisma ORM |
| Charts | Recharts |
| Deployment | Docker, Docker Compose, Kubernetes / k3s |

---

## License

MIT
