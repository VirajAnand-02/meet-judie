import { NextRequest, NextResponse } from 'next/server'

// Instagram webhook verification token - should be set in environment variables
const WEBHOOK_VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'your_verify_token_here'

// Handle GET requests for webhook verification (hub.challenge)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Extract verification parameters from Instagram
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    console.log('Instagram webhook verification attempt:', {
      mode,
      token: token ? '[PROVIDED]' : '[MISSING]',
      challenge: challenge ? '[PROVIDED]' : '[MISSING]'
    })

    // Verify the webhook subscription
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      // Respond with the challenge parameter to verify the webhook
      console.log('Instagram webhook verification successful')
      return new NextResponse(challenge, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain'
        }
      })
    } else {
      // Verification failed
      console.log('Instagram webhook verification failed:', {
        expectedToken: WEBHOOK_VERIFY_TOKEN ? '[SET]' : '[NOT_SET]',
        receivedToken: token,
        mode
      })
      
      return NextResponse.json(
        { error: 'Webhook verification failed' },
        { status: 403 }
      )
    }
  } catch (error) {
    console.error('Instagram webhook verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle POST requests for actual webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the complete received data
    console.log('=== INSTAGRAM WEBHOOK EVENT RECEIVED ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('Headers:', Object.fromEntries(request.headers.entries()))
    console.log('Request URL:', request.url)
    console.log('Request Method:', request.method)
    console.log('Complete Body Data:', JSON.stringify(body, null, 2))
    console.log('Body Keys:', Object.keys(body))
    console.log('========================================')

    // Process the webhook payload
    if (body.object === 'instagram') {
      // Handle Instagram webhook events
      const entries = body.entry || []
      
      for (const entry of entries) {
        console.log('Processing Entry:', JSON.stringify(entry, null, 2))
        const changes = entry.changes || []
        
        for (const change of changes) {
          console.log('Processing Instagram change:', {
            field: change.field,
            value: JSON.stringify(change.value, null, 2),
            completeChange: JSON.stringify(change, null, 2)
          })
          
          // Handle different types of changes
          switch (change.field) {
            case 'messages':
              await handleInstagramMessage(change.value)
              break
            case 'messaging_postbacks':
              await handleInstagramPostback(change.value)
              break
            case 'messaging_optins':
              await handleInstagramOptin(change.value)
              break
            default:
              console.log('Unhandled Instagram change field:', change.field)
          }
        }
      }
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ status: 'ok' }, { status: 200 })
    
  } catch (error) {
    console.error('Instagram webhook processing error:', error)
    
    // Still return 200 to prevent Instagram from retrying
    return NextResponse.json(
      { status: 'error', message: 'Processing failed' },
      { status: 200 }
    )
  }
}

// Handle Instagram direct messages
async function handleInstagramMessage(messageData: any) {
  try {
    console.log('=== PROCESSING INSTAGRAM MESSAGE ===')
    console.log('Complete Message Data:', JSON.stringify(messageData, null, 2))
    
    // Extract message information
    const messages = messageData.messages || []
    
    for (const message of messages) {
      console.log('Individual Message Details:', {
        messageId: message.mid,
        senderId: message.from?.id,
        timestamp: message.timestamp,
        text: message.text,
        attachments: message.attachments,
        quickReply: message.quick_reply,
        completeMessage: JSON.stringify(message, null, 2)
      })
      
      // TODO: Implement your message handling logic here
      // This is where you would:
      // 1. Store the message in your database
      // 2. Update conversation records
      // 3. Trigger any automated responses
      // 4. Notify your application users
    }
    console.log('===================================')
  } catch (error) {
    console.error('Error handling Instagram message:', error)
  }
}

// Handle Instagram messaging postbacks (button clicks, etc.)
async function handleInstagramPostback(postbackData: any) {
  try {
    console.log('=== PROCESSING INSTAGRAM POSTBACK ===')
    console.log('Complete Postback Data:', JSON.stringify(postbackData, null, 2))
    
    // TODO: Implement postback handling logic
    // This handles when users click buttons in your messages
    console.log('====================================')
  } catch (error) {
    console.error('Error handling Instagram postback:', error)
  }
}

// Handle Instagram messaging opt-ins
async function handleInstagramOptin(optinData: any) {
  try {
    console.log('=== PROCESSING INSTAGRAM OPT-IN ===')
    console.log('Complete Opt-in Data:', JSON.stringify(optinData, null, 2))
    
    // TODO: Implement opt-in handling logic
    // This handles when users opt-in to receive messages
    console.log('==================================')
  } catch (error) {
    console.error('Error handling Instagram opt-in:', error)
  }
}