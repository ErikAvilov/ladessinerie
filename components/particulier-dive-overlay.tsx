'use client'

import { useLayoutEffect, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { BoutonIcon } from '@/components/bouton-icon'
import { SiteBackgroundLayer } from '@/components/site-background-layer'
import type { ParticulierCategory } from '@/lib/particulier-categories'
import { BOUTON_BACKGROUND_FOND } from '@/lib/site-theme-shared'

export const DIVE_DURATION_MS = 720

type Rect = {
  top: number
  left: number
  width: number
  height: number
}

type ParticulierDiveOverlayProps = {
  category: ParticulierCategory
  color: string
  from: Rect
  onComplete: () => void
}

function coverScale(from: Rect) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const scaleX = (vw * 1.35) / Math.max(from.width, 1)
  const scaleY = (vh * 1.35) / Math.max(from.height, 1)
  return Math.max(scaleX, scaleY)
}

export function ParticulierDiveOverlay({
  category,
  color,
  from,
  onComplete,
}: ParticulierDiveOverlayProps) {
  const [portalReady, setPortalReady] = useState(false)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    setPortalReady(true)
    setScale(coverScale(from))
  }, [from])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduce ? 180 : DIVE_DURATION_MS
    const timer = window.setTimeout(onComplete, duration)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  if (!portalReady) return null

  const cx = from.left + from.width / 2
  const cy = from.top + from.height / 2
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[45]" aria-hidden>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.12 : 0.28, ease: 'easeOut' }}
      >
        <SiteBackgroundLayer
          className="absolute inset-0"
          fond={color}
          traits={BOUTON_BACKGROUND_FOND}
        />
      </motion.div>

      <motion.div
        className="absolute overflow-hidden"
        initial={{
          top: from.top,
          left: from.left,
          width: from.width,
          height: from.height,
          scale: 1,
          opacity: 1,
        }}
        animate={
          reduce
            ? { opacity: 0, scale: 1.05 }
            : {
                top: cy - from.height / 2,
                left: cx - from.width / 2,
                scale,
                opacity: [1, 1, 0],
              }
        }
        transition={
          reduce
            ? { duration: 0.15 }
            : {
                scale: { duration: DIVE_DURATION_MS / 1000, ease: [0.65, 0, 0.2, 1] },
                top: { duration: DIVE_DURATION_MS / 1000, ease: [0.65, 0, 0.2, 1] },
                left: { duration: DIVE_DURATION_MS / 1000, ease: [0.65, 0, 0.2, 1] },
                opacity: { duration: DIVE_DURATION_MS / 1000, times: [0, 0.72, 1] },
              }
        }
        style={{ transformOrigin: '50% 50%' }}
      >
        <BoutonIcon
          src={category.imageSrc}
          color={color}
          className="h-full w-full"
        />
      </motion.div>
    </div>,
    document.body,
  )
}
