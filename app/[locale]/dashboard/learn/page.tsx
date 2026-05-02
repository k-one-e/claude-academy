'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { CheckCircle, Lock, ChevronRight, Clock, Zap } from 'lucide-react'
import { cn, getLevelColor, getLevelBorder } from '@/lib/utils'

const CURRICULUM = [
  {
    level: 1,
    skills: [
      { num: 1, name: 'Collaborator, Not a Vending Machine', slug: 'skill-1-collaborator', estimatedMin: 8, complete: true, score: 88, locked: false },
      { num: 2, name: 'Context Is the Lever', slug: 'skill-2-context', estimatedMin: 10, complete: false, score: null, locked: false },
      { num: 3, name: 'The Iteration Loop', slug: 'skill-3-iteration', estimatedMin: 7, complete: false, score: null, locked: false },
    ],
  },
  {
    level: 2,
    skills: [
      { num: 4, name: 'Decompose Before You Ask', slug: 'skill-4-decompose', estimatedMin: 9, complete: false, score: null, locked: true },
      { num: 5, name: 'RCTCF Prompt Architecture', slug: 'skill-5-rctcf', estimatedMin: 12, complete: false, score: null, locked: true },
      { num: 6, name: 'Calibrate to Your Domain', slug: 'skill-6-calibrate', estimatedMin: 8, complete: false, score: null, locked: true },
    ],
  },
  {
    level: 3,
    skills: [
      { num: 7, name: 'Research Mode', slug: 'skill-7-research', estimatedMin: 10, complete: false, score: null, locked: true },
      { num: 8, name: 'Debugging as Dialogue', slug: 'skill-8-debugging', estimatedMin: 11, complete: false, score: null, locked: true },
      { num: 9, name: 'The Verification Habit', slug: 'skill-9-verification', estimatedMin: 8, complete: false, score: null, locked: true },
    ],
  },
  {
    level: 4,
    skills: [
      { num: 10, name: 'Personal Prompt Library', slug: 'skill-10-library', estimatedMin: 9, complete: false, score: null, locked: true },
      { num: 11, name: 'Know the Boundaries', slug: 'skill-11-boundaries', estimatedMin: 7, complete: false, score: null, locked: true },
      { num: 12, name: 'Teach to Multiply', slug: 'skill-12-teach', estimatedMin: 8, complete: false, score: null, locked: true },
    ],
  },
]

const LEVEL_NAMES = ['Foundational Mindset', 'Tactical Skills', 'Leverage Skills', 'Multiplier Mindset']
const LEVEL_TAGLINES = [
  'Think with Claude, not at it',
  'Repeatable structures for reliable results',
  'Do more with every session',
  'Build habits that compound',
]

export default function LearnPage() {
  const t = useTranslations('Lesson')

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Course Curriculum</h1>
        <p className="mt-1 text-muted-foreground text-sm">12 skills ordered by leverage — master the early ones and everything else accelerates.</p>
      </div>

      {CURRICULUM.map((group, gi) => (
        <motion.section
          key={group.level}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-bold', getLevelColor(group.level))}>
              Level {group.level}
            </div>
            <div>
              <span className="font-semibold text-foreground text-sm">{LEVEL_NAMES[gi]}</span>
              <span className="text-muted-foreground text-xs ms-2">— {LEVEL_TAGLINES[gi]}</span>
            </div>
          </div>

          <div className={cn('rounded-xl border-2 bg-background overflow-hidden', getLevelBorder(group.level))}>
            {group.skills.map((skill, si) => (
              <div key={skill.num}>
                {si > 0 && <div className="border-t border-border" />}
                <div className={cn(
                  'flex items-center gap-4 px-5 py-4 transition-colors',
                  skill.locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/50 cursor-pointer group'
                )}>
                  {/* Status icon */}
                  <div className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold', {
                    'bg-success text-white': skill.complete,
                    'bg-muted text-muted-foreground': skill.locked,
                    'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300': !skill.complete && !skill.locked,
                  })}>
                    {skill.complete ? <CheckCircle className="h-5 w-5" /> : skill.locked ? <Lock className="h-4 w-4" /> : skill.num}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{skill.name}</span>
                      {skill.complete && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                          <Zap className="h-3 w-3" /> {skill.score}/100
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{skill.estimatedMin} {t('estimated_time')}</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  {!skill.locked && (
                    <Link
                      href={`/dashboard/learn/level/${group.level}/skill/${skill.num}/lesson/${skill.slug}`}
                      className="flex-shrink-0"
                    >
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary-500 transition-colors" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  )
}
