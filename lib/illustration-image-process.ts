import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { slugify } from '@/lib/illustrations'

const ILLUSTRATIONS_DIR = path.join(process.cwd(), 'public', 'illustrations')

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

/**
 * JPG/PNG → WebP (quality 80).
 * WebP déjà fourni : enregistré tel quel (toujours sous un nom .webp).
 */
export async function processIllustrationUpload(
  file: File,
  titleHint?: string,
): Promise<ProcessedUpload> {
  const bytes = Buffer.from(await file.arrayBuffer())
  const isAlreadyWebp =
    file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp')

  const dominantColor = await extractDominantColor(bytes)
  const output = isAlreadyWebp
    ? bytes
    : await sharp(bytes).webp({ quality: 80 }).toBuffer()

  await fs.mkdir(ILLUSTRATIONS_DIR, { recursive: true })

  const base =
    slugify(titleHint || file.name.replace(/\.[^.]+$/, '')) || 'illustration'
  const fileName = `${base}-${randomUUID().slice(0, 8)}.webp`
  await fs.writeFile(path.join(ILLUSTRATIONS_DIR, fileName), output)

  return {
    publicPath: `/illustrations/${fileName}`,
    fileName,
    dominantColor,
  }
}

export async function deleteIllustrationFile(publicPath: string) {
  if (!publicPath.startsWith('/illustrations/')) return
  const fileName = publicPath.replace('/illustrations/', '')
  if (!fileName || fileName.includes('..') || fileName.includes('/')) return
  if (fileName === 'placeholder.webp') return
  try {
    await fs.unlink(path.join(ILLUSTRATIONS_DIR, fileName))
  } catch {
    /* déjà absent */
  }
}
