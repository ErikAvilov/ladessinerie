'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MotionConfig, motion } from 'framer-motion'
import { InstantLink } from '@/components/instant-link'
import { CaddieIcon } from '@/components/caddie-icon'
import { forwardWheelToScroll } from '@/lib/scroll-pass-through'

export type FloatingCaddieSize = 'sm' | 'lg'

type FloatingCaddieProps = {
  size?: FloatingCaddieSize
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

export function FloatingCaddie({ size = 'lg' }: FloatingCaddieProps) {
  const [mounted, setMounted] = useState(false)
  const [entranceReady, setEntranceReady] = useState(false)
  const [hovered, setHovered] = useState(false)
  const dims = CADDIE_SIZE[size]
  const canAnimate = entranceReady

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEntranceReady(false)
    const delay = reduce ? 0 : 1150
    if (delay === 0) {
      setEntranceReady(true)
      return
    }
    const timer = window.setTimeout(() => setEntranceReady(true), delay)
    return () => window.clearTimeout(timer)
  }, [mounted])

  if (!mounted) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-1 z-20 flex justify-center md:bottom-2">
      <InstantLink
        href="/pro/contact"
        onWheel={forwardWheelToScroll}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        aria-label="Contacter La Dessinerie"
        className={[
          'cart-float pointer-events-auto relative flex cursor-pointer items-center justify-center',
          dims.shell,
          entranceReady ? 'cart-float--ready' : '',
          hovered && canAnimate ? 'cart-float--hover' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <MotionConfig reducedMotion="never">
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
        </MotionConfig>
      </InstantLink>
    </div>,
    document.body,
  )
}
