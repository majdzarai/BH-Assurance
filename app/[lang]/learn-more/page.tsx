import Link from "next/link"
import Image from "next/image"
import { getDictionary } from "../../../get-dictionnary"
import type { Locale } from "../../../i18n-config"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"

export default async function LearnMorePage({
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
      learnMorePage: {
        title: "Learn More About BH Assurance",
        subtitle: "Your Trusted AI Assistant",
        description:
          "Discover how our AI-powered assistant can help you navigate your insurance and assurance needs with expert guidance, 24/7 availability, and personalized support tailored to your specific requirements.",
      },
      common: {
        back: "Back",
        getStarted: "Get Started",
        copyright: "© {year} BH Assurance. All rights reserved.",
      },
    }
  }

  const isRTL = lang === "ar"

  // Ensure we have the required data with fallbacks
  const learnMoreData = dict.learnMorePage || {
    title: "Learn More About BH Assurance",
    subtitle: "Your Trusted AI Assistant",
    description:
      "Discover how our AI-powered assistant can help you navigate your insurance and assurance needs with expert guidance, 24/7 availability, and personalized support tailored to your specific requirements.",
  }

  const commonData = dict.common || {
    back: "Back",
    getStarted: "Get Started",
    copyright: "© {year} BH Assurance. All rights reserved.",
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              asChild
              variant="outline"
              className="bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <Link href={`/${lang}`} className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <ArrowLeft
                  className={`h-4 w-4 ${isRTL ? "rotate-180" : ""} group-hover:${isRTL ? "translate-x-1" : "-translate-x-1"} transition-transform`}
                />
                {commonData.back}
              </Link>
            </Button>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl mx-auto overflow-hidden border border-gray-100 animate-fade-in">
            <div className={`flex flex-col lg:flex-row ${isRTL ? "lg:flex-row-reverse" : ""}`}>
              {/* Image Section */}
              <div className="lg:w-1/2 relative overflow-hidden">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-full relative">
                  <Image
                    src="/professional-person-charts.png"
                    alt="Professional working on computer"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
                </div>
              </div>

              {/* Text Content Section */}
              <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full text-sm font-medium text-gray-700">
                    <Sparkles className="w-4 h-4" />
                    <span>Learn More</span>
                  </div>
                  <h1
                    className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {learnMoreData.title}
                  </h1>
                  <h2
                    className={`text-xl sm:text-2xl font-semibold text-black/80 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {learnMoreData.subtitle}
                  </h2>
                </div>
                <p className={`text-gray-600 leading-relaxed text-lg ${isRTL ? "text-right" : "text-left"}`}>
                  {learnMoreData.description}
                </p>
                <div className={`flex gap-4 pt-4 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                  <Button
                    asChild
                    className="bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Link href={`/${lang}/chat`}>{commonData.getStarted}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 text-gray-500 text-sm">
            {commonData.copyright.replace("{year}", new Date().getFullYear().toString())}
          </div>
        </div>
      </footer>
    </div>
  )
}
