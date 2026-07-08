import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmoanmrmjmgmjgvgqqpq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptb2FubXJtam1nbWpndmdxcXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTk4NjIsImV4cCI6MjA5NjE3NTg2Mn0.dhhoH7tx9189cAh3831ue5AygIG2xbKIAhjWu9EQoV8'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function cleanupProducts() {
  console.log('Cleaning up products with external URLs...')
  
  // Get all products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
  
  if (error) {
    console.error('Error fetching products:', error)
    return
  }
  
  // Filter products with external URLs (not starting with /)
  const externalUrlProducts = products?.filter(p => !p.image_url.startsWith('/')) || []
  
  console.log(`Found ${externalUrlProducts.length} products with external URLs`)
  
  // Delete products with external URLs
  for (const product of externalUrlProducts) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)
    
    if (error) {
      console.error(`Error deleting ${product.name}:`, error)
    } else {
      console.log(`✓ Deleted ${product.name}`)
    }
  }
  
  console.log('Cleanup complete!')
}

cleanupProducts()
