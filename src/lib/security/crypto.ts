import crypto from 'crypto';

const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';
const DEFAULT_SECRET = 'feasthub-default-secure-signing-key-production-32b';

/**
 * Retrieves the session signing secret from environment or fallback
 */
function getSigningSecret(): string {
  return process.env.SESSION_SECRET || DEFAULT_SECRET;
}

/**
 * Hashes a plaintext password using PBKDF2-HMAC-SHA512 with a cryptographically secure random salt.
 * Returns formatted string: pbkdf2:<iterations>:<saltHex>:<hashHex>
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`pbkdf2:${PBKDF2_ITERATIONS}:${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verifies a password against a stored PBKDF2 hash using timing-safe comparison.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parts = storedHash.split(':');
      if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
        return resolve(false);
      }

      const iterations = parseInt(parts[1], 10);
      const salt = parts[2];
      const originalHash = Buffer.from(parts[3], 'hex');

      crypto.pbkdf2(password, salt, iterations, originalHash.length, DIGEST, (err, derivedKey) => {
        if (err) return resolve(false);
        if (derivedKey.length !== originalHash.length) return resolve(false);
        resolve(crypto.timingSafeEqual(originalHash, derivedKey));
      });
    } catch {
      resolve(false);
    }
  });
}

/**
 * Generates an opaque, cryptographically secure random token (32 bytes hex = 64 chars).
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Signs a payload string with HMAC-SHA256 using the server secret.
 * Output: <payload>.<signatureHex>
 */
export function signToken(payload: string): string {
  const secret = getSigningSecret();
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed token and returns the original payload,
 * or null if invalid or tampered with.
 */
export function verifySignedToken(signedToken: string): string | null {
  try {
    const lastDotIndex = signedToken.lastIndexOf('.');
    if (lastDotIndex === -1) return null;

    const payload = signedToken.slice(0, lastDotIndex);
    const signature = signedToken.slice(lastDotIndex + 1);

    const secret = getSigningSecret();
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    if (signature.length !== expectedSignature.length) return null;

    const expectedBuf = Buffer.from(expectedSignature, 'hex');
    const actualBuf = Buffer.from(signature, 'hex');

    if (expectedBuf.length !== actualBuf.length) return null;
    if (!crypto.timingSafeEqual(expectedBuf, actualBuf)) return null;

    return payload;
  } catch {
    return null;
  }
}
