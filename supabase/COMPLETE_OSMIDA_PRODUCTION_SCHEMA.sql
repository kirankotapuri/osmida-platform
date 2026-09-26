-- ==============================================================================
-- OSMIDA COMPLETE PRODUCTION SCHEMA - CLEAN REBUILD
-- Step 1: Drops ALL existing Osmida tables, triggers, and functions.
-- Step 2: Creates everything fresh from scratch.
-- Run this entire script in: Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- ==============================================================================
-- TEARDOWN: DROP EVERYTHING CLEANLY (CASCADE handles FK order)
-- ==============================================================================

-- Drop trigger first (before dropping the function it references)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop tables in reverse FK dependency order
DROP TABLE IF EXISTS public.ratings_complaints      CASCADE;
DROP TABLE IF EXISTS public.worker_payouts          CASCADE;
DROP TABLE IF EXISTS public.partner_job_assignments CASCADE;
DROP TABLE IF EXISTS public.bookings                CASCADE;
DROP TABLE IF EXISTS public.service_partners        CASCADE;
DROP TABLE IF EXISTS public.admin_settings          CASCADE;
DROP TABLE IF EXISTS public.customer_profiles       CASCADE;

-- Drop legacy / renamed tables if they exist
DROP TABLE IF EXISTS public.pronto_processed_refs   CASCADE;
DROP TABLE IF EXISTS public.osmida_processed_refs   CASCADE;
DROP TABLE IF EXISTS public.leads                   CASCADE;

-- ==============================================================================
-- REBUILD: FRESH SCHEMA BELOW
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CUSTOMER PROFILES (GOOGLE OAUTH & RESIDENT DIRECTORY)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT,
  name TEXT,
  avatar_url TEXT,
  locality TEXT DEFAULT 'Haranathapuram',
  apartment_name TEXT,
  flat_number TEXT,
  tower_block TEXT,
  address TEXT,
  google_maps_url TEXT,
  auth_provider TEXT DEFAULT 'google',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all columns exist if customer_profiles already existed
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS locality TEXT DEFAULT 'Haranathapuram';
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS apartment_name TEXT;
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS flat_number TEXT;
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS tower_block TEXT;
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'google';
ALTER TABLE public.customer_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- AUTOMATIC TRIGGER: Sync auth.users to public.customer_profiles on Google Login
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customer_profiles (
    id,
    email,
    name,
    avatar_url,
    phone,
    auth_provider
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      ''
    ),
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE(NEW.raw_app_meta_data->>'provider', 'google')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.customer_profiles.name),
    avatar_url = COALESCE(NULLIF(EXCLUDED.avatar_url, ''), public.customer_profiles.avatar_url),
    phone = COALESCE(EXCLUDED.phone, public.customer_profiles.phone),
    auth_provider = EXCLUDED.auth_provider,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if present and re-attach
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill any existing users from auth.users into customer_profiles
INSERT INTO public.customer_profiles (id, email, name, avatar_url, phone, auth_provider)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture', ''),
  COALESCE(phone, raw_user_meta_data->>'phone', NULL),
  COALESCE(raw_app_meta_data->>'provider', 'google')
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = COALESCE(EXCLUDED.name, public.customer_profiles.name),
  avatar_url = COALESCE(NULLIF(EXCLUDED.avatar_url, ''), public.customer_profiles.avatar_url);

-- ------------------------------------------------------------------------------
-- 2. ADMIN SETTINGS TABLE (DYNAMIC PRICING & ZONES)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default pricing (₹199/hr customer, ₹140/hr worker) & Nellore apartment zones
INSERT INTO public.admin_settings (key, value, description)
VALUES
  ('hourly_rate', '199'::jsonb, 'Customer flat hourly rate in INR across all residential tasks'),
  ('worker_payout_rate', '140'::jsonb, 'Worker flat hourly guaranteed payout rate in INR'),
  ('service_area', '["Haranathapuram", "Pogathota", "Magunta Layout", "Vedayapalem", "Dargamitta", "Children''s Park Road", "Saraswathi Nagar", "Ramamurthy Nagar", "Balaji Nagar", "Trunk Road", "Podalakur Road", "BV Nagar", "Ramalingapuram", "Kailasapuram"]'::jsonb, 'Active apartment coverage zones in Nellore')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

