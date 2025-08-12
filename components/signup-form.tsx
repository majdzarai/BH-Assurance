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

interface SignUpFormProps {
  dict: any
  commonDict: any
  lang: string
}

export function SignUpForm({ dict, commonDict, lang }: SignUpFormProps) {
  // Add safety checks and default values
  const safeDict = dict || {
    title: "Sign Up",
    description: "Create your account to get started",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
  }

  const safeCommonDict = commonDict || {
    email: "Email",
    cinNumber: "CIN Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    submit: "Submit",
    firstName: "First Name",
    lastName: "Last Name",
  }

  const [formData, setFormData] = useState({
    email: "",
    cinNumber: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string | null>(null)
  const isRTL = lang === "ar"

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // CIN Number validation
    if (!formData.cinNumber) {
      newErrors.cinNumber = "CIN number is required"
    } else if (formData.cinNumber.length < 5) {
      newErrors.cinNumber = "CIN number must be at least 5 characters"
    } else if (!/^\d+$/.test(formData.cinNumber)) {
      newErrors.cinNumber = "CIN number must contain only digits"
    }

    // First Name validation
    if (!formData.firstName) {
      newErrors.firstName = "First name is required"
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = "First name must contain only letters and spaces"
    }

    // Last Name validation
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required"
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last name must contain only letters and spaces"
    }

    // Strong Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter"
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter"
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number"
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character (@$!%*?&)"
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          cin_number: formData.cinNumber,
          first_name: formData.firstName,
          last_name: formData.lastName,
          password: formData.password,
          confirm_password: formData.confirmPassword
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Store authentication data
        localStorage.setItem('authToken', data.access_token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        
        // Also store in cookies for middleware access
        document.cookie = `authToken=${data.access_token}; path=/; max-age=${30 * 24 * 60 * 60}` // 30 days
        
        setSuccess("Account created successfully! Redirecting to chat...")
        
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
        const errorMessage = errorData.detail || errorData.message || "Something went wrong. Please try again."
        
        // Check for specific backend errors and map them to form fields
        if (errorMessage.toLowerCase().includes("email") && errorMessage.toLowerCase().includes("already")) {
          setErrors({ email: "This email is already registered. Please use a different email or sign in instead." })
        } else if (errorMessage.toLowerCase().includes("cin") && errorMessage.toLowerCase().includes("already")) {
          setErrors({ cinNumber: "This CIN number is already registered. Please use a different CIN number or sign in instead." })
        } else if (errorMessage.toLowerCase().includes("cin")) {
          setErrors({ cinNumber: "Invalid CIN number format. Please check your input." })
        } else if (errorMessage.toLowerCase().includes("email")) {
          setErrors({ email: "Invalid email format. Please check your input." })
        } else if (errorMessage.toLowerCase().includes("password")) {
          setErrors({ password: "Password does not meet requirements. Please check the password rules." })
        } else {
          setErrors({ general: errorMessage })
        }
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

            {/* CIN Number Field */}
            <div className="space-y-2">
              <Label htmlFor="cin-number" className={isRTL ? "text-right" : "text-left"}>
                {safeCommonDict.cinNumber}
              </Label>
              <Input
                id="cin-number"
                type="text"
                placeholder="e.g., 12345"
                value={formData.cinNumber}
                onChange={(e) => handleInputChange("cinNumber", e.target.value)}
                className={`transition-all duration-200 ${
                  errors.cinNumber
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                } ${isRTL ? "text-right" : "text-left"}`}
                disabled={isLoading}
              />
              
              {/* CIN Number Validation Feedback */}
              {formData.cinNumber && (
                <div className="flex items-center gap-2 text-sm">
                  {/^\d+$/.test(formData.cinNumber) && formData.cinNumber.length >= 5 ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Valid CIN format
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      Must be 5+ digits only
                    </div>
                  )}
                </div>
              )}
              
              {errors.cinNumber && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cinNumber}
                </div>
              )}
            </div>

            {/* First Name Field */}
            <div className="space-y-2">
              <Label htmlFor="first-name" className={isRTL ? "text-right" : "text-left"}>
                {safeCommonDict.firstName}
              </Label>
              <Input
                id="first-name"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`transition-all duration-200 ${
                  errors.firstName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                } ${isRTL ? "text-right" : "text-left"}`}
                disabled={isLoading}
              />
              
              {/* First Name Validation Feedback */}
              {formData.firstName && (
                <div className="flex items-center gap-2 text-sm">
                  {/^[a-zA-Z\s]+$/.test(formData.firstName) && formData.firstName.length >= 2 ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Valid name format
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      Letters and spaces only, min 2 chars
                    </div>
                  )}
                </div>
              )}
              
              {errors.firstName && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.firstName}
                </div>
              )}
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <Label htmlFor="last-name" className={isRTL ? "text-right" : "text-left"}>
                {safeCommonDict.lastName}
              </Label>
              <Input
                id="last-name"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`transition-all duration-200 ${
                  errors.lastName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                } ${isRTL ? "text-right" : "text-left"}`}
                disabled={isLoading}
              />
              
              {/* Last Name Validation Feedback */}
              {formData.lastName && (
                <div className="flex items-center gap-2 text-sm">
                  {/^[a-zA-Z\s]+$/.test(formData.lastName) && formData.lastName.length >= 2 ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Valid name format
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      Letters and spaces only, min 2 chars
                    </div>
                  )}
                </div>
              )}
              
              {errors.lastName && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.lastName}
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[
                      { test: formData.password.length >= 8, label: "8+ chars" },
                      { test: /(?=.*[a-z])/.test(formData.password), label: "a-z" },
                      { test: /(?=.*[A-Z])/.test(formData.password), label: "A-Z" },
                      { test: /(?=.*\d)/.test(formData.password), label: "0-9" },
                      { test: /(?=.*[@$!%*?&])/.test(formData.password), label: "!@#$" }
                    ].map((req, index) => (
                      <div
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full ${
                          req.test
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.password && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className={isRTL ? "text-right" : "text-left"}>
                {safeCommonDict.confirmPassword}
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`transition-all duration-200 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-black focus:ring-black"
                  } ${isRTL ? "text-right pl-10 pr-4" : "text-left pr-10 pl-4"}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors`}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
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
                  Creating Account...
                </div>
              ) : (
                safeCommonDict.submit
              )}
            </Button>

            {/* Sign In Link */}
            <div className={`text-center text-sm text-gray-600 ${isRTL ? "text-right" : "text-left"} sm:text-center`}>
              {safeDict.alreadyHaveAccount}{" "}
              <Link href={`/${lang}/signin`} className="font-medium text-black hover:underline transition-colors">
                {safeDict.signIn}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}