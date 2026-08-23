'use client'

import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HomeScatter } from '@/components/home-scatter'
import { PanelEnterContext } from '@/components/page-transition'
import type { Illustration } from '@/lib/supabase'

type HomePageClientProps = {
  illustrations: Illustration[]
}

export function HomePageClient({ illustrations }: HomePageClientProps) {
  const enterDelay = useContext(PanelEnterContext)
  const [showLogo, setShowLogo] = useState(enterDelay === 0)
  const [showTagline, setShowTagline] = useState(enterDelay === 0)

  useEffect(() => {
    if (enterDelay === 0) {
      setShowLogo(true)
      setShowTagline(true)
      return
    }

    setShowLogo(false)
    setShowTagline(false)

    const logoTimer = window.setTimeout(() => setShowLogo(true), enterDelay)
    const taglineTimer = window.setTimeout(() => setShowTagline(true), enterDelay)
    return () => {
      window.clearTimeout(logoTimer)
      window.clearTimeout(taglineTimer)
    }
  }, [enterDelay])

  return (
    <div className="relative flex h-full min-h-0 flex-col items-center justify-center overflow-hidden px-11 pb-28 pt-20 md:px-[clamp(10.5rem,20vw,16.5rem)] md:pb-[6.75rem] md:pt-[4.25rem]">
      <HomeScatter illustrations={illustrations} />
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={showLogo ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 size-24 shrink-0 md:size-40"
      >
        <Image
          src="/images/logo.webp"
          alt="La Dessinerie"
          width={13244}
          height={9354}
          className="h-full w-full object-contain"
          sizes="160px"
          priority
        />
      </motion.div>

      <motion.p
        aria-hidden={!showTagline}
        initial={false}
        animate={{ opacity: showTagline ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-x-12 bottom-16 z-10 text-center text-[11px] leading-relaxed text-foreground/50 md:inset-x-10 md:bottom-16 md:text-sm"
      >
        Illustrations uniques &amp; branding créatif pour marques et particuliers
      </motion.p>
    </div>
  )
}
