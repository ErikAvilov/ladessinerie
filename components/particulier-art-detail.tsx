'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useParticulierCart } from '@/components/particulier-cart-provider'
import { formatEuro, illustrationAlt } from '@/lib/illustration-utils'
import type { Illustration } from '@/lib/supabase'

type ParticulierArtDetailProps = {
  illustration: Illustration
}

export function ParticulierArtDetail({ illustration }: ParticulierArtDetailProps) {
  const { addToCart } = useParticulierCart()
  const imageRef = useRef<HTMLDivElement>(null)
  const [sizeIndex, setSizeIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const selectedSize = illustration.sizes?.[sizeIndex]

  function handleAddToCart() {
    if (!selectedSize) return
    addToCart(illustration, sizeIndex, quantity, imageRef.current)
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col md:h-auto md:pb-28">
      <Link
        href="/particulier"
        className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-xs text-foreground/60 transition hover:text-foreground md:text-sm"
      >
        ← Retour à la boutique
      </Link>

      <div className="mt-2 flex min-h-0 flex-1 flex-col gap-3 md:mt-6 md:grid md:grid-cols-2 md:gap-14 lg:gap-16">
        <div
          ref={imageRef}
          className="relative mx-auto h-[min(40dvh,20rem)] aspect-[3/4] shrink-0 overflow-hidden rounded-xl bg-foreground/5 paper-shadow md:mx-0 md:aspect-[3/4] md:h-auto md:w-full md:max-w-none md:rounded-2xl"
        >
          <Image
            src={illustration.image_url}
            alt={illustrationAlt(illustration)}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 55vw, 50vw"
          />
        </div>

        <div className="flex shrink-0 flex-col md:py-4">
          <div className="flex items-start justify-between gap-3 md:block">
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[var(--sage)] md:text-[10px]">
                La Dessinerie
              </p>
              <h1 className="display mt-0.5 text-xl font-semibold leading-tight md:mt-2 md:text-4xl lg:text-5xl">
                {illustration.title}
              </h1>
            </div>
            <div className="shrink-0 text-right md:mt-4 md:text-left">
              {selectedSize ? (
                <p className="text-lg font-semibold md:text-2xl">
                  {formatEuro(selectedSize.price)}
                  <span className="ml-1 text-xs font-normal text-foreground/50 md:text-sm">
                    EUR
                  </span>
                </p>
              ) : (
                <p className="text-sm text-foreground/50">Prix sur demande</p>
              )}
              <p className="mt-0.5 text-[10px] text-foreground/45 md:text-xs">Taxes incluses.</p>
            </div>
          </div>

          {illustration.sizes && illustration.sizes.length > 0 ? (
            <>
              <div className="mt-3 md:mt-8">
                <p className="text-xs font-medium md:text-sm">Format</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5 md:mt-3 md:gap-2">
                  {illustration.sizes.map((entry, index) => {
                    const active = index === sizeIndex
                    return (
                      <button
                        key={`${entry.size}-${index}`}
                        type="button"
                        onClick={() => setSizeIndex(index)}
                        className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition md:px-5 md:py-2.5 md:text-sm ${
                          active
                            ? 'border-[var(--forest)] bg-[var(--forest)] text-white'
                            : 'border-foreground/20 bg-transparent hover:border-foreground/40'
                        }`}
                      >
                        {entry.size}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2.5 md:mt-8 md:flex-col md:items-start md:gap-0">
                <div className="md:contents">
                  <p className="mb-0 hidden text-sm font-medium md:mb-0 md:mt-0 md:block">
                    Quantité
                  </p>
                  <div className="inline-flex items-center rounded-full border border-foreground/15 md:mt-3">
                    <button
                      type="button"
                      aria-label="Diminuer la quantité"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      className="flex size-9 cursor-pointer items-center justify-center rounded-l-full transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40 md:size-11"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums md:min-w-[2.5rem]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Augmenter la quantité"
                      onClick={() => setQuantity((value) => value + 1)}
                      className="flex size-9 cursor-pointer items-center justify-center rounded-r-full transition hover:bg-foreground/5 md:size-11"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!selectedSize}
                  onClick={handleAddToCart}
                  className="min-w-0 flex-1 cursor-pointer rounded-full border-2 border-[var(--terracotta)] bg-background px-4 py-2.5 text-sm font-semibold text-[var(--terracotta)] transition hover:bg-[var(--terracotta)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 md:mt-10 md:w-full md:max-w-md md:flex-none md:px-6 md:py-4 md:text-base"
                >
                  Ajouter au panier
                </button>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-foreground/50 md:mt-8">
              Aucun format disponible pour cette illustration.
            </p>
          )}

          {illustration.subcategory && (
            <p className="mt-2 hidden text-sm text-foreground/55 md:mt-8 md:block">
              Tirage {illustration.subcategory}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
