import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { i18n } from "../../i18n-config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BH Assurance",
  description: "Your trusted AI assistant for assurance needs.",
}

// Static params for Next.js to pre-render routes for each locale
export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  
  return (
    <div className={inter.className} data-lang={lang}>
      {children}
    </div>
  )
}