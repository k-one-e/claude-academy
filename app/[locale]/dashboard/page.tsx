'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { ArrowRight, Flame, Zap, BookOpen, Trophy, ChevronRight, Star, Lock } from 'lucide-react'
import { StreakCounter } from '@/components/gamification/StreakCounter'
import { ProgressRing } from '@/components/lesson/ProgressRing'

const MOCK_PROGRESS = {
  name: 'Alex',
  streak: 7,
  xp: 1240,
  lessonsComplete: 5,
  rank: 143,
  currentSkill: 2,
  currentLevel: 1,
  levelProgress: 42,
  nextLesson: { title: 'Context Is the Lever', slug: 'skill-2-context', level: 1, skill: 2, estimatedMin: 8 },
  recentBadges: [
    { name: 'First Steps', icon: '🎯', tier: 'BRONZE' },
    { name: 'Persistent Learner', icon: '🔥', tier: 'BRONZE' },
  ],
  skills: [
    { num: 1, name: 'Collaborator Mindset', complete: true, score: 88, level: 1 },
    { num: 2, name: 'Context Power', complete: false, score: null, level: 1 },
    { num: 3, name: 'Iteration Loop', complete: false, score: null, level: 1 },
    { num: 4, name: 'Decomposition', complete: false, score: null, level: 2, locked: true },
  ],
}

const STATS = [
  { icon: Flame, label: 'streak_label', value: `${MOCK_PROGRESS.streak}`, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950' },
  { icon: Zap, label: 'xp_label', value: MOCK_PROGRESS.xp.toLocaleString(), color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950' },
  { icon: BookOpen, label: 'lessons_done', value: `${MOCK_PROGRESS.lessonsComplete}`, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950' },
  { icon: Trophy, label: 'rank_label', value: `#${MOCK_PROGRESS.rank}`, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950' },
]

export default function DashboardPage() {
  const t = useTranslations('Dashboard')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('greeting_morning') : hour < 18 ? t('greeting_afternoon') : t('greeting_evening')

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{greeting},</p>
          <h1 className="text-2xl font-bold text-foreground">{MOCK_PROGRESS.name} 👋</h1>
        </div>
        <StreakCounter streak={MOCK_PROGRESS.streak} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="rounded-xl border border-border bg-background p-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className={`mb-2 inline-flex rounded-lg p-2 ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="text-xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{t(stat.label as Parameters<typeof t>[0])}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Continue Learning — large card */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="rounded-xl border border-border bg-gradient-to-br from-primary-50 to-indigo-50/50 dark:from-primary-950/40 dark:to-indigo-950/40 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="badge-level-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold">
                    Level {MOCK_PROGRESS.currentLevel}
                  </span>
                  <span className="text-xs text-muted-foreground">Skill {MOCK_PROGRESS.currentSkill}/12</span>
                </div>
                <h2 className="text-lg font-bold text-foreground">{t('continue_learning')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{MOCK_PROGRESS.nextLesson.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{MOCK_PROGRESS.nextLesson.estimatedMin} min read</p>

                <div className="mt-4 mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Level 1 progress</span>
                    <span>{MOCK_PROGRESS.levelProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-primary-100 dark:bg-primary-900">
                    <div
                      className="h-2 rounded-full bg-primary-500 transition-all duration-700"
                      style={{ width: `${MOCK_PROGRESS.levelProgress}%` }}
                    />
                  </div>
                </div>

                <Link
                  href={`/dashboard/learn/level/1/skill/2/lesson/${MOCK_PROGRESS.nextLesson.slug}`}
                  className="btn-primary mt-2 gap-2 text-sm px-5 py-2 inline-flex"
                >
                  {t('resume')} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <ProgressRing progress={MOCK_PROGRESS.levelProgress} size={80} strokeWidth={6} />
            </div>
          </div>
        </motion.div>

        {/* Daily Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="h-full rounded-xl border border-border bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/40 dark:to-orange-950/40 p-5 flex flex-col justify-between">
            <div>
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900 text-lg">⚡</div>
              <h3 className="font-semibold text-foreground">{t('daily_challenge')}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t('daily_challenge_desc')}</p>
              <div className="mt-3 flex items-center gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-xs text-muted-foreground ms-1">+75 XP</span>
              </div>
            </div>
            <Link
              href="/dashboard/practice/arena"
              className="mt-4 btn-primary gap-2 text-sm py-2 justify-center"
            >
              {t('start_challenge')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Skill list */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="rounded-xl border border-border bg-background p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{t('your_progress')}</h3>
              <Link href="/dashboard/learn" className="text-xs text-primary-500 hover:underline flex items-center gap-1">
                {t('view_all')} <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {MOCK_PROGRESS.skills.map((skill) => (
                <div
                  key={skill.num}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                    skill.locked
                      ? 'border-border opacity-50 cursor-not-allowed'
                      : 'border-border hover:border-primary-200 hover:bg-primary-50/50 dark:hover:bg-primary-950/30 cursor-pointer'
                  }`}
                >
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    skill.complete ? 'bg-success text-white' : skill.locked ? 'bg-muted text-muted-foreground' : 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  }`}>
                    {skill.locked ? <Lock className="h-3.5 w-3.5" /> : skill.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{skill.name}</p>
                    <p className="text-xs text-muted-foreground">Skill {skill.num} · Level {skill.level}</p>
                  </div>
                  {skill.complete && skill.score && (
                    <span className="text-xs font-semibold text-success">{skill.score}/100</span>
                  )}
                  {!skill.complete && !skill.locked && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="rounded-xl border border-border bg-background p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{t('recent_badges')}</h3>
              <Link href="/dashboard/progress/overview" className="text-xs text-primary-500 hover:underline">
                {t('view_all')}
              </Link>
            </div>
            <div className="space-y-3">
              {MOCK_PROGRESS.recentBadges.map((badge) => (
                <div key={badge.name} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950 text-xl">
                    {badge.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{badge.name}</p>
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{badge.tier}</span>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3 opacity-50">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-muted text-lg">
                  🔒
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Prompt Architect</p>
                  <p className="text-xs text-muted-foreground">Complete Level 2</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
