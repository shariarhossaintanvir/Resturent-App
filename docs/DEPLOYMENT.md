# Deployment Guide
## FeastHub — Premium Restaurant & Food Delivery Platform

This guide outlines deployment options for hosting FeastHub on Vercel, Netlify, Docker, or custom Node.js VPS servers.

---

## 1. Prerequisites
- Node.js 18.17.0+ or Node.js 20+ LTS
- npm 9+ or pnpm 8+

---

## 2. Deploy to Vercel (Recommended for Next.js)
The easiest way to deploy FeastHub is using Vercel:
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your `Restaurant App` repository.
4. Leave framework preset as **Next.js**.
5. Click **Deploy**.

Vercel automatically handles Next.js App Router, asset optimization, and edge routing.

---

## 3. Deploy to Netlify
1. Connect your repository to [Netlify](https://netlify.com).
2. Set Build command:
   ```bash
   npm run build
   ```
3. Set Publish directory:
   ```
   .next
   ```
4. Deploy site.

---

## 4. Self-Hosted VPS / Docker Deployment

### Dockerfile
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Run Locally / On Server
```bash
# Build production bundle
npm run build

# Start production server
npm run start
```
By default, the server runs on `http://localhost:3000`.
