import { SiteSlider } from '@/components/site-slider'
import { pickHomeScatterIllustrations } from '@/lib/home-scatter-pick'
import { getIllustrations } from '@/lib/supabase'
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Fresques murales & illustration sur mesure',
  description:
    'Projets pro pour marques et entreprises : fresque murale, identité visuelle et illustration sur mesure par La Dessinerie.',
  keywords: [
    'fresque murale',
    'illustration sur mesure',
    'branding créatif',
    'identité visuelle',
    'La Dessinerie',
  ],
  openGraph: {
    title: 'Fresques murales & illustration sur mesure — La Dessinerie',
    description:
      'Des projets qui font sourire : fresques murales, branding et illustrations sur mesure pour les pros.',
    url: `${siteUrl}/pro`,
    siteName: 'La Dessinerie',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default async function ProPage() {
  const [particulier, pro] = await Promise.all([
    getIllustrations('particulier'),
    getIllustrations('pro'),
  ])

  return (
    <SiteSlider
      initialPanel="pro"
      initialHome={pickHomeScatterIllustrations(particulier)}
      initialParticulier={particulier}
      initialPro={pro}
    />
  )
}
