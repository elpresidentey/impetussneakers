import { createClient } from '@/lib/supabase/server'

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  payment_status: string
  payment_reference?: string
  shipping_address?: string
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
}

export async function createOrder(
  userId: string,
  totalAmount: number,
  shippingAddress: string,
  items: Array<{ product_id: string; quantity: number; price_at_purchase: number }>
): Promise<Order | null> {
  const supabase = await createClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      shipping_address: shippingAddress,
      status: 'pending',
      payment_status: 'pending',
    })
    .select()
    .single()

  if (orderError) {
    console.error('Error creating order:', orderError)
    return null
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    ...item,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Error adding order items:', itemsError)
    return null
  }

  return order
}

export async function updateOrderPayment(
  orderId: string,
  paymentReference: string,
  paymentStatus: string
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({
      payment_reference: paymentReference,
      payment_status: paymentStatus,
      status: paymentStatus === 'success' ? 'completed' : 'pending',
    })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order payment:', error)
    return false
  }

  return true
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items(*)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return data || []
}

export async function getOrderById(orderId: string, userId: string): Promise<Order | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items(*)`)
    .eq('id', orderId)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return data
}
