'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { InstantLink } from '@/components/instant-link'
import { CaddieIcon } from '@/components/caddie-icon'
import { forwardWheelToScroll } from '@/lib/scroll-pass-through'

export type FloatingCaddieSize = 'sm' | 'lg'

type FloatingCaddieProps = {
  size?: FloatingCaddieSize
  /** Affiché / masqué — le fondu de sortie se joue avant le unmount interne. */
  active?: boolean
  /** Délai avant le fondu d’apparition (ex. fin du slide). */
  enterDelayMs?: number
}

const CADDIE_SIZE = {
  sm: {
    shell: 'size-[8.25rem] md:size-[13.5rem]',
    icon: 'h-[7.125rem] w-[10rem] md:h-[11.25rem] md:w-[16rem]',
  },
  lg: {
    shell: 'size-[12.375rem] md:size-[20.25rem]',
    icon: 'h-[10.6875rem] w-[15rem] md:h-[16.875rem] md:w-[24rem]',
  },
} as const

const springSnappy = { type: 'spring' as const, stiffness: 420, damping: 18, mass: 0.7 }
const springSoft = { type: 'spring' as const, stiffness: 280, damping: 22 }
const FADE_MS = 380

export function FloatingCaddie({
  size = 'lg',
  active = true,
  enterDelayMs = 0,
}: FloatingCaddieProps) {
  const [hydrated, setHydrated] = useState(false)
  const [present, setPresent] = useState(active)
  const [revealed, setRevealed] = useState(false)
  const [entranceReady, setEntranceReady] = useState(false)
  const [hovered, setHovered] = useState(false)
  const reduceMotion = useReducedMotion()
  const dims = CADDIE_SIZE[size]
  const canAnimate = entranceReady && revealed

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    if (active) {
      setPresent(true)
      setRevealed(false)
      setEntranceReady(false)
      const delay = reduceMotion ? 0 : enterDelayMs
      const timer = window.setTimeout(() => {
        setRevealed(true)
        setEntranceReady(true)
      }, delay)
      return () => window.clearTimeout(timer)
    }

    setRevealed(false)
    setEntranceReady(false)
    setHovered(false)
    const outDelay = reduceMotion ? 0 : FADE_MS
    const timer = window.setTimeout(() => setPresent(false), outDelay)
    return () => window.clearTimeout(timer)
  }, [hydrated, active, reduceMotion, enterDelayMs])

  if (!hydrated || !present) return null

  return createPortal(
    <MotionConfig reducedMotion="never">
      <motion.div
        className="pointer-events-none fixed inset-x-0 bottom-1 z-20 flex justify-center md:bottom-2"
        initial={false}
        animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 10 }}
        transition={{ duration: FADE_MS / 1000, ease: 'easeOut' }}
      >
        <InstantLink
          href="/pro/contact"
          onWheel={forwardWheelToScroll}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          aria-label="Contacter La Dessinerie"
          className={[
            'cart-float cart-float--ready relative flex items-center justify-center',
            dims.shell,
            revealed ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none',
            hovered && canAnimate ? 'cart-float--hover' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <motion.span
            className="relative flex size-full items-center justify-center"
            style={{ transformOrigin: '50% 18%' }}
            whileHover={
              canAnimate ? { y: -10, scale: 1.08, rotate: 4 } : undefined
            }
            whileTap={canAnimate ? { y: 4, scale: 0.9, rotate: -3 } : undefined}
            transition={springSnappy}
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[42%] size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, color-mix(in srgb, var(--terracotta) 42%, transparent) 0%, transparent 70%)',
              }}
              initial={false}
              animate={
                hovered && canAnimate
                  ? { opacity: 0.9, scale: 1.15 }
                  : { opacity: 0, scale: 0.7 }
              }
              transition={springSoft}
            />

            <motion.span
              className="relative block"
              animate={
                hovered && canAnimate
                  ? { rotate: [0, -5, 5, -3, 0] }
                  : { rotate: 0 }
              }
              transition={
                hovered && canAnimate
                  ? {
                      duration: 0.85,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatDelay: 0.35,
                    }
                  : { duration: 0.2 }
              }
            >
              <CaddieIcon
                className={`cart-float__icon block drop-shadow-[0_8px_18px_rgba(43,41,39,0.2)] transition-[filter] duration-300 ${dims.icon}`}
              />
            </motion.span>
          </motion.span>
        </InstantLink>
      </motion.div>
    </MotionConfig>,
    document.body,
  )
}
