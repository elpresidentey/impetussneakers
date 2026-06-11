import { createClient } from '@/lib/supabase/server'

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category?: string
  brand?: string
  stock_quantity: number
  created_at?: string
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function updateProductStock(productId: string, newStock: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ stock_quantity: newStock })
    .eq('id', productId)

  if (error) {
    console.error('Error updating product stock:', error)
    return false
  }

  return true
}
