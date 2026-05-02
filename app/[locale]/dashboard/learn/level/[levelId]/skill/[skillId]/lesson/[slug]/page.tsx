'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Clock, CheckCircle, BookOpen, AlertTriangle, Lightbulb } from 'lucide-react'
import { BeforeAfterDemo } from '@/components/lesson/BeforeAfterDemo'
import { PromptEditor } from '@/components/practice/PromptEditor'
import { cn, getLevelColor } from '@/lib/utils'

const LESSONS: Record<string, {
  skill: number; level: number; title: string; estimatedMin: number;
  concept: string; beforePrompt: string; afterPrompt: string;
  pillars: string[]; commonMistake: string; quickPractice: string; teachersNote: string;
  keyTakeaways: string[];
}> = {
  'skill-1-collaborator': {
    skill: 1, level: 1, title: 'Claude Is a Collaborator, Not a Vending Machine',
    estimatedMin: 8,
    concept: `Most beginners approach Claude with a vending-machine mindset: insert question → receive answer → done. This produces mediocre results. The expert mindset treats Claude as a brilliant colleague you are thinking *with* — someone who improves when you share more, push back, and iterate.\n\nThe difference isn't about longer prompts. It's about dialogue. A first response is a starting point, not an ending point.`,
    beforePrompt: `User: "Write me a README for my project."\nClaude: [Generic README template]\nUser: "Thanks." ← Conversation ends. Result is mediocre.`,
    afterPrompt: `User: "I'm building a Python CLI tool for syncing configs across servers. My audience is DevOps engineers. The tool uses SSH and YAML config files. Help me structure a compelling README — what sections should I prioritize and why?"\nClaude: [Structured outline with reasoning]\nUser: "Good. The Quick Start section needs to be simpler — assume no prior knowledge."\nClaude: [Refined version] → Result is professional quality.`,
    pillars: [],
    commonMistake: 'Students accept the first response even when it\'s 60% of what they need. A first response is a starting point — not a final answer.',
    quickPractice: 'Take this prompt: "Explain REST APIs." Rewrite it as if briefing a knowledgeable colleague who needs full context. Add: your role, your background, the specific gap you want filled, and why.',
    teachersNote: 'Run a live demo. Show the same task with a bad prompt and a good prompt side by side. Make the difference visible and immediate — not a theoretical argument.',
    keyTakeaways: [
      'Think of Claude as a colleague you\'re thinking *with*, not a search engine',
      'First responses are starting points — dialogue and refinement produce results',
      'Sharing context and pushing back improves Claude\'s answers dramatically',
      'The vending-machine mindset is the #1 mistake beginners make',
    ],
  },
  'skill-2-context': {
    skill: 2, level: 1, title: 'Context Is the Lever That Moves Everything',
    estimatedMin: 10,
    concept: `Claude's output quality is almost entirely a function of context. Context is not just "more words" — it is the *right information* that eliminates wrong assumptions and lets Claude build on what is actually true about your situation.\n\nWithout context, Claude must guess. With context, Claude reasons from facts. These produce radically different outputs.`,
    beforePrompt: `"How do I make my website faster?"\n\n← Claude must guess: What type of site? What stack? What's slow? What does "faster" mean to you? Result: generic checklist.`,
    afterPrompt: `"I have a Next.js 14 e-commerce site hosted on Vercel, using PostgreSQL via Prisma. Mobile page load is 4.2s (Lighthouse score: 52). The bottleneck is large product images and unoptimized DB queries. I've added basic indexes already. My constraint: can't change the hosting plan. Target: LCP < 2.5s. What is the highest-ROI sequence of fixes to try first?"\n\n← Claude gives a ranked, specific action plan.`,
    pillars: ['Who you are — role, expertise level, domain', 'What you\'re building — project, purpose, target audience', 'What you\'ve tried — approaches attempted, what failed', 'Constraints — language, framework, performance needs, style', 'Success criteria — what "done" looks like'],
    commonMistake: 'Students think giving context is "too much" or that Claude will be overwhelmed. The opposite is true: Claude performs significantly better with specific context, never worse.',
    quickPractice: 'Upgrade this prompt using all 5 pillars: "Help me write a cover letter." Fill in who you are, what role you\'re applying for, what you\'ve tried, your constraints, and what great looks like.',
    teachersNote: 'The 5-pillar exercise is powerful in class. Give students a vague prompt and ask them to fill in all five pillars before writing. This habit alone doubles response quality.',
    keyTakeaways: [
      'More context = exponentially better answers (this is THE lever)',
      'The 5 pillars: who you are, what you\'re building, what you tried, constraints, success criteria',
      'Claude performs better with specific context — never worse',
      'Context eliminates wrong assumptions before they cause wasted effort',
    ],
  },
}

