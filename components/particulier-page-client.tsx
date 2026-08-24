'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IllustrationImage } from '@/components/illustration-image'
import { formatFromPrice, illustrationAlt } from '@/lib/illustration-utils'
import { particulierArtPath } from '@/lib/particulier-routes'
import type { Illustration } from '@/lib/supabase'

type ParticulierPageClientProps = {
  illustrations: Illustration[]
}

export function ParticulierPageClient({ illustrations }: ParticulierPageClientProps) {
  const filters = useMemo(() => {
    const subs = [
      ...new Set(illustrations.map((item) => item.subcategory).filter(Boolean)),
    ] as string[]
    return ['Tous', ...subs]
  }, [illustrations])

  const [filter, setFilter] = useState('Tous')

  const shown = illustrations.filter(
    (item) => filter === 'Tous' || item.subcategory === filter,
  )

  return (
    <div className="mx-auto max-w-5xl pb-24 md:pb-28">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--sage)]">
            La boutique
          </p>
          <h1 className="display mt-1.5 text-[1.65rem] font-semibold leading-tight md:text-4xl">
            Des images à{' '}
            <em className="text-[var(--terracotta)]">accrocher partout.</em>
          </h1>
        </div>
        {filters.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {filters.map((size) => {
              const active = filter === size
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFilter(size)}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-[background-color,border-color,color,transform] duration-150 ease-out ${
                    active
                      ? 'border-[var(--sage)] bg-[var(--sage)] text-white'
                      : 'border-foreground/15 bg-transparent text-foreground hover:border-foreground/30'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        )}
      </div>
      <motion.div
        layout
        className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.length === 0 ? (
            <p className="col-span-full py-12 text-center text-sm text-foreground/50">
              Aucun tirage disponible pour le moment.
            </p>
          ) : (
            shown.map((item, index) => {
              const priceLabel = formatFromPrice(item.sizes)
              const href = particulierArtPath(item.id)
              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -6 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="group"
                >
                  <Link
                    href={href}
                    className="relative block aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-xl transition group-hover:-rotate-1 group-hover:shadow-lg"
                  >
                    <IllustrationImage
                      src={item.image_url}
                      alt={illustrationAlt(item)}
                      fill
                      rounded="xl"
                      priority={index < 4}
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </Link>
                  <div className="flex justify-between gap-2 pt-2">
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold">{item.title}</h2>
                      {item.subcategory && (
                        <p className="text-xs text-foreground/55">Tirage {item.subcategory}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {priceLabel && (
                        <p className="text-xs font-semibold leading-tight md:text-sm">{priceLabel}</p>
                      )}
                      <Link
                        href={href}
                        className="mt-0.5 inline-block cursor-pointer text-xs underline"
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
