/**
 * AI Service Types and Interfaces
 * Provides type definitions for the modular AI system
 */

import { InfiniteScrollMessage } from '@/hooks/useInfiniteScrollChat'

export interface AIMessage extends InfiniteScrollMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

export interface AIConversationContext {
  contactId: string
  contactName: string
  contactInfo?: {
    email?: string
    phone?: string
    company?: string
    position?: string
    notes?: string
    tags?: string[]
  }
  conversationHistory?: {
    recentMessages: Array<{
      content: string
      isFromUser: boolean
      timestamp: Date
    }>
    messageCount: number
    lastActive: Date
  }
}

export interface AIProviderConfig {
  id: string
  name: string
  displayName: string
  type: 'chat' | 'embedding' | 'completion'
  model: string
  apiKey: string
  options?: {
    temperature?: number
    maxTokens?: number
    topP?: number
    frequencyPenalty?: number
    presencePenalty?: number
  }
}

export interface AIProvider {
  name: string
  initialize(config: AIProviderConfig): Promise<void>
  sendMessage(
    messages: AIMessage[], 
    context: AIConversationContext
  ): Promise<AIMessage>
  sendMessageStream(
    messages: AIMessage[], 
    context: AIConversationContext
  ): Promise<ReadableStream<string>>
  getTokenUsage(): { inputTokens: number; outputTokens: number; totalTokens: number }
}

export interface AIConversationService {
  createConversation(userId: string, contactId: string): Promise<string>
  getConversation(userId: string, contactId: string): Promise<AIMessage[]>
  sendMessage(
    userId: string, 
    contactId: string, 
    message: string
  ): Promise<AIMessage>
  clearConversation(userId: string, contactId: string): Promise<void>
}

export enum AITaskType {
  CHAT = 'chat',
  SUMMARIZE = 'summarize',
  ANALYZE = 'analyze',
  SUGGEST_RESPONSE = 'suggest_response',
  EXTRACT_INFO = 'extract_info'
}