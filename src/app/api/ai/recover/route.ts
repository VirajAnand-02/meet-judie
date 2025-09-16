import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find and clean up incomplete streaming messages
    const incompleteMessages = await prisma.aiMessage.findMany({
      where: {
        aiConversation: {
          userId: session.user.id
        },
        role: 'assistant',
        OR: [
          { content: '' },
          { 
            metadata: {
              path: ['streaming'],
              equals: true
            }
          }
        ]
      },
      include: {
        aiConversation: true
      }
    })

    const updates = []
    for (const message of incompleteMessages) {
      // Mark interrupted messages appropriately
      const update = prisma.aiMessage.update({
        where: { id: message.id },
        data: {
          content: message.content.trim() || '[Message was interrupted during streaming]',
          metadata: {
            ...((message.metadata as any) || {}),
            streaming: false,
            recovered: true,
            recoveredAt: new Date().toISOString()
          }
        }
      })
      updates.push(update)
    }

    await Promise.all(updates)

    return NextResponse.json({
      success: true,
      recovered: incompleteMessages.length,
      message: `Recovered ${incompleteMessages.length} incomplete messages`
    })

  } catch (error) {
    console.error('Message recovery error:', error)
    return NextResponse.json(
      { error: 'Failed to recover messages' },
      { status: 500 }
    )
  }
}