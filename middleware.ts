import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE_NAME, isValidAdminSessionToken } from '@/lib/admin-session'

function withAdminHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'no-referrer')
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  const authed = await isValidAdminSessionToken(token)

  if (pathname === '/admin/login') {
    if (authed) {
      const adminUrl = request.nextUrl.clone()
      adminUrl.pathname = '/admin'
      adminUrl.search = ''
      return withAdminHeaders(NextResponse.redirect(adminUrl))
    }
    return withAdminHeaders(NextResponse.next())
  }

  // Auth POST/DELETE : accessibles sans cookie, mais rate-limités dans la route.
  if (pathname === '/api/admin/auth') {
    return withAdminHeaders(NextResponse.next())
  }

  if (authed) {
    return withAdminHeaders(NextResponse.next())
  }

  if (pathname.startsWith('/api/admin')) {
    return withAdminHeaders(
      NextResponse.json({ error: 'Non authentifié.' }, { status: 401 }),
    )
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/admin/login'
  loginUrl.searchParams.set('next', pathname)
  return withAdminHeaders(NextResponse.redirect(loginUrl))
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
}
