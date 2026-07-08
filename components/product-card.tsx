'use client'

import Image from 'next/image'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'
import { ImageWithFallback } from '@/components/image-with-fallback'
import { useState } from 'react'

interface ProductCardProps {
  id: number
  image: string
  name: string
  description: string
  price: number
  alt: string
  sizes?: string[]
  colors?: string[]
  rating?: number
  inStock?: boolean
  onQuickView?: (product: ProductCardProps) => void
}

export function ProductCard({ id, image, name, description, price, alt, sizes = [], colors = [], rating = 0, inStock = true, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [selectedSize, setSelectedSize] = useState(sizes[0] || 'M')
  const [selectedColor, setSelectedColor] = useState(colors[0] || '#000000')

  const handleAddToCart = () => {
    if (!inStock) return
    addToCart({
      id,
      name,
      price,
      image,
      size: selectedSize,
      color: selectedColor,
    })
  }

  const handleWishlist = () => {
    if (isInWishlist(id)) {
      removeFromWishlist(id)
    } else {
      addToWishlist({
        id,
        name,
        price,
        image,
      })
    }
  }

  const handleQuickView = () => {
    if (onQuickView) {
      onQuickView({ id, image, name, description, price, alt, sizes, colors, rating, inStock })
    }
  }
  return (
    <div className="group cursor-pointer flex flex-col h-full" onClick={handleQuickView}>
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-card to-card/30 border border-foreground/10 mb-6 hover:border-foreground/50 transition-all duration-500 hover:shadow-xl hover:shadow-foreground/10 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <ImageWithFallback
          src={image}
          alt={alt}
          fill
          className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Stock Badge - Top Left */}
        {!inStock && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-foreground text-background text-xs font-semibold uppercase tracking-wider">
            Out of Stock
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleWishlist()
            }}
            className={`w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300 shadow-lg hover:scale-110 ${isInWishlist(id) ? 'text-red-500' : ''}`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-4 h-4 ${isInWishlist(id) ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleQuickView()
            }}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300 shadow-lg hover:scale-110"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleAddToCart()
          }}
          disabled={!inStock}
          className={`absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 p-3 ${inStock ? 'bg-foreground text-background hover:bg-foreground/90 cursor-pointer hover:scale-105' : 'bg-foreground/30 text-foreground/50 cursor-not-allowed'} rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg`}
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-sm">{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-foreground transition-colors duration-300 line-clamp-2">
              {name}
            </h3>
            {rating > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            )}
          </div>
          <p className="text-sm text-foreground/60 mt-1 font-normal line-clamp-2">{description}</p>
        </div>

        {sizes.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-foreground/60">Size:</span>
            <div className="flex gap-1 flex-wrap">
              {sizes.slice(0, 6).map((size, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedSize(size)
                  }}
                  className={`text-xs px-2 py-1 rounded transition-all duration-300 hover:scale-110 ${selectedSize === size ? 'bg-foreground text-background' : 'bg-foreground/5 text-foreground hover:bg-foreground/10'}`}
                  aria-label={`Select size ${size}`}
                >
                  {size}
                </button>
              ))}
              {sizes.length > 6 && (
                <span className="text-xs px-2 py-1 text-foreground/60">+{sizes.length - 6}</span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-end justify-between pt-3 border-t border-foreground/10">
          <div>
            <p className="text-xl font-bold text-foreground">₦{(price || 0).toLocaleString()}</p>
          </div>
          <button className="text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors duration-300 flex items-center gap-1">
            View Details
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
