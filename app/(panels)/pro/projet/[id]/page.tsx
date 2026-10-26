import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProProjectDetail } from '@/components/pro-project-detail'
import { getIllustrationById } from '@/lib/illustrations'
import { illustrationAlt } from '@/lib/illustration-utils'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

export const dynamic = 'force-dynamic'

type ProjectPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params
  const illustration = await getIllustrationById(id)
  if (!illustration || illustration.category !== 'pro') {
    return { title: 'Projet introuvable' }
  }

  return {
    title: illustration.title,
    description: illustrationAlt(illustration),
    openGraph: {
      title: `${illustration.title} — La Dessinerie`,
      url: `${siteUrl}/pro/projet/${id}`,
      siteName: 'La Dessinerie',
      locale: 'fr_FR',
      type: 'website',
    },
  }
}

export default async function ProProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const illustration = await getIllustrationById(id)
  if (!illustration || illustration.category !== 'pro') notFound()

  return <ProProjectDetail illustration={illustration} />
}