-- ------------------------------------------------------------------------------
-- 3. BOOKINGS TABLE (UPGRADED WITH RESIDENTIAL & FIELD VERIFICATION)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT NOT NULL,
  whatsapp_number TEXT,
  business_name TEXT,
  facility_type TEXT DEFAULT 'residential',
  service_type TEXT,
  selected_service TEXT,
  selected_services TEXT[] DEFAULT '{}',
  duration_hours NUMERIC DEFAULT 1.0,
  hourly_rate NUMERIC DEFAULT 199,
  service_price NUMERIC DEFAULT 199,
  total_amount NUMERIC NOT NULL DEFAULT 199,
  advance_amount NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'confirmed',
  escrow_status TEXT NOT NULL DEFAULT 'held',
  payment_status TEXT NOT NULL DEFAULT 'escrow_held',
  payment_method TEXT DEFAULT 'cash',
  otp_start TEXT NOT NULL DEFAULT LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
  otp_end TEXT NOT NULL DEFAULT LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
  locality TEXT NOT NULL DEFAULT 'Haranathapuram',
  site_address TEXT,
  address TEXT,
  apartment_name TEXT,
  flat_number TEXT,
  tower_block TEXT,
  inspection_date DATE,
  preferred_date DATE,
  time_slot TEXT DEFAULT 'TBD',
  booking_type TEXT DEFAULT 'instant',
  notes TEXT,
  cart_items JSONB DEFAULT '{}'::jsonb,
  before_photo_url TEXT,
  after_photo_url TEXT,
  worker_id UUID,
  worker_name TEXT,
  worker_phone TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  complaint_text TEXT,
  complaint_photos JSONB DEFAULT '[]'::jsonb,
  complaint_status TEXT NOT NULL DEFAULT 'none',
  contact_consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add all Osmida residential fields safely if bookings table was previously created
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS selected_services TEXT[] DEFAULT '{}';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS duration_hours NUMERIC DEFAULT 1.0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC DEFAULT 199;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS escrow_status TEXT NOT NULL DEFAULT 'held';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'escrow_held';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cash';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS otp_start TEXT DEFAULT LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS otp_end TEXT DEFAULT LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS apartment_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flat_number TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS tower_block TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS before_photo_url TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS after_photo_url TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS worker_id UUID;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS worker_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS worker_phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS rating INT CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS review TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS complaint_text TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS complaint_photos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS complaint_status TEXT NOT NULL DEFAULT 'none';

