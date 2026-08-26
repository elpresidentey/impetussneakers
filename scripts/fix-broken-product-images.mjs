import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function loadEnv(file) {
  try {
    const content = readFileSync(path.join(rootDir, file), 'utf8')
    for (const line of content.split('\n')) {
      const match = line.match(/^([A-Z_]+)=(.*)$/)
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim()
      }
    }
  } catch {
    // file may not exist
  }
}

loadEnv('.env.local')
loadEnv('.env')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

const fixes = [
  {
    id: 14,
    name: 'Adidas Samba OG',
    image_url: '/adidas-samba.webp',
  },
  {
    id: 46,
    name: 'Adidas Rivalry Low Shoes',
    image_url:
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 47,
    name: "Nike Air Max 95 'Big Bubble - Slate' 2026",
    image_url:
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 30,
    name: 'Nike P-6000 Metallic Silver',
    image_url:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 48,
    name: "Balenciaga Runner Sneaker 'Graffiti - Black Red'",
    image_url:
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80',
  },
]

for (const fix of fixes) {
  const { data, error } = await supabase
    .from('products')
    .update({ image_url: fix.image_url, updated_at: new Date().toISOString() })
    .eq('id', fix.id)
    .select('id, name, image_url')
    .maybeSingle()

  if (error) {
    console.error(`FAIL id=${fix.id} (${fix.name}): ${error.message}`)
  } else if (!data) {
    console.error(`NOT FOUND id=${fix.id} (${fix.name})`)
  } else {
    const preview =
      data.image_url.length > 80 ? `${data.image_url.slice(0, 80)}...` : data.image_url
    console.log(`OK id=${data.id} "${data.name}" -> ${preview}`)
  }
}
