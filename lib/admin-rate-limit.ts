type Bucket = {
  count: number
  resetAt: number
}

const globalStore = globalThis as typeof globalThis & {
  __adminLoginBuckets?: Map<string, Bucket>
}

function store() {
  if (!globalStore.__adminLoginBuckets) {
    globalStore.__adminLoginBuckets = new Map()
  }
  return globalStore.__adminLoginBuckets
}

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

export function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

/** Retourne null si OK, sinon message d’erreur. */
export function assertLoginAllowed(ip: string): string | null {
  const now = Date.now()
  const buckets = store()
  const current = buckets.get(ip)

  if (!current || now >= current.resetAt) {
    buckets.set(ip, { count: 0, resetAt: now + WINDOW_MS })
    return null
  }

  if (current.count >= MAX_ATTEMPTS) {
    const minutes = Math.max(1, Math.ceil((current.resetAt - now) / 60000))
    return `Trop de tentatives. Réessayez dans ${minutes} min.`
  }

  return null
}

export function recordLoginFailure(ip: string) {
  const now = Date.now()
  const buckets = store()
  const current = buckets.get(ip)

  if (!current || now >= current.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return
  }

  current.count += 1
  buckets.set(ip, current)
}

export function clearLoginFailures(ip: string) {
  store().delete(ip)
}
