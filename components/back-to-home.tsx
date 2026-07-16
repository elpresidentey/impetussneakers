'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackToHome() {
  const pathname = usePathname()

  if (pathname === '/') return null

  return (
    <Link
      href="/"
      className="group fixed bottom-6 left-6 z-50 flex h-10 w-10 items-center justify-center bg-foreground/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-foreground hover:shadow-xl"
      aria-label="Back to home"
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
    </Link>
  )
}
