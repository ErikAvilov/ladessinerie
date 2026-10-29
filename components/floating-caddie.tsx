'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from '@/components/motion'
import { InstantLink } from '@/components/instant-link'
import { CaddieIcon } from '@/components/caddie-icon'
import { forwardWheelToScroll } from '@/lib/scroll-pass-through'

export type FloatingCaddieSize = 'sm' | 'lg'

type FloatingCaddieProps = {
  size?: FloatingCaddieSize
  /** Affiché / masqué — entrée après délai, sortie en fondu. */
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
const FADE_S = 0.38
const HUB_DOCK = '[data-caddie-hub-dock]'

export function FloatingCaddie({
  size = 'lg',
  active = true,
  enterDelayMs = 0,
}: FloatingCaddieProps) {
  const [hydrated, setHydrated] = useState(false)
  const [dock, setDock] = useState<HTMLElement | null>(null)
  const [show, setShow] = useState(false)
  const [hovered, setHovered] = useState(false)
  const reduceMotion = useReducedMotion()
  const dims = CADDIE_SIZE[size]

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) {
      setDock(null)
      return
    }

    function resolveDock() {
      setDock(document.querySelector<HTMLElement>(HUB_DOCK))
    }

    resolveDock()
    const timer = window.setInterval(resolveDock, 200)
    return () => window.clearInterval(timer)
  }, [hydrated])

  useEffect(() => {
    if (!hydrated) return
    if (active && !dock) return

    if (!active) {
      setShow(false)
      setHovered(false)
      return
    }

    const delay = reduceMotion ? 0 : enterDelayMs
    const timer = window.setTimeout(() => setShow(true), delay)
    return () => window.clearTimeout(timer)
  }, [hydrated, active, enterDelayMs, reduceMotion, dock])

  if (!hydrated || !dock) return null

  return createPortal(
    <AnimatePresence>
      {show ? (
        <MotionConfig reducedMotion="never">
          <motion.div
            key="floating-caddie"
            className="pointer-events-none flex w-full items-center justify-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: FADE_S, ease: 'easeOut' }}
          >
            <InstantLink
              href="/pro/contact"
              onWheel={forwardWheelToScroll}
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => setHovered(false)}
              aria-label="Contacter La Dessinerie"
              className={[
                'cart-float cart-float--ready pointer-events-auto relative flex cursor-pointer items-center justify-center',
                dims.shell,
                hovered ? 'cart-float--hover' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <motion.span
                className="relative flex size-full items-center justify-center"
                style={{ transformOrigin: '50% 18%' }}
                whileHover={{ y: -10, scale: 1.08, rotate: 4 }}
                whileTap={{ y: 4, scale: 0.9, rotate: -3 }}
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
                    hovered
                      ? { opacity: 0.9, scale: 1.15 }
                      : { opacity: 0, scale: 0.7 }
                  }
                  transition={springSoft}
                />

                <motion.span
                  className="relative block"
                  animate={hovered ? { rotate: [0, -5, 5, -3, 0] } : { rotate: 0 }}
                  transition={
                    hovered
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
        </MotionConfig>
      ) : null}
    </AnimatePresence>,
    dock,
  )
}
