'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FloatingCart } from '@/components/floating-cart'
import { FlyToCart, type FlyPayload } from '@/components/fly-to-cart'
import { prints } from '@/lib/artworks'

export default function ParticulierPage() {
  const [filter, setFilter] = useState('Tous')
  const [cart, setCart] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const [bump, setBump] = useState(0)
  const [flights, setFlights] = useState<FlyPayload[]>([])
  const flightId = useRef(0)
  const shown = prints.filter((print) => filter === 'Tous' || print.size === filter)

  function addToCart(src: string, imageEl: HTMLElement | null) {
    const cartEl = document.querySelector<HTMLElement>('[data-cart-target]')
    if (!imageEl || !cartEl) {
      setCart((count) => count + 1)
      setBump((value) => value + 1)
      return
    }

    const from = imageEl.getBoundingClientRect()
    const to = cartEl.getBoundingClientRect()
    flightId.current += 1
    const id = flightId.current

    setFlights((current) => [...current, { id, src, from, to }])
  }

  function handleFlightComplete(id: number) {
    setFlights((current) => current.filter((flight) => flight.id !== id))
    setCart((count) => count + 1)
    setBump((value) => value + 1)
  }

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
        <div className="flex flex-wrap gap-1.5">
          {['Tous', 'Small', 'Medium', 'Large'].map((size) => {
            const active = filter === size
            return (
              <button
                key={size}
                type="button"
                onClick={() => setFilter(size)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-[background-color,border-color,color,transform] duration-150 ease-out ${
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
      </div>
      <motion.div
        layout
        className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((print) => {
            const imageId = `print-${print.title}`
            return (
              <motion.article
                key={print.title}
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
                  onClick={() =>
                    addToCart(print.src, document.getElementById(imageId))
                  }
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-xl text-left transition group-hover:-rotate-1 group-hover:shadow-lg"
                >
                  <Image
                    src={print.src}
                    alt={print.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </button>
                <div className="flex justify-between gap-2 pt-2">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold">{print.title}</h2>
                    <p className="text-xs text-foreground/55">Tirage {print.size}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold">{print.price}</p>
                    <button
                      type="button"
                      onClick={() =>
                        addToCart(print.src, document.getElementById(imageId))
                      }
                      className="mt-0.5 text-xs underline"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </AnimatePresence>
      </motion.div>
      <FlyToCart flights={flights} onComplete={handleFlightComplete} />
      <FloatingCart
        count={cart}
        bump={bump}
        open={cartOpen}
        onOpen={() => setCartOpen(true)}
        onClose={() => setCartOpen(false)}
      />
    </div>
  )
}
