# 10_PORTAL_BOOTSTRAP.md
# Set up the portal from scratch. Do this before any feature work.
# ReliantCareNetwork — Portal Setup

---

## Pre-flight

Read before writing any code:
- 00_AGENT_INSTRUCTIONS.md
- 01_PROJECT_CONTEXT.md
- 02_DESIGN_SYSTEM.md

---

## Architecture Decision — Locked

**Landing page:** React 18 + Vite (already built, do not touch)
Repo: github.com/ocdeployments/reliantcare
URL: reliantcarenetwork.com

**Portal:** Next.js 15 App Router (build from scratch)
Repo: github.com/ocdeployments/reliantcare-portal
URL: app.reliantcarenetwork.com

Two separate repos. Two separate Vercel deployments.
They share the design system (02_DESIGN_SYSTEM.md) but
are otherwise independent.

---

## Step 1 — Create the Next.js 15 Project

```bash
# Create new project
npx create-next-app@latest reliantcare-portal \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd reliantcare-portal
```

When prompted:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- src/ directory: Yes
- App Router: Yes
- Import alias: @/*

---

## Step 2 — Install All Dependencies

```bash
# Auth
pnpm add @clerk/nextjs

# Database
pnpm add @supabase/supabase-js drizzle-orm postgres
pnpm add -D drizzle-kit

# Forms and validation
pnpm add react-hook-form zod @hookform/resolvers

# UI
pnpm add @radix-ui/react-slot class-variance-authority clsx tailwind-merge
pnpm add lucide-react
pnpm add framer-motion

# Tables
pnpm add @tanstack/react-table

# File upload
pnpm add react-dropzone

# SMS
pnpm add twilio

# PDF parsing
pnpm add pdf-parse
pnpm add -D @types/pdf-parse

# Monitoring
pnpm add @sentry/nextjs
pnpm add posthog-js

# shadcn/ui setup
pnpm add -D @shadcn/ui
npx shadcn@latest init
```

shadcn init options:
- Style: Default
- Base colour: Neutral
- CSS variables: Yes

---

## Step 3 — Folder Structure

Create this exact structure:

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── sign-up/
│   │       └── page.tsx
│   ├── (caregiver)/
│   │   ├── profile/
│   │   │   ├── build/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── (agency)/
│   │   └── search/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   └── caregivers/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/          ← shadcn components
│   ├── forms/       ← ProfileForm, etc.
│   └── nav/         ← Navbar
├── lib/
│   ├── supabase.ts  ← DO NOT TOUCH after creation
│   ├── db/
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── clerk.ts
│   └── utils.ts
└── middleware.ts     ← DO NOT TOUCH after creation
```

---

## Step 4 — Environment Variables

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/profile/build

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Monitoring (add before launch)
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
```

Add to `.gitignore`:
```
.env
.env.local
.env*.local
```

---

## Step 5 — Supabase Client

File: `src/lib/supabase.ts`

```typescript
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export function createServiceClient() {
  return createSupabaseClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

**DO NOT TOUCH THIS FILE after creation.**

---

## Step 6 — Clerk Middleware

File: `src/middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect((has) => has({ role: 'platform_admin' }))
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

**DO NOT TOUCH THIS FILE after creation.**

---

## Step 7 — Root Layout

File: `src/app/layout.tsx`

```typescript
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReliantCare Network',
  description: 'Experience care powered by intelligence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
```

---

## Step 8 — Tailwind Config

File: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A2B4A',
          dark: '#0F1E35',
        },
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#B45309',
          tint: '#FEF3C7',
        },
        royal: {
          DEFAULT: '#1E3A8A',
          light: '#2563EB',
        },
        warm: {
          white: '#FAFAF8',
        },
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Step 9 — Health Check Endpoint

File: `src/app/api/health/route.ts`

```typescript
import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const start = Date.now()
  try {
    const supabase = createClient()
    await supabase.from('caregivers').select('count').limit(1)
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      responseTime: `${Date.now() - start}ms`,
    })
  } catch {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    }, { status: 500 })
  }
}
```

---

## Step 10 — Verify Setup

Run these checks before anything else:

```bash
# Start dev server
pnpm dev

# Should run on http://localhost:3000

# Test health endpoint
curl http://localhost:3000/api/health
# Should return: {"status":"healthy",...}

# Build check
pnpm build
# Should complete with zero errors

# Type check
pnpm type-check
# Should return zero errors
```

All four checks must pass before any feature work begins.

---

## Step 11 — Create GitHub Repo and Push

```bash
# Initialise git
git init
git add .
git commit -m "chore: portal bootstrap — Next.js 15, Clerk, Supabase, Tailwind"

# Create repo on GitHub (github.com/ocdeployments/reliantcare-portal)
git remote add origin https://github.com/ocdeployments/reliantcare-portal.git
git branch -M main
git push -u origin main

# Tag the restore point
git tag restore/portal-bootstrap
git push origin restore/portal-bootstrap
```

---

## Step 12 — Connect to Vercel

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Add all environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... repeat for all env vars

# Deploy to preview
vercel

# Verify preview URL works
# Then set custom domain in Vercel dashboard:
# app.reliantcarenetwork.com
```

---

## What This Unlocks

Once bootstrap is verified and pushed:
- OpenClaw can start on 03_BUILD_SCHEMA_V2.md
- Followed by 04_BUILD_PROFILE_BUILDER_FIXES.md
- Then 05_BUILD_FOR_AGENCIES_PAGE.md
- Then 06_BUILD_ADMIN_DASHBOARD.md

Do not start any feature build until:
- [ ] `pnpm dev` runs without errors
- [ ] Health endpoint returns healthy
- [ ] `pnpm build` passes
- [ ] Repo is on GitHub
- [ ] Restore point tagged

---

*Last updated: April 2026 — ReliantCareNetwork*
*Do this once. Do it right. Everything else builds on top of it.*
