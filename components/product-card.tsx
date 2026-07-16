'use client'

import { Heart, Eye, ShoppingCart, Check } from 'lucide-react'
import { useState, useCallback } from 'react'
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
  const selectedColor = colors[0] || ''
  const [cartAdded, setCartAdded] = useState(false)
  const [heartBounce, setHeartBounce] = useState(false)

  const handleQuickView = useCallback(() => {
    onQuickView?.({ id, image, name, description, price, alt, sizes, colors, rating, inStock })
  }, [id, image, name, description, price, alt, sizes, colors, rating, inStock, onQuickView])

  const handleAddToCart = useCallback(() => {
    if (!inStock || cartAdded) return
    addToCart({ id, name, price, image, size: selectedSize, color: selectedColor })
    setCartAdded(true)
    setTimeout(() => setCartAdded(false), 800)
  }, [inStock, cartAdded, addToCart, id, name, price, image, selectedSize, selectedColor])

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (isInWishlist(id)) {
      removeFromWishlist(id)
    } else {
      addToWishlist({ id, name, price, image })
      setHeartBounce(true)
      setTimeout(() => setHeartBounce(false), 400)
    }
  }, [id, name, price, image, isInWishlist, removeFromWishlist, addToWishlist])

  return (
    <article
      className="group flex h-full cursor-pointer flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      onClick={handleQuickView}
    >
      <div className="relative aspect-square overflow-hidden bg-[#efede7]">
        <ImageWithFallback
          src={image}
          alt={alt}
          fill
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black/10" />
        )}
        {!inStock && (
          <span className="absolute left-3 top-3 bg-[#c0392b] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-md">
            Sold out
          </span>
        )}
        <div
          className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleWishlist}
            className={`flex h-9 w-9 items-center justify-center bg-white text-black shadow-sm transition-all duration-200 hover:bg-black hover:text-white ${
              isInWishlist(id) ? 'text-red-600 hover:text-red-200' : ''
            }`}
            aria-label={isInWishlist(id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(id) ? 'fill-current' : ''} ${heartBounce ? 'animate-heartBounce' : ''}`} />
          </button>
          <button
            onClick={handleQuickView}
            className="flex h-9 w-9 items-center justify-center bg-white text-black shadow-sm transition-all duration-200 hover:bg-black hover:text-white"
            aria-label={`Quick view ${name}`}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 py-3">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); handleQuickView() }}
            className="text-left text-[15px] font-medium leading-tight text-foreground/70 transition-colors duration-200 hover:text-foreground hover:underline"
          >
            {name}
          </button>
          <p className="text-sm font-bold text-foreground">
            NGN {price.toLocaleString()}
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {sizes.length > 0 ? (
            <div
              className="flex flex-wrap gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              {sizes.slice(0, 4).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-8 border px-2 py-1.5 text-[11px] font-medium transition-all duration-200 sm:py-1 ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-foreground/20 text-foreground/65 hover:border-foreground/50 hover:text-foreground'
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
            onClick={(e) => { e.stopPropagation(); handleAddToCart() }}
            disabled={!inStock}
            className={`flex h-10 w-10 shrink-0 items-center justify-center text-white transition-all duration-200 ${
              cartAdded
                ? 'bg-emerald-600 animate-cartConfirm'
                : 'bg-black hover:bg-foreground/70'
            } disabled:cursor-not-allowed disabled:bg-foreground/20`}
            aria-label={inStock ? `Add ${name} to cart` : `${name} is sold out`}
          >
            {cartAdded ? (
              <Check className="h-4 w-4" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
