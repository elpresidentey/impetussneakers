'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        <div className="bg-card border border-foreground/10 rounded-lg p-6 mb-8">
          <p className="text-sm text-muted-foreground mb-2">Order confirmation has been sent to your email</p>
          <p className="text-lg font-semibold text-foreground">You can track your order in your account</p>
        </div>

        <div className="space-y-4">
          <Link href="/dashboard">
            <Button className="w-full" size="lg">
              View Orders
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
