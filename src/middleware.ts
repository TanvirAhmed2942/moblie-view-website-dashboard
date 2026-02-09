import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// These paths are considered public and don't require authentication
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/verify-email',
  '/auth/reset-password',
  '/unauthorized'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Allow Next.js internals and API routes to pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/site.webmanifest'
  ) {
    return NextResponse.next()
  }

  // 2. Allow static files (images, fonts, etc.)
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot|mp4|webm)$/)) {
    return NextResponse.next()
  }

  // 3. Check for authentication token
  const token = request.cookies.get('MobileViewAdmin')?.value
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))

  // 4. Redirect Logic
  if (!token && !isPublicPath) {
    // If accessing a protected route without token, redirect to login
    const loginUrl = new URL('/auth/login', request.url)
    // Only add callbackUrl if we're not on the root dashboard
    if (pathname !== '/') {
      loginUrl.searchParams.set('callbackUrl', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  if (token && isPublicPath) {
    // If authenticated and trying to access login/register, redirect to dashboard
    if (pathname === '/auth/login' || pathname === '/auth/register') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

