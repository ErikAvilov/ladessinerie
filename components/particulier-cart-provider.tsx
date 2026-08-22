'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { FloatingCart, type CartItem } from '@/components/floating-cart'
import { FlyToCart, type FlyPayload } from '@/components/fly-to-cart'
import type { Illustration } from '@/lib/supabase'

type PendingAdd = {
  item: CartItem
  quantity: number
}

type ParticulierCartContextValue = {
  addToCart: (
    illustration: Pick<Illustration, 'id' | 'title' | 'image_url' | 'sizes'>,
    sizeIndex: number,
    quantity: number,
    imageEl: HTMLElement | null,
  ) => void
}

const ParticulierCartContext = createContext<ParticulierCartContextValue | null>(null)

function mergeCartItem(items: CartItem[], incoming: CartItem, quantity: number): CartItem[] {
  const existing = items.find((entry) => entry.key === incoming.key)
  if (existing) {
    return items.map((entry) =>
      entry.key === incoming.key
        ? { ...entry, quantity: entry.quantity + quantity }
        : entry,
    )
  }
  return [...items, { ...incoming, quantity }]
}

export function ParticulierCartProvider({
  children,
  visible = true,
}: {
  children: ReactNode
  visible?: boolean
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [bump, setBump] = useState(0)
  const [flights, setFlights] = useState<FlyPayload[]>([])
  const flightId = useRef(0)
  const pendingAdds = useRef<Map<number, PendingAdd>>(new Map())

  useEffect(() => {
    if (!visible) setCartOpen(false)
  }, [visible])

  const addToCart = useCallback(
    (
      illustration: Pick<Illustration, 'id' | 'title' | 'image_url' | 'sizes'>,
      sizeIndex: number,
      quantity: number,
      imageEl: HTMLElement | null,
    ) => {
      const sizeEntry = illustration.sizes?.[sizeIndex]
      if (!sizeEntry || quantity < 1) return

      const cartItem: CartItem = {
        key: `${illustration.id}-${sizeEntry.size}`,
        illustrationId: illustration.id,
        title: illustration.title,
        size: sizeEntry.size,
        price: sizeEntry.price,
        quantity,
        image_url: illustration.image_url,
      }

      const cartEl = document.querySelector<HTMLElement>('[data-cart-target]')
      if (!imageEl || !cartEl) {
        setCartItems((current) => mergeCartItem(current, cartItem, quantity))
        setBump((value) => value + 1)
        return
      }

      const from = imageEl.getBoundingClientRect()
      const to = cartEl.getBoundingClientRect()
      flightId.current += 1
      const id = flightId.current

      pendingAdds.current.set(id, { item: cartItem, quantity })
      setFlights((current) => [...current, { id, src: illustration.image_url, from, to }])
    },
    [],
  )

  const handleFlightComplete = useCallback((id: number) => {
    setFlights((current) => current.filter((flight) => flight.id !== id))
    const pending = pendingAdds.current.get(id)
    pendingAdds.current.delete(id)
    if (pending) {
      setCartItems((current) =>
        mergeCartItem(current, pending.item, pending.quantity),
      )
    }
    setBump((value) => value + 1)
  }, [])

  const value = useMemo(() => ({ addToCart }), [addToCart])

  return (
    <ParticulierCartContext.Provider value={value}>
      {children}
      {visible && (
        <>
          <FlyToCart flights={flights} onComplete={handleFlightComplete} />
          <FloatingCart
            items={cartItems}
            bump={bump}
            open={cartOpen}
            onOpen={() => setCartOpen(true)}
            onClose={() => setCartOpen(false)}
          />
        </>
      )}
    </ParticulierCartContext.Provider>
  )
}

export function useParticulierCart() {
  const context = useContext(ParticulierCartContext)
  if (!context) {
    throw new Error('useParticulierCart must be used within ParticulierCartProvider')
  }
  return context
}
