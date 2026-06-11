'use client'

import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-light tracking-widest text-foreground">
              THE IMPETUS
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <a
              href="#collections"
              className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors duration-200"
            >
              Collections
            </a>
            <a
              href="#about"
              className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#shop"
              className="text-sm font-light text-foreground/70 hover:text-foreground transition-colors duration-200"
            >
              Shop
            </a>
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              className="relative p-2 hover:bg-foreground/5 rounded-lg transition-colors duration-200"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-xs font-light flex items-center justify-center rounded-full">
                0
              </span>
            </button>

            <button
              className="md:hidden p-2 hover:bg-foreground/5 rounded-lg transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-foreground/10 space-y-3">
            <a
              href="#collections"
              className="block text-sm font-light text-foreground/70 hover:text-foreground transition-colors duration-200 py-2"
            >
              Collections
            </a>
            <a
              href="#about"
              className="block text-sm font-light text-foreground/70 hover:text-foreground transition-colors duration-200 py-2"
            >
              About
            </a>
            <a
              href="#shop"
              className="block text-sm font-light text-foreground/70 hover:text-foreground transition-colors duration-200 py-2"
            >
              Shop
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
