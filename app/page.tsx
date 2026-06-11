'use client'

import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-8">
        <div className="text-2xl font-light tracking-widest text-foreground">
          THE IMPETUS
        </div>
        <div className="hidden md:flex items-center gap-12">
          <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Collections
          </a>
          <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            About
          </a>
          <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Shop
          </a>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center cursor-pointer hover:bg-secondary/30 transition-colors" />
          <div className="text-sm font-light text-foreground">0</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen pt-20 flex flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 text-center space-y-8 max-w-4xl">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-foreground text-balance leading-[1.1]">
              Cinematic Sneaker Culture
            </h1>
            <p className="text-lg md:text-2xl text-foreground/60 font-light">
              Enter a digital flagship where storytelling meets luxury retail
            </p>
          </div>
          
          <button className="group inline-flex items-center gap-2 px-8 py-3 border border-secondary/40 rounded-full hover:border-secondary/60 transition-all hover:bg-secondary/10">
            <span className="text-sm font-light text-foreground">Explore Collections</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Hero Image - Featured Sneaker */}
        <div className="relative mt-16 w-full max-w-2xl h-64 md:h-96">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Jordan%2011%20Retro%20Low%20%27Bred%27%202025-FPGKNKIPmaTSL8kKqj5Vtpyeh4O1ww.webp"
            alt="Air Jordan 11 Retro Low Bred 2025"
            fill
            className="object-contain object-center"
            priority
          />
        </div>
      </section>

      {/* Bento Grid - Featured Collections */}
      <section className="px-6 md:px-8 py-20 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
              Curated Collections
            </h2>
            <p className="text-foreground/60 font-light max-w-2xl">
              Discover sneakers grouped by mood, movement, and cultural narrative
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[350px]">
            {/* Large Featured Collection */}
            <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-xl bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 hover:border-secondary/40 transition-all cursor-pointer">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Jordan%203%20%27Brazil-nlurg3RzhF0WnH3ibMGkEvWIAmbtLN.webp"
                alt="Air Jordan 3 Brazil"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <h3 className="text-2xl md:text-3xl font-light text-white mb-2">Retro Energy</h3>
                <p className="text-sm text-white/70">Classic silhouettes reimagined</p>
              </div>
            </div>

            {/* Small Collection Card 1 */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 hover:border-primary/40 transition-all cursor-pointer">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Force%201%20%2707-15gX0zS1VmPIqoL03g0tUljKDLICtY.webp"
                alt="Air Force 1"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-lg font-light text-white">Everyday Rotation</h3>
                <p className="text-xs text-white/70">Clean basics</p>
              </div>
            </div>

            {/* Small Collection Card 2 */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 hover:border-secondary/40 transition-all cursor-pointer">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adizero_evo_sl-removebg-preview-FXuDJVqkP2m2gLRBcdGmWJ03056uEk.png"
                alt="Adidas Adizero"
                fill
                className="object-contain object-center bg-gradient-to-b from-slate-900 to-black group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-lg font-light text-white">Street Motion</h3>
                <p className="text-xs text-white/70">Performance meets style</p>
              </div>
            </div>

            {/* Small Collection Card 3 */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/30 to-transparent border border-slate-600/20 hover:border-slate-600/40 transition-all cursor-pointer">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adillette_comfy_slides-removebg-preview-B074jPi47GC1oDVxviPHdN4H1Ywqn1.png"
                alt="Adidas Slides"
                fill
                className="object-contain object-center bg-gradient-to-b from-slate-800 to-slate-900 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-lg font-light text-white">Comfort First</h3>
                <p className="text-xs text-white/70">Casual luxury</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="px-6 md:px-8 py-20 bg-gradient-to-b from-background via-background to-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
              Latest Drops
            </h2>
            <p className="text-foreground/60 font-light max-w-2xl">
              New releases from our premium selection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product Card 1 */}
            <div className="group cursor-pointer">
              <div className="relative h-80 rounded-lg overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 mb-6 hover:border-slate-600 transition-all">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Jordan%2011-V9DDlPqEsLVbxdUGe8397ekDxiLJ1J.webp"
                  alt="Air Jordan 11"
                  fill
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-light text-foreground group-hover:text-secondary transition-colors">
                  Air Jordan 11 Space Jam
                </h3>
                <p className="text-sm text-foreground/60">Iconic high-top silhouette</p>
                <p className="text-lg font-light text-secondary pt-2">$320</p>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="group cursor-pointer">
              <div className="relative h-80 rounded-lg overflow-hidden bg-white/5 border border-foreground/10 mb-6 hover:border-foreground/20 transition-all">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JH5633_1_FOOTWEAR_Photography_Side_Lateral_Center_View_grey_rxeoq1-n6yswq5h0V79gogTRIQK8Y9vxxdCOD.jpg"
                  alt="Adidas Samba"
                  fill
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-light text-foreground group-hover:text-secondary transition-colors">
                  Adidas Samba OG Heritage
                </h3>
                <p className="text-sm text-foreground/60">Timeless soccer-inspired</p>
                <p className="text-lg font-light text-secondary pt-2">$120</p>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="group cursor-pointer">
              <div className="relative h-80 rounded-lg overflow-hidden bg-gradient-to-br from-green-900/20 to-slate-900 border border-green-700/30 mb-6 hover:border-green-600 transition-all">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Force%201%20%2707-15gX0zS1VmPIqoL03g0tUljKDLICtY.webp"
                  alt="Nike Air Force 1"
                  fill
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-light text-foreground group-hover:text-secondary transition-colors">
                  Air Force 1 &apos;07 Neon
                </h3>
                <p className="text-sm text-foreground/60">Fresh colorway alert</p>
                <p className="text-lg font-light text-secondary pt-2">$110</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom Gallery Section */}
      <section className="px-6 md:px-8 py-20 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
              The Flagship Experience
            </h2>
            <p className="text-foreground/60 font-light max-w-2xl">
              Immersive retail environment reimagined digitally
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-96 md:h-[500px] border border-secondary/20">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diego-jaramillo-W4swGaKFHVQ-unsplash-eweOcZZ12tk00zydKVwmN14tnD2Nae.jpg"
              alt="Showroom Experience"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
              <h3 className="text-3xl md:text-4xl font-light text-white mb-3">Curated Collections</h3>
              <p className="text-white/80 font-light max-w-lg">
                Each shoe tells a story. Discover the culture, inspiration, and heritage behind every drop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-8 py-20 bg-gradient-to-b from-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground text-balance">
              Ready to Explore?
            </h2>
            <p className="text-lg text-foreground/60 font-light">
              Join thousands discovering the future of sneaker retail
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-secondary text-white rounded-lg font-light hover:bg-secondary/80 transition-colors">
              Start Shopping
            </button>
            <button className="px-8 py-3 border border-secondary/40 rounded-lg font-light hover:border-secondary/60 hover:bg-secondary/10 transition-all">
              Learn Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-8 py-12 border-t border-foreground/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-light text-foreground mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-foreground transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Collections</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-light text-foreground mb-4">About</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-foreground transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-light text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-foreground transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-light text-foreground mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-foreground/60 font-light">© 2025 The Impetus. All rights reserved.</p>
            <div className="flex gap-6 mt-6 md:mt-0 text-sm text-foreground/60">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
