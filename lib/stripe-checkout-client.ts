'use client'

import { loadStripe, type Stripe } from '@stripe/stripe-js'

type CheckoutLine = {
  illustrationId: string
  size: string
  price: number
  quantity: number
}

type StartCheckoutInput =
  | CheckoutLine
  | {
      items: CheckoutLine[]
    }

let stripePromise: Promise<Stripe | null> | null = null

export function getStripeBrowser() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) return Promise.resolve(null)
  if (!stripePromise) stripePromise = loadStripe(key)
  return stripePromise
}

export async function startCheckout(input: StartCheckoutInput) {
  const body =
    'items' in input
      ? { items: input.items }
      : {
          illustrationId: input.illustrationId,
          size: input.size,
          price: input.price,
          quantity: input.quantity,
        }

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = (await response.json()) as {
    error?: string
    sessionId?: string
    url?: string
  }

  if (!response.ok || data.error) {
    throw new Error(data.error ?? 'Paiement indisponible pour le moment.')
  }

  if (!data.url) {
    throw new Error('Redirection Stripe impossible.')
  }

  void getStripeBrowser()
  window.location.assign(data.url)
}
