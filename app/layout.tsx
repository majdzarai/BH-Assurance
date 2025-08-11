import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'BH Assurance',
  description: 'Your trusted AI assistant for assurance needs.',
  icons: {
    icon: '/placeholder-logo.png', // Using existing logo instead of missing favicon
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get language from headers or default to 'en'
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/en'
  const lang = pathname.split('/')[1] || 'en'
  const isRTL = lang === 'ar'

  return (
    <html 
      lang={lang} 
      dir={isRTL ? 'rtl' : 'ltr'} 
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
