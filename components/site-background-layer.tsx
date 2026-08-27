'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { useSiteThemeOptional } from '@/components/site-theme-context'
import { DEFAULT_SITE_THEME } from '@/lib/site-theme-shared'

type SiteBackgroundLayerProps = {
  className?: string
  fond?: string
  traits?: string
}

const BACKGROUND_SVG_URL = '/images/background.svg?v=1'

let cachedSvg: string | null = null
let loadingSvg: Promise<string> | null = null

function loadBackgroundSvg() {
  if (cachedSvg) return Promise.resolve(cachedSvg)
  if (!loadingSvg) {
    loadingSvg = fetch(BACKGROUND_SVG_URL)
      .then((response) => response.text())
      .then((text) => {
        cachedSvg = text
          .replace(/<\?xml[^>]*>/i, '')
          .replace(/<!DOCTYPE[^>]*>/i, '')
          .replace(/\swidth="[^"]*"/, ' width="100%"')
          .replace(/\sheight="[^"]*"/, ' height="100%"')
          .replace('<svg ', '<svg class="h-full w-full" preserveAspectRatio="xMidYMid slice" ')
        return cachedSvg
      })
  }
  return loadingSvg
}

export function SiteBackgroundLayer({ className, fond, traits }: SiteBackgroundLayerProps) {
  const theme = useSiteThemeOptional()
  const resolvedFond = fond ?? theme?.backgroundFond ?? DEFAULT_SITE_THEME.background_fond
  const resolvedTraits = traits ?? theme?.backgroundTraits ?? DEFAULT_SITE_THEME.background_traits
  const [svg, setSvg] = useState<string | null>(cachedSvg)

  useEffect(() => {
    let cancelled = false
    void loadBackgroundSvg().then((markup) => {
      if (!cancelled) setSvg(markup)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      aria-hidden
      className={className}
      style={
        {
          '--background-fond': resolvedFond,
          '--background-traits': resolvedTraits,
        } as CSSProperties
      }
    >
      {svg ? (
        <span
          className="block h-full w-full"
          style={{ display: 'block', lineHeight: 0 }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <span className="block h-full w-full bg-[var(--background-fond)]" />
      )}
    </div>
  )
}
