'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Account Created!</h1>
          <p className="text-muted-foreground">
            Please check your email to verify your account before logging in.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Can&apos;t find the email? Check your spam folder or try signing up again.
          </p>
          <Link href="/auth/login" className="block">
            <Button className="w-full" size="lg">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
