'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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

export function FloatingCaddie({ size = 'lg' }: FloatingCaddieProps) {
  const [mounted, setMounted] = useState(false)
  const [entranceReady, setEntranceReady] = useState(false)
  const dims = CADDIE_SIZE[size]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setEntranceReady(true)
      return
    }
    setEntranceReady(false)
    const timer = window.setTimeout(() => setEntranceReady(true), 1150)
    return () => window.clearTimeout(timer)
  }, [mounted])

  if (!mounted) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-1 z-20 flex justify-center md:bottom-2">
      <InstantLink
        href="/pro/contact"
        onWheel={forwardWheelToScroll}
        aria-label="Contacter La Dessinerie"
        className={[
          'cart-float pointer-events-auto relative flex cursor-pointer items-center justify-center',
          dims.shell,
          entranceReady ? 'cart-float--ready' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <CaddieIcon
          className={`block drop-shadow-[0_8px_18px_rgba(43,41,39,0.2)] ${dims.icon}`}
        />
      </InstantLink>
    </div>,
    document.body,
  )
}
