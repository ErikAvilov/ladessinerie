import { ParticulierPageClient } from '@/components/particulier-page-client'
import { getIllustrations } from '@/lib/supabase'
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

export const revalidate = 60

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
  twitter: {
    card: 'summary_large_image',
    title: 'Tirages d’art — La Dessinerie',
    description:
      'Illustrations originales et tirages d’art à accrocher partout.',
  },
}

export default async function ParticulierPage() {
  const illustrations = await getIllustrations('particulier')
  return <ParticulierPageClient illustrations={illustrations} />
}
