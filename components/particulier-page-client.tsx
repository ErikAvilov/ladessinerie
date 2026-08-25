'use client'

import { useCallback, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BoutonIcon } from '@/components/bouton-icon'
import {
  DIVE_DURATION_MS,
  ParticulierDiveOverlay,
} from '@/components/particulier-dive-overlay'
import { useSiteTheme } from '@/components/site-theme-context'
import { useNavigationProgress } from '@/components/navigation-progress'
import {
  PARTICULIER_CATEGORIES,
  particulierCategoryPath,
  type ParticulierCategory,
} from '@/lib/particulier-categories'
import { usePrefetchOnIntent } from '@/lib/use-prefetch-on-intent'

type DiveState = {
  category: ParticulierCategory
  color: string
  from: { top: number; left: number; width: number; height: number }
}

/** Arc ∩ : extrémités un peu plus bas, centre plus haut. */
const ARC_LAYOUT = [
  { y: 22, rotate: -16 },
  { y: 0, rotate: -6 },
  { y: 0, rotate: 6 },
  { y: 22, rotate: 16 },
] as const

export function ParticulierPageClient() {
  const router = useRouter()
  const theme = useSiteTheme()
  const { prefetch, onIntent, cancelIntent } = usePrefetchOnIntent()
  const { start: startNav } = useNavigationProgress()
  const [, startTransition] = useTransition()
  const [dive, setDive] = useState<DiveState | null>(null)
  const divingRef = useRef(false)

  const handleSelect = useCallback(
    (category: ParticulierCategory, button: HTMLButtonElement) => {
      if (divingRef.current) return
      divingRef.current = true

      const href = particulierCategoryPath(category.slug)
      startNav(href)
      prefetch(href)

      const media = button.querySelector<HTMLElement>('[data-dive-target]')
      const rect = (media ?? button).getBoundingClientRect()
      setDive({
        category,
        color: theme.boutonColor(category.slug),
        from: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
      })

      // Naviguer plus tôt : le skeleton loading couvre sous le dive.
      window.setTimeout(() => {
        startTransition(() => {
          router.push(href)
        })
      }, Math.round(DIVE_DURATION_MS * 0.55))
    },
    [prefetch, router, startNav, theme],
  )

  const diving = dive !== null

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col overflow-hidden">
      <div
        className={`shrink-0 transition-opacity duration-150 ${diving ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        aria-hidden={diving}
      >
        <p className="inline-block rounded-lg bg-white/92 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.2em] text-[var(--sage)] shadow-[0_2px_8px_rgba(43,41,39,0.06)]">
          La boutique
        </p>
      </div>

      <div className="mt-2 flex min-h-0 flex-1 flex-col justify-center pb-[12.75rem] md:mt-3 md:pb-[21rem]">
        <div className="relative mx-auto mb-6 flex w-full max-w-3xl shrink-0 items-end justify-between gap-1 px-1 sm:mb-8 sm:gap-3 sm:px-4 md:mb-10 md:max-w-4xl md:gap-5 md:px-6">
          {PARTICULIER_CATEGORIES.map((category, index) => {
            const color = theme.boutonColor(category.slug)
            const arc = ARC_LAYOUT[index] ?? ARC_LAYOUT[0]
            const isDiveTarget = dive?.category.slug === category.slug
            const hideChrome = diving && !isDiveTarget
            const href = particulierCategoryPath(category.slug)
            return (
              <motion.button
                key={category.slug}
                type="button"
                initial={false}
                animate={{
                  opacity: hideChrome ? 0 : 1,
                  y: arc.y,
                  rotate: arc.rotate,
                  scale: 1,
                }}
                transition={
                  diving
                    ? { duration: 0.12, ease: 'easeOut' }
                    : { delay: index * 0.05, duration: 0.35, ease: 'easeOut' }
                }
                whileHover={diving ? undefined : { scale: 1.08, y: arc.y - 6 }}
                whileTap={diving ? undefined : { scale: 0.96 }}
                onClick={(event) => handleSelect(category, event.currentTarget)}
                onPointerEnter={() => onIntent(href)}
                onFocus={() => onIntent(href)}
                onPointerLeave={cancelIntent}
                className="group relative flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1 sm:gap-1.5 md:gap-2"
                style={{ transformOrigin: '50% 100%' }}
                aria-label={`Ouvrir ${category.label}`}
                aria-hidden={hideChrome}
                tabIndex={diving ? -1 : undefined}
              >
                <span
                  data-dive-target
                  className={`relative flex aspect-square w-full max-w-[4.75rem] items-center justify-center sm:max-w-[6.25rem] md:max-w-[8.5rem] ${isDiveTarget ? 'opacity-0' : ''}`}
                >
                  <BoutonIcon
                    src={category.imageSrc}
                    color={color}
                    className="h-full w-full drop-shadow-[0_8px_18px_rgba(43,41,39,0.16)]"
                  />
                </span>
                <span
                  className={`display relative line-clamp-2 max-w-[6.5rem] rounded-md bg-white/92 px-1.5 py-0.5 text-center text-[9px] font-semibold leading-tight shadow-[0_2px_8px_rgba(43,41,39,0.06)] transition-opacity duration-100 sm:max-w-[7.5rem] sm:text-[10px] md:max-w-[9rem] md:text-xs ${diving ? 'opacity-0' : 'opacity-100'}`}
                >
                  {category.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {dive && (
        <ParticulierDiveOverlay
          category={dive.category}
          color={dive.color}
          from={dive.from}
          onComplete={() => {
            /* navigation déjà lancée */
          }}
        />
      )}
    </div>
  )
}
