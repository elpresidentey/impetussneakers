'use client'

import { useEffect } from 'react'

/**
 * Registers the service worker after the page has loaded.
 * Registration is non-blocking and failures are silent: the app must
 * work identically whether or not the service worker installs.
 */
export function PWARegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    if (!/^https?:$/.test(window.location.protocol)) return

    const register = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // Service worker is optional — ignore failures.
      })
    }

    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register, { once: true })
      return () => window.removeEventListener('load', register)
    }
  }, [])

  return null
}
