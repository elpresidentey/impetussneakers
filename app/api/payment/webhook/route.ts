import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/db'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: Request) {
  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Paystack secret key not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)

    // Handle payment success event
    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data

      // Update order with payment status
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_reference: reference,
          status: 'processing',
          updated_at: new Date().toISOString(),
        })
        .eq('order_number', metadata.order_number)

      if (error) throw error
    }

    // Handle payment failure event
    if (event.event === 'charge.failed') {
      const { reference, metadata } = event.data

      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          payment_reference: reference,
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('order_number', metadata.order_number)

      if (error) throw error
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
