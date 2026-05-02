'use client'

import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
      <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
      <pre className="max-w-2xl w-full rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4 text-xs text-red-800 dark:text-red-200 overflow-auto whitespace-pre-wrap break-words">
        {error?.message || 'Unknown error'}
        {'\n\n'}
        {error?.stack || ''}
      </pre>
      {error?.digest && (
        <p className="text-xs text-muted-foreground">Digest: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
