import { supabase } from '../lib/db'

async function removeDuplicateProducts() {
  console.log('🔍 Checking for duplicate products...')

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return
  }

  if (!products) {
    console.log('No products found')
    return
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
  for (const [name, items] of productGroups.entries()) {
    if (items.length > 1) {
      console.log(`\n📦 Found ${items.length} duplicates for: ${name}`)
      items.forEach((item, idx) => {
        console.log(`  ${idx + 1}. ID: ${item.id}, Price: ₦${item.price}, Stock: ${item.stock_quantity}`)
      })
      
      // Keep the first one (lowest ID), mark rest for deletion
      duplicates.push(...items.slice(1))
    }
  }

  if (duplicates.length === 0) {
    console.log('\n✅ No duplicate products found!')
    return
  }

  console.log(`\n⚠️  Found ${duplicates.length} duplicate products to remove`)
  console.log('Products to be deleted:', duplicates.map(p => `ID: ${p.id} - ${p.name}`).join('\n'))

  // Delete duplicates
  const idsToDelete = duplicates.map(p => p.id)
  
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .in('id', idsToDelete)

  if (deleteError) {
    console.error('❌ Error deleting duplicates:', deleteError)
    return
  }

  console.log(`\n✅ Successfully removed ${duplicates.length} duplicate products!`)
}

removeDuplicateProducts()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
