import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { promises as fs } from 'fs'
import path from 'path'
import {
  assertPersistentStorageConfigured,
  readPublicJsonBlob,
  shouldUseBlobStorage,
  writePublicJsonBlob,
} from '@/lib/blob-storage'
import { ILLUSTRATIONS_CACHE_TAG } from '@/lib/cache-tags'
import { revalidateIllustrationData } from '@/lib/revalidate-illustrations'

export type IllustrationSize = {
  size: string
  price: number
}

export type Illustration = {
  id: string
  title: string
  slug: string
  /** Chemin public, ex. `/illustrations/fleurs/nom.webp` */
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
const ILLUSTRATIONS_BLOB_PATH = 'site-data/illustrations.json'

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

async function readLocalFile(): Promise<Illustration[]> {
  const raw = await fs.readFile(DATA_PATH, 'utf8')
  const parsed = JSON.parse(raw) as Illustration[]
  return Array.isArray(parsed) ? parsed : []
}

/**
 * Ancien catalogue plat `/illustrations/file.webp` →
 * `/illustrations/<sous-categorie>/file.webp`.
 * Ne touche pas aux URLs Blob https://…
 */
export function withSubcategoryImagePath(item: Illustration): Illustration {
  const { image } = item
  if (!image.startsWith('/illustrations/')) return item
  const relative = image.slice('/illustrations/'.length)
  if (!relative || relative.includes('/')) return item
  const folder = slugify(item.subcategory?.trim() || 'autres') || 'autres'
  return { ...item, image: `/illustrations/${folder}/${relative}` }
}

function migrateIllustrationPaths(items: Illustration[]): Illustration[] {
  return items.map(withSubcategoryImagePath)
}

async function loadIllustrationsFromStore(): Promise<Illustration[]> {
  if (shouldUseBlobStorage()) {
    try {
      const remote = await readPublicJsonBlob<Illustration[]>(ILLUSTRATIONS_BLOB_PATH)
      const local = await readLocalFile().catch(() => [] as Illustration[])
      const remoteEmpty =
        remote === null || (Array.isArray(remote) && remote.length === 0)

      if (remoteEmpty && local.length > 0) {
        // Seed hors du Data Cache (écriture) — le résultat migré part en cache ensuite.
        await writePublicJsonBlob(ILLUSTRATIONS_BLOB_PATH, local)
        return migrateIllustrationPaths(local)
      }

      if (Array.isArray(remote)) return migrateIllustrationPaths(remote)
      return migrateIllustrationPaths(local)
    } catch (error) {
      console.error('Lecture Blob illustrations — fallback local:', error)
      return migrateIllustrationPaths(await readLocalFile().catch(() => []))
    }
  }

  return migrateIllustrationPaths(await readLocalFile())
}

/** Data Cache Vercel / Next — 60s + tag pour invalidation admin. */
const getCachedIllustrationsCatalog = unstable_cache(
  async () => loadIllustrationsFromStore(),
  ['illustrations-catalog'],
  { tags: [ILLUSTRATIONS_CACHE_TAG], revalidate: 60 },
)

/** Déduplique les lectures catalogue au sein d’une même requête RSC. */
const readAll = cache(async (): Promise<Illustration[]> => {
  try {
    return await getCachedIllustrationsCatalog()
  } catch (error) {
    console.error('Lecture catalogue illustrations:', error)
    return []
  }
})

export async function writeIllustrations(illustrations: Illustration[]): Promise<void> {
  const normalized = migrateIllustrationPaths(illustrations)

  if (shouldUseBlobStorage()) {
    await writePublicJsonBlob(ILLUSTRATIONS_BLOB_PATH, normalized)
  } else {
    assertPersistentStorageConfigured()
    await fs.writeFile(DATA_PATH, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8')
  }

  revalidateIllustrationData()
}

export async function getIllustrations(
  category?: 'particulier' | 'pro',
): Promise<Illustration[]> {
  const all = await readAll()
  const sorted = [...all].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  if (!category) return sorted
  return sorted.filter((item) => item.category === category)
}

export async function getIllustrationById(
  id: string,
): Promise<Illustration | null> {
  const all = await readAll()
  return all.find((item) => item.id === id) ?? null
}

export async function upsertIllustration(illustration: Illustration): Promise<void> {
  const all = [...(await readAll())]
  const normalized = withSubcategoryImagePath(illustration)
  const index = all.findIndex((item) => item.id === normalized.id)
  if (index === -1) all.unshift(normalized)
  else all[index] = normalized
  await writeIllustrations(all)
}

export async function removeIllustration(id: string): Promise<Illustration | null> {
  const all = [...(await readAll())]
  const index = all.findIndex((item) => item.id === id)
  if (index === -1) return null
  const [removed] = all.splice(index, 1)
  await writeIllustrations(all)
  return removed
}
