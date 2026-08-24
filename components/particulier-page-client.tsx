'use client'

import { useCallback, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  DIVE_DURATION_MS,
  ParticulierDiveOverlay,
} from '@/components/particulier-dive-overlay'
import {
  PARTICULIER_CATEGORIES,
  particulierCategoryPath,
  type ParticulierCategory,
} from '@/lib/particulier-categories'

type DiveState = {
  category: ParticulierCategory
  from: { top: number; left: number; width: number; height: number }
}

export function ParticulierPageClient() {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [dive, setDive] = useState<DiveState | null>(null)
  const divingRef = useRef(false)

  const handleSelect = useCallback(
    (category: ParticulierCategory, button: HTMLButtonElement) => {
      if (divingRef.current) return
      divingRef.current = true

      const media = button.querySelector<HTMLElement>('[data-dive-target]')
      const rect = (media ?? button).getBoundingClientRect()
      setDive({
        category,
        from: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
      })

      window.setTimeout(() => {
        startTransition(() => {
          router.push(particulierCategoryPath(category.slug))
        })
      }, Math.round(DIVE_DURATION_MS * 0.88))
    },
    [router],
  )

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col overflow-hidden">
      <div className="shrink-0">
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--sage)]">
          La boutique
        </p>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col md:mt-6">
        <div className="grid shrink-0 grid-cols-4 items-start gap-1.5 sm:gap-3 md:gap-5">
          {PARTICULIER_CATEGORIES.map((category, index) => (
            <motion.button
              key={category.slug}
              type="button"
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={(event) => handleSelect(category, event.currentTarget)}
              className="group relative flex min-w-0 cursor-pointer flex-col items-center gap-1.5 md:gap-2.5"
              aria-label={`Ouvrir ${category.label}`}
            >
              <span
                data-dive-target
                className="relative flex aspect-square w-full max-w-[5.5rem] items-center justify-center sm:max-w-[7rem] md:max-w-[9.5rem]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.imageSrc}
                  alt=""
                  className="h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(43,41,39,0.16)]"
                  draggable={false}
                />
              </span>
              <span className="display relative line-clamp-2 text-center text-[10px] font-semibold leading-tight sm:text-xs md:text-sm">
                {category.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Espace réservé au panier flottant (moitié de l’ancienne taille). */}
        <div className="min-h-0 flex-1" aria-hidden />
        <div className="h-[8.5rem] shrink-0 md:h-[14rem]" aria-hidden />
      </div>

      {dive && (
        <ParticulierDiveOverlay
          category={dive.category}
          from={dive.from}
          onComplete={() => {
            /* navigation déjà lancée */
          }}
        />
      )}
    </div>
  )
}
