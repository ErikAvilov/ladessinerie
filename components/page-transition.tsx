'use client'

import { usePathname } from 'next/navigation'
import { createContext, useEffect, type ReactNode } from 'react'
import { NavigationProgressProvider } from '@/components/navigation-progress'
import { ParticulierCartProvider } from '@/components/particulier-cart-provider'
import { ShoppingReturnTracker } from '@/components/shopping-return-tracker'
import { RouteSideGates } from '@/components/route-side-gates'
import { SiteBackgroundLayer } from '@/components/site-background-layer'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { useSiteTheme } from '@/components/site-theme-context'
import {
  getParticulierCategory,
  isParticulierCategorySlug,
} from '@/lib/particulier-categories'
import { isSitePanelPath, panelFromPathname } from '@/lib/site-panels'
import { SCROLL_ROOT_ATTR } from '@/lib/scroll-pass-through'
import { BOUTON_BACKGROUND_FOND } from '@/lib/site-theme-shared'

export const SLIDE_DURATION_MS = 580

/** Delay before inner home animations (ms), synced with slide-in. */
export const PanelEnterContext = createContext(0)

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const theme = useSiteTheme()
  const isAdmin = pathname.startsWith('/admin')
  const isPanelRoute = isSitePanelPath(pathname)
  const isParticulierNested = pathname.startsWith('/particulier/')
  const categorySlug = pathname.startsWith('/particulier/')
    ? pathname.split('/')[2] ?? ''
    : ''
  const category =
    categorySlug &&
    categorySlug !== 'art' &&
    isParticulierCategorySlug(categorySlug)
      ? getParticulierCategory(categorySlug)
      : undefined
  const categoryColor = category ? theme.boutonColor(category.slug) : undefined

  useEffect(() => {
    if (isAdmin) {
      document.documentElement.classList.remove('no-scroll')
      document.body.classList.remove('no-scroll')
      return
    }
    if (isPanelRoute) return
    document.documentElement.classList.remove('no-scroll')
    document.body.classList.remove('no-scroll')
  }, [isAdmin, isPanelRoute])

  if (isAdmin) {
    return children
  }

  const showFloatingCart =
    pathname === '/particulier' || pathname.startsWith('/particulier/')
  const isArtDetail = pathname.startsWith('/particulier/art/')
  const cartSize = isArtDetail ? 'sm' : 'lg'

  const shell = (() => {
    // /, /particulier, /pro, /a-propos → SiteSlider
    if (isPanelRoute) {
      return children
    }

    const panel = pathname.startsWith('/particulier')
      ? 'particulier'
      : pathname.startsWith('/pro')
        ? 'pro'
        : 'home'

    const hideSideGates =
      pathname === '/succes' || pathname === '/panier' || isArtDetail

    // Fiche art : padding léger, panier sm ; le contenu est déjà « dézoomé ».
    const contentPad = isArtDetail
      ? 'relative flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-20 pt-14 md:px-8 md:pb-24 md:pt-16'
      : isParticulierNested || pathname === '/panier' || pathname === '/succes'
        ? 'relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-44 pt-[4.75rem] md:px-10 md:pb-56 md:pt-28'
        : 'relative min-h-0 flex-1 overflow-y-auto px-5 pb-24 pt-28 md:px-10'

    const isScrollableContent = !isArtDetail

    return (
      <PanelEnterContext.Provider value={0}>
        <div className="relative h-dvh overflow-hidden">
          <SiteBackgroundLayer
            className="absolute inset-0 z-0"
            fond={categoryColor}
            traits={categoryColor ? BOUTON_BACKGROUND_FOND : undefined}
          />
          <div className="absolute inset-0 z-[1] flex h-dvh flex-col">
            <SiteHeader />
            {!hideSideGates && (
              <RouteSideGates panel={panelFromPathname(pathname) ?? panel} />
            )}
            <div
              className={contentPad}
              {...(isScrollableContent ? { [SCROLL_ROOT_ATTR]: '' } : {})}
            >
              {children}
            </div>
            {!isArtDetail && <SiteFooter showTagline={false} />}
          </div>
        </div>
      </PanelEnterContext.Provider>
    )
  })()

  return (
    <NavigationProgressProvider>
      <ParticulierCartProvider visible={showFloatingCart} cartSize={cartSize}>
        {showFloatingCart ? <ShoppingReturnTracker /> : null}
        {shell}
      </ParticulierCartProvider>
    </NavigationProgressProvider>
  )
}
