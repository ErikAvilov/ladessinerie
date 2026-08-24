import type { MetadataRoute } from 'next'
import { PARTICULIER_CATEGORIES } from '@/lib/particulier-categories'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ladessinerie.fr'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/particulier',
    '/pro',
    '/a-propos',
    '/contact',
    ...PARTICULIER_CATEGORIES.map((entry) => `/particulier/${entry.slug}`),
  ] as const

  return routes.map((path) => ({
    url: `${siteUrl}${path === '/' ? '' : path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }))
}
