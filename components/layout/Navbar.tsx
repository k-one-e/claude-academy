'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/lib/i18n'
import { Flame, Search, BookOpen, Dumbbell, Library, BarChart2, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { key: 'learn', icon: BookOpen, href: '/dashboard/learn' },
  { key: 'practice', icon: Dumbbell, href: '/dashboard/practice/sandbox' },
  { key: 'library', icon: Library, href: '/dashboard/library/my-prompts' },
  { key: 'progress', icon: BarChart2, href: '/dashboard/progress/overview' },
]

export function Navbar() {
  const t = useTranslations('Nav')
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="h-14 border-b border-border bg-background flex items-center px-4 gap-3">
      {/* Mobile logo */}
      <div className="md:hidden flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-xs">CA</div>
        <span className="font-bold text-sm">Claude Academy</span>
      </div>

      {/* Breadcrumb/title area (desktop) */}
      <div className="hidden md:flex flex-1 items-center">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search lessons, challenges..."
            className="w-64 rounded-lg border border-input bg-muted/50 ps-8 pe-4 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ms-auto">
        {/* Streak pill */}
        <div className="flex items-center gap-1 rounded-full bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 px-3 py-1">
          <span className="flame text-sm">🔥</span>
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400">7</span>
        </div>

        <ThemeToggle />

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {menuOpen && (
        <div className="md:hidden absolute top-14 start-0 end-0 z-50 bg-background border-b border-border shadow-lg p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.includes(item.href.split('/')[2])
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {t(item.key as Parameters<typeof t>[0])}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
