'use client'

import { useEffect } from 'react'
import { motion, useReducedMotion } from '@/components/motion'
import { Check } from 'lucide-react'

type AdminSuccessBannerProps = {
  message: string
  className?: string
  /** Auto-hide après N ms (0 = rester affiché). */
  autoHideMs?: number
  onHide?: () => void
}

export function AdminSuccessBanner({
  message,
  className = 'mb-6',
  autoHideMs = 4200,
  onHide,
}: AdminSuccessBannerProps) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!autoHideMs || !onHide) return
    const timer = window.setTimeout(onHide, autoHideMs)
    return () => window.clearTimeout(timer)
  }, [autoHideMs, message, onHide])

  return (
    <motion.div
      key={message}
      role="status"
      aria-live="polite"
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -14, scale: 0.94 }
      }
      animate={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={
        reduceMotion
          ? { duration: 0.15 }
          : { type: 'spring', stiffness: 420, damping: 22, mass: 0.85 }
      }
      className={[
        'relative flex items-start gap-3 overflow-hidden rounded-2xl border-2 border-[var(--grass)]',
        'bg-[linear-gradient(135deg,#e8f6e4_0%,#fff9e8_55%,#ffe8d4_100%)]',
        'px-4 py-3.5 shadow-[0_8px_24px_rgba(58,79,60,0.14)]',
        className,
      ].join(' ')}
    >
      <motion.span
        aria-hidden
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--grass)] text-white shadow-sm"
        initial={reduceMotion ? false : { scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 500, damping: 16, delay: 0.08 }
        }
      >
        <Check size={20} strokeWidth={3} />
      </motion.span>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--forest)]/70">
          C’est enregistré !
        </p>
        <p className="display mt-0.5 text-base font-semibold leading-snug text-[var(--forest)] md:text-lg">
          {message}
        </p>
      </div>

      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-white/35"
          initial={{ x: '-120%', opacity: 0 }}
          animate={{ x: '320%', opacity: [0, 0.7, 0] }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.15 }}
        />
      )}
    </motion.div>
  )
}
