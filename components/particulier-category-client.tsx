'use client'

import { useMemo, useRef, useState } from 'react'
import { motion } from '@/components/motion'
import { Minus, Plus } from 'lucide-react'
import { IllustrationImage } from '@/components/illustration-image'
import { InstantLink } from '@/components/instant-link'
import { useParticulierCart } from '@/components/particulier-cart-provider'
import { useSiteTheme } from '@/components/site-theme-context'
import { formatEuro, formatFromPrice, illustrationAlt } from '@/lib/illustration-utils'
import type { ParticulierCategory } from '@/lib/particulier-categories'
import { getParticulierCategoryContent } from '@/lib/particulier-content'
import { particulierArtPath } from '@/lib/particulier-routes'
import { usePrefetchOnIntent } from '@/lib/use-prefetch-on-intent'
import type { Illustration } from '@/lib/illustrations'

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
  const { onIntent, cancelIntent } = usePrefetchOnIntent()
  const imageRef = useRef<HTMLDivElement>(null)
  const sizes = item.sizes ?? []
  const [sizeIndex, setSizeIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const selected = sizes[sizeIndex]
  const href = particulierArtPath(item.id)
  const canAdd = Boolean(selected)

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.28, ease: 'easeOut' }}
      className="flex flex-col p-1 md:p-1.5"
    >
      <div className="mx-auto flex w-full flex-col">
      <InstantLink
        href={href}
        onPointerEnter={() => onIntent(href)}
        onFocus={() => onIntent(href)}
        onPointerLeave={cancelIntent}
        className="block w-full"
      >
        <div
          ref={imageRef}
          className="relative w-full overflow-hidden rounded-lg bg-transparent [&>div]:!mx-0 [&>div]:!w-full [&>div]:!max-w-full"
        >
          <IllustrationImage
            src={item.image}
            alt={illustrationAlt(item)}
            shimmer={false}
            dominantColor="transparent"
            width={800}
            height={1000}
            rounded="lg"
            priority={index < 3}
            className="!h-auto !w-full"
            sizes="(max-width: 640px) 45vw, 22vw"
          />
        </div>
      </InstantLink>

      <div className="mt-1.5 flex w-full min-w-0 flex-col gap-1.5 rounded-xl bg-white px-2 py-2 shadow-[0_2px_10px_rgba(43,41,39,0.06)] md:px-2.5 md:py-2.5">
        <div className="min-w-0">
          <h2 className="max-w-full truncate text-[11px] font-semibold leading-tight md:text-xs">
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
            <div className="flex flex-wrap gap-1">
              {sizes.map((entry, i) => {
                const active = i === sizeIndex
                return (
                  <button
                    key={`${entry.size}-${i}`}
                    type="button"
                    onClick={() => setSizeIndex(i)}
                    className={`w-fit cursor-pointer rounded-md border px-2 py-0.5 text-[9px] font-medium transition md:text-[10px] ${
                      active
                        ? 'border-[var(--forest)] bg-[var(--forest)] text-white'
                        : 'border-foreground/15 bg-transparent hover:border-foreground/30'
                    }`}
                  >
                    {entry.size}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-1.5">
              <div className="inline-flex w-fit items-center rounded-md border border-foreground/15">
                <button
                  type="button"
                  aria-label="Diminuer la quantité"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex size-6 cursor-pointer items-center justify-center rounded-l-md transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
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
                  className="flex size-6 cursor-pointer items-center justify-center rounded-r-md transition hover:bg-foreground/5"
                >
                  <Plus size={10} />
                </button>
              </div>

              <button
                type="button"
                disabled={!canAdd}
                onClick={() => addToCart(item, sizeIndex, quantity, imageRef.current)}
                className="w-fit cursor-pointer rounded-md bg-[var(--bouton-ajouter-panier)] px-2.5 py-1 text-[10px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Ajouter
              </button>
            </div>
          </>
        ) : null}
      </div>
      </div>
    </motion.article>
  )
}

