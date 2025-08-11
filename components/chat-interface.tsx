"use client"

import type React from "react"
<<<<<<< HEAD
import { useState, useRef, useEffect } from "react"
import { Send, Plus, Menu, User, Settings, LogOut, Paperclip, ExternalLink, ChevronUp, Loader2 } from "lucide-react"
=======

import { useState, useRef, useEffect } from "react"
import { Send, Plus, Menu, User, Settings, LogOut, Paperclip, ExternalLink, ChevronUp } from "lucide-react"
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
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
<<<<<<< HEAD
} from "@/components/ui/sidebar"
=======
} from "@/components/ui/sidebar" // [^1]
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
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
<<<<<<< HEAD
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { i18n } from "../i18n-config"
=======
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c

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
<<<<<<< HEAD
  // Change timestamp to string for initial state to avoid hydration mismatch
  timestamp: string // Always store as ISO string for consistency
  references?: Reference[]
}

interface ChatInterfaceProps {
  dict: any
  commonDict: any
  lang: string
}

export function ChatInterface({ dict, commonDict, lang }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-assistant-message-1", // Static ID for initial render
      content: dict.simulatedResponse,
      timestamp: new Date().toISOString(), // Use ISO string for consistent server render
      role: "assistant",
=======
  timestamp: Date
  references?: Reference[]
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! How can I assist you today? I can help you with various topics including web development, programming, and general questions.",
      role: "assistant",
      timestamp: new Date(),
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
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
          snippet:
            "Professional customer service involves greeting users warmly and offering comprehensive assistance...",
          source: "Service Manual",
          pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
        },
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
<<<<<<< HEAD
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
=======
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c

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

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

<<<<<<< HEAD
  const isRTL = lang === "ar"

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

=======
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
  // Set initial selected reference when modal opens
  useEffect(() => {
    if (referenceModal.isOpen && referenceModal.references.length > 0 && !referenceModal.selectedReferenceId) {
      setReferenceModal((prev) => ({
        ...prev,
        selectedReferenceId: prev.references[0].id,
      }))
    }
  }, [referenceModal.isOpen, referenceModal.references, referenceModal.selectedReferenceId])

  const conversationHistory = [
    {
      id: "1",
<<<<<<< HEAD
      title: dict.conversationHistory.title1,
      preview: dict.conversationHistory.preview1,
      lastMessage: dict.simulatedResponse,
=======
      title: "Professional Chat Interface",
      preview: "Discussion about creating a modern chat UI with React...",
      lastMessage: "Thank you for your message. This is a simulated response...",
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
      timestamp: "2 hours ago",
      isActive: true,
    },
    {
      id: "2",
<<<<<<< HEAD
      title: dict.conversationHistory.title2,
      preview: dict.conversationHistory.preview2,
      lastMessage: dict.simulatedResponse,
=======
      title: "Previous Conversation",
      preview: "Help with implementing authentication and user management...",
      lastMessage: "The authentication flow should include proper validation...",
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
      timestamp: "1 day ago",
      isActive: false,
    },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const fileMessage: Message = {
<<<<<<< HEAD
          id: Date.now().toString(), // OK for client-generated messages
          content: dict.uploadedFile.replace("{fileName}", file.name),
          role: "user",
          timestamp: new Date().toISOString(), // Use ISO string for consistency
=======
          id: Date.now().toString() + Math.random(),
          content: `📎 Uploaded file: ${file.name}`,
          role: "user",
          timestamp: new Date(),
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
        }
        setMessages((prev) => [...prev, fileMessage])
      })
    }
  }

  const handleSend = async () => {
<<<<<<< HEAD
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(), // OK for client-generated messages
      content: input,
      role: "user",
      timestamp: new Date().toISOString(), // Use ISO string for consistency
=======
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

<<<<<<< HEAD
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(), // OK for client-generated messages
        content: dict.simulatedResponse,
        role: "assistant",
        timestamp: new Date().toISOString(), // Use ISO string for consistency
=======
    // Simulate AI response with references
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Thank you for your message. This is a simulated response from the BH Assurance assistant. In a real implementation, this would be connected to an AI service that provides accurate information based on reliable sources.",
        role: "assistant",
        timestamp: new Date(),
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
        references: [
          {
            id: "ref3",
            title: "React Documentation",
            url: "https://react.dev/learn",
            snippet: "React is a JavaScript library for building user interfaces, particularly web applications...",
            source: "Official React Docs",
            pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
          },
          {
            id: "ref4",
            title: "Modern Web Development",
            url: "https://developer.mozilla.org/en-US/docs/Web",
            snippet:
              "Modern web development involves using frameworks and libraries to create interactive applications...",
            source: "MDN Web Docs",
            pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
          },
        ],
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
<<<<<<< HEAD
    }, 1500)
