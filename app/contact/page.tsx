import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

export const revalidate = 3600

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
      <form
        className="mt-10 flex flex-col gap-4"
        action="mailto:bonjour@ladessinerie.fr"
        method="post"
        encType="text/plain"
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Votre nom</span>
          <input
            required
            name="nom"
            className="w-full rounded-xl border border-foreground/15 bg-transparent p-4 outline-none focus:border-[var(--terracotta)]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <input
            required
            type="email"
            name="email"
            className="w-full rounded-xl border border-foreground/15 bg-transparent p-4 outline-none focus:border-[var(--terracotta)]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Message</span>
          <textarea
            required
            name="message"
            rows={5}
            className="w-full rounded-xl border border-foreground/15 bg-transparent p-4 outline-none focus:border-[var(--terracotta)]"
          />
        </label>
        <button
          type="submit"
          className="cursor-pointer rounded-full bg-[var(--terracotta)] px-5 py-4 font-semibold text-white"
        >
          Envoyer le message
        </button>
      </form>
    </div>
  )
}
