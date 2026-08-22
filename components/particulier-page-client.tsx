'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FloatingCart, type CartItem } from '@/components/floating-cart'
import { FlyToCart, type FlyPayload } from '@/components/fly-to-cart'
import { formatEuro, formatFromPrice } from '@/lib/illustration-utils'
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
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [bump, setBump] = useState(0)
  const [flights, setFlights] = useState<FlyPayload[]>([])
  const [selected, setSelected] = useState<Illustration | null>(null)
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0)
  const [pendingCartItem, setPendingCartItem] = useState<CartItem | null>(null)
  const flightId = useRef(0)

  const shown = illustrations.filter(
    (item) => filter === 'Tous' || item.subcategory === filter,
  )

  useEffect(() => {
    if (!selected) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setSelected(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected])

  useEffect(() => {
    if (selected) setSelectedSizeIndex(0)
  }, [selected])

  function addToCart(item: Illustration, sizeIndex: number, imageEl: HTMLElement | null) {
    const sizeEntry = item.sizes?.[sizeIndex]
    if (!sizeEntry) return

    const cartItem: CartItem = {
      key: `${item.id}-${sizeEntry.size}`,
      illustrationId: item.id,
      title: item.title,
      size: sizeEntry.size,
      price: sizeEntry.price,
      image_url: item.image_url,
    }

    const cartEl = document.querySelector<HTMLElement>('[data-cart-target]')
    if (!imageEl || !cartEl) {
      setCartItems((current) => [...current, cartItem])
      setBump((value) => value + 1)
      setSelected(null)
      return
    }

    const from = imageEl.getBoundingClientRect()
    const to = cartEl.getBoundingClientRect()
    flightId.current += 1
    const id = flightId.current

    setFlights((current) => [...current, { id, src: item.image_url, from, to }])
    setPendingCartItem(cartItem)
    setSelected(null)
  }

  function handleFlightComplete(id: number) {
    setFlights((current) => current.filter((flight) => flight.id !== id))
    if (pendingCartItem) {
      setCartItems((current) => [...current, pendingCartItem])
      setPendingCartItem(null)
    }
    setBump((value) => value + 1)
  }

  const selectedSize = selected?.sizes?.[selectedSizeIndex]

  return (
    <div className="mx-auto max-w-5xl pb-28">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--sage)]">
            La boutique
          </p>
          <h1 className="display mt-1.5 text-3xl font-semibold md:text-4xl">
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
            shown.map((item) => {
              const imageId = `print-${item.id}`
              const priceLabel = formatFromPrice(item.sizes)
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
                  <button
                    type="button"
                    id={imageId}
                    onClick={() => setSelected(item)}
                    className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-xl text-left transition group-hover:-rotate-1 group-hover:shadow-lg"
                  >
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </button>
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
                      <button
                        type="button"
                        onClick={() => setSelected(item)}
                        className="mt-0.5 cursor-pointer text-xs underline"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                </motion.article>
              )
            })
          )}
        </AnimatePresence>
      </motion.div>

      {selected && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-foreground/25 p-4 backdrop-blur-[2px] md:items-center"
          onClick={() => setSelected(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="grid w-full max-w-3xl overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-2xl md:grid-cols-2"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              id={`modal-${selected.id}`}
              className="relative aspect-[3/4] bg-foreground/5 md:aspect-auto md:min-h-[28rem]"
            >
              <Image
                src={selected.image_url}
                alt={selected.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--sage)]">
                Tirage d&apos;art
              </p>
              <h2 id="product-modal-title" className="display mt-2 text-3xl font-semibold">
                {selected.title}
              </h2>
              {selected.subcategory && (
                <p className="mt-2 text-sm text-foreground/55">{selected.subcategory}</p>
              )}

              {selected.sizes && selected.sizes.length > 0 ? (
                <>
                  <p className="mt-6 text-sm font-medium">Choisir le format</p>
                  <div className="mt-3 space-y-2">
                    {selected.sizes.map((entry, index) => {
                      const active = index === selectedSizeIndex
                      return (
                        <button
                          key={`${entry.size}-${index}`}
                          type="button"
                          onClick={() => setSelectedSizeIndex(index)}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                            active
                              ? 'border-[var(--terracotta)] bg-[var(--terracotta)]/8'
                              : 'border-foreground/15 hover:border-foreground/30'
                          }`}
                        >
                          <span>{entry.size}</span>
                          <span className="font-semibold">{formatEuro(entry.price)}</span>
                        </button>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    disabled={!selectedSize}
                    onClick={() =>
                      addToCart(
                        selected,
                        selectedSizeIndex,
                        document.getElementById(`modal-${selected.id}`),
                      )
                    }
                    className="mt-auto cursor-pointer rounded-full bg-[var(--terracotta)] px-5 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {selectedSize
                      ? `Ajouter · ${selectedSize.size} · ${formatEuro(selectedSize.price)}`
                      : 'Choisir un format'}
                  </button>
                </>
              ) : (
                <p className="mt-6 text-sm text-foreground/50">
                  Aucun format disponible pour cette illustration.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <FlyToCart flights={flights} onComplete={handleFlightComplete} />
      <FloatingCart
        items={cartItems}
        bump={bump}
        open={cartOpen}
        onOpen={() => setCartOpen(true)}
        onClose={() => setCartOpen(false)}
      />
    </div>
  )
}
