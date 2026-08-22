import { SiteSlider } from '@/components/site-slider'
import { pickHomeScatterIllustrations } from '@/lib/home-scatter-pick'
import { getIllustrations } from '@/lib/supabase'
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tirages d’art & illustrations à accrocher',
  description:
    'Découvrez les tirages d’art de La Dessinerie : illustrations originales en plusieurs formats, parfaits pour décorer votre intérieur avec poésie et couleur.',
  keywords: [
    'tirages d’art',
    'illustration sur mesure',
    'tirage d’art mural',
    'décoration murale',
    'La Dessinerie',
  ],
  openGraph: {
    title: 'Tirages d’art — La Dessinerie',
    description:
      'Illustrations originales et tirages d’art à accrocher partout. Formats Small, Medium et Large.',
    url: `${siteUrl}/particulier`,
    siteName: 'La Dessinerie',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default async function ParticulierPage() {
  const [particulier, pro] = await Promise.all([
    getIllustrations('particulier'),
    getIllustrations('pro'),
  ])

  return (
    <SiteSlider
      initialPanel="particulier"
      initialHome={pickHomeScatterIllustrations(particulier)}
      initialParticulier={particulier}
      initialPro={pro}
    />
  )
}
