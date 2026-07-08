import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { requireAdminAuth } from '@/lib/auth'
import { rateLimit } from '@/lib/validation'

export async function GET(request: Request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  if (!rateLimit(`admin_orders_${ip}`, 30, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Admin auth required
  const user = requireAdminAuth(request as any)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: orders, error } = await query

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
