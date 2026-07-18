import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    const imageUpdates = [
      { name: 'Air Jordan 11 Space Jam', image_url: '/air-jordan-11.webp' },
      { name: 'Adidas Samba OG Heritage', image_url: '/adidas-samba.webp' },
      { name: 'Air Force 1 \'07 Neon', image_url: '/air-force-1.webp' },
      { name: 'Air Jordan 11 Retro Low Bred', image_url: '/air-jordan-11.webp' },
      { name: 'Adidas Adizero EVO SL', image_url: '/adizero-evo-sl.jpg' },
      { name: 'Air Jordan 3 Brazil', image_url: '/air-jordan-3.webp' },
      { name: 'New Balance 574 Classic', image_url: '/new-balance-574-transparent.png' },
      { name: 'Nike Dunk Low Retro', image_url: '/nike-dunk-low-transparent.png' },
      { name: 'Jordan Low OG', image_url: '/jordan-low.png' },
      { name: 'Adillette Comfy Slides', image_url: '/adillette-comfy-slides-transparent.png' },
      { name: 'Adillette Premium Slides', image_url: '/adillette-comfy-slides.jpg' },
      { name: 'Nike Air Max 90', image_url: '/nike-air-max-90.webp' },
    ]

    const results = []
    
    for (const update of imageUpdates) {
      const { error } = await supabase
        .from('products')
        .update({ image_url: update.image_url })
        .eq('name', update.name)
      
      results.push({
        name: update.name,
        image_url: update.image_url,
        success: !error,
        error: error?.message
      })
    }

    return NextResponse.json({ 
      success: true, 
      results 
    })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update images' },
      { status: 500 }
    )
  }
}
