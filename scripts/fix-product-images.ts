import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmoanmrmjmgmjgvgqqpq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptb2FubXJtam1nbWpndmdxcXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTk4NjIsImV4cCI6MjA5NjE3NTg2Mn0.dhhoH7tx9189cAh3831ue5AygIG2xbKIAhjWu9EQoV8'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function fixProductImages() {
  console.log('Fixing product images to use local paths...')
  
  // Get all products with external URLs
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .not('image_url', 'like', '/%')
  
  if (error) {
    console.error('Error fetching products:', error)
    return
  }
  
  console.log(`Found ${products?.length || 0} products with external URLs`)
  
  // Map products to local image paths based on name
  const imageMap: { [key: string]: string } = {
    'Adillette Premium Slides': '/adillette-comfy-slides-transparent.png',
    'Nike Dunk Low Retro': '/nike-dunk-low-transparent.png',
    'Adidas Samba OG Heritage': '/adidas-samba.webp',
  }
  
  for (const product of products || []) {
    const localImage = imageMap[product.name]
    
    if (!localImage) {
      console.log(`Skipping ${product.name} - no local image mapping`)
      continue
    }
    
    const { error } = await supabase
      .from('products')
      .update({ image_url: localImage })
      .eq('id', product.id)
    
    if (error) {
      console.error(`Error updating ${product.name}:`, error)
    } else {
      console.log(`✓ Updated ${product.name} to use ${localImage}`)
    }
  }
  
  console.log('Fix complete!')
}

fixProductImages()
