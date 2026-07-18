import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { requireAdminAuth } from '@/lib/auth'
import { rateLimit } from '@/lib/validation'

export async function GET(request: Request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  if (!rateLimit(`inventory_${ip}`, 30, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Admin auth required for inventory access
  const user = await requireAdminAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const lowStock = searchParams.get('low_stock') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase.from('products').select('*').order('stock_quantity', { ascending: true }).limit(limit)

    if (lowStock) {
      query = query.lte('stock_quantity', 10)
    }

    const { data: products, error } = await query

    if (error) throw error

    return NextResponse.json(products || [])
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}
