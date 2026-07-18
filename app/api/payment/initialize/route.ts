import { NextResponse } from 'next/server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, email, order_number, metadata } = body

    // Check if Paystack secret key is configured
    if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY === 'your-paystack-secret-key') {
      return NextResponse.json(
        { error: 'Paystack secret key not configured. Please set PAYSTACK_SECRET_KEY in environment variables.' },
        { status: 500 }
      )
    }

    // Convert amount to kobo (Paystack uses smallest currency unit)
    const amountInKobo = Math.round(amount * 100)

    // Get the correct callback URL from the request origin or environment variable
    const origin = request.headers.get('origin') || request.headers.get('referer')?.split('/').slice(0, 3).join('/')
    const callbackUrl = `${origin || process.env.NEXT_PUBLIC_APP_URL || 'https://impetus-omega.vercel.app'}/payment/verify`
    
    console.log('Payment callback URL:', callbackUrl)

    // Initialize transaction with Paystack
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInKobo,
        email,
        reference: order_number,
        metadata: {
          custom_fields: [
            {
              display_name: 'Order Number',
              variable_name: 'order_number',
              value: order_number,
            },
          ],
          ...metadata,
        },
        callback_url: callbackUrl,
      }),
    })

    const data = await response.json()

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || 'Failed to initialize payment' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    })
  } catch (error) {
    console.error('Error initializing payment:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
