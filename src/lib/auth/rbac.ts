import { NextResponse } from 'next/server';
import { getSessionFromRequest, UserSession } from './session';
import { UserRole } from './userStore';
import { logSecurityEvent } from '../security/logger';
import { getClientIp } from '../security/rateLimiter';

export interface AuthGuardResult {
  session: UserSession | null;
  errorResponse?: NextResponse;
}

/**
 * Requires the request to have a valid, unexpired authenticated session.
 * Returns 401 Unauthorized if not authenticated.
 */
export async function requireAuth(req: Request): Promise<AuthGuardResult> {
  const session = await getSessionFromRequest(req);

  if (!session) {
    const ip = getClientIp(req);
    logSecurityEvent({
      event: 'AUTH_UNAUTHORIZED',
      ip,
      path: new URL(req.url).pathname,
      severity: 'WARN',
      details: { reason: 'No valid session cookie detected' },
    });

    return {
      session: null,
      errorResponse: NextResponse.json(
        { error: 'Unauthorized: Authentication required to access this resource.' },
        { status: 401 }
      ),
    };
  }

  return { session };
}

/**
 * Requires the authenticated user to hold one of the specified roles.
 * Returns 401 if unauthenticated, or 403 Forbidden if role is insufficient.
 */
export async function requireRole(
  req: Request,
  allowedRoles: UserRole[]
): Promise<AuthGuardResult> {
  const { session, errorResponse } = await requireAuth(req);
  if (errorResponse || !session) {
    return { session: null, errorResponse };
  }

  // Super Admin has universal access
  if (session.role === 'SUPER_ADMIN') {
    return { session };
  }

  if (!allowedRoles.includes(session.role)) {
    const ip = getClientIp(req);
    logSecurityEvent({
      event: 'RBAC_ACCESS_DENIED',
      userId: session.userId,
      role: session.role,
      ip,
      path: new URL(req.url).pathname,
      severity: 'SECURITY_ALERT',
      details: {
        attemptedRolesRequired: allowedRoles,
        userRole: session.role,
      },
    });

    return {
      session: null,
      errorResponse: NextResponse.json(
        { error: `Forbidden: Access requires role [${allowedRoles.join(', ')}].` },
        { status: 403 }
      ),
    };
  }

  return { session };
}

export function requireCustomer(req: Request) {
  return requireRole(req, ['CUSTOMER']);
}

export function requireRestaurantAdmin(req: Request) {
  return requireRole(req, ['RESTAURANT_ADMIN', 'SUPER_ADMIN']);
}

export function requireRider(req: Request) {
  return requireRole(req, ['DELIVERY_RIDER', 'SUPER_ADMIN']);
}

export function requireSuperAdmin(req: Request) {
  return requireRole(req, ['SUPER_ADMIN']);
}
