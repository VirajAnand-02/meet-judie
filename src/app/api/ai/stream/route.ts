import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AIProviderRegistry } from '@/lib/ai'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const sendMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  contactId: z.string().min(1, 'Contact ID is required')
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { message, contactId } = sendMessageSchema.parse(body)

    const provider = await AIProviderRegistry.getProvider('gemini')

    // Get or create conversation
    let conversation = await prisma.aiConversation.findFirst({
      where: {
        userId: session.user.id,
        contactId,
        provider: { name: 'gemini' }
      },
      include: { provider: true }
    })

    if (!conversation) {
      // Ensure contact exists
      await prisma.contact.upsert({
        where: { id: contactId },
        update: {},
        create: {
          id: contactId,
          userId: session.user.id,
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
      let aiProvider = await prisma.aiProvider.findUnique({
        where: { name: 'gemini' }
      })

      if (!aiProvider) {
        aiProvider = await prisma.aiProvider.create({
          data: {
            name: 'gemini',
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
          userId: session.user.id,
          contactId,
          providerId: aiProvider.id,
          title: `AI Chat - ${new Date().toLocaleDateString()}`,
          context: 'New AI conversation started'
        },
        include: { provider: true }
      })
    }

    // Add user message and get the saved message ID
    const savedUserMessage = await prisma.aiMessage.create({
      data: {
        aiConversationId: conversation.id,
        role: 'user',
        content: message,
        metadata: { userId: session.user.id }
      }
    })

    // Get conversation history
    const messages = await prisma.aiMessage.findMany({
      where: { aiConversationId: conversation.id },
      orderBy: { timestamp: 'asc' }
    })

    const aiMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      timestamp: msg.timestamp,
      metadata: msg.metadata as Record<string, any> || {}
    }))

    // Get contact context
    const contact = await prisma.contact.findUnique({
      where: { id: contactId }
    })

    const context = {
      contactId,
      contactName: contact?.name || 'Unknown Contact',
      contact: contact ? {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        notes: contact.notes,
        tags: contact.tags
      } : undefined
    }

    // Create AI message entry immediately to get an ID
    const aiMessageEntry = await prisma.aiMessage.create({
      data: {
        aiConversationId: conversation.id,
        role: 'assistant',
        content: '', // Will be updated as we stream
        metadata: { streaming: true }
      }
    })

    // Get streaming response
    const stream = await provider.sendMessageStream(aiMessages, context)

    let fullResponse = ''
    
    // Create response with proper headers including message IDs
    const headers = new Headers({
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-User-Message-Id': savedUserMessage.id,
      'X-AI-Message-Id': aiMessageEntry.id
    })

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const reader = stream.getReader()
          
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            fullResponse += value
            controller.enqueue(encoder.encode(value))
            
            // Periodically update the database with partial content (every 100 chars)
            if (fullResponse.length % 100 === 0) {
              prisma.aiMessage.update({
                where: { id: aiMessageEntry.id },
                data: { content: fullResponse }
              }).catch(console.error) // Don't await to avoid blocking stream
            }
          }
          
          // Final update with complete response
          await prisma.aiMessage.update({
            where: { id: aiMessageEntry.id },
            data: { 
              content: fullResponse,
              metadata: { streaming: false, completed: true }
            }
          })
          
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(readableStream, { headers })

  } catch (error) {
    console.error('Streaming AI chat error:', error)
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid request data', details: error.issues }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}