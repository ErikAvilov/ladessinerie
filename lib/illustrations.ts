import { cache } from 'react'
import { promises as fs } from 'fs'
import path from 'path'

export type IllustrationSize = {
  size: string
  price: number
}

export type Illustration = {
  id: string
  title: string
  slug: string
  /** Chemin public, ex. `/illustrations/nom.webp` */
  image: string
  /** Couleur dominante HEX extraite à l’upload */
  dominantColor: string
  category: 'particulier' | 'pro'
  subcategory?: string
  alt_text?: string
  sizes: IllustrationSize[]
  created_at: string
}

const DATA_PATH = path.join(process.cwd(), 'data', 'illustrations.json')

export function slugify(value: string): string {
  return (
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'illustration'
  )
}

export function uniqueSlug(
  base: string,
  existing: Illustration[],
  excludeId?: string,
): string {
  const root = slugify(base)
  let candidate = root
  let n = 2
  while (existing.some((item) => item.slug === candidate && item.id !== excludeId)) {
    candidate = `${root}-${n}`
    n += 1
  }
  return candidate
}

export function illustrationPrice(illustration: Illustration): number | null {
  if (!illustration.sizes?.length) return null
  return Math.min(...illustration.sizes.map((entry) => entry.price))
}

async function readAll(): Promise<Illustration[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Illustration[]
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Lecture data/illustrations.json:', error)
    return []
  }
}

export async function writeIllustrations(illustrations: Illustration[]): Promise<void> {
  await fs.writeFile(DATA_PATH, `${JSON.stringify(illustrations, null, 2)}\n`, 'utf8')
}

export const getIllustrations = cache(async function getIllustrations(
  category?: 'particulier' | 'pro',
): Promise<Illustration[]> {
  const all = await readAll()
  const sorted = [...all].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  if (!category) return sorted
  return sorted.filter((item) => item.category === category)
})

export const getIllustrationById = cache(async function getIllustrationById(
  id: string,
): Promise<Illustration | null> {
  const all = await readAll()
  return all.find((item) => item.id === id) ?? null
})

export async function upsertIllustration(illustration: Illustration): Promise<void> {
  const all = await readAll()
  const index = all.findIndex((item) => item.id === illustration.id)
  if (index === -1) all.unshift(illustration)
  else all[index] = illustration
  await writeIllustrations(all)
}

export async function removeIllustration(id: string): Promise<Illustration | null> {
  const all = await readAll()
  const index = all.findIndex((item) => item.id === id)
  if (index === -1) return null
  const [removed] = all.splice(index, 1)
  await writeIllustrations(all)
  return removed
}