-- ------------------------------------------------------------------------------
-- 4. SERVICE PARTNERS (WORKERS / HELPERS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  whatsapp_number TEXT NOT NULL,
  auth_pin TEXT NOT NULL DEFAULT '1234',
  categories TEXT[] NOT NULL DEFAULT '{"cleaning"}',
  skills TEXT[] DEFAULT '{"Bathroom Cleaning", "Kitchen Cleaning", "Dishwashing", "General House Help"}',
  coverage_localities TEXT[] NOT NULL DEFAULT '{"Pogathota", "Haranathapuram", "Magunta Layout", "Vedayapalem"}',
  assigned_hub TEXT DEFAULT 'Central',
  status TEXT NOT NULL DEFAULT 'online',
  approval_status TEXT NOT NULL DEFAULT 'active',
  rating NUMERIC NOT NULL DEFAULT 5.0,
  completed_jobs_count INT NOT NULL DEFAULT 0,
  payout_balance NUMERIC NOT NULL DEFAULT 0,
  upi_id TEXT,
  bank_account_no TEXT,
  bank_ifsc TEXT,
  aadhaar_last4 TEXT,
  aadhaar_url TEXT,
  selfie_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all enhanced fields exist
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS bank_account_no TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS bank_ifsc TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS aadhaar_url TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS selfie_url TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'active';

-- Seed verified initial Nellore partners
INSERT INTO public.service_partners (name, phone, whatsapp_number, auth_pin, categories, skills, coverage_localities, assigned_hub, status, rating, upi_id, aadhaar_last4)
VALUES
  ('Sujatha Reddy', '9490122849', '9490122849', '1234', '{"cleaning"}', '{"Bathroom Cleaning", "Kitchen Cleaning", "Dishwashing", "General House Help"}', '{"Pogathota", "Haranathapuram", "Magunta Layout", "Vedayapalem"}', 'Central', 'online', 4.9, 'sujatha@okaxis', '8891'),
  ('Ravi Teja', '9848099887', '9848099887', '1234', '{"cleaning"}', '{"Bathroom Cleaning", "Kitchen Cleaning", "Dishwashing"}', '{"Magunta Layout", "Pogathota"}', 'Central', 'online', 4.8, 'raviteja@oksbi', '4589'),
  ('Kavitha Devi', '9848022338', '9848022338', '1234', '{"cleaning"}', '{"Dishwashing", "General House Help"}', '{"Vedayapalem", "Dargamitta"}', 'South', 'online', 5.0, 'kavitha@okaxis', '9921')
ON CONFLICT (phone) DO UPDATE SET
  skills = EXCLUDED.skills,
  coverage_localities = EXCLUDED.coverage_localities,
  status = 'online';

-- ------------------------------------------------------------------------------
-- 5. PARTNER JOB ASSIGNMENTS (DISPATCH & FIELD EXECUTION)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partner_job_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  partner_id UUID REFERENCES public.service_partners(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'offered',
  service_name TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  locality TEXT,
  payout_amount NUMERIC NOT NULL DEFAULT 140,
  start_otp TEXT NOT NULL DEFAULT LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
  end_otp TEXT,
  offered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  before_photo_url TEXT,
  after_photo_url TEXT,
  collected_amount NUMERIC,
  payment_method TEXT DEFAULT 'cash',
  customer_rating INT CHECK (customer_rating BETWEEN 1 AND 5),
  customer_feedback TEXT,
  partner_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all assignment columns exist
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS service_name TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS locality TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS end_otp TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS before_photo_url TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS after_photo_url TEXT;

-- ------------------------------------------------------------------------------
-- 6. WORKER PAYOUTS LEDGER
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.worker_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  reference_id TEXT NOT NULL,
  partner_id UUID REFERENCES public.service_partners(id) ON DELETE SET NULL,
  partner_name TEXT NOT NULL,
  partner_upi TEXT,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'escrow_held',
  transaction_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 7. RATINGS & COMPLAINTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ratings_complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  reference_id TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  partner_id UUID REFERENCES public.service_partners(id) ON DELETE SET NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  complaint_text TEXT,
  complaint_photos JSONB DEFAULT '[]'::jsonb,
  ai_classification TEXT,
  resolution_action TEXT DEFAULT 'none',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 8. INDEXES FOR LIGHTNING FAST QUERIES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_customer_profiles_email ON public.customer_profiles(email);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_phone ON public.customer_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON public.bookings(reference_id);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_partners_phone ON public.service_partners(phone);
CREATE INDEX IF NOT EXISTS idx_partners_status ON public.service_partners(status);
CREATE INDEX IF NOT EXISTS idx_pja_ref ON public.partner_job_assignments(reference_id);
CREATE INDEX IF NOT EXISTS idx_pja_status ON public.partner_job_assignments(status);
CREATE INDEX IF NOT EXISTS idx_payouts_ref ON public.worker_payouts(reference_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.worker_payouts(status);

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) & GRANTS
-- ------------------------------------------------------------------------------
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_job_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings_complaints ENABLE ROW LEVEL SECURITY;

-- Grant permissions to Supabase roles
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Service role bypass policies
DROP POLICY IF EXISTS "service_role_customer_profiles" ON public.customer_profiles;
CREATE POLICY "service_role_customer_profiles" ON public.customer_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_admin_settings" ON public.admin_settings;
CREATE POLICY "service_role_admin_settings" ON public.admin_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_service_partners" ON public.service_partners;
CREATE POLICY "service_role_service_partners" ON public.service_partners FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_bookings" ON public.bookings;
CREATE POLICY "service_role_bookings" ON public.bookings FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_pja" ON public.partner_job_assignments;
CREATE POLICY "service_role_pja" ON public.partner_job_assignments FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_payouts" ON public.worker_payouts;
CREATE POLICY "service_role_payouts" ON public.worker_payouts FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_ratings" ON public.ratings_complaints;
CREATE POLICY "service_role_ratings" ON public.ratings_complaints FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Public / Authenticated user policies
DROP POLICY IF EXISTS "public_customer_profiles" ON public.customer_profiles;
CREATE POLICY "public_customer_profiles" ON public.customer_profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_admin_settings" ON public.admin_settings;
CREATE POLICY "public_admin_settings" ON public.admin_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_bookings" ON public.bookings;
CREATE POLICY "public_bookings" ON public.bookings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_service_partners" ON public.service_partners;
CREATE POLICY "public_service_partners" ON public.service_partners FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_pja" ON public.partner_job_assignments;
CREATE POLICY "public_pja" ON public.partner_job_assignments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_payouts" ON public.worker_payouts;
CREATE POLICY "public_payouts" ON public.worker_payouts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_ratings" ON public.ratings_complaints;
CREATE POLICY "public_ratings" ON public.ratings_complaints FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
