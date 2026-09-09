'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageWithFallbackProps {
  src: string
  alt: string
  fallback?: string
  className?: string
  [key: string]: any
}

export function ImageWithFallback({ src, alt, fallback = '/placeholder.svg', className, ...props }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallback)
    }
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-foreground/10 animate-pulse" />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={className}
        {...props}
      />
    </>
  )
}
