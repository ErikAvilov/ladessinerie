import { SiteSlider } from '@/components/site-slider'
import { pickHomeScatterIllustrations } from '@/lib/home-scatter-pick'
import { getIllustrations } from '@/lib/supabase'
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

export default async function AboutPage() {
  const [particulier, pro] = await Promise.all([
    getIllustrations('particulier'),
    getIllustrations('pro'),
  ])

  return (
    <SiteSlider
      initialPanel="about"
      initialHome={pickHomeScatterIllustrations(particulier)}
      initialParticulier={particulier}
      initialPro={pro}
    />
  )
}
