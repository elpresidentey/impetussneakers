'use client'

import { useEffect, useRef, useState } from 'react'

const SPLASH_MIN_MS = 1800
const SPLASH_MAX_MS = 7000
const SESSION_KEY = 'impetus-splash-seen'

// Custom event other components can fire once their data has loaded.
// The splash stays up until it hydrates, or the min time elapses, whichever is later.
export function notifySplashReady() {
  window.dispatchEvent(new Event('impetus-splash-ready'))
}

export function SplashScreen() {
  const [leaving, setLeaving] = useState(false)
  const [done, setDone] = useState(false)
  const readyRef = useRef(false)
  const minElapsedRef = useRef(false)
  const scheduleLeaveRef = useRef<() => void>(() => {})

  useEffect(() => {
    // Returning visitors within the same session skip the intro.
    let seen = false
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      // Storage unavailable (private mode) — show it once per page load.
    }

    const leave = () => {
      setLeaving(true)
      window.setTimeout(() => {
        setDone(true)
        try {
          sessionStorage.setItem(SESSION_KEY, '1')
        } catch {}
      }, 580)
    }

    const maybeLeave = () => {
      if (minElapsedRef.current && readyRef.current) leave()
    }
    scheduleLeaveRef.current = maybeLeave

    const onReady = () => {
      readyRef.current = true
      maybeLeave()
    }
    window.addEventListener('impetus-splash-ready', onReady)

    const minTimer = window.setTimeout(() => {
      minElapsedRef.current = true
      maybeLeave()
    }, SPLASH_MIN_MS)

    // Never trap the user if data load hangs.
    const maxTimer = window.setTimeout(onReady, SPLASH_MAX_MS)

    if (seen) {
      // Returning in the same session: keep it a brief flash instead of a blank reload.
      readyRef.current = true
      minElapsedRef.current = true
      leave()
    }

    return () => {
      window.removeEventListener('impetus-splash-ready', onReady)
      window.clearTimeout(minTimer)
      window.clearTimeout(maxTimer)
    }
  }, [])

  if (done) return null

  return (
    <div
      aria-hidden={leaving}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-foreground text-background ${
        leaving ? 'splash-leaving' : ''
      }`}
    >
      <div className="flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/impetus-logo.png"
          alt=""
          width={132}
          height={132}
          className="splash-logo h-28 w-28 rounded-2xl object-contain sm:h-32 sm:w-32"
        />
        <h2 className="splash-word mt-6 text-xl font-black uppercase text-background sm:text-2xl">
          Impetus
        </h2>
        <p className="splash-tagline mt-2 text-xs font-light tracking-[0.3em] uppercase opacity-70">
          Premium sneaker experience
        </p>
      </div>

      {leaving ? (
        <span className="sr-only">Loading complete</span>
      ) : (
        <div className="splash-bar absolute bottom-10 h-px w-40 overflow-hidden bg-[color-mix(in_srgb,currentColor_25%,transparent)]">
          <div className="splash-sweep h-full w-3/5 bg-current" />
        </div>
      )}
    </div>
  )
}
