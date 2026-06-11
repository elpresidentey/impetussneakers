'use client'

import Image from 'next/image'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { CollectionCard } from '@/components/collection-card'

const products = [
  {
    id: 1,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Jordan%2011-V9DDlPqEsLVbxdUGe8397ekDxiLJ1J.webp',
    name: 'Air Jordan 11 Space Jam',
    description: 'Iconic high-top silhouette',
    price: 320,
    alt: 'Air Jordan 11',
  },
  {
    id: 2,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JH5633_1_FOOTWEAR_Photography_Side_Lateral_Center_View_grey_rxeoq1-n6yswq5h0V79gogTRIQK8Y9vxxdCOD.jpg',
    name: 'Adidas Samba OG Heritage',
    description: 'Timeless soccer-inspired',
    price: 120,
    alt: 'Adidas Samba',
  },
  {
    id: 3,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Force%201%20%2707-15gX0zS1VmPIqoL03g0tUljKDLICtY.webp',
    name: 'Air Force 1 &apos;07 Neon',
    description: 'Fresh colorway alert',
    price: 110,
    alt: 'Nike Air Force 1',
  },
  {
    id: 4,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Jordan%2011%20Retro%20Low%20%27Bred%27%202025-FPGKNKIPmaTSL8kKqj5Vtpyeh4O1ww.webp',
    name: 'Air Jordan 11 Retro Low Bred',
    description: 'Classic red and black',
    price: 280,
    alt: 'Air Jordan 11 Retro Low Bred',
  },
  {
    id: 5,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adizero_evo_sl-removebg-preview-FXuDJVqkP2m2gLRBcdGmWJ03056uEk.png',
    name: 'Adidas Adizero EVO SL',
    description: 'Performance racing shoe',
    price: 200,
    alt: 'Adidas Adizero',
  },
  {
    id: 6,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Jordan%203%20%27Brazil-nlurg3RzhF0WnH3ibMGkEvWIAmbtLN.webp',
    name: 'Air Jordan 3 Brazil',
    description: 'Vibrant retro colorway',
    price: 240,
    alt: 'Air Jordan 3 Brazil',
  },
]

