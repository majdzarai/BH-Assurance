import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Lock, Clock, BookOpen, ArrowRight, Sparkles } from "lucide-react"
import { getDictionary } from "../../get-dictionnary"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { Locale } from "../../i18n-config"

export default async function LandingPage({
  params,
}: {
  params: Promise<{
    lang: Locale
  }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const isRTL = lang === "ar"

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      {/* Enhanced Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between h-16 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Link href={`/${lang}`} className="flex items-center gap-2 font-bold text-lg group">
              <div className="flex items-center gap-2 transition-transform group-hover:scale-105">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-black">BH Assurance</span>
              </div>
            </Link>
            <nav className={`flex items-center gap-3 sm:gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <LanguageSwitcher />
              <Button
                asChild
                variant="ghost"
                className="text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200"
              >
                <Link href={`/${lang}/signin`}>{dict.landingPage.navbar.signIn}</Link>
              </Button>
              <Button
                asChild
                className="bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Link href={`/${lang}/signup`}>{dict.common.signUp}</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-100/20 to-blue-100/20 rounded-full blur-3xl" />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full text-sm font-medium text-gray-700 mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered Assistant</span>
                </div>
                <h1
                  className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight ${isRTL ? "text-right" : "text-left"} sm:text-center`}
                >
                  <span className="block">{dict.landingPage.hero.titlePart1}</span>
                  <span className="block bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
                    {dict.landingPage.hero.titlePart2}
                  </span>
                  <span className="block">{dict.landingPage.hero.titlePart3}</span>
                </h1>
                <p
                  className={`text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed ${isRTL ? "text-right" : "text-left"} sm:text-center`}
                >
                  {dict.landingPage.hero.description}
                </p>
              </div>

              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? "sm:flex-row-reverse" : ""}`}
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <Link href={`/${lang}/chat`} className="flex items-center gap-2">
                    {dict.landingPage.hero.ctaPrimary}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link href={`/${lang}/learn-more`}>{dict.common.learnMore}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2
                className={`text-3xl sm:text-4xl font-bold text-gray-900 mb-4 ${isRTL ? "text-right" : "text-left"} sm:text-center`}
              >
                {dict.landingPage.features.title}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-black to-gray-600 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                { icon: Bot, ...dict.landingPage.features.card1 },
                { icon: Lock, ...dict.landingPage.features.card2 },
                { icon: Clock, ...dict.landingPage.features.card3 },
                { icon: BookOpen, ...dict.landingPage.features.card4 },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="group bg-white hover:bg-gray-50 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader
                    className={`flex flex-col items-center text-center p-6 ${isRTL ? "text-right" : "text-left"} sm:text-center`}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-black transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20" />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h2
                  className={`text-3xl sm:text-4xl font-bold tracking-tight text-white ${isRTL ? "text-right" : "text-left"} sm:text-center`}
                >
                  {dict.landingPage.ctaSection.title}
                </h2>
                <p
                  className={`text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed ${isRTL ? "text-right" : "text-left"} sm:text-center`}
                >
                  {dict.landingPage.ctaSection.description}
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group"
              >
                <Link href={`/${lang}/signup`} className="flex items-center gap-2">
                  {dict.landingPage.ctaSection.button}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 text-gray-500 text-sm">
            {dict.common.copyright.replace("{year}", new Date().getFullYear().toString())}
          </div>
        </div>
      </footer>
    </div>
  )
}
