import type { Illustration } from '@/lib/illustrations'

const HOME_SCATTER_QUOTAS = [
  { subcategory: 'Fleurs', count: 4 },
  { subcategory: 'Canapé', count: 4 },
  { subcategory: 'Autour de la nourriture', count: 2 },
] as const

function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

/** Tire un halo home (quotas sous-catégories + complément). */
export function pickHomeScatterIllustrations(illustrations: Illustration[]): Illustration[] {
  const pool = illustrations.filter((item) => item.category === 'particulier')
  const usedIds = new Set<string>()
  const picked: Illustration[] = []

  for (const { subcategory, count } of HOME_SCATTER_QUOTAS) {
    const candidates = shuffle(
      pool.filter(
        (item) => item.subcategory === subcategory && !usedIds.has(item.id),
      ),
    )
    for (const item of candidates.slice(0, count)) {
      usedIds.add(item.id)
      picked.push(item)
    }
  }

  if (picked.length < 10) {
    const fillers = shuffle(pool.filter((item) => !usedIds.has(item.id)))
    for (const item of fillers.slice(0, 10 - picked.length)) {
      picked.push(item)
    }
  }

  return shuffle(picked).slice(0, 10)
}
