export const ADMIN_COOKIE_NAME = 'ladessinerie_admin'
/** Session courte : 24 h */
export const ADMIN_MAX_AGE_SEC = 60 * 60 * 24

function secret() {
  const value =
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    (process.env.NODE_ENV !== 'production' ? process.env.ADMIN_PASSWORD?.trim() : '') ||
    ''

  if (!value) {
    throw new Error(
      'ADMIN_SESSION_SECRET manquant. Ajoutez un secret fort (openssl rand -hex 32) en prod.',
    )
  }

  if (
    process.env.VERCEL === '1' &&
    !process.env.ADMIN_SESSION_SECRET?.trim()
  ) {
    throw new Error(
      'Sur Vercel, ADMIN_SESSION_SECRET est obligatoire (ne pas réutiliser le mot de passe).',
    )
  }

  return value
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function timingSafeEqualString(a: string, b: string) {
  const encoder = new TextEncoder()
  const aBytes = encoder.encode(a)
  const bBytes = encoder.encode(b)
  const len = Math.max(aBytes.length, bBytes.length, 1)
  let out = aBytes.length === bBytes.length ? 0 : 1
  for (let i = 0; i < len; i += 1) {
    out |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0)
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
  const nonce = crypto.randomUUID()
  const payload = `ok:${Date.now()}:${nonce}`
  return `${payload}.${await sign(payload)}`
}

export async function isValidAdminSessionToken(token: string | undefined | null) {
  if (!token) return false
  try {
    const [payload, signature] = token.split('.')
    if (!payload || !signature) return false
    const expected = await sign(payload)
    if (!timingSafeEqualString(signature, expected)) return false
    const parts = payload.split(':')
    if (parts[0] !== 'ok') return false
    const ts = Number(parts[1])
    if (!Number.isFinite(ts)) return false
    return Date.now() - ts < ADMIN_MAX_AGE_SEC * 1000
  } catch {
    return false
  }
}
