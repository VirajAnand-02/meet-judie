import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const sendMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  conversationId: z.string().min(1, 'Conversation ID is required')
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')
    const cursor = searchParams.get('cursor') // Message ID to start from
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    // Verify conversation belongs to user
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id
      }
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Build pagination query
    const whereCondition: any = {
      conversationId
    }

    if (cursor) {
      whereCondition.timestamp = {
        lt: new Date((await prisma.message.findUnique({ 
          where: { id: cursor },
          select: { timestamp: true }
        }))?.timestamp || new Date())
      }
    }

    // Get messages in descending order (newest first) for pagination
    const messages = await prisma.message.findMany({
      where: whereCondition,
      orderBy: { timestamp: 'desc' },
      take: limit + 1 // Get one extra to check if there are more
    })

    const hasMore = messages.length > limit
    const messagesToReturn = hasMore ? messages.slice(0, limit) : messages
    
    // Reverse to get chronological order (oldest first) for display
    const reversedMessages = messagesToReturn.reverse()
    
    // Cursor should be the oldest message ID (first in chronological order)
    const nextCursor = hasMore && reversedMessages.length > 0 ? reversedMessages[0].id : null

    return NextResponse.json({
      success: true,
      messages: reversedMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        isOwn: msg.isFromUser,
        timestamp: msg.timestamp,
        messageType: msg.messageType,
        metadata: msg.metadata
      })),
      hasMore,
      nextCursor
    })

  } catch (error) {
    console.error('Chat messages API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { message, conversationId } = sendMessageSchema.parse(body)

    // Verify conversation belongs to user
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id
      }
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Create new message
    const newMessage = await prisma.message.create({
      data: {
        conversationId,
        content: message,
        isFromUser: true,
        messageType: 'text',
        metadata: {}
      }
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      message: {
        id: newMessage.id,
        content: newMessage.content,
        isOwn: newMessage.isFromUser,
        timestamp: newMessage.timestamp,
        messageType: newMessage.messageType,
        metadata: newMessage.metadata
      }
    })

  } catch (error) {
    console.error('Send message API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}