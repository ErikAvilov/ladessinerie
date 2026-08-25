'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useParticulierCart } from '@/components/particulier-cart-provider'
import { formatEuro, illustrationAlt } from '@/lib/illustration-utils'
import { startCheckout } from '@/lib/stripe-checkout-client'
import type { Illustration } from '@/lib/supabase'

type ParticulierArtDetailProps = {
  illustration: Illustration
}

export function ParticulierArtDetail({ illustration }: ParticulierArtDetailProps) {
  const { addToCart } = useParticulierCart()
  const imageRef = useRef<HTMLDivElement>(null)
  const [sizeIndex, setSizeIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const selectedSize = illustration.sizes?.[sizeIndex]

  function handleAddToCart() {
    if (!selectedSize) return
    addToCart(illustration, sizeIndex, quantity, imageRef.current)
  }

  async function handleBuy() {
    if (!selectedSize || checkoutLoading) return
    setCheckoutError(null)
    setCheckoutLoading(true)
    try {
      await startCheckout({
        illustrationId: illustration.id,
        size: selectedSize.size,
        price: selectedSize.price,
        quantity,
      })
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : 'Impossible de démarrer le paiement.',
      )
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col">
      <Link
        href="/particulier/illustrations"
        className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-[10px] text-foreground/60 transition hover:text-foreground md:text-[11px]"
      >
        ← Retour
      </Link>

      <div className="mt-1.5 flex min-h-0 flex-1 overflow-hidden rounded-2xl bg-white/92 shadow-[0_4px_18px_rgba(43,41,39,0.08)] backdrop-blur-[2px]">
        <div className="grid min-h-0 w-full flex-1 grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]">
          {/* Conteneur haut : l’image entière tient dedans (contain = jamais coupée) */}
          <div
            ref={imageRef}
            className="relative min-h-[42dvh] w-full bg-[#f3eee6] md:min-h-0 md:h-full"
          >
            <Image
              src={illustration.image_url}
              alt={illustrationAlt(illustration)}
              fill
              priority
              className="object-contain object-center"
              sizes="(max-width: 768px) 95vw, 60vw"
            />
          </div>

          <div className="flex min-h-0 flex-col justify-center gap-2 border-t border-foreground/5 px-3.5 py-3 md:gap-2.5 md:border-l md:border-t-0 md:px-4 md:py-4 lg:px-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[8px] uppercase tracking-[.18em] text-[var(--sage)]">
                  La Dessinerie
                </p>
                <h1 className="display mt-0.5 text-sm font-semibold leading-snug md:text-base lg:text-lg">
                  {illustration.title}
                </h1>
                {illustration.subcategory ? (
                  <p className="mt-0.5 text-[10px] text-foreground/50">
                    Tirage {illustration.subcategory}
                  </p>
                ) : null}
              </div>
              <div className="shrink-0 text-right">
                {selectedSize ? (
                  <p className="text-sm font-semibold md:text-base">
                    {formatEuro(selectedSize.price)}
                    <span className="ml-0.5 text-[9px] font-normal text-foreground/50">EUR</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-foreground/50">Prix sur demande</p>
                )}
                <p className="text-[9px] text-foreground/45">Taxes incluses.</p>
              </div>
            </div>

            {illustration.sizes && illustration.sizes.length > 0 ? (
              <>
                <div>
                  <p className="text-[10px] font-medium">Format</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {illustration.sizes.map((entry, index) => {
                      const active = index === sizeIndex
                      return (
                        <button
                          key={`${entry.size}-${index}`}
                          type="button"
                          onClick={() => setSizeIndex(index)}
                          className={`cursor-pointer rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${
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

                <div className="flex flex-wrap items-center gap-1.5">
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
                    <span className="min-w-[1.5rem] text-center text-[11px] font-semibold tabular-nums">
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
                    disabled={!selectedSize}
                    onClick={handleAddToCart}
                    className="min-w-0 flex-1 cursor-pointer rounded-full border-2 border-[var(--terracotta)] bg-background px-2.5 py-1.5 text-[10px] font-semibold text-[var(--terracotta)] transition hover:bg-[var(--terracotta)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Ajouter au panier
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!selectedSize || checkoutLoading}
                  onClick={() => void handleBuy()}
                  className="w-full cursor-pointer rounded-full bg-[var(--terracotta)] px-3 py-2 text-[11px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checkoutLoading ? 'Redirection…' : 'Acheter'}
                </button>

                <p className="text-[9px] leading-snug text-foreground/45">
                  Stripe · facture PDF · retrait atelier (gratuit).
                </p>

                {checkoutError ? (
                  <p className="text-[11px] text-[var(--terracotta)]">{checkoutError}</p>
                ) : null}
              </>
            ) : (
              <p className="text-[11px] text-foreground/50">
                Aucun format disponible pour cette illustration.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
