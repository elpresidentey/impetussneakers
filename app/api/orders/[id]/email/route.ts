import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get order details with user email
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        users!inner(email)
      `)
      .eq('id', params.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Send order confirmation email
    const emailSent = await sendOrderConfirmationEmail(
      order.users.email,
      order.order_number,
      parseFloat(order.total_amount)
    )

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending order email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
