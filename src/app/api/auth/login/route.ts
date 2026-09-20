import { NextResponse } from 'next/server';
import { validateLoginInput } from '../../../../lib/validation/schemas';
import { findUserByEmail } from '../../../../lib/auth/userStore';
import { verifyPassword } from '../../../../lib/security/crypto';
import { createSession, buildSessionCookieHeader } from '../../../../lib/auth/session';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '../../../../lib/security/rateLimiter';
import { logSecurityEvent } from '../../../../lib/security/logger';

export async function POST(req: Request) {
  const ip = getClientIp(req);

  // 1. Rate Limiting for Login Attempts
  const rateLimitResult = checkRateLimit(
    `login_${ip}`,
    RATE_LIMITS.AUTH.limit,
    RATE_LIMITS.AUTH.windowMs
  );

  if (!rateLimitResult.success) {
    logSecurityEvent({
      event: 'RATE_LIMIT_HIT',
      ip,
      path: '/api/auth/login',
      severity: 'WARN',
      details: { resetSeconds: rateLimitResult.resetSeconds },
    });

    return NextResponse.json(
      {
        error: `Too many login attempts. Please wait ${rateLimitResult.resetSeconds} seconds before retrying.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitResult.resetSeconds),
        },
      }
    );
  }

  // 2. Input Validation
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload.' }, { status: 400 });
  }

  const validation = validateLoginInput(body);
  if (!validation.isValid || !validation.sanitizedData) {
    return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
  }

  const { email, password } = validation.sanitizedData;

  // 3. User Lookup
  const user = await findUserByEmail(email);
  if (!user) {
    logSecurityEvent({
      event: 'AUTH_LOGIN_FAILED',
      ip,
      path: '/api/auth/login',
      severity: 'WARN',
      details: { attemptedEmail: email, reason: 'User not found' },
    });
    // Use generic timing-neutral error message
    return NextResponse.json({ error: 'Invalid email address or password.' }, { status: 401 });
  }

  // 4. Password Verification
  const isMatch = await verifyPassword(password, user.passwordHash);
  if (!isMatch) {
    logSecurityEvent({
      event: 'AUTH_LOGIN_FAILED',
      ip,
      path: '/api/auth/login',
      userId: user.id,
      severity: 'WARN',
      details: { attemptedEmail: email, reason: 'Password mismatch' },
    });
    return NextResponse.json({ error: 'Invalid email address or password.' }, { status: 401 });
  }

  // 5. Create Cryptographically Signed Session & Set Cookie
  const { session, signedCookieValue } = await createSession(user);

  logSecurityEvent({
    event: 'AUTH_LOGIN_SUCCESS',
    ip,
    path: '/api/auth/login',
    userId: user.id,
    role: user.role,
    severity: 'INFO',
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
