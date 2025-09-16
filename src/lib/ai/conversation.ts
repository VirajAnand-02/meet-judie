/**
 * AI Conversation Service
 * Manages AI conversations with database persistence and context management
 */

import { prisma } from '@/lib/prisma'
import { AIConversationService, AIMessage, AIConversationContext } from './types'
import { AIProviderRegistry } from './registry'
import { v4 as uuidv4 } from 'uuid'

export class ConversationService implements AIConversationService {
  private defaultProvider = 'gemini'

  async createConversation(userId: string, contactId: string): Promise<string> {
    try {
      // Check if conversation already exists
      let conversation = await prisma.aiConversation.findFirst({
        where: {
          userId,
          contactId,
          provider: { name: this.defaultProvider }
        },
        include: { provider: true }
      })

      if (!conversation) {
        // First, ensure the contact exists - use upsert to create if it doesn't
        const contact = await prisma.contact.upsert({
          where: { id: contactId },
          update: {}, // Don't update if exists
          create: {
            id: contactId,
            userId,
            name: `Contact ${contactId}`,
            email: null,
            phone: null,
            company: null,
            position: null,
            notes: 'Auto-created contact for AI conversation',
            tags: ['ai-generated']
          }
        })

        // Get or create provider
        let provider = await prisma.aiProvider.findUnique({
          where: { name: this.defaultProvider }
        })

        if (!provider) {
          provider = await prisma.aiProvider.create({
            data: {
              name: this.defaultProvider,
              displayName: 'Google Gemini',
              type: 'chat',
              config: {
                model: process.env.DEFAULT_AI_MODEL || 'gemini-1.5-pro',
                temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
                maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1000')
              }
            }
          })
        }

        // Create new conversation
        conversation = await prisma.aiConversation.create({
          data: {
            userId,
            contactId: contact.id,
            providerId: provider.id,
            title: `AI Chat - ${new Date().toLocaleDateString()}`,
            context: 'New AI conversation started'
          },
          include: { provider: true }
        })
      }

      return conversation.id
    } catch (error) {
      console.error('Error creating AI conversation:', error)
      throw new Error('Failed to create AI conversation')
    }
  }

  async getConversation(userId: string, contactId: string): Promise<AIMessage[]> {
    try {
      const conversation = await prisma.aiConversation.findFirst({
        where: {
          userId,
          contactId,
          provider: { name: this.defaultProvider }
        },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' }
          }
        }
      })

      if (!conversation) {
        return []
      }

