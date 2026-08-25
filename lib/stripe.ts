import Stripe from 'stripe'

/** Instance Stripe côté serveur (STRIPE_SECRET_KEY). */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-07-29.dahlia',
  typescript: true,
})
