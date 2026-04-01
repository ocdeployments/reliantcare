# 06_BUILD_ADMIN_DASHBOARD.md
# Build the admin verification dashboard.
# ReliantCareNetwork — Admin Dashboard

---

## Pre-flight

Read before writing any code:
- 00_AGENT_INSTRUCTIONS.md
- 01_PROJECT_CONTEXT.md
- 02_DESIGN_SYSTEM.md

Schema v2 must be applied first (03_BUILD_SCHEMA_V2.md).

---

## What to Build

```
app/admin/page.tsx              — dashboard overview
app/admin/caregivers/page.tsx   — caregiver review queue
app/admin/caregivers/[id]/page.tsx — individual profile review
```

Rules:
- Admin routes return 404 for non-admin users — never 403
- Never link admin routes publicly anywhere
- MFA required for platform_admin role (Clerk handles this)
- All admin actions logged to admin_audit_log table

---

## Access Control

Every admin page and API must check role at three levels:

```typescript
// 1. middleware.ts handles route protection (already exists — don't touch)

// 2. Server component check
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const { userId, sessionClaims } = auth()
  if (!userId || sessionClaims?.metadata?.role !== 'platform_admin') {
    notFound() // return 404 not 403
  }
  // render admin UI
}

// 3. API route check
export async function POST(req: Request) {
  const { userId, sessionClaims } = auth()
  if (!userId || sessionClaims?.metadata?.role !== 'platform_admin') {
    return new Response('Not found', { status: 404 })
  }
  // handle request
}
```

---

## Dashboard Overview — app/admin/page.tsx

Header: "Admin Dashboard" — never linked publicly

Four stat cards:
1. Profiles pending review (count)
2. Profiles approved this week (count)
3. Profiles rejected this week (count)
4. Disputes open (count)

Quick links:
- Review queue → /admin/caregivers
- Disputes → /admin/disputes
- Audit log → /admin/audit

---

## Caregiver Review Queue — app/admin/caregivers/page.tsx

Table columns:
- Name
- Submitted date
- Completion % (from profile completeness score)
- Status (pending / under_review / approved / rejected)
- Action button → opens /admin/caregivers/[id]

Filters:
- Status filter (all / pending / under_review / approved / rejected)
- Date range
- Search by name

Pagination: 20 per page

Status badge colours:
- pending: amber
- under_review: blue
- approved: green
- rejected: red

---

## Individual Profile Review — app/admin/caregivers/[id]/page.tsx

Layout: two columns
Left: profile summary
Right: action panel

### Left — Profile Summary

Show all caregiver data:
- Photo + name + headline
- Contact details (email, phone)
- Location + service radius
- Bio
- Services selected (chips)
- Specialties (chips)
- Credentials (chips)
- Availability status
- Certifications (each with document download link)
- References (each with contact details)
- Background check declaration

### Right — Action Panel

Current status (badge)

Completion score bar (gold gradient)

Review checklist:
- [ ] Identity verified
- [ ] Photo appropriate
- [ ] Bio reviewed
- [ ] Certifications reviewed
- [ ] References checked
- [ ] Background declaration confirmed
- [ ] No duplicate profile detected

Action buttons:

Approve:
```jsx
<button onClick={() => handleApprove(id)}
  className="w-full py-3 rounded-xl font-bold text-[#0D1B3E]"
  style={{ background: 'linear-gradient(135deg, #C9973A, #E8B86D)' }}>
  Approve profile
</button>
```

Request changes:
```jsx
<button onClick={() => setShowChangesModal(true)}
  className="w-full py-3 rounded-xl font-bold text-[#1E3A8A]
    border border-[#1E3A8A]">
  Request changes
</button>
```

Reject:
```jsx
<button onClick={() => setShowRejectModal(true)}
  className="w-full py-3 rounded-xl font-bold text-red-600
    border border-red-200">
  Reject profile
</button>
```

Admin note (internal only — never shown to caregiver):
Textarea, max 500 chars

---

## Server Actions

```typescript
// app/admin/caregivers/actions.ts

'use server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { caregivers, adminAuditLog } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function approveCaregiver(caregiverId: string) {
  const { userId, sessionClaims } = auth()
  if (sessionClaims?.metadata?.role !== 'platform_admin') {
    throw new Error('Unauthorised')
  }

  await db.update(caregivers)
    .set({
      status: 'approved',
      updatedAt: new Date()
    })
    .where(eq(caregivers.id, caregiverId))

  await db.insert(adminAuditLog).values({
    adminUserId: userId,
    action: 'approve_caregiver',
    targetId: caregiverId,
    createdAt: new Date()
  })
}

export async function rejectCaregiver(
  caregiverId: string,
  reason: string
) {
  const { userId, sessionClaims } = auth()
  if (sessionClaims?.metadata?.role !== 'platform_admin') {
    throw new Error('Unauthorised')
  }

  await db.update(caregivers)
    .set({
      status: 'rejected',
      updatedAt: new Date()
    })
    .where(eq(caregivers.id, caregiverId))

  await db.insert(adminAuditLog).values({
    adminUserId: userId,
    action: 'reject_caregiver',
    targetId: caregiverId,
    notes: reason,
    createdAt: new Date()
  })
}
```

---

## Profile Status Flow

```
draft → submitted → under_review → approved
                              ↓
                           rejected
                              ↓
                    (caregiver fixes) → submitted
```

Only approved profiles are searchable.
Suspended profiles are immediately removed from search.

---

## Commit Sequence

```
feat: admin dashboard — overview page with stats
feat: admin caregiver queue — review list with filters
feat: admin caregiver review — individual profile approval
feat: admin server actions — approve, reject, audit log
```

---

*Last updated: March 2026 — ReliantCareNetwork*
