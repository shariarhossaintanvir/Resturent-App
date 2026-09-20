import { NextResponse } from 'next/server';
import { UserRole, findUserByEmail, ensureSeedUsers } from '../../../../lib/auth/userStore';
import { createSession, buildSessionCookieHeader } from '../../../../lib/auth/session';
import { logSecurityEvent } from '../../../../lib/security/logger';
import { getClientIp } from '../../../../lib/security/rateLimiter';

const ROLE_EMAILS: Record<UserRole, string> = {
  CUSTOMER: 'tanvir@feasthub.local',
  RESTAURANT_ADMIN: 'admin@theburgerlab.local',
  DELIVERY_RIDER: 'rider.rakib@feasthub.local',
  SUPER_ADMIN: 'superadmin@feasthub.local',
};

export async function POST(req: Request) {
  await ensureSeedUsers();
  const ip = getClientIp(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { role } = (body || {}) as { role?: UserRole };

  if (!role || !ROLE_EMAILS[role]) {
    return NextResponse.json(
      { error: `Invalid role specified. Must be one of: ${Object.keys(ROLE_EMAILS).join(', ')}` },
      { status: 400 }
    );
  }

  const targetEmail = ROLE_EMAILS[role];
  const user = await findUserByEmail(targetEmail);

  if (!user) {
    return NextResponse.json({ error: 'Demo user not found.' }, { status: 404 });
  }

  // Issue real cryptographically signed session cookie for the selected persona
  const { session, signedCookieValue } = await createSession(user);

  logSecurityEvent({
    event: 'AUTH_ROLE_SWITCH',
    ip,
    path: '/api/auth/demo-switch',
    userId: user.id,
    role: user.role,
    severity: 'INFO',
    details: { switchedToRole: user.role },
  });

  const response = NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      restaurantId: user.restaurantId,
      avatar: user.avatar,
    },
  });

  response.headers.set('Set-Cookie', buildSessionCookieHeader(signedCookieValue));
  return response;
}
