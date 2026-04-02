-- supabase/migrations/20260319000001_caregiver_schema.sql
-- ReliantCareNetwork — Base Schema Migration
-- Creates all core tables for the platform

BEGIN;

-- ============================================
-- caregivers (main profile table)
-- ============================================
CREATE TABLE IF NOT EXISTS caregivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL, -- Clerk user ID
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  headline TEXT,
  bio TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  profile_photo_url TEXT,
  years_experience INTEGER DEFAULT 0,
  profile_completeness INTEGER DEFAULT 0 CHECK (profile_completeness >= 0 AND profile_completeness <= 100),
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active','suspended','archived','pending_review')),
  is_verified BOOLEAN DEFAULT false,
  welcome_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- v2 additions
  credentials TEXT[] DEFAULT '{}',
  availability_status TEXT CHECK (availability_status IN ('available_now','open_to_opportunities','available_from','not_available')),
  available_from_date DATE,
  notice_period TEXT CHECK (notice_period IN ('immediately','1_week','2_weeks','1_month','flexible')),
  placement_types TEXT[] DEFAULT '{}',
  client_preference TEXT CHECK (client_preference IN ('no_preference','elderly','younger_adults','paediatric','end_of_life','single_client','multiple_clients')),
  hourly_rate_min NUMERIC,
  hourly_rate_max NUMERIC,
  resume_text TEXT
);

-- ============================================
-- caregiver_references
-- ============================================
CREATE TABLE IF NOT EXISTS caregiver_references (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caregiver_id UUID NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
  reference_name TEXT NOT NULL,
  reference_phone TEXT,
  reference_email TEXT,
  relationship TEXT CHECK (relationship IN ('client','family_member','supervisor','co_worker','other')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  reference_text TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- v2 additions
  reference_token UUID DEFAULT uuid_generate_v4() UNIQUE,
  token_expires_at TIMESTAMPTZ,
  consent_given BOOLEAN DEFAULT false,
  consent_given_at TIMESTAMPTZ,
  email_sent_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,
  form_completed_at TIMESTAMPTZ,
  q1_duration TEXT,
  q2_capacity TEXT,
  q3_reliability TEXT,
  q4_care_quality TEXT,
  q5_difficult_situations TEXT,
  q6_would_recommend TEXT,
  q7_standout TEXT,
  q8_concerns TEXT,
  did_not_consent BOOLEAN DEFAULT false,
  did_not_consent_at TIMESTAMPTZ
);

-- ============================================
-- caregiver_certifications
-- ============================================
CREATE TABLE IF NOT EXISTS caregiver_certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caregiver_id UUID NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  issuing_body TEXT,
  certification_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT false,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- caregiver_documents
-- ============================================
CREATE TABLE IF NOT EXISTS caregiver_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caregiver_id UUID NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  original_filename TEXT,
  storage_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  is_verified BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- caregiver_security (admin-only — agencies never see this)
-- ============================================
CREATE TABLE IF NOT EXISTS caregiver_security (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caregiver_id UUID UNIQUE NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
  dps_check_status TEXT DEFAULT 'pending' CHECK (dps_check_status IN ('pending','in_review','clear','flagged','expired')),
  dps_check_completed_at TIMESTAMPTZ,
  vulnerable_sector_check_status TEXT DEFAULT 'pending',
  vulnerable_sector_completed_at TIMESTAMPTZ,
  background_check_notes TEXT,
  cleared_by_admin_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- admin_audit_log
-- ============================================
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  table_affected TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_caregivers_user_id ON caregivers(user_id);
CREATE INDEX IF NOT EXISTS idx_caregivers_account_status ON caregivers(account_status);
CREATE INDEX IF NOT EXISTS idx_caregivers_is_verified ON caregivers(is_verified);
CREATE INDEX IF NOT EXISTS idx_caregivers_availability_status ON caregivers(availability_status);
CREATE INDEX IF NOT EXISTS idx_caregivers_location ON caregivers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_references_caregiver_id ON caregiver_references(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_references_token ON caregiver_references(reference_token);
CREATE INDEX IF NOT EXISTS idx_references_expires ON caregiver_references(token_expires_at);
CREATE INDEX IF NOT EXISTS idx_certifications_caregiver_id ON caregiver_certifications(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_documents_caregiver_id ON caregiver_documents(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_audit_admin_id ON admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON admin_audit_log(created_at);

-- ============================================
-- Storage bucket (private)
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('caregiver-documents-private', 'caregiver-documents-private', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_security ENABLE ROW LEVEL SECURITY;

-- Caregivers: owner can read/update own row. Agencies read via function only.
CREATE POLICY "Caregivers: owner can read own" ON caregivers FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Caregivers: owner can update own" ON caregivers FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Caregivers: anyone can insert own" ON caregivers FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- References: owner + agencies can read. Only owner can insert.
CREATE POLICY "References: owner can read own" ON caregiver_references FOR SELECT USING (
  caregiver_id IN (SELECT id FROM caregivers WHERE user_id = auth.uid()::text)
);
CREATE POLICY "References: owner can insert own" ON caregiver_references FOR INSERT WITH CHECK (
  caregiver_id IN (SELECT id FROM caregivers WHERE user_id = auth.uid()::text)
);

-- Certifications and documents: owner only
CREATE POLICY "Certifications: owner only" ON caregiver_certifications FOR ALL USING (
  caregiver_id IN (SELECT id FROM caregivers WHERE user_id = auth.uid()::text)
);
CREATE POLICY "Documents: owner only" ON caregiver_documents FOR ALL USING (
  caregiver_id IN (SELECT id FROM caregivers WHERE user_id = auth.uid()::text)
);

-- Security: platform_admin only
CREATE POLICY "Security: admin only" ON caregiver_security FOR ALL USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'platform_admin'
);

COMMIT;
