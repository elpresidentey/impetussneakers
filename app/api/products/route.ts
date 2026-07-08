import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { requireAdminAuth } from '@/lib/auth'
import { validateInput, createProductSchema, rateLimit } from '@/lib/validation'

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
  }

  if (validatedData.category !== undefined) {
    payload.category = validatedData.category
  }

  return payload
}

export async function GET() {
  try {
    // Fetch products from database
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // If no products in database, return empty array
    if (!products || products.length === 0) {
      return NextResponse.json([])
    }

    // Transform database fields to match frontend expectations
    const transformedProducts = products.map((product: any) => ({
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
    }))

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  if (!rateLimit(`create_product_${ip}`, 5, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const user = await requireAdminAuth(request as any)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = validateInput(createProductSchema, body)

    const payload = buildProductPayload(validatedData)

    let insertResponse = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single()

    let { data: product, error } = insertResponse

    if (error?.message?.includes("Could not find the 'category'")) {
      delete payload.category
      insertResponse = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single()

      product = insertResponse.data
      error = insertResponse.error
    }

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
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

    return NextResponse.json(transformedProduct, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
