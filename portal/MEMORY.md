# ReliantCare Portal — MEMORY

> Last updated: 2026-04-01 17:23

## Portal Live
- **URL:** https://portal-rho-dusky.vercel.app (alias → portal-nf190goy9)
- **GitHub:** github.com/ocdeployments/reliantcare (portal in /portal/)
- **Vercel Project:** prj_cgYn7Aya8D4ImVt5jsJEIwRfxogB
- **Vercel Token:** stored in workspace config

## Env Vars (in Vercel)
- NEXT_PUBLIC_SUPABASE_URL = https://ykvjdeqvxifxccdafxoq.supabase.co ✅
- NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhb... ✅ (full in Vercel)
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_c21pbGlu... ✅ (full in Vercel)
- CLERK_SECRET_KEY = sk_test_iI1KttW1R... ✅ (full in Vercel)

## Supabase
- Project: ykvjdeqvxifxccdafxoq
- Region: Canada (caf)

## Clerk
- Project: smiling-monarch-32
- Mode: test

## Next Steps
1. Apply schema migration 03_BUILD_SCHEMA_V2.md to Supabase
2. Configure Clerk redirect URLs (app.reliantcarenetwork.com)
3. Add custom domain app.reliantcarenetwork.com in Vercel
4. Build caregiver profile wizard (04_BUILD_PROFILE_BUILDER_FIXES.md)
5. Build agencies page (05_BUILD_FOR_AGENCIES_PAGE.md)
