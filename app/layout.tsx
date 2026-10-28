import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
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
import { BottomNav } from '@/components/bottom-nav'
import { GlobalCart } from '@/components/global-cart'
import { InstallPrompt } from '@/components/install-prompt'
import { PWARegister } from '@/components/pwa-register'
import { SplashScreen } from '@/components/splash-screen'

const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-lato',
})

export const metadata: Metadata = {
  title: 'The Impetus – Premium Sneaker Experience',
  description: 'Cinematic sneaker retail reimagined. Curated collections, editorial storytelling, and immersive discovery.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'The Impetus',
  },
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
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f7f4ef',
  viewportFit: 'cover',
}

// The browser's beforeinstallprompt event can fire before React hydrates.
// This inline script captures it on the window so <InstallPrompt /> can use it later.
const installPromptCapture = `
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    window.__impetusInstallPrompt = e;
    window.dispatchEvent(new Event('impetus-install-available'));
  });
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${lato.variable} ${lato.className} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground page-shell pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <ErrorBoundary>
          <SplashScreen />
          <ToastProvider>
            <AuthProvider>
              <AnalyticsProvider>
                <CartProvider>
                  <WishlistProvider>
                    <UIProvider>
                      {children}
                      <GlobalCart />
                      <BottomNav />
                    </UIProvider>
                  </WishlistProvider>
                </CartProvider>
              </AnalyticsProvider>
            </AuthProvider>
            <Toast />
            <InstallPrompt />
            <PWARegister />
          </ToastProvider>
        </ErrorBoundary>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <script dangerouslySetInnerHTML={{ __html: installPromptCapture }} />
      </body>
    </html>
  )
}
