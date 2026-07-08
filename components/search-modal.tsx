'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Search } from 'lucide-react'
import Image from 'next/image'
import { ImageWithFallback } from '@/components/image-with-fallback'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  products: Array<{
    id: number
    name: string
    description: string
    price: number
    image: string
    alt: string
    inStock?: boolean
  }>
  onProductClick?: (product: any) => void
}

export function SearchModal({ isOpen, onClose, products, onProductClick }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus management
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          if (focusableElements) {
            const firstElement = focusableElements[0] as HTMLElement
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault()
                lastElement.focus()
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault()
                firstElement.focus()
              }
            }
          }
        } else if (e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleTab)
      return () => document.removeEventListener('keydown', handleTab)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div ref={modalRef} className="relative bg-background rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-foreground/10">
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-foreground/60" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder-foreground/40 outline-none text-lg"
              autoFocus
            />
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-4">
          {searchQuery === '' ? (
            <p className="text-center text-foreground/60 py-8">Start typing to search products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-foreground/60 py-8">No products found</p>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onProductClick?.(product)
                    onClose()
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-foreground/5 transition-colors text-left"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-card to-card/30 border border-foreground/10 flex-shrink-0">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.alt}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                    <p className="text-sm text-foreground/60 truncate">{product.description}</p>
                    <p className="text-lg font-bold text-foreground mt-1">₦{product.price.toLocaleString()}</p>
                  </div>
                  {!product.inStock && (
                    <span className="px-2 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-medium">Out of Stock</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
