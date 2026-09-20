# FeastHub Security Architecture & Production Security Policy

## 1. Security Architecture & System Overview

FeastHub employs a **defense-in-depth security model** engineered to protect customer data, restaurant partner workflows, courier telemetries, and administrative controls.

```
                           [ Web / Mobile Client ]
                                      │
                                      ▼
                      [ Edge Runtime Middleware Layer ]
                       ├── HTTP Defensive Security Headers
                       ├── CSRF & Cross-Origin Verification
                       ├── Edge Route Protection & Authentication Guard
                       └── Session Cookie Signature Verification
                                      │
                                      ▼
                      [ Production API Route Handlers ]
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
  [/api/auth/*]                 [/api/orders/*]               [/api/admin/*]
  - PBKDF2 Password Hashing     - Authoritative Pricing Engine - Multi-Tenant RBAC
  - Cryptographic Session Token - Status Finite State Machine  - Food & Pricing Boundaries
  - HttpOnly Cookie Issuance    - Strict IDOR / BOLA Filters   - Destructive Action Logging
       │                              │                              │
       └──────────────────────────────┼──────────────────────────────┘
                                      ▼
                     [ Core Security Infrastructure ]
                      ├── Sliding Window Rate Limiter (Token Bucket)
                      ├── HTML / Script XSS Sanitization Engine
                      ├── Deep Input Validation Schemas
                      └── Tamper-Evident Security Audit Logger (PII Redacted)
```

### Distinction: Demo Security vs. Production Security

| Domain | Current Implementation (Demo Architecture) | Enterprise Production Requirement |
|---|---|---|
| **Data Persistence** | In-memory server registries synchronized with authenticated browser cache for zero-config demo evaluation. | Managed relational database (e.g. AWS Aurora PostgreSQL, GCP Cloud SQL) with row-level security (RLS), automated daily snapshots, and read replicas. |
| **Session Cache** | In-memory session table with cryptographic HMAC-SHA256 cookie signatures. | Distributed Redis cluster (e.g. Upstash or AWS ElastiCache) with distributed lease TTLs and instant cluster revocation. |
| **Payment Gateway** | Simulated tokenized payment processing; card data is tokenized/masked in the browser and never transmitted or stored. | Certified Level 1 PCI-DSS Payment Gateway (Stripe, SSLCommerz, bKash Merchant API) using server-side Webhook signature verification (`crypto.timingSafeEqual`). |
| **Secrets Engine** | Environment variables with `.env.example` template and hardened `.gitignore`. | Secret management vault (e.g. HashiCorp Vault, AWS Secrets Manager, Vercel Encrypted Environment Variables) with automated 90-day secret rotation. |

> [!WARNING]
> **LocalStorage Security Limitation**: In client prototypes, `localStorage` is accessible to JavaScript running within the application domain. While FeastHub uses HttpOnly cookies for sessions, local storage is only used as a client-side cache and **must never be used to store raw passwords, encryption keys, or unsanitized payment information**.

---

## 2. Authentication Model

1. **Password Hashing**:
   - Algorithm: **PBKDF2-HMAC-SHA512** with **100,000 iterations** and a 16-byte cryptographically secure random salt (`crypto.randomBytes(16)`).
   - Format: `pbkdf2:100000:<saltHex>:<hashHex>`.
   - Timing-attack resistance: Verifications utilize `crypto.timingSafeEqual()` to ensure constant-time string comparisons.
2. **Credential Rules**:
   - Minimum 8 characters.
   - Requires at least one uppercase letter (`[A-Z]`).
   - Requires at least one numerical digit (`[0-9]`).
3. **Session Issuance**:
   - Cryptographically random 256-bit entropy tokens (`crypto.randomBytes(32)`).
   - Signed with server secret via HMAC-SHA256 (`token.signature`) before placement in client cookies.
   - Passwords and hash digests are stripped from all API responses.

---

## 3. Role-Based Access Control (RBAC)

FeastHub enforces strict Role-Based Access Control across 4 distinct principal roles. Client-supplied role claims are **never trusted**. Roles are resolved authoritatively from the server session.

