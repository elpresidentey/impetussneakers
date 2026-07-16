import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { validateInput, rateLimit } from '@/lib/validation'
import { z } from 'zod'

const socialEngagementSchema = z.object({
  type: z.enum(['share', 'like', 'comment', 'referral']),
  productId: z.string().optional(),
  platform: z.enum(['whatsapp', 'instagram', 'twitter', 'copy', 'direct']).optional(),
  liked: z.boolean().optional(),
  timestamp: z.string()
})

export async function POST(request: Request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  if (!rateLimit(`social_${ip}`, 50, 60000)) { // 50 events per minute
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const validatedData = validateInput(socialEngagementSchema, body)

    // Track social engagement for business metrics
    const { error } = await supabase
      .from('social_engagement_events')
      .insert({
        event_type: validatedData.type,
        product_id: validatedData.productId || null,
        platform: validatedData.platform || null,
        user_ip: ip,
        event_data: {
          liked: validatedData.liked,
          timestamp: validatedData.timestamp
        },
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error tracking social engagement:', error)
      // Don't fail the request for analytics errors
    }

    // Update daily social metrics for investor dashboard
    const today = new Date().toISOString().split('T')[0]
    
    try {
      await supabase.rpc('increment_daily_social_metric', {
        metric_date: today,
        metric_type: validatedData.type,
        increment_by: 1
      })
    } catch (rpcError) {
      console.error(rpcError)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Social engagement tracking error:', error)
    // Return success even if tracking fails - don't break user experience
    return NextResponse.json({ success: true })
  }
}