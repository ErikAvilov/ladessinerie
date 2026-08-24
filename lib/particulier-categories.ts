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
    color: '#CC633B',
    imageSrc: '/images/bouton-1.svg',
    subcategory: 'Petit portraits',
  },
  {
    slug: 'grand-portraits',
    label: 'Grand portraits',
    color: '#E5B1B0',
    imageSrc: '/images/bouton-2.svg',
    subcategory: 'Grand portraits',
  },
  {
    slug: 'stickers',
    label: 'Stickers',
    color: '#F6E896',
    imageSrc: '/images/bouton-3.svg',
    subcategory: 'Stickers',
  },
  {
    slug: 'milklab',
    label: 'Milklab',
    color: '#C1D6D1',
    imageSrc: '/images/bouton-4.svg',
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
