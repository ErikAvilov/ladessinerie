'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PanelEnterContext } from '@/components/page-transition'
import { illustrationAlt } from '@/lib/illustration-utils'
import { particulierArtPath } from '@/lib/particulier-routes'
import type { Illustration } from '@/lib/supabase'

const ART_RATIO = 509 / 360
const CARD_WIDTH = 98

/**
 * Fixed symmetric halo — 5 per side, no slot below the logo.
 * nx / ny are normalized (−1…1) relative to the scatter area.
 */
const LAYOUT = [
  { nx: -0.58, ny: -0.6, rotate: -9 },
  { nx: -0.52, ny: -0.14, rotate: 7 },
  { nx: -0.55, ny: 0.3, rotate: -5 },
  { nx: -0.36, ny: -0.74, rotate: 6 },
  { nx: -0.3, ny: 0.38, rotate: -4 },
  { nx: 0.58, ny: -0.6, rotate: 9 },
  { nx: 0.52, ny: -0.14, rotate: -7 },
  { nx: 0.55, ny: 0.3, rotate: 5 },
  { nx: 0.36, ny: -0.74, rotate: -6 },
  { nx: 0.3, ny: 0.38, rotate: 4 },
] as const

type PlacedCard = {
  illustration: Illustration
  x: number
  y: number
  rotate: number
}

function placeCards(illustrations: Illustration[], boxW: number, boxH: number): PlacedCard[] {
  const maxX = boxW / 2 - 8
  const maxY = boxH / 2 - 8

  return illustrations.slice(0, LAYOUT.length).map((illustration, i) => {
    const slot = LAYOUT[i]
    return {
      illustration,
      x: slot.nx * maxX * 0.86,
      y: slot.ny * maxY * 0.94,
      rotate: slot.rotate,
    }
  })
}

type HomeScatterProps = {
  illustrations: Illustration[]
}

export function HomeScatter({ illustrations }: HomeScatterProps) {
  const enterDelay = useContext(PanelEnterContext)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cards, setCards] = useState<PlacedCard[] | null>(null)
  const [explode, setExplode] = useState(false)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el || illustrations.length === 0) return

    const { width, height } = el.getBoundingClientRect()
    if (width > 0 && height > 0) {
      setCards(placeCards(illustrations, width, height))
    }
  }, [illustrations])

  useEffect(() => {
    if (!cards) return

    const timer = window.setTimeout(() => setExplode(true), enterDelay)
    return () => window.clearTimeout(timer)
  }, [cards, enterDelay])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let timeoutId: number | undefined

    const onResize = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        const { width, height } = el.getBoundingClientRect()
        if (width > 0 && height > 0) {
          setCards(placeCards(illustrations, width, height))
        }
      }, 150)
    }

    window.addEventListener('resize', onResize)
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      window.removeEventListener('resize', onResize)
    }
  }, [illustrations])

  if (illustrations.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
    >
      {cards?.map((card, i) => {
        const href = particulierArtPath(card.illustration.id)

        const cardInner = (
          <>
            <span className="scatter-glow" aria-hidden />
            <div className="relative h-full w-full overflow-hidden rounded-sm paper-shadow">
              <Image
                src={card.illustration.image_url}
                alt={illustrationAlt(card.illustration)}
                width={360}
                height={509}
                loading="lazy"
                fetchPriority="low"
                className="h-full w-full object-cover transition duration-300 group-hover:brightness-105"
                sizes="120px"
              />
            </div>
          </>
        )

        return (
          <motion.div
            key={card.illustration.id}
            initial={{
              translateX: 0,
              translateY: 0,
              rotate: 0,
              scale: 0.15,
              opacity: 0,
            }}
            animate={
              explode
                ? {
                    translateX: card.x,
                    translateY: card.y,
                    rotate: card.rotate,
                    scale: 1,
                    opacity: 1,
                  }
                : {
                    translateX: 0,
                    translateY: 0,
                    rotate: 0,
                    scale: 0.15,
                    opacity: 0,
                  }
            }
            whileHover={{ scale: 1.12 }}
            transition={{
              translateX: { delay: i * 0.055, type: 'spring', stiffness: 85, damping: 14 },
              translateY: { delay: i * 0.055, type: 'spring', stiffness: 85, damping: 14 },
              rotate: { delay: i * 0.055, type: 'spring', stiffness: 85, damping: 14 },
              opacity: { delay: i * 0.04, duration: 0.35 },
              scale: { type: 'spring', stiffness: 420, damping: 24 },
            }}
            className="scatter-card group pointer-events-auto absolute left-1/2 top-1/2 cursor-pointer"
            style={{
              width: CARD_WIDTH,
              height: CARD_WIDTH * ART_RATIO,
              marginLeft: -CARD_WIDTH / 2,
              marginTop: -(CARD_WIDTH * ART_RATIO) / 2,
            }}
          >
            <Link
              href={href}
              aria-label={card.illustration.title}
              className="block h-full w-full"
            >
              {cardInner}
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
