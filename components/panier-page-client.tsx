'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { InstantLink } from '@/components/instant-link'
import { PanierSkeleton } from '@/components/perf-skeleton'
import { useParticulierCart } from '@/components/particulier-cart-provider'
import { formatEuro } from '@/lib/illustration-utils'
import { particulierArtPath } from '@/lib/particulier-routes'
import {
  getShoppingReturn,
  SHOPPING_RETURN_DEFAULT,
} from '@/lib/shopping-return'
import { startCheckout } from '@/lib/stripe-checkout-client'

export function PanierPageClient() {
  const { items, ready, count, total, setItemQuantity, removeItem, clearCart } =
    useParticulierCart()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [continueHref, setContinueHref] = useState(SHOPPING_RETURN_DEFAULT)

  useEffect(() => {
    setContinueHref(getShoppingReturn())
  }, [])

  async function handleCheckout() {
    if (!items.length || checkoutLoading) return
    setCheckoutError(null)
    setCheckoutLoading(true)
    try {
      await startCheckout({
        items: items.map((item) => ({
          illustrationId: item.illustrationId,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
        })),
      })
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : 'Impossible de démarrer le paiement.',
      )
      setCheckoutLoading(false)
    }
  }

  if (!ready) {
    return <PanierSkeleton />
  }

  return (
    <div className="content-reveal mx-auto flex min-h-full w-full max-w-3xl flex-col pb-10">
      <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--sage)]">
        Boutique
      </p>
      <h1 className="display mt-2 text-3xl font-semibold text-[var(--forest)] md:text-5xl">
        Votre panier
      </h1>
      <p className="mt-2 text-sm text-foreground/55">
        {count === 0
          ? 'Aucun article pour le moment.'
          : `${count} article${count > 1 ? 's' : ''} · retrait à l’atelier / main propre`}
      </p>

      {count === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-foreground/15 px-6 py-16 text-center">
          <p className="text-foreground/55">Votre panier est encore vide.</p>
          <InstantLink
            href="/particulier/illustrations"
            className="mt-6 inline-flex cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
          >
            Voir les illustrations
          </InstantLink>
        </div>
      ) : (
        <>
          <ul className="mt-8 space-y-4">
            {items.map((item) => (
              <li
                key={item.key}
                className="flex gap-4 rounded-2xl border border-foreground/10 bg-background/70 p-3 md:p-4"
              >
                <Link
                  href={particulierArtPath(item.illustrationId)}
                  className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-foreground/5 md:size-24"
                >
                  <Image
                    src={item.image_url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={particulierArtPath(item.illustrationId)}
                        className="block truncate font-semibold hover:underline"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-0.5 text-sm text-foreground/55">
                        Format {item.size} · {formatEuro(item.price)} l’unité
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold md:text-base">
                      {formatEuro(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-foreground/15">
                      <button
                        type="button"
                        aria-label="Diminuer la quantité"
                        onClick={() => setItemQuantity(item.key, item.quantity - 1)}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-l-full transition hover:bg-foreground/5"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Augmenter la quantité"
                        onClick={() => setItemQuantity(item.key, item.quantity + 1)}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-r-full transition hover:bg-foreground/5"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-[var(--terracotta)] transition hover:opacity-80"
                    >
                      <Trash2 size={14} /> Retirer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-foreground/10 pt-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-foreground/55">Total</p>
                <p className="display text-3xl font-semibold">{formatEuro(total)}</p>
                <p className="mt-1 text-xs text-foreground/45">
                  Taxes incluses · livraison : retrait atelier (0 €)
                </p>
              </div>
              <button
                type="button"
                onClick={() => clearCart()}
                className="cursor-pointer text-sm text-foreground/50 underline-offset-2 hover:text-foreground hover:underline"
              >
                Vider le panier
              </button>
            </div>

            <button
              type="button"
              disabled={checkoutLoading}
              onClick={() => void handleCheckout()}
              className="mt-6 w-full cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutLoading ? 'Redirection vers Stripe…' : 'Payer avec Stripe'}
            </button>

            <p className="mt-3 text-center text-xs text-foreground/45">
              Paiement sécurisé · facture PDF envoyée par e-mail
            </p>

            {checkoutError ? (
              <p className="mt-3 text-center text-sm text-[var(--terracotta)]">{checkoutError}</p>
            ) : null}
          </div>
        </>
      )}

      <InstantLink
        href={continueHref}
        className="mt-8 inline-flex cursor-pointer text-sm text-foreground/55 underline-offset-2 hover:text-foreground hover:underline active:scale-[0.98]"
      >
        ← Continuer vos achats
      </InstantLink>
    </div>
  )
}
