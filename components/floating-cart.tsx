'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Send, ShoppingBag } from 'lucide-react'
import { formatEuro } from '@/lib/illustration-utils'

export type CartItem = {
  key: string
  illustrationId: string
  title: string
  size: string
  price: number
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
  const count = items.length

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const mailBody = items
    .map((item) => `- ${item.title} (${item.size}) : ${formatEuro(item.price)}`)
    .join('%0A')

  return createPortal(
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center md:bottom-8">
        <motion.button
          type="button"
          data-cart-target
          onClick={onOpen}
          aria-label={
            count
              ? `Ouvrir le panier, ${count} article${count > 1 ? 's' : ''}`
              : 'Ouvrir le panier'
          }
          className="pointer-events-auto relative flex size-14 cursor-pointer items-center justify-center rounded-full border border-foreground/10 bg-background text-[var(--ink)] origin-center md:size-16"
          initial={{ rotate: -14, scale: 1 }}
          animate={
            bump > 0
              ? {
                  rotate: [0, -14, 12, -8, 4, 0],
                  scale: [1, 0.78, 1.28, 0.92, 1.08, 1],
                }
              : { rotate: 0, scale: 1 }
          }
          transition={
            bump > 0
              ? { duration: 0.55, ease: [0.2, 0.9, 0.3, 1] }
              : { type: 'spring', stiffness: 36, damping: 5.2, mass: 1.4 }
          }
          whileHover={{ rotate: 3 }}
        >
          {bump > 0 && (
            <motion.span
              key={`bump-${bump}`}
              aria-hidden
              className="pointer-events-none absolute inset-[-10px] rounded-full border-2 border-[var(--terracotta)]"
              initial={{ opacity: 0.7, scale: 0.7 }}
              animate={{ opacity: 0, scale: 1.85 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}
          <ShoppingBag size={26} strokeWidth={1.75} className="md:hidden" />
          <ShoppingBag size={30} strokeWidth={1.75} className="hidden md:block" />
          {count > 0 && (
            <motion.span
              key={`count-${count}`}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-[var(--terracotta)] text-xs font-semibold text-white"
            >
              {count}
            </motion.span>
          )}
        </motion.button>
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
                  <ShoppingBag size={40} strokeWidth={1.5} className="mb-4 text-[var(--sage)]" />
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
                        Format {item.size} · {formatEuro(item.price)}
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