```
       [SUPER_ADMIN] ──▶ Universal Administrative Oversight & System Config
             │
             ├──▶ [RESTAURANT_ADMIN] ──▶ Kitchen Menus, Pricing, Preparation Status
             │
             ├──▶ [DELIVERY_RIDER]  ──▶ Pickup & In-Transit Delivery Status Updates
             │
             └──▶ [CUSTOMER]        ──▶ Order Placement, Table Bookings, Reviews
```

### Role Matrix & Permissions

| Permission / Action | CUSTOMER | RESTAURANT_ADMIN | DELIVERY_RIDER | SUPER_ADMIN |
|---|:---:|:---:|:---:|:---:|
| Browse Restaurants & Menus | ✅ | ✅ | ✅ | ✅ |
| Place Order & Cart Checkout | ✅ | ❌ | ❌ | ✅ |
| View Personal Order History | ✅ (Own) | ❌ | ❌ | ✅ (All) |
| Live Courier Tracking | ✅ (Own) | ✅ (Store) | ✅ (Assigned) | ✅ (All) |
| Transition to `Preparing` / `Ready` | ❌ | ✅ (Store) | ❌ | ✅ |
| Transition to `Picked Up` / `On The Way` | ❌ | ❌ | ✅ (Assigned) | ✅ |
| Transition to `Delivered` | ❌ | ❌ | ✅ (Assigned) | ✅ |
| Edit Menu Items & Prices | ❌ | ✅ (Store) | ❌ | ✅ |
| Toggle Restaurant Open/Close | ❌ | ✅ (Store) | ❌ | ✅ |
| Access Operations Dispatch Queue | ❌ | ✅ | ❌ | ✅ |

### Server Authorization Helpers (`src/lib/auth/rbac.ts`)
- `requireAuth(request)`: Returns HTTP 401 if session cookie is missing, tampered, or expired.
- `requireRole(request, allowedRoles)`: Returns HTTP 403 Forbidden if user role is not authorized.
- `requireCustomer(request)`, `requireRestaurantAdmin(request)`, `requireRider(request)`, `requireSuperAdmin(request)`.

---

## 4. IDOR / BOLA Prevention Architecture

Broken Object-Level Authorization (IDOR/BOLA) is mitigated by enforcing ownership validation on every resource access (`src/lib/security/ownership.ts`):

1. **Order Resources (`/api/orders/[id]`, `/tracking/[id]`)**:
   - Customer must match `order.customerId === user.id`.
   - Rider must match `order.rider.id === user.id`.
   - Restaurant Admin must match `order.restaurantId === user.restaurantId`.
   - Super Admin has global read/write.
   - If ownership check fails, the server responds with **HTTP 403 Forbidden** and emits an `IDOR_ACCESS_BLOCKED` security alert.
2. **Reservations (`/api/reservations`)**:
   - Customers can only query bookings associated with their authenticated email/name.
3. **User Profiles (`/api/profile`)**:
   - Accounts can only query and mutate their own address books and contact information.

---

## 5. Server-Side Input Validation & Authoritative Financial Calculations

Front-end input validation is considered purely UX; all constraints are enforced independently on the server (`src/lib/validation/schemas.ts`):

### Authoritative Financial Totals (`src/lib/orders/orderPricing.ts`)
- The client is **never trusted** for item prices, delivery fees, discount calculations, or grand totals.
- When an order is placed:
  1. Each food item is looked up from the authoritative catalog.
  2. Customization add-on prices are verified against item options.
  3. Authoritative subtotal = $\sum (\text{verifiedPrice} + \sum \text{addonPrices}) \times \text{quantity}$.
  4. Delivery fee is fetched from the verified restaurant record.
  5. Promo vouchers (`FIRST20`, `FEAST100`, `BURGER50`) are validated against minimum spend requirements and maximum discount caps.
  6. Authoritative total = $\max(0, \text{subtotal} + \text{deliveryFee} - \text{discount})$.
  7. Any client attempt to submit modified totals triggers a `PRICE_MANIPULATION_DETECTED` security alert.

