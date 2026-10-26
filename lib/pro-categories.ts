export type ProCategorySlug = 'branding' | 'fresque' | 'evenementiel' | 'contact'

export type ProCategory = {
  slug: ProCategorySlug
  label: string
  /** Couleur de secours ; la couleur active vient du thème admin. */
  color: string
  imageSrc: string
  /**
   * `contact` = page contact dédiée.
   * `all` = tous les projets pro.
   * sinon filtre exact sur `subcategory`.
   */
  filter: 'all' | 'contact' | { subcategory: string }
}

export const PRO_CATEGORIES: ProCategory[] = [
  {
    slug: 'branding',
    label: 'Branding',
    color: '#cc633b',
    imageSrc: '/images/bouton-1.svg?v=2',
    filter: { subcategory: 'Branding' },
  },
  {
    slug: 'fresque',
    label: 'Fresque',
    color: '#c1d6d1',
    imageSrc: '/images/bouton-4.svg?v=2',
    filter: { subcategory: 'Fresque' },
  },
  {
    slug: 'evenementiel',
    label: 'Evenementiel',
    color: '#f6e896',
    imageSrc: '/images/bouton-3.svg?v=2',
    filter: { subcategory: 'Evenementiel' },
  },
  {
    slug: 'contact',
    label: 'Contact',
    color: '#e5b1b0',
    imageSrc: '/images/bouton-2.svg?v=2',
    filter: 'contact',
  },
]

function normalizeLabel(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
    .toLowerCase()
}

export function getProCategory(slug: string): ProCategory | undefined {
  return PRO_CATEGORIES.find((entry) => entry.slug === slug)
}

export function isProCategorySlug(value: string): value is ProCategorySlug {
  return PRO_CATEGORIES.some((entry) => entry.slug === value)
}

export function proCategoryPath(slug: ProCategorySlug) {
  return `/pro/${slug}`
}

export function filterProIllustrationsByCategory<
  T extends { subcategory?: string | null },
>(illustrations: T[], category: ProCategory): T[] {
  if (category.filter === 'all' || category.filter === 'contact') return illustrations

  const target = normalizeLabel(category.filter.subcategory)
  return illustrations.filter((item) => {
    const sub = item.subcategory
    if (!sub) return false
    return normalizeLabel(sub) === target
  })
}
