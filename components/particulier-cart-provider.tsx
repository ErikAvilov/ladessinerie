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
import { FloatingCart, type FloatingCartSize } from '@/components/floating-cart'
import { FlyToCart, type FlyPayload } from '@/components/fly-to-cart'
import {
  cartCount,
  cartItemKey,
  cartTotal,
  mergeCartItem,
  readCartFromStorage,
  writeCartToStorage,
  type CartItem,
} from '@/lib/cart'
import type { Illustration } from '@/lib/supabase'

type ParticulierCartContextValue = {
  items: CartItem[]
  ready: boolean
  count: number
  total: number
  addToCart: (
    illustration: Pick<Illustration, 'id' | 'title' | 'image_url' | 'sizes'>,
    sizeIndex: number,
    quantity: number,
    imageEl: HTMLElement | null,
  ) => void
  setItemQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clearCart: () => void
}

const ParticulierCartContext = createContext<ParticulierCartContextValue | null>(null)

export function ParticulierCartProvider({
  children,
  visible = true,
  cartSize = 'lg',
}: {
  children: ReactNode
  visible?: boolean
  cartSize?: FloatingCartSize
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)
  const [bump, setBump] = useState(0)
  const [flights, setFlights] = useState<FlyPayload[]>([])
  const flightId = useRef(0)

  useEffect(() => {
    setCartItems(readCartFromStorage())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    writeCartToStorage(cartItems)
  }, [cartItems, ready])

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
        key: cartItemKey(illustration.id, sizeEntry.size),
        illustrationId: illustration.id,
        title: illustration.title,
        size: sizeEntry.size,
        price: sizeEntry.price,
        quantity,
        image_url: illustration.image_url,
      }

      // Optimiste : badge + total tout de suite ; le bump panier arrive avec la météorite.
      setCartItems((current) => mergeCartItem(current, cartItem, quantity))

      const cartEl = document.querySelector<HTMLElement>('[data-cart-target]')
      if (!imageEl || !cartEl) {
        setBump((value) => value + 1)
        return
      }

      const from = imageEl.getBoundingClientRect()
      const to = cartEl.getBoundingClientRect()
      flightId.current += 1
      const id = flightId.current
      setFlights((current) => [...current, { id, src: illustration.image_url, from, to }])
    },
    [],
  )

  const handleFlightComplete = useCallback((id: number) => {
    setFlights((current) => current.filter((flight) => flight.id !== id))
    setBump((value) => value + 1)
  }, [])

  const setItemQuantity = useCallback((key: string, quantity: number) => {
    const next = Math.round(quantity)
    if (next < 1) {
      setCartItems((current) => current.filter((item) => item.key !== key))
      return
    }
    setCartItems((current) =>
      current.map((item) =>
        item.key === key ? { ...item, quantity: Math.min(99, next) } : item,
      ),
    )
  }, [])

  const removeItem = useCallback((key: string) => {
    setCartItems((current) => current.filter((item) => item.key !== key))
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const value = useMemo(
    () => ({
      items: cartItems,
      ready,
      count: cartCount(cartItems),
      total: cartTotal(cartItems),
      addToCart,
      setItemQuantity,
      removeItem,
      clearCart,
    }),
    [cartItems, ready, addToCart, setItemQuantity, removeItem, clearCart],
  )

  return (
    <ParticulierCartContext.Provider value={value}>
      {children}
      {visible && (
        <>
          <FlyToCart flights={flights} onComplete={handleFlightComplete} />
          <FloatingCart
            items={cartItems}
            bump={bump}
            count={cartCount(cartItems)}
            size={cartSize}
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

export function useParticulierCartOptional() {
  return useContext(ParticulierCartContext)
}
