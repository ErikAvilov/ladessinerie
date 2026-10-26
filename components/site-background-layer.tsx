'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
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

function applyBackgroundColors(markup: string, fond: string, traits: string) {
  return markup
    .replace(/var\(--background-fond(?:,\s*[^)]+)?\)/gi, fond)
    .replace(/var\(--background-traits(?:,\s*[^)]+)?\)/gi, traits)
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

  const coloredSvg = useMemo(() => {
    if (!svg) return null
    return applyBackgroundColors(svg, resolvedFond, resolvedTraits)
  }, [svg, resolvedFond, resolvedTraits])

  return (
    <div
      aria-hidden
      className={className}
      style={
        {
          '--background-fond': resolvedFond,
          '--background-traits': resolvedTraits,
          backgroundColor: resolvedFond,
        } as CSSProperties
      }
    >
      {coloredSvg ? (
        <span
          className="block h-full w-full"
          style={{ display: 'block', lineHeight: 0 }}
          dangerouslySetInnerHTML={{ __html: coloredSvg }}
        />
      ) : (
        <span className="block h-full w-full" style={{ backgroundColor: resolvedFond }} />
      )}
    </div>
  )
}
