import 'server-only'

import { del, get, put } from '@vercel/blob'

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const BLOB_STORE_ID = process.env.BLOB_STORE_ID
const IS_VERCEL = process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV)

function missingBlobConfigError() {
  return new Error(
    'Stockage persistant non configure sur Vercel. Ajoutez un store Vercel Blob au projet (Storage → Blob, access public) pour exposer BLOB_READ_WRITE_TOKEN / BLOB_STORE_ID, puis redeployez.',
  )
}

/** Token RW explicite, ou store connecté via OIDC sur Vercel. */
export function shouldUseBlobStorage() {
  return Boolean(BLOB_TOKEN || BLOB_STORE_ID)
}

export function assertPersistentStorageConfigured() {
  if (IS_VERCEL && !shouldUseBlobStorage()) {
    throw missingBlobConfigError()
  }
}

/** Ne passe `token` que s’il est défini : sinon le SDK utilise OIDC (BLOB_STORE_ID). */
function blobAuth(): { token?: string } {
  return BLOB_TOKEN ? { token: BLOB_TOKEN } : {}
}

export async function readPublicJsonBlob<T>(pathname: string): Promise<T | null> {
  if (!shouldUseBlobStorage()) return null

  const result = await get(pathname, {
    access: 'public',
    useCache: false,
    ...blobAuth(),
  })
  if (!result || result.statusCode !== 200) return null

  const text = await new Response(result.stream).text()
  return JSON.parse(text) as T
}

export async function writePublicJsonBlob(pathname: string, value: unknown): Promise<void> {
  if (!shouldUseBlobStorage()) {
    assertPersistentStorageConfigured()
    throw missingBlobConfigError()
  }

  await put(pathname, `${JSON.stringify(value, null, 2)}\n`, {
    access: 'public',
    contentType: 'application/json; charset=utf-8',
    addRandomSuffix: false,
    allowOverwrite: true,
    ...blobAuth(),
  })
}

export async function putPublicWebpBlob(pathname: string, body: Buffer): Promise<string> {
  if (!shouldUseBlobStorage()) {
    assertPersistentStorageConfigured()
    throw missingBlobConfigError()
  }

  const blob = await put(pathname, body, {
    access: 'public',
    contentType: 'image/webp',
    addRandomSuffix: false,
    allowOverwrite: true,
    ...blobAuth(),
  })

  return blob.url
}

export async function deleteBlobIfPresent(pathnameOrUrl: string): Promise<void> {
  if (!shouldUseBlobStorage()) return

  try {
    await del(pathnameOrUrl, { ...blobAuth() })
  } catch {
    /* deja absent */
  }
}
