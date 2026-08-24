'use client'

import { usePathname } from 'next/navigation'
import { createContext, useEffect, type ReactNode } from 'react'
import { ParticulierCartProvider } from '@/components/particulier-cart-provider'
import { RouteSideGates } from '@/components/route-side-gates'
import { SiteBackgroundLayer } from '@/components/site-background-layer'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { isSitePanelPath, panelFromPathname } from '@/lib/site-panels'

export const SLIDE_DURATION_MS = 580

/** Delay before inner home animations (ms), synced with slide-in. */
export const PanelEnterContext = createContext(0)

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const isPanelRoute = isSitePanelPath(pathname)
  const isParticulierNested = pathname.startsWith('/particulier/')

  useEffect(() => {
    if (isAdmin || isPanelRoute) return
    document.documentElement.classList.remove('no-scroll')
    document.body.classList.remove('no-scroll')
  }, [isAdmin, isPanelRoute])

  if (isAdmin) {
    return <div className="h-dvh overflow-x-hidden overflow-y-auto bg-background">{children}</div>
  }

  // /, /particulier, /pro → SiteSlider (panier géré dedans, visible seulement sur particulier)
  if (isPanelRoute) {
    return children
  }

  const panel = pathname.startsWith('/particulier')
    ? 'particulier'
    : pathname.startsWith('/pro')
      ? 'pro'
      : 'home'

  const chrome = (
    <PanelEnterContext.Provider value={0}>
      <div className="relative h-dvh overflow-hidden">
        <SiteBackgroundLayer className="absolute inset-0 z-0" />
        <div className="absolute inset-0 z-[1] flex h-dvh flex-col">
          <SiteHeader />
          <RouteSideGates panel={panelFromPathname(pathname) ?? panel} />
          <div
            className={
              isParticulierNested
                ? 'relative flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-72 pt-[4.75rem] md:overflow-y-auto md:px-10 md:pb-96 md:pt-28'
                : 'relative min-h-0 flex-1 overflow-y-auto px-5 pb-24 pt-28 md:px-10'
            }
          >
            {children}
          </div>
          <SiteFooter showTagline={false} />
        </div>
      </div>
    </PanelEnterContext.Provider>
  )

  // Fiches produit /particulier/art/[id] : panier visible
  if (isParticulierNested) {
    return <ParticulierCartProvider visible>{chrome}</ParticulierCartProvider>
  }

  return chrome
}
