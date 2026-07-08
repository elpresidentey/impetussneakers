'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'

interface UIContextType {
  // Modal states
  isSearchOpen: boolean
  isCartOpen: boolean
  isAuthOpen: boolean
  isCheckoutOpen: boolean
  
  // Quick view state
  quickViewProduct: any | null
  
  // Actions
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
  
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  openAuth: () => void
  closeAuth: () => void
  toggleAuth: () => void
  
  openCheckout: () => void
  closeCheckout: () => void
  toggleCheckout: () => void
  
  setQuickViewProduct: (product: any | null) => void
  closeAllModals: () => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [quickViewProduct, setQuickViewProductState] = useState<any | null>(null)

  // Search actions
  const openSearch = useCallback(() => setIsSearchOpen(true), [])
  const closeSearch = useCallback(() => setIsSearchOpen(false), [])
  const toggleSearch = useCallback(() => setIsSearchOpen(prev => !prev), [])

  // Cart actions
  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), [])

  // Auth actions
  const openAuth = useCallback(() => setIsAuthOpen(true), [])
  const closeAuth = useCallback(() => setIsAuthOpen(false), [])
  const toggleAuth = useCallback(() => setIsAuthOpen(prev => !prev), [])

  // Checkout actions
  const openCheckout = useCallback(() => setIsCheckoutOpen(true), [])
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), [])
  const toggleCheckout = useCallback(() => setIsCheckoutOpen(prev => !prev), [])

  // Quick view actions
  const setQuickViewProduct = useCallback((product: any | null) => {
    setQuickViewProductState(product)
  }, [])

  // Close all modals
  const closeAllModals = useCallback(() => {
    setIsSearchOpen(false)
    setIsCartOpen(false)
    setIsAuthOpen(false)
    setIsCheckoutOpen(false)
    setQuickViewProductState(null)
  }, [])

  const value = useMemo(() => ({
    isSearchOpen,
    isCartOpen,
    isAuthOpen,
    isCheckoutOpen,
    quickViewProduct,
    openSearch,
    closeSearch,
    toggleSearch,
    openCart,
    closeCart,
    toggleCart,
    openAuth,
    closeAuth,
    toggleAuth,
    openCheckout,
    closeCheckout,
    toggleCheckout,
    setQuickViewProduct,
    closeAllModals,
  }), [
    isSearchOpen,
    isCartOpen,
    isAuthOpen,
    isCheckoutOpen,
    quickViewProduct,
    openSearch,
    closeSearch,
    toggleSearch,
    openCart,
    closeCart,
    toggleCart,
    openAuth,
    closeAuth,
    toggleAuth,
    openCheckout,
    closeCheckout,
    toggleCheckout,
    setQuickViewProduct,
    closeAllModals,
  ])

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
