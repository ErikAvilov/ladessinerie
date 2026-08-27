'use client'

import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { IllustrationImage } from '@/components/illustration-image'
import { InstantLink } from '@/components/instant-link'
import { PanelEnterContext } from '@/components/page-transition'
import {
  HOME_SCATTER_INTRINSIC_PX,
  HOME_SCATTER_PRELOAD_COUNT,
  HOME_SCATTER_SIZES,
} from '@/lib/home-image'
import { illustrationAlt } from '@/lib/illustration-utils'
import { particulierArtPath } from '@/lib/particulier-routes'
import { usePrefetchOnIntent } from '@/lib/use-prefetch-on-intent'
import type { Illustration } from '@/lib/illustrations'

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
  const { onIntent, cancelIntent } = usePrefetchOnIntent()

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

  // Explosion dès que le layout est prêt (+ délai panel) — les images shimmer en place.
  useEffect(() => {
    if (!cards?.length) return
    setExplode(false)
    const timer = window.setTimeout(() => setExplode(true), Math.max(enterDelay, 40))
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
      {/* Halo fantôme immédiat : le site « vit » avant les bitmaps. */}
      {!explode &&
        cards?.map((card) => (
          <div
            key={`ghost-${card.illustration.id}`}
            aria-hidden
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-full"
            style={{
              width: cardSize,
              height: cardSize,
              marginLeft: -cardSize / 2,
              marginTop: -cardSize / 2,
              transform: `translate(${card.x}px, ${card.y}px) rotate(${card.rotate}deg)`,
            }}
          >
            <span className="image-load-shimmer block h-full w-full rounded-full" />
          </div>
        ))}

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
            <InstantLink
              href={href}
              aria-label={card.illustration.title}
              className="block h-full w-full"
              onPointerEnter={() => onIntent(href)}
              onFocus={() => onIntent(href)}
              onPointerLeave={cancelIntent}
            >
              <span className="scatter-glow" aria-hidden />
              <div className="relative h-full w-full overflow-hidden rounded-full paper-shadow">
                <IllustrationImage
                  src={card.illustration.image}
                  alt={illustrationAlt(card.illustration)}
                  dominantColor={card.illustration.dominantColor}
                  width={HOME_SCATTER_INTRINSIC_PX}
                  height={HOME_SCATTER_INTRINSIC_PX}
                  rounded="full"
                  loading="eager"
                  fetchPriority={i < HOME_SCATTER_PRELOAD_COUNT ? 'high' : 'auto'}
                  fade
                  className="h-full w-full object-cover transition duration-300 group-hover:brightness-105"
                  sizes={HOME_SCATTER_SIZES}
                />
              </div>
            </InstantLink>
          </motion.div>
        )
      })}
    </div>
  )
}
