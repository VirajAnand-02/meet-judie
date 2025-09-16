/**
 * Test AI Chat API Route
 * For debugging and testing AI conversation functionality
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create a test contact
    const testContactId = 'test-contact-1'
    const userId = session.user.id

    // Check if test contact exists
    let contact = await prisma.contact.findUnique({
      where: { id: testContactId }
    })

    if (!contact) {
      // Create test contact
      contact = await prisma.contact.create({
        data: {
          id: testContactId,
          userId,
          name: 'Test Contact',
          email: 'test@example.com',
          phone: '+1-234-567-8900',
          company: 'Test Company',
          position: 'Test Position',
          notes: 'This is a test contact for AI conversations',
          tags: ['test', 'ai-demo']
        }
      })
    }

    // Get or create AI provider
    let provider = await prisma.aiProvider.findUnique({
      where: { name: 'gemini' }
    })

    if (!provider) {
      provider = await prisma.aiProvider.create({
        data: {
          name: 'gemini',
          displayName: 'Google Gemini',
          type: 'chat',
          config: {
            model: process.env.DEFAULT_AI_MODEL || 'gemini-1.5-pro',
            temperature: 0.7,
            maxTokens: 1000
          }
        }
      })
    }

    // Get or create AI conversation
    let aiConversation = await prisma.aiConversation.findFirst({
      where: {
        userId,
        contactId: testContactId,
        providerId: provider.id
      }
    })

    if (!aiConversation) {
      aiConversation = await prisma.aiConversation.create({
        data: {
          userId,
          contactId: testContactId,
          providerId: provider.id,
          title: 'Test AI Conversation',
          context: 'This is a test conversation for debugging AI functionality'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        contact,
        provider,
        aiConversation,
        message: 'Test setup completed successfully!'
      }
    })

  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { 
        error: 'Test setup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}