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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.3 }}
      className="flex flex-col rounded-2xl bg-white/90 p-3 shadow-[0_4px_18px_rgba(43,41,39,0.08)] backdrop-blur-[2px] md:p-4"
    >
      <div
        ref={imageRef}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-foreground/5"
      >
        <IllustrationImage
          src={item.image_url}
          alt={illustrationAlt(item)}
          fill
          rounded="xl"
          priority={index < 3}
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="mt-2 min-w-0">
        <h2 className="truncate text-sm font-semibold">{item.title}</h2>
        {selected ? (
          <p className="mt-0.5 text-xs font-semibold text-foreground/70">
            {formatEuro(selected.price)}
          </p>
        ) : formatFromPrice(item.sizes) ? (
          <p className="mt-0.5 text-xs text-foreground/55">{formatFromPrice(item.sizes)}</p>
        ) : (
          <p className="mt-0.5 text-xs text-foreground/45">Prix sur demande</p>
        )}
      </div>

      {sizes.length > 0 ? (
        <>
          <div className="mt-2 flex flex-wrap gap-1">
            {sizes.map((entry, i) => {
              const active = i === sizeIndex
              return (
                <button
                  key={`${entry.size}-${i}`}
                  type="button"
                  onClick={() => setSizeIndex(i)}
                  className={`cursor-pointer rounded-full border px-2.5 py-1 text-[10px] font-medium transition md:text-xs ${
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

          <div className="mt-2 flex items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-foreground/15">
              <button
                type="button"
                aria-label="Diminuer la quantité"
                disabled={quantity <= 1}
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="flex size-7 cursor-pointer items-center justify-center rounded-l-full transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={12} />
              </button>
              <span className="min-w-[1.5rem] text-center text-xs font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Augmenter la quantité"
                onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                className="flex size-7 cursor-pointer items-center justify-center rounded-r-full transition hover:bg-foreground/5"
              >
                <Plus size={12} />
              </button>
            </div>

            <button
              type="button"
              disabled={!canAdd}
              onClick={() => addToCart(item, sizeIndex, quantity, imageRef.current)}
              className="min-w-0 flex-1 cursor-pointer rounded-full bg-[var(--terracotta)] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:text-xs"
            >
              Ajouter
            </button>
          </div>
        </>
      ) : null}

      <Link
        href={href}
        className="mt-2 inline-flex cursor-pointer text-xs text-foreground/55 underline-offset-2 transition hover:text-foreground hover:underline"
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
      className="mx-auto flex min-h-full w-full max-w-5xl flex-col pb-40 md:pb-52"
      style={{ ['--category-color' as string]: color }}
    >
      <Link
        href="/particulier"
        className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-xs text-foreground/60 transition hover:text-foreground md:text-sm"
      >
        ← Retour à la boutique
      </Link>

      <div className="mt-4 md:mt-6">
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-foreground/45">
          Collection
        </p>
        <h1 className="display mt-1.5 text-[1.65rem] font-semibold leading-tight md:text-4xl">
          {category.label}
        </h1>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 md:gap-x-5 md:gap-y-8">
        {illustrations.length === 0 ? (
          <p className="col-span-full py-16 text-center text-sm text-foreground/50">
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
