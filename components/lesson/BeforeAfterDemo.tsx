'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface BeforeAfterDemoProps {
  before: string
  after: string
}

export function BeforeAfterDemo({ before, after }: BeforeAfterDemoProps) {
  const t = useTranslations('Lesson')
  const [expanded, setExpanded] = useState<'before' | 'after' | null>('before')

  return (
    <div className="space-y-2">
      {/* Before */}
      <div className="rounded-xl overflow-hidden border border-red-200 dark:border-red-800">
        <button
          onClick={() => setExpanded(expanded === 'before' ? null : 'before')}
          className="w-full flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-950/40 text-start"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">❌</span>
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">{t('before_label')}</span>
          </div>
          {expanded === 'before' ? (
            <ChevronUp className="h-4 w-4 text-red-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-red-500 flex-shrink-0" />
          )}
        </button>
        <AnimatePresence initial={false}>
          {expanded === 'before' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <pre className="p-4 text-xs font-mono whitespace-pre-wrap text-foreground bg-red-50/50 dark:bg-red-950/20 leading-relaxed">
                {before}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* After */}
      <div className="rounded-xl overflow-hidden border border-emerald-200 dark:border-emerald-800">
        <button
          onClick={() => setExpanded(expanded === 'after' ? null : 'after')}
          className="w-full flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-950/40 text-start"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">✅</span>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{t('after_label')}</span>
          </div>
          {expanded === 'after' ? (
            <ChevronUp className="h-4 w-4 text-emerald-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-emerald-500 flex-shrink-0" />
          )}
        </button>
        <AnimatePresence initial={false}>
          {expanded === 'after' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <pre className="p-4 text-xs font-mono whitespace-pre-wrap text-foreground bg-emerald-50/50 dark:bg-emerald-950/20 leading-relaxed">
                {after}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
