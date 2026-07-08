import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Database connection failed', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      product_count: data,
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { error: 'Database test failed' },
      { status: 500 }
    )
  }
}
