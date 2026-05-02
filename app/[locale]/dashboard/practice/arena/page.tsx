'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Clock, Star, Trophy, Zap } from 'lucide-react'
import { PromptEditor } from '@/components/practice/PromptEditor'

const DAILY_CHALLENGE = {
  id: 'daily-2026-05-01',
  title: 'The Context Champion',
  description: 'Today\'s challenge: take this vague prompt and transform it into a collaborator-style prompt using all 5 context pillars.',
  vaguePrompt: 'Help me write tests for my code.',
  difficulty: 'MEDIUM',
  xpReward: 75,
  timeLimit: 300,
  attempts: 1247,
  topScore: 118,
}

export default function ArenaPage() {
  const t = useTranslations('Practice')
  const [started, setStarted] = useState(false)

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('arena_title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('arena_desc')}</p>
      </div>

      {!started ? (
        <motion.div
          className="rounded-2xl border border-border bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/40 dark:to-orange-950/40 p-8 text-center"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-5xl mb-4">⚡</div>
          <h2 className="text-xl font-bold text-foreground mb-2">{DAILY_CHALLENGE.title}</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">{DAILY_CHALLENGE.description}</p>

          <div className="flex items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="font-medium text-foreground">+{DAILY_CHALLENGE.xpReward} XP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{Math.floor(DAILY_CHALLENGE.timeLimit / 60)} min limit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-violet-500" />
              <span>Top score: {DAILY_CHALLENGE.topScore}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>{DAILY_CHALLENGE.attempts.toLocaleString()} attempts</span>
            </div>
          </div>

          <div className="mb-8 text-start max-w-md mx-auto">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">{t('original_prompt')}</p>
            <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-4 py-3 font-mono text-sm text-foreground">
              &ldquo;{DAILY_CHALLENGE.vaguePrompt}&rdquo;
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="btn-primary gap-2 text-base px-8 py-3"
          >
            ⚡ {t('start_challenge')}
          </button>
        </motion.div>
      ) : (
        <PromptEditor
          challengeId={DAILY_CHALLENGE.id}
          challenge={{
            id: DAILY_CHALLENGE.id,
            title: DAILY_CHALLENGE.title,
            taskDescription: DAILY_CHALLENGE.description,
            vaguePrompt: DAILY_CHALLENGE.vaguePrompt,
            masterSolution: '',
            rubric: {},
            hints: ['Apply all 5 context pillars', 'Add your tech stack', 'Specify what kind of tests (unit, integration, e2e?)'],
          }}
          xpReward={DAILY_CHALLENGE.xpReward}
          timeLimit={DAILY_CHALLENGE.timeLimit}
        />
      )}
    </div>
  )
}
