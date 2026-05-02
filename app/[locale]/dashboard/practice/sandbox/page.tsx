'use client'

import { useTranslations } from 'next-intl'
import { PromptEditor } from '@/components/practice/PromptEditor'

export default function SandboxPage() {
  const t = useTranslations('Practice')

  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('sandbox_title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('sandbox_desc')}</p>
      </div>
      <PromptEditor challengeId="sandbox-free" freeMode />
    </div>
  )
}
