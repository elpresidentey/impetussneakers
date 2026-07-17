'use client'

import { useState, useCallback, useEffect } from 'react'
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
]

export function DesignerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [autoSlide, setAutoSlide] = useState(true)

  const visibleCount = typeof window !== 'undefined' ? (window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 3 : 1) : 5
  const maxIndex = designers.length - visibleCount

  const next = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex(prev => {
      const nextIndex = prev >= maxIndex ? 0 : prev + 1
      setTimeout(() => setIsAnimating(false), 300)
      return nextIndex
    })
  }, [isAnimating, maxIndex])

  const prev = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex(prev => {
      const prevIndex = prev <= 0 ? maxIndex : prev - 1
      setTimeout(() => setIsAnimating(false), 300)
      return prevIndex
    })
  }, [isAnimating, maxIndex])

  const goTo = useCallback((index: number) => {
    if (isAnimating || index < 0 || index > maxIndex) return
    setIsAnimating(true)
    setCurrentIndex(index)
    setTimeout(() => setIsAnimating(false), 300)
  }, [isAnimating, maxIndex])

  useEffect(() => {
    if (!autoSlide) return
    const interval = setInterval(next, 4000)
    return () => clearInterval(interval)
  }, [autoSlide, next])

  useEffect(() => {
    const handleResize = () => {
      const newCount = window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 3 : 1
      const newMax = designers.length - newCount
      setCurrentIndex(prev => Math.min(prev, Math.max(0, newMax)))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
    setAutoSlide(false)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev()
    }
    setTouchStart(null)
    setTimeout(() => setAutoSlide(true), 3000)
  }

  const handleMouseEnter = () => setAutoSlide(false)
  const handleMouseLeave = () => setTimeout(() => setAutoSlide(true), 1000)

  const visibleDesigners = designers.slice(currentIndex, currentIndex + visibleCount)

  return (
    <section className="relative py-16 md:py-24 overflow-hidden" aria-label="Designers & Brands">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 md:mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50 mb-3">Curated Partners</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-[0.15em] text-foreground">
            Designers <span className="text-foreground/30">/</span> Brands
          </h2>
          <p className="mt-3 text-base md:text-lg text-foreground/60 max-w-2xl mx-auto">
            Every label in our edit is hand-selected for craft, culture, and provenance.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="flex gap-6 md:gap-8 overflow-hidden"
            role="list"
            aria-label="Designer brands"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {visibleDesigners.map((designer, i) => (
              <article
                key={designer.id}
                role="listitem"
                className={`
                  flex-none w-[calc((100%-4rem)/5)] md:w-[calc((100%-3rem)/3)] sm:w-[calc((100%-1.5rem)/2)] 
                  transition-all duration-300 ease-out
                  ${isAnimating ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}
                `}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <a
                  href={`/shop?brand=${designer.slug}`}
                  className="group block relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700 transition-all duration-500 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-xl"
                  aria-label={`Shop ${designer.name} — ${designer.productCount} styles`}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
                    <Image
                      src={designer.logo}
                      alt={`${designer.name} logo`}
                      width={120}
                      height={60}
                      className={`
                        object-contain filter grayscale brightness-110 contrast-110
                        transition-all duration-500 ease-out
                        group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:scale-110
                      `}
                      unoptimized
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="bg-background/95 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-neutral-200 dark:border-neutral-700">
                      <h3 className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-foreground mb-1">
                        {designer.name}
                      </h3>
                      <p className="text-xs md:text-sm text-foreground/60 font-medium">
                        {designer.productCount} {designer.productCount === 1 ? 'style' : 'styles'} available
                      </p>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>

          <button
            onClick={prev}
            disabled={isAnimating}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-4 z-10 p-2 md:p-3 rounded-full bg-background/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 text-foreground hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            aria-label="Previous designer"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <button
            onClick={next}
            disabled={isAnimating}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-4 z-10 p-2 md:p-3 rounded-full bg-background/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 text-foreground hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            aria-label="Next designer"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Designer carousel pagination">
            {Array.from({ length: Math.ceil(designers.length / visibleCount) }, (_, i) => (
              <button
                key={i}
                onClick={() => goTo(i * visibleCount)}
                role="tab"
                aria-selected={Math.floor(currentIndex / visibleCount) === i}
                aria-label={`Go to designer group ${i + 1}`}
                className={`
                  w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300
                  ${Math.floor(currentIndex / visibleCount) === i
                    ? 'bg-foreground scale-125'
                    : 'bg-foreground/30 hover:bg-foreground/60'}
                `}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        article {
          animation: slideIn 0.4s ease-out backwards;
        }
      `}</style>
    </section>
  )
}