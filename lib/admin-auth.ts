import 'server-only'
import { cookies } from 'next/headers'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_MAX_AGE_SEC,
  createAdminSessionToken,
  isValidAdminSessionToken,
  verifyAdminPassword,
} from '@/lib/admin-session'

export {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  isValidAdminSessionToken,
  verifyAdminPassword,
}

export async function isAdminAuthenticated() {
  const jar = await cookies()
  return isValidAdminSessionToken(jar.get(ADMIN_COOKIE_NAME)?.value)
}

export function adminCookieOptions(token: string) {
  const secure =
    process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'

  return {
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'strict' as const,
    secure,
    path: '/',
    maxAge: ADMIN_MAX_AGE_SEC,
  }
}

export function clearAdminCookieOptions() {
  const secure =
    process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'

  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure,
    path: '/',
    maxAge: 0,
  }
}
