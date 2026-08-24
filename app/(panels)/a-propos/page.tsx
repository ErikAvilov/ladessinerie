import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Anna',
  description:
    'Rencontrez Anna, illustratrice de La Dessinerie : un jardin pas si secret, des fleurs par centaines, et l’envie de garder une trace du moment présent.',
  openGraph: {
    title: 'Anna — La Dessinerie',
    description:
      'Entrer dans son univers, c’est mettre les pieds dans des fleurs par centaines.',
    url: `${siteUrl}/a-propos`,
    siteName: 'La Dessinerie',
    locale: 'fr_FR',
    type: 'website',
  },
}

/** Panel UI is rendered by `(panels)/layout` → PanelsShell → SiteSlider. */
export default function AboutPage() {
  return null
}
