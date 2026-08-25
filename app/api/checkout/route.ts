import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getIllustrationById } from '@/lib/supabase'

export const runtime = 'nodejs'

type CheckoutLineInput = {
  illustrationId?: string
  size?: string
  quantity?: number
  price?: number
}

type CheckoutBody = {
  /** Panier multi-articles */
  items?: CheckoutLineInput[]
  /** Achat rapide fiche produit */
  illustrationId?: string
  size?: string
  price?: number
  quantity?: number
}

function siteOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (configured) return configured

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  if (host) return `${proto}://${host}`

  return 'http://localhost:3000'
}

function normalizeLines(body: CheckoutBody): CheckoutLineInput[] {
  if (Array.isArray(body.items) && body.items.length > 0) return body.items
  if (body.illustrationId && body.size) {
    return [
      {
        illustrationId: body.illustrationId,
        size: body.size,
        quantity: body.quantity,
        price: body.price,
      },
    ]
  }
  return []
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe n’est pas configuré (STRIPE_SECRET_KEY manquante).' },
      { status: 500 },
    )
  }

  try {
    const body = (await request.json()) as CheckoutBody
    const lines = normalizeLines(body)

    if (lines.length === 0) {
      return NextResponse.json({ error: 'Panier vide.' }, { status: 400 })
    }
    if (lines.length > 30) {
      return NextResponse.json({ error: 'Trop d’articles dans le panier.' }, { status: 400 })
    }

    const lineItems: {
      quantity: number
      price_data: {
        currency: 'eur'
        unit_amount: number
        product_data: {
          name: string
          description: string
          images?: string[]
          metadata: { illustration_id: string; size: string; dimension: string }
        }
      }
    }[] = []

    for (const line of lines) {
      const illustrationId = line.illustrationId?.trim()
      const size = line.size?.trim()
      const quantity = Math.max(1, Math.min(99, Number(line.quantity) || 1))

      if (!illustrationId || !size) {
        return NextResponse.json(
          { error: 'Chaque article doit avoir une illustration et un format.' },
          { status: 400 },
        )
      }

      const illustration = await getIllustrationById(illustrationId)
      if (!illustration || illustration.category !== 'particulier') {
        return NextResponse.json(
          { error: `Illustration introuvable (${illustrationId}).` },
          { status: 404 },
        )
      }

      const sizeEntry = illustration.sizes?.find((entry) => entry.size === size)
      if (!sizeEntry || typeof sizeEntry.price !== 'number' || sizeEntry.price <= 0) {
        return NextResponse.json(
          { error: `Format invalide pour « ${illustration.title} ».` },
          { status: 400 },
        )
      }

      if (
        typeof line.price === 'number' &&
        Number.isFinite(line.price) &&
        Math.abs(line.price - sizeEntry.price) > 0.009
      ) {
        return NextResponse.json(
          { error: 'Un prix a changé. Rechargez le panier et réessayez.' },
          { status: 409 },
        )
      }

      const unitAmount = Math.round(sizeEntry.price * 100)
      if (unitAmount < 50) {
        return NextResponse.json(
          { error: `Montant trop faible pour « ${illustration.title} » (min. 0,50 €).` },
          { status: 400 },
        )
      }

      lineItems.push({
        quantity,
        price_data: {
          currency: 'eur',
          unit_amount: unitAmount,
          product_data: {
            name: `${illustration.title} — Format ${sizeEntry.size}`,
            description: `Tirage d’art · dimension ${sizeEntry.size} · La Dessinerie · Retrait atelier`,
            images: illustration.image_url ? [illustration.image_url] : undefined,
            metadata: {
              illustration_id: illustration.id,
              size: sizeEntry.size,
              dimension: sizeEntry.size,
            },
          },
        },
      })
    }

    const origin = siteOrigin(request)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      billing_address_collection: 'required',
      invoice_creation: { enabled: true },
      customer_creation: 'always',
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'eur' },
            display_name: "Retrait à l'atelier / Main propre",
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 14 },
            },
          },
        },
      ],
      line_items: lineItems,
      metadata: {
        fulfillment: 'pickup',
        item_count: String(lineItems.length),
      },
      success_url: `${origin}/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/panier`,
      locale: 'fr',
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Session Stripe créée sans URL de redirection.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('POST /api/checkout:', error)
    const message =
      error instanceof Error ? error.message : 'Impossible de créer la session de paiement.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
