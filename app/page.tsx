'use client'

import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HomeScatter } from '@/components/home-scatter'
import { PanelEnterContext } from '@/components/page-transition'

export default function HomePage() {
  const enterDelay = useContext(PanelEnterContext)
  const [showLogo, setShowLogo] = useState(enterDelay === 0)

  useEffect(() => {
    if (enterDelay === 0) {
      setShowLogo(true)
      return
    }

    const timer = window.setTimeout(() => setShowLogo(true), enterDelay)
    return () => window.clearTimeout(timer)
  }, [enterDelay])

  return (
    <div className="relative flex h-full min-h-0 flex-col items-center justify-center overflow-hidden px-[clamp(10.5rem,20vw,16.5rem)] pb-[6.75rem] pt-[4.25rem]">
      <HomeScatter />
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
          priority
        />
      </motion.div>
    </div>
  )
}
