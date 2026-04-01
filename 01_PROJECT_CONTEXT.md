# 01_PROJECT_CONTEXT.md
# Full product context. Read this every session.
# ReliantCareNetwork — Session Context

---

## What's Built

| Page / Feature | Status | File |
|---------------|--------|------|
| Landing page (locked) | Done | app/page.js |
| Landing redesign | Done | app/landing-care-optimized/page.js |
| For Caregivers marketing | Done | app/for-caregivers/page.js |
| Navbar | Done | components/Navbar.js |
| Profile builder wizard | Built — has bugs | app/(caregiver)/profile/build/page.js |
| Profile view page | Built — needs fixes | app/(caregiver)/profile/[id]/page.js |
| For Agencies | Needs full rebuild | app/for-agencies/page.js |
| For Families | Not built | app/for-families/page.js |
| Care request intake | Not built | app/care-request/page.js |
| Caregiver dashboard | Not built | app/(caregiver)/dashboard/page.js |
| Admin dashboard | Not built | app/admin/* |
| Agency search | Not built | app/(agency)/search/page.js |

---

## Database

### Migration 1 — Applied
File: supabase/migrations/20260319000001_caregiver_schema.sql

Tables:
- caregivers
- caregiver_security
- caregiver_documents
- caregiver_certifications
- caregiver_references
- admin_audit_log

### Migration 2 — NEEDED, not written yet
File: supabase/migrations/20260320000001_caregiver_schema_v2.sql

Missing columns on caregivers table:
- credentials TEXT[]
- latitude NUMERIC
- longitude NUMERIC
- availability_status TEXT
- available_from_date DATE
- notice_period TEXT
- placement_types TEXT[]
- client_preference TEXT
- hourly_rate_min NUMERIC
- hourly_rate_max NUMERIC

Missing columns on caregiver_references table:
- reference_token UUID
- token_expires_at TIMESTAMPTZ
- consent_given BOOLEAN
- consent_given_at TIMESTAMPTZ
- email_sent_at TIMESTAMPTZ
- reminder_sent_at TIMESTAMPTZ
- form_completed_at TIMESTAMPTZ
- q1_duration TEXT through q8_concerns TEXT
- did_not_consent BOOLEAN
- did_not_consent_at TIMESTAMPTZ

Private bucket: caregiver-documents-private
UUID filenames only. Signed URLs 15 min expiry.

---

## Profile Builder — 7 Steps

Step 0: Resume upload — NOT YET BUILT
Step 1: Identity basics — built
Step 2: Services + specialties + credentials — needs rebuild
Step 3: Availability and logistics — needs rebuild
Step 4: Certifications — needs rebuild
Step 4B: Background and security — built
Step 5: References — needs rebuild
Step 6: Review and submit — built

Known bugs:
- B03: Clicking Background opens References (index offset)
- B04: Review shown as sidebar step — should be a button
- B05: Sidebar steps not clickable to jump back

---

## Caregiver Journey

1. /for-caregivers — Done
2. Clerk auth — Clerk handles
3. /profile/build — Built, needs fixes
4. /profile/[id] — Built, needs fixes
5. /dashboard — Not built
6. /admin/caregivers — Not built

---

## Auth Roles

caregiver | agency | agency_admin | supervisor | platform_admin

Role enforcement — all three layers required:
1. middleware.ts — route level
2. Server action / API — server side
3. UI — show/hide only, never sole enforcement

MFA required for platform_admin.

---

## Security Clearance

Self-reported + document upload. Checkr post-MVP.
caregiver_security table — admin only — agencies never see it.
Agencies only see: "DPS check verified" OR "Pending review".

---

## Verified Stats — Use Only These

- 75% annual caregiver turnover (Activated Insights 2025)
- 4 in 5 leave within first 100 days (HCAOA 2024)
- 9.7M care jobs to fill by 2034 (PHI 2025)

---

## Git Commits to Date

```
a881178 globals design tokens
80af02e navbar design system
e145d76 nav 5 correct links
2d1e3f3 mobile drawer fix
cb6297b landing page complete
f732213 for-caregivers marketing page
dba06d4 caregiver database schema
69ad597 profile builder wizard
1bc4a8e caregiver live profile page
66dd0ab prompt files + CLAUDE.md update
```

---

## Build Priority Order

1. Schema v2 migration — blocks everything else
2. Profile builder nav fixes (B03, B04, B05)
3. Profile builder step rebuilds (2, 3, 4, 5)
4. For-agencies page rebuild
5. Admin dashboard + verification queue
6. For-families page + care-request intake
7. Agency search + shortlist
8. Trust scoring engine
9. Caregiver dashboard

---

## Legal — Required Before Launch

- Caregiver ID card terms
- Rating consent language
- FCRA compliance
- Privacy policy
- Texas TPPA compliance
- PIPEDA (Canada)
- QR scan tracking privacy policy
- Texas attorney review

---

*Last updated: March 2026 — ReliantCareNetwork*
*Every decision here was made deliberately. Trust it over assumptions.*
