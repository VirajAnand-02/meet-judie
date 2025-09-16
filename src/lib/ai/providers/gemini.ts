/**
 * Google Gemini AI Provider
 * Implements the AIProvider interface using Google's Gemini model via LangChain
 */

import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { HumanMessage, AIMessage as LangChainAIMessage, SystemMessage } from '@langchain/core/messages'
import { AIProvider, AIProviderConfig, AIMessage, AIConversationContext } from '../types'

export class GeminiProvider implements AIProvider {
  public name = 'gemini'
  private model: ChatGoogleGenerativeAI | null = null
  private tokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 }

  async initialize(config: AIProviderConfig): Promise<void> {
    this.model = new ChatGoogleGenerativeAI({
      apiKey: config.apiKey,
      model: config.model,
      temperature: config.options?.temperature ?? 0.7,
      maxOutputTokens: config.options?.maxTokens ?? 1000,
      topP: config.options?.topP ?? 0.9,
    })
  }

  async sendMessageStream(
    messages: AIMessage[], 
    context: AIConversationContext
  ): Promise<ReadableStream<string>> {
    if (!this.model) {
      throw new Error('Gemini provider not initialized')
    }

    try {
      // Build system prompt with contact context
      const systemPrompt = this.buildSystemPrompt(context)
      
      // Convert messages to LangChain format
      const langChainMessages = [
        new SystemMessage(systemPrompt),
        ...messages.map(msg => {
          switch (msg.role) {
            case 'user':
              return new HumanMessage(msg.content)
            case 'assistant':
              return new LangChainAIMessage(msg.content)
            case 'system':
              return new SystemMessage(msg.content)
            default:
              return new HumanMessage(msg.content)
          }
        })
      ]

      const model = this.model
      
      // Create a readable stream for the response
      const stream = new ReadableStream({
        start(controller) {
          (async () => {
            try {
              const streamResponse = await model.stream(langChainMessages)
              
              for await (const chunk of streamResponse) {
                const content = chunk.content.toString()
                if (content) {
                  controller.enqueue(content)
                }
              }
              
              controller.close()
            } catch (error) {
              controller.error(error)
            }
          })()
        }
      })

      return stream
    } catch (error) {
      console.error('Gemini AI streaming error:', error)
      throw new Error(`Failed to get AI stream response: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async sendMessage(
    messages: AIMessage[], 
    context: AIConversationContext
  ): Promise<AIMessage> {
    if (!this.model) {
      throw new Error('Gemini provider not initialized')
    }

    try {
      // Build system prompt with contact context
      const systemPrompt = this.buildSystemPrompt(context)
      
      // Convert messages to LangChain format
      const langChainMessages = [
        new SystemMessage(systemPrompt),
        ...messages.map(msg => {
          switch (msg.role) {
            case 'user':
              return new HumanMessage(msg.content)
            case 'assistant':
              return new LangChainAIMessage(msg.content)
            case 'system':
              return new SystemMessage(msg.content)
            default:
              return new HumanMessage(msg.content)
          }
        })
      ]

      // Get AI response
      const response = await this.model.invoke(langChainMessages)
      
      // Update token usage (Gemini doesn't always provide usage info)
      this.updateTokenUsage(messages, response.content.toString())

      // Create response message
      const aiMessage: AIMessage = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: response.content.toString(),
        timestamp: new Date(),
        metadata: {
          model: process.env.DEFAULT_AI_MODEL || 'gemini-1.5-pro',
          provider: 'google',
          contactId: context.contactId,
          contactName: context.contactName
        }
      }

      return aiMessage
    } catch (error) {
      console.error('Gemini AI error:', error)
      throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  getTokenUsage() {
    return { ...this.tokenUsage }
  }

  private buildSystemPrompt(context: AIConversationContext): string {
    const basePrompt = process.env.AI_SYSTEM_PROMPT || 
      "You are Judy, an intelligent AI assistant helping with business communications and relationship management. Be helpful, professional, and context-aware."

    let contextualPrompt = `${basePrompt}\n\nCurrent Context:\n`
    
    // Add contact information
    contextualPrompt += `You are helping with communications related to ${context.contactName}.`
    
    if (context.contactInfo) {
      const { email, phone, company, position, notes, tags } = context.contactInfo
      
      if (company) contextualPrompt += `\n- Company: ${company}`
      if (position) contextualPrompt += `\n- Position: ${position}`
      if (email) contextualPrompt += `\n- Email: ${email}`
      if (phone) contextualPrompt += `\n- Phone: ${phone}`
      if (tags && tags.length > 0) contextualPrompt += `\n- Tags: ${tags.join(', ')}`
      if (notes) contextualPrompt += `\n- Notes: ${notes}`
    }

    // Add conversation history context
    if (context.conversationHistory) {
      const { recentMessages, messageCount, lastActive } = context.conversationHistory
      contextualPrompt += `\n\nRecent conversation history (${messageCount} total messages, last active: ${lastActive.toLocaleDateString()}):`
      
      recentMessages.slice(-5).forEach((msg: { isFromUser: boolean; content: string }) => {
        const sender = msg.isFromUser ? 'User' : context.contactName
        contextualPrompt += `\n${sender}: ${msg.content}`
      })
    }

    contextualPrompt += `\n\nPlease provide helpful, contextual assistance based on this information. Be concise but comprehensive.`

    return contextualPrompt
  }

  private updateTokenUsage(messages: AIMessage[], response: string): void {
    // Rough estimation since Gemini doesn't always provide exact token counts
    const inputText = messages.map(m => m.content).join(' ')
    const estimatedInputTokens = Math.ceil(inputText.length / 4) // ~4 chars per token
    const estimatedOutputTokens = Math.ceil(response.length / 4)
    
    this.tokenUsage = {
      inputTokens: estimatedInputTokens,
      outputTokens: estimatedOutputTokens,
      totalTokens: estimatedInputTokens + estimatedOutputTokens
    }
  }
}