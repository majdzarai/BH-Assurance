import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { i18n } from "./i18n-config"

import { match as matchLocale } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = negotiatorHeaders[key]))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)

  const locale = matchLocale(languages, locales, i18n.defaultLocale)
  return locale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // e.g. /products -> /en/products
    return NextResponse.redirect(new URL(`/${locale}/${pathname}`, request.url))
  }

  // Check if user is trying to access protected routes
  const isProtectedRoute = pathname.includes('/chat')
  
  if (isProtectedRoute) {
    // Get the locale from the current path
    const locale = pathname.split('/')[1]
    
    // Check if user has authentication token in cookies or headers
    const authToken = request.cookies.get('authToken')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!authToken) {
      // Redirect to signin page if not authenticated
      const signinUrl = new URL(`/${locale}/signin`, request.url)
      signinUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signinUrl)
    }
  }
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, `/public`, favicon, and static assets
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|public|user-profile-illustration.png).*)"],
}
