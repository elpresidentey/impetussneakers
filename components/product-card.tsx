import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  image: string
  name: string
  description: string
  price: number
  alt: string
}

export function ProductCard({ image, name, description, price, alt }: ProductCardProps) {
  return (
    <div className="group">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-card to-card/50 border border-foreground/10 mb-5 hover:border-secondary/40 transition-all duration-300">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
        />
        <button
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 bg-secondary text-white rounded-lg hover:bg-secondary/90"
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-base md:text-lg font-light text-foreground group-hover:text-secondary transition-colors duration-200">
            {name}
          </h3>
          <p className="text-sm text-foreground/60 mt-1">{description}</p>
        </div>

        <div className="flex items-end justify-between pt-2 border-t border-foreground/10">
          <p className="text-lg font-light text-secondary">${price}</p>
          <button className="text-xs font-light text-foreground/60 hover:text-secondary transition-colors duration-200">
            VIEW
          </button>
        </div>
      </div>
    </div>
  )
}
