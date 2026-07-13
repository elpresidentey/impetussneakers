import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { requireAdminAuth } from '@/lib/auth'

export async function POST(request: Request) {
  // Admin auth required
  const user = await requireAdminAuth(request as any)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('🔍 Checking for duplicate products...')

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ message: 'No products found', duplicatesRemoved: 0 })
    }

    // Group products by name
    const productGroups = new Map<string, any[]>()
    
    for (const product of products) {
      const key = product.name.toLowerCase().trim()
      if (!productGroups.has(key)) {
        productGroups.set(key, [])
      }
      productGroups.get(key)!.push(product)
    }

    // Find duplicates
    const duplicates: any[] = []
    const duplicateGroups: any[] = []
    
    for (const [name, items] of productGroups.entries()) {
      if (items.length > 1) {
        console.log(`📦 Found ${items.length} duplicates for: ${name}`)
        duplicateGroups.push({
          name,
          count: items.length,
          items: items.map(i => ({ id: i.id, price: i.price, stock: i.stock_quantity }))
        })
        
        // Keep the first one (lowest ID), mark rest for deletion
        duplicates.push(...items.slice(1))
      }
    }

    if (duplicates.length === 0) {
      return NextResponse.json({ 
        message: 'No duplicate products found',
        duplicatesRemoved: 0
      })
    }

    // Delete duplicates
    const idsToDelete = duplicates.map(p => p.id)
    
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', idsToDelete)

    if (deleteError) {
      console.error('❌ Error deleting duplicates:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `Successfully removed ${duplicates.length} duplicate products`,
      duplicatesRemoved: duplicates.length,
      duplicateGroups
    })
  } catch (error) {
    console.error('Error removing duplicates:', error)
    return NextResponse.json(
      { error: 'Failed to remove duplicates' },
      { status: 500 }
    )
  }
}
