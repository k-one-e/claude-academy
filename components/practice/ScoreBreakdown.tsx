'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { getScoreColor } from '@/lib/utils'

interface Breakdown {
  completeness: number
  clarity: number
  context: number
  structure: number
  efficiency: number
}

interface ScoreBreakdownProps {
  breakdown: Breakdown
}

const DIMENSION_CONFIG = [
  { key: 'completeness', label: 'Completeness', description: 'Does it include all needed details?' },
  { key: 'clarity', label: 'Clarity', description: 'Is it easy for Claude to understand?' },
  { key: 'context', label: 'Context', description: 'Is enough background provided?' },
  { key: 'structure', label: 'Structure', description: 'Is it logically organized?' },
  { key: 'efficiency', label: 'Efficiency', description: 'Is it concise without losing meaning?' },
] as const

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Breakdown</h4>
      {DIMENSION_CONFIG.map((dim, i) => {
        const score = breakdown[dim.key]
        return (
          <div key={dim.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">{dim.label}</span>
              <span className={`text-xs font-bold tabular-nums ${getScoreColor(score)}`}>{score}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: score >= 80 ? '#10B981' : score >= 60 ? '#6366F1' : score >= 40 ? '#F59E0B' : '#EF4444' }}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
