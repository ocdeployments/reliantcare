# 03_BUILD_SCHEMA_V2.md
# Build this first. Everything else depends on it.
# ReliantCareNetwork — Database Schema v2 Migration

---

## Pre-flight

Read before writing any code:
- 00_AGENT_INSTRUCTIONS.md
- 01_PROJECT_CONTEXT.md

Run first:
```bash
git status          # must be clean
git log --oneline -3
npx supabase status # local supabase must be running
```

---

## What to Build

One file only:
```
supabase/migrations/20260320000001_caregiver_schema_v2.sql
```

This migration adds missing columns to existing tables.
It must use ALTER TABLE — never DROP or recreate tables.
Apply to staging first. Then production.

---

## The Migration

```sql
-- supabase/migrations/20260320000001_caregiver_schema_v2.sql
-- ReliantCareNetwork Schema v2
-- Adds missing columns to caregivers and caregiver_references

BEGIN;

-- ============================================
-- caregivers table additions
-- ============================================

ALTER TABLE caregivers
  ADD COLUMN IF NOT EXISTS credentials TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS latitude NUMERIC,
  ADD COLUMN IF NOT EXISTS longitude NUMERIC,
  ADD COLUMN IF NOT EXISTS availability_status TEXT
    CHECK (availability_status IN (
      'available_now',
      'open_to_opportunities',
      'available_from',
      'not_available'
    )),
  ADD COLUMN IF NOT EXISTS available_from_date DATE,
  ADD COLUMN IF NOT EXISTS notice_period TEXT
    CHECK (notice_period IN (
      'immediately',
      '1_week',
      '2_weeks',
      '1_month',
      'flexible'
    )),
  ADD COLUMN IF NOT EXISTS placement_types TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS client_preference TEXT
    CHECK (client_preference IN (
      'no_preference',
      'elderly',
      'younger_adults',
      'paediatric',
      'end_of_life',
      'single_client',
      'multiple_clients'
    )),
  ADD COLUMN IF NOT EXISTS hourly_rate_min NUMERIC,
  ADD COLUMN IF NOT EXISTS hourly_rate_max NUMERIC,
  ADD COLUMN IF NOT EXISTS resume_text TEXT;

-- ============================================
-- caregiver_references table additions
-- ============================================

ALTER TABLE caregiver_references
  ADD COLUMN IF NOT EXISTS reference_token UUID DEFAULT uuid_generate_v4(),
  ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_given_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS form_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS q1_duration TEXT,
  ADD COLUMN IF NOT EXISTS q2_capacity TEXT,
  ADD COLUMN IF NOT EXISTS q3_reliability TEXT,
  ADD COLUMN IF NOT EXISTS q4_care_quality TEXT,
  ADD COLUMN IF NOT EXISTS q5_difficult_situations TEXT,
  ADD COLUMN IF NOT EXISTS q6_would_recommend TEXT,
  ADD COLUMN IF NOT EXISTS q7_standout TEXT,
  ADD COLUMN IF NOT EXISTS q8_concerns TEXT,
  ADD COLUMN IF NOT EXISTS did_not_consent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS did_not_consent_at TIMESTAMPTZ;

-- ============================================
-- Indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_caregivers_availability_status
  ON caregivers(availability_status);

CREATE INDEX IF NOT EXISTS idx_caregivers_location
  ON caregivers(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_references_token
  ON caregiver_references(reference_token);

CREATE INDEX IF NOT EXISTS idx_references_expires
  ON caregiver_references(token_expires_at);

-- ============================================
-- Storage bucket for private documents
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('caregiver-documents-private', 'caregiver-documents-private', false)
ON CONFLICT (id) DO NOTHING;

COMMIT;
```

---

## Apply the Migration

```bash
# Apply to local first
npx supabase db push

# Verify it applied correctly
npx supabase db diff

# Check tables in Supabase Studio
# Confirm all columns exist before moving on
```

---

## Verify

After applying, confirm in Supabase Studio:

caregivers table has:
- [ ] credentials (text array)
- [ ] latitude / longitude (numeric)
- [ ] availability_status (text with check constraint)
- [ ] available_from_date (date)
- [ ] notice_period (text with check constraint)
- [ ] placement_types (text array)
- [ ] client_preference (text with check constraint)
- [ ] hourly_rate_min / hourly_rate_max (numeric)
- [ ] resume_text (text)

caregiver_references table has:
- [ ] reference_token (uuid)
- [ ] token_expires_at (timestamptz)
- [ ] consent_given (boolean)
- [ ] q1 through q8 columns (text)
- [ ] did_not_consent (boolean)

Storage:
- [ ] caregiver-documents-private bucket exists and is private

---

## Commit

```bash
git add supabase/migrations/20260320000001_caregiver_schema_v2.sql
git commit -m "feat: schema v2 — missing columns, indexes, private storage bucket"
git tag restore/schema-v2
```

---

## What This Unlocks

Once this migration is applied:
- Profile builder steps 2-5 can save correctly
- Availability data can be stored
- Reference tokens can be generated
- Document uploads have a private bucket to land in

Nothing in the profile builder works properly until this is done.
Do this before any other build task.

---

*Last updated: March 2026 — ReliantCareNetwork*
