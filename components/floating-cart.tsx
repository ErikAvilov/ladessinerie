'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Send, ShoppingBag } from 'lucide-react'

type FloatingCartProps = {
  count: number
  open: boolean
  bump: number
  onOpen: () => void
  onClose: () => void
}

export function FloatingCart({ count, open, bump, onOpen, onClose }: FloatingCartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

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
          className="pointer-events-auto relative flex size-14 items-center justify-center rounded-full border border-foreground/10 bg-background text-[var(--ink)] origin-center md:size-16"
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
              <button onClick={onClose} aria-label="Fermer" className="text-2xl">
                ×
              </button>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <ShoppingBag size={40} strokeWidth={1.5} className="mb-4 text-[var(--sage)]" />
              <p className="text-foreground/60">
                {count
                  ? `${count} tirage${count > 1 ? 's' : ''} sélectionné${count > 1 ? 's' : ''}.`
                  : 'Votre panier est encore vide.'}
              </p>
            </div>
            <a
              href="mailto:bonjour@ladessinerie.fr?subject=Commande de tirages"
              className="flex items-center justify-center gap-2 rounded-full bg-[var(--terracotta)] px-5 py-4 font-semibold text-white"
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
