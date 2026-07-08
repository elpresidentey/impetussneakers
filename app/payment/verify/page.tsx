'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

function PaymentVerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference') || searchParams.get('trxref')
      
      if (!reference) {
        setStatus('error')
        setMessage('No payment reference found')
        return
      }

      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        })

        const data = await response.json()

        if (response.ok && data.status === 'success') {
          setStatus('success')
          setMessage('Payment verified successfully! Your order has been placed.')
          
          // Clear cart after successful payment
          clearCart()
          
          setTimeout(() => {
            router.push('/')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Payment verification failed')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Failed to verify payment. Please contact support.')
      }
    }

    verifyPayment()
  }, [searchParams, router, clearCart])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-2xl border border-foreground/10 p-8 text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 mx-auto text-foreground animate-spin" />
              <h2 className="text-2xl font-bold text-foreground">Verifying Payment</h2>
              <p className="text-foreground/60">Please wait while we verify your payment...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-foreground">Payment Successful!</h2>
              <p className="text-foreground/60">{message}</p>
              <p className="text-sm text-foreground/40">Redirecting to home page...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
              <h2 className="text-2xl font-bold text-foreground">Payment Failed</h2>
              <p className="text-foreground/60">{message}</p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-3 bg-foreground text-background rounded-lg font-semibold hover:bg-foreground/90 transition-colors"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Loader2 className="w-16 h-16 text-foreground animate-spin" />
      </div>
    }>
      <PaymentVerifyContent />
    </Suspense>
  )
}