      return conversation.messages.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
        timestamp: msg.timestamp,
        metadata: msg.metadata as Record<string, any> || {}
      }))
    } catch (error) {
      console.error('Error fetching AI conversation:', error)
      throw new Error('Failed to fetch AI conversation')
    }
  }

  async getConversationWithPagination(
    userId: string, 
    contactId: string, 
    cursor: string | null = null, 
    limit: number = 20
  ): Promise<{
    messages: AIMessage[]
    hasMore: boolean
    nextCursor: string | null
  }> {
    try {
      const conversation = await prisma.aiConversation.findFirst({
        where: {
          userId,
          contactId,
          provider: { name: this.defaultProvider }
        }
      })

      if (!conversation) {
        return {
          messages: [],
          hasMore: false,
          nextCursor: null
        }
      }

      // Build query with pagination
      const whereCondition: any = {
        aiConversationId: conversation.id
      }

      // If cursor is provided, get messages older than cursor
      if (cursor) {
        whereCondition.timestamp = {
          lt: new Date((await prisma.aiMessage.findUnique({ 
            where: { id: cursor },
            select: { timestamp: true }
          }))?.timestamp || new Date())
        }
      }

      // Get messages in descending order (newest first) for pagination
      const messages = await prisma.aiMessage.findMany({
        where: whereCondition,
        orderBy: { timestamp: 'desc' },
        take: limit + 1 // Get one extra to check if there are more
      })

      const hasMore = messages.length > limit
      const messagesToReturn = hasMore ? messages.slice(0, limit) : messages
      
      // Reverse to get chronological order (oldest first) for display
      const reversedMessages = messagesToReturn.reverse()

      // Cursor should be the oldest message ID (first in chronological order)
      // so the next query can get messages older than this
      const nextCursor = hasMore && reversedMessages.length > 0 ? reversedMessages[0].id : null

      return {
        messages: reversedMessages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
          timestamp: msg.timestamp,
          metadata: msg.metadata as Record<string, any> || {}
        })),
        hasMore,
        nextCursor
      }
    } catch (error) {
      console.error('Error fetching AI conversation with pagination:', error)
      throw new Error('Failed to fetch AI conversation')
    }
  }

  async sendMessage(
    userId: string, 
    contactId: string, 
    message: string
  ): Promise<AIMessage> {
    try {
      // Get or create conversation
      const conversationId = await this.createConversation(userId, contactId)

      // Save user message
      const userMessage = await prisma.aiMessage.create({
        data: {
          aiConversationId: conversationId,
          role: 'user',
          content: message,
          metadata: { userId }
        }
      })

      // Get conversation context
      const context = await this.buildConversationContext(userId, contactId)
      
      // Get conversation history
      const history = await this.getConversation(userId, contactId)
      
      // Add current user message to history
      history.push({
        id: userMessage.id,
        role: 'user',
        content: message,
        timestamp: userMessage.timestamp,
        metadata: { userId }
      })

      // Get AI provider and send message
      const provider = await AIProviderRegistry.getProvider(this.defaultProvider)
      const aiResponse = await provider.sendMessage(history, context)

      // Save AI response
      const aiMessage = await prisma.aiMessage.create({
        data: {
          aiConversationId: conversationId,
          role: 'assistant',
          content: aiResponse.content,
          metadata: {
            ...aiResponse.metadata,
            tokenUsage: provider.getTokenUsage()
          }
        }
      })

      return {
        id: aiMessage.id,
        role: 'assistant',
        content: aiMessage.content,
        timestamp: aiMessage.timestamp,
        metadata: aiMessage.metadata as Record<string, any> || {}
      }
    } catch (error) {
      console.error('Error sending AI message:', error)
      throw new Error('Failed to send AI message')
    }
  }

  async clearConversation(userId: string, contactId: string): Promise<void> {
    try {
      const conversation = await prisma.aiConversation.findFirst({
        where: {
          userId,
          contactId,
          provider: { name: this.defaultProvider }
        }
      })

      if (conversation) {
        await prisma.aiMessage.deleteMany({
          where: { aiConversationId: conversation.id }
        })
      }
    } catch (error) {
      console.error('Error clearing AI conversation:', error)
      throw new Error('Failed to clear AI conversation')
    }
  }

  private async buildConversationContext(
    userId: string, 
    contactId: string
  ): Promise<AIConversationContext> {
    try {
      // Get contact information
      const contact = await prisma.contact.findUnique({
        where: { id: contactId },
        include: {
          conversations: {
            include: {
              messages: {
                orderBy: { timestamp: 'desc' },
                take: 10 // Get recent messages for context
              }
            },
            orderBy: { updatedAt: 'desc' },
            take: 1
          }
        }
      })

      if (!contact) {
        throw new Error('Contact not found')
      }

      const context: AIConversationContext = {
        contactId: contact.id,
        contactName: contact.name,
        contactInfo: {
          email: contact.email || undefined,
          phone: contact.phone || undefined,
          company: contact.company || undefined,
          position: contact.position || undefined,
          notes: contact.notes || undefined,
          tags: contact.tags
        }
      }

      // Add conversation history if available
      if (contact.conversations.length > 0) {
        const recentConversation = contact.conversations[0]
        context.conversationHistory = {
          recentMessages: recentConversation.messages.map(msg => ({
            content: msg.content,
            isFromUser: msg.isFromUser,
            timestamp: msg.timestamp
          })),
          messageCount: recentConversation.messages.length,
          lastActive: recentConversation.updatedAt
        }
      }

      return context
    } catch (error) {
      console.error('Error building conversation context:', error)
      // Return minimal context if there's an error
      return {
        contactId,
        contactName: 'Unknown Contact'
      }
    }
  }
}

// Export singleton instance
export const aiConversationService = new ConversationService()