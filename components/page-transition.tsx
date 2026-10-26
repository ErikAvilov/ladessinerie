'use client'

import { usePathname } from 'next/navigation'
import { createContext, useEffect, type ReactNode } from 'react'
import { NavigationProgressProvider } from '@/components/navigation-progress'
import { FloatingCaddie } from '@/components/floating-caddie'
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
import {
  getProCategory,
  isProCategorySlug,
} from '@/lib/pro-categories'
import { isSitePanelPath, panelFromPathname } from '@/lib/site-panels'
import { SCROLL_ROOT_ATTR } from '@/lib/scroll-pass-through'
import { CATEGORY_BACKGROUND_TRAITS } from '@/lib/site-theme-shared'

export const SLIDE_DURATION_MS = 580

/** Delay before inner home animations (ms), synced with slide-in. */
export const PanelEnterContext = createContext(0)

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const theme = useSiteTheme()
  const isAdmin = pathname.startsWith('/admin')
  const isPanelRoute = isSitePanelPath(pathname)
  const isParticulierNested = pathname.startsWith('/particulier/')
  const isProNested = pathname.startsWith('/pro/')
  const particulierCategorySlug = pathname.startsWith('/particulier/')
    ? pathname.split('/')[2] ?? ''
    : ''
  const proCategorySlug = pathname.startsWith('/pro/')
    ? pathname.split('/')[2] ?? ''
    : ''
  const particulierCategory =
    particulierCategorySlug &&
    particulierCategorySlug !== 'art' &&
    isParticulierCategorySlug(particulierCategorySlug)
      ? getParticulierCategory(particulierCategorySlug)
      : undefined
  const proCategory =
    proCategorySlug &&
    proCategorySlug !== 'projet' &&
    isProCategorySlug(proCategorySlug)
      ? getProCategory(proCategorySlug)
      : undefined
  const categoryFond = particulierCategory
    ? theme.fondColor(particulierCategory.slug)
    : proCategory
      ? theme.fondColor(proCategory.slug)
      : undefined

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
  const showFloatingCaddie =
    pathname === '/pro' || pathname.startsWith('/pro/')
  const isArtDetail = pathname.startsWith('/particulier/art/')
  const isProjectDetail = pathname.startsWith('/pro/projet/')
  const isDetailView = isArtDetail || isProjectDetail
  const cartSize = isDetailView ? 'sm' : 'lg'

  const shell = (() => {
    // /, /particulier, /pro, /a-propos → SiteSlider
    if (isPanelRoute) {
      return (
        <>
          {children}
          {showFloatingCaddie ? <FloatingCaddie size={cartSize} /> : null}
        </>
      )
    }

    const panel = pathname.startsWith('/particulier')
      ? 'particulier'
      : pathname.startsWith('/pro')
        ? 'pro'
        : 'home'

    const hideSideGates =
      pathname === '/succes' || pathname === '/panier' || isDetailView

    // Fiche détail : padding léger, panier/caddie sm ; le contenu est déjà « dézoomé ».
    const contentPad = isDetailView
      ? 'relative flex min-h-0 flex-1 flex-col items-center overflow-hidden px-3 pb-20 pt-14 md:px-8 md:pb-24 md:pt-16'
      : isParticulierNested ||
          isProNested ||
          pathname === '/panier' ||
          pathname === '/succes'
        ? 'relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-44 pt-[4.75rem] md:px-10 md:pb-56 md:pt-28'
        : 'relative min-h-0 flex-1 overflow-y-auto px-5 pb-24 pt-28 md:px-10'

    const isScrollableContent = !isDetailView

    return (
      <PanelEnterContext.Provider value={0}>
        <div className="relative h-dvh overflow-hidden">
          <SiteBackgroundLayer
            className="absolute inset-0 z-0"
            fond={categoryFond}
            traits={categoryFond ? CATEGORY_BACKGROUND_TRAITS : undefined}
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
            {!isDetailView && <SiteFooter showTagline={false} />}
          </div>
          {showFloatingCaddie ? <FloatingCaddie size={cartSize} /> : null}
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
