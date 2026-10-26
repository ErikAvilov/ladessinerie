import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  clearAdminCookieOptions,
  createAdminSessionToken,
  verifyAdminPassword,
} from '@/lib/admin-auth'
import {
  assertLoginAllowed,
  clearLoginFailures,
  getClientIp,
  recordLoginFailure,
} from '@/lib/admin-rate-limit'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const limited = assertLoginAllowed(ip)
  if (limited) {
    return NextResponse.json({ error: limited }, { status: 429 })
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Configuration admin incomplète.' },
      { status: 500 },
    )
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null
  const password = typeof body?.password === 'string' ? body.password : ''

  // Délai constant pour freiner le brute-force (même si le mdp est bon, léger).
  const delay = sleep(350)

  const ok = verifyAdminPassword(password)
  await delay

  if (!ok) {
    recordLoginFailure(ip)
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 })
  }

  clearLoginFailures(ip)

  try {
    const response = NextResponse.json({ ok: true })
    const cookie = adminCookieOptions(await createAdminSessionToken())
    response.cookies.set(cookie.name, cookie.value, cookie)
    return response
  } catch (error) {
    console.error('Admin session:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Impossible de créer la session admin.',
      },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE_NAME, '', clearAdminCookieOptions())
  return response
}
