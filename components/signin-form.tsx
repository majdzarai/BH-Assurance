"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"

interface SignInFormProps {
  dict: any
  commonDict: any
  lang: string
}

export function SignInForm({ dict, commonDict, lang }: SignInFormProps) {
  // Add safety checks and default values
  const safeDict = dict || {
    title: "Sign In",
    description: "Enter your credentials to access your account",
    dontHaveAccount: "Don't have an account?",
    signUpNow: "Sign up now",
  }

  const safeCommonDict = commonDict || {
    email: "Email",
    password: "Password",
    submit: "Submit",
  }

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string | null>(null)
  const isRTL = lang === "ar"

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Call backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Store authentication data
        localStorage.setItem('authToken', data.access_token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        
        // Also store in cookies for middleware access
        document.cookie = `authToken=${data.access_token}; path=/; max-age=${30 * 24 * 60 * 60}` // 30 days
        
        setSuccess("Sign-in successful! Redirecting to chat...")
        
        // Check if there's a redirect URL
        const urlParams = new URLSearchParams(window.location.search)
        const redirectUrl = urlParams.get('redirect')
        
        setTimeout(() => {
          if (redirectUrl) {
            window.location.href = redirectUrl
          } else {
            window.location.href = `/${lang}/chat`
          }
        }, 1500)
      } else {
        const errorData = await response.json()
        setErrors({ general: errorData.message || "Invalid credentials. Please check your email and password." })
      }
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <Card className="shadow-2xl border border-gray-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className={`text-center space-y-2 ${isRTL ? "text-right" : "text-left"} sm:text-center`}>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">{safeDict.title}</CardTitle>
          <CardDescription className="text-gray-600">{safeDict.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className={isRTL ? "text-right" : "text-left"}>
                {safeCommonDict.email}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`transition-all duration-200 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                } ${isRTL ? "text-right" : "text-left"}`}
                disabled={isLoading}
              />
              {errors.email && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>



            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className={isRTL ? "text-right" : "text-left"}>
                {safeCommonDict.password}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`transition-all duration-200 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-black focus:ring-black"
                  } ${isRTL ? "text-right pl-10 pr-4" : "text-left pr-10 pl-4"}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Error Alert */}
            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </div>
              ) : (
                safeCommonDict.submit
              )}
            </Button>

            {/* Sign Up Link */}
            <div className={`text-center text-sm text-gray-600 ${isRTL ? "text-right" : "text-left"} sm:text-center`}>
              {safeDict.dontHaveAccount}{" "}
              <Link href={`/${lang}/signup`} className="font-medium text-black hover:underline transition-colors">
                {safeDict.signUpNow}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
