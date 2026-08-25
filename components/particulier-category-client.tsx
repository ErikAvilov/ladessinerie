'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { IllustrationImage } from '@/components/illustration-image'
import { useParticulierCart } from '@/components/particulier-cart-provider'
import { useSiteTheme } from '@/components/site-theme-context'
import { formatEuro, formatFromPrice, illustrationAlt } from '@/lib/illustration-utils'
import type { ParticulierCategory } from '@/lib/particulier-categories'
import { particulierArtPath } from '@/lib/particulier-routes'
import type { Illustration } from '@/lib/supabase'

type ParticulierCategoryClientProps = {
  category: ParticulierCategory
  illustrations: Illustration[]
}

function IllustrationCard({
  item,
  index,
}: {
  item: Illustration
  index: number
}) {
  const { addToCart } = useParticulierCart()
  const imageRef = useRef<HTMLDivElement>(null)
  const sizes = item.sizes ?? []
  const [sizeIndex, setSizeIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const selected = sizes[sizeIndex]
  const href = particulierArtPath(item.id)
  const canAdd = Boolean(selected)

  return (
    <motion.article
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.03, duration: 0.25 }}
      className="flex flex-col rounded-xl bg-white/92 p-2 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:p-2.5"
    >
      <div
        ref={imageRef}
        className="relative aspect-[5/6] w-full overflow-hidden rounded-lg bg-[#f3eee6]"
      >
        <IllustrationImage
          src={item.image_url}
          alt={illustrationAlt(item)}
          fill
          rounded="lg"
          priority={index < 3}
          className="object-contain object-center"
          sizes="(max-width: 640px) 45vw, 22vw"
        />
      </div>

      <div className="mt-1.5 min-w-0 px-0.5">
        <h2 className="truncate text-[11px] font-semibold leading-tight md:text-xs">
          {item.title}
        </h2>
        {selected ? (
          <p className="mt-0.5 text-[10px] font-semibold text-foreground/70 md:text-[11px]">
            {formatEuro(selected.price)}
          </p>
        ) : formatFromPrice(item.sizes) ? (
          <p className="mt-0.5 text-[10px] text-foreground/55">
            {formatFromPrice(item.sizes)}
          </p>
        ) : (
          <p className="mt-0.5 text-[10px] text-foreground/45">Prix sur demande</p>
        )}
      </div>

      {sizes.length > 0 ? (
        <>
          <div className="mt-1.5 flex flex-wrap gap-1 px-0.5">
            {sizes.map((entry, i) => {
              const active = i === sizeIndex
              return (
                <button
                  key={`${entry.size}-${i}`}
                  type="button"
                  onClick={() => setSizeIndex(i)}
                  className={`cursor-pointer rounded-full border px-2 py-0.5 text-[9px] font-medium transition md:text-[10px] ${
                    active
                      ? 'border-[var(--forest)] bg-[var(--forest)] text-white'
                      : 'border-foreground/15 hover:border-foreground/35'
                  }`}
                >
                  {entry.size}
                </button>
              )
            })}
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 px-0.5">
            <div className="inline-flex items-center rounded-full border border-foreground/15">
              <button
                type="button"
                aria-label="Diminuer la quantité"
                disabled={quantity <= 1}
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="flex size-6 cursor-pointer items-center justify-center rounded-l-full transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={10} />
              </button>
              <span className="min-w-[1.15rem] text-center text-[10px] font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Augmenter la quantité"
                onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                className="flex size-6 cursor-pointer items-center justify-center rounded-r-full transition hover:bg-foreground/5"
              >
                <Plus size={10} />
              </button>
            </div>

            <button
              type="button"
              disabled={!canAdd}
              onClick={() => addToCart(item, sizeIndex, quantity, imageRef.current)}
              className="min-w-0 flex-1 cursor-pointer rounded-full bg-[var(--terracotta)] px-2 py-1 text-[10px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ajouter
            </button>
          </div>
        </>
      ) : null}

      <Link
        href={href}
        className="mt-1.5 inline-flex cursor-pointer px-0.5 text-[10px] text-foreground/55 underline-offset-2 transition hover:text-foreground hover:underline"
      >
        Détails
      </Link>
    </motion.article>
  )
}

export function ParticulierCategoryClient({
  category,
  illustrations,
}: ParticulierCategoryClientProps) {
  const theme = useSiteTheme()
  const color = theme.boutonColor(category.slug)

  return (
    <div
      className="mx-auto flex min-h-full w-full max-w-6xl flex-col pb-40 md:pb-52"
      style={{ ['--category-color' as string]: color }}
    >
      {/* En-tête lisible sur le fond texturé */}
      <header className="shrink-0 rounded-xl bg-white/92 px-3 py-2.5 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-4 md:py-3">
        <Link
          href="/particulier"
          className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-foreground/60 transition hover:text-foreground"
        >
          ← Retour à la boutique
        </Link>

        <div className="mt-2 md:mt-2.5">
          <p className="font-mono text-[9px] uppercase tracking-[.2em] text-foreground/45">
            Collection
          </p>
          <h1 className="display mt-1 text-xl font-semibold leading-tight md:text-2xl lg:text-[1.75rem]">
            {category.label}
          </h1>
        </div>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:mt-6 md:gap-x-5 md:gap-y-6 lg:gap-x-6 lg:gap-y-7">
        {illustrations.length === 0 ? (
          <p className="col-span-full rounded-xl bg-white/92 px-4 py-12 text-center text-sm text-foreground/50 shadow-[0_3px_12px_rgba(43,41,39,0.07)]">
            {category.filter === 'all'
              ? 'Aucune illustration pour le moment.'
              : 'Aucune illustration dans cette collection pour le moment.'}
          </p>
        ) : (
          illustrations.map((item, index) => (
            <IllustrationCard key={item.id} item={item} index={index} />
          ))
        )}
      </div>
    </div>
  )
}
