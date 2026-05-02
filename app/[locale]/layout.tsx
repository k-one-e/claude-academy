import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from '@/components/layout/SessionProvider'
import { inter } from '@/app/fonts'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: { default: 'Claude Academy', template: '%s | Claude Academy' },
  description: 'Master Claude in 3 weeks. The interactive, bilingual platform for Claude AI mastery.',
  keywords: ['Claude', 'AI', 'prompt engineering', 'learning', 'Persian', 'bilingual'],
  openGraph: {
    title: 'Claude Academy',
    description: 'Master Claude in 3 weeks.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider messages={messages}>
            <SessionProvider>
              {children}
            </SessionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
