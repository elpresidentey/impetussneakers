'use client'

import { useCart } from '@/contexts/cart-context'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { ImageWithFallback } from '@/components/image-with-fallback'
import { useEffect, useRef } from 'react'

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
}

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: (items: CartItem[]) => void
}

export function CartModal({ isOpen, onClose, onCheckout }: CartModalProps) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, isHydrated } = useCart()
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  
  const shippingCost = 2000
  const taxAmount = Math.round(cartTotal * 0.05)
  const finalTotal = cartTotal + shippingCost + taxAmount

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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div ref={modalRef} className="relative bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-foreground/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Your Cart</h2>
            <span className="px-3 py-1 bg-foreground/10 rounded-full text-sm font-semibold text-foreground">
              {cartItems.length} items
            </span>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-foreground/20 mb-4" />
              <p className="text-lg text-foreground/60">Your cart is empty</p>
              <p className="text-sm text-foreground/40 mt-2">Add some items to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex gap-4 p-4 rounded-xl bg-foreground/5 border border-foreground/10">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-card to-card/30 border border-foreground/10 flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <span>Size: {item.size || 'M'}</span>
                      {item.color && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <span>Color:</span>
                            <div className="w-3 h-3 rounded-full border border-foreground/20" style={{ backgroundColor: item.color }} />
                          </div>
                        </>
                      )}
                    </div>
                    <p className="text-lg font-bold text-foreground mt-1">₦{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                        className="w-8 h-8 rounded-lg bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                        className="w-8 h-8 rounded-lg bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-foreground/10 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Subtotal</span>
                <span className="text-foreground">₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Shipping</span>
                <span className="text-foreground">₦{shippingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Tax (5%)</span>
                <span className="text-foreground">₦{taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-foreground">₦{finalTotal.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => onCheckout(cartItems)}
              className="w-full px-8 py-4 bg-foreground text-background rounded-none font-semibold hover:bg-foreground/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-foreground/25 relative overflow-hidden"
            >
              <span className="relative z-10">Proceed to Checkout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
