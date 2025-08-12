import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-black">TaaminAI</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost" className="text-gray-700 hover:text-black">
            <Link href="/chat">Get Started</Link>
          </Button>
          <Button asChild className="bg-black text-white hover:bg-gray-800">
            <Link href="/chat">Sign Up</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-tight">
            Your Trusted <span className="text-black">BH Assurance</span> Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience seamless support and expert guidance with our AI-powered assistant, designed to help you navigate
            your needs efficiently and effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
              <Link href="/chat">Start a New Chat</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
            >
              <Link href="/chat">Learn More</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center h-16 px-6 border-t border-gray-200 bg-white text-gray-500 text-sm">
        © {new Date().getFullYear()} BH Assurance. All rights reserved.
      </footer>
    </div>
  )
}
