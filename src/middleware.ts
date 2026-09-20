import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. CSRF & Origin Verification for Mutating API requests
  if (pathname.startsWith('/api') && CSRF_PROTECTED_METHODS.includes(method)) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    if (origin) {
      const originHost = new URL(origin).host;
      if (host && originHost !== host) {
        return new NextResponse(
          JSON.stringify({ error: 'CSRF Forbidden: Cross-site request origin rejected.' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (referer) {
      try {
        const refererHost = new URL(referer).host;
        if (host && refererHost !== host) {
          return new NextResponse(
            JSON.stringify({ error: 'CSRF Forbidden: Referer host mismatch.' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } catch {
        return new NextResponse(
          JSON.stringify({ error: 'CSRF Forbidden: Invalid referer.' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // 2. Prepare base response
  const response = NextResponse.next();

  // 3. Inject Defensive HTTP Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, _next, favicon
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
