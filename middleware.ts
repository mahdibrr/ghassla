import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Create a clone of the request headers
  const requestHeaders = new Headers(request.headers)
  
  // If this is a dev tunnel request, modify headers to match
  if (request.headers.get('x-forwarded-host') === 'v9qb68rj-3000.uks1.devtunnels.ms') {
    requestHeaders.set('origin', 'https://v9qb68rj-3000.uks1.devtunnels.ms')
    requestHeaders.set('host', 'v9qb68rj-3000.uks1.devtunnels.ms')
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
