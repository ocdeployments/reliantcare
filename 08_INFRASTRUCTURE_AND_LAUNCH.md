# 08_INFRASTRUCTURE_AND_LAUNCH.md
# Set up monitoring, health checks, and pre-launch checklist.
# ReliantCareNetwork — Infrastructure

---

## Pre-flight

Read before doing anything:
- 00_AGENT_INSTRUCTIONS.md
- 01_PROJECT_CONTEXT.md

---

## 1. Health Check Endpoint

Build this first. Every monitoring tool needs something to ping.

File: `app/api/health/route.ts`

```typescript
import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const start = Date.now()

  try {
    const supabase = createClient()
    await supabase
      .from('caregivers')
      .select('count')
      .limit(1)

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      responseTime: `${Date.now() - start}ms`
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Database connection failed'
    }, { status: 500 })
  }
}
```

Test it: `curl http://localhost:3000/api/health`

---

## 2. Sentry Error Tracking

```bash
# Install
pnpm add @sentry/nextjs

# Run wizard (creates sentry.config files automatically)
npx @sentry/wizard@latest -i nextjs
```

After wizard runs, add to `.env.local`:
```
NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
SENTRY_ORG=your_org
SENTRY_PROJECT=reliantcare
```

Verify in `sentry.client.config.ts`:
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,         // 10% of transactions
  replaysOnErrorSampleRate: 1.0, // 100% on errors
  replaysSessionSampleRate: 0.1, // 10% general
  environment: process.env.NODE_ENV,
})
```

---

## 3. Environment Variables Verification

Add this script to `scripts/check-env.js`:

```javascript
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'NEXT_PUBLIC_APP_URL',
]

const missing = required.filter(key => !process.env[key])

if (missing.length > 0) {
  console.error('Missing required environment variables:')
  missing.forEach(key => console.error(`  - ${key}`))
  process.exit(1)
} else {
  console.log('All required environment variables present')
}
```

Add to `package.json`:
```json
"scripts": {
  "check-env": "node scripts/check-env.js",
  "predev": "node scripts/check-env.js",
  "prebuild": "node scripts/check-env.js"
}
```

---

## 4. Posthog Analytics

```bash
pnpm add posthog-js
```

File: `app/providers.tsx`
```typescript
'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      capture_pageview: false // handled manually
    })
  }, [])

  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  )
}
```

Add to `.env.local`:
```
NEXT_PUBLIC_POSTHOG_KEY=your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## 5. Pre-Launch Checklist

Run through this completely before any public launch.
Do not skip items. Do not mark done until verified.

### Environment
- [ ] All env vars rotated from dev to production values
- [ ] Clerk production instance configured (not dev)
- [ ] Supabase production project connected
- [ ] Production database migrations applied
- [ ] RLS policies verified on production database
- [ ] Private storage bucket exists and is private
- [ ] NODE_ENV=production confirmed

### Domain and SSL
- [ ] Custom domain connected in Vercel
- [ ] SSL certificate active (Vercel handles automatically)
- [ ] www redirect configured
- [ ] DNS propagated and verified

### Security
- [ ] No API keys or secrets in codebase
- [ ] .env files in .gitignore
- [ ] Admin routes return 404 for non-admin
- [ ] All API routes have auth checks
- [ ] Rate limiting on auth endpoints (Clerk handles)
- [ ] File upload MIME type validation active
- [ ] UUID filenames enforced on uploads

### Monitoring
- [ ] Sentry wired in and tested — trigger a test error
- [ ] Health endpoint responding at /api/health
- [ ] UptimeRobot monitoring /api/health every 5 minutes
- [ ] Posthog analytics collecting events
- [ ] Vercel Analytics enabled in Vercel dashboard

### Legal (before first real user)
- [ ] Privacy policy live at /privacy
- [ ] Terms of service live at /terms
- [ ] Cookie policy live at /cookies
- [ ] Texas TPPA review completed
- [ ] FCRA compliance confirmed by legal
- [ ] Data retention policy documented
- [ ] Breach notification process documented

### Content
- [ ] All external image URLs replaced with local assets
- [ ] No placeholder text ("Lorem ipsum") anywhere
- [ ] All links tested — no 404s
- [ ] All CTAs link to correct routes
- [ ] robots.txt configured
- [ ] sitemap.xml generated
- [ ] Favicon set (use RCN logo mark)
- [ ] OG meta tags set for social sharing

### Admin Setup
- [ ] Platform admin account created in Clerk
- [ ] MFA enabled on admin account
- [ ] Admin role set in Clerk metadata
- [ ] Test profile submitted and approved end-to-end
- [ ] Test review submitted and scored
- [ ] Audit log capturing admin actions

### Performance
- [ ] Lighthouse score 85+ on all key pages
- [ ] No page over 200kb first load JS
- [ ] All images through next/image
- [ ] No console errors in production build

### Final Smoke Test
- [ ] Caregiver can sign up, build profile, submit
- [ ] Admin can review and approve the profile
- [ ] Approved profile appears searchable (when agency search built)
- [ ] Family can submit care request form

---

## 6. Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview first
vercel

# Review preview URL — test everything

# Deploy to production only when preview passes
vercel --prod
```

Never deploy directly to production without
a preview deploy review first.

---

## Commit

```
feat: health check endpoint
feat: sentry error tracking integration
feat: posthog analytics integration
chore: env var verification script
```

---

*Last updated: March 2026 — ReliantCareNetwork*
