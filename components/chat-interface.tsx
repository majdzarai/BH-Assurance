"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Plus, Menu, User, Settings, LogOut, Paperclip, ExternalLink, ChevronUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { i18n } from "../i18n-config"

interface Reference {
  id: string
  title: string
  url: string
  snippet: string
  source: string
  pdfUrl?: string
}

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
  references?: Reference[]
}

interface ChatInterfaceProps {
  dict: any
  commonDict: any
  lang: string
}

export function ChatInterface({ dict, commonDict, lang }: ChatInterfaceProps) {
  // Add safety checks and default values
  const safeDict = dict || {}
  const safeCommonDict = commonDict || {}

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-assistant-message-1",
      content: safeDict.simulatedResponse || "Thank you for your message. This is a simulated response from the BH Assurance assistant.",
      timestamp: new Date().toISOString(),
      role: "assistant",
      references: [
        {
          id: "ref1",
          title: "AI Assistant Best Practices",
          url: "https://example.com/ai-practices",
          snippet: "AI assistants should provide helpful, accurate, and contextual responses to user queries...",
          source: "AI Documentation",
          pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
        },
        {
          id: "ref2",
          title: "Customer Service Guidelines",
          url: "https://example.com/service-guide",
          snippet: "Professional customer service involves greeting users warmly and offering comprehensive assistance...",
          source: "Service Manual",
          pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
        },
      ],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showReferences, setShowReferences] = useState(false)
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null)

  // Modal states
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  // Get user data from localStorage
  const userData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData') || '{}') : {}
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: userData.first_name || '',
    lastName: userData.last_name || '',
    email: userData.email || ''
  })
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [previewCard, setPreviewCard] = useState<{ isOpen: boolean; content: string; title: string }>({
    isOpen: false,
    content: "",
    title: "",
  })

  const [referenceModal, setReferenceModal] = useState<{
    isOpen: boolean
    references: Reference[]
    selectedReferenceId: string | null
  }>({
    isOpen: false,
    references: [],
    selectedReferenceId: null,
  })

  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)

  const isRTL = lang === "ar"

  // Language change handler
  const handleLanguageChange = (newLang: string) => {
    const currentPath = window.location.pathname
    const newPath = currentPath.replace(`/${lang}`, `/${newLang}`)
    window.location.href = newPath
  }

  // Save settings function
  const handleSaveSettings = () => {
    // Save other settings (you can add more here)
    const settings = {
      language: lang,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('user-settings', JSON.stringify(settings))
    
    // Show success message
    setProfileSuccess("Settings saved successfully!")
    
    // Close the modal after 2 seconds
    setTimeout(() => {
      setIsSettingsModalOpen(false)
      setProfileSuccess(null)
    }, 2000)
  }

  // Open reference modal
  const openReferenceModal = (references: Reference[]) => {
    setReferenceModal({
      isOpen: true,
      references,
      selectedReferenceId: references[0]?.id || null,
    })
  }

  // Handle send message
  const handleSend = async () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: safeDict.simulatedResponse || "Thank you for your message. This is a simulated response from the BH Assurance assistant.",
        role: "assistant",
        timestamp: new Date().toISOString(),
        references: [
          {
            id: "ref1",
            title: "AI Assistant Response",
            url: "https://example.com/ai-response",
            snippet: "AI assistants provide helpful responses to user queries...",
            source: "AI Documentation",
            pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
          },
        ],
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  // Logout function
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Call logout endpoint
      if (authToken) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        await fetch(`${apiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        })
      }
      
      // Clear local storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      
      // Clear cookies
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      
      // Redirect to signin page
      window.location.href = `/${lang}/signin`
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear local data and redirect
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      window.location.href = `/${lang}/signin`
    } finally {
      setIsLoggingOut(false)
      setIsLogoutConfirmOpen(false)
    }
  }

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    if (!authToken) {
      setProfileError("Authentication token not found")
      setProfileSuccess(null)
      return
    }

    try {
      setIsProfileLoading(true)
      setProfileError(null)
      setProfileSuccess(null)
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const userProfile = await response.json()
        setProfileData({
          firstName: userProfile.first_name || '',
          lastName: userProfile.last_name || '',
          email: userProfile.email || ''
        })
        setProfileSuccess("Profile loaded successfully")
        setProfileError(null)
      } else {
        const errorData = await response.json()
        setProfileError(errorData.message || "Failed to load profile")
        setProfileSuccess(null)
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
      setProfileError("Failed to load profile. Please try again.")
      setProfileSuccess(null)
    } finally {
      setIsProfileLoading(false)
    }
  }

  // Load profile data from localStorage or backend
  const loadProfileData = async () => {
    // First, try to use localStorage data
    if (userData && userData.first_name && userData.last_name && userData.email) {
      setProfileData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || ''
      })
      setProfileSuccess("Profile loaded from local data")
      setProfileError(null) // Clear any previous errors
      return
    }
    
    // If no localStorage data, try to fetch from backend
    if (authToken) {
      await fetchUserProfile()
    } else {
      setProfileError("No profile data available")
      setProfileSuccess(null) // Clear any previous success messages
    }
  }

  // Update user profile in backend
  const updateUserProfile = async () => {
    if (!authToken) {
      setProfileError("Authentication token not found")
      return
    }

    // Debug: Log the token and request details
    console.log('🔍 Debug - Auth Token:', authToken)
    console.log('🔍 Debug - Profile Data:', profileData)
    console.log('🔍 Debug - API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')

    try {
      setIsProfileLoading(true)
      setProfileError(null)
      setProfileSuccess(null)
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const requestBody = {
        first_name: profileData.firstName,
        last_name: profileData.lastName
      }
      
      console.log('🔍 Debug - Request Body:', requestBody)
      console.log('🔍 Debug - Full Request URL:', `${apiUrl}/api/auth/profile`)
      
      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      console.log('🔍 Debug - Response Status:', response.status)
      console.log('🔍 Debug - Response Headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const updatedProfile = await response.json()
        console.log('🔍 Debug - Success Response:', updatedProfile)
        
        setProfileData({
          firstName: updatedProfile.first_name || profileData.firstName,
          lastName: updatedProfile.last_name || profileData.lastName,
          email: updatedProfile.email || profileData.email
        })
        setProfileSuccess("Profile updated successfully!")
        
        // Update localStorage with new user data
        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}')
        const updatedUserData = {
          ...currentUserData,
          first_name: updatedProfile.first_name || profileData.firstName,
          last_name: updatedProfile.last_name || profileData.lastName
        }
        localStorage.setItem('userData', JSON.stringify(updatedUserData))
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setIsProfileModalOpen(false)
          setProfileSuccess(null)
        }, 2000)
      } else {
        const errorData = await response.json()
        console.log('🔍 Debug - Error Response:', errorData)
        setProfileError(errorData.message || "Failed to update profile")
      }
    } catch (error) {
      console.error('🔍 Debug - Fetch Error:', error)
      setProfileError("Failed to update profile. Please try again.")
    } finally {
      setIsProfileLoading(false)
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Set initial selected reference when modal opens
  useEffect(() => {
    if (referenceModal.isOpen && referenceModal.references.length > 0 && !referenceModal.selectedReferenceId) {
      setReferenceModal((prev) => ({
        ...prev,
        selectedReferenceId: prev.references[0].id,
      }))
    }
  }, [referenceModal.isOpen, referenceModal.references, referenceModal.selectedReferenceId])

  // Load user profile when profile modal opens
  useEffect(() => {
    if (isProfileModalOpen) {
      loadProfileData()
    }
  }, [isProfileModalOpen])

  // Check authentication on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      if (!token) {
        // Redirect to signin if no token
        window.location.href = `/${lang}/signin`
        return
      }
      
      // Verify token is not expired (basic check)
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Math.floor(Date.now() / 1000)
        
        if (tokenData.exp && tokenData.exp < currentTime) {
          // Token expired, clear and redirect
          localStorage.removeItem('authToken')
          localStorage.removeItem('userData')
          document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          window.location.href = `/${lang}/signin`
          return
        }
      } catch (error) {
        console.error('Token validation error:', error)
        // Invalid token, clear and redirect
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        window.location.href = `/${lang}/signin`
        return
      }
    }
  }, [lang])

  const conversationHistory = [
    {
      id: "1",
      title: dict.conversationHistory?.title1 || "BH Assurance Chat",
      preview: dict.conversationHistory?.preview1 || "Discussion about creating a modern chat UI with React...",
      lastMessage: safeDict.simulatedResponse,
      timestamp: "2 hours ago",
      isActive: true,
    },
    {
      id: "2",
      title: dict.conversationHistory?.title2 || "Previous Conversation",
      preview: dict.conversationHistory?.preview2 || "Help with implementing authentication and user management...",
      lastMessage: safeDict.simulatedResponse,
      timestamp: "1 day ago",
      isActive: false,
    },
  ]

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <SidebarProvider defaultOpen={false}>
      {/* Enhanced Sidebar */}
      <Sidebar collapsible="icon" side={isRTL ? "right" : "left"} className="border-r-0 shadow-lg bg-gray-50">
        <SidebarHeader className="group-data-[collapsible=icon]:p-2 p-4">
          <Button
            size="icon"
            className="w-full justify-start gap-2 bg-black hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105
                             group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full"
          >
            <Plus className="h-4 w-4 text-white group-data-[collapsible=icon]:h-2 group-data-[collapsible=icon]:w-2 group-data-[collapsible=icon]:text-white" />
            <span className="group-data-[collapsible=icon]:hidden">{dict.newChat}</span>
          </Button>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden px-2">
              <span className={isRTL ? "text-right" : "text-left"}>{dict.conversationHistory?.today || "Today"}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {conversationHistory.map((conversation, index) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={conversation.isActive}
                      className="transition-all duration-200 hover:bg-gray-100 rounded-lg group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <a href={`/${lang}/chat`} className={isRTL ? "text-right" : "text-left"}>
                        <span className="group-data-[collapsible=icon]:hidden truncate">{conversation.title}</span>
                        <span className="group-data-[collapsible=icon]:block hidden">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        </span>
                      </a>
                    </SidebarMenuButton>
                    <button
                      onClick={() =>
                        setPreviewCard({
                          isOpen: true,
                          content: conversation.lastMessage,
                          title: conversation.title,
                        })
                      }
                      className={`w-full px-3 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors group-data-[collapsible=icon]:hidden rounded ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {conversation.preview}
                    </button>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    className="group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center hover:bg-gray-100 transition-all duration-200 group-data-[collapsible=icon]:rounded-full"
                  >
                    <Avatar className="h-8 w-8 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-gray-600 text-white font-bold">JD</AvatarFallback>
                    </Avatar>
                    <div
                      className={`flex-1 ${isRTL ? "text-right" : "text-left"} group-data-[collapsible=icon]:hidden`}
                    >
                      <div className="text-sm font-medium">John Doe</div>
                      <div className="text-xs text-gray-500">john@example.com</div>
                    </div>
                    <ChevronUp
                      className={`${isRTL ? "mr-auto" : "ml-auto"} h-4 w-4 group-data-[collapsible=icon]:hidden`}
                    />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align={isRTL ? "start" : "end"} className="w-48">
                  <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                    <User className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {dict.profile || "Profile"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                    <Settings className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {dict.settings || "Settings"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? (
                      <Loader2 className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"} animate-spin`} />
                    ) : (
                      <LogOut className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    )}
                    {isLoggingOut ? "Logging out..." : commonDict.logout || "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Chat Area */}
      <SidebarInset className="flex flex-col h-screen">
        {/* Enhanced Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="h-5 w-5 text-gray-600" />
            </SidebarTrigger>
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{dict.chatAssistantTitle || "BH Assurance"}</h1>
              <p className="text-sm text-gray-500">{dict.chatAssistantDescription || "Professional BH Assurance Assistant"}</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
                <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                  <User className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {dict.profile || "Profile"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                  <Settings className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {dict.settings || "Settings"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout} disabled={isLoggingOut}>
                  {isLoggingOut ? (
                    <Loader2 className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"} animate-spin`} />
                  ) : (
                    <LogOut className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  )}
                  {isLoggingOut ? "Logging out..." : commonDict.logout || "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Enhanced Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
          <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 safe-area-inset-bottom">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 sm:gap-4 animate-fade-in ${
                  message.role === "user"
                    ? isRTL
                      ? "justify-start flex-row-reverse"
                      : "justify-end"
                    : isRTL
                      ? "justify-end flex-row-reverse"
                      : "justify-start"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                      BH
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="max-w-[85%] sm:max-w-2xl flex-1">
                  <div
                    className={`rounded-2xl px-4 py-3 transition-all duration-300 hover:shadow-lg ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg"
                        : "bg-white border border-gray-200 hover:border-gray-300 shadow-md"
                    }`}
                  >
                    <p className={`text-sm leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>{message.content}</p>
                    <div
                      className={`text-xs mt-2 ${
                        message.role === "user" ? "text-blue-100" : "text-gray-500"
                      } ${isRTL ? "text-left" : "text-right"}`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString(lang, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Enhanced References Section */}
                  {message.role === "assistant" && message.references && message.references.length > 0 && (
                    <div className={`mt-3 flex items-center gap-1 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                      <button
                        onClick={() => openReferenceModal(message.references!)}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-all duration-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100"
                      >
                        <ExternalLink className={`h-3 w-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                        {dict.seeReferences?.replace("{count}", message.references.length.toString()) || `See references (${message.references.length})`}
                      </button>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0 shadow-md">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Enhanced Loading State */}
            {isLoading && (
              <div
                className={`flex gap-3 sm:gap-4 animate-fade-in ${isRTL ? "justify-end flex-row-reverse" : "justify-start"}`}
              >
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0 shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                    BH
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[85%] sm:max-w-2xl flex-1">
                  <div className="bg-white border border-gray-200 shadow-md rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      <span className="text-sm text-gray-600">{dict.thinking || "Thinking..."}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={dict.typeMessagePlaceholder || "Type your message here..."}
                  className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[60px] max-h-32"
                  rows={1}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute left-3 bottom-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setUploadedFile(file)
                      setInputMessage(prev => prev + `\n📎 ${file.name}`)
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isLoading}
                className="h-12 w-12 rounded-2xl bg-black hover:bg-gray-800 transition-all duration-200 hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                <Send className="h-5 w-5 text-white" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {dict.sendInstructions || "Press Enter to send, Shift + Enter for new line"}
            </p>
          </div>
        </div>
      </SidebarInset>

      {/* Preview Card Modal */}
      {previewCard.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{previewCard.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{previewCard.content}</p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setPreviewCard({ isOpen: false, content: "", title: "" })}
                className="transition-all duration-200 hover:shadow-md"
              >
                {commonDict.close || "Close"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reference Modal */}
      {referenceModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">{dict.referenceModal?.title || "References"}</h3>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">{dict.referenceModal?.textSnippets || "Text Snippets"}</h4>
                  <div className="space-y-3">
                    {referenceModal.references.map((reference) => (
                      <button
                        key={reference.id}
                        onClick={() => setReferenceModal(prev => ({ ...prev, selectedReferenceId: reference.id }))}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          referenceModal.selectedReferenceId === reference.id
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <h5 className="font-medium text-gray-900 text-sm mb-1">{reference.title}</h5>
                        <p className="text-xs text-gray-600 line-clamp-2">{reference.snippet}</p>
                        <p className="text-xs text-blue-600 mt-1">{reference.source}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4">
                <h4 className="font-semibold text-gray-800 mb-3">{dict.referenceModal?.documentView || "Document View"}</h4>
                {referenceModal.selectedReferenceId && (
                  <div className="h-full">
                    {referenceModal.references.find(ref => ref.id === referenceModal.selectedReferenceId)?.pdfUrl ? (
                      <iframe
                        src={referenceModal.references.find(ref => ref.id === referenceModal.selectedReferenceId)?.pdfUrl}
                        className="w-full h-full border border-gray-200 rounded-lg"
                        title="PDF Document"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <p>{dict.referenceModal?.noPdfAvailable || "No PDF available for this reference."}</p>
                      </div>
                    )}
                  </div>
                )}
                {!referenceModal.selectedReferenceId && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>{dict.referenceModal?.selectSnippet || "Select a snippet from the left to view its document."}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setReferenceModal({ isOpen: false, references: [], selectedReferenceId: null })}
                className="transition-all duration-200 hover:shadow-md"
              >
                {commonDict.close || "Close"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Settings Modal */}
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-in">
          <DialogHeader className={isRTL ? "text-right" : "text-left"}>
            <DialogTitle className="text-xl">{dict.settingsModal?.title || "Settings"}</DialogTitle>
            <DialogDescription>{dict.settingsModal?.description || "Manage your application preferences."}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Success Message */}
            {profileSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 text-center">{profileSuccess}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <h4 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                {dict.settingsModal?.generalSettings || "General Settings"}
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language-select" className={`block mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                    {dict.settingsModal?.language || "Language"}
                  </Label>
                  <Select onValueChange={handleLanguageChange} value={lang}>
                    <SelectTrigger
                      id="language-select"
                      className={`transition-all duration-200 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      <SelectValue placeholder={dict.settingsModal?.language || "Language"} />
                    </SelectTrigger>
                    <SelectContent>
                      {i18n.locales.map((locale) => (
                        <SelectItem key={locale} value={locale}>
                          {locale === "en"
                            ? dict.settingsModal?.english || "English"
                            : locale === "fr"
                              ? dict.settingsModal?.french || "French"
                              : locale === "ar"
                                ? dict.settingsModal?.arabic || "Arabic"
                                : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                {dict.settingsModal?.notificationSettings || "Notification Settings"}
              </h4>
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="email-notifications">{dict.settingsModal?.emailNotifications || "Email Notifications"}</Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="in-app-alerts">{dict.settingsModal?.inAppAlerts || "In-App Alerts"}</Label>
                <Switch id="in-app-alerts" defaultChecked />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                {dict.settingsModal?.privacySettings || "Privacy Settings"}
              </h4>
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="data-sharing">{dict.settingsModal?.allowDataSharing || "Allow Data Sharing"}</Label>
                <Switch id="data-sharing" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                {dict.settingsModal?.accountManagement || "Account Management"}
              </h4>
              <Button variant="destructive" className="w-full transition-all duration-200 hover:shadow-md">
                {dict.settingsModal?.deleteAccount || "Delete Account"}
              </Button>
            </div>
          </div>
          <DialogFooter className={`p-6 ${isRTL ? "flex-row-reverse justify-start" : ""}`}>
            <Button
              variant="outline"
              onClick={() => setIsSettingsModalOpen(false)}
              className="transition-all duration-200"
            >
              {commonDict.cancel || "Cancel"}
            </Button>
            <Button className="bg-black hover:bg-gray-800 transition-all duration-200 hover:shadow-md" onClick={handleSaveSettings}>
              {commonDict.saveSettings || "Save Settings"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-in">
          <DialogHeader className={isRTL ? "text-right" : "text-left"}>
            <DialogTitle className="text-xl">{dict.profileModal?.title || "User Profile"}</DialogTitle>
            <DialogDescription>{dict.profileModal?.description || "Manage your profile information."}</DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Loading State */}
            {isProfileLoading && !profileData.firstName && !profileData.lastName && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Loading profile...</span>
              </div>
            )}

            {/* Profile Information Section */}
            {(!isProfileLoading || profileData.firstName || profileData.lastName) && (
              <div className="space-y-4">
                <h4 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                  {dict.profileModal?.profileInformation || "Profile Information"}
                </h4>
                
                {/* Success Message */}
                {profileSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 text-center">{profileSuccess}</p>
                  </div>
                )}
                
                {/* Error Message */}
                {profileError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 text-center">{profileError}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className={`block mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                      {commonDict.firstName || "First Name"}
                    </Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className={`transition-all duration-200 ${isRTL ? "text-right" : "text-left"}`}
                      placeholder="Enter first name"
                      disabled={isProfileLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className={`block mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                      {commonDict.lastName || "Last Name"}
                    </Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className={`transition-all duration-200 ${isRTL ? "text-right" : "text-left"}`}
                      placeholder="Enter last name"
                      disabled={isProfileLoading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className={`block mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                    {commonDict.email || "Email"}
                  </Label>
                  <Input
                    id="email"
                    value={profileData.email}
                    disabled
                    className={`transition-all duration-200 bg-gray-50 ${isRTL ? "text-right" : "text-left"}`}
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <Button 
                  onClick={updateUserProfile}
                  className="w-full transition-all duration-200 hover:shadow-md"
                  disabled={isProfileLoading}
                >
                  {isProfileLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    commonDict.saveChanges || "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter className={`p-6 ${isRTL ? "flex-row-reverse justify-start" : ""}`}>
            <Button
              variant="outline"
              onClick={() => setIsProfileModalOpen(false)}
              className="transition-all duration-200"
              disabled={isProfileLoading}
            >
              {commonDict.close || "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={`text-center ${isRTL ? "text-right" : "text-left"}`}>
              {commonDict.logoutConfirm || "Confirm Logout"}
            </DialogTitle>
            <DialogDescription className={`text-center ${isRTL ? "text-right" : "text-left"}`}>
              {commonDict.logoutMessage || "Are you sure you want to logout? You will need to sign in again to access your account."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={`flex-col sm:flex-row gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              variant="outline"
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="w-full sm:w-auto transition-all duration-200"
            >
              {commonDict.cancel || "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full sm:w-auto transition-all duration-200"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {commonDict.logout || "Logout"}
                </>
              ) : (
                commonDict.logout || "Logout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
