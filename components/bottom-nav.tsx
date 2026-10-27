'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, ShoppingCart, Store, User } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/contexts/auth-context'
import { useUI } from '@/contexts/ui-context'

/**
 * Global bottom navigation — the app's button navigation.
 * Rendered on every page (except the admin panel) with plain buttons,
 * always-fresh state, and safe-area padding for installed PWA mode.
 */
export function BottomNav() {
  const pathname = usePathname()
  const { cartCount, isHydrated } = useCart()
  const { user } = useAuth()
  const { openCart } = useUI()

  if (pathname?.startsWith('/admin')) return null

  const isHome = pathname === '/'

  const handleCartClick = (event: React.MouseEvent) => {
    // On the homepage the cart lives in the page's own modal — open it.
    if (isHome) {
      event.preventDefault()
      window.dispatchEvent(new Event('impetus:open-cart'))
      return
    }
    // Everywhere else, open the global cart modal (mounted in the root layout).
    event.preventDefault()
    openCart()
  }

  // Same-page: smooth-scroll to the shop section. Other pages: Link navigates
  // to /#shop and Next.js scrolls to the section after load.
  const handleShopClick = (event: React.MouseEvent) => {
    if (isHome) {
      event.preventDefault()
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const accountHref = user ? '/dashboard' : '/auth/login'
  const items = [
    { href: '/', label: 'Home', icon: Home, active: isHome, badge: null, onClick: undefined },
    {
      href: '/#shop',
      label: 'Shop',
      icon: Store,
      active: false,
      badge: null,
      onClick: handleShopClick,
    },
    {
      href: '/checkout',
      label: 'Cart',
      icon: ShoppingCart,
      active: pathname === '/checkout',
      badge: isHydrated && cartCount > 0 ? cartCount : null,
      onClick: handleCartClick,
    },
    { href: '/orders', label: 'Orders', icon: Package, active: pathname === '/orders', badge: null, onClick: undefined },
    {
      href: accountHref,
      label: user ? 'Account' : 'Sign in',
      icon: User,
      active: pathname === '/dashboard' || pathname?.startsWith('/auth'),
      badge: null,
      onClick: undefined,
    },
  ]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-foreground/10 bg-[#f7f4ef]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      aria-label="Primary"
    >
      <div className="mx-auto grid h-16 max-w-2xl grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={item.onClick}
            className={`relative flex min-w-0 flex-col items-center justify-center gap-1 transition-colors duration-200 ${
              item.active ? 'text-foreground' : 'text-foreground/45 hover:text-foreground/80'
            }`}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.active && (
              <span className="absolute top-0 h-0.5 w-8 bg-foreground" aria-hidden />
            )}
            <span className="relative">
              <item.icon className="h-5 w-5" />
              {item.badge !== null && item.badge > 0 && (
                <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center bg-foreground px-0.5 text-[9px] font-bold leading-none text-background">
                  {item.badge}
                </span>
              )}
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.14em]">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
