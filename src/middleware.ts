import { NextRequest, NextResponse } from 'next/server'

function getHomeRoute(role: string[], hostname: string): string {
  const isCPanel = hostname.split('.').includes('c-panel')

  if (isCPanel) return '/c-panel'
  if (role.includes('student')) return '/student-profile'
  if (role.includes('casher') && (!role.includes('ceo') || !role.includes('admin'))) return '/finance'

  return '/dashboard'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/') {
    const userCookie = request.cookies.get('user')?.value

    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie))
        const hostname = request.headers.get('host') || ''

        if (user?.payment_page) {
          return NextResponse.redirect(new URL('/crm-payments', request.url))
        }

        if (user?.role?.length) {
          const redirectPath = getHomeRoute(user.role, hostname)
          return NextResponse.redirect(new URL(redirectPath, request.url))
        }
      } catch (error) {
        console.error('Failed to parse user cookie:', error)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/'
}
