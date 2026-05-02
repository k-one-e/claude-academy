import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  return Math.round(score).toString()
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-success'
  if (score >= 70) return 'text-primary'
  if (score >= 50) return 'text-warning'
  return 'text-error'
}

export function getScoreBg(score: number): string {
  if (score >= 90) return 'bg-success/10 border-success/20'
  if (score >= 70) return 'bg-primary/10 border-primary/20'
  if (score >= 50) return 'bg-warning/10 border-warning/20'
  return 'bg-error/10 border-error/20'
}

export function getLevelColor(level: number): string {
  const colors: Record<number, string> = {
    1: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400',
    2: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
    3: 'text-violet-600 bg-violet-50 dark:bg-violet-950 dark:text-violet-400',
    4: 'text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400',
  }
  return colors[level] ?? colors[1]
}

export function getLevelBorder(level: number): string {
  const borders: Record<number, string> = {
    1: 'border-emerald-200 dark:border-emerald-800',
    2: 'border-blue-200 dark:border-blue-800',
    3: 'border-violet-200 dark:border-violet-800',
    4: 'border-amber-200 dark:border-amber-800',
  }
  return borders[level] ?? borders[1]
}

export function getDifficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    EASY: 'text-emerald-600 bg-emerald-50',
    MEDIUM: 'text-amber-600 bg-amber-50',
    HARD: 'text-orange-600 bg-orange-50',
    EXPERT: 'text-red-600 bg-red-50',
  }
  return map[difficulty] ?? map.EASY
}

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}
