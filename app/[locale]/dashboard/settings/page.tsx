'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor, Bell, Shield, LogOut, Trash2, AlertTriangle } from 'lucide-react'
import { signOut } from 'next-auth/react'

const THEMES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export default function SettingsPage() {
  const t = useTranslations('Nav')
  const { theme, setTheme } = useTheme()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handleDeleteAccount = async () => {
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await fetch('/api/auth/delete-account', { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json()
        setDeleteError(body.error ?? 'Failed to delete account')
        return
      }
      await signOut({ callbackUrl: '/' })
    } catch {
      setDeleteError('Something went wrong. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Customize your Claude Academy experience</p>
      </div>

      {/* Appearance */}
      <section className="rounded-xl border border-border bg-background p-5 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2"><Sun className="h-4 w-4" /> Appearance</h2>
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Theme</p>
          <div className="flex gap-2">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  theme === t.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-xl border border-border bg-background p-5 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</h2>
        {[
          { label: 'Daily practice reminder', description: 'Receive a reminder to keep your streak' },
          { label: 'New challenges', description: 'Get notified when new challenges are available' },
          { label: 'Achievement unlocked', description: 'Celebrate when you earn a badge' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <label className="relative inline-flex cursor-pointer">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="peer h-5 w-9 rounded-full bg-muted peer-checked:bg-primary-500 transition-colors after:content-[''] after:absolute after:start-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
            </label>
          </div>
        ))}
      </section>

      {/* Privacy */}
      <section className="rounded-xl border border-border bg-background p-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-3"><Shield className="h-4 w-4" /> Privacy</h2>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium text-foreground">Share progress publicly</p>
            <p className="text-xs text-muted-foreground">Allow others to see your learning stats</p>
          </div>
          <input type="checkbox" className="peer sr-only" />
          <div className="peer h-5 w-9 rounded-full bg-muted peer-checked:bg-primary-500 transition-colors" />
        </label>
      </section>

      {/* Sign out */}
      <div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 text-sm font-medium text-error hover:text-error/80 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      {/* Danger Zone */}
      <section className="rounded-xl border border-red-200 dark:border-red-900 bg-background p-5 space-y-3">
        <h2 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-800 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete my account
          </button>
        ) : (
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-4 space-y-3">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              Are you sure? All your progress, prompts, and data will be permanently deleted.
            </p>
            {deleteError && (
              <p className="text-xs text-red-600 dark:text-red-400">{deleteError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? 'Deleting...' : 'Yes, delete everything'}
              </button>
              <button
                onClick={() => { setConfirmDelete(false); setDeleteError('') }}
                disabled={deleting}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
