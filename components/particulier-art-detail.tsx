'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Minus, Plus } from 'lucide-react'
import { InstantLink } from '@/components/instant-link'
import { AnimatePresence, motion } from '@/components/motion'
import { useParticulierCart } from '@/components/particulier-cart-provider'
import { formatEuro, illustrationAlt } from '@/lib/illustration-utils'
import { startCheckout } from '@/lib/stripe-checkout-client'
import type { Illustration } from '@/lib/illustrations'

type ParticulierArtDetailProps = {
  illustration: Illustration
}

export function ParticulierArtDetail({ illustration }: ParticulierArtDetailProps) {
  const { addToCart } = useParticulierCart()
  const imageRef = useRef<HTMLDivElement>(null)
  const zoomTitleId = useId()
  const [sizeIndex, setSizeIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [zoomed, setZoomed] = useState(false)
  const [portalReady, setPortalReady] = useState(false)

  const selectedSize = illustration.sizes?.[sizeIndex]
  const alt = illustrationAlt(illustration)

  useEffect(() => {
    setPortalReady(true)
  }, [])

  useEffect(() => {
    if (!zoomed) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomed(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [zoomed])

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
    <div className="content-reveal flex h-full min-h-0 w-full max-w-5xl flex-col self-center">
      <InstantLink
        href="/particulier/illustrations"
        className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-1 self-start rounded-lg bg-white px-2.5 py-1 text-[10px] text-foreground/60 shadow-[0_2px_8px_rgba(43,41,39,0.06)] transition hover:text-foreground active:scale-[0.98] md:text-[11px]"
      >
        ← Retour
      </InstantLink>

      <div className="mt-1.5 flex min-h-0 w-full flex-1 flex-col gap-4 overflow-auto md:flex-row md:items-center md:gap-6 md:overflow-hidden">
        <div
          ref={imageRef}
          className="relative flex min-h-0 w-full flex-1 items-center justify-center md:h-full"
        >
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={`Agrandir ${illustration.title}`}
            className="group cursor-zoom-in rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terracotta)]/50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={illustration.image}
              alt={alt}
              className="max-h-[min(72dvh,36rem)] w-auto max-w-full object-contain drop-shadow-[0_8px_24px_rgba(43,41,39,0.12)] transition duration-300 group-hover:scale-[1.02] group-hover:drop-shadow-[0_12px_28px_rgba(43,41,39,0.16)]"
            />
          </button>
        </div>

        <div className="flex w-full shrink-0 flex-col justify-center gap-2 md:w-[min(100%,20rem)] lg:w-[22rem]">
          <div className="flex flex-col gap-3 rounded-2xl bg-white px-3.5 py-3.5 shadow-[0_4px_18px_rgba(43,41,39,0.08)] md:gap-3.5 md:px-4 md:py-5">
            <div className="flex w-full flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h1 className="display max-w-full truncate text-sm font-semibold leading-snug md:text-base lg:text-lg">
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
                <p className="mt-0.5 text-[9px] text-foreground/45">Taxes incluses.</p>
              </div>
            </div>

            {illustration.sizes && illustration.sizes.length > 0 ? (
              <>
                <div>
                  <p className="mb-1.5 text-[10px] font-medium">Format</p>
                  <div className="flex flex-wrap gap-1">
                    {illustration.sizes.map((entry, index) => {
                      const active = index === sizeIndex
                      return (
                        <button
                          key={`${entry.size}-${index}`}
                          type="button"
                          onClick={() => setSizeIndex(index)}
                          className={`w-fit cursor-pointer rounded-md border px-2.5 py-1 text-[10px] font-medium transition ${
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
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <div className="inline-flex w-fit items-center rounded-md border border-foreground/15">
                    <button
                      type="button"
                      aria-label="Diminuer la quantité"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      className="flex size-7 cursor-pointer items-center justify-center rounded-l-md transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
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
                      className="flex size-7 cursor-pointer items-center justify-center rounded-r-md transition hover:bg-foreground/5"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedSize}
                    onClick={handleAddToCart}
                    className="w-fit cursor-pointer rounded-md border-2 border-[var(--bouton-ajouter-panier)] bg-transparent px-2.5 py-1.5 text-[10px] font-semibold text-[var(--bouton-ajouter-panier)] transition hover:bg-[var(--bouton-ajouter-panier)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Ajouter au panier
                  </button>
                </div>

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

          {illustration.sizes && illustration.sizes.length > 0 ? (
            <button
              type="button"
              disabled={!selectedSize || checkoutLoading}
              onClick={() => void handleBuy()}
              className="w-full cursor-pointer rounded-2xl border-2 border-[var(--bouton-acheter)] bg-white px-3 py-3 text-[11px] font-semibold text-[var(--bouton-acheter)] shadow-[0_4px_18px_rgba(43,41,39,0.08)] transition hover:bg-[var(--bouton-acheter)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checkoutLoading ? 'Redirection…' : 'Acheter'}
            </button>
          ) : null}

          {/* Ancrage du panier flottant : colonne droite, sous le bloc infos. */}
          <div
            data-cart-dock
            className="relative flex min-h-[7.5rem] w-full items-center justify-center md:min-h-[10.5rem]"
          />
        </div>
      </div>

      {portalReady
        ? createPortal(
            <AnimatePresence>
              {zoomed ? (
                <motion.div
                  key="art-zoom"
                  className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <button
                    type="button"
                    aria-label="Fermer le zoom"
                    className="absolute inset-0 cursor-zoom-out bg-foreground/45 backdrop-blur-[3px]"
                    onClick={() => setZoomed(false)}
                  />

                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={zoomTitleId}
                    className="relative z-[1] flex max-h-full max-w-full flex-col items-center"
                    initial={{ opacity: 0, scale: 0.86, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 10 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span id={zoomTitleId} className="sr-only">
                      {illustration.title}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={illustration.image}
                      alt={alt}
                      className="max-h-[min(92dvh,56rem)] w-auto max-w-[min(96vw,56rem)] cursor-zoom-out object-contain drop-shadow-[0_20px_48px_rgba(43,41,39,0.35)]"
                      onClick={() => setZoomed(false)}
                    />
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  )
}
