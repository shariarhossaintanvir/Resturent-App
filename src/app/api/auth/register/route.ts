import { NextResponse } from 'next/server';
import { validateRegisterInput } from '../../../../lib/validation/schemas';
import { registerUser } from '../../../../lib/auth/userStore';
import { createSession, buildSessionCookieHeader } from '../../../../lib/auth/session';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '../../../../lib/security/rateLimiter';
import { logSecurityEvent } from '../../../../lib/security/logger';

export async function POST(req: Request) {
  const ip = getClientIp(req);

  // Rate Limiting
  const rateLimitResult = checkRateLimit(
    `register_${ip}`,
    RATE_LIMITS.AUTH.limit,
    RATE_LIMITS.AUTH.windowMs
  );

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: `Registration rate limit exceeded. Please wait ${rateLimitResult.resetSeconds} seconds.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimitResult.resetSeconds) },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload.' }, { status: 400 });
  }

  const validation = validateRegisterInput(body);
  if (!validation.isValid || !validation.sanitizedData) {
    return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
  }

  try {
    const newUser = await registerUser(validation.sanitizedData);
    const { session, signedCookieValue } = await createSession(newUser);

    logSecurityEvent({
      event: 'AUTH_REGISTER',
      ip,
      path: '/api/auth/register',
      userId: newUser.id,
      role: newUser.role,
      severity: 'INFO',
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        avatar: newUser.avatar,
      },
    });

    response.headers.set('Set-Cookie', buildSessionCookieHeader(signedCookieValue));
    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
