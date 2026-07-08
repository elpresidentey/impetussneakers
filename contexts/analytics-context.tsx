'use client'

import { createContext, useContext, ReactNode } from 'react'

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
}

interface AnalyticsContextType {
  trackEvent: (event: string, properties?: Record<string, any>) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    const eventData: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      },
    }

    // Log to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to analytics service like Google Analytics, Mixpanel, etc.
      // gtag('event', eventName, eventData)
    }

    // Example: Send to analytics service
    // if (typeof window !== 'undefined' && (window as any).gtag) {
    //   (window as any).gtag('event', event, properties)
    // }
  }

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}
