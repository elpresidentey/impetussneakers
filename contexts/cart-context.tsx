'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react'
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
  removeFromCart: (id: number, size?: string, color?: string) => void
  updateQuantity: (id: number, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  isHydrated: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'impetus_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const { addToast } = useToast()
  const { trackEvent } = useAnalytics()

  const getCartStorageKey = (user: { id: string } | null) =>
    user ? `${CART_STORAGE_KEY}_${user.id}` : `${CART_STORAGE_KEY}_guest`

  const storageKey = getCartStorageKey(user)

  // Hydrate cart from localStorage when auth state changes or on mount
  useEffect(() => {
    setIsHydrated(false)

    try {
      const savedCart = localStorage.getItem(storageKey)
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        // Validate that it's an array and has valid items
        if (Array.isArray(parsed) && parsed.every(item => 
          item && 
          typeof item.id === 'number' && 
          typeof item.name === 'string' && 
          typeof item.price === 'number' &&
          typeof item.quantity === 'number' &&
          item.quantity > 0
        )) {
          setCartItems(parsed)
        } else {
          // Clear invalid cart data
          localStorage.removeItem(storageKey)
          setCartItems([])
        }
      } else {
        // Ensure cart starts empty if no saved data
        setCartItems([])
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
      // Clear corrupted data
      localStorage.removeItem(storageKey)
      setCartItems([])
    } finally {
      setIsHydrated(true)
    }
  }, [storageKey])

  // Persist cart to localStorage whenever it changes (but only after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(cartItems))
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error)
      }
    }
  }, [cartItems, isHydrated, storageKey])

  // Optimized add to cart with useCallback
  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev) => {
      // Find existing item with same ID, size, and color
      const existingIndex = prev.findIndex((i) => 
        i.id === item.id && 
        i.size === item.size && 
        i.color === item.color
      )

      if (existingIndex >= 0) {
        // Update existing item quantity
        const newItems = [...prev]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1
        }
        
        addToast(`${item.name} quantity updated`, 'success')
        trackEvent('cart_item_updated', {
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: newItems[existingIndex].quantity,
        })
        
        return newItems
      }

      // Add new item
      addToast(`${item.name} added to cart`, 'success')
      trackEvent('cart_item_added', {
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: 1,
      })
      
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [addToast, trackEvent])

  // Optimized remove from cart
  const removeFromCart = useCallback((id: number, size?: string, color?: string) => {
    setCartItems((prev) => {
      const item = prev.find((i) => 
        i.id === id && 
        (!size || i.size === size) &&
        (!color || i.color === color)
      )
      
      if (item) {
        addToast(`${item.name} removed`, 'success')
        trackEvent('cart_item_removed', {
          product_id: item.id,
          product_name: item.name,
        })
      }

      return prev.filter((i) => 
        !(i.id === id && 
          (!size || i.size === size) &&
          (!color || i.color === color))
      )
    })
  }, [addToast, trackEvent])

  // Optimized update quantity
  const updateQuantity = useCallback((id: number, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color)
      return
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && 
        (!size || item.size === size) &&
        (!color || item.color === color)
          ? { ...item, quantity }
          : item
      )
    )
  }, [removeFromCart])

  // Optimized clear cart
  const clearCart = useCallback(() => {
    setCartItems([])
    trackEvent('cart_cleared', {})
  }, [trackEvent])

  // Memoized computed values
  const cartTotal = useMemo(() => 
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  )

  const cartCount = useMemo(() => 
    cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  )

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    isHydrated,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isHydrated])

  return (
    <CartContext.Provider value={value}>
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
