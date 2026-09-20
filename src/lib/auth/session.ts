import { StoredUser, UserRole, findUserById } from './userStore';
import { generateSecureToken, signToken, verifySignedToken } from '../security/crypto';

export interface UserSession {
  id: string;
  sessionId: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  restaurantId?: string;
  avatar: string;
  createdAt: number;
  expiresAt: number;
}

export const SESSION_COOKIE_NAME = 'feasthub_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Active session registry
const sessionStore: Map<string, UserSession> = new Map();

/**
 * Creates a cryptographically signed user session and returns the raw session + signed cookie string.
 */
export async function createSession(user: StoredUser): Promise<{
  session: UserSession;
  signedCookieValue: string;
}> {
  const sessionId = generateSecureToken();
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;

  const session: UserSession = {
    id: user.id,
    sessionId,
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    restaurantId: user.restaurantId,
    avatar: user.avatar,
    createdAt: now,
    expiresAt,
  };

  sessionStore.set(sessionId, session);

  // Sign token to prevent forgery
  const signedCookieValue = signToken(sessionId);

  return { session, signedCookieValue };
}

/**
 * Validates a session token and returns the active session if not expired.
 */
export async function getSessionByToken(token: string): Promise<UserSession | null> {
  const session = sessionStore.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessionStore.delete(token);
    return null;
  }

  return session;
}

/**
 * Invalidates and removes a session
 */
export async function invalidateSession(token: string): Promise<void> {
  sessionStore.delete(token);
}

/**
 * Extracts and verifies the session from an incoming HTTP Request
 */
export async function getSessionFromRequest(req: Request): Promise<UserSession | null> {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const signedToken = cookies[SESSION_COOKIE_NAME];

  if (!signedToken) return null;

  const rawSessionId = verifySignedToken(signedToken);
  if (!rawSessionId) return null;

  return getSessionByToken(rawSessionId);
}

/**
 * Builds the Set-Cookie HTTP response header value for session issuance
 */
export function buildSessionCookieHeader(signedValue: string, maxAgeSeconds: number = 86400): string {
  const isProd = process.env.NODE_ENV === 'production';
  const parts = [
    `${SESSION_COOKIE_NAME}=${signedValue}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (isProd) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

/**
 * Builds the Set-Cookie header to clear and expire the session cookie
 */
export function buildClearSessionCookieHeader(): string {
  const isProd = process.env.NODE_ENV === 'production';
  const parts = [
    `${SESSION_COOKIE_NAME}=deleted`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'Max-Age=0',
  ];
  if (isProd) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

function parseCookies(header: string): Record<string, string> {
  const parsed: Record<string, string> = {};
  if (!header) return parsed;

  const pairs = header.split(';');
  for (const pair of pairs) {
    const [name, ...rest] = pair.trim().split('=');
    if (name) {
      parsed[name] = decodeURIComponent(rest.join('='));
    }
  }
  return parsed;
}
