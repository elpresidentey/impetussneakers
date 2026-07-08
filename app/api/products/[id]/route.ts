import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { requireAdminAuth } from '@/lib/auth'
import { validateInput, updateProductSchema, rateLimit } from '@/lib/validation'

function normalizeId(id: string) {
  const trimmedId = id.trim()
  const numericId = Number(trimmedId)
  return Number.isNaN(numericId) ? trimmedId : numericId
}

function buildProductPayload(validatedData: any) {
  const payload: any = {
    name: validatedData.name,
    description: validatedData.description,
    price: validatedData.price,
    image_url: validatedData.image_url,
    alt_text: validatedData.alt_text,
    sizes: validatedData.sizes,
    colors: validatedData.colors,
    rating: validatedData.rating,
    in_stock: validatedData.in_stock,
    stock_quantity: validatedData.stock_quantity,
    updated_at: new Date().toISOString(),
  }

  if (validatedData.category !== undefined) {
    payload.category = validatedData.category
  }

  return payload
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lookupId = normalizeId(id)
    const query = supabase
      .from('products')
      .select('*')
      .eq('id', lookupId)
      .maybeSingle()

    const { data: product, error } = await query

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      image: product.image_url,
      alt: product.alt_text,
      sizes: product.sizes,
      colors: product.colors,
      rating: product.rating,
      inStock: product.in_stock,
      stockQuantity: product.stock_quantity,
      category: product.category,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  if (!rateLimit(`update_product_${ip}`, 5, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Admin auth required
  const user = await requireAdminAuth(request as any)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const lookupId = normalizeId(id)
    const body = await request.json()
    
    // Validate input
    const validatedData = validateInput(updateProductSchema, body)

    const payload = buildProductPayload(validatedData)

    let updateResponse = await supabase
      .from('products')
      .update(payload)
      .eq('id', lookupId)
      .select()
      .maybeSingle()

    let { data: product, error } = updateResponse

    if (error?.message?.includes("Could not find the 'category'")) {
      delete payload.category
      updateResponse = await supabase
        .from('products')
        .update(payload)
        .eq('id', lookupId)
        .select()
        .maybeSingle()

      product = updateResponse.data
      error = updateResponse.error
    }

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update product' },
        { status: 500 }
      )
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform response to match frontend expectations
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image_url,
      alt: product.alt_text,
      sizes: product.sizes,
      colors: product.colors,
      rating: product.rating,
      inStock: product.in_stock,
      stockQuantity: product.stock_quantity,
      category: product.category,
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  if (!rateLimit(`delete_product_${ip}`, 5, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Admin auth required
  const user = await requireAdminAuth(request as any)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const lookupId = normalizeId(id)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', lookupId)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete product' },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}