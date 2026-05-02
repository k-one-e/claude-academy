'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Globe, Trophy, ChevronDown, BookOpen, Target, BarChart3, CheckCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

const LEVELS = [
  { num: 1, skills: ['Collaborator Mindset', 'Context Power', 'Iteration Loop'], icon: '🧠' },
  { num: 2, skills: ['Decomposition', 'RCTCF Framework', 'Calibration'], icon: '⚡' },
  { num: 3, skills: ['Research First', 'Structured Debugging', 'Verification'], icon: '🔬' },
  { num: 4, skills: ['Prompt Library', 'Know Limitations', 'Teach Others'], icon: '🚀' },
]

const LEVEL_COLORS = ['badge-level-1', 'badge-level-2', 'badge-level-3', 'badge-level-4']

const STATS = [
  { value: '2,400+', key: 'stats_learners' },
  { value: '60+', key: 'stats_challenges' },
  { value: '3×', key: 'stats_avg_score' },
]

export default function LandingPage() {
  const t = useTranslations('Landing')
  const tNav = useTranslations('Nav')

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-sm">CA</div>
            <span className="font-bold text-foreground">Claude Academy</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#curriculum" className="hover:text-foreground transition-colors">{t('curriculum_title')}</a>
            <a href="#how" className="hover:text-foreground transition-colors">{t('how_title')}</a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/login" className="btn-secondary text-sm hidden sm:inline-flex">
              {tNav('login')}
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm">
              {tNav('register')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 dark:opacity-10" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-4 py-1.5 text-xs font-semibold text-primary-700 dark:border-primary-900 dark:bg-primary-950 dark:text-primary-300">
              ✦ {t('hero_badge')}
            </span>

            <h1 className="mt-4 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {t('hero_title')}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {t('hero_subtitle')}
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/register" className="btn-primary gap-2 text-base px-7 py-3">
                {t('cta_start')} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#curriculum" className="btn-secondary gap-2 text-base px-7 py-3">
                {t('cta_curriculum')}
              </a>
            </div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
              {STATS.map((s) => (
                <div key={s.key} className="text-center">
                  <div className="text-3xl font-bold text-primary-500">{s.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{t(s.key as keyof typeof t)}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center">
          <a href="#features" className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {t('scroll_hint')}
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950', titleKey: 'feature_1_title', descKey: 'feature_1_desc' },
              { icon: Globe, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950', titleKey: 'feature_2_title', descKey: 'feature_2_desc' },
              { icon: Trophy, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950', titleKey: 'feature_3_title', descKey: 'feature_3_desc' },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-border bg-background p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`mb-4 inline-flex rounded-lg p-2.5 ${f.color}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">{t(f.titleKey as keyof typeof t)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(f.descKey as keyof typeof t)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="py-20 bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t('curriculum_title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t('curriculum_subtitle')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEVELS.map((level, i) => (
              <motion.div
                key={level.num}
                className={`rounded-xl border-2 bg-background p-5 ${LEVEL_COLORS[i].replace('badge-level', 'border-l-4 border-level')}`}
                style={{ borderLeftColor: ['#10B981','#3B82F6','#8B5CF6','#F59E0B'][i] }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-2xl mb-2">{level.icon}</div>
                <div className="text-xs font-semibold text-muted-foreground mb-1">LEVEL {level.num}</div>
                <h3 className="font-bold text-foreground mb-3">{t(`level_${level.num}_name` as keyof typeof t)}</h3>
                <p className="text-xs text-muted-foreground mb-4">{t(`level_${level.num}_desc` as keyof typeof t)}</p>
                <ul className="space-y-1">
                  {level.skills.map((s) => (
                    <li key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 flex-shrink-0 text-primary-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t('how_title')}</h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: Target, step: 1, titleKey: 'how_1_title', descKey: 'how_1_desc', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
              { icon: BookOpen, step: 2, titleKey: 'how_2_title', descKey: 'how_2_desc', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
              { icon: BarChart3, step: 3, titleKey: 'how_3_title', descKey: 'how_3_desc', color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="mb-1 text-xs font-bold text-muted-foreground">STEP {step.step}</div>
                <h3 className="font-semibold text-foreground">{t(step.titleKey as keyof typeof t)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(step.descKey as keyof typeof t)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-indigo-700">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{t('hero_title')}</h2>
          <p className="mt-4 text-indigo-100">{t('hero_subtitle')}</p>
          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg hover:bg-indigo-50 transition-colors"
          >
            {t('cta_start')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-500 text-white font-bold text-xs">CA</div>
            <span className="text-sm font-semibold text-foreground">Claude Academy</span>
          </div>
          <p className="text-xs text-muted-foreground">{t('footer_tagline')}</p>
          <p className="text-xs text-muted-foreground">© 2026 Claude Academy. {t('footer_rights')}</p>
        </div>
      </footer>
    </div>
  )
}
