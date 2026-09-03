import 'server-only'

import { del, get, put } from '@vercel/blob'

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const IS_VERCEL = process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV)

function missingBlobConfigError() {
  return new Error(
    'Stockage persistant non configure sur Vercel. Ajoutez un store Vercel Blob au projet pour exposer BLOB_READ_WRITE_TOKEN.',
  )
}

export function shouldUseBlobStorage() {
  return Boolean(BLOB_TOKEN)
}

export function assertPersistentStorageConfigured() {
  if (IS_VERCEL && !BLOB_TOKEN) {
    throw missingBlobConfigError()
  }
}

export async function readPublicJsonBlob<T>(pathname: string): Promise<T | null> {
  if (!BLOB_TOKEN) return null

  const result = await get(pathname, {
    access: 'public',
    token: BLOB_TOKEN,
    useCache: false,
  })
  if (!result || result.statusCode !== 200) return null

  const text = await new Response(result.stream).text()
  return JSON.parse(text) as T
}

export async function writePublicJsonBlob(pathname: string, value: unknown): Promise<void> {
  if (!BLOB_TOKEN) {
    assertPersistentStorageConfigured()
    return
  }

  await put(pathname, `${JSON.stringify(value, null, 2)}\n`, {
    access: 'public',
    token: BLOB_TOKEN,
    contentType: 'application/json; charset=utf-8',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export async function putPublicWebpBlob(pathname: string, body: Buffer): Promise<string> {
  if (!BLOB_TOKEN) {
    assertPersistentStorageConfigured()
    throw missingBlobConfigError()
  }

  const blob = await put(pathname, body, {
    access: 'public',
    token: BLOB_TOKEN,
    contentType: 'image/webp',
    addRandomSuffix: false,
    allowOverwrite: true,
  })

  return blob.url
}

export async function deleteBlobIfPresent(pathnameOrUrl: string): Promise<void> {
  if (!BLOB_TOKEN) return

  try {
    await del(pathnameOrUrl, { token: BLOB_TOKEN })
  } catch {
    /* deja absent */
  }
}
