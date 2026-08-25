import 'server-only'
import { stripe } from '@/lib/stripe'

export type CheckoutSuccessInfo = {
  email: string | null
  customerName: string | null
  amountTotal: number | null
  currency: string | null
}

export async function getCheckoutSuccessInfo(
  sessionId: string,
): Promise<CheckoutSuccessInfo | null> {
  if (!sessionId.startsWith('cs_')) return null
  if (!process.env.STRIPE_SECRET_KEY) return null

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      // Still show email if present; payment may be processing
    }

    const email =
      session.customer_details?.email ??
      session.customer_email ??
      null

    return {
      email,
      customerName: session.customer_details?.name ?? null,
      amountTotal: session.amount_total,
      currency: session.currency,
    }
  } catch (error) {
    console.error('getCheckoutSuccessInfo:', error)
    return null
  }
}
