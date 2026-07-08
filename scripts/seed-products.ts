import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jmoanmrmjmgmjgvgqqpq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptb2FubXJtam1nbWpndmdxcXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTk4NjIsImV4cCI6MjA5NjE3NTg2Mn0.dhhoH7tx9189cAh3831ue5AygIG2xbKIAhjWu9EQoV8'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const products = [
  {
    name: 'Air Jordan 11 Retro Space Jam',
    description: 'Legendary silhouette with premium leather upper',
    price: 320000,
    image_url: '/air-jordan-11.webp',
    alt_text: 'Air Jordan 11 Retro Space Jam',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['#000000', '#FFFFFF', '#0000FF'],
    rating: 5,
    in_stock: true,
    stock_quantity: 50,
  },
  {
    name: 'Adidas Samba OG',
    description: 'Classic soccer-inspired design with premium suede',
    price: 120000,
    image_url: '/adidas-samba.webp',
    alt_text: 'Adidas Samba OG',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['#000000', '#FFFFFF'],
    rating: 4,
    in_stock: true,
    stock_quantity: 40,
  },
  {
    name: 'Nike Air Force 1 \'07',
    description: 'Iconic basketball classic with clean lines',
    price: 110000,
    image_url: '/air-force-1.webp',
    alt_text: 'Nike Air Force 1 07',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['#00FF00', '#000000'],
    rating: 4,
    in_stock: true,
    stock_quantity: 35,
  },
  {
    name: 'Air Jordan 11 Retro Low',
    description: 'Premium low-top with patent leather accents',
    price: 280000,
    image_url: '/jordan-low.png',
    alt_text: 'Air Jordan 11 Retro Low',
    sizes: ['8', '9', '10', '11', '12'],
    colors: ['#000000', '#FF0000'],
    rating: 5,
    in_stock: true,
    stock_quantity: 25,
  },
  {
    name: 'Adidas Adizero Evo SL',
    description: 'Elite racing shoe with carbon fiber plate',
    price: 200000,
    image_url: '/adizero-evo-sl.jpg',
    alt_text: 'Adidas Adizero Evo SL',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['#FFFFFF', '#000000'],
    rating: 4,
    in_stock: true,
    stock_quantity: 30,
  },
  {
    name: 'Air Jordan 3 Retro',
    description: 'Elephant print detailing with premium leather',
    price: 240000,
    image_url: '/air-jordan-3.webp',
    alt_text: 'Air Jordan 3 Retro',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['#00FF00', '#FFFF00', '#000000'],
    rating: 5,
    in_stock: false,
    stock_quantity: 0,
  },
  {
    name: 'New Balance 574 Legacy',
    description: 'Heritage running shoe with suede and mesh',
    price: 95000,
    image_url: '/new-balance-574-transparent.png',
    alt_text: 'New Balance 574 Legacy',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    colors: ['#808080', '#000000', '#FFFFFF'],
    rating: 4,
    in_stock: true,
    stock_quantity: 45,
  },
  {
    name: 'Nike Dunk Low Retro',
    description: 'Vintage basketball aesthetic with premium materials',
    price: 135000,
    image_url: '/nike-dunk-low-transparent.png',
    alt_text: 'Nike Dunk Low Retro',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['#FFFFFF', '#FF69B4', '#90EE90'],
    rating: 4,
    in_stock: true,
    stock_quantity: 28,
  },
  {
    name: 'Air Jordan 1 Retro High',
    description: 'Original high-top with premium leather construction',
    price: 180000,
    image_url: '/air-jordan-11.webp',
    alt_text: 'Air Jordan 1 Retro High',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['#000000', '#FFFFFF', '#FF0000'],
    rating: 4,
    in_stock: true,
    stock_quantity: 32,
  },
  {
    name: 'Adidas Adilette Comfort',
    description: 'Premium slides with cloudfoam comfort',
    price: 45000,
    image_url: '/adillette-comfy-slides.jpg',
    alt_text: 'Adidas Adilette Comfort',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    colors: ['#000000', '#FFFFFF', '#FF0000'],
    rating: 3,
    in_stock: true,
    stock_quantity: 60,
  },
  {
    name: 'Adidas Adilette Premium',
    description: 'Luxury slides with premium leather upper',
    price: 65000,
    image_url: '/adillette-comfy-slides-transparent.png',
    alt_text: 'Adidas Adilette Premium',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['#000000', '#FFFFFF', '#0000FF'],
    rating: 4,
    in_stock: true,
    stock_quantity: 40,
  },
  {
    name: 'Nike Air Max 90 Essential',
    description: 'Visible Air unit with premium leather upper',
    price: 145000,
    image_url: '/nike-air-max-90.webp',
    alt_text: 'Nike Air Max 90 Essential',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['#FFFFFF', '#000000', '#FF0000'],
    rating: 5,
    in_stock: true,
    stock_quantity: 38,
  },
]

async function seedProducts() {
  console.log('Seeding products...')
  
  for (const product of products) {
    const { error } = await supabase.from('products').insert(product)
    if (error) {
      console.error(`Error inserting ${product.name}:`, error)
    } else {
      console.log(`✓ Inserted ${product.name}`)
    }
  }
  
  console.log('Seeding complete!')
}

seedProducts()
