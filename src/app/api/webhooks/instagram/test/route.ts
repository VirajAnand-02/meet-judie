import { NextRequest, NextResponse } from 'next/server'

// Test endpoint to verify Instagram webhook setup
export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin
  const webhookUrl = `${baseUrl}/api/webhooks/instagram`
  
  return NextResponse.json({
    message: 'Instagram webhook test endpoint',
    webhookUrl,
    instructions: {
      step1: 'Set your INSTAGRAM_WEBHOOK_VERIFY_TOKEN in .env.local',
      step2: 'Use this webhook URL in Instagram Developer Console:',
      step3: webhookUrl,
      step4: 'Instagram will send a GET request with hub.challenge parameter',
      step5: 'Check the server logs to see verification attempts'
    },
    testUrl: `${webhookUrl}?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test123`,
    environment: {
      verifyTokenSet: !!process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN,
      verifyToken: process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN ? '[SET]' : '[NOT SET]'
    }
  })
}