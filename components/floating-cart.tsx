'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { InstantLink } from '@/components/instant-link'
import { PanierIcon } from '@/components/panier-icon'
import { forwardWheelToScroll } from '@/lib/scroll-pass-through'
import { saveShoppingReturn } from '@/lib/shopping-return'

export type FloatingCartSize = 'sm' | 'lg'

type FloatingCartProps = {
  count: number
  bump: number
  size?: FloatingCartSize
}

const CART_SIZE = {
  sm: {
    shell: 'size-[8.25rem] md:size-[13.5rem]',
    icon: 'h-[7.125rem] w-[10rem] md:h-[11.25rem] md:w-[16rem]',
    badge:
      'right-1.5 top-1.5 size-6 text-[10px] md:right-2.5 md:top-2.5 md:size-8 md:text-sm',
  },
  lg: {
    shell: 'size-[12.375rem] md:size-[20.25rem]',
    icon: 'h-[10.6875rem] w-[15rem] md:h-[16.875rem] md:w-[24rem]',
    badge:
      'right-2 top-2 size-8 text-xs md:right-3.5 md:top-3.5 md:size-11 md:text-base',
  },
} as const

export function FloatingCart({ count, bump, size = 'lg' }: FloatingCartProps) {
  const [mounted, setMounted] = useState(false)
  const [entranceReady, setEntranceReady] = useState(false)
  const [bumping, setBumping] = useState(false)
  const reduceMotion = useReducedMotion()
  const dims = CART_SIZE[size]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (reduceMotion) {
      setEntranceReady(true)
      return
    }
    setEntranceReady(false)
    const timer = window.setTimeout(() => setEntranceReady(true), 1150)
    return () => window.clearTimeout(timer)
  }, [mounted, reduceMotion])

  useEffect(() => {
    if (bump <= 0) return
    setBumping(true)
    const timer = window.setTimeout(() => setBumping(false), 520)
    return () => window.clearTimeout(timer)
  }, [bump])

  if (!mounted) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-1 z-20 flex justify-center md:bottom-2">
      <InstantLink
        href="/panier"
        data-cart-target
        onWheel={forwardWheelToScroll}
        onClick={() => saveShoppingReturn(window.location.pathname)}
        aria-label={
          count
            ? `Voir le panier, ${count} article${count > 1 ? 's' : ''}`
            : 'Voir le panier'
        }
        className={[
          'cart-float pointer-events-auto relative flex cursor-pointer items-center justify-center',
          dims.shell,
          entranceReady || reduceMotion ? 'cart-float--ready' : '',
          bumping ? 'cart-float--bump' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <motion.span
          className="relative flex size-full items-center justify-center"
          animate={
            bumping
              ? {
                  rotate: [0, -11, 9, -5, 0],
                  scale: [1, 1.12, 0.94, 1.05, 1],
                }
              : { rotate: 0, scale: 1 }
          }
          transition={
            bumping
              ? { duration: 0.52, ease: [0.34, 1.25, 0.48, 1] }
              : { duration: 0 }
          }
          style={{ transformOrigin: '50% 12%' }}
        >
          {bumping && (
            <motion.span
              key={`bump-${bump}`}
              aria-hidden
              className="pointer-events-none absolute inset-[-14px] rounded-full border-2 border-[var(--terracotta)] md:inset-[-20px] md:border-[3px]"
              initial={{ opacity: 0.85, scale: 0.75 }}
              animate={{ opacity: 0, scale: 1.75 }}
              transition={{ duration: 0.48, ease: 'easeOut' }}
            />
          )}
          <PanierIcon
            className={`block drop-shadow-[0_8px_18px_rgba(43,41,39,0.2)] ${dims.icon}`}
          />
        </motion.span>
        {count > 0 && (
          <motion.span
            key={`count-${count}`}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className={`absolute flex items-center justify-center rounded-full bg-[var(--terracotta)] font-semibold text-white shadow-md ${dims.badge}`}
          >
            {count}
          </motion.span>
        )}
      </InstantLink>
    </div>,
    document.body,
  )
}