### Finite State Machine for Orders (`src/lib/orders/stateMachine.ts`)
Valid state transitions:
$$\text{Pending} \longrightarrow \text{Confirmed} \longrightarrow \text{Preparing} \longrightarrow \text{Ready} \longrightarrow \text{Picked Up} \longrightarrow \text{On The Way} \longrightarrow \text{Delivered}$$
- Terminal states (`Delivered`, `Cancelled`) cannot be modified.
- Skipping steps (e.g. jumping from `Confirmed` to `Delivered`) is strictly rejected with HTTP 400.

---

## 6. XSS & HTML Injection Protection

1. **Safe React Rendering**: User-generated content is rendered through React's native virtual DOM, escaping dangerous HTML characters by default.
2. **Zero `dangerouslySetInnerHTML`**: The codebase does not use `dangerouslySetInnerHTML`.
3. **Server-Side Sanitizer (`src/lib/security/sanitize.ts`)**:
   - Strips ASCII control characters, script/style tags, and executable schemes (`javascript:`, `vbscript:`, `data:text/html`).
   - HTML entity encodes dangerous characters (`&`, `<`, `>`, `"`, `'`).

---

## 7. CSRF & Cross-Origin Protections

1. **SameSite Cookie Policy**:
   - Session cookies utilize `SameSite=Lax`, preventing third-party websites from sending authenticated requests via cross-site links.
