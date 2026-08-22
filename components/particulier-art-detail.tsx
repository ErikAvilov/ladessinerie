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
    <div className="mx-auto max-w-6xl pb-28">
      <Link
        href="/particulier"
        className="inline-flex cursor-pointer items-center gap-1 text-sm text-foreground/60 transition hover:text-foreground"
      >
        ← Retour à la boutique
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-14 lg:gap-16">
        <div
          ref={imageRef}
          className="relative mx-auto aspect-[3/4] w-full max-w-lg overflow-hidden rounded-2xl bg-foreground/5 paper-shadow md:max-w-none"
        >
          <Image
            src={illustration.image_url}
            alt={illustrationAlt(illustration)}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col md:py-4">
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--sage)]">
            La Dessinerie
          </p>
          <h1 className="display mt-2 text-3xl font-semibold md:text-4xl lg:text-5xl">
            {illustration.title}
          </h1>

          {selectedSize ? (
            <p className="mt-4 text-xl font-semibold md:text-2xl">
              {formatEuro(selectedSize.price)}
              <span className="ml-1 text-sm font-normal text-foreground/50">EUR</span>
            </p>
          ) : (
            <p className="mt-4 text-sm text-foreground/50">Prix sur demande</p>
          )}
          <p className="mt-1 text-xs text-foreground/45">Taxes incluses.</p>

          {illustration.sizes && illustration.sizes.length > 0 ? (
            <>
              <div className="mt-8">
                <p className="text-sm font-medium">Format</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {illustration.sizes.map((entry, index) => {
                    const active = index === sizeIndex
                    return (
                      <button
                        key={`${entry.size}-${index}`}
                        type="button"
                        onClick={() => setSizeIndex(index)}
                        className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition ${
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

              <div className="mt-8">
                <p className="text-sm font-medium">Quantité</p>
                <div className="mt-3 inline-flex items-center rounded-full border border-foreground/15">
                  <button
                    type="button"
                    aria-label="Diminuer la quantité"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="flex size-11 cursor-pointer items-center justify-center rounded-l-full transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-[2.5rem] text-center text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Augmenter la quantité"
                    onClick={() => setQuantity((value) => value + 1)}
                    className="flex size-11 cursor-pointer items-center justify-center rounded-r-full transition hover:bg-foreground/5"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={!selectedSize}
                onClick={handleAddToCart}
                className="mt-10 w-full cursor-pointer rounded-full border-2 border-[var(--terracotta)] bg-background px-6 py-4 text-base font-semibold text-[var(--terracotta)] transition hover:bg-[var(--terracotta)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 md:max-w-md"
              >
                Ajouter au panier
              </button>
            </>
          ) : (
            <p className="mt-8 text-sm text-foreground/50">
              Aucun format disponible pour cette illustration.
            </p>
          )}

          {illustration.subcategory && (
            <p className="mt-8 text-sm text-foreground/55">
              Tirage {illustration.subcategory}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
