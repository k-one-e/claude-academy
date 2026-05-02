'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Lightbulb, BookmarkPlus, RotateCcw, CheckCircle, Circle } from 'lucide-react'
import { scorePrompt, checkRCTCF, type ScoreResult } from '@/lib/scoring'
import { FeedbackPanel } from './FeedbackPanel'
import { cn } from '@/lib/utils'

interface Challenge {
  id: string
  title?: string
  taskDescription?: string
  vaguePrompt?: string
  masterSolution?: string
  rubric?: Record<string, string>
  hints?: string[]
}

interface PromptEditorProps {
  challengeId: string
  challenge?: Challenge
  compact?: boolean
  freeMode?: boolean
  xpReward?: number
  timeLimit?: number
}

export function PromptEditor({ challengeId, challenge, compact = false, freeMode = false, xpReward, timeLimit }: PromptEditorProps) {
  const t = useTranslations('Practice')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [hintIndex, setHintIndex] = useState(-1)
  const [saved, setSaved] = useState(false)
  const [showMaster, setShowMaster] = useState(false)

  const rctcf = checkRCTCF(prompt)
  const allChecked = Object.values(rctcf).every(Boolean)

  const handleSubmit = useCallback(() => {
    if (!prompt.trim()) return
    const scored = scorePrompt(prompt, { id: challengeId, rubric: challenge?.rubric ?? {} })
    setResult(scored)
  }, [prompt, challengeId, challenge])

  const handleHint = () => {
    const hints = challenge?.hints ?? []
    if (hintIndex < hints.length - 1) {
      setHintIndex((prev) => prev + 1)
    }
  }

  const handleReset = () => {
    setPrompt('')
    setResult(null)
    setHintIndex(-1)
    setSaved(false)
    setShowMaster(false)
  }

  const handleSave = () => {
    setSaved(true)
    // In production: POST /api/library
  }

  return (
    <div className={cn('space-y-3', compact ? '' : 'min-h-[500px]')}>
      {/* Task description */}
      {challenge?.taskDescription && !freeMode && (
        <div className="rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-950/30 p-4">
          <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-1">{t('challenge_task')}</p>
          <p className="text-sm text-foreground">{challenge.taskDescription}</p>
          {challenge.vaguePrompt && (
            <div className="mt-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-3 py-2">
              <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-0.5">{t('original_prompt')}</p>
              <p className="text-xs font-mono text-foreground">&ldquo;{challenge.vaguePrompt}&rdquo;</p>
            </div>
          )}
        </div>
      )}

      <div className={cn('grid gap-4', result && !compact ? 'lg:grid-cols-2' : '')}>
        {/* Editor */}
        <div className="space-y-3">
          {/* RCTCF Checklist */}
          <div className={cn(
            'rounded-xl border p-3 transition-colors',
            allChecked ? 'border-success bg-success/5' : 'border-border bg-background'
          )}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-foreground">{t('rctcf_title')}</p>
              {allChecked && <span className="text-xs font-semibold text-success flex items-center gap-1"><CheckCircle className="h-3 w-3" /> All done!</span>}
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
              {(Object.entries(rctcf) as [keyof typeof rctcf, boolean][]).map(([key, checked]) => (
                <div key={key} className={cn('flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors', checked ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                  {checked ? <CheckCircle className="h-3 w-3 flex-shrink-0" /> : <Circle className="h-3 w-3 flex-shrink-0" />}
                  <span className="capitalize font-medium">{t(`rctcf_${key}` as Parameters<typeof t>[0])}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hint */}
          {hintIndex >= 0 && challenge?.hints?.[hintIndex] && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-3 py-2"
            >
              <Lightbulb className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">{challenge.hints[hintIndex]}</p>
            </motion.div>
          )}

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('editor_placeholder')}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-mono placeholder:text-muted-foreground focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
              rows={compact ? 6 : 10}
            />
            <div className="absolute bottom-2 end-3 text-xs text-muted-foreground">
              {prompt.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="btn-primary gap-2 text-sm flex-1 sm:flex-none justify-center"
            >
              <Send className="h-3.5 w-3.5" /> {t('submit')}
            </button>

            {!freeMode && challenge?.hints && challenge.hints.length > 0 && hintIndex < challenge.hints.length - 1 && (
              <button onClick={handleHint} className="btn-secondary gap-1 text-xs text-muted-foreground">
                <Lightbulb className="h-3.5 w-3.5" /> {t('hint')} <span className="text-error text-xs">{t('hint_cost')}</span>
              </button>
            )}

            {result && (
              <>
                <button onClick={handleReset} className="btn-secondary gap-1.5 text-xs">
                  <RotateCcw className="h-3.5 w-3.5" /> {t('try_again')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={cn('btn-secondary gap-1.5 text-xs', saved && 'text-success border-success')}
                >
                  <BookmarkPlus className="h-3.5 w-3.5" />
                  {saved ? 'Saved!' : t('save_prompt')}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Feedback panel */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <FeedbackPanel result={result} xpReward={xpReward} />

              {/* Master solution */}
              {challenge?.masterSolution && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowMaster(!showMaster)}
                    className="text-xs text-primary-500 hover:underline"
                  >
                    {showMaster ? '▲' : '▼'} {t('compare_master')}
                  </button>
                  <AnimatePresence>
                    {showMaster && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden mt-2"
                      >
                        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Master Solution</p>
                          <pre className="text-xs font-mono whitespace-pre-wrap text-foreground">{challenge.masterSolution}</pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
