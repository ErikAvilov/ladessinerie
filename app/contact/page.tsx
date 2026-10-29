import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactez La Dessinerie pour un projet de fresque murale, une illustration sur mesure ou une commande de tirages d’art.',
  openGraph: {
    title: 'Contact — La Dessinerie',
    description:
      'Parlez-nous de votre projet : fresque murale, illustration sur mesure ou tirages d’art.',
    url: `${siteUrl}/contact`,
    siteName: 'La Dessinerie',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-28 md:px-10">
      <p className="font-mono text-xs uppercase tracking-[.2em] text-[var(--cobalt)]">Contact</p>
      <h1 className="display mt-2 text-4xl font-semibold md:text-5xl">
        On imagine quelque chose <em className="text-[var(--terracotta)]">ensemble ?</em>
      </h1>
      <p className="mt-5 leading-7 text-foreground/65">
        Fresque murale, illustration sur mesure ou commande de tirages d&apos;art — écrivez-nous, même
        si votre idée n&apos;est pas encore très précise.
      </p>
      <ContactForm variant="page" source="contact" />
    </div>
  )
}
