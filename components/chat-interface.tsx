"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Plus, Menu, User, Settings, LogOut, Paperclip, ExternalLink, ChevronUp } from "lucide-react"
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
} from "@/components/ui/sidebar" // [^1]
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
      title: "Professional Chat Interface",
      preview: "Discussion about creating a modern chat UI with React...",
      lastMessage: "Thank you for your message. This is a simulated response...",
      timestamp: "2 hours ago",
      isActive: true,
    },
    {
      id: "2",
      title: "Previous Conversation",
      preview: "Help with implementing authentication and user management...",
      lastMessage: "The authentication flow should include proper validation...",
      timestamp: "1 day ago",
      isActive: false,
    },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const fileMessage: Message = {
          id: Date.now().toString() + Math.random(),
          content: `📎 Uploaded file: ${file.name}`,
          role: "user",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, fileMessage])
      })
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response with references
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Thank you for your message. This is a simulated response from the BH Assurance assistant. In a real implementation, this would be connected to an AI service that provides accurate information based on reliable sources.",
        role: "assistant",
        timestamp: new Date(),
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
    }, 1000)
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
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {conversationHistory.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton asChild isActive={conversation.isActive} tooltip={conversation.title}>
                      <a href="#">
                        {/* Only show text when expanded, icon when collapsed */}
                        <span className="group-data-[collapsible=icon]:hidden">{conversation.title}</span>
                        <span className="group-data-[collapsible=icon]:block hidden">
                          <Menu className="h-4 w-4" /> {/* Placeholder icon for collapsed state */}
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
                      className="w-full px-3 py-1 text-xs text-gray-500 hover:text-gray-700 text-left transition-colors group-data-[collapsible=icon]:hidden"
                    >
                      {conversation.preview}
                    </button>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User Profile */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    tooltip="User Profile"
                    className="group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
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
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Chat Area */}
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
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

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
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* References Section */}
                  {message.role === "assistant" && message.references && message.references.length > 0 && (
                    <div className="mt-2">
                      <button
                        onClick={() => showReferences(message.references!)}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        See references ({message.references.length})
                      </button>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
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
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end">
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
                className="h-11 px-3 border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="min-h-[44px] pr-12 resize-none border-gray-300 focus:border-black focus:ring-black bg-white transition-all duration-200"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-black hover:bg-gray-800 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send, Shift + Enter for new line</p>
          </div>
        </div>
      </SidebarInset>

      {/* Conversation Preview Card */}
      {previewCard.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{previewCard.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewCard({ isOpen: false, content: "", title: "" })}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 leading-relaxed">{previewCard.content}</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewCard({ isOpen: false, content: "", title: "" })}
                >
                  Close
                </Button>
                <Button size="sm" className="bg-black hover:bg-gray-800">
                  Open Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* References Modal (Two Columns) */}
      {referenceModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full h-[90vh] mx-4 flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">References</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReferenceModal({ isOpen: false, references: [], selectedReferenceId: null })}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
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
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: PDF Viewer */}
              <div className="w-2/3 p-4 flex flex-col">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Document View</h4>
                {selectedReference && selectedReference.pdfUrl ? (
                  <iframe
                    src={selectedReference.pdfUrl}
                    title={selectedReference.title}
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
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReferenceModal({ isOpen: false, references: [], selectedReferenceId: null })}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

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
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                </div>
              </div>
            </div>
            <div className="space-y-4">
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
                <Switch id="data-sharing" />
              </div>
            </div>
            <div className="space-y-4">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
