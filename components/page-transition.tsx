'use client'

import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { usePathname } from 'next/navigation'
import { useContext, useEffect, useRef, type ReactNode, createContext } from 'react'
import { RouteSideGates } from '@/components/route-side-gates'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

const slideEase = [0.65, 0, 0.35, 1] as const
export const SLIDE_DURATION_MS = 580

const slideVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? '100%' : '-100%',
  }),
  center: { x: '0%' },
  exit: (direction: number) => ({
    x: direction >= 0 ? '-100%' : '100%',
  }),
}

function routeKey(pathname: string) {
  if (pathname.startsWith('/particulier')) return 'particulier'
  if (pathname.startsWith('/pro')) return 'pro'
  return 'home'
}

function routeIndex(pathname: string) {
  if (pathname.startsWith('/particulier')) return 0
  if (pathname.startsWith('/pro')) return 2
  return 1
}

/** Delay before inner home animations (ms), synced with slide-in. */
export const PanelEnterContext = createContext(0)

function FrozenRouter({ children }: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext)
  const frozen = useRef(context)
  const isPresent = useIsPresent()

  // Panel actif : laisser le routeur Next.js gérer la navigation (ex. /particulier → /particulier/art/id)
  if (isPresent) {
    frozen.current = context
    return children
  }

  // Panel en sortie (slide) : figer le contenu pour l'animation
  if (!frozen.current) {
    return children
  }

  return (
    <LayoutRouterContext.Provider value={frozen.current}>
      {children}
    </LayoutRouterContext.Provider>
  )
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const prevPathnameRef = useRef(pathname)
  const directionRef = useRef(0)

  const key = routeKey(pathname)
  const isHome = key === 'home'

  let panelEnterDelay = 0
  if (!isAdmin && key !== routeKey(prevPathnameRef.current)) {
    directionRef.current = routeIndex(pathname) - routeIndex(prevPathnameRef.current)
    if (key === 'home') panelEnterDelay = SLIDE_DURATION_MS
    prevPathnameRef.current = pathname
  }

  useEffect(() => {
    const root = document.documentElement
    if (isAdmin) {
      root.classList.remove('no-scroll')
      document.body.classList.remove('no-scroll')
      return
    }

    if (isHome) {
      root.classList.add('no-scroll')
      document.body.classList.add('no-scroll')
    } else {
      root.classList.remove('no-scroll')
      document.body.classList.remove('no-scroll')
    }
    return () => {
      root.classList.remove('no-scroll')
      document.body.classList.remove('no-scroll')
    }
  }, [isAdmin, isHome])

  if (isAdmin) {
    return <div className="h-dvh overflow-x-hidden overflow-y-auto bg-background">{children}</div>
  }

  return (
    <PanelEnterContext.Provider value={panelEnterDelay}>
      <div className="relative h-dvh overflow-hidden bg-background">
        <AnimatePresence mode="sync" initial={false} custom={directionRef.current}>
          <motion.section
            key={key}
            custom={directionRef.current}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: SLIDE_DURATION_MS / 1000, ease: slideEase }}
            className="absolute inset-0 flex h-dvh flex-col bg-background will-change-transform"
          >
            <SiteHeader />
            <RouteSideGates panel={key} />
            <div
              className={
                isHome
                  ? 'relative min-h-0 flex-1 overflow-hidden px-5 pt-24 pb-10 md:px-10'
                  : 'relative min-h-0 flex-1 overflow-y-auto px-5 pb-24 pt-28 md:px-10'
              }
            >
              <FrozenRouter>{children}</FrozenRouter>
            </div>
            <SiteFooter showTagline={isHome} />
          </motion.section>
        </AnimatePresence>
      </div>
    </PanelEnterContext.Provider>
  )
}
