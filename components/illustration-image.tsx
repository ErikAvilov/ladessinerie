'use client'

import NextImage, { type ImageProps } from 'next/image'
import { useState, type SyntheticEvent } from 'react'

type IllustrationImageProps = ImageProps & {
  rounded?: 'xl' | 'full' | 'none'
}

export function IllustrationImage({
  className,
  rounded = 'none',
  priority,
  fill,
  onLoad,
  ...props
}: IllustrationImageProps) {
  const [loaded, setLoaded] = useState(false)

  const roundedClass =
    rounded === 'xl' ? 'rounded-xl' : rounded === 'full' ? 'rounded-full' : ''
  const positionClass = fill ? 'absolute inset-0' : 'relative h-full w-full'

  function handleLoad(event: SyntheticEvent<HTMLImageElement, Event>) {
    setLoaded(true)
    onLoad?.(event)
  }

  return (
    <div className={`${positionClass} overflow-hidden bg-foreground/[0.06] ${roundedClass}`}>
      <span
        aria-hidden
        className={[
          'image-load-shimmer pointer-events-none absolute inset-0',
          loaded ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      />
      <NextImage
        {...props}
        fill={fill}
        priority={priority}
        onLoad={handleLoad}
        className={[
          className,
          'transition-opacity duration-500 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
        ]
          .filter(Boolean)
          .join(' ')}
      />
    </div>
  )
}
