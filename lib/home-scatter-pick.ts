import type { Illustration } from '@/lib/illustrations'

const HOME_SCATTER_QUOTAS = [
  { subcategory: 'Fleurs', count: 3 },
  { subcategory: 'Canapé', count: 3 },
  { subcategory: 'Autour de la nourriture', count: 2 },
  { subcategory: 'Bâtiment', count: 2 },
] as const

/**
 * Slots desktop opposés (gauche 0–4 / droite 5–9 miroir).
 * Fourvière à gauche, Bellecour à droite en face.
 */
const OPPOSITE_HOME_SLOTS = {
  fourviere: 0,
  bellecour: 5,
} as const

function placeOppositeBatiments(picked: Illustration[]): Illustration[] {
  const next = [...picked]
  const fourviere = next.find((item) => item.slug === 'fourviere')
  const bellecour = next.find((item) => item.slug === 'bellecour')
  if (!fourviere || !bellecour) return next

  const rest = next.filter(
    (item) => item.slug !== 'fourviere' && item.slug !== 'bellecour',
  )
  const ordered: Illustration[] = []
  let restIndex = 0

  for (let i = 0; i < picked.length; i += 1) {
    if (i === OPPOSITE_HOME_SLOTS.fourviere) ordered.push(fourviere)
    else if (i === OPPOSITE_HOME_SLOTS.bellecour) ordered.push(bellecour)
    else ordered.push(rest[restIndex++])
  }

  return ordered
}

/** Sélection fixe du halo home (quotas sous-catégories + complément) — cacheable. */
export function pickHomeScatterIllustrations(illustrations: Illustration[]): Illustration[] {
  const pool = illustrations.filter((item) => item.category === 'particulier')
  const usedIds = new Set<string>()
  const picked: Illustration[] = []

  for (const { subcategory, count } of HOME_SCATTER_QUOTAS) {
    const candidates = pool.filter(
      (item) => item.subcategory === subcategory && !usedIds.has(item.id),
    )
    for (const item of candidates.slice(0, count)) {
      usedIds.add(item.id)
      picked.push(item)
    }
  }

  if (picked.length < 10) {
    const fillers = pool.filter((item) => !usedIds.has(item.id))
    for (const item of fillers.slice(0, 10 - picked.length)) {
      picked.push(item)
    }
  }

  return placeOppositeBatiments(picked.slice(0, 10))
}
