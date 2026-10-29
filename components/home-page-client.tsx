'use client'

import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HomeScatter } from '@/components/home-scatter'
import { PanelEnterContext } from '@/components/page-transition'
import { useSitePanel } from '@/components/site-panel-context'
import {
  HOME_LOGO_HEIGHT,
  HOME_LOGO_SIZES,
  HOME_LOGO_WIDTH,
} from '@/lib/home-image'
import type { Illustration } from '@/lib/illustrations'

type HomePageClientProps = {
  illustrations: Illustration[]
}

/** Logo déjà révélé dans la session — pas de re-fade au retour. */
let homeLogoHasShown = false

export function HomePageClient({ illustrations }: HomePageClientProps) {
  const enterDelay = useContext(PanelEnterContext)
  const sitePanel = useSitePanel()
  const [showLogo, setShowLogo] = useState(
    () => homeLogoHasShown || enterDelay === 0,
  )
  const [logoReady, setLogoReady] = useState(false)

  useEffect(() => {
    if (homeLogoHasShown) {
      setShowLogo(true)
      return
    }
    if (enterDelay === 0) {
      homeLogoHasShown = true
      setShowLogo(true)
      return
    }

    const logoTimer = window.setTimeout(() => {
      homeLogoHasShown = true
      setShowLogo(true)
    }, enterDelay)
    return () => {
      window.clearTimeout(logoTimer)
    }
  }, [enterDelay])

  return (
    <div className="relative flex h-full min-h-0 flex-col items-center justify-center overflow-hidden px-11 pb-28 pt-20 md:px-[clamp(10.5rem,20vw,16.5rem)] md:pb-[6.75rem] md:pt-[4.25rem]">
      <HomeScatter illustrations={illustrations} />
      <motion.button
        type="button"
        aria-label="Découvrir Anna, l’illustratrice"
        onClick={() => sitePanel?.goTo('about')}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={showLogo ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
        whileHover={{ scale: 1.08, rotate: -4, transition: { duration: 0.22 } }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="group relative z-10 size-24 shrink-0 cursor-pointer md:size-40"
      >
        <span
          aria-hidden
          className={`image-load-shimmer pointer-events-none absolute inset-[12%] rounded-full transition-opacity duration-300 ${
            logoReady ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <Image
          src="/images/logo.webp"
          alt="La Dessinerie"
          width={HOME_LOGO_WIDTH}
          height={HOME_LOGO_HEIGHT}
          className={`relative h-full w-full object-contain transition duration-300 group-hover:brightness-110 ${
            logoReady ? 'opacity-100' : 'opacity-0'
          }`}
          sizes={HOME_LOGO_SIZES}
          loading="eager"
          fetchPriority="high"
          onLoad={() => setLogoReady(true)}
        />
      </motion.button>
    </div>
  )
}
