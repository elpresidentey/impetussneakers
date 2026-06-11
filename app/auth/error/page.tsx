'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Authentication Error</h1>
          <p className="text-muted-foreground">
            Something went wrong during authentication. Please try again.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/auth/login" className="block">
            <Button className="w-full" size="lg">
              Try Again
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full" size="lg">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
