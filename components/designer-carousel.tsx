'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Designer {
  id: string
  name: string
  slug: string
  logo: string
  productCount: number
}

const designers: Designer[] = [
  { id: 'nike', name: 'Nike', slug: 'nike', logo: '/brands/nike.svg', productCount: 6 },
  { id: 'adidas', name: 'Adidas', slug: 'adidas', logo: '/brands/adidas.svg', productCount: 5 },
  { id: 'jordan', name: 'Jordan', slug: 'jordan', logo: '/brands/jordan.svg', productCount: 3 },
  { id: 'new-balance', name: 'New Balance', slug: 'new-balance', logo: '/brands/new-balance.svg', productCount: 2 },
  { id: 'puma', name: 'Puma', slug: 'puma', logo: '/brands/puma.svg', productCount: 2 },
  { id: 'vans', name: 'Vans', slug: 'vans', logo: '/brands/vans.svg', productCount: 2 },
  { id: 'converse', name: 'Converse', slug: 'converse', logo: '/brands/converse.svg', productCount: 2 },
  { id: 'asics', name: 'Asics', slug: 'asics', logo: '/brands/asics.svg', productCount: 1 },
  { id: 'saucony', name: 'Saucony', slug: 'saucony', logo: '/brands/saucony.svg', productCount: 1 },
  { id: 'salomon', name: 'Salomon', slug: 'salomon', logo: '/brands/salomon.svg', productCount: 1 },
  { id: 'hoka', name: 'Hoka', slug: 'hoka', logo: '/brands/hoka.svg', productCount: 1 },
  { id: 'veja', name: 'Veja', slug: 'veja', logo: '/brands/veja.svg', productCount: 1 },
  { id: 'on-running', name: 'On Running', slug: 'on-running', logo: '/brands/on-running.svg', productCount: 1 },
]

export function DesignerCarousel() {
  const [offset, setOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [autoSlide, setAutoSlide] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<number | null>(null)

  const itemWidth = 140
  const gap = 16
  const visibleCount = typeof window !== 'undefined'
    ? window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : 2
    : 6
  const maxOffset = Math.max(0, designers.length - visibleCount)

  const next = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setOffset(prev => {
      const next = prev >= maxOffset ? 0 : prev + 1
      setTimeout(() => setIsAnimating(false), 300)
      return next
    })
  }, [isAnimating, maxOffset])

  const prev = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setOffset(prev => {
      const prevIdx = prev <= 0 ? maxOffset : prev - 1
      setTimeout(() => setIsAnimating(false), 300)
      return prevIdx
    })
  }, [isAnimating, maxOffset])

  useEffect(() => {
    if (!autoSlide) return
    const interval = setInterval(next, 3500)
    return () => clearInterval(interval)
  }, [autoSlide, next])

  useEffect(() => {
    const handleResize = () => {
      const newCount = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : 2
      const newMax = Math.max(0, designers.length - newCount)
      setOffset(prev => Math.min(prev, newMax))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
    setAutoSlide(false)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStartRef.current - touchEnd
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartRef.current = null
    setTimeout(() => setAutoSlide(true), 2000)
  }

  const handleMouseEnter = () => setAutoSlide(false)
  const handleMouseLeave = () => setTimeout(() => setAutoSlide(true), 1000)

  return (
    <section className="relative py-10 md:py-14" aria-label="Designers & Brands">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 md:mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50 mb-2">Curated Partners</p>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.1em] text-foreground">Designers / Brands</h2>
        </div>

        <div
          ref={containerRef}
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex gap-4 overflow-hidden"
            style={{ transform: `translateX(-${offset * (itemWidth + gap)}px)`, transition: isAnimating ? 'transform 300ms ease-out' : 'none' }}
            role="list"
            aria-label="Designer brands"
          >
            {designers.map((designer, i) => (
              <article
                key={designer.id}
                role="listitem"
                className="flex-none w-[140px] shrink-0 transition-opacity duration-300"
                style={{ opacity: isAnimating && (i === offset || i === (offset + 1) % designers.length) ? 0.7 : 1 }}
              >
                <a
                  href={`/shop?brand=${designer.slug}`}
                  className="group block relative aspect-square rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                  aria-label={`Shop ${designer.name} — ${designer.productCount} styles`}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
                    <Image
                      src={designer.logo}
                      alt={`${designer.name} logo`}
                      width={80}
                      height={40}
                      className="object-contain filter grayscale brightness-110 contrast-110 transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:scale-105"
                      unoptimized
                      priority={i < 4}
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <div className="bg-background/95 backdrop-blur-sm rounded-lg p-3 border border-neutral-200 dark:border-neutral-700">
                      <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.15em] text-foreground mb-1">{designer.name}</h3>
                      <p className="text-[10px] md:text-xs text-foreground/60 font-medium">{designer.productCount} {designer.productCount === 1 ? 'style' : 'styles'}</p>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>

          <button
            onClick={prev}
            disabled={isAnimating}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-4 z-10 p-1.5 md:p-2 rounded-full bg-background/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 text-foreground hover:bg-foreground hover:text-background transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            aria-label="Previous brand"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          <button
            onClick={next}
            disabled={isAnimating}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-4 z-10 p-1.5 md:p-2 rounded-full bg-background/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 text-foreground hover:bg-foreground hover:text-background transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            aria-label="Next brand"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          <div className="flex justify-center gap-1.5 mt-6" role="tablist" aria-label="Brand carousel pagination">
            {Array.from({ length: Math.ceil(designers.length / visibleCount) }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (isAnimating) return
                  setIsAnimating(true)
                  setOffset(i * visibleCount)
                  setTimeout(() => setIsAnimating(false), 300)
                }}
                role="tab"
                aria-selected={Math.floor(offset / visibleCount) === i}
                aria-label={`Go to brand group ${i + 1}`}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-200 ${Math.floor(offset / visibleCount) === i ? 'bg-foreground scale-125' : 'bg-foreground/30 hover:bg-foreground/60'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        article { animation: slideIn 0.3s ease-out backwards; }
      `}</style>
    </section>
  )
}