type Params = { levelId: string; skillId: string; slug: string }

export default function LessonPage({ params }: { params: Params }) {
  const { levelId, skillId, slug } = params
  const t = useTranslations('Lesson')
  const [completed, setCompleted] = useState(false)

  const lesson = LESSONS[slug] ?? LESSONS['skill-1-collaborator']
  const levelColor = getLevelColor(lesson.level)

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Link href="/dashboard/learn" className="hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> {t('back_to_course')}
        </Link>
        <span>/</span>
        <span className={cn('rounded-full px-2 py-0.5 font-semibold', levelColor)}>
          {t('level_label')} {lesson.level}
        </span>
        <span>/</span>
        <span>{t('skill_label')} {lesson.skill}</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold', levelColor)}>
            Level {lesson.level} · Skill {lesson.skill}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {lesson.estimatedMin} {t('estimated_time')}
          </span>
        </div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{lesson.title}</h1>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Lesson content (60%) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Concept */}
          <motion.section
            className="rounded-xl border border-border bg-background p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary-500" />
              <h2 className="font-semibold text-foreground">Concept</h2>
            </div>
            <div className="lesson-prose text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
              {lesson.concept}
            </div>
          </motion.section>

          {/* Before / After */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-3">Live Demonstration</h2>
            <BeforeAfterDemo before={lesson.beforePrompt} after={lesson.afterPrompt} />
          </motion.section>

          {/* 5 Pillars (if present) */}
          {lesson.pillars.length > 0 && (
            <motion.section
              className="rounded-xl border border-border bg-background p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="font-semibold text-foreground mb-3">The 5 Context Pillars</h2>
              <ol className="space-y-2">
                {lesson.pillars.map((pillar, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-foreground/90">{pillar}</span>
                  </li>
                ))}
              </ol>
            </motion.section>
          )}

          {/* Common Mistake */}
          <motion.section
            className="rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30 p-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">{t('common_mistake')}</h3>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300">{lesson.commonMistake}</p>
          </motion.section>

          {/* Teacher's Note */}
          <motion.section
            className="rounded-xl border border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30 p-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">{t('teachers_note')}</h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">{lesson.teachersNote}</p>
          </motion.section>

          {/* Key Takeaways */}
          <motion.section
            className="rounded-xl border border-border bg-background p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="font-semibold text-foreground mb-3">{t('key_takeaways')}</h2>
            <ul className="space-y-2">
              {lesson.keyTakeaways.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-success mt-0.5" />
                  <span className="text-foreground/90">{point}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>

        {/* Right: Practice (40%) */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-sm font-semibold text-foreground mb-2">{t('quick_practice')}</h2>
              <div className="rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-950/30 p-4 mb-4">
                <p className="text-sm text-foreground/90">{lesson.quickPractice}</p>
              </div>
              <PromptEditor challengeId={`lesson-${slug}`} compact />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/dashboard/learn" className="btn-secondary gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" /> {t('back_to_course')}
        </Link>
        <button
          onClick={() => setCompleted(true)}
          className={cn('btn-primary gap-2 text-sm', completed && 'bg-success hover:bg-success')}
        >
          {completed ? (
            <><CheckCircle className="h-4 w-4" /> {t('completed')}</>
          ) : (
            <>{t('mark_complete')} <ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </div>
  )
}
