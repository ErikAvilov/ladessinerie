import { ParticulierArtDetail } from '@/components/particulier-art-detail'
import { getIllustrationById } from '@/lib/illustrations'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

export const revalidate = 60

type ArtPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ArtPageProps): Promise<Metadata> {
  const { id } = await params
  const illustration = await getIllustrationById(id)

  if (!illustration || illustration.category !== 'particulier') {
    return { title: 'Illustration introuvable' }
  }

  const description =
    illustration.alt_text?.trim() ||
    `Tirage d'art — ${illustration.title}. Illustration originale La Dessinerie.`

  return {
    title: illustration.title,
    description,
    openGraph: {
      title: `${illustration.title} — La Dessinerie`,
      description,
      url: `${siteUrl}/particulier/art/${id}`,
      siteName: 'La Dessinerie',
      locale: 'fr_FR',
      type: 'website',
      images: [
        {
          url: illustration.image.startsWith('/')
            ? `${siteUrl}${illustration.image}`
            : illustration.image,
          alt: illustration.alt_text || illustration.title,
        },
      ],
    },
  }
}

export default async function ParticulierArtPage({ params }: ArtPageProps) {
  const { id } = await params
  const illustration = await getIllustrationById(id)

  if (!illustration || illustration.category !== 'particulier') {
    notFound()
  }

  return <ParticulierArtDetail illustration={illustration} />
}
