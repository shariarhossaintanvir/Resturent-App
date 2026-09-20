export type SecurityEventType =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_LOGOUT'
  | 'AUTH_REGISTER'
  | 'AUTH_ROLE_SWITCH'
  | 'AUTH_UNAUTHORIZED'
  | 'RBAC_ACCESS_DENIED'
  | 'IDOR_ACCESS_BLOCKED'
  | 'RATE_LIMIT_HIT'
  | 'PRICE_MANIPULATION_DETECTED'
  | 'STATUS_TRANSITION_VIOLATION'
  | 'ORDER_PLACED'
  | 'ORDER_STATUS_UPDATED'
  | 'ADMIN_ACTION_EXECUTED'
  | 'INPUT_VALIDATION_FAILED';

export interface SecurityLogPayload {
  event: SecurityEventType;
  userId?: string;
  role?: string;
  ip?: string;
  path?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  severity: 'INFO' | 'WARN' | 'SECURITY_ALERT';
}

/**
 * Redacts sensitive fields (passwords, tokens, CVVs, card numbers) from log details
 */
function redactSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
  const SENSITIVE_KEYS = [
    'password',
    'pass',
    'token',
    'secret',
    'cvv',
    'cvc',
    'cardNumber',
    'pin',
    'authorization',
  ];

  const scrubbed: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((s) => lowerKey.includes(s))) {
      scrubbed[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      scrubbed[key] = redactSensitiveData(val as Record<string, unknown>);
    } else {
      scrubbed[key] = val;
    }
  }

  return scrubbed;
}

/**
 * Emits a structured security audit log entry in JSON format for SIEM/observability
 */
export function logSecurityEvent(payload: SecurityLogPayload): void {
  const timestamp = new Date().toISOString();
  const safeDetails = payload.details ? redactSensitiveData(payload.details) : undefined;

  const logEntry = {
    timestamp,
    ...payload,
    details: safeDetails,
  };

  if (payload.severity === 'SECURITY_ALERT') {
    console.error(`🚨 [SECURITY ALERT] ${payload.event}:`, JSON.stringify(logEntry));
  } else if (payload.severity === 'WARN') {
    console.warn(`⚠️ [SECURITY WARNING] ${payload.event}:`, JSON.stringify(logEntry));
  } else {
    console.info(`🛡️ [SECURITY AUDIT] ${payload.event}:`, JSON.stringify(logEntry));
  }
}
