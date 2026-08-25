export type ParticulierCategorySlug =
  | 'illustrations'
  | 'milklab'
  | 'stickers'
  | 'personnalisees'

export type ParticulierCategory = {
  slug: ParticulierCategorySlug
  label: string
  /** Couleur de secours ; la couleur active vient du thème admin. */
  color: string
  imageSrc: string
  /**
   * `all` = toutes les illustrations particulier.
   * sinon filtre exact sur `subcategory` Supabase.
   */
  filter: 'all' | { subcategory: string }
}

export const PARTICULIER_CATEGORIES: ParticulierCategory[] = [
  {
    slug: 'illustrations',
    label: 'Illustrations',
    color: '#cc633b',
    imageSrc: '/images/bouton-1.svg?v=2',
    filter: 'all',
  },
  {
    slug: 'milklab',
    label: 'Milklab',
    color: '#c1d6d1',
    imageSrc: '/images/bouton-4.svg?v=2',
    filter: { subcategory: 'Milklab' },
  },
  {
    slug: 'stickers',
    label: 'Stickers',
    color: '#f6e896',
    imageSrc: '/images/bouton-3.svg?v=2',
    filter: { subcategory: 'Stickers' },
  },
  {
    slug: 'personnalisees',
    label: 'Illustrations personnalisées',
    color: '#e5b1b0',
    imageSrc: '/images/bouton-2.svg?v=2',
    filter: { subcategory: 'Illustrations personnalisées' },
  },
]

export function getParticulierCategory(
  slug: string,
): ParticulierCategory | undefined {
  return PARTICULIER_CATEGORIES.find((entry) => entry.slug === slug)
}

export function isParticulierCategorySlug(
  value: string,
): value is ParticulierCategorySlug {
  return PARTICULIER_CATEGORIES.some((entry) => entry.slug === value)
}

export function particulierCategoryPath(slug: ParticulierCategorySlug) {
  return `/particulier/${slug}`
}

export function filterIllustrationsByCategory<
  T extends { subcategory?: string | null },
>(illustrations: T[], category: ParticulierCategory): T[] {
  if (category.filter === 'all') return illustrations

  const target = category.filter.subcategory.trim().toLowerCase()
  return illustrations.filter(
    (item) => item.subcategory?.trim().toLowerCase() === target,
  )
}
