import { NextRequest, NextResponse } from 'next/server'

function getHomeRoute(role: string[], hostname: string): string {
  const isCPanel = hostname.split('.').includes('c-panel')

  if (isCPanel) return '/c-panel'
  if (role.includes('student')) return '/student-profile'
  if (role.includes('casher') && (!role.includes('ceo') || !role.includes('admin'))) return '/finance'

  return '/dashboard'
}

export function middleware(request: NextRequest) {
  const url = new URL(request.url)
  const pathname: string = url.pathname

  if (pathname === '/') {
    const userCookie = request.cookies.get('user')?.value

    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie))
        const hostname = request.headers.get('host') || ''

        if (user?.payment_page) {
          const redirectUrl = new URL('/crm-payments', request.url)
          return NextResponse.redirect(redirectUrl, 302)
        }

        if (user?.role?.length) {
          const redirectPath = getHomeRoute(user.role, hostname)
          const redirectUrl = new URL(redirectPath, request.url)
          return NextResponse.redirect(redirectUrl, 302)
        }
      } catch (error) {
        console.error('Failed to parse user cookie:', error)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - dashboard, student-profile, finance, c-panel, crm-payments (redirect targets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|dashboard|student-profile|finance|c-panel|crm-payments).*)',
  ],
}
