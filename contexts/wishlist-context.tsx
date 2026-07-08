'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react'
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
  toggleWishlist: (item: WishlistItem) => void
  wishlistCount: number
  isHydrated: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const WISHLIST_STORAGE_KEY = 'impetus_wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const { trackEvent } = useAnalytics()

  // Hydrate wishlist from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY)
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist)
        if (Array.isArray(parsed)) {
          setWishlistItems(parsed)
        }
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Persist wishlist to localStorage whenever it changes (but only after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems))
      } catch (error) {
        console.error('Failed to save wishlist to localStorage:', error)
      }
    }
  }, [wishlistItems, isHydrated])

  // Optimized add to wishlist
  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlistItems((prev) => {
      // Check if item already exists
      if (prev.some((i) => i.id === item.id)) {
        return prev
      }

      trackEvent('wishlist_item_added', {
        product_id: item.id,
        product_name: item.name,
        price: item.price,
      })

      return [...prev, item]
    })
  }, [trackEvent])

  // Optimized remove from wishlist
  const removeFromWishlist = useCallback((id: number) => {
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
  }, [trackEvent])

  // Check if item is in wishlist (memoized for performance)
  const isInWishlist = useCallback((id: number) => {
    return wishlistItems.some((item) => item.id === id)
  }, [wishlistItems])

  // Toggle wishlist item (add if not exists, remove if exists)
  const toggleWishlist = useCallback((item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist(item)
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist])

  // Memoized computed values
  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    wishlistCount,
    isHydrated,
  }), [wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, wishlistCount, isHydrated])

  return (
    <WishlistContext.Provider value={value}>
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
