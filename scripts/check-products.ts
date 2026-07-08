import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmoanmrmjmgmjgvgqqpq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptb2FubXJtam1nbWpndmdxcXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTk4NjIsImV4cCI6MjA5NjE3NTg2Mn0.dhhoH7tx9189cAh3831ue5AygIG2xbKIAhjWu9EQoV8'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkProducts() {
  console.log('Checking products in database...')
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
  
  if (error) {
    console.error('Error fetching products:', error)
    return
  }
  
  console.log(`Found ${products?.length || 0} products in database`)
  
  if (products && products.length > 0) {
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   Image: ${product.image_url}`)
      console.log(`   Price: ₦${product.price}`)
      console.log(`   In Stock: ${product.in_stock}`)
      console.log('')
    })
  }
}

checkProducts()
