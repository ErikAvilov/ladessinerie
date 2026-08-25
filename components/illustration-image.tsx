'use client'

import NextImage, { type ImageProps } from 'next/image'
import { useState, type SyntheticEvent } from 'react'

type IllustrationImageProps = ImageProps & {
  rounded?: 'xl' | 'lg' | 'full' | 'none'
  /** Soft fade-in when the bitmap is ready (default true). */
  fade?: boolean
  onReady?: () => void
}

export function IllustrationImage({
  className,
  rounded = 'none',
  priority,
  preload,
  fill,
  fade = true,
  onLoad,
  onError,
  onReady,
  ...props
}: IllustrationImageProps) {
  const [loaded, setLoaded] = useState(false)

  const roundedClass =
    rounded === 'xl'
      ? 'rounded-xl'
      : rounded === 'lg'
        ? 'rounded-lg'
        : rounded === 'full'
          ? 'rounded-full'
          : ''
  const positionClass = fill ? 'absolute inset-0' : 'relative h-full w-full'

  function markReady() {
    if (loaded) return
    setLoaded(true)
    onReady?.()
  }

  function handleLoad(event: SyntheticEvent<HTMLImageElement, Event>) {
    markReady()
    onLoad?.(event)
  }

  function handleError(event: SyntheticEvent<HTMLImageElement, Event>) {
    markReady()
    onError?.(event)
  }

  return (
    <div className={`${positionClass} overflow-hidden bg-foreground/[0.06] ${roundedClass}`}>
      <span
        aria-hidden
        className={[
          'image-load-shimmer pointer-events-none absolute inset-0 z-[1]',
          loaded ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      />
      <NextImage
        {...props}
        fill={fill}
        priority={priority}
        preload={preload}
        onLoad={handleLoad}
        onError={handleError}
        className={[
          className,
          fade ? 'transition-opacity duration-500 ease-out' : 'transition-opacity duration-300 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
        ]
          .filter(Boolean)
          .join(' ')}
      />
    </div>
  )
}
