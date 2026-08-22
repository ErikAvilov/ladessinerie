'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Send } from 'lucide-react'
import { formatEuro } from '@/lib/illustration-utils'

export type CartItem = {
  key: string
  illustrationId: string
  title: string
  size: string
  price: number
  quantity: number
  image_url: string
}

type FloatingCartProps = {
  items: CartItem[]
  open: boolean
  bump: number
  onOpen: () => void
  onClose: () => void
}

export function FloatingCart({ items, open, bump, onOpen, onClose }: FloatingCartProps) {
  const [mounted, setMounted] = useState(false)
  const [entranceReady, setEntranceReady] = useState(false)
  const [bumping, setBumping] = useState(false)
  const reduceMotion = useReducedMotion()
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (reduceMotion) {
      setEntranceReady(true)
      return
    }
    setEntranceReady(false)
    const timer = window.setTimeout(() => setEntranceReady(true), 1150)
    return () => window.clearTimeout(timer)
  }, [mounted, reduceMotion])

  useEffect(() => {
    if (bump <= 0) return
    setBumping(true)
    const timer = window.setTimeout(() => setBumping(false), 560)
    return () => window.clearTimeout(timer)
  }, [bump])

  if (!mounted) return null

  const mailBody = items
    .map((item) => {
      const lineTotal = item.price * item.quantity
      const qtyLabel = item.quantity > 1 ? ` × ${item.quantity}` : ''
      return `- ${item.title} (${item.size}${qtyLabel}) : ${formatEuro(lineTotal)}`
    })
    .join('%0A')

  return createPortal(
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex justify-center md:bottom-7">
        <button
          type="button"
          data-cart-target
          onClick={onOpen}
          aria-label={
            count
              ? `Ouvrir le panier, ${count} article${count > 1 ? 's' : ''}`
              : 'Ouvrir le panier'
          }
          className={[
            'cart-float pointer-events-auto relative flex size-24 cursor-pointer items-center justify-center md:size-28',
            entranceReady || reduceMotion ? 'cart-float--ready' : '',
            bumping ? 'cart-float--bump' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <motion.span
            className="relative flex size-full items-center justify-center"
            animate={
              bumping
                ? {
                    rotate: [0, -14, 12, -8, 4, 0],
                    scale: [1, 0.82, 1.22, 0.94, 1.06, 1],
                  }
                : { rotate: 0, scale: 1 }
            }
            transition={
              bumping
                ? { duration: 0.55, ease: [0.2, 0.9, 0.3, 1] }
                : { duration: 0 }
            }
            style={{ transformOrigin: '50% 12%' }}
          >
            {bumping && (
              <motion.span
                key={`bump-${bump}`}
                aria-hidden
                className="pointer-events-none absolute inset-[-14px] rounded-full border-2 border-[var(--terracotta)]"
                initial={{ opacity: 0.7, scale: 0.7 }}
                animate={{ opacity: 0, scale: 1.85 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            )}
            <Image
              src="/images/panier.png"
              alt=""
              width={691}
              height={800}
              className="h-[4.75rem] w-auto object-contain drop-shadow-[0_8px_18px_rgba(43,41,39,0.2)] md:h-[5.5rem]"
              sizes="96px"
              priority
            />
          </motion.span>
          {count > 0 && (
            <motion.span
              key={`count-${count}`}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="absolute right-0 top-0 flex size-7 items-center justify-center rounded-full bg-[var(--terracotta)] text-xs font-semibold text-white shadow-sm"
            >
              {count}
            </motion.span>
          )}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-30 bg-foreground/20" onClick={onClose}>
          <aside
            onClick={(event) => event.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background p-7 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="display text-3xl">Votre panier</h2>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="cursor-pointer text-2xl"
              >
                ×
              </button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              {count === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Image
                    src="/images/panier.png"
                    alt=""
                    width={691}
                    height={800}
                    className="mb-4 h-20 w-auto object-contain opacity-70"
                    sizes="80px"
                  />
                  <p className="text-foreground/60">Votre panier est encore vide.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.key}
                      className="rounded-xl border border-foreground/10 px-4 py-3"
                    >
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-foreground/60">
                        Format {item.size}
                        {item.quantity > 1 ? ` · Qté ${item.quantity}` : ''} ·{' '}
                        {formatEuro(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <a
              href={
                count
                  ? `mailto:bonjour@ladessinerie.fr?subject=Commande de tirages&body=${mailBody}`
                  : 'mailto:bonjour@ladessinerie.fr?subject=Commande de tirages'
              }
              className="mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--terracotta)] px-5 py-4 font-semibold text-white"
            >
              Faire une demande <Send size={17} />
            </a>
          </aside>
        </div>
      )}
    </>,
    document.body,
  )
}
