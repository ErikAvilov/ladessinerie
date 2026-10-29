'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { motion } from '@/components/motion'
import { BoutonIcon } from '@/components/bouton-icon'
import { useSiteTheme } from '@/components/site-theme-context'
import { useNavigationProgress } from '@/components/navigation-progress'
import { DIVE_DURATION_MS } from '@/lib/dive'
import {
  PRO_CATEGORIES,
  proCategoryPath,
  type ProCategory,
} from '@/lib/pro-categories'
import { usePrefetchOnIntent } from '@/lib/use-prefetch-on-intent'

const ProDiveOverlay = dynamic(
  () => import('@/components/pro-dive-overlay').then((mod) => mod.ProDiveOverlay),
  { ssr: false },
)

type DiveState = {
  category: ProCategory
  color: string
  fondColor: string
  from: { top: number; left: number; width: number; height: number }
}

/** Arc ∩ : extrémités un peu plus bas, centre plus haut (desktop / tablette). */
const ARC_LAYOUT = [
  { y: 22, rotate: -16 },
  { y: 0, rotate: -6 },
  { y: 0, rotate: 6 },
  { y: 22, rotate: 16 },
] as const

const FLAT_LAYOUT = { y: 0, rotate: 0 } as const

export function ProPageClient() {
  const router = useRouter()
  const theme = useSiteTheme()
  const { prefetch, onIntent, cancelIntent } = usePrefetchOnIntent()
  const { start: startNav } = useNavigationProgress()
  const [, startTransition] = useTransition()
  const [dive, setDive] = useState<DiveState | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const divingRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const handleSelect = useCallback(
    (category: ProCategory, button: HTMLButtonElement) => {
      if (divingRef.current) return
      divingRef.current = true

      const href = proCategoryPath(category.slug)
      startNav(href)
      prefetch(href)

      const media = button.querySelector<HTMLElement>('[data-dive-target]')
      const rect = (media ?? button).getBoundingClientRect()
      setDive({
        category,
        color: theme.boutonColor(category.slug),
        fondColor: theme.fondColor(category.slug),
        from: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
      })

      window.setTimeout(() => {
        startTransition(() => {
          router.push(href)
        })
      }, Math.round(DIVE_DURATION_MS * 0.62))
    },
    [prefetch, router, startNav, theme],
  )

  const diving = dive !== null

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col overflow-hidden">
      <div className="mt-2 flex min-h-0 flex-1 flex-col justify-center pb-[12.75rem] md:mt-3 md:pb-[21rem]">
        <div className="relative mx-auto mb-6 grid w-full max-w-[16rem] shrink-0 grid-cols-2 place-items-center gap-x-5 gap-y-5 px-3 sm:mb-8 sm:flex sm:max-w-3xl sm:items-end sm:justify-between sm:gap-3 sm:px-4 md:mb-10 md:max-w-4xl md:gap-5 md:px-6">
          {PRO_CATEGORIES.map((category, index) => {
            const color = theme.boutonColor(category.slug)
            const arc = isMobile ? FLAT_LAYOUT : (ARC_LAYOUT[index] ?? ARC_LAYOUT[0])
            const isDiveTarget = dive?.category.slug === category.slug
            const hideChrome = diving && !isDiveTarget
            const href = proCategoryPath(category.slug)
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
                className="group relative flex w-full max-w-[5.75rem] cursor-pointer flex-col items-center gap-1 sm:min-w-0 sm:max-w-none sm:flex-1 sm:gap-1.5 md:gap-2"
                style={{ transformOrigin: '50% 100%' }}
                aria-label={`Ouvrir ${category.label}`}
                aria-hidden={hideChrome}
                tabIndex={diving ? -1 : undefined}
              >
                <span
                  data-dive-target
                  className={`relative flex aspect-square w-full max-w-[5.75rem] items-center justify-center md:max-w-[8.5rem] ${isDiveTarget ? 'opacity-0' : ''}`}
                >
                  <BoutonIcon
                    src={category.imageSrc}
                    color={color}
                    className="h-full w-full"
                  />
                </span>
                <span
                  className={`display relative line-clamp-2 max-w-[7.5rem] rounded-md bg-white/92 px-1.5 py-0.5 text-center text-[10px] font-semibold leading-tight text-[var(--text-noms-boutons)] shadow-[0_2px_8px_rgba(43,41,39,0.06)] transition-opacity duration-100 md:max-w-[9rem] md:text-xs ${diving ? 'opacity-0' : 'opacity-100'}`}
                >
                  {category.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {dive && (
        <ProDiveOverlay
          category={dive.category}
          color={dive.color}
          fondColor={dive.fondColor}
          from={dive.from}
          onComplete={() => {
            /* navigation déjà lancée */
          }}
        />
      )}
    </div>
  )
}
