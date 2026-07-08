'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useToast } from './toast-context'
import { useAnalytics } from './analytics-context'
import { useAuth } from './auth-context'

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { addToast } = useToast()
  const { trackEvent } = useAnalytics()
  const { user, token } = useAuth()

  // Clear cart from localStorage on mount to start fresh
  useEffect(() => {
    localStorage.removeItem('cart')
  }, [])

  // Sync cart with backend when user is authenticated
  useEffect(() => {
    if (user && token) {
      // In a real app, you would sync cart with backend here
      // For MVP, we'll keep localStorage as primary storage
      console.log('User authenticated, could sync cart with backend')
    }
  }, [user, token])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Only save to localStorage, don't persist between sessions
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [cartItems])

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev) => {
      // Check if item exists with same ID, size, and color
      const existing = prev.find((i) => 
        i.id === item.id && 
        i.size === item.size && 
        i.color === item.color
      )
      if (existing) {
        addToast(`${item.name} quantity updated in cart`, 'success')
        trackEvent('cart_item_updated', {
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: existing.quantity + 1,
          size: item.size,
          color: item.color,
        })
        return prev.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        )
      }
      addToast(`${item.name} added to cart`, 'success')
      trackEvent('cart_item_added', {
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: 1,
        size: item.size,
        color: item.color,
      })
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) {
        addToast(`${item.name} removed from cart`, 'success')
        trackEvent('cart_item_removed', {
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })
      }
      return prev.filter((item) => item.id !== id)
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
    trackEvent('cart_cleared', {})
  }

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
