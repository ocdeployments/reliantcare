# ReliantCare — Caregiver Portal Spec

> Phase 1 build spec. For agents and developers.

---

## What We're Building

The caregiver profile builder — the core of the platform. Where caregivers create their verified, portable reputation.

---

## Screens

### Screen 1: Sign Up / Login
- Phone number or email
- OTP verification (phone or email)
- One-time: basic info collection
- Social login: Google (nice to have, not MVP)

### Screen 2: Onboarding Flow (5 steps, 10 minutes total)

**Step 1: Who are you?**
- First name
- Last name
- City / Region (Ontario cities dropdown)
- Care type: Companion | Personal Care | Medical | All
- Short bio (280 chars — optional)

**Step 2: Your credentials**
- Credential type (multi-select):
  - PSW Certification
  - RN / RPN
  - CPR/AED
  - First Aid
  - TB Test
  - Vulnerable Sector Check
  - N95 Fit Test
  - Flu Shot
  - Driver's License
  - Vehicle (for home care)
- Upload document: photo or PDF
- Expiry date (if applicable)
- Status: "Pending verification" badge

**Step 3: Your experience**
- Years of experience (slider or number)
- Care types you've worked with:
  - Dementia / Alzheimer's
  - Post-surgical
  - Palliative
  - Stroke recovery
  - Chronic illness
  - Companionship
  - Pediatric
  - Mental health
- Types of clients: Seniors | Adults | Children | All
- Availability:
  - Morning / Afternoon / Evening / Night
  - Weekdays / Weekends
  - Live-in / Hourly

**Step 4: Work history (self-reported for now)**
- Agency name
- City
- Start date / End date (or "Current")
- Role
- Reason for leaving
- Optional: shift count estimate

**Step 5: Review and publish**
- Preview of public profile
- Edit any section
- "Build my profile" → Submit

### Screen 3: Caregiver Dashboard (Home)

**When logged in, caregiver sees:**

```
┌─────────────────────────────────────┐
│  Your Profile         [Share Link ↗] │
│  ┌─────────────────────────────────┐ │
│  │ Reliability Score: 4.7 / 5.0   │ │
│  │ ████████████░░░░░░ 94%          │ │
│  │ Based on 87 confirmed shifts     │ │
│  └─────────────────────────────────┘ │
│                                      │
│  Your Stats          This Month      │
│  Completed shifts:    12              │
│  Agencies:           2               │
│  Profile views:       3               │
│                                      │
│  ─────────────────────────────────   │
│                                      │
│  Recent Activity                      │
│  • SE Health confirmed 4 shifts     │
│  • New rating from CBI Health        │
│  • Profile viewed by 1 agency        │
│                                      │
│  ─────────────────────────────────   │
│                                      │
│  [Edit Profile]   [Share Profile]    │
└─────────────────────────────────────┘
```

### Screen 4: Public Profile (What agencies/families see)

**URL:** reliantcarenetwork.com/p/[caregiver-username]

```
┌─────────────────────────────────────┐
│  Maria T. · PSW · Ottawa           │
│  ⭐ 4.7 reliability · Verified ✓    │
│                                      │
│  ┌─ Bio ────────────────────────┐    │
│  │ 7 years experience.         │    │
│  │ Specialize in dementia and  │    │
│  │ post-surgical care.          │    │
│  └───────────────────────────────┘    │
│                                      │
│  ✓ PSW Certification                 │
│  ✓ CPR/AED                           │
│  ✓ TB Test (valid until 2027)        │
│  ✓ Vulnerable Sector                │
│                                      │
│  Shift History                       │
│  SE Health — 3 years — 4.8 score   │
│  Bayshore — 2 years — 4.5 score     │
│                                      │
│  Specializations                     │
│  Dementia · Post-surgical · Palliative│
│                                      │
│  Availability                        │
│  Mornings · Weekdays · Hourly       │
│                                      │
│  [Message Maria]                     │
└─────────────────────────────────────┘
```

### Screen 5: Ratings Received

**Caregiver can see:**
- Every rating from every agency
- Every rating from families
- Their written response to each rating
- The reply button on each rating

### Screen 6: Credential Vault

**Caregiver sees all uploaded credentials:**
- Credential type + document preview
- Expiry date + alert status
- Verified by: [agency name] or "Self-reported"
- "Add credential" button

---

## Data Model

### caregivers
```sql
id              UUID PRIMARY KEY
email           TEXT UNIQUE NOT NULL
phone           TEXT
first_name      TEXT
last_name       TEXT
city            TEXT
region          TEXT  -- Ontario
care_type       TEXT[]  -- ['companion', 'personal', 'medical']
bio             TEXT
years_exp       INTEGER
availability    JSONB  -- {morning: true, afternoon: false, ...}
public_slug     TEXT UNIQUE  -- for profile URL
reliability_score NUMERIC(3,2) DEFAULT 0
total_shifts    INTEGER DEFAULT 0
profile_views   INTEGER DEFAULT 0
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### credentials
```sql
id              UUID PRIMARY KEY
caregiver_id    UUID REFERENCES caregivers
type            TEXT  -- 'psw_cert', 'cpr', 'tb_test', etc.
document_url    TEXT
expiry_date     DATE
verified_by     UUID REFERENCES agencies
verified_at     TIMESTAMPTZ
status          TEXT  -- 'pending', 'verified', 'expired'
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### work_history
```sql
id              UUID PRIMARY KEY
caregiver_id    UUID REFERENCES caregivers
agency_name     TEXT
city            TEXT
start_date      DATE
end_date        DATE
role            TEXT
reason_left     TEXT
verified        BOOLEAN DEFAULT FALSE
verified_by     UUID REFERENCES agencies
```

### shifts
```sql
id              UUID PRIMARY KEY
caregiver_id    UUID REFERENCES caregivers
agency_id       UUID REFERENCES agencies
shift_date      DATE
status          TEXT  -- 'completed', 'no_show', 'cancelled'
family_id       UUID REFERENCES families
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### ratings
```sql
id              UUID PRIMARY KEY
caregiver_id    UUID REFERENCES caregivers
from_id         UUID  -- agency_id or family_id
from_type       TEXT  -- 'agency' or 'family'
shift_id       UUID REFERENCES shifts
reliability_score  NUMERIC(2,1)  -- 1-5
care_score      NUMERIC(2,1)  -- 1-5
comment         TEXT
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### caregiver_responses
```sql
id              UUID PRIMARY KEY
rating_id       UUID REFERENCES ratings
caregiver_id    UUID REFERENCES caregivers
response_text   TEXT
created_at      TIMESTAMPTZ DEFAULT NOW()
```

---

## Key UX Decisions

### No score until 5+ confirmed shifts
New caregivers start with "New — building profile" instead of a score. This prevents gaming and keeps scores meaningful.

### Score breakdown visible, not just a number
Agencies see: reliability score (shift completion) + care score + written reviews. Not just a star number.

### Caregiver controls what they share
"Share full profile" vs "Share limited profile" — caregiver can choose which agencies see what.

### Credential expiry alerts
30 days before expiry, caregiver gets notified. Expired credentials shown with a warning badge.

---

## Priority Build Order

1. Auth (email/phone OTP)
2. Profile creation flow (Steps 1-5)
3. Public profile page
4. Dashboard
5. Credential vault
6. Rating display + response
7. Share/profile link

---

## Tech Stack

- React (existing)
- Supabase Auth
- Supabase Database + RLS
- Supabase Storage (for credential documents)
- Vercel (existing)
