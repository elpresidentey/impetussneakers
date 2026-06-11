import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface OrderRequest {
  userId: string
  totalAmount: number
  shippingAddress: string
  items: Array<{
    product_id: string
    quantity: number
    price_at_purchase: number
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderRequest = await request.json()
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.id !== body.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: body.userId,
        total_amount: body.totalAmount,
        shipping_address: body.shippingAddress,
        status: 'pending',
        payment_status: 'completed',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Add order items
    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      console.error('Error adding order items:', itemsError)
      return NextResponse.json({ error: 'Failed to add order items' }, { status: 500 })
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
