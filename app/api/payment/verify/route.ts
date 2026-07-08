import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

if (!PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY environment variable is required')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { reference } = body

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Paystack secret key not configured' },
        { status: 500 }
      )
    }

    // Verify transaction with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    })

    const data = await response.json()

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || 'Failed to verify payment' },
        { status: 400 }
      )
    }

    const paymentData = data.data

    // Update order with payment status
    if (paymentData.status === 'success') {
      // Try to find order by payment reference (which is the order_number)
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_reference: paymentData.reference,
          status: 'processing',
          updated_at: new Date().toISOString(),
        })
        .eq('order_number', paymentData.reference)

      if (error) {
        console.error('Error updating order:', error)
        // Don't throw error, payment was successful even if order update failed
      }
    }

    return NextResponse.json({
      status: paymentData.status,
      reference: paymentData.reference,
      amount: paymentData.amount,
      paid_at: paymentData.paid_at,
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
