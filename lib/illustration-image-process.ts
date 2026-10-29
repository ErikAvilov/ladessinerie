import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import {
  assertPersistentStorageConfigured,
  deleteBlobIfPresent,
  putPublicWebpBlob,
  shouldUseBlobStorage,
} from '@/lib/blob-storage'
import { slugify } from '@/lib/illustrations'

const ILLUSTRATIONS_DIR = path.join(process.cwd(), 'public', 'illustrations')
const ILLUSTRATIONS_BLOB_PREFIX = 'illustrations'

function toHex(channel: number) {
  return Math.max(0, Math.min(255, Math.round(channel)))
    .toString(16)
    .padStart(2, '0')
}

export async function extractDominantColor(buffer: Buffer): Promise<string> {
  const { channels } = await sharp(buffer).stats()
  const r = channels[0]?.mean ?? 200
  const g = channels[1]?.mean ?? 190
  const b = channels[2]?.mean ?? 180
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export type ProcessedUpload = {
  publicPath: string
  fileName: string
  dominantColor: string
}

function subcategoryFolder(subcategory?: string): string {
  const slug = slugify(subcategory?.trim() || 'autres')
  return slug || 'autres'
}

/** Chemin relatif sous /illustrations/ — refuse traversal. */
function relativeIllustrationPath(publicPath: string): string | null {
  if (!publicPath.startsWith('/illustrations/')) return null
  const relative = publicPath.slice('/illustrations/'.length)
  if (
    !relative ||
    relative.includes('..') ||
    path.isAbsolute(relative) ||
    relative.split('/').some((part) => !part || part === '.' || part === '..')
  ) {
    return null
  }
  return relative
}

/**
 * JPG/PNG → WebP (quality 80).
 * WebP déjà fourni : enregistré tel quel (toujours sous un nom .webp).
 * Stocké dans `public/illustrations/<sous-categorie-slug>/`.
 */
export async function processIllustrationUpload(
  file: File,
  titleHint?: string,
  subcategory?: string,
): Promise<ProcessedUpload> {
  const bytes = Buffer.from(await file.arrayBuffer())
  const isAlreadyWebp =
    file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp')

  const dominantColor = await extractDominantColor(bytes)
  const output = isAlreadyWebp
    ? bytes
    : await sharp(bytes).webp({ quality: 80 }).toBuffer()
  const base =
    slugify(titleHint || file.name.replace(/\.[^.]+$/, '')) || 'illustration'
  const fileName = `${base}-${randomUUID().slice(0, 8)}.webp`
  const folder = subcategoryFolder(subcategory)
  const relativePath = `${folder}/${fileName}`

  if (shouldUseBlobStorage()) {
    const url = await putPublicWebpBlob(
      `${ILLUSTRATIONS_BLOB_PREFIX}/${relativePath}`,
      output,
    )
    return {
      publicPath: url,
      fileName,
      dominantColor,
    }
  }

  assertPersistentStorageConfigured()
  const destDir = path.join(ILLUSTRATIONS_DIR, folder)
  await fs.mkdir(destDir, { recursive: true })
  await fs.writeFile(path.join(destDir, fileName), output)

  return {
    publicPath: `/illustrations/${relativePath}`,
    fileName,
    dominantColor,
  }
}

export async function deleteIllustrationFile(publicPath: string) {
  if (publicPath.startsWith('http://') || publicPath.startsWith('https://')) {
    await deleteBlobIfPresent(publicPath)
    return
  }

  const relative = relativeIllustrationPath(publicPath)
  if (!relative) return
  if (path.basename(relative) === 'placeholder.webp') return
  try {
    await fs.unlink(path.join(ILLUSTRATIONS_DIR, relative))
  } catch {
    /* déjà absent */
  }
}
