'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { SiteSlider } from '@/components/site-slider'
import { panelFromPathname } from '@/lib/site-panels'
import type { Illustration } from '@/lib/illustrations'

type PanelsShellProps = {
  children: ReactNode
  initialHome: Illustration[]
}

/**
 * Le slider reste monté (juste masqué) sur /particulier/* et /pro/* pour :
 * - garder la position du panneau
 * - éviter un remount qui « rejoue » le slide
 * - que le retour arrière retombe au bon panneau
 */
export function PanelsShell({
  children,
  initialHome,
}: PanelsShellProps) {
  const pathname = usePathname()
  const isNestedPanel =
    (pathname.startsWith('/particulier/') && pathname !== '/particulier') ||
    (pathname.startsWith('/pro/') && pathname !== '/pro')
  const panel = panelFromPathname(pathname) ?? 'home'

  return (
    <>
      <div
        className={isNestedPanel ? 'hidden' : undefined}
        aria-hidden={isNestedPanel}
        {...(isNestedPanel ? ({ inert: true } as Record<string, boolean>) : {})}
      >
        <SiteSlider initialPanel={panel} initialHome={initialHome} />
      </div>
      {children}
    </>
  )
}
