'use client'

import { motion } from 'framer-motion'

interface StreakCounterProps {
  streak: number
  compact?: boolean
}

export function StreakCounter({ streak, compact = false }: StreakCounterProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <span className="flame text-base">🔥</span>
        <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{streak}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.span
        className="flame text-4xl"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        🔥
      </motion.span>
      <span className="text-2xl font-black text-orange-600 dark:text-orange-400 tabular-nums">{streak}</span>
      <span className="text-xs text-muted-foreground font-medium">day streak</span>
    </div>
  )
}
