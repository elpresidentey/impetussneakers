import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmoanmrmjmgmjgvgqqpq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptb2FubXJtam1nbWpndmdxcXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTk4NjIsImV4cCI6MjA5NjE3NTg2Mn0.dhhoH7tx9189cAh3831ue5AygIG2xbKIAhjWu9EQoV8'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function removeDuplicates() {
  console.log('Removing duplicate products...')
  
  // Get all products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
  
  if (error) {
    console.error('Error fetching products:', error)
    return
  }
  
  // Group by name to find duplicates
  const nameMap: { [key: string]: any[] } = {}
  products?.forEach(p => {
    if (!nameMap[p.name]) {
      nameMap[p.name] = []
    }
    nameMap[p.name].push(p)
  })
  
  // Find and remove duplicates (keep the first one)
  for (const [name, productList] of Object.entries(nameMap)) {
    if (productList.length > 1) {
      console.log(`Found ${productList.length} duplicates of "${name}"`)
      
      // Keep the first one, delete the rest
      for (let i = 1; i < productList.length; i++) {
        const product = productList[i]
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', product.id)
        
        if (error) {
          console.error(`Error deleting duplicate ${name}:`, error)
        } else {
          console.log(`✓ Deleted duplicate ${name} (ID: ${product.id})`)
        }
      }
    }
  }
  
  console.log('Duplicate removal complete!')
}

removeDuplicates()
