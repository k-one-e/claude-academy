'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/lib/i18n'
import { BookOpen, Dumbbell, Library, BarChart2, Settings, ChevronRight, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'

const NAV_ITEMS = [
  { key: 'learn', icon: BookOpen, href: '/dashboard/learn' },
  { key: 'practice', icon: Dumbbell, href: '/dashboard/practice/sandbox' },
  { key: 'library', icon: Library, href: '/dashboard/library/my-prompts' },
  { key: 'progress', icon: BarChart2, href: '/dashboard/progress/overview' },
]

export function Sidebar() {
  const t = useTranslations('Nav')
  const pathname = usePathname()
  const { data: session } = useSession()
  const displayName = session?.user?.name ?? session?.user?.email ?? 'User'
  const initial = displayName[0].toUpperCase()

  return (
    <aside className="hidden md:flex w-56 flex-col border-e border-border bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-border">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-xs flex-shrink-0">
          CA
        </div>
        <span className="font-bold text-sm text-foreground">Claude Academy</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname.includes(item.href.split('/')[2])
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors group',
                active
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-4 w-4 flex-shrink-0', active ? 'text-primary-500' : 'text-muted-foreground group-hover:text-foreground')} />
              {t(item.key as Parameters<typeof t>[0])}
              {active && <ChevronRight className="h-3 w-3 ms-auto text-primary-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom items */}
      <div className="p-3 border-t border-border space-y-0.5">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          {t('settings')}
        </Link>

        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 border border-border mt-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground">Learner</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
