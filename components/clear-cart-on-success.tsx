'use client'

import { useEffect } from 'react'
import { useParticulierCartOptional } from '@/components/particulier-cart-provider'

/** Vide le panier local après un paiement Stripe réussi. */
export function ClearCartOnSuccess({ enabled }: { enabled: boolean }) {
  const cart = useParticulierCartOptional()

  useEffect(() => {
    if (!enabled || !cart?.ready) return
    cart.clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- clear once when session succeeds
  }, [enabled, cart?.ready])

  return null
}
