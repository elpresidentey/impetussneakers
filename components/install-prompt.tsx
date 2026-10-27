'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Download, Share, X } from 'lucide-react'

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'impetus-install-dismissed'

/**
 * "Install app" button. Reads the browser's beforeinstallprompt event
 * (captured by a tiny inline script in the root layout, since it can fire
 * before hydration) and shows a pill above the bottom navigation. On iOS,
 * where beforeinstallprompt is not supported, it explains the Share flow.
 */
export function InstallPrompt() {
  const pathname = usePathname()
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [ready, setReady] = useState(false)

  const check = useCallback(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY) === '1'
    if (dismissed) return false

    const event = (window as any).__impetusInstallPrompt as InstallPromptEvent | undefined
    if (event) {
      setInstallEvent(event)
      setHintVisible(false)
      return true
    }
    if (isIOSSafari()) {
      setIsIOS(true)
      setHintVisible(true)
      return true
    }
    return false
  }, [])

  useEffect(() => {
    setReady(check())

    const onPromptAvailable = () => {
      const dismissed = localStorage.getItem(DISMISS_KEY) === '1'
      if (!dismissed) setReady(check())
    }
    window.addEventListener('impetus-install-available', onPromptAvailable)

    const onInstalled = () => {
      setInstallEvent(null)
      setReady(false)
      setHintVisible(false)
      localStorage.setItem(DISMISS_KEY, '1')
    }
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('impetus-install-available', onPromptAvailable)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [check])

  if (!ready || pathname?.startsWith('/admin')) return null

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setReady(false)
    setHintVisible(false)
  }

  const install = async () => {
    if (!installEvent) return
    await installEvent.prompt()
    const { outcome } = await installEvent.userChoice
    if (outcome === 'accepted') {
      setReady(false)
      setHintVisible(false)
    }
    setInstallEvent(null)
    ;(window as any).__impetusInstallPrompt = null
  }

  if (hintVisible) {
    return (
      <div className="fixed bottom-20 right-4 z-50 flex max-w-[17rem] items-start gap-3 border border-foreground/10 bg-[#f7f4ef]/95 px-4 py-3 shadow-lg backdrop-blur-xl">
        <Share className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="text-[11px] leading-relaxed text-foreground/70">
          <span className="font-bold uppercase tracking-[0.1em] text-foreground">Install the app:</span>{' '}
          tap <Share className="inline h-3 w-3" /> <span className="font-bold">Share</span>, then
          “Add to Home Screen”.
        </p>
        <button
          onClick={dismiss}
          className="-mr-1 -mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-foreground/40 hover:text-foreground"
          aria-label="Dismiss install hint"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={install}
      className="fixed bottom-20 right-4 z-50 flex h-11 items-center gap-2 bg-foreground px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-background shadow-lg transition-all duration-200 hover:bg-foreground/90 active:scale-[0.98]"
      aria-label="Install The Impetus app"
    >
      <Download className="h-4 w-4" />
      Install app
    </button>
  )
}

function isIOSSafari() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const iOS = /iphone|ipad|ipod/i.test(ua)
  // iPadOS 13+ masquerades as desktop Safari
  const iPadOS = /Macintosh/i.test(ua) && 'ontouchend' in document
  const standalone =
    typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches
  return (iOS || iPadOS) && !standalone
}