const collections = [
  {
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Jordan%203%20%27Brazil-nlurg3RzhF0WnH3ibMGkEvWIAmbtLN.webp',
    title: 'Retro Energy',
    subtitle: 'Classic silhouettes reimagined',
    alt: 'Retro Energy',
    featured: true,
  },
  {
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Force%201%20%2707-15gX0zS1VmPIqoL03g0tUljKDLICtY.webp',
    title: 'Everyday Rotation',
    subtitle: 'Clean basics for every day',
    alt: 'Everyday Rotation',
  },
  {
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adizero_evo_sl-removebg-preview-FXuDJVqkP2m2gLRBcdGmWJ03056uEk.png',
    title: 'Street Motion',
    subtitle: 'Performance meets style',
    alt: 'Street Motion',
  },
  {
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adillette_comfy_slides-removebg-preview-B074jPi47GC1oDVxviPHdN4H1Ywqn1.png',
    title: 'Comfort First',
    subtitle: 'Casual luxury for everyday',
    alt: 'Comfort First',
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 flex flex-col items-center justify-center overflow-hidden px-6 md:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          {/* Hero Content */}
          <div className="text-center space-y-6 md:space-y-8 mb-12 md:mb-16">
            <div className="space-y-3 md:space-y-5">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-foreground text-balance leading-[1.05]">
                Cinematic Sneaker Culture
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/70 font-light max-w-2xl mx-auto">
                Enter a digital flagship where storytelling meets luxury retail. Every shoe tells a story.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-secondary text-white rounded-lg font-light hover:bg-secondary/90 transition-all duration-300 hover:gap-3">
                <span className="text-sm">Explore Collections</span>
                <ArrowRight className="w-4 h-4 transition-transform" />
              </button>
              <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-foreground/20 rounded-lg font-light hover:border-secondary/40 hover:bg-secondary/5 transition-all duration-300">
                <span className="text-sm">Learn More</span>
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative w-full max-w-3xl aspect-square md:aspect-auto md:h-96 rounded-2xl overflow-hidden border border-foreground/10">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Jordan%2011%20Retro%20Low%20%27Bred%27%202025-FPGKNKIPmaTSL8kKqj5Vtpyeh4O1ww.webp"
              alt="Air Jordan 11 Retro Low Bred 2025"
              fill
              className="object-contain object-center bg-gradient-to-b from-card to-card/50"
              priority
            />
          </div>
        </div>
      </section>

      {/* Collections Bento Grid */}
      <section id="collections" className="px-6 md:px-8 py-20 md:py-32 bg-background border-t border-foreground/10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-4 text-balance">
              Curated Collections
            </h2>
            <p className="text-base md:text-lg text-foreground/60 font-light max-w-2xl">
              Discover sneakers grouped by mood, movement, and cultural narrative. Each collection tells a unique story.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 auto-rows-[280px] sm:auto-rows-[320px] md:auto-rows-[380px]">
            {collections.map((collection, idx) => (
              <div
                key={idx}
                className={`${collection.featured ? 'sm:col-span-2 md:row-span-2' : ''}`}
              >
                <CollectionCard {...collection} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Drops - Product Grid */}
      <section id="shop" className="px-6 md:px-8 py-20 md:py-32 bg-gradient-to-b from-background to-card/30">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-4 text-balance">
              Latest Drops
            </h2>
            <p className="text-base md:text-lg text-foreground/60 font-light max-w-2xl">
              New releases curated from our premium selection, updated regularly with exclusive pairs.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Experience */}
      <section className="px-6 md:px-8 py-20 md:py-32 bg-background border-t border-foreground/10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-4 text-balance">
              The Flagship Experience
            </h2>
            <p className="text-base md:text-lg text-foreground/60 font-light max-w-2xl">
              Immersive retail environment reimagined digitally for the modern sneaker enthusiast.
            </p>
          </div>

          {/* Gallery Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-video md:aspect-[16/9] border border-foreground/10 group cursor-pointer">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diego-jaramillo-W4swGaKFHVQ-unsplash-eweOcZZ12tk00zydKVwmN14tnD2Nae.jpg"
              alt="Showroom Experience"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-white mb-3 text-balance">
                Curated Collections
              </h3>
              <p className="text-white/80 font-light max-w-xl text-sm md:text-base">
                Each shoe tells a story. Discover the culture, inspiration, and heritage behind every drop. Our flagship
                brings the sneaker experience to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-8 py-20 md:py-32 bg-gradient-to-b from-background via-secondary/5 to-background border-y border-foreground/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground text-balance">
              Ready to Explore?
            </h2>
            <p className="text-base md:text-lg text-foreground/60 font-light max-w-2xl mx-auto">
              Join thousands discovering the future of sneaker retail. From classic retros to latest releases, find your
              next grail.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="w-full sm:w-auto px-10 py-3.5 bg-secondary text-white rounded-lg font-light hover:bg-secondary/90 transition-all duration-300">
              Start Shopping
            </button>
            <button className="w-full sm:w-auto px-10 py-3.5 border border-foreground/20 rounded-lg font-light hover:border-secondary/40 hover:bg-secondary/5 transition-all duration-300">
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-8 py-12 md:py-16 border-t border-foreground/10 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 md:mb-16">
            <div>
              <h4 className="font-light text-foreground text-sm md:text-base mb-4 md:mb-6">Shop</h4>
              <ul className="space-y-2.5 md:space-y-3">
                <li>
                  <a href="#" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Collections
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Sale
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-light text-foreground text-sm md:text-base mb-4 md:mb-6">About</h4>
              <ul className="space-y-2.5 md:space-y-3">
                <li>
                  <a href="#" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-light text-foreground text-sm md:text-base mb-4 md:mb-6">Support</h4>
              <ul className="space-y-2.5 md:space-y-3">
                <li>
                  <a href="#" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-light text-foreground text-sm md:text-base mb-4 md:mb-6">Connect</h4>
              <ul className="space-y-2.5 md:space-y-3">
                <li>
                  <a href="#" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-foreground/60 hover:text-foreground transition-colors duration-200">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-foreground/10 pt-8 md:pt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
            <p className="text-xs md:text-sm text-foreground/60 font-light">
              © 2025 The Impetus. All rights reserved.
            </p>
            <div className="flex gap-6 md:gap-8 text-xs md:text-sm text-foreground/60">
              <a href="#" className="hover:text-foreground transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
