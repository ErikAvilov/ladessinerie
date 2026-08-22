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
    <div className="relative flex h-full min-h-0 flex-col items-center justify-center overflow-hidden px-[clamp(10.5rem,20vw,16.5rem)] pb-[6.75rem] pt-[4.25rem]">
      <HomeScatter illustrations={illustrations} />
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={showLogo ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 size-32 shrink-0 md:size-40"
      >
        <Image
          src="/art/logo.png"
          alt="La Dessinerie"
          width={150}
          height={150}
          className="h-full w-full object-contain"
          sizes="160px"
        />
      </motion.div>

      <motion.p
        aria-hidden={!showTagline}
        initial={false}
        animate={{ opacity: showTagline ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-x-5 bottom-14 z-10 text-center text-xs leading-relaxed text-foreground/50 md:inset-x-10 md:bottom-16 md:text-sm"
      >
        Illustrations uniques &amp; branding créatif pour marques et particuliers
      </motion.p>
    </div>
  )
}
