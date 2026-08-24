'use client'

import { useEffect, useState, type CSSProperties } from 'react'

type BoutonIconProps = {
  src: string
  color: string
  className?: string
}

const svgCache = new Map<string, string>()
const loadingCache = new Map<string, Promise<string>>()

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

export function BoutonIcon({ src, color, className }: BoutonIconProps) {
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

  return (
    <span
      aria-hidden
      className={className}
      style={
        {
          display: 'inline-block',
          lineHeight: 0,
          '--bouton-fill': color,
        } as CSSProperties
      }
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  )
}
