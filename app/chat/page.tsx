"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { Loader2 } from "lucide-react"

export default function ChatPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')

    if (!token || !userData) {
      // Redirect to signin if not authenticated
      router.push('/en/signin') // Default to English, you can make this dynamic
      return
    }

    // Verify token with backend
    fetch('http://localhost:8000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        // Token is invalid, clear storage and redirect
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        router.push('/en/signin')
      }
    })
    .catch(() => {
      // Network error, clear storage and redirect
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      router.push('/en/signin')
    })
    .finally(() => {
      setIsLoading(false)
    })
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return <ChatInterface />
}