=======
    }, 1000)
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const showReferences = (references: Reference[]) => {
    setReferenceModal({
      isOpen: true,
      references,
      selectedReferenceId: references.length > 0 ? references[0].id : null,
    })
  }

  const selectedReference = referenceModal.references.find((ref) => ref.id === referenceModal.selectedReferenceId)

<<<<<<< HEAD
  const handleLanguageChange = (value: string) => {
    const segments = window.location.pathname.split("/")
    segments[1] = value
    router.push(segments.join("/"))
  }

  return (
    <SidebarProvider defaultOpen={false}>
      {/* Enhanced Sidebar */}
      <Sidebar collapsible="icon" side={isRTL ? "right" : "left"} className="border-r-0 shadow-lg">
        <SidebarHeader className="group-data-[collapsible=icon]:p-2 p-4">
          <Button
            className="w-full justify-start gap-2 bg-black hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105
                     group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
            tooltip={dict.newChat}
          >
            <Plus className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">{dict.newChat}</span>
          </Button>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden px-2">
              <span className={isRTL ? "text-right" : "text-left"}>{dict.conversationHistory.today}</span>
=======
  return (
    <SidebarProvider defaultOpen={true}>
      {/* Sidebar: collapsible="icon" makes it collapse to icons */}
      <Sidebar collapsible="icon" side="left">
        {/* Sidebar Header */}
        <SidebarHeader className="group-data-[collapsible=icon]:p-2">
          <Button
            className="w-full justify-start gap-2 bg-black hover:bg-gray-800 transition-colors
                       group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
            tooltip="New Chat"
          >
            <Plus className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
          </Button>
        </SidebarHeader>

        {/* Chat History */}
        <SidebarContent>
          <SidebarGroup>
            {/* SidebarGroupLabel will be hidden by its own styles */}
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              <span>Today</span>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {conversationHistory.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
<<<<<<< HEAD
                    <SidebarMenuButton
                      asChild
                      isActive={conversation.isActive}
                      tooltip={conversation.title}
                      className="transition-all duration-200 hover:bg-gray-100 rounded-lg"
                    >
                      <a href={`/${lang}/chat`} className={isRTL ? "text-right" : "text-left"}>
                        <span className="group-data-[collapsible=icon]:hidden truncate">{conversation.title}</span>
                        <span className="group-data-[collapsible=icon]:block hidden">
                          <Menu className="h-4 w-4" />
=======
                    <SidebarMenuButton asChild isActive={conversation.isActive} tooltip={conversation.title}>
                      <a href="#">
                        {/* Only show text when expanded, icon when collapsed */}
                        <span className="group-data-[collapsible=icon]:hidden">{conversation.title}</span>
                        <span className="group-data-[collapsible=icon]:block hidden">
                          <Menu className="h-4 w-4" /> {/* Placeholder icon for collapsed state */}
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
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
<<<<<<< HEAD
                      className={`w-full px-3 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors group-data-[collapsible=icon]:hidden rounded ${isRTL ? "text-right" : "text-left"}`}
=======
                      className="w-full px-3 py-1 text-xs text-gray-500 hover:text-gray-700 text-left transition-colors group-data-[collapsible=icon]:hidden"
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                    >
                      {conversation.preview}
                    </button>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

<<<<<<< HEAD
        <SidebarFooter className="p-2">
=======
        {/* User Profile */}
        <SidebarFooter>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
<<<<<<< HEAD
                    tooltip={dict.userProfile}
                    className="group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center hover:bg-gray-100 transition-all duration-200"
=======
                    tooltip="User Profile"
                    className="group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
<<<<<<< HEAD
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
                    {dict.profile}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                    <Settings className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {dict.settings}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {commonDict.logout}
=======
                    <div className="flex-1 text-left group-data-[collapsible=icon]:hidden">
                      <div className="text-sm font-medium">John Doe</div>
                      <div className="text-xs text-gray-500">john@example.com</div>
                    </div>
                    <ChevronUp className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-(--radix-popper-anchor-width)">
                  <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Chat Area */}
<<<<<<< HEAD
      <SidebarInset className="flex flex-col h-screen">
        {/* Enhanced Header */}
        <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-xl px-4 shadow-sm">
          <SidebarTrigger
            className={`${isRTL ? "-mr-1" : "-ml-1"} p-2 hover:bg-gray-100 rounded-lg transition-colors`}
          />
          <div className={`flex items-center justify-between flex-1 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={isRTL ? "text-right" : "text-left"}>
                <h1 className="text-lg font-semibold text-gray-900">{dict.chatAssistantTitle}</h1>
                <p className="text-sm text-gray-500 hidden sm:block">{dict.chatAssistantDescription}</p>
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
                  <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                    <Settings className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {dict.settings}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {commonDict.logout}
=======
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-gray-50">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center justify-between flex-1">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">BH Assurance</h1>
                <p className="text-sm text-gray-500">Professional BH Assurance Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

<<<<<<< HEAD
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
                      {/* Convert ISO string to Date object for display */}
                      {new Date(message.timestamp).toLocaleTimeString(lang, {
=======
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-blue-100 text-blue-600">BH</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-2xl ${message.role === "user" ? "ml-12" : "mr-12"}`}>
                  <div
                    className={`rounded-lg px-4 py-3 transition-all duration-200 hover:shadow-sm ${
                      message.role === "user"
                        ? "bg-black text-white"
                        : "bg-white border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], {
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

<<<<<<< HEAD
                  {/* Enhanced References Section */}
                  {message.role === "assistant" && message.references && message.references.length > 0 && (
                    <div className={`mt-3 flex items-center gap-1 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                      <button
                        onClick={() => showReferences(message.references!)}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-all duration-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100"
                      >
                        <ExternalLink className={`h-3 w-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                        {dict.seeReferences.replace("{count}", message.references.length.toString())}
=======
                  {/* References Section */}
                  {message.role === "assistant" && message.references && message.references.length > 0 && (
                    <div className="mt-2">
                      <button
                        onClick={() => showReferences(message.references!)}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        See references ({message.references.length})
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                      </button>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
<<<<<<< HEAD
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0 shadow-md">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white font-semibold">
                      JD
                    </AvatarFallback>
=======
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>JD</AvatarFallback>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                  </Avatar>
                )}
              </div>
            ))}
<<<<<<< HEAD

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
                <div className="max-w-2xl rounded-2xl px-4 py-3 bg-white border border-gray-200 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{dict.thinking}</span>
=======
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-blue-100 text-blue-600">BH</AvatarFallback>
                </Avatar>
                <div className="max-w-2xl rounded-lg px-4 py-3 bg-white border border-gray-200 mr-12">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">Thinking...</span>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                  </div>
                </div>
              </div>
            )}
<<<<<<< HEAD
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="border-t border-gray-200 bg-white/80 backdrop-blur-xl p-4 sm:p-6 safe-area-inset-bottom">
          <div className="max-w-4xl mx-auto">
            <div className={`flex gap-3 items-end ${isRTL ? "flex-row-reverse" : ""}`}>
=======
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end">
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
<<<<<<< HEAD
                className="h-11 px-3 border-gray-300 hover:bg-gray-100 transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md transform hover:scale-105"
                disabled={isLoading}
=======
                className="h-11 px-3 border-gray-300 hover:bg-gray-100 transition-colors"
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
<<<<<<< HEAD
                  placeholder={dict.typeMessagePlaceholder}
                  className={`min-h-[44px] resize-none border-gray-300 focus:border-black focus:ring-black bg-white transition-all duration-200 shadow-sm hover:shadow-md rounded-xl ${
                    isRTL ? "text-right pl-12 pr-4" : "text-left pr-12 pl-4"
                  }`}
=======
                  placeholder="Type your message here..."
                  className="min-h-[44px] pr-12 resize-none border-gray-300 focus:border-black focus:ring-black bg-white transition-all duration-200"
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="sm"
<<<<<<< HEAD
                  className={`absolute ${isRTL ? "left-2" : "right-2"} top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-black hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:shadow-lg rounded-lg`}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">{dict.sendInstructions}</p>
=======
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-black hover:bg-gray-800 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send, Shift + Enter for new line</p>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
          </div>
        </div>
      </SidebarInset>

<<<<<<< HEAD
      {/* Enhanced Conversation Preview Card */}
      {previewCard.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
            <div className="p-6 border-b border-gray-200">
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}>
                  {previewCard.title}
                </h3>
=======
      {/* Conversation Preview Card */}
      {previewCard.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{previewCard.title}</h3>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewCard({ isOpen: false, content: "", title: "" })}
<<<<<<< HEAD
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-colors"
=======
                  className="h-8 w-8 p-0"
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                >
                  ×
                </Button>
              </div>
            </div>
<<<<<<< HEAD
            <div className="p-6">
              <p className={`text-sm text-gray-600 leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>
                {previewCard.content}
              </p>
              <div className={`mt-6 flex gap-3 ${isRTL ? "flex-row-reverse justify-start" : "justify-end"}`}>
=======
            <div className="p-4">
              <p className="text-sm text-gray-600 leading-relaxed">{previewCard.content}</p>
              <div className="mt-4 flex justify-end gap-2">
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewCard({ isOpen: false, content: "", title: "" })}
<<<<<<< HEAD
                  className="transition-all duration-200 hover:shadow-md"
                >
                  {commonDict.close}
                </Button>
                <Button
                  size="sm"
                  className="bg-black hover:bg-gray-800 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                >
                  {commonDict.openChat}
=======
                >
                  Close
                </Button>
                <Button size="sm" className="bg-black hover:bg-gray-800">
                  Open Chat
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* Enhanced References Modal */}
      {referenceModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col animate-scale-in">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className={`text-xl font-semibold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}>
                {dict.referenceModal.title}
              </h3>
=======
      {/* References Modal (Two Columns) */}
      {referenceModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full h-[90vh] mx-4 flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">References</h3>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReferenceModal({ isOpen: false, references: [], selectedReferenceId: null })}
<<<<<<< HEAD
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-colors"
=======
                className="h-8 w-8 p-0"
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
              >
                ×
              </Button>
            </div>
<<<<<<< HEAD
            <div className={`flex flex-1 overflow-hidden ${isRTL ? "flex-row-reverse" : ""}`}>
              {/* Left Column: Snippets */}
              <div
                className={`w-full md:w-1/3 border-r border-gray-200 p-6 overflow-y-auto ${isRTL ? "border-r-0 border-l" : ""}`}
              >
                <h4 className={`text-lg font-semibold text-gray-800 mb-4 ${isRTL ? "text-right" : "text-left"}`}>
                  {dict.referenceModal.textSnippets}
                </h4>
                <div className="space-y-3">
                  {referenceModal.references.map((ref, index) => (
                    <button
                      key={ref.id}
                      onClick={() => setReferenceModal((prev) => ({ ...prev, selectedReferenceId: ref.id }))}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                        ref.id === referenceModal.selectedReferenceId
                          ? "bg-gray-100 border-2 border-gray-300 shadow-md"
                          : "bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-md transform hover:scale-105"
                      } ${isRTL ? "text-right" : "text-left"}`}
                    >
                      <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                        <span className="text-xs bg-black text-white px-2 py-1 rounded-full font-medium">
                          {index + 1}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">{ref.source}</span>
                      </div>
                      <h5 className={`font-semibold text-gray-900 text-sm mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                        {ref.title}
                      </h5>
                      <p className={`text-xs text-gray-600 line-clamp-3 ${isRTL ? "text-right" : "text-left"}`}>
                        {ref.snippet}
                      </p>
=======
            <div className="flex flex-1 overflow-hidden">
              {/* Left Column: Snippets */}
              <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Text Snippets</h4>
                <div className="space-y-3">
                  {referenceModal.references.map((ref) => (
                    <button
                      key={ref.id}
                      onClick={() => setReferenceModal((prev) => ({ ...prev, selectedReferenceId: ref.id }))}
                      className={`w-full text-left p-3 rounded-lg transition-colors duration-150 ${
                        ref.id === referenceModal.selectedReferenceId
                          ? "bg-gray-100 border border-gray-300"
                          : "bg-white border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {referenceModal.references.indexOf(ref) + 1}
                        </span>
                        <span className="text-xs text-gray-500">{ref.source}</span>
                      </div>
                      <h5 className="font-medium text-gray-900 text-sm mb-1">{ref.title}</h5>
                      <p className="text-xs text-gray-600 line-clamp-3">{ref.snippet}</p>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: PDF Viewer */}
<<<<<<< HEAD
              <div className="hidden md:flex w-2/3 p-6 flex-col">
                <h4 className={`text-lg font-semibold text-gray-800 mb-4 ${isRTL ? "text-right" : "text-left"}`}>
                  {dict.referenceModal.documentView}
                </h4>
=======
              <div className="w-2/3 p-4 flex flex-col">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Document View</h4>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                {selectedReference && selectedReference.pdfUrl ? (
                  <iframe
                    src={selectedReference.pdfUrl}
                    title={selectedReference.title}
<<<<<<< HEAD
                    className="flex-1 w-full border border-gray-200 rounded-xl shadow-lg"
                    style={{ minHeight: "400px" }}
                  >
                    {dict.referenceModal.pdfSupportMessage}{" "}
                    <a href={selectedReference.pdfUrl} className="text-blue-600 hover:underline">
                      {commonDict.downloadPdf}
                    </a>
                    .
                  </iframe>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 text-center bg-gray-50 rounded-xl border border-gray-200">
                    <div className="space-y-2">
                      <div className="text-4xl">📄</div>
                      <p>
                        {selectedReference ? dict.referenceModal.noPdfAvailable : dict.referenceModal.selectSnippet}
                      </p>
                    </div>
=======
                    className="flex-1 w-full border border-gray-200 rounded-lg"
                    style={{ minHeight: "400px" }}
                  >
                    Your browser does not support PDFs. Please download the PDF to view it:{" "}
                    <a href={selectedReference.pdfUrl}>Download PDF</a>.
                  </iframe>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 text-center bg-gray-50 rounded-lg border border-gray-200">
                    {selectedReference
                      ? "No PDF available for this reference."
                      : "Select a snippet from the left to view its document."}
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                  </div>
                )}
              </div>
            </div>
<<<<<<< HEAD
            <div className={`p-6 border-t border-gray-200 flex ${isRTL ? "justify-start" : "justify-end"}`}>
              <Button
                variant="outline"
                onClick={() => setReferenceModal({ isOpen: false, references: [], selectedReferenceId: null })}
                className="transition-all duration-200 hover:shadow-md"
              >
                {commonDict.close}
=======
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReferenceModal({ isOpen: false, references: [], selectedReferenceId: null })}
              >
                Close
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
              </Button>
            </div>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* Enhanced Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-in">
          <DialogHeader className={isRTL ? "text-right" : "text-left"}>
            <DialogTitle className="text-xl">{dict.profileModal.title}</DialogTitle>
            <DialogDescription>{dict.profileModal.description}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 shadow-lg">
                <AvatarImage src="/user-profile-illustration.png" />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                  JD
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-200 hover:shadow-md bg-transparent"
              >
                {dict.profileModal.changeAvatar}
              </Button>
            </div>
            <div className="space-y-4">
              <h4 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                {dict.profileModal.profileInformation}
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profile-name" className={`block mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                    {dict.profileModal.name}
                  </Label>
                  <Input
                    id="profile-name"
                    defaultValue="John Doe"
                    className={`transition-all duration-200 ${isRTL ? "text-right" : "text-left"}`}
                  />
                </div>
                <div>
                  <Label htmlFor="profile-email" className={`block mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                    {dict.profileModal.email}
                  </Label>
                  <Input
                    id="profile-email"
                    defaultValue="john@example.com"
                    type="email"
                    className={`transition-all duration-200 ${isRTL ? "text-right" : "text-left"}`}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                {dict.profileModal.changePassword}
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password" className={`block mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                    {dict.profileModal.currentPassword}
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    className={`transition-all duration-200 ${isRTL ? "text-right" : "text-left"}`}
                  />
                </div>
                <div>
                  <Label htmlFor="new-password" className={`block mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                    {dict.profileModal.newPassword}
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    className={`transition-all duration-200 ${isRTL ? "text-right" : "text-left"}`}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password" className={`block mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                    {dict.profileModal.confirmNewPassword}
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className={`transition-all duration-200 ${isRTL ? "text-right" : "text-left"}`}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className={`p-6 ${isRTL ? "flex-row-reverse justify-start" : ""}`}>
            <Button
              variant="outline"
              onClick={() => setIsProfileModalOpen(false)}
              className="transition-all duration-200"
            >
              {commonDict.cancel}
            </Button>
            <Button className="bg-black hover:bg-gray-800 transition-all duration-200 hover:shadow-md">
              {commonDict.saveChanges}
            </Button>
=======
      {/* Profile Modal (Large, Single Column) */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-6xl w-full h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>Manage your profile information and password.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/user-profile-illustration.png" />
                <AvatarFallback className="text-4xl">JD</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-800">Profile Information</h4>
              <div>
                <Label htmlFor="profile-name">Name</Label>
                <Input id="profile-name" defaultValue="John Doe" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" defaultValue="john@example.com" type="email" className="mt-1" disabled />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-800">Change Password</h4>
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" className="mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-black hover:bg-gray-800">Save Changes</Button>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
          </DialogFooter>
        </DialogContent>
      </Dialog>

<<<<<<< HEAD
      {/* Enhanced Settings Modal */}
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col animate-scale-in">
          <DialogHeader className={isRTL ? "text-right" : "text-left"}>
            <DialogTitle className="text-xl">{dict.settingsModal.title}</DialogTitle>
            <DialogDescription>{dict.settingsModal.description}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <h4 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                {dict.settingsModal.generalSettings}
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme-select" className={`block mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                    {dict.settingsModal.theme}
                  </Label>
                  <Select defaultValue="Light">
                    <SelectTrigger
                      id="theme-select"
                      className={`transition-all duration-200 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      <SelectValue placeholder={dict.settingsModal.theme} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Light">{dict.settingsModal.light}</SelectItem>
                      <SelectItem value="Dark">{dict.settingsModal.dark}</SelectItem>
                      <SelectItem value="System">{dict.settingsModal.system}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language-select" className={`block mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                    {dict.settingsModal.language}
                  </Label>
                  <Select onValueChange={handleLanguageChange} value={lang}>
                    <SelectTrigger
                      id="language-select"
                      className={`transition-all duration-200 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      <SelectValue placeholder={dict.settingsModal.language} />
                    </SelectTrigger>
                    <SelectContent>
                      {i18n.locales.map((locale) => (
                        <SelectItem key={locale} value={locale}>
                          {locale === "en"
                            ? dict.settingsModal.english
                            : locale === "fr"
                              ? dict.settingsModal.french
                              : locale === "ar"
                                ? dict.settingsModal.arabic
                                : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
=======
      {/* Settings Modal (Large, Single Column) */}
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="max-w-6xl w-full h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Manage your application preferences.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-800">General Settings</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="theme-select">Theme</Label>
                  <select
                    id="theme-select"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md bg-white text-gray-900"
                  >
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="language-select">Language</Label>
                  <select
                    id="language-select"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md bg-white text-gray-900"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                </div>
              </div>
            </div>
            <div className="space-y-4">
<<<<<<< HEAD
              <h4 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                {dict.settingsModal.notificationSettings}
              </h4>
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="email-notifications">{dict.settingsModal.emailNotifications}</Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="in-app-alerts">{dict.settingsModal.inAppAlerts}</Label>
                <Switch id="in-app-alerts" defaultChecked />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                {dict.settingsModal.privacySettings}
              </h4>
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <Label htmlFor="data-sharing">{dict.settingsModal.allowDataSharing}</Label>
=======
              <h4 className="text-md font-semibold text-gray-800">Notification Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="in-app-alerts">In-App Alerts</Label>
                  <Switch id="in-app-alerts" defaultChecked />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-800">Privacy Settings</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="data-sharing">Allow Data Sharing</Label>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
                <Switch id="data-sharing" />
              </div>
            </div>
            <div className="space-y-4">
<<<<<<< HEAD
              <h4 className={`text-lg font-semibold text-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                {dict.settingsModal.accountManagement}
              </h4>
              <Button variant="destructive" className="w-full transition-all duration-200 hover:shadow-md">
                {dict.settingsModal.deleteAccount}
              </Button>
            </div>
          </div>
          <DialogFooter className={`p-6 ${isRTL ? "flex-row-reverse justify-start" : ""}`}>
            <Button
              variant="outline"
              onClick={() => setIsSettingsModalOpen(false)}
              className="transition-all duration-200"
            >
              {commonDict.cancel}
            </Button>
            <Button className="bg-black hover:bg-gray-800 transition-all duration-200 hover:shadow-md">
              {commonDict.saveSettings}
            </Button>
=======
              <h4 className="text-md font-semibold text-gray-800">Account Management</h4>
              <Button variant="outline" className="w-full bg-black text-white border-gray-700 hover:bg-gray-800">
                Delete Account
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-black hover:bg-gray-800">Save Settings</Button>
>>>>>>> d59204b3ef3e39d0368fa461c5f26f3ef9d58b4c
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
