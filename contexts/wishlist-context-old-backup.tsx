'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useAnalytics } from './analytics-context'

interface WishlistItem {
  id: number
  name: string
  price: number
  image: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: number) => void
  isInWishlist: (id: number) => boolean
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const { trackEvent } = useAnalytics()

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error('Failed to load wishlist from localStorage:', error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev
      }
      trackEvent('wishlist_item_added', {
        product_id: item.id,
        product_name: item.name,
        price: item.price,
      })
      return [...prev, item]
    })
  }

  const removeFromWishlist = (id: number) => {
    setWishlistItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) {
        trackEvent('wishlist_item_removed', {
          product_id: item.id,
          product_name: item.name,
          price: item.price,
        })
      }
      return prev.filter((item) => item.id !== id)
    })
  }

  const isInWishlist = (id: number) => {
    return wishlistItems.some((item) => item.id === id)
  }

  const wishlistCount = wishlistItems.length

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
