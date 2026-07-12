'use client'

import { ShoppingCart, Menu, X, Search, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '@/contexts/cart-context'

interface HeaderProps {
  onSearchOpen?: () => void
  onCartOpen?: () => void
  onAuthOpen?: () => void
}

export function Header({ onSearchOpen, onCartOpen, onAuthOpen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartCount, isHydrated } = useCart()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#collections', label: 'Collections' },
    { href: '#shop', label: 'Shop' },
    { href: '/orders', label: 'Orders' },
    { href: '/vendor', label: 'Sell With Us', isNew: true },
  ]

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-0">
      <div className={`px-4 transition-all duration-300 md:px-8 ${
        isScrolled || mobileMenuOpen
          ? 'bg-white/55 text-foreground shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl'
          : 'bg-white/5 text-white backdrop-blur-xl'
      }`}>
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 md:h-18">
          <a href="/" className="group flex min-w-0 flex-col leading-none" aria-label="The Impetus home">
            <span className="text-base font-black uppercase tracking-[0.18em] md:text-lg">Impetus</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center justify-center gap-1 justify-self-center px-2 py-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-200 relative ${
                  isScrolled ? 'text-foreground/62 hover:text-foreground' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                {link.isNew && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 rounded-full">
                    NEW
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={onSearchOpen}
              className={`hidden h-10 w-10 items-center justify-center transition-colors duration-200 md:flex ${
                isScrolled ? 'hover:bg-foreground/10' : 'hover:bg-white/15'
              }`}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <a
              href="/orders"
              className={`hidden h-10 w-10 items-center justify-center transition-colors duration-200 md:flex ${
                isScrolled ? 'hover:bg-foreground/10' : 'hover:bg-white/15'
              }`}
              aria-label="Orders"
            >
              <Package className="h-4 w-4" />
            </a>

            <button
              onClick={onCartOpen}
              className={`relative flex h-10 items-center gap-2 px-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
                isScrolled ? 'hover:bg-foreground/10' : 'hover:bg-white/15'
              }`}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {/* Only show badge when hydrated AND count > 0 */}
              {isHydrated && cartCount > 0 && (
                <span className={`flex h-5 min-w-5 items-center justify-center px-1 text-[10px] font-bold ${
                  isScrolled || mobileMenuOpen ? 'bg-foreground text-background' : 'bg-white text-black'
                }`}>
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className={`flex h-10 w-10 items-center justify-center transition-colors duration-200 md:hidden ${
                isScrolled || mobileMenuOpen ? 'hover:bg-foreground/10' : 'hover:bg-white/15'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="py-4 md:hidden">
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-12 items-center justify-between text-lg font-black uppercase tracking-wide text-foreground"
                >
                  {link.label}
                  <span className="text-sm text-foreground/35">/</span>
                </a>
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onSearchOpen?.()
                }}
                className="h-11 bg-foreground text-xs font-semibold uppercase tracking-[0.18em] text-background"
                aria-label="Search"
              >
                Search
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
