'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from '@/lib/i18n'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const t = useTranslations('Auth')
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json()
        setError(body.error ?? 'Registration failed')
        return
      }

      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-indigo-600 to-primary-700 p-12 text-white">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">CA</div>
          <span className="font-bold">Claude Academy</span>
        </div>
        <div className="space-y-4">
          {[
            { icon: '🎯', text: 'Start with the highest-leverage skills first' },
            { icon: '⚡', text: 'Interactive practice with instant scored feedback' },
            { icon: '🏆', text: 'Gamified progress: badges, streaks, and leaderboards' },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <span className="text-xl">{item.icon}</span>
              <p className="text-indigo-100 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
        <p className="text-indigo-200 text-sm">Join 2,400+ learners mastering Claude.</p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <div className="h-7 w-7 rounded-lg bg-primary-500 flex items-center justify-center font-bold text-white text-xs">CA</div>
                <span className="font-bold text-foreground">Claude Academy</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">{t('register_title')}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t('register_subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('name')}</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Alex Chen"
                />
                {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('email')}</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('password')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 pe-10 text-sm placeholder:text-muted-foreground focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
              </div>

              {error && (
                <div className="rounded-lg bg-error/10 border border-error/20 px-3 py-2 text-xs text-error">{error}</div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('register_cta')}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t('have_account')}{' '}
              <Link href="/auth/login" className="font-semibold text-primary-500 hover:underline">
                {t('login_cta')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
