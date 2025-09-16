"use client"

import React, { useState, useEffect, useRef } from "react"
import { Send, Mail, Phone, Instagram, Save, X, Trash2, RefreshCw } from "lucide-react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useAIChat } from "@/hooks/useAIChat"
import { useInfiniteScrollChat } from "@/hooks/useInfiniteScrollChat"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AIMessage } from "@/lib/ai/types"

interface AiMessage {
  id: string
  content: string
  isOwn: boolean
}

interface AiAssistantPanelProps {
  onClose?: () => void
  conversation?: {
    id: string
    name: string
    lastMessage: string
    time: string
    avatar: string
    isActive?: boolean
  } | null
}

export function AiAssistantPanel({ onClose, conversation }: AiAssistantPanelProps = {}) {
  const [aiQuery, setAiQuery] = useState("")
  const [activeTab, setActiveTab] = useState("ai-judy")
  const [notes, setNotes] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Infinite scroll chat for AI messages
  const {
    messages: aiMessages,
    loading: aiLoading,
    hasMore,
    error: scrollError,
    scrollRef,
    isLoadingMore,
    addMessage,
    updateMessage,
    resetMessages
  } = useInfiniteScrollChat<AIMessage>({
    loadMore: async (cursor, limit) => {
      if (!conversation?.id) {
        return { messages: [], hasMore: false, nextCursor: null }
      }

      const params = new URLSearchParams({
        contactId: conversation.id,
        limit: limit.toString()
      })
      if (cursor) params.append('cursor', cursor)

      const response = await fetch(`/api/ai/chat?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load messages')
      }

      return {
        messages: data.messages || [],
        hasMore: data.hasMore || false,
        nextCursor: data.nextCursor || null
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

  // Lead information for the selected conversation
  const leadInfo = conversation ? {
    name: conversation.name,
    username: `@${conversation.name.toLowerCase().replace(' ', '.')}`,
    avatar: conversation.avatar,
    email: "contact@example.com", // This would come from contact data
    phone: "+1 (555) 123-4567", // This would come from contact data
    instagram: `@${conversation.name.toLowerCase().replace(' ', '.')}`,
    conversationSummary: "AI will analyze this contact's conversation history and provide insights."
  } : null

  const handleSendAiQuery = async () => {
    if (aiQuery.trim() && conversation?.id) {
      try {
        setIsSending(true)
        setError(null)

        // Add user message optimistically
        const userMessage: AIMessage = {
          id: `temp_user_${Date.now()}`,
          role: 'user',
          content: aiQuery,
          timestamp: new Date()
        }
        addMessage(userMessage)

        const response = await fetch('/api/ai/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: aiQuery,
            contactId: conversation.id
          })
        })

        if (!response.ok) {
          throw new Error('Failed to start streaming')
        }

        // Get real message IDs from headers
        const userMessageId = response.headers.get('X-User-Message-Id')
        const aiMessageId = response.headers.get('X-AI-Message-Id')

        if (userMessageId && aiMessageId) {
          // Update user message with real ID
          updateMessage(userMessage.id, { id: userMessageId })

          // Add AI message for streaming
          const aiMessage: AIMessage = {
            id: aiMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date()
          }
          addMessage(aiMessage)

          // Handle streaming
          setIsStreaming(true)
          const reader = response.body?.getReader()
          const decoder = new TextDecoder()

          if (reader) {
            let streamedContent = ''
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              const chunk = decoder.decode(value)
              streamedContent += chunk
              updateMessage(aiMessageId, { content: streamedContent })
            }
          }
        }

        setAiQuery("")
      } catch (error) {
        console.error("Failed to send AI message:", error)
        setError(error instanceof Error ? error.message : 'Failed to send message')
      } finally {
        setIsSending(false)
        setIsStreaming(false)
      }
    }
  }

  const handleSaveNotes = () => {
    // Handle save notes
    console.log("Saving notes:", notes)
  }

  // Show empty state when no conversation is selected
  if (!conversation) {
    return (
      <div className="flex w-full flex-col border-l border-white/10 glass-modern relative h-full">
        {/* Mobile Close Button */}
        {onClose && (
          <div className="lg:hidden absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-muted/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-6 max-w-sm">
            {/* Animated icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative z-10 shadow-lg">
                <FontAwesomeIcon icon={faRobot} className="h-5 w-5 text-white" />
              </div>
            </div>
            
            {/* Main message */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                AI Assistant Ready
              </h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                Select a conversation to get AI-powered insights, lead information, and smart suggestions.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60"></span>
                Chat analysis & summaries
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400/60"></span>
                Lead information & notes
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60"></span>
                Smart response suggestions
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col border-l border-white/10 glass-modern relative h-full">
      {/* Mobile Close Button */}
      {onClose && (
        <div className="lg:hidden absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-muted/80"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 m-0 rounded-none border-b border-white/10 backdrop-blur-sm flex-shrink-0">
          <TabsTrigger 
            value="ai-judy" 
            className="text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 rounded-none text-muted-foreground data-[state=active]:text-purple-600 data-[state=active]:dark:text-purple-300 transition-all duration-200"
          >
            AI Judy
          </TabsTrigger>
          <TabsTrigger 
            value="lead-info" 
            className="text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:border-b-2 data-[state=active]:border-emerald-400 rounded-none text-muted-foreground data-[state=active]:text-emerald-600 data-[state=active]:dark:text-emerald-300 transition-all duration-200"
          >
            Lead Info
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden min-h-0">
          {/* AI Judy Panel */}
          <TabsContent value="ai-judy" className="mt-0 h-full flex flex-col">
            {/* Error Alert */}
            {(error || scrollError) && (
              <Alert className="m-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error || scrollError}
                </AlertDescription>
              </Alert>
            )}
            
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 space-y-4"
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

              {aiMessages.length === 0 && !aiLoading && (
                <div className="text-center text-muted-foreground py-8">
                  <p>Start a conversation with Judy AI about {conversation?.name || 'this contact'}</p>
                </div>
              )}
              
              {aiMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-start gap-3 max-w-[90%]">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex-shrink-0">
                        <FontAwesomeIcon icon={faMagicWandSparkles} className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                      </div>
                      <div className="rounded-lg glass-card border-purple-400/30 px-3 py-2 shadow-lg">
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  )}
                  {message.role === 'user' && (
                    <div className="max-w-[90%] rounded-lg bg-muted/50 border border-border px-3 py-2 backdrop-blur-sm">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {(aiLoading || isSending || isStreaming) && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 max-w-[90%]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex-shrink-0">
                      <RefreshCw className="h-4 w-4 text-purple-600 dark:text-purple-300 animate-spin" />
                    </div>
                    <div className="rounded-lg glass-card border-purple-400/30 px-3 py-2 shadow-lg">
                      <p className="text-sm text-muted-foreground">Judy is thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              
            </div>

            {/* Input Section */}
            <div className="border-t border-white/10 glass-card p-4 shadow-sm flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
                <Input
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  disabled={isSending || isStreaming}
                  className="pr-10 text-sm bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:border-purple-400/50 focus:ring-purple-400/20 relative z-10"
                  placeholder={(isSending || isStreaming) ? "Judy is thinking..." : "Ask AI Judy..."}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !(isSending || isStreaming)) {
                      e.preventDefault()
                      handleSendAiQuery()
                    }
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={isSending || isStreaming || !aiQuery.trim()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted/50 text-muted-foreground hover:text-foreground z-10 disabled:opacity-50"
                  onClick={handleSendAiQuery}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Lead Info Panel */}
          <TabsContent value="lead-info" className="mt-0 h-full">
            <div className="overflow-y-auto scrollbar-thin p-4 md:p-6 space-y-6 h-full">
            {leadInfo ? (
              <>
              {/* Profile Section */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-2 ring-border shadow-lg">
                    <AvatarImage src={leadInfo.avatar} alt={leadInfo.name} />
                    <AvatarFallback className="text-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-400/30">
                      {leadInfo.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-full blur-lg opacity-50 -z-10"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">{leadInfo.name}</h3>
                  <p className="text-sm text-muted-foreground">{leadInfo.username}</p>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-600 dark:text-emerald-300 text-sm">Contact Info</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg glass-card border-border">
                    <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-foreground truncate">{leadInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg glass-card border-border">
                    <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-foreground">{leadInfo.phone}</span>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-600 dark:text-emerald-300 text-sm">Social Media</h4>
                <div className="flex items-center gap-3 p-2 rounded-lg glass-card border-border">
                  <Instagram className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-foreground">{leadInfo.instagram}</span>
                </div>
              </div>
              
              {/* Conversation Summary Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-600 dark:text-emerald-300 text-sm">Conversation Summary</h4>
                <div className="p-3 rounded-lg glass-card border-emerald-400/30 shadow-lg">
                  <p className="text-sm text-foreground leading-relaxed">{leadInfo.conversationSummary}</p>
                </div>
              </div>

              {/* Custom Notes Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-600 dark:text-emerald-300 text-sm">Custom Notes</h4>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add custom notes here..."
                  className="min-h-[80px] resize-none text-sm bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:border-emerald-400/50 focus:ring-emerald-400/20"
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveNotes}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg border-0"
              >
                <Save className="mr-2 h-4 w-4 " />
                Save Notes
              </Button>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <p>Select a conversation to view contact details</p>
                </div>
              </div>
            )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}