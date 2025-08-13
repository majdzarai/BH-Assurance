import type { Locale } from "./i18n-config"

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  ar: () => import("./dictionaries/ar.json").then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  // Add type safety and debugging
  if (!locale || !dictionaries[locale]) {
    console.error('Invalid locale:', locale)
    // Fallback to English
    return dictionaries.en()
  }
  
  try {
    return await dictionaries[locale]()
  } catch (error) {
    console.error('Error loading dictionary for locale:', locale, error)
    // Fallback to English
    return dictionaries.en()
  }
}
