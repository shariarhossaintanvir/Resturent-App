interface RateLimitRecord {
  timestamps: number[];
}

// In-memory store for rate-limiting
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      // Remove timestamps older than 30 minutes
      record.timestamps = record.timestamps.filter((ts) => now - ts < 30 * 60 * 1000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks a rate limit for a given identifier using a sliding-window algorithm.
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0] || now;
    const resetSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Record this request
  record.timestamps.push(now);

  const remaining = limit - record.timestamps.length;
  const oldestTimestamp = record.timestamps[0];
  const resetSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);

  return {
    success: true,
    limit,
    remaining: Math.max(0, remaining),
    resetSeconds: Math.max(1, resetSeconds),
  };
}

/**
 * Extracts client IP address from Next.js Request headers safely.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

// Preset rate limit policies
export const RATE_LIMITS = {
  AUTH: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  CHECKOUT: { limit: 10, windowMs: 60 * 1000 }, // 10 orders per minute
  RESERVATION: { limit: 8, windowMs: 5 * 60 * 1000 }, // 8 bookings per 5 minutes
  REVIEW: { limit: 5, windowMs: 5 * 60 * 1000 }, // 5 reviews per 5 minutes
  GENERAL_API: { limit: 60, windowMs: 60 * 1000 }, // 60 requests per minute
};
