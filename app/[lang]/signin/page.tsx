import { getDictionary } from "../../../get-dictionnary"
import type { Locale } from "../../../i18n-config"
import { SignInForm } from "@/components/signin-form"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"

export default async function SignInPage({
  params,
}: {
  params: Promise<{
    lang: Locale
  }>
}) {
  const { lang } = await params
  let dict
  try {
    dict = await getDictionary(lang)
  } catch (error) {
    console.error("Failed to load dictionary:", error)
    // Provide fallback dictionary
    dict = {
      signInPage: {
        title: "Sign In",
        description: "Enter your credentials to access your account",
        dontHaveAccount: "Don't have an account?",
        signUpNow: "Sign up now",
      },
      common: {
        email: "Email",
        password: "Password",
        cinNumber: "CIN Number",
        submit: "Submit",
        copyright: "© {year} BH Assurance. All rights reserved.",
      },
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white shadow-sm">
        <Link href={`/${lang}`} className="flex items-center gap-2 font-bold text-lg">
          <span className="text-black">BH Assurance</span>
        </Link>
        <nav className="flex items-center gap-4">
          <LanguageSwitcher />
        </nav>
      </header>

      {/* Sign In Form Section */}
      <main className="flex-1 flex items-center justify-center p-6">
        <SignInForm dict={dict.signInPage} commonDict={dict.common} lang={lang} />
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center h-16 px-6 border-t border-gray-200 bg-white text-gray-500 text-sm">
        {dict.common.copyright.replace("{year}", new Date().getFullYear().toString())}
      </footer>
    </div>
  )
}
