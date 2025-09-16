/**
 * AI Chat Hook
 * Handles AI conversation state and API interactions
 */

import { useState, useEffect, useCallback } from 'react'
import { AIMessage } from '@/lib/ai/types'

interface UseAIChatProps {
  contactId: string | null
}

interface UseAIChatReturn {
  messages: AIMessage[]
  loading: boolean
  error: string | null
  sendMessage: (message: string) => Promise<void>
  sendMessageStream: (message: string) => Promise<void>
  clearConversation: () => Promise<void>
  refreshMessages: () => Promise<void>
  recoverIncompleteMessages: () => Promise<void>
  isSending: boolean
  isStreaming: boolean
}

export function useAIChat({ contactId }: UseAIChatProps): UseAIChatReturn {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastLoadedContactId, setLastLoadedContactId] = useState<string | null>(null)

  const refreshMessages = useCallback(async () => {
    if (!contactId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/ai/chat?contactId=${contactId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load messages')
      }

      // Sort messages by timestamp to ensure proper order
      const sortedMessages = (data.messages || []).sort(
        (a: AIMessage, b: AIMessage) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )

      // Handle any incomplete streaming messages
      const processedMessages = handleIncompleteMessages(sortedMessages)

      setMessages(processedMessages)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages'
      setError(errorMessage)
      console.error('Error loading AI messages:', err)
    } finally {
      setLoading(false)
    }
  }, [contactId])

  // Helper function to update a specific message by ID
  const updateMessageById = (messageId: string, updates: Partial<AIMessage>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, ...updates }
          : msg
      )
    )
  }

  // Helper function to safely add messages (avoid duplicates)
  const addMessagesIfNotExists = (newMessages: AIMessage[]) => {
    setMessages(prev => {
      const existingIds = new Set(prev.map(m => m.id))
      const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m.id))
      return [...prev, ...uniqueNewMessages]
    })
  }

  // Check for incomplete streaming messages and handle them
  const handleIncompleteMessages = (messages: AIMessage[]) => {
    return messages.map(msg => {
      // If it's an AI message with streaming metadata but empty content,
      // it might be an interrupted stream
      if (msg.role === 'assistant' && 
          msg.metadata?.streaming === true && 
          !msg.content.trim()) {
        return {
          ...msg,
          content: '[Message was interrupted during streaming]',
          metadata: { ...msg.metadata, streaming: false, interrupted: true }
        }
      }
      return msg
    })
  }

  const sendMessageStream = async (message: string) => {
    if (!contactId) {
      setError('No contact selected')
      return
    }

    // Prevent multiple simultaneous messages
    if (isSending || isStreaming) {
      console.log('Already sending a message, please wait...')
      return
    }

    try {
      setIsStreaming(true)
      setError(null)

      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          contactId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start streaming')
      }

      // Get the real message IDs from response headers
      const userMessageId = response.headers.get('X-User-Message-Id')
      const aiMessageId = response.headers.get('X-AI-Message-Id')

      if (!userMessageId || !aiMessageId) {
        throw new Error('Failed to get message IDs from server')
      }

      // Add real messages with actual database IDs
      const userMessage: AIMessage = {
        id: userMessageId,
        role: 'user',
        content: message,
        timestamp: new Date()
      }

      const aiMessage: AIMessage = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }

      // Add messages safely (avoid duplicates)
      addMessagesIfNotExists([userMessage, aiMessage])

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response stream')
      }

      let streamedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        streamedContent += chunk

        // Update the AI message with streamed content using helper
        updateMessageById(aiMessageId, { content: streamedContent })
      }

      // Final refresh to ensure database sync (with slight delay)
      setTimeout(() => {
        if (contactId === lastLoadedContactId) { // Only refresh if still on same contact
          refreshMessages()
        }
      }, 200)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stream message'
      setError(errorMessage)
      console.error('Error streaming AI message:', err)
      
      // Fallback: try to refresh messages from database to recover any saved content
      try {
        await refreshMessages()
      } catch (refreshErr) {
        console.error('Failed to refresh messages after streaming error:', refreshErr)
      }
    } finally {
      setIsStreaming(false)
    }
  }

  const sendMessage = async (message: string) => {
    if (!contactId) {
      setError('No contact selected')
      return
    }

    // Prevent multiple simultaneous messages
    if (isSending) {
      console.log('Already sending a message, please wait...')
      return
    }

    // Add user message optimistically
    const userMessage: AIMessage = {
      id: `temp_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    try {
      setIsSending(true)
      setError(null)

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          contactId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      // Replace temp message with real one and add AI response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== userMessage.id)
        return [
          ...filtered,
          {
            ...userMessage,
            id: `user_${Date.now()}`
          },
          data.message
        ]
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)
      
      // Remove optimistic user message on error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id))
      
      console.error('Error sending AI message:', err)
    } finally {
      setIsSending(false)
    }
  }

  const clearConversation = async () => {
    if (!contactId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/ai/chat', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clear conversation')
      }

      setMessages([])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear conversation'
      setError(errorMessage)
      console.error('Error clearing AI conversation:', err)
    } finally {
      setLoading(false)
    }
  }

  // Recover incomplete messages
  const recoverIncompleteMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        // Refresh messages after recovery
        await refreshMessages()
      }
    } catch (error) {
      console.error('Failed to recover incomplete messages:', error)
    }
  }, [refreshMessages])

  // Load conversation when contactId changes or component mounts
  useEffect(() => {
    if (contactId && contactId !== lastLoadedContactId) {
      setLastLoadedContactId(contactId)
      // Recover any incomplete messages first, then refresh
      recoverIncompleteMessages().finally(() => {
        refreshMessages()
      })
    } else if (!contactId) {
      setMessages([])
      setLastLoadedContactId(null)
    }
  }, [contactId, lastLoadedContactId, recoverIncompleteMessages, refreshMessages])

  return {
    messages,
    loading,
    error,
    sendMessage,
    sendMessageStream,
    clearConversation,
    refreshMessages,
    recoverIncompleteMessages,
    isSending,
    isStreaming
  }
}