export function ParticulierCategoryClient({
  category,
  illustrations,
}: ParticulierCategoryClientProps) {
  const theme = useSiteTheme()
  const color = theme.boutonColor(category.slug)
  const content = getParticulierCategoryContent(category.slug)
  const showSubcategoryFilter = category.filter === 'all'
  const subcategoryFilters = useMemo(() => {
    if (!showSubcategoryFilter) return [] as string[]
    const subs = [
      ...new Set(
        illustrations
          .map((item) => item.subcategory?.trim())
          .filter((value): value is string => Boolean(value)),
      ),
    ].sort((a, b) => a.localeCompare(b, 'fr'))
    return ['Tous', ...subs]
  }, [illustrations, showSubcategoryFilter])
  const [subcategoryFilter, setSubcategoryFilter] = useState('Tous')
  const shownIllustrations = useMemo(() => {
    if (!showSubcategoryFilter || subcategoryFilter === 'Tous') return illustrations
    return illustrations.filter((item) => item.subcategory === subcategoryFilter)
  }, [illustrations, showSubcategoryFilter, subcategoryFilter])

  if (content) {
    return (
      <div
        className="content-reveal mx-auto flex min-h-full w-full max-w-6xl flex-col"
        style={{ ['--category-color' as string]: color }}
      >
        <InstantLink
          href="/particulier"
          className="display mb-3 inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-xl bg-white/92 px-3.5 py-2 text-sm font-semibold leading-none text-foreground/70 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] transition hover:text-foreground active:scale-[0.98] md:mb-4 md:px-4 md:py-2.5 md:text-base"
        >
          ← Retour à la boutique
        </InstantLink>

        <header className="shrink-0 rounded-xl bg-white/92 px-4 py-4 text-center shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-6 md:py-5">
          <h1
            className="display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
            style={{ color: color }}
          >
            {category.label}
          </h1>
          <p className="display mt-2 text-base font-semibold leading-snug text-foreground/75 md:mt-3 md:text-xl lg:text-2xl">
            {content.headline}
          </p>
        </header>

        <section className="mt-5 space-y-5 md:mt-6 md:space-y-6">
          <div className="rounded-xl bg-white/92 px-4 py-4 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-6 md:py-5">
            <p className="text-base leading-relaxed text-foreground/70 md:text-lg md:leading-8">
              {content.intro}
            </p>
          </div>

          <div className="rounded-xl bg-white/92 px-4 py-4 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-6 md:py-5">
            <h2 className="display text-xl font-semibold md:text-2xl">
              {content.deliverablesTitle}
            </h2>
            <ul className="mt-3 space-y-2.5 md:mt-4 md:space-y-3">
              {content.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm leading-relaxed text-foreground/70 md:text-base md:leading-7"
                >
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-white/92 px-4 py-4 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-6 md:py-5">
            <h2 className="display text-xl font-semibold md:text-2xl">
              {content.stepsTitle}
            </h2>
            <ol className="mt-3 space-y-3 md:mt-4 md:space-y-3.5">
              {content.steps.map((step) => (
                <li
                  key={step.number}
                  className="flex gap-3 text-sm leading-relaxed text-foreground/70 md:text-base md:leading-7"
                >
                  <span
                    className="display flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white md:size-8 md:text-base"
                    style={{ background: color }}
                  >
                    {step.number}
                  </span>
                  <span className="pt-0.5">{step.text}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mb-8 flex flex-col gap-3 rounded-xl bg-white/92 px-4 py-4 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] sm:flex-row sm:items-center sm:justify-between md:mb-10 md:px-6 md:py-5">
            <div>
              <p className="display text-lg font-semibold md:text-xl" style={{ color }}>
                {content.pricing}
              </p>
              <p className="mt-1 text-sm text-foreground/60 md:text-base">
                {content.delay}
              </p>
            </div>
            <InstantLink
              href={content.ctaHref}
              className="inline-flex cursor-pointer items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
              style={{ background: color }}
            >
              {content.ctaLabel}
            </InstantLink>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div
      className="content-reveal mx-auto flex min-h-full w-full max-w-6xl flex-col pb-40 md:pb-52"
      style={{ ['--category-color' as string]: color }}
    >
      <header className="shrink-0 rounded-xl bg-white/92 px-3 py-2.5 shadow-[0_3px_12px_rgba(43,41,39,0.07)] backdrop-blur-[2px] md:px-4 md:py-3">
        <InstantLink
          href="/particulier"
          className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-foreground/60 transition hover:text-foreground active:scale-[0.98]"
        >
          ← Retour à la boutique
        </InstantLink>

        <div className="mt-2 text-center md:mt-2.5">
          <h1
            className="display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
            style={{ color: color }}
          >
            {category.label}
          </h1>
        </div>
      </header>

      {showSubcategoryFilter && subcategoryFilters.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-1.5 px-0.5 md:mt-5">
          {subcategoryFilters.map((label) => {
            const active = subcategoryFilter === label
            return (
              <button
                key={label}
                type="button"
                onClick={() => setSubcategoryFilter(label)}
                className={`w-fit cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-medium transition md:text-xs ${
                  active
                    ? 'bg-[var(--forest)] text-white'
                    : 'bg-white text-foreground/70 hover:text-foreground'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:mt-6 md:gap-x-5 md:gap-y-6 lg:gap-x-6 lg:gap-y-7">
        {shownIllustrations.length === 0 ? (
          <p className="col-span-full rounded-xl bg-white/92 px-4 py-12 text-center text-sm text-foreground/50 shadow-[0_3px_12px_rgba(43,41,39,0.07)]">
            {category.filter === 'all'
              ? 'Aucune illustration pour le moment.'
              : 'Aucune illustration dans cette collection pour le moment.'}
          </p>
        ) : (
          shownIllustrations.map((item, index) => (
            <IllustrationCard key={item.id} item={item} index={index} />
          ))
        )}
      </div>
    </div>
  )
}
