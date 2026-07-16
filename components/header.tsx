'use client'

import { ShoppingCart, Menu, X, Search, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'

interface HeaderProps {
  onSearchOpen?: () => void
  onCartOpen?: () => void
  onAuthOpen?: () => void
}

export function Header({ onSearchOpen, onCartOpen, onAuthOpen: _onAuthOpen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartCount, isHydrated } = useCart()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#collections', label: 'Collections' },
    { href: '#shop', label: 'Shop' },
    { href: '/orders', label: 'Orders' },
    { href: '/vendor', label: 'Sell With Us' },
  ]

  const solid = isScrolled || mobileMenuOpen

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div
        className={`border-b transition-all duration-500 ${
          solid
            ? 'border-foreground/8 bg-[#f7f4ef]/92 text-foreground shadow-[0_12px_40px_rgba(20,16,12,0.06)] backdrop-blur-xl'
            : 'border-transparent bg-gradient-to-b from-black/50 via-black/20 to-transparent text-white backdrop-blur-[2px]'
        }`}
      >
        <div className="mx-auto grid h-[4.25rem] max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 md:h-[4.5rem] md:px-8">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3 leading-none"
            aria-label="The Impetus home"
          >
            <span
              className={`hidden h-8 w-px sm:block ${
                solid ? 'bg-foreground/25' : 'bg-white/35'
              }`}
              aria-hidden
            />
            <span className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] opacity-55 transition-opacity group-hover:opacity-80">
                The
              </span>
              <span className="text-base font-black uppercase tracking-[0.2em] md:text-lg">
                Impetus
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center justify-center gap-0.5 justify-self-center md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`group relative px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
                  solid
                    ? 'text-foreground/55 hover:text-foreground'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    solid ? 'bg-foreground' : 'bg-white'
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end gap-0.5">
            <button
              onClick={onSearchOpen}
              className={`hidden h-10 w-10 items-center justify-center transition-colors duration-200 md:flex ${
                solid ? 'hover:bg-foreground/8' : 'hover:bg-white/12'
              }`}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <a
              href="/orders"
              className={`hidden h-10 w-10 items-center justify-center transition-colors duration-200 md:flex ${
                solid ? 'hover:bg-foreground/8' : 'hover:bg-white/12'
              }`}
              aria-label="Orders"
            >
              <Package className="h-4 w-4" />
            </a>

            <button
              onClick={onCartOpen}
              className={`relative flex h-10 items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
                solid ? 'hover:bg-foreground/8' : 'hover:bg-white/12'
              }`}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {isHydrated && cartCount > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center px-1 text-[10px] font-bold ${
                    solid ? 'bg-foreground text-background' : 'bg-white text-black'
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className={`flex h-10 w-10 items-center justify-center transition-colors duration-200 md:hidden ${
                solid ? 'hover:bg-foreground/8' : 'hover:bg-white/12'
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
          <nav className="border-t border-foreground/8 bg-[#f7f4ef] px-4 pb-6 pt-2 md:hidden">
            <div className="grid gap-0.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-12 items-center justify-between border-b border-foreground/6 text-base font-black uppercase tracking-[0.12em] text-foreground"
                >
                  {link.label}
                  <span className="text-xs text-foreground/30">→</span>
                </a>
              ))}
            </div>
            <div className="mt-5 grid gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onSearchOpen?.()
                }}
                className="h-11 bg-foreground text-[11px] font-semibold uppercase tracking-[0.18em] text-background"
                aria-label="Search"
              >
                Search catalog
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
