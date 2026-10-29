'use client'

import NextImage, { type ImageProps } from 'next/image'
import { useEffect, useState, type SyntheticEvent } from 'react'

type IllustrationImageProps = ImageProps & {
  rounded?: 'xl' | 'lg' | 'full' | 'none'
  /** Soft fade-in when the bitmap is ready (default true). */
  fade?: boolean
  /** Shimmer pendant le chargement (default true). */
  shimmer?: boolean
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
  shimmer = true,
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

  // Cache hit : notifier le parent (ex. home scatter) sans attendre onLoad.
  useEffect(() => {
    if (loaded) onReady?.()
  }, [loaded, onReady])

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
    // Ne pas appeler onReady ici : onLoad peut être sync pendant le render (cache).
    setLoaded(true)
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
      {shimmer && !loaded ? (
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
