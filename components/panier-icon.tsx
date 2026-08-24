'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useSiteThemeOptional } from '@/components/site-theme-context'
import { DEFAULT_SITE_THEME } from '@/lib/site-theme'

type PanierIconProps = {
  className?: string
  fond?: string
  traits?: string
}

const PANIER_SVG_URL = '/images/panier.svg?v=5'

let cachedSvg: string | null = null
let loadingSvg: Promise<string> | null = null

function loadPanierSvg() {
  if (cachedSvg) return Promise.resolve(cachedSvg)
  if (!loadingSvg) {
    loadingSvg = fetch(PANIER_SVG_URL)
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

export function PanierIcon({ className, fond, traits }: PanierIconProps) {
  const theme = useSiteThemeOptional()
  const resolvedFond = fond ?? theme?.panierFond ?? DEFAULT_SITE_THEME.panier_fond
  const resolvedTraits = traits ?? theme?.panierTraits ?? DEFAULT_SITE_THEME.panier_traits
  const [svg, setSvg] = useState<string | null>(cachedSvg)

  useEffect(() => {
    let cancelled = false
    void loadPanierSvg().then((markup) => {
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
          '--panier-fond': resolvedFond,
          '--panier-traits': resolvedTraits,
        } as CSSProperties
      }
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  )
}
