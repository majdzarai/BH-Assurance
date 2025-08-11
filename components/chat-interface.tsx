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

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const isRTL = lang === "ar"

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

  const conversationHistory = [
    {
      id: "1",
      title: dict.conversationHistory.title1,
      preview: dict.conversationHistory.preview1,
      lastMessage: dict.simulatedResponse,
      timestamp: "2 hours ago",
      isActive: true,
    },
    {
      id: "2",
      title: dict.conversationHistory.title2,
      preview: dict.conversationHistory.preview2,
      lastMessage: dict.simulatedResponse,
      timestamp: "1 day ago",
      isActive: false,
    },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const fileMessage: Message = {
          id: Date.now().toString(), // OK for client-generated messages
          content: dict.uploadedFile.replace("{fileName}", file.name),
          role: "user",
          timestamp: new Date().toISOString(), // Use ISO string for consistency
        }
        setMessages((prev) => [...prev, fileMessage])
      })
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(), // OK for client-generated messages
      content: input,
      role: "user",
      timestamp: new Date().toISOString(), // Use ISO string for consistency
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(), // OK for client-generated messages
        content: dict.simulatedResponse,
        role: "assistant",
        timestamp: new Date().toISOString(), // Use ISO string for consistency
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
    }, 1500)
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
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {conversationHistory.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
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
                    tooltip={dict.userProfile}
                    className="group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center hover:bg-gray-100 transition-all duration-200"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>JD</AvatarFallback>
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
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                      {/* Convert ISO string to Date object for display */}
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
                        onClick={() => showReferences(message.references!)}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-all duration-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100"
                      >
                        <ExternalLink className={`h-3 w-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                        {dict.seeReferences.replace("{count}", message.references.length.toString())}
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
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="border-t border-gray-200 bg-white/80 backdrop-blur-xl p-4 sm:p-6 safe-area-inset-bottom">
          <div className="max-w-4xl mx-auto">
            <div className={`flex gap-3 items-end ${isRTL ? "flex-row-reverse" : ""}`}>
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
                className="h-11 px-3 border-gray-300 hover:bg-gray-100 transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md transform hover:scale-105"
                disabled={isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={dict.typeMessagePlaceholder}
                  className={`min-h-[44px] resize-none border-gray-300 focus:border-black focus:ring-black bg-white transition-all duration-200 shadow-sm hover:shadow-md rounded-xl ${
                    isRTL ? "text-right pl-12 pr-4" : "text-left pr-12 pl-4"
                  }`}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className={`absolute ${isRTL ? "left-2" : "right-2"} top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-black hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:hover:shadow-lg rounded-lg`}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">{dict.sendInstructions}</p>
          </div>
        </div>
      </SidebarInset>

      {/* Enhanced Conversation Preview Card */}
      {previewCard.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
            <div className="p-6 border-b border-gray-200">
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}>
                  {previewCard.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewCard({ isOpen: false, content: "", title: "" })}
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6">
              <p className={`text-sm text-gray-600 leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>
                {previewCard.content}
              </p>
              <div className={`mt-6 flex gap-3 ${isRTL ? "flex-row-reverse justify-start" : "justify-end"}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewCard({ isOpen: false, content: "", title: "" })}
                  className="transition-all duration-200 hover:shadow-md"
                >
                  {commonDict.close}
                </Button>
                <Button
                  size="sm"
                  className="bg-black hover:bg-gray-800 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                >
                  {commonDict.openChat}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced References Modal */}
      {referenceModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col animate-scale-in">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className={`text-xl font-semibold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}>
                {dict.referenceModal.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReferenceModal({ isOpen: false, references: [], selectedReferenceId: null })}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </Button>
            </div>
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
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: PDF Viewer */}
              <div className="hidden md:flex w-2/3 p-6 flex-col">
                <h4 className={`text-lg font-semibold text-gray-800 mb-4 ${isRTL ? "text-right" : "text-left"}`}>
                  {dict.referenceModal.documentView}
                </h4>
                {selectedReference && selectedReference.pdfUrl ? (
                  <iframe
                    src={selectedReference.pdfUrl}
                    title={selectedReference.title}
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
                  </div>
                )}
              </div>
            </div>
            <div className={`p-6 border-t border-gray-200 flex ${isRTL ? "justify-start" : "justify-end"}`}>
              <Button
                variant="outline"
                onClick={() => setReferenceModal({ isOpen: false, references: [], selectedReferenceId: null })}
                className="transition-all duration-200 hover:shadow-md"
              >
                {commonDict.close}
              </Button>
            </div>
          </div>
        </div>
      )}

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
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                </div>
              </div>
            </div>
            <div className="space-y-4">
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
                <Switch id="data-sharing" />
              </div>
            </div>
            <div className="space-y-4">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
