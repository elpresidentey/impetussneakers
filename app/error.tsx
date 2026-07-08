'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-8xl md:text-9xl font-black uppercase tracking-tighter text-foreground mb-6">
          500
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Something Went Wrong
        </h2>
        <p className="text-lg text-foreground/70 mb-10 max-w-lg mx-auto leading-relaxed">
          We encountered an unexpected error. Our team has been notified and we're working on it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex min-h-12 items-center justify-center bg-foreground text-background px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:bg-foreground/90 active:scale-[0.98]"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex min-h-12 items-center justify-center border border-foreground px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-foreground transition-all duration-300 hover:bg-foreground hover:text-background active:scale-[0.98]"
          >
            Back to Home
          </a>
        </div>
        {error.digest && (
          <p className="text-sm text-foreground/50 mt-8">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
