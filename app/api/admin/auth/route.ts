import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  createAdminSessionToken,
  verifyAdminPassword,
} from '@/lib/admin-auth'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null
  const password = body?.password?.trim() ?? ''

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD manquant dans .env.local' },
      { status: 500 },
    )
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  const cookie = adminCookieOptions(await createAdminSessionToken())
  response.cookies.set(cookie.name, cookie.value, cookie)
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}
