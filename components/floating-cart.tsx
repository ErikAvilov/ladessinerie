'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from '@/components/motion'
import { InstantLink } from '@/components/instant-link'
import { PanierIcon } from '@/components/panier-icon'
import { forwardWheelToScroll } from '@/lib/scroll-pass-through'
import { saveShoppingReturn } from '@/lib/shopping-return'

export type FloatingCartSize = 'sm' | 'lg'
export type FloatingCartPlacement = 'fixed' | 'dock'

type FloatingCartProps = {
  count: number
  bump: number
  size?: FloatingCartSize
  /** `dock` = ancré dans `[data-cart-dock]` (fiche illustration). */
  placement?: FloatingCartPlacement
  /** Affiché / masqué — entrée après délai, sortie en fondu. */
  active?: boolean
  /** Délai avant le fondu d’apparition (ex. fin du slide). */
  enterDelayMs?: number
}

const CART_SIZE = {
  sm: {
    shell: 'size-[7.5rem] md:size-[10.5rem]',
    icon: 'h-[6.5rem] w-[9.25rem] md:h-[9rem] md:w-[12.5rem]',
    badge:
      'right-1 top-1 size-5 text-[9px] md:right-2 md:top-2 md:size-7 md:text-xs',
  },
  lg: {
    shell: 'size-[12.375rem] md:size-[20.25rem]',
    icon: 'h-[10.6875rem] w-[15rem] md:h-[16.875rem] md:w-[24rem]',
    badge:
      'right-2 top-2 size-8 text-xs md:right-3.5 md:top-3.5 md:size-11 md:text-base',
  },
} as const

const springSnappy = { type: 'spring' as const, stiffness: 420, damping: 18, mass: 0.7 }
const springSoft = { type: 'spring' as const, stiffness: 280, damping: 22 }
const FADE_S = 0.38

export function FloatingCart({
  count,
  bump,
  size = 'lg',
  placement = 'fixed',
  active = true,
  enterDelayMs = 0,
}: FloatingCartProps) {
  const [hydrated, setHydrated] = useState(false)
  const [dock, setDock] = useState<HTMLElement | null>(null)
  const [show, setShow] = useState(false)
  const [bumping, setBumping] = useState(false)
  const [hovered, setHovered] = useState(false)
  const reduceMotion = useReducedMotion()
  const dims = CART_SIZE[size]
  const docked = placement === 'dock'
  const canAnimate = show && !bumping

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated || !docked) {
      setDock(null)
      return
    }

    function resolveDock() {
      setDock(document.querySelector<HTMLElement>('[data-cart-dock]'))
    }

    resolveDock()
    const timer = window.setInterval(resolveDock, 200)
    return () => window.clearInterval(timer)
  }, [hydrated, docked])

  useEffect(() => {
    if (!hydrated) return
    if (docked && active && !dock) return

    if (!active) {
      setShow(false)
      setHovered(false)
      return
    }

    const delay = reduceMotion ? 0 : enterDelayMs
    const timer = window.setTimeout(() => setShow(true), delay)
    return () => window.clearTimeout(timer)
  }, [hydrated, active, enterDelayMs, reduceMotion, docked, dock])

  useEffect(() => {
    if (bump <= 0) return
    setBumping(true)
    setHovered(false)
    const timer = window.setTimeout(() => setBumping(false), 560)
    return () => window.clearTimeout(timer)
  }, [bump])

  if (!hydrated) return null
  if (docked && !dock) return null

  const cart = (
    <InstantLink
      href="/panier"
      data-cart-target="true"
      onWheel={forwardWheelToScroll}
      onClick={() => saveShoppingReturn(window.location.pathname)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      aria-label={
        count
          ? `Voir le panier, ${count} article${count > 1 ? 's' : ''}`
          : 'Voir le panier'
      }
      className={[
        'cart-float cart-float--ready pointer-events-auto relative flex cursor-pointer items-center justify-center',
        dims.shell,
        bumping ? 'cart-float--bump' : '',
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
          animate={
            bumping
              ? {
                  y: [0, -14, 2, -6, 0],
                  rotate: [0, -12, 10, -5, 0],
                  scale: [1, 1.14, 0.92, 1.06, 1],
                }
              : { y: 0, rotate: 0, scale: 1 }
          }
          transition={
            bumping
              ? { duration: 0.56, ease: [0.34, 1.25, 0.48, 1] }
              : springSnappy
          }
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

          {bumping && (
            <motion.span
              key={`bump-${bump}`}
              aria-hidden
              className="pointer-events-none absolute inset-[-14px] rounded-full border-2 border-[var(--terracotta)] md:inset-[-16px] md:border-[3px]"
              initial={{ opacity: 0.9, scale: 0.7 }}
              animate={{ opacity: 0, scale: 1.85 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}

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
            <PanierIcon
              className={`cart-float__icon block drop-shadow-[0_8px_18px_rgba(43,41,39,0.2)] transition-[filter] duration-300 ${dims.icon}`}
            />
          </motion.span>
        </motion.span>

        {count > 0 && (
          <motion.span
            key={`count-${count}`}
            initial={{ scale: 0.35, y: 8 }}
            animate={
              bumping
                ? { scale: [1, 1.35, 0.92, 1.12, 1], y: 0 }
                : { scale: 1, y: 0 }
            }
            transition={
              bumping
                ? { duration: 0.5, ease: [0.34, 1.3, 0.48, 1] }
                : springSnappy
            }
            className={`absolute flex items-center justify-center rounded-full bg-[var(--terracotta)] font-semibold text-white shadow-md ${dims.badge}`}
          >
            {count}
          </motion.span>
        )}
      </MotionConfig>
    </InstantLink>
  )

  const shell = (
    <AnimatePresence>
      {show ? (
        <MotionConfig reducedMotion="never">
          <motion.div
            key="floating-cart"
            className={
              docked
                ? 'pointer-events-none flex w-full items-center justify-center'
                : 'pointer-events-none fixed inset-x-0 bottom-1 z-20 flex justify-center md:bottom-2'
            }
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: FADE_S, ease: 'easeOut' }}
          >
            {cart}
          </motion.div>
        </MotionConfig>
      ) : null}
    </AnimatePresence>
  )

  if (docked && dock) {
    return createPortal(shell, dock)
  }

  return createPortal(shell, document.body)
}
