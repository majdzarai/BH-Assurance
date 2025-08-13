import { NextRequest, NextResponse } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { i18n } from './i18n-config'

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales

  let languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  const locale = matchLocale(languages, locales, i18n.defaultLocale)
  return locale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check for authentication on protected routes (including admin)
  if (pathname.includes('/chat') || pathname.includes('/admin')) {
    const authToken = request.cookies.get('authToken')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!authToken) {
      // Extract language from pathname for proper redirect
      const langMatch = pathname.match(/^\/([a-z]{2})\//)
      const lang = langMatch ? langMatch[1] : 'en'
      
      // Redirect to signin page with the original pathname as redirect parameter
      const redirectUrl = new URL(`/${lang}/signin`, request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Check if the pathname is for a locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname}`,
        request.url
      )
    )
  }

  return NextResponse.next()
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
