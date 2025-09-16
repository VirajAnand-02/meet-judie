/**
 * AI Chat API Route
 * Handles AI conversations with context switching and message persistence
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { aiConversationService } from '@/lib/ai'
import { z } from 'zod'

const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  contactId: z.string().min(1, 'Contact ID is required')
})

const clearChatSchema = z.object({
  contactId: z.string().min(1, 'Contact ID is required')
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const body = await req.json()
    const { message, contactId } = chatRequestSchema.parse(body)

    // Send message to AI and get response
    const aiResponse = await aiConversationService.sendMessage(
      session.user.id,
      contactId,
      message
    )

    return NextResponse.json({
      success: true,
      message: aiResponse
    })

  } catch (error) {
    console.error('AI Chat API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process AI chat request' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const contactId = searchParams.get('contactId')
    const cursor = searchParams.get('cursor') // Message ID to start from
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    // Get conversation messages with pagination
    const messages = await aiConversationService.getConversationWithPagination(
      session.user.id,
      contactId,
      cursor,
      limit
    )

    return NextResponse.json({
      success: true,
      messages: messages.messages,
      hasMore: messages.hasMore,
      nextCursor: messages.nextCursor
    })

  } catch (error) {
    console.error('AI Chat history API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const body = await req.json()
    const { contactId } = clearChatSchema.parse(body)

    // Clear conversation history
    await aiConversationService.clearConversation(
      session.user.id,
      contactId
    )

    return NextResponse.json({
      success: true,
      message: 'Conversation cleared successfully'
    })

  } catch (error) {
    console.error('AI Chat clear API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to clear conversation' },
      { status: 500 }
    )
  }
}