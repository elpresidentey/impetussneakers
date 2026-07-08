'use client'

import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h2>
              <p className="text-foreground/60 mb-6">We apologize for the inconvenience. Please refresh the page to try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-foreground text-background rounded-none font-semibold hover:bg-foreground/90 transition-colors"
              >
                Refresh Page
              </button>
              {this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-foreground/40 cursor-pointer hover:text-foreground/60">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs text-foreground/40 overflow-auto bg-foreground/5 p-4 rounded">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
