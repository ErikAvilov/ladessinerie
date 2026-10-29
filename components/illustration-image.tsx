'use client'

import NextImage, { type ImageProps } from 'next/image'
import { useState, type SyntheticEvent } from 'react'

type IllustrationImageProps = ImageProps & {
  rounded?: 'xl' | 'lg' | 'full' | 'none'
  /** Soft fade-in when the bitmap is ready (default true). */
  fade?: boolean
  /** Couleur dominante HEX — placeholder pendant le chargement. */
  dominantColor?: string
  onReady?: () => void
}

/** Survit aux remounts React — évite le flash opacity-0 sur images déjà vues. */
const loadedImageSrcs = new Set<string>()

function imageSrcKey(src: ImageProps['src']): string | null {
  if (typeof src === 'string') return src
  if (src && typeof src === 'object' && 'src' in src) return String(src.src)
  return null
}

export function IllustrationImage({
  className,
  rounded = 'none',
  priority,
  preload,
  fill,
  fade = true,
  dominantColor,
  onLoad,
  onError,
  onReady,
  src,
  ...props
}: IllustrationImageProps) {
  const srcKey = imageSrcKey(src)
  const [loaded, setLoaded] = useState(() =>
    srcKey ? loadedImageSrcs.has(srcKey) : false,
  )

  const roundedClass =
    rounded === 'xl'
      ? 'rounded-xl'
      : rounded === 'lg'
        ? 'rounded-lg'
        : rounded === 'full'
          ? 'rounded-full'
          : ''
  const positionClass = fill
    ? 'absolute inset-0'
    : 'relative mx-auto block w-fit max-h-full max-w-full'
  const placeholderBg = dominantColor || undefined

  function markReady() {
    if (srcKey) loadedImageSrcs.add(srcKey)
    setLoaded((current) => {
      if (current) return current
      onReady?.()
      return true
    })
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
    <div
      className={`${positionClass} ${fill ? 'overflow-hidden' : ''} ${roundedClass} ${
        placeholderBg ? '' : fill ? 'bg-foreground/[0.06]' : ''
      }`}
      style={placeholderBg ? { backgroundColor: placeholderBg } : undefined}
    >
      {!loaded ? (
        <span
          aria-hidden
          className="image-load-shimmer pointer-events-none absolute inset-0 z-[1] opacity-100"
        />
      ) : null}
      <NextImage
        {...props}
        src={src}
        fill={fill}
        priority={priority}
        preload={preload}
        onLoad={handleLoad}
        onError={handleError}
        className={[
          className,
          loaded ? 'opacity-100' : 'opacity-0',
          fade ? 'transition-opacity duration-500 ease-out' : null,
        ]
          .filter(Boolean)
          .join(' ')}
      />
    </div>
  )
}
