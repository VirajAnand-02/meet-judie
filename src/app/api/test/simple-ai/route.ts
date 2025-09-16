/**
 * Simple AI Test API Route
 * Direct test of AI functionality without complex conversation management
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { HumanMessage } from '@langchain/core/messages'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message } = await req.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Initialize Gemini directly
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: process.env.DEFAULT_AI_MODEL || 'gemini-1.5-pro',
      temperature: 0.7,
      maxOutputTokens: 1000,
    })

    // Create a simple message
    const userMessage = new HumanMessage(`You are Judy, a helpful AI assistant. User says: ${message}`)
    
    // Get AI response
    const response = await model.invoke([userMessage])

    return NextResponse.json({
      success: true,
      message: {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.content.toString(),
        timestamp: new Date()
      }
    })

  } catch (error) {
    console.error('Simple AI test error:', error)
    return NextResponse.json(
      { 
        error: 'AI test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}