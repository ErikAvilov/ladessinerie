import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProCategoryClient } from '@/components/pro-category-client'
import {
  getProCategory,
  isProCategorySlug,
  PRO_CATEGORIES,
} from '@/lib/pro-categories'
import { getProCategoryContent } from '@/lib/pro-content'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

export const dynamic = 'force-dynamic'

type CategoryPageProps = {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return PRO_CATEGORIES.map((entry) => ({ category: entry.slug }))
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params
  const category = getProCategory(slug)
  if (!category) return { title: 'Collection introuvable' }

  const content = getProCategoryContent(category.slug)
  const description =
    content?.seoDescription ?? `${category.label} — projets pro La Dessinerie.`

  return {
    title: category.label,
    description,
    openGraph: {
      title: content
        ? `${category.label} — ${content.headline}`
        : `${category.label} — La Dessinerie`,
      description,
      url: `${siteUrl}/pro/${category.slug}`,
      siteName: 'La Dessinerie',
      locale: 'fr_FR',
      type: 'website',
    },
  }
}

export default async function ProCategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params
  if (!isProCategorySlug(slug)) notFound()

  const category = getProCategory(slug)
  if (!category) notFound()

  const calendlyUrl = process.env.CALENDLY_URL?.trim() || null

  return (
    <ProCategoryClient category={category} calendlyUrl={calendlyUrl} />
  )
}
