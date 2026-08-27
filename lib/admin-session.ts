export const ADMIN_COOKIE_NAME = 'ladessinerie_admin'
export const ADMIN_MAX_AGE_SEC = 60 * 60 * 24 * 7

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'dev-insecure-admin-secret'
  )
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function timingSafeEqualString(a: string, b: string) {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return out === 0
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return toHex(signature)
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return timingSafeEqualString(password, expected)
}

export async function createAdminSessionToken() {
  const payload = `ok:${Date.now()}`
  return `${payload}.${await sign(payload)}`
}

export async function isValidAdminSessionToken(token: string | undefined | null) {
  if (!token) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  const expected = await sign(payload)
  if (!timingSafeEqualString(signature, expected)) return false
  const ts = Number(payload.split(':')[1])
  if (!Number.isFinite(ts)) return false
  return Date.now() - ts < ADMIN_MAX_AGE_SEC * 1000
}
