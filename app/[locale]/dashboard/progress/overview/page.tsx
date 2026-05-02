'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { Flame, Zap, BookOpen, Trophy, Star, Lock } from 'lucide-react'

const RADAR_DATA = [
  { skill: 'Collaborator', score: 88, fullMark: 100 },
  { skill: 'Context', score: 40, fullMark: 100 },
  { skill: 'Iteration', score: 0, fullMark: 100 },
  { skill: 'Decompose', score: 0, fullMark: 100 },
  { skill: 'RCTCF', score: 0, fullMark: 100 },
  { skill: 'Calibrate', score: 0, fullMark: 100 },
  { skill: 'Research', score: 0, fullMark: 100 },
  { skill: 'Debug', score: 0, fullMark: 100 },
  { skill: 'Verify', score: 0, fullMark: 100 },
  { skill: 'Library', score: 0, fullMark: 100 },
  { skill: 'Limits', score: 0, fullMark: 100 },
  { skill: 'Teach', score: 0, fullMark: 100 },
]

const WEEKLY_ACTIVITY = [
  { day: 'Mon', xp: 120 },
  { day: 'Tue', xp: 80 },
  { day: 'Wed', xp: 200 },
  { day: 'Thu', xp: 60 },
  { day: 'Fri', xp: 150 },
  { day: 'Sat', xp: 220 },
  { day: 'Sun', xp: 90 },
]

const BADGES = [
  { name: 'First Steps', icon: '🎯', tier: 'BRONZE', earned: true, earnedAt: 'Apr 28' },
  { name: 'Persistent Learner', icon: '🔥', tier: 'BRONZE', earned: true, earnedAt: 'Apr 30' },
  { name: 'Prompt Architect', icon: '⚡', tier: 'SILVER', earned: false },
  { name: 'Problem Solver', icon: '🔬', tier: 'GOLD', earned: false },
  { name: 'Claude Expert', icon: '🚀', tier: 'PLATINUM', earned: false },
  { name: 'Hall of Fame', icon: '🏆', tier: 'PLATINUM', earned: false },
]

const STATS = [
  { icon: BookOpen, label: 'skills_complete', value: '1 / 12', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950' },
  { icon: Zap, label: 'total_xp', value: '1,240', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950' },
  { icon: Flame, label: 'best_streak', value: '7 days', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950' },
  { icon: Star, label: 'avg_score', value: '88', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950' },
]

const TIER_COLORS: Record<string, string> = {
  BRONZE: 'text-amber-700 bg-amber-50 border-amber-200',
  SILVER: 'text-slate-600 bg-slate-50 border-slate-200',
  GOLD: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  PLATINUM: 'text-indigo-600 bg-indigo-50 border-indigo-200',
}

export default function ProgressPage() {
  const t = useTranslations('Progress')

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your mastery across all 12 Claude skills</p>
      </div>

      {/* Stats row */}
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

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Radar Chart */}
        <motion.div
          className="rounded-xl border border-border bg-background p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-semibold text-foreground mb-4">{t('radar_title')}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Radar name="Score" dataKey="score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          className="rounded-xl border border-border bg-background p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="font-semibold text-foreground mb-4">{t('week_label')} XP</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={WEEKLY_ACTIVITY} barSize={24}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                cursor={{ fill: 'hsl(var(--muted))' }}
              />
              <Bar dataKey="xp" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div
        className="rounded-xl border border-border bg-background p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-semibold text-foreground mb-4">{t('badges_title')}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {BADGES.map((badge) => (
            <div
              key={badge.name}
              className={`flex flex-col items-center rounded-xl border p-3 text-center transition-opacity ${
                badge.earned ? '' : 'opacity-40'
              } ${badge.earned ? TIER_COLORS[badge.tier] : 'border-border bg-background'}`}
            >
              <div className={`text-3xl mb-2 ${!badge.earned ? 'grayscale' : ''}`}>
                {badge.earned ? badge.icon : <Lock className="h-6 w-6 mx-auto text-muted-foreground" />}
              </div>
              <p className="text-xs font-semibold text-foreground">{badge.name}</p>
              {badge.earned && badge.earnedAt && (
                <p className="text-xs text-muted-foreground mt-0.5">{badge.earnedAt}</p>
              )}
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold border ${TIER_COLORS[badge.tier]}`}>
                {badge.tier}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