2. **Origin & Referer Validation (`src/middleware.ts`)**:
   - Next.js Edge Middleware inspects all mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`).
   - Verifies that `Origin` or `Referer` matches the server's `Host` header.
   - Cross-origin form posts without CORS approval are rejected with **HTTP 403 CSRF Forbidden**.

---

## 8. Rate Limiting & Abuse Prevention

Sliding-window in-memory rate limiting is applied across all sensitive endpoints (`src/lib/security/rateLimiter.ts`):

| Policy Tier | Endpoint Scope | Limit | Window | Action upon Breach |
|---|---|---|---|---|
| **AUTH** | `/api/auth/login`, `/api/auth/register` | 5 requests | 15 Minutes | HTTP 429 + `Retry-After` header |
| **CHECKOUT** | `/api/orders` | 10 requests | 1 Minute | HTTP 429 + `Retry-After` header |
| **RESERVATION**| `/api/reservations` | 8 requests | 5 Minutes | HTTP 429 + `Retry-After` header |
| **REVIEW** | `/api/reviews` | 5 requests | 5 Minutes | HTTP 429 + `Retry-After` header |
| **GENERAL_API**| All other API routes | 60 requests | 1 Minute | HTTP 429 + `Retry-After` header |

Automatic memory garbage collection purges stale IP records every 5 minutes to prevent memory leaks.

---

## 9. Security Headers & CSP Configuration

Configured in `next.config.mjs` and reinforced by Edge Middleware `src/middleware.ts`:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://images.unsplash.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

- Information disclosure prevention: `poweredByHeader: false` suppresses the `X-Powered-By: Next.js` header.

---

## 10. Secrets Management & Git Hygiene

1. **Audit Summary**: Git commit history was inspected. No private credentials, tokens, or environment files have ever been committed.
2. **Hardened `.gitignore`**:
   - Excludes `.env`, `.env.local`, `.env*.local`, `.env.production`.
   - Excludes `.next/`, `build/`, `coverage/`, `.vercel`.
3. **Environment Segregation**: Private secrets (such as `SESSION_SECRET`, database connection strings, and payment webhook keys) must never be prefixed with `NEXT_PUBLIC_`.

---

## 11. Payment Security (PCI DSS Compliance)

1. **Cardholder Data Protection**:
   - FeastHub does **not store, process, or transmit** unencrypted Primary Account Numbers (PAN), CVVs, or expiration dates.
   - Form inputs in the simulated checkout use tokenized, masked references.
2. **Production Webhook Integration Checklist**:
   - When integrating Stripe, SSLCommerz, or bKash:
     - Verify webhook cryptographic HMAC signatures before fulfilling orders.
     - Never trust front-end URL parameters like `paymentSuccess=true`.
     - Implement idempotency keys (`Idempotency-Key`) on all payment execution requests.

---

## 12. Threat Model & Mitigations

| Threat Actor | Objective | Vector | FeastHub Mitigation |
|---|---|---|---|
| **Anonymous Attacker** | Access admin operations | Direct navigation to `/admin` | Edge middleware intercepts route; returns 401/403 or redirects to login modal. |
| **Malicious Customer** | View other customers' orders | Modifying order ID in `/tracking/[id]` | Server checks `validateOrderAccess()`; non-matching customer receives 403 Forbidden with IDOR alert logged. |
| **Malicious Customer** | Pay 0 BDT for food | Modifying item total or cart payload | Server calculates authoritative prices from menu catalog; client numbers are discarded; price tampering is logged. |
| **Rogue Delivery Rider** | Falsify delivery completion | Calling status update directly | Finite State Machine verifies previous status is `On The Way`; status transitions are recorded in audit logs. |
| **Credential Stuffer** | Brute force user accounts | Automated requests to `/api/auth/login` | Sliding-window IP rate limiter blocks requests after 5 attempts per 15 minutes with HTTP 429. |
| **Clickjacker** | Embed app in malicious iframe | Iframe overlay on checkout button | `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` prevent frame embedding. |

---

## 13. Security Testing Checklist

- [x] **Authentication Tests**:
  - Invalid password returns HTTP 401 with generic error message.
  - Rate limiter triggers HTTP 429 after 5 failed attempts.
  - Sign out invalidates server session and clears cookie.
- [x] **Authorization & RBAC Tests**:
  - Customer accessing `/admin` displays RBAC Access Warning.
  - Customer calling `/api/admin/menu` receives HTTP 403 Forbidden.
  - Delivery rider accessing another courier's order receives HTTP 403 Forbidden.
- [x] **IDOR Tests**:
  - User A navigating to User B's order ID in `/tracking/[id]` displays "Access Denied (IDOR Protected)".
  - `/api/orders/[id]` returns HTTP 403 when session user does not match `customerId`.
- [x] **Financial Integrity Tests**:
  - Client passing `total: 10` for a 1200 BDT order is recalculated correctly to 1200 BDT.
  - Tamper event `PRICE_MANIPULATION_DETECTED` is emitted to audit logs.
- [x] **Status Machine Tests**:
  - Customer attempting to set `Delivered` receives HTTP 400.
  - Direct skip from `Confirmed` to `Delivered` is rejected.
- [x] **Input Validation Tests**:
  - Negative item quantities, invalid email formats, and long comments are rejected with HTTP 400.
  - HTML tags and control characters are stripped.

---

## 14. Production Deployment Checklist (Vercel & Cloud)

1. [ ] Generate strong 64-character hex `SESSION_SECRET` via `openssl rand -hex 32` and set in Vercel Environment Variables.
2. [ ] Ensure `NODE_ENV=production` is set so session cookies enforce the `Secure` flag (HTTPS-only).
3. [ ] Configure custom domain with DNSSEC and Strict Transport Security (HSTS preload).
4. [ ] Enable Vercel Attack Challenge Mode / Web Application Firewall (WAF) for DDoS mitigation.
5. [ ] Connect structured security logs (`logSecurityEvent`) to Datadog, AWS CloudWatch, or Logtail.
6. [ ] Regularly execute `npm audit` and apply patch updates to dependencies.

---

## 15. Known Limitations

- **In-Memory Demonstration Registry**: In this version, user registrations, sessions, and newly placed orders reside in Node.js server memory and browser cache. Restarting the server process resets test accounts back to default seed personas. In production, this should be backed by a persistent PostgreSQL database and Redis session store.
- **Client Cache**: Offline demo mode utilizes `localStorage` for rapid navigation. In a high-security enterprise deployment, disable local caching of private order histories and require active session connectivity.

---

## 16. Future Security Improvements

1. **Two-Factor Authentication (2FA / TOTP)**: Introduce RFC 6238 time-based one-time password verification for `RESTAURANT_ADMIN` and `SUPER_ADMIN` accounts.
2. **Distributed Redis Rate Limiting**: Migrate from in-memory token buckets to Redis-backed Upstash rate limiting for multi-region serverless deployments.
3. **WebAuthn / Passkeys**: Support biometric device-bound authentication for customer convenience and phishing resistance.
4. **Automated Vulnerability Scanning (SAST/DAST)**: Integrate Snyk, Dependabot, and OWASP ZAP into GitHub Actions CI/CD pipelines.
