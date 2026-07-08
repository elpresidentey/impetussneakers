import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      items, 
      shipping_address, 
      billing_address, 
      shipping_cost = 0, 
      tax_amount = 0,
      customer_email
    } = body

    console.log('Received order request:', { user_id, items_count: items?.length })

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const total_amount = subtotal + shipping_cost + tax_amount

    // Generate order number
    const order_number = `IMP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Create order - NEVER include user_id to avoid UUID/bigint issues
    const orderData: any = {
      order_number,
      subtotal,
      shipping_cost,
      tax_amount,
      total_amount,
      shipping_address,
      billing_address,
      status: 'pending',
      payment_status: 'pending',
    }

    // Completely omit user_id for now to prevent any UUID issues
    // In production, implement proper user authentication

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      throw orderError
    }

    // Create order items
    for (const item of items) {
      console.log('Creating order item:', item)
      const productId = parseInt(String(item.product_id))
      
      if (isNaN(productId)) {
        console.error('Invalid product_id:', item.product_id, 'Type:', typeof item.product_id)
        throw new Error(`Invalid product_id: ${item.product_id} (type: ${typeof item.product_id})`)
      }
      
      const orderItemData = {
        order_id: order.id,
        product_id: productId,
        product_name: item.product_name,
        product_image: item.product_image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }
      
      console.log('Inserting order item:', orderItemData)
      
      const { error: itemError } = await supabase
        .from('order_items')
        .insert(orderItemData)

      if (itemError) {
        console.error('Order item insertion error:', itemError)
        throw itemError
      }

      // Update product stock
      const { data: product } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', item.product_id)
        .single()

      if (product) {
        const newStock = Math.max(0, product.stock_quantity - item.quantity)
        const { error: stockError } = await supabase
          .from('products')
          .update({
            stock_quantity: newStock,
            in_stock: newStock > 0,
          })
          .eq('id', item.product_id)

        if (stockError) throw stockError
      }
    }

    // Send order confirmation email if customer email provided
    if (customer_email) {
      try {
        await sendOrderConfirmationEmail(customer_email, order_number, total_amount)
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError)
        // Don't fail the order if email fails
      }
    }

    return NextResponse.json({ 
      order_id: order.id, 
      order_number: order.order_number,
      total_amount: order.total_amount 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    // If no user_id provided, return empty array (for non-authenticated users)
    if (!user_id) {
      return NextResponse.json([])
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          product_name,
          product_image,
          price,
          quantity,
          size,
          color
        )
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(orders || [])
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
