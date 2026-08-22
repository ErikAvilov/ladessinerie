import { ProPageClient } from '@/components/pro-page-client'
import { getIllustrations } from '@/lib/supabase'
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

export const revalidate = 60

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
  twitter: {
    card: 'summary_large_image',
    title: 'Fresques murales & illustration sur mesure — La Dessinerie',
    description:
      'Fresques murales, identité visuelle et illustration sur mesure pour marques et entreprises.',
  },
}

export default async function ProPage() {
  const illustrations = await getIllustrations('pro')
  return <ProPageClient illustrations={illustrations} />
}
