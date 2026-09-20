import crypto from 'crypto';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName}`);
  }
}

// ---------------------------------------------------------------------------
// Crypto & PBKDF2 logic
// ---------------------------------------------------------------------------
const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';
const DEFAULT_SECRET = 'feasthub-default-secure-signing-key-production-32b';

async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`pbkdf2:${PBKDF2_ITERATIONS}:${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

async function verifyPassword(password, storedHash) {
  return new Promise((resolve) => {
    try {
      const parts = storedHash.split(':');
      if (parts.length !== 4 || parts[0] !== 'pbkdf2') return resolve(false);
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

function signToken(payload) {
  const signature = crypto.createHmac('sha256', DEFAULT_SECRET).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

function verifySignedToken(signedToken) {
  try {
    const lastDotIndex = signedToken.lastIndexOf('.');
    if (lastDotIndex === -1) return null;
    const payload = signedToken.slice(0, lastDotIndex);
    const signature = signedToken.slice(lastDotIndex + 1);
    const expectedSignature = crypto.createHmac('sha256', DEFAULT_SECRET).update(payload).digest('hex');
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

// ---------------------------------------------------------------------------
// Sanitization
// ---------------------------------------------------------------------------
function sanitizeText(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  let clean = input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:\s*text\/html/gi, '')
    .trim();
  if (clean.length > maxLength) clean = clean.slice(0, maxLength);
  return clean;
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ---------------------------------------------------------------------------
// Rate Limiter
// ---------------------------------------------------------------------------
const rateLimitStore = new Map();

function checkRateLimit(identifier, limit, windowMs) {
  const now = Date.now();
  const windowStart = now - windowMs;
  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0] || now;
    return { success: false, remaining: 0, resetSeconds: Math.ceil((oldest + windowMs - now) / 1000) };
  }
  record.timestamps.push(now);
  return { success: true, remaining: limit - record.timestamps.length, resetSeconds: Math.ceil((record.timestamps[0] + windowMs - now) / 1000) };
}

// ---------------------------------------------------------------------------
// Ownership (IDOR)
// ---------------------------------------------------------------------------
function validateOrderAccess(user, order) {
  if (user.role === 'SUPER_ADMIN') return { allowed: true };
  if (user.role === 'RESTAURANT_ADMIN') {
    if (!user.restaurantId || user.restaurantId === order.restaurantId) return { allowed: true };
    return { allowed: false, reason: 'Forbidden: Wrong restaurant' };
  }
  if (user.role === 'DELIVERY_RIDER') {
    if (order.rider && order.rider.id === user.id) return { allowed: true };
    return { allowed: false, reason: 'Forbidden: Not assigned rider' };
  }
  if (user.role === 'CUSTOMER') {
    if (order.customerId === user.id) return { allowed: true };
    return { allowed: false, reason: 'Forbidden: IDOR blocked' };
  }
  return { allowed: false, reason: 'Unauthorized' };
}

// ---------------------------------------------------------------------------
// State Machine
// ---------------------------------------------------------------------------
const ALLOWED_TRANSITIONS = [
  { from: 'Pending', to: 'Confirmed', allowedRoles: ['RESTAURANT_ADMIN', 'SUPER_ADMIN'] },
  { from: 'Confirmed', to: 'Preparing', allowedRoles: ['RESTAURANT_ADMIN', 'SUPER_ADMIN'] },
  { from: 'Preparing', to: 'Ready', allowedRoles: ['RESTAURANT_ADMIN', 'SUPER_ADMIN'] },
  { from: 'Ready', to: 'Picked Up', allowedRoles: ['DELIVERY_RIDER', 'SUPER_ADMIN'] },
  { from: 'Picked Up', to: 'On The Way', allowedRoles: ['DELIVERY_RIDER', 'SUPER_ADMIN'] },
  { from: 'On The Way', to: 'Delivered', allowedRoles: ['DELIVERY_RIDER', 'SUPER_ADMIN'] },
  { from: 'Pending', to: 'Cancelled', allowedRoles: ['CUSTOMER', 'RESTAURANT_ADMIN', 'SUPER_ADMIN'] },
  { from: 'Confirmed', to: 'Cancelled', allowedRoles: ['RESTAURANT_ADMIN', 'SUPER_ADMIN'] },
];

function validateOrderStatusTransition(currentStatus, newStatus, user) {
  if (currentStatus === newStatus) return { allowed: false, reason: 'Same state' };
  if (currentStatus === 'Delivered' || currentStatus === 'Cancelled') return { allowed: false, reason: 'Terminal state' };
  if (user.role === 'SUPER_ADMIN') return { allowed: true };
  const matched = ALLOWED_TRANSITIONS.find((t) => t.from === currentStatus && t.to === newStatus);
  if (!matched) return { allowed: false, reason: 'Invalid progression' };
  if (!matched.allowedRoles.includes(user.role)) return { allowed: false, reason: 'Forbidden role' };
  return { allowed: true };
}

// ---------------------------------------------------------------------------
// Input Validators
// ---------------------------------------------------------------------------
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateLoginInput(body) {
  if (!body || typeof body !== 'object') return { isValid: false, error: 'Object expected' };
  const { email, password } = body;
  if (!email || !EMAIL_REGEX.test(email.trim())) return { isValid: false, error: 'Invalid email' };
  if (!password || password.length === 0) return { isValid: false, error: 'Password required' };
  return { isValid: true, sanitizedEmail: email.trim().toLowerCase() };
}

function validateRegisterInput(body) {
  if (!body || typeof body !== 'object') return { isValid: false, error: 'Object expected' };
  const { name, email, password } = body;
  if (!name || name.length < 2) return { isValid: false, error: 'Invalid name' };
  if (!email || !EMAIL_REGEX.test(email.trim())) return { isValid: false, error: 'Invalid email' };
  if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password policy breached' };
  }
  return { isValid: true };
}

async function run() {
  console.log('\n🔒 Running FeastHub Automated Defensive Security Verification Suite...\n');

  // 1. Password Hashing
  console.log('--- 1. Cryptographic Password Hashing (PBKDF2-HMAC-SHA512) ---');
  const pass = 'Customer@123';
  const hash = await hashPassword(pass);
  assert(hash.startsWith('pbkdf2:100000:'), 'PBKDF2 uses 100,000 iterations');
  assert(await verifyPassword(pass, hash) === true, 'Matching password verified in constant time');
  assert(await verifyPassword('Wrong@999', hash) === false, 'Incorrect password rejected');

  // Token signing
  const signed = signToken('session-12345');
  assert(verifySignedToken(signed) === 'session-12345', 'Valid HMAC-SHA256 signed token verified');
  assert(verifySignedToken(signed + 'tamper') === null, 'Tampered token rejected');

  // 2. XSS Sanitization
  console.log('\n--- 2. XSS & Script Injection Sanitization ---');
  const clean = sanitizeText('<script>alert("pwned")</script>Delicious Burger');
  assert(!clean.includes('<script>') && clean.includes('Delicious Burger'), 'Dangerous script tag stripped');
  assert(!sanitizeText('javascript:alert(1)').includes('javascript:'), 'javascript: scheme neutralized');
  assert(escapeHtml('<div class="test">').includes('&lt;div class=&quot;test&quot;&gt;'), 'HTML entities safely escaped');

  // 3. Rate Limiting
  console.log('\n--- 3. Sliding Window Rate Limiting (Token Bucket) ---');
  const key = 'ip_10_0_0_1';
  assert(checkRateLimit(key, 2, 1000).success === true, '1st attempt permitted');
  assert(checkRateLimit(key, 2, 1000).success === true, '2nd attempt permitted');
  const blocked = checkRateLimit(key, 2, 1000);
  assert(blocked.success === false && blocked.remaining === 0, '3rd attempt rate-limited (HTTP 429)');

  // 4. IDOR / BOLA
  console.log('\n--- 4. IDOR / BOLA Ownership Verification ---');
  const order = { id: 'FD-101', customerId: 'user-tanvir', restaurantId: 'rest-1', rider: { id: 'rider-rakib' } };
  assert(validateOrderAccess({ id: 'user-tanvir', role: 'CUSTOMER' }, order).allowed === true, 'Order owner customer access granted');
  assert(validateOrderAccess({ id: 'user-hacker', role: 'CUSTOMER' }, order).allowed === false, 'IDOR blocked for non-owner customer');
  assert(validateOrderAccess({ id: 'rider-rakib', role: 'DELIVERY_RIDER' }, order).allowed === true, 'Assigned courier access granted');
  assert(validateOrderAccess({ id: 'rider-other', role: 'DELIVERY_RIDER' }, order).allowed === false, 'Unassigned courier access blocked');
  assert(validateOrderAccess({ id: 'admin-1', role: 'SUPER_ADMIN' }, order).allowed === true, 'Super Admin access granted');

  // 5. State Machine
  console.log('\n--- 5. Order State Machine & Role Constraints ---');
  assert(validateOrderStatusTransition('Confirmed', 'Delivered', { role: 'CUSTOMER' }).allowed === false, 'Customer cannot mark order Delivered');
  assert(validateOrderStatusTransition('Confirmed', 'Preparing', { role: 'RESTAURANT_ADMIN' }).allowed === true, 'Admin can mark order Preparing');
  assert(validateOrderStatusTransition('Ready', 'Picked Up', { role: 'DELIVERY_RIDER' }).allowed === true, 'Rider can mark order Picked Up');
  assert(validateOrderStatusTransition('Delivered', 'Confirmed', { role: 'RESTAURANT_ADMIN' }).allowed === false, 'Delivered order terminal state immutable');

  // 6. Input Validation
  console.log('\n--- 6. Input Validation Schemas ---');
  assert(validateLoginInput({ email: 'bad-email', password: '123' }).isValid === false, 'Malformed email rejected');
  assert(validateLoginInput({ email: 'tanvir@example.com', password: '123' }).isValid === true, 'Valid email accepted');
  assert(validateRegisterInput({ name: 'T', email: 't@t.com', password: 'weak' }).isValid === false, 'Weak password rejected');
  assert(validateRegisterInput({ name: 'Tanvir', email: 't@t.com', password: 'StrongPassword@1' }).isValid === true, 'Compliant registration accepted');

  console.log('\n======================================================');
  console.log(`Summary: ${passedTests}/${totalTests} tests passed (${failedTests} failures)`);
  console.log('======================================================\n');

  if (failedTests > 0) process.exit(1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
