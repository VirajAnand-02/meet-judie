"use client"

import { useState, useEffect } from "react"
import { Send, Paperclip, Smile, Plus, MoreHorizontal, Menu, RefreshCw } from "lucide-react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faBrain } from '@fortawesome/free-solid-svg-icons'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { AiAssistantPanel } from "./ai-assistant-panel"
import { useInfiniteScrollChat, InfiniteScrollMessage } from "@/hooks/useInfiniteScrollChat"

interface Conversation {
  id: string
  name: string
  lastMessage: string
  time: string
  avatar: string
  isActive?: boolean
}

interface Message extends InfiniteScrollMessage {
  id: string
  content: string
  isOwn: boolean
  timestamp: Date
  messageType?: string
  metadata?: Record<string, unknown>
}

interface ChatAreaProps {
  conversation?: Conversation
  onToggleSidebar?: () => void
}

export function ChatArea({ conversation, onToggleSidebar }: ChatAreaProps) {
  const [message, setMessage] = useState("")
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)

  // Infinite scroll chat for regular messages
  const {
    messages,
    loading: messagesLoading,
    hasMore,
    error: messagesError,
    scrollRef,
    isLoadingMore,
    addMessage,
    resetMessages
  } = useInfiniteScrollChat<Message>({
    loadMore: async (cursor, limit) => {
      if (!conversation?.id) {
        return { messages: [], hasMore: false, nextCursor: null }
      }

      // For now, return dummy data since we don't have a real conversation system
      // In a real app, this would call the API: /api/chat/messages
      const dummyMessages: Message[] = [
        {
          id: "1",
          content: "Hey there! How can I help you today?",
          isOwn: false,
          timestamp: new Date("2025-09-16T10:30:00Z")
        },
        {
          id: "2", 
          content: "Hi Sophia, I'm interested in your coaching services. Can you tell me more about your programs?",
          isOwn: true,
          timestamp: new Date("2025-09-16T10:31:00Z")
        },
        {
          id: "3",
          content: "Of course! I offer personalized coaching for career development and leadership skills. We can tailor a program to fit your specific needs and goals.",
          isOwn: false,
          timestamp: new Date("2025-09-16T10:32:00Z")
        },
        {
          id: "4",
          content: "That sounds great. I'm particularly interested in improving my leadership skills. Do you have any success stories or testimonials from previous clients?",
          isOwn: true,
          timestamp: new Date("2025-09-16T10:33:00Z")
        }
      ]

      // Simulate pagination
      const startIndex = cursor ? parseInt(cursor) : 0
      const endIndex = startIndex + limit
      const pageMessages = dummyMessages.slice(startIndex, endIndex)

      return {
        messages: pageMessages,
        hasMore: endIndex < dummyMessages.length,
        nextCursor: pageMessages.length > 0 ? endIndex.toString() : null
      }
    },
    pageSize: 15
  })

  // Reset messages when conversation changes
  useEffect(() => {
    if (conversation?.id) {
      resetMessages()
    }
  }, [conversation?.id, resetMessages])

  const handleSend = async () => {
    if (message.trim() && conversation?.id) {
      try {
        setSendingMessage(true)
        
        // Add optimistic message
        const newMessage: Message = {
          id: `temp_${Date.now()}`,
          content: message.trim(),
          isOwn: true,
          timestamp: new Date()
        }
        addMessage(newMessage)
        
        // In a real app, you would call the API here
        // await sendMessageAPI(conversation.id, message)
        
        setMessage("")
      } catch (error) {
        console.error("Failed to send message:", error)
      } finally {
        setSendingMessage(false)
      }
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex h-screen items-center justify-center relative m-4 rounded-xl border border-border/50">
        <div className="text-center space-y-6 max-w-md px-8">
          {/* Animated icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-teal-400/20 to-blue-400/20 flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/30 to-blue-400/30 rounded-full blur-xl animate-pulse"></div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center relative z-10 shadow-lg">
              <FontAwesomeIcon icon={faComments} className="text-white text-xl" />
            </div>
          </div>
          
          {/* Main message */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
              Welcome to Judie AI Chat
            </h3>
            <p className="text-foreground/80 text-base leading-relaxed">
              Select a conversation from the sidebar to start chatting with your contacts and get AI-powered insights.
            </p>
          </div>

          {/* Tips */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400/60"></span>
              Choose any contact to begin messaging
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400/60"></span>
              Press <kbd className="px-2 py-1 bg-muted/50 rounded text-xs font-mono">Esc</kbd> to close chat
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col relative h-full">
      {/* Mobile AI Assistant Panel Overlay */}
      {showAiPanel && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden animate-fade-in" 
            onClick={() => setShowAiPanel(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-80 max-w-[90vw] z-50 lg:hidden animate-slide-in-right">
            <AiAssistantPanel onClose={() => setShowAiPanel(false)} />
          </div>
        </>
      )}

      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 glass-card px-4 md:px-6 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden flex-shrink-0 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent truncate">{conversation.name}</h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            onClick={() => setShowAiPanel(true)}
          >
            <FontAwesomeIcon icon={faBrain} className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="hover:bg-muted/50 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 min-h-0"
      >
        {/* Loading more messages indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading more messages...</span>
            </div>
          </div>
        )}

        {/* Initial loading state */}
        {messagesLoading && messages.length === 0 && (
          <div className="flex justify-center items-center h-32">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading messages...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {messagesError && (
          <div className="flex justify-center py-4">
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              Error loading messages: {messagesError}
            </div>
          </div>
        )}

        <div className="space-y-4 md:space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 md:gap-4 ${
                msg.isOwn ? "justify-end" : ""
              }`}
            >
              {!msg.isOwn && (
                <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 ring-2 ring-border">
                  <AvatarImage src={conversation?.avatar} alt={conversation.name} />
                  <AvatarFallback className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 text-teal-600 dark:text-teal-300 border border-teal-400/30">
                    {conversation.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[280px] md:max-w-md rounded-lg p-3 md:p-4 shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${
                  msg.isOwn
                    ? "rounded-tr-none bg-gradient-to-r from-teal-500 to-blue-500 text-white border border-teal-400/30"
                    : "rounded-tl-none glass-card text-foreground border border-border"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p
                  className={`mt-2 text-right text-xs ${
                    msg.isOwn ? "text-teal-100" : "text-muted-foreground"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>

              {msg.isOwn && (
                <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 ring-2 ring-border">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-300 border border-purple-400/30">You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* No more messages indicator */}
          {!messagesLoading && messages.length > 0 && !hasMore && (
            <div className="flex justify-center py-2">
              <span className="text-xs text-muted-foreground">No more messages</span>
            </div>
          )}
        </div>
      </div>

      {/* Message input */}
      <div className="border-t border-white/10 glass-card p-3 md:p-4 shadow-sm flex-shrink-0">
        <div className="relative flex items-end gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-lg blur-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="min-h-[44px] max-h-32 resize-none pr-24 md:pr-28 text-sm bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:border-teal-400/50 focus:ring-teal-400/20 relative z-10"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
          </div>
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50 text-muted-foreground hover:text-foreground">
              <Smile className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50 text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-border">
                <DropdownMenuItem className="hover:bg-muted/50">
                  <Paperclip className="mr-2 h-4 w-4" />
                  File
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-muted/50">
                  <Smile className="mr-2 h-4 w-4" />
                  Emoji
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              onClick={handleSend}
              disabled={sendingMessage || !message.trim()}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 h-8 shadow-lg border-0 disabled:opacity-50"
            >
              {sendingMessage ? (
                <RefreshCw className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
              ) : (
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}