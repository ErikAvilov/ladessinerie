'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { HomePageClient } from '@/components/home-page-client'
import { AboutPageClient } from '@/components/about-page-client'
import { ParticulierPageClient } from '@/components/particulier-page-client'
import { PanelEnterContext, SLIDE_DURATION_MS } from '@/components/page-transition'
import { ProPageClient } from '@/components/pro-page-client'
import { SiteBackgroundLayer } from '@/components/site-background-layer'
import { RouteSideGates } from '@/components/route-side-gates'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { SitePanelContext } from '@/components/site-panel-context'
import {
  panelFromPathname,
  panelIndex,
  SITE_PANEL_PATH,
  SITE_PANEL_TITLE,
  type SitePanel,
} from '@/lib/site-panels'
import type { Illustration } from '@/lib/illustrations'

const slideEase = [0.65, 0, 0.35, 1] as const

type SiteSliderProps = {
  initialPanel: SitePanel
  initialHome?: Illustration[]
  initialPro?: Illustration[]
}

export function SiteSlider({
  initialPanel,
  initialHome = [],
  initialPro = [],
}: SiteSliderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [panel, setPanel] = useState<SitePanel>(initialPanel)
  const [enterDelay, setEnterDelay] = useState(0)
  const panelRef = useRef(panel)

  panelRef.current = panel

  // Keep panel in sync with the real Next.js URL (back/forward included).
  useEffect(() => {
    const fromPath = panelFromPathname(pathname)
    if (!fromPath || fromPath === panelRef.current) return
    setEnterDelay(0)
    setPanel(fromPath)
  }, [pathname])

  const goTo = useCallback(
    (next: SitePanel) => {
      if (panelRef.current === next) return

      setEnterDelay(next === 'home' ? SLIDE_DURATION_MS : 0)
      setPanel(next)
      document.title = SITE_PANEL_TITLE[next]
      router.push(SITE_PANEL_PATH[next], { scroll: false })
    },
    [router],
  )

  useEffect(() => {
    const lockScroll = panel === 'home' || panel === 'about'
    document.documentElement.classList.toggle('no-scroll', lockScroll)
    document.body.classList.toggle('no-scroll', lockScroll)
    return () => {
      document.documentElement.classList.remove('no-scroll')
      document.body.classList.remove('no-scroll')
    }
  }, [panel])

  const contextValue = useMemo(
    () => ({ panel, goTo, isSlider: true as const }),
    [panel, goTo],
  )

  return (
    <SitePanelContext.Provider value={contextValue}>
      <PanelEnterContext.Provider value={enterDelay}>
        <div className="relative h-dvh overflow-hidden">
          <SiteBackgroundLayer className="absolute inset-0 z-0" />
          <div className="relative z-[1] h-dvh">
            <SiteHeader />
            <RouteSideGates panel={panel} onNavigate={goTo} />

            <motion.div
              className="h-[200dvh] w-full will-change-transform"
              initial={false}
              animate={{ y: panel === 'about' ? '-100dvh' : '0dvh' }}
              transition={{ duration: SLIDE_DURATION_MS / 1000, ease: slideEase }}
            >
              <div className="h-dvh overflow-hidden">
                <motion.div
                  className="flex h-dvh w-[300vw] will-change-transform"
                  initial={false}
                  animate={{ x: `-${panelIndex(panel) * 100}vw` }}
                  transition={{ duration: SLIDE_DURATION_MS / 1000, ease: slideEase }}
                >
                  <section className="relative h-dvh w-screen shrink-0 overflow-hidden pt-20 pb-2 pl-4 pr-14 md:pt-24 md:pl-10 md:pr-20">
                    <ParticulierPageClient />
                  </section>

                  <section className="relative h-dvh w-screen shrink-0 overflow-hidden px-0 pb-10 pt-16 md:px-10 md:pt-24">
                    <HomePageClient illustrations={initialHome} />
                  </section>

                  <section className="relative h-dvh w-screen shrink-0 overflow-y-auto pt-24 pb-24 pl-14 pr-4 md:pt-28 md:pl-20 md:pr-10">
                    <ProPageClient illustrations={initialPro} />
                  </section>
                </motion.div>
              </div>

              <section className="relative h-dvh w-full overflow-hidden px-5 pb-8 pt-24 md:px-16 md:pb-10 md:pt-28">
                <AboutPageClient />
              </section>
            </motion.div>

            <SiteFooter />
          </div>
        </div>
      </PanelEnterContext.Provider>
    </SitePanelContext.Provider>
  )
}
