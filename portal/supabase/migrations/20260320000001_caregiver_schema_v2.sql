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
