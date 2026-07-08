import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const newProducts = [
  {
    name: "Air Jordan 3 Flight Heritage",
    description: "Classic retro basketball sneaker with iconic visible Air cushioning. Features premium leather and textile upper in blue, black, and yellow colorway.",
    price: 185000,
    image_url: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800",
    alt_text: "Air Jordan 3 Flight Heritage in blue, black and yellow",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Blue/Black/Yellow"],
    rating: 5,
    in_stock: true,
    stock_quantity: 25
  },
  {
    name: "Air Jordan 11 Low Bred",
    description: "Iconic low-top silhouette featuring premium patent leather and mesh construction. The timeless Bred colorway with red outsole.",
    price: 220000,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    alt_text: "Air Jordan 11 Low in black with red sole",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Black/Red"],
    rating: 5,
    in_stock: true,
    stock_quantity: 18
  },
  {
    name: "Air Jordan 11 Gamma Blue",
    description: "Premium basketball sneaker with patent leather overlay and mesh upper. Features the legendary Gamma Blue colorway with icy translucent outsole.",
    price: 225000,
    image_url: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800",
    alt_text: "Air Jordan 11 in black with blue translucent sole",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: ["Black/Gamma Blue"],
    rating: 5,
    in_stock: true,
    stock_quantity: 15
  },
  {
    name: "Adidas Samba Classic",
    description: "Timeless indoor soccer shoe turned streetwear icon. Features soft leather upper with signature 3-stripes and gum rubber sole.",
    price: 95000,
    image_url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800",
    alt_text: "Adidas Samba in white with black stripes",
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    colors: ["White/Black"],
    rating: 5,
    in_stock: true,
    stock_quantity: 40
  },
  {
    name: "New Balance 530 Olive Aura",
    description: "Retro running shoe with modern comfort. Features breathable mesh and premium suede in unique olive and lime colorway. ABZORB cushioning for all-day comfort.",
    price: 115000,
    image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800",
    alt_text: "New Balance 530 in olive green with lime accents",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: ["Olive/Lime"],
    rating: 4,
    in_stock: true,
    stock_quantity: 28
  },
  {
    name: "Nike P-6000 Metallic Silver",
    description: "Y2K-inspired running shoe with metallic finishes. Combines mesh and synthetic leather in a bold silver colorway with black and white accents.",
    price: 125000,
    image_url: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800",
    alt_text: "Nike P-6000 in metallic silver with black accents",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Silver/Black/White"],
    rating: 4,
    in_stock: true,
    stock_quantity: 22
  },
  {
    name: "Adidas Stan Smith Forever",
    description: "The legendary tennis shoe that revolutionized casual footwear. Premium white leather with iconic green heel tab and perforated 3-stripes.",
    price: 98000,
    image_url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
    alt_text: "Adidas Stan Smith in white with green heel",
    sizes: ["37", "38", "39", "40", "41", "42", "43", "44", "45"],
    colors: ["White/Green"],
    rating: 5,
    in_stock: true,
    stock_quantity: 50
  },
  {
    name: "Adidas Handball Spezial Blue Yellow",
    description: "Heritage handball silhouette with modern appeal. Features premium suede upper in bold blue with yellow stripes and translucent gum sole.",
    price: 105000,
    image_url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
    alt_text: "Adidas Handball Spezial in blue with yellow stripes",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: ["Blue/Yellow"],
    rating: 5,
    in_stock: true,
    stock_quantity: 20
  }
]

async function addProducts() {
  console.log('Starting to add products...')
  
  for (const product of newProducts) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()

      if (error) {
        console.error(`Error adding ${product.name}:`, error)
      } else {
        console.log(`✓ Added: ${product.name}`)
      }
    } catch (err) {
      console.error(`Failed to add ${product.name}:`, err)
    }
  }
  
  console.log('Done!')
}

addProducts()
