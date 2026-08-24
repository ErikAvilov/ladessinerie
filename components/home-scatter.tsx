'use client'

import Link from 'next/link'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { IllustrationImage } from '@/components/illustration-image'
import { PanelEnterContext } from '@/components/page-transition'
import { illustrationAlt } from '@/lib/illustration-utils'
import { particulierArtPath } from '@/lib/particulier-routes'
import type { Illustration } from '@/lib/supabase'

const DESKTOP_CARD_SIZE = 108
const MOBILE_CARD_SIZE = 72
const MOBILE_MAX = 767

/**
 * Fixed symmetric halo — 5 per side, no slot below the logo.
 * nx / ny are normalized (−1…1) relative to the scatter area.
 */
const DESKTOP_LAYOUT = [
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

/** Tighter 6-card halo — clears logo, tagline, and narrow side gates. */
const MOBILE_LAYOUT = [
  { nx: -0.4, ny: -0.58, rotate: -8 },
  { nx: -0.46, ny: -0.08, rotate: 6 },
  { nx: -0.34, ny: 0.4, rotate: -5 },
  { nx: 0.4, ny: -0.58, rotate: 8 },
  { nx: 0.46, ny: -0.08, rotate: -6 },
  { nx: 0.34, ny: 0.4, rotate: 5 },
] as const

type LayoutSlot = { nx: number; ny: number; rotate: number }

type PlacedCard = {
  illustration: Illustration
  x: number
  y: number
  rotate: number
}

function placeCards(
  illustrations: Illustration[],
  boxW: number,
  boxH: number,
  layout: readonly LayoutSlot[],
  cardSize: number,
): PlacedCard[] {
  const maxX = Math.max(boxW / 2 - cardSize / 2 - 4, 8)
  const maxY = Math.max(boxH / 2 - cardSize / 2 - 4, 8)
  const spreadX = boxW < MOBILE_MAX ? 0.9 : 0.86
  const spreadY = boxW < MOBILE_MAX ? 0.88 : 0.94

  return illustrations.slice(0, layout.length).map((illustration, i) => {
    const slot = layout[i]
    return {
      illustration,
      x: slot.nx * maxX * spreadX,
      y: slot.ny * maxY * spreadY,
      rotate: slot.rotate,
    }
  })
}

function layoutForWidth(width: number) {
  const mobile = width <= MOBILE_MAX
  return {
    mobile,
    layout: mobile ? MOBILE_LAYOUT : DESKTOP_LAYOUT,
    cardSize: mobile ? MOBILE_CARD_SIZE : DESKTOP_CARD_SIZE,
  }
}

type HomeScatterProps = {
  illustrations: Illustration[]
}

export function HomeScatter({ illustrations }: HomeScatterProps) {
  const enterDelay = useContext(PanelEnterContext)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cards, setCards] = useState<PlacedCard[] | null>(null)
  const [cardSize, setCardSize] = useState(DESKTOP_CARD_SIZE)
  const [explode, setExplode] = useState(false)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el || illustrations.length === 0) return

    const { width, height } = el.getBoundingClientRect()
    if (width > 0 && height > 0) {
      const { layout, cardSize: nextSize } = layoutForWidth(width)
      setCardSize(nextSize)
      setCards(placeCards(illustrations, width, height, layout, nextSize))
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
          const { layout, cardSize: nextSize } = layoutForWidth(width)
          setCardSize(nextSize)
          setCards(placeCards(illustrations, width, height, layout, nextSize))
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
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {cards?.map((card, i) => {
        const href = particulierArtPath(card.illustration.id)

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
              width: cardSize,
              height: cardSize,
              marginLeft: -cardSize / 2,
              marginTop: -cardSize / 2,
            }}
          >
            <Link
              href={href}
              aria-label={card.illustration.title}
              className="block h-full w-full"
            >
              <span className="scatter-glow" aria-hidden />
              <div className="relative h-full w-full overflow-hidden rounded-full paper-shadow">
                <IllustrationImage
                  src={card.illustration.image_url}
                  alt={illustrationAlt(card.illustration)}
                  width={360}
                  height={360}
                  rounded="full"
                  priority={i < 2}
                  className="h-full w-full object-cover transition duration-300 group-hover:brightness-105"
                  sizes="(max-width: 767px) 72px, 120px"
                />
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
