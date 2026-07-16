import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'
import { WishlistProvider } from '@/contexts/wishlist-context'
import { ToastProvider } from '@/contexts/toast-context'
import { ErrorBoundary } from '@/components/error-boundary'
import { AnalyticsProvider } from '@/contexts/analytics-context'
import { AuthProvider } from '@/contexts/auth-context'
import { UIProvider } from '@/contexts/ui-context'
import { Toast } from '@/components/toast'
import { BackToHome } from '@/components/back-to-home'

const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-lato',
})

export const metadata: Metadata = {
  title: 'The Impetus – Premium Sneaker Experience',
  description: 'Cinematic sneaker retail reimagined. Curated collections, editorial storytelling, and immersive discovery.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${lato.variable} ${lato.className} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground page-shell">
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              <AnalyticsProvider>
                <CartProvider>
                  <WishlistProvider>
                    <UIProvider>
                      {children}
                    </UIProvider>
                  </WishlistProvider>
                </CartProvider>
              </AnalyticsProvider>
            </AuthProvider>
            <Toast />
            <BackToHome />
          </ToastProvider>
        </ErrorBoundary>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
