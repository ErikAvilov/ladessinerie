import Link from 'next/link'
import type { Metadata } from 'next'
import { ClearCartOnSuccess } from '@/components/clear-cart-on-success'
import { getCheckoutSuccessInfo } from '@/lib/stripe-checkout-success'

export const metadata: Metadata = {
  title: 'Merci pour votre commande',
  description:
    'Votre paiement a bien été reçu. La facture et la confirmation vous ont été envoyées par e-mail. Retrait à l’atelier en main propre.',
  robots: { index: false, follow: false },
}

export default async function SuccesPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId } = await searchParams
  const info = sessionId ? await getCheckoutSuccessInfo(sessionId) : null
  const email = info?.email

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center pb-16">
      <ClearCartOnSuccess enabled={Boolean(sessionId)} />

      <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--sage)]">
        Commande confirmée
      </p>
      <h1 className="display mt-3 text-3xl font-semibold leading-tight text-[var(--forest)] md:text-5xl">
        Merci — <em className="text-[var(--terracotta)]">c’est noté.</em>
      </h1>
      <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg md:leading-8">
        Votre paiement a bien été reçu.
        {email ? (
          <>
            {' '}
            La confirmation et la facture PDF ont été envoyées à{' '}
            <strong className="font-semibold text-foreground">{email}</strong>.
          </>
        ) : (
          <> Stripe vous envoie par e-mail la confirmation et la facture PDF.</>
        )}{' '}
        Gardez-les précieusement pour le retrait.
      </p>

      <div className="mt-8 space-y-4 border-t border-foreground/10 pt-8">
        <h2 className="display text-xl font-semibold">Retrait en main propre</h2>
        <ul className="space-y-3 text-sm leading-relaxed text-foreground/65 md:text-base">
          <li>
            Mode choisi :{' '}
            <strong className="font-semibold text-foreground">Retrait à l’atelier</strong>{' '}
            (gratuit).
          </li>
          <li>
            Vous serez contacté·e pour convenir d’un créneau dès que le tirage est prêt.
          </li>
          <li>
            Présentez votre e-mail de confirmation (ou la facture) le jour du retrait.
          </li>
        </ul>
      </div>

      {sessionId ? (
        <p className="mt-6 font-mono text-[10px] text-foreground/35">
          Réf. session · {sessionId.slice(0, 18)}…
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/particulier/illustrations"
          className="cursor-pointer rounded-full bg-[var(--terracotta)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Retour à la boutique
        </Link>
        <Link
          href="/"
          className="cursor-pointer rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium transition hover:border-[var(--forest)] hover:text-[var(--forest)]"
        >
          Accueil
        </Link>
      </div>
    </div>
  )
}
