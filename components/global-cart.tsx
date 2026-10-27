'use client'

import { useRouter } from 'next/navigation'
import { CartModal } from '@/components/cart-modal'
import { useUI } from '@/contexts/ui-context'

/**
 * Global cart modal for pages that don't mount their own (the homepage
 * mounts one with inline checkout). Cart → checkout hands off to the
 * /checkout page, which owns the full payment flow.
 */
export function GlobalCart() {
  const { isCartOpen, closeCart } = useUI()
  const router = useRouter()

  return (
    <CartModal
      isOpen={isCartOpen}
      onClose={closeCart}
      onCheckout={(items) => {
        if (items.length === 0) return
        closeCart()
        router.push('/checkout')
      }}
    />
  )
}
