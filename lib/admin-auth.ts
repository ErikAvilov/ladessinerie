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
  return {
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_MAX_AGE_SEC,
  }
}
