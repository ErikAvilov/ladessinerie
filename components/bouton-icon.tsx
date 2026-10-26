'use client'

import { useEffect, useState, type CSSProperties } from 'react'

type BoutonIconProps = {
  src: string
  color: string
  className?: string
  /** Sans contour / ombre — utile pour les anims de zoom (perf GPU). */
  plain?: boolean
}

const svgCache = new Map<string, string>()
const loadingCache = new Map<string, Promise<string>>()

/** Contour blanc ~2px qui suit la silhouette + ombre douce. */
const BOUTON_FILTER = [
  'drop-shadow(2px 0 0 #fff)',
  'drop-shadow(-2px 0 0 #fff)',
  'drop-shadow(0 2px 0 #fff)',
  'drop-shadow(0 -2px 0 #fff)',
  'drop-shadow(1.5px 1.5px 0 #fff)',
  'drop-shadow(-1.5px 1.5px 0 #fff)',
  'drop-shadow(1.5px -1.5px 0 #fff)',
  'drop-shadow(-1.5px -1.5px 0 #fff)',
  'drop-shadow(0 8px 18px rgba(43,41,39,0.16))',
].join(' ')

function loadBoutonSvg(src: string) {
  const cached = svgCache.get(src)
  if (cached) return Promise.resolve(cached)

  const pending = loadingCache.get(src)
  if (pending) return pending

  const request = fetch(src)
    .then((response) => response.text())
    .then((text) => {
      const markup = text
        .replace(/<\?xml[^>]*>/i, '')
        .replace(/<!DOCTYPE[^>]*>/i, '')
        .replace(/\swidth="[^"]*"/, ' width="100%"')
        .replace(/\sheight="[^"]*"/, ' height="100%"')
        .replace('<svg ', '<svg class="h-full w-full" ')
      svgCache.set(src, markup)
      loadingCache.delete(src)
      return markup
    })

  loadingCache.set(src, request)
  return request
}

export function BoutonIcon({ src, color, className, plain = false }: BoutonIconProps) {
  const [svg, setSvg] = useState<string | null>(() => svgCache.get(src) ?? null)

  useEffect(() => {
    let cancelled = false
    void loadBoutonSvg(src).then((markup) => {
      if (!cancelled) setSvg(markup)
    })
    return () => {
      cancelled = true
    }
  }, [src])

  if (!svg) {
    return (
      <span
        aria-hidden
        className={`image-load-shimmer inline-block ${className ?? ''}`}
        style={{ lineHeight: 0 }}
      />
    )
  }

  return (
    <span
      aria-hidden
      className={`${plain ? '' : 'content-reveal '} ${className ?? ''}`.trim()}
      style={
        {
          display: 'inline-block',
          lineHeight: 0,
          '--bouton-fill': color,
          filter: plain ? undefined : BOUTON_FILTER,
        } as CSSProperties
      }
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
