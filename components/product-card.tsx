'use client'

import { Heart, Eye, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { ImageWithFallback } from '@/components/image-with-fallback'
import { useCart } from '@/contexts/cart-context'
import { useWishlist } from '@/contexts/wishlist-context'

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

export function ProductCard({
  id,
  image,
  name,
  description,
  price,
  alt,
  sizes = [],
  colors = [],
  rating = 0,
  inStock = true,
  onQuickView,
}: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '')
  const [selectedColor] = useState(colors[0] || '')

  const handleQuickView = () => {
    onQuickView?.({ id, image, name, description, price, alt, sizes, colors, rating, inStock })
  }

  const handleAddToCart = () => {
    if (!inStock) return

    addToCart({ id, name, price, image, size: selectedSize, color: selectedColor })
  }

  const handleWishlist = () => {
    if (isInWishlist(id)) {
      removeFromWishlist(id)
      return
    }

    addToWishlist({ id, name, price, image })
  }

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-square overflow-hidden bg-[#efede7]">
        <ImageWithFallback
          src={image}
          alt={alt}
          fill
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {!inStock && (
          <span className="absolute left-3 top-3 bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            Sold out
          </span>
        )}
        <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
          <button
            onClick={handleWishlist}
            className={`flex h-9 w-9 items-center justify-center bg-white text-black shadow-sm transition-colors hover:bg-black hover:text-white ${
              isInWishlist(id) ? 'text-red-600 hover:text-red-200' : ''
            }`}
            aria-label={isInWishlist(id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(id) ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleQuickView}
            className="flex h-9 w-9 items-center justify-center bg-white text-black shadow-sm transition-colors hover:bg-black hover:text-white"
            aria-label={`Quick view ${name}`}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col border-b border-foreground/15 py-4">
        <div className="flex items-start justify-between gap-3">
          <button onClick={handleQuickView} className="text-left text-base font-semibold leading-tight text-foreground hover:underline">
            {name}
          </button>
          <p className="shrink-0 text-sm font-semibold text-foreground">NGN {price.toLocaleString()}</p>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/60">{description}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          {sizes.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {sizes.slice(0, 4).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-8 border px-2 py-1 text-[11px] font-medium transition-colors ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-foreground/20 text-foreground/65 hover:border-black hover:text-black'
                  }`}
                  aria-label={`Select size ${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-xs uppercase tracking-[0.12em] text-foreground/45">Available now</span>
          )}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="flex h-10 w-10 shrink-0 items-center justify-center bg-black text-white transition-colors hover:bg-foreground/70 disabled:cursor-not-allowed disabled:bg-foreground/20"
            aria-label={inStock ? `Add ${name} to cart` : `${name} is sold out`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  )
}
