export type ParticulierCategorySlug =
  | 'petit-portraits'
  | 'grand-portraits'
  | 'stickers'
  | 'milklab'

export type ParticulierCategory = {
  slug: ParticulierCategorySlug
  label: string
  /** Couleur de fond après la plongée (extrait du bouton). */
  color: string
  imageSrc: string
  /** Valeur `subcategory` attendue dans Supabase. */
  subcategory: string
}

export const PARTICULIER_CATEGORIES: ParticulierCategory[] = [
  {
    slug: 'petit-portraits',
    label: 'Petit portraits',
    /** Défaut ; la couleur active vient du thème site (admin). */
    color: '#cc633b',
    imageSrc: '/images/bouton-1.svg?v=2',
    subcategory: 'Petit portraits',
  },
  {
    slug: 'grand-portraits',
    label: 'Grand portraits',
    color: '#e5b1b0',
    imageSrc: '/images/bouton-2.svg?v=2',
    subcategory: 'Grand portraits',
  },
  {
    slug: 'stickers',
    label: 'Stickers',
    color: '#f6e896',
    imageSrc: '/images/bouton-3.svg?v=2',
    subcategory: 'Stickers',
  },
  {
    slug: 'milklab',
    label: 'Milklab',
    color: '#c1d6d1',
    imageSrc: '/images/bouton-4.svg?v=2',
    subcategory: 'Milklab',
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
  const target = category.subcategory.trim().toLowerCase()
  return illustrations.filter(
    (item) => item.subcategory?.trim().toLowerCase() === target,
  )
}
