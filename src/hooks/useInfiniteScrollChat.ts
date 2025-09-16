/**
 * Infinite Scroll Chat Hook
 * Provides ChatGPT-style infinite scrolling for chat interfaces
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export interface InfiniteScrollMessage {
  id: string
  [key: string]: any // Allow any additional message properties
}

interface UseInfiniteScrollChatProps<T extends InfiniteScrollMessage> {
  initialMessages?: T[]
  loadMore: (cursor: string | null, limit: number) => Promise<{
    messages: T[]
    hasMore: boolean
    nextCursor: string | null
  }>
  pageSize?: number
  threshold?: number // Scroll threshold to trigger loading (in pixels)
}

interface UseInfiniteScrollChatReturn<T extends InfiniteScrollMessage> {
  messages: T[]
  loading: boolean
  hasMore: boolean
  error: string | null
  scrollRef: React.RefObject<HTMLDivElement | null>
  loadMoreMessages: () => Promise<void>
  resetMessages: (newMessages?: T[]) => void
  isLoadingMore: boolean
  addMessage: (message: T) => void
  updateMessage: (messageId: string, updates: Partial<T>) => void
}

export function useInfiniteScrollChat<T extends InfiniteScrollMessage>({
  initialMessages = [],
  loadMore,
  pageSize = 15,
  threshold = 100
}: UseInfiniteScrollChatProps<T>): UseInfiniteScrollChatReturn<T> {
  const [messages, setMessages] = useState<T[]>(initialMessages)
  const [loading, setLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const shouldScrollToBottom = useRef(true)
  const lastScrollTop = useRef(0)
  const isLoadingRef = useRef(false)

  // Load initial messages
  const loadInitialMessages = useCallback(async () => {
    if (!isInitialLoad) return
    
    try {
      setLoading(true)
      setError(null)
      
      const result = await loadMore(null, pageSize)
      setMessages(result.messages)
      setHasMore(result.hasMore)
      setCursor(result.nextCursor)
      setIsInitialLoad(false)
      
      // Scroll to bottom after initial load
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 100)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadMore, pageSize, isInitialLoad])

  // Load more older messages
  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoadingRef.current) return
    
    try {
      setIsLoadingMore(true)
      isLoadingRef.current = true
      setError(null)
      
      // Save current scroll position
      const container = scrollRef.current
      if (!container) return
      
      const oldScrollHeight = container.scrollHeight
      const oldScrollTop = container.scrollTop
      
      const result = await loadMore(cursor, pageSize)
      
      // Prepend older messages with deduplication
      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id))
        const newMessages = result.messages.filter(m => !existingIds.has(m.id))
        return [...newMessages, ...prev]
      })
      setHasMore(result.hasMore)
      setCursor(result.nextCursor)
      
      // Restore scroll position after new messages are added
      setTimeout(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight
          const heightDifference = newScrollHeight - oldScrollHeight
          container.scrollTop = oldScrollTop + heightDifference
        }
      }, 0)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more messages'
      setError(errorMessage)
    } finally {
      setIsLoadingMore(false)
      isLoadingRef.current = false
    }
  }, [hasMore, cursor, loadMore, pageSize])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const container = scrollRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    
    // Detect scroll direction
    const isScrollingUp = scrollTop < lastScrollTop.current
    lastScrollTop.current = scrollTop
    
    // Load more messages when scrolling near top
    if (isScrollingUp && scrollTop <= threshold && hasMore && !isLoadingRef.current) {
      loadMoreMessages()
    }
    
    // Update shouldScrollToBottom based on scroll position
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50
    shouldScrollToBottom.current = isNearBottom
  }, [threshold, hasMore, loadMoreMessages])

  // Add scroll listener
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Initialize
  useEffect(() => {
    loadInitialMessages()
  }, [loadInitialMessages])

  // Reset messages (for switching contacts/conversations)
  const resetMessages = useCallback((newMessages?: T[]) => {
    setMessages(newMessages || [])
    setHasMore(true)
    setCursor(null)
    setIsInitialLoad(true)
    setError(null)
    shouldScrollToBottom.current = true
    
    if (newMessages) {
      setIsInitialLoad(false)
      // Scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 0)
    }
  }, [])

  // Add new messages (for real-time updates)
  const addMessage = useCallback((message: T) => {
    setMessages(prev => {
      // Avoid duplicates
      if (prev.some(m => m.id === message.id)) {
        return prev
      }
      return [...prev, message]
    })
    
    // Auto scroll to bottom if user was already at bottom
    if (shouldScrollToBottom.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 0)
    }
  }, [])

  // Update existing message (for streaming)
  const updateMessage = useCallback((messageId: string, updates: Partial<T>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ))
  }, [])

  return {
    messages,
    loading,
    hasMore,
    error,
    scrollRef,
    loadMoreMessages,
    resetMessages,
    isLoadingMore,
    addMessage,
    updateMessage
  }
}

export default useInfiniteScrollChat