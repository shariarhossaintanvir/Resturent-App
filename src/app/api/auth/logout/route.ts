import { NextResponse } from 'next/server';
import { getSessionFromRequest, invalidateSession, buildClearSessionCookieHeader } from '../../../../lib/auth/session';
import { logSecurityEvent } from '../../../../lib/security/logger';
import { getClientIp } from '../../../../lib/security/rateLimiter';

export async function POST(req: Request) {
  const session = await getSessionFromRequest(req);
  const ip = getClientIp(req);

  if (session) {
    await invalidateSession(session.sessionId);
    logSecurityEvent({
      event: 'AUTH_LOGOUT',
      ip,
      path: '/api/auth/logout',
      userId: session.userId,
      severity: 'INFO',
    });
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  response.headers.set('Set-Cookie', buildClearSessionCookieHeader());
  return response;
}
