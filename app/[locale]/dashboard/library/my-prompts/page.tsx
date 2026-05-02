'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Plus, Search, Tag, Trash2, Edit3, Globe, Lock, Copy } from 'lucide-react'

const MOCK_PROMPTS = [
  {
    id: '1',
    title: 'Code Review Template',
    prompt: 'You are a senior [LANGUAGE] engineer. Review this code for:\n1. Logic errors  2. Performance issues  3. Security vulnerabilities  4. Readability\n\nCode: [PASTE]\n\nReturn a severity-ranked list: issue name, risk level, one-line fix.',
    tags: ['code-review', 'engineering'],
    notes: 'Works best for backend code. For frontend, add "4. Accessibility" to the list.',
    isPublic: false,
    usageCount: 12,
    createdAt: '2026-04-28',
  },
  {
    id: '2',
    title: 'Debugging Template',
    prompt: 'Error: [EXACT ERROR]\nCode: [MINIMAL SNIPPET]\nExpected: [WHAT SHOULD HAPPEN]\nActual: [WHAT HAPPENS]\nTried: [WHAT YOU ALREADY TRIED]\nEnv: [LANGUAGE VERSION, FRAMEWORK]',
    tags: ['debugging', 'template'],
    notes: 'Filling in this template often reveals the bug before Claude responds.',
    isPublic: true,
    usageCount: 8,
    createdAt: '2026-04-25',
  },
  {
    id: '3',
    title: 'Calibration Statement',
    prompt: 'Before we start: I\'m a [ROLE] working on [PROJECT TYPE]. I use [TECH STACK]. I prefer [concise/detailed] explanations. When I say \'[DOMAIN TERM]\', I mean [SPECIFIC MEANING]. Assume I\'m working at [CONTEXT] throughout this session.',
    tags: ['calibration', 'session-setup'],
    notes: 'Use at the start of any new Claude session to eliminate repeated corrections.',
    isPublic: false,
    usageCount: 23,
    createdAt: '2026-04-20',
  },
]

export default function LibraryPage() {
  const t = useTranslations('Library')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'mine' | 'community'>('mine')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = MOCK_PROMPTS.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some((tg) => tg.includes(search.toLowerCase()))
  )

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your personal collection of high-performing prompts</p>
        </div>
        <button className="btn-primary gap-2 text-sm">
          <Plus className="h-4 w-4" /> {t('new_prompt')}
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex rounded-lg border border-border bg-background p-1">
          {(['mine', 'community'] as const).map((tabName) => (
            <button
              key={tabName}
              onClick={() => setTab(tabName)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === tabName
                  ? 'bg-primary-500 text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tabName === 'mine' ? t('my_prompts') : t('community')}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or tag..."
            className="w-full rounded-lg border border-input bg-background ps-9 pe-4 py-2 text-sm placeholder:text-muted-foreground focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Prompts */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="font-semibold text-foreground">{t('empty_title')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t('empty_desc')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((prompt, i) => (
            <motion.div
              key={prompt.id}
              className="rounded-xl border border-border bg-background p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{prompt.title}</h3>
                    {prompt.isPublic
                      ? <Globe className="h-3.5 w-3.5 text-success flex-shrink-0" />
                      : <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
                  </div>

                  <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap line-clamp-3 bg-muted/50 rounded-lg p-3 mb-3">
                    {prompt.prompt}
                  </pre>

                  {prompt.notes && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                      💡 {prompt.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    {prompt.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        <Tag className="h-2.5 w-2.5" /> {tag}
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground ms-auto">{prompt.usageCount} {t('usage_count')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleCopy(prompt.id, prompt.prompt)}
                    className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary-300 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copied === prompt.id ? 'Copied!' : 'Copy'}
                  </button>
                  <button className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Edit3 className="h-3.5 w-3.5" /> {t('edit')}
                  </button>
                  <button className="flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" /> {t('delete')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
