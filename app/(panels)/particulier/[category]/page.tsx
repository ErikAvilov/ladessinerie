import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ParticulierCategoryClient } from '@/components/particulier-category-client'
import {
  filterIllustrationsByCategory,
  getParticulierCategory,
  isParticulierCategorySlug,
  PARTICULIER_CATEGORIES,
} from '@/lib/particulier-categories'
import { getIllustrations } from '@/lib/supabase'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

export const dynamic = 'force-dynamic'

type CategoryPageProps = {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return PARTICULIER_CATEGORIES.map((entry) => ({ category: entry.slug }))
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params
  const category = getParticulierCategory(slug)
  if (!category) return { title: 'Collection introuvable' }

  return {
    title: category.label,
    description: `Collection ${category.label} — tirages et illustrations La Dessinerie.`,
    openGraph: {
      title: `${category.label} — La Dessinerie`,
      url: `${siteUrl}/particulier/${category.slug}`,
      siteName: 'La Dessinerie',
      locale: 'fr_FR',
      type: 'website',
    },
  }
}

export default async function ParticulierCategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params
  if (!isParticulierCategorySlug(slug)) notFound()

  const category = getParticulierCategory(slug)
  if (!category) notFound()

  const illustrations = filterIllustrationsByCategory(
    await getIllustrations('particulier'),
    category,
  )

  return (
    <ParticulierCategoryClient category={category} illustrations={illustrations} />
  )
}
