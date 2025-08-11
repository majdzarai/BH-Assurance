"use client"

import { usePathname, useRouter } from "next/navigation"
import { i18n } from "../i18n-config"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const pathName = usePathname()
  const router = useRouter()

  const redirectedPathname = (locale: string) => {
    if (!pathName) return "/"
    const segments = pathName.split("/")
    segments[1] = locale
    return segments.join("/")
  }

  const currentLocale = pathName.split("/")[1] || i18n.defaultLocale

  const handleLocaleChange = (value: string) => {
    router.push(redirectedPathname(value))
  }

  const getLanguageName = (locale: string) => {
    switch (locale) {
      case "en":
        return "English"
      case "fr":
        return "Français"
      case "ar":
        return "العربية"
      default:
        return locale
    }
  }

  const getLanguageFlag = (locale: string) => {
    switch (locale) {
      case "en":
        return "🇺🇸"
      case "fr":
        return "🇫🇷"
      case "ar":
        return "🇸🇦"
      default:
        return "🌐"
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-700" />
      <Select onValueChange={handleLocaleChange} value={currentLocale}>
        <SelectTrigger className="w-[120px] h-9 text-sm border-gray-300 hover:border-gray-400 transition-colors">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {i18n.locales.map((locale) => (
            <SelectItem key={locale} value={locale} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <span>{getLanguageFlag(locale)}</span>
                <span>{getLanguageName(locale)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
