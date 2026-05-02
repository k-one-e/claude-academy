import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/lib/i18n'

const intlMiddleware = createMiddleware(routing)

const PROTECTED_PATHS = ['/dashboard', '/teacher']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.includes(path)
  )

  if (isProtected) {
    const sessionCookie =
      request.cookies.get('authjs.session-token') ??
      request.cookies.get('__Secure-authjs.session-token') ??
      request.cookies.get('next-auth.session-token') ??
      request.cookies.get('__Secure-next-auth.session-token')

    if (!sessionCookie) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(en|fa)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
