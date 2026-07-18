import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { requireAdminAuth } from '@/lib/auth'
import { rateLimit } from '@/lib/validation'

function normalizeId(id: string) {
  const trimmedId = id.trim()
  const numericId = Number(trimmedId)
  return Number.isNaN(numericId) ? trimmedId : numericId
}

/**
 * Force delete a product and all its related order items
 * WARNING: This will permanently delete order history data
 * Use only for duplicate products or data cleanup
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  if (!rateLimit(`force_delete_product_${ip}`, 3, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Admin auth required
  const user = await requireAdminAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const lookupId = normalizeId(id)
    
    // First, delete all order items referencing this product
    const { error: deleteOrderItemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('product_id', lookupId)

    if (deleteOrderItemsError) {
      console.error('Error deleting order items:', deleteOrderItemsError)
      return NextResponse.json(
        { error: 'Failed to delete associated order items' },
        { status: 500 }
      )
    }

    // Now delete the product
    const { error: deleteProductError } = await supabase
      .from('products')
      .delete()
      .eq('id', lookupId)

    if (deleteProductError) {
      console.error('Error deleting product:', deleteProductError)
      return NextResponse.json(
        { error: deleteProductError.message || 'Failed to delete product' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      message: 'Product and related order items deleted successfully',
      action: 'force_deleted'
    })
  } catch (error) {
    console.error('Error force deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to force delete product' },
      { status: 500 }
    )
  }
}
