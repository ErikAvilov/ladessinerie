'use client'

import { useLayoutEffect, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { BoutonIcon } from '@/components/bouton-icon'
import { SiteBackgroundLayer } from '@/components/site-background-layer'
import { CATEGORY_BACKGROUND_TRAITS } from '@/lib/site-theme-shared'

export const DIVE_DURATION_MS = 860

/** Ease-out doux : accélération courte, freinage long (évite le « cran » final). */
const DIVE_EASE = [0.16, 1, 0.3, 1] as const
/** Fondu qui reste opaque puis s’évapore progressivement. */
const FADE_EASE = [0.4, 0, 0.2, 1] as const

type Rect = {
  top: number
  left: number
  width: number
  height: number
}

type CategoryDiveOverlayProps = {
  imageSrc: string
  color: string
  fondColor: string
  from: Rect
  onComplete: () => void
}

function coverScale(from: Rect) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  // Légèrement > 1× viewport pour couvrir, sans forcer un scale extrême (GPU).
  const scaleX = (vw * 1.18) / Math.max(from.width, 1)
  const scaleY = (vh * 1.18) / Math.max(from.height, 1)
  return Math.max(scaleX, scaleY)
}

export function CategoryDiveOverlay({
  imageSrc,
  color,
  fondColor,
  from,
  onComplete,
}: CategoryDiveOverlayProps) {
  const [portalReady, setPortalReady] = useState(false)
  const [scale, setScale] = useState(1)
  const [reduce, setReduce] = useState(false)

  useLayoutEffect(() => {
    setPortalReady(true)
    setScale(coverScale(from))
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [from])

  useEffect(() => {
    const duration = reduce ? 160 : DIVE_DURATION_MS
    const timer = window.setTimeout(onComplete, duration)
    return () => window.clearTimeout(timer)
  }, [onComplete, reduce])

  if (!portalReady) return null

  const seconds = DIVE_DURATION_MS / 1000

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[45]" aria-hidden>
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.1 : 0.42, ease: FADE_EASE }}
      >
        <SiteBackgroundLayer
          className="absolute inset-0"
          fond={fondColor}
          traits={CATEGORY_BACKGROUND_TRAITS}
        />
      </motion.div>

      {/*
        Uniquement transform + opacity (compositing GPU).
        Pas de top/left animés : le transform-origin centre suffit au « dive ».
      */}
      <motion.div
        className="absolute"
        initial={{ scale: 1, opacity: 1 }}
        animate={
          reduce
            ? { opacity: 0, scale: 1.04 }
            : {
                scale,
                opacity: [1, 1, 0.55, 0],
              }
        }
        transition={
          reduce
            ? { duration: 0.14, ease: 'easeOut' }
            : {
                scale: { duration: seconds, ease: DIVE_EASE },
                opacity: {
                  duration: seconds,
                  times: [0, 0.38, 0.72, 1],
                  ease: ['linear', FADE_EASE, FADE_EASE],
                },
              }
        }
        style={{
          top: from.top,
          left: from.left,
          width: from.width,
          height: from.height,
          transformOrigin: '50% 50%',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
      >
        <BoutonIcon
          src={imageSrc}
          color={color}
          plain
          className="h-full w-full"
        />
      </motion.div>
    </div>,
    document.body,
  )
}
