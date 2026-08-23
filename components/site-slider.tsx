'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { HomePageClient } from '@/components/home-page-client'
import { ParticulierCartProvider } from '@/components/particulier-cart-provider'
import { ParticulierPageClient } from '@/components/particulier-page-client'
import { PanelEnterContext, SLIDE_DURATION_MS } from '@/components/page-transition'
import { ProPageClient } from '@/components/pro-page-client'
import { RouteSideGates } from '@/components/route-side-gates'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { SitePanelContext } from '@/components/site-panel-context'
import {
  fetchIllustrationsClient,
  preloadIllustrationImages,
} from '@/lib/fetch-illustrations-client'
import { pickHomeScatterIllustrations } from '@/lib/home-scatter-pick'
import {
  panelIndex,
  SITE_PANEL_PATH,
  SITE_PANEL_TITLE,
  type SitePanel,
} from '@/lib/site-panels'
import type { Illustration } from '@/lib/supabase'

const slideEase = [0.65, 0, 0.35, 1] as const

type SiteSliderProps = {
  initialPanel: SitePanel
  initialHome?: Illustration[]
  initialParticulier?: Illustration[]
  initialPro?: Illustration[]
}

export function SiteSlider({
  initialPanel,
  initialHome = [],
  initialParticulier = [],
  initialPro = [],
}: SiteSliderProps) {
  const [panel, setPanel] = useState<SitePanel>(initialPanel)
  const [enterDelay, setEnterDelay] = useState(0)
  const [homeIllustrations, setHomeIllustrations] = useState(initialHome)
  const [particulierIllustrations, setParticulierIllustrations] =
    useState(initialParticulier)
  const [proIllustrations, setProIllustrations] = useState(initialPro)
  const panelRef = useRef(panel)
  const preloadStartedRef = useRef(false)

  panelRef.current = panel

  const goTo = useCallback((next: SitePanel) => {
    if (panelRef.current === next) return

    setEnterDelay(next === 'home' ? SLIDE_DURATION_MS : 0)
    setPanel(next)

    // Différer pushState hors du cycle de rendu React / setState
    queueMicrotask(() => {
      window.history.pushState({ panel: next }, '', SITE_PANEL_PATH[next])
      document.title = SITE_PANEL_TITLE[next]
    })
  }, [])

  useEffect(() => {
    function onPopState() {
      const path = window.location.pathname
      if (path === '/particulier') setPanel('particulier')
      else if (path === '/pro') setPanel('pro')
      else setPanel('home')
      setEnterDelay(0)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('no-scroll', panel === 'home')
    document.body.classList.toggle('no-scroll', panel === 'home')
    return () => {
      document.documentElement.classList.remove('no-scroll')
      document.body.classList.remove('no-scroll')
    }
  }, [panel])

  useEffect(() => {
    if (preloadStartedRef.current) return
    preloadStartedRef.current = true

    let cancelled = false

    async function preloadOthers() {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })
      if (cancelled) return

      if (initialPanel === 'home' && homeIllustrations.length) {
        preloadIllustrationImages(homeIllustrations)
      }
      if (initialPanel === 'particulier' && particulierIllustrations.length) {
        preloadIllustrationImages(particulierIllustrations)
      }
      if (initialPanel === 'pro' && proIllustrations.length) {
        preloadIllustrationImages(proIllustrations)
      }

      const [particulier, pro] = await Promise.all([
        fetchIllustrationsClient('particulier'),
        fetchIllustrationsClient('pro'),
      ])
      if (cancelled) return

      const scatter = pickHomeScatterIllustrations(particulier)

      setHomeIllustrations((current) => (current.length ? current : scatter))
      setParticulierIllustrations((current) => (current.length ? current : particulier))
      setProIllustrations((current) => (current.length ? current : pro))

      preloadIllustrationImages(scatter)
      preloadIllustrationImages(particulier)
      preloadIllustrationImages(pro)
    }

    void preloadOthers()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot preload
  }, [])

  const contextValue = useMemo(
    () => ({ panel, goTo, isSlider: true as const }),
    [panel, goTo],
  )

  return (
    <SitePanelContext.Provider value={contextValue}>
      <PanelEnterContext.Provider value={enterDelay}>
        <ParticulierCartProvider visible={panel === 'particulier'}>
          <div className="site-background relative h-dvh overflow-hidden">
            <SiteHeader />
            <RouteSideGates panel={panel} onNavigate={goTo} />

            <motion.div
              className="flex h-dvh w-[300vw] will-change-transform"
              initial={false}
              animate={{ x: `-${panelIndex(panel) * 100}vw` }}
              transition={{ duration: SLIDE_DURATION_MS / 1000, ease: slideEase }}
            >
              <section className="relative h-dvh w-screen shrink-0 overflow-y-auto pt-24 pb-72 pl-4 pr-14 md:pt-28 md:pb-96 md:pl-10 md:pr-20">
                <ParticulierPageClient illustrations={particulierIllustrations} />
              </section>

              <section className="relative h-dvh w-screen shrink-0 overflow-hidden px-0 pb-10 pt-16 md:px-10 md:pt-24">
                <HomePageClient illustrations={homeIllustrations} />
              </section>

              <section className="relative h-dvh w-screen shrink-0 overflow-y-auto pt-24 pb-24 pl-14 pr-4 md:pt-28 md:pl-20 md:pr-10">
                <ProPageClient illustrations={proIllustrations} />
              </section>
            </motion.div>

            <SiteFooter />
          </div>
        </ParticulierCartProvider>
      </PanelEnterContext.Provider>
    </SitePanelContext.Provider>
  )
}
