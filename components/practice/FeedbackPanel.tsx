'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Star, Zap } from 'lucide-react'
import { type ScoreResult } from '@/lib/scoring'
import { ScoreBreakdown } from './ScoreBreakdown'
import { getScoreColor, getScoreBg } from '@/lib/utils'

interface FeedbackPanelProps {
  result: ScoreResult
  xpReward?: number
}

const SCORE_THRESHOLDS = [
  { min: 90, label: 'Excellent!', emoji: '🏆', message: 'World-class prompt. You\'re thinking like a pro.' },
  { min: 75, label: 'Great!', emoji: '🌟', message: 'Strong, clear prompt. Keep refining your technique.' },
  { min: 60, label: 'Good', emoji: '👍', message: 'Good effort. A few more details would help Claude.' },
  { min: 40, label: 'Developing', emoji: '📝', message: 'You\'re learning! Try adding more context and structure.' },
  { min: 0, label: 'Needs Work', emoji: '🌱', message: 'Every expert started here. Read the hints and try again.' },
]

export function FeedbackPanel({ result, xpReward }: FeedbackPanelProps) {
  const t = useTranslations('Practice')
  const score = Math.min(100, result.total)
  const tier = SCORE_THRESHOLDS.find(t => score >= t.min) ?? SCORE_THRESHOLDS[SCORE_THRESHOLDS.length - 1]
  const earnedXP = xpReward ? Math.round(xpReward * (score / 100)) : 0

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* Score header */}
      <div className={`px-5 py-4 flex items-center gap-4 ${getScoreBg(score)}`}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background/80 shadow-sm flex-shrink-0">
          <span className={`text-2xl font-black ${getScoreColor(score)}`}>{score}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{tier.emoji}</span>
            <h3 className="font-bold text-foreground">{tier.label}</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{tier.message}</p>
        </div>
        {earnedXP > 0 && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <div className="flex items-center gap-1 rounded-full bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 px-3 py-1">
              <Zap className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">+{earnedXP} XP</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Score breakdown */}
        <ScoreBreakdown breakdown={result.breakdown} />

        {/* Feedback messages */}
        {result.feedback.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('feedback')}</h4>
            {result.feedback.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <TrendingUp className="h-3.5 w-3.5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>{msg}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {result.suggestions && result.suggestions.length > 0 && (
          <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Star className="h-3 w-3" /> {t('suggestions')}
            </h4>
            {result.suggestions.map((sug, i) => (
              <p key={i} className="text-xs text-foreground">&bull; {sug}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
