'use client'

import { useEffect, useState, type CSSProperties } from 'react'

type CaddieIconProps = {
  className?: string
  /** Accents roses (poignées, sièges, centres de roues) */
  fond?: string
  /** Traits du caddie */
  traits?: string
  /** Contour blanc extérieur */
  contour?: string
}

const CADDIE_SVG_URL = '/images/caddie.svg?v=1'
const DEFAULT_FOND = '#e5b0af'
const DEFAULT_TRAITS = '#5f2536'
const DEFAULT_CONTOUR = '#ffffff'

let cachedSvg: string | null = null
let loadingSvg: Promise<string> | null = null

function loadCaddieSvg() {
  if (cachedSvg) return Promise.resolve(cachedSvg)
  if (!loadingSvg) {
    loadingSvg = fetch(CADDIE_SVG_URL)
      .then((response) => response.text())
      .then((text) => {
        cachedSvg = text
          .replace(/<\?xml[^>]*>/i, '')
          .replace(/<!DOCTYPE[^>]*>/i, '')
          .replace(/\swidth="[^"]*"/, ' width="100%"')
          .replace(/\sheight="[^"]*"/, ' height="100%"')
          .replace('<svg ', '<svg class="h-full w-full" ')
        return cachedSvg
      })
  }
  return loadingSvg
}

export function CaddieIcon({
  className,
  fond = DEFAULT_FOND,
  traits = DEFAULT_TRAITS,
  contour = DEFAULT_CONTOUR,
}: CaddieIconProps) {
  const [svg, setSvg] = useState<string | null>(cachedSvg)

  useEffect(() => {
    let cancelled = false
    void loadCaddieSvg().then((markup) => {
      if (!cancelled) setSvg(markup)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <span
      aria-hidden
      className={className}
      style={
        {
          display: 'inline-block',
          lineHeight: 0,
          '--caddie-fond': fond,
          '--caddie-traits': traits,
          '--caddie-contour': contour,
        } as CSSProperties
      }
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  )
}
