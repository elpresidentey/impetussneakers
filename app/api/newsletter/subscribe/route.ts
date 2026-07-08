import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { sendNewsletterConfirmationEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Check if already subscribed
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('email', email)
      .is('unsubscribed_at', null)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      )
    }

    // Subscribe to newsletter
    const { error: insertError } = await supabase
      .from('newsletter_subscriptions')
      .upsert({
        email,
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null,
      })

    if (insertError) throw insertError

    // Send confirmation email
    await sendNewsletterConfirmationEmail(email)

    return NextResponse.json({ message: 'Successfully subscribed to newsletter' }, { status: 201 })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}
