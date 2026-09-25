-- ==============================================================================
-- OSMIDA COMPLETE PRODUCTION SCHEMA & MIGRATION SCRIPT
-- For: Nellore Apartment Residential Services (Osmida)
-- Supports:
--   1. bookings (Dual OTPs, escrow status, photo verification, ratings)
--   2. service_partners (Aadhaar, skills, payout balance, online status)
--   3. partner_job_assignments (Real-time dispatch, photo proof, lifecycle)
--   4. worker_payouts (Escrow held -> pending -> paid ledger)
--   5. admin_settings (Dynamic hourly rate, worker payout rate, Nellore zones)
--   6. ratings_complaints (Feedback and AI complaint triage)
-- ==============================================================================

-- 1. ADMIN SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default settings
INSERT INTO public.admin_settings (key, value, description)
VALUES
  ('hourly_rate', '199'::jsonb, 'Customer flat hourly rate in INR across all residential tasks'),
  ('worker_payout_rate', '140'::jsonb, 'Worker flat hourly guaranteed payout rate in INR'),
  ('service_area', '["Haranathapuram", "Pogathota", "Magunta Layout", "Vedayapalem", "Dargamitta", "Children''s Park Road", "Saraswathi Nagar", "Ramamurthy Nagar", "Balaji Nagar", "Trunk Road"]'::jsonb, 'Active apartment coverage zones in Nellore')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

-- 2. SERVICE PARTNERS (WORKERS / HELPERS)
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
  status TEXT NOT NULL DEFAULT 'online', -- 'online', 'offline', 'on_job', 'suspended'
  approval_status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'under_review'
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

-- Ensure all columns exist if service_partners was already created
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS auth_pin TEXT NOT NULL DEFAULT '1234';
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS categories TEXT[] NOT NULL DEFAULT '{"cleaning"}';
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{"Bathroom Cleaning", "Kitchen Cleaning", "Dishwashing", "General House Help"}';
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS coverage_localities TEXT[] NOT NULL DEFAULT '{"Pogathota", "Haranathapuram", "Magunta Layout", "Vedayapalem"}';
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS assigned_hub TEXT DEFAULT 'Central';
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'online';
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS rating NUMERIC NOT NULL DEFAULT 5.0;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS completed_jobs_count INT NOT NULL DEFAULT 0;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS payout_balance NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS upi_id TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS bank_account_no TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS bank_ifsc TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS aadhaar_last4 TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS aadhaar_url TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS selfie_url TEXT;

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT NOT NULL,
  whatsapp_number TEXT,
  business_name TEXT,
  facility_type TEXT DEFAULT 'residential',
  selected_service TEXT,
  selected_services TEXT[] DEFAULT '{}',
  duration_hours NUMERIC DEFAULT 1.0,
  hourly_rate NUMERIC DEFAULT 199,
  service_price NUMERIC DEFAULT 199,
  total_amount NUMERIC NOT NULL DEFAULT 199,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'assigned', 'in-progress', 'completed', 'cancelled'
  escrow_status TEXT NOT NULL DEFAULT 'held', -- 'held', 'released', 'refunded'
  payment_status TEXT NOT NULL DEFAULT 'escrow_held', -- 'escrow_held', 'paid', 'refunded'
  otp_start TEXT NOT NULL DEFAULT LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
  otp_end TEXT NOT NULL DEFAULT LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),
  locality TEXT NOT NULL DEFAULT 'Pogathota',
  site_address TEXT,
  address TEXT,
  apartment_name TEXT,
  flat_number TEXT,
  tower_block TEXT,
  inspection_date DATE,
  preferred_date DATE,
  time_slot TEXT,
  booking_type TEXT DEFAULT 'instant', -- 'instant', 'scheduled', 'recurring'
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
  complaint_status TEXT NOT NULL DEFAULT 'none', -- 'none', 'open', 'refunded', 'partial', 'redo', 'dismissed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all enhanced columns exist if bookings already existed
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS selected_services TEXT[] DEFAULT '{}';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS duration_hours NUMERIC DEFAULT 1.0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC DEFAULT 199;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS escrow_status TEXT NOT NULL DEFAULT 'held';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'escrow_held';
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

-- 4. PARTNER JOB ASSIGNMENTS (DISPATCH & FIELD EXECUTION)
CREATE TABLE IF NOT EXISTS public.partner_job_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  partner_id UUID REFERENCES public.service_partners(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'offered', -- 'offered', 'accepted', 'dispatched', 'in_progress', 'completed', 'declined', 'expired'
  service_name TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  locality TEXT,
  payout_amount NUMERIC NOT NULL DEFAULT 140,
  start_otp TEXT NOT NULL,
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

-- Ensure enhanced columns exist in partner_job_assignments
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS service_name TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS locality TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS end_otp TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS before_photo_url TEXT;
ALTER TABLE public.partner_job_assignments ADD COLUMN IF NOT EXISTS after_photo_url TEXT;

-- 5. WORKER PAYOUTS LEDGER
CREATE TABLE IF NOT EXISTS public.worker_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID,
  reference_id TEXT NOT NULL,
  partner_id UUID REFERENCES public.service_partners(id) ON DELETE SET NULL,
  partner_name TEXT NOT NULL,
  partner_upi TEXT,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'escrow_held', -- 'escrow_held', 'pending', 'paid'
  transaction_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);

-- 6. RATINGS & COMPLAINTS TABLE
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

-- 7. SEED INITIAL VERIFIED NELLORE PARTNERS
INSERT INTO public.service_partners (name, phone, whatsapp_number, auth_pin, categories, skills, coverage_localities, assigned_hub, status, rating, upi_id, aadhaar_last4)
VALUES
  ('Sujatha Reddy', '9490122849', '9490122849', '1234', '{"cleaning"}', '{"Bathroom Cleaning", "Kitchen Cleaning", "Dishwashing", "General House Help"}', '{"Pogathota", "Haranathapuram", "Magunta Layout", "Vedayapalem"}', 'Central', 'online', 4.9, 'sujatha@okaxis', '8891'),
  ('Ravi Teja', '9848099887', '9848099887', '1234', '{"cleaning"}', '{"Bathroom Cleaning", "Kitchen Cleaning", "Dishwashing"}', '{"Magunta Layout", "Pogathota"}', 'Central', 'online', 4.8, 'raviteja@oksbi', '4589'),
  ('Kavitha Devi', '9848022338', '9848022338', '1234', '{"cleaning"}', '{"Dishwashing", "General House Help"}', '{"Vedayapalem", "Dargamitta"}', 'South', 'online', 5.0, 'kavitha@okaxis', '9921')
ON CONFLICT (phone) DO NOTHING;

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON public.bookings(reference_id);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_partners_phone ON public.service_partners(phone);
CREATE INDEX IF NOT EXISTS idx_partners_status ON public.service_partners(status);
CREATE INDEX IF NOT EXISTS idx_pja_ref ON public.partner_job_assignments(reference_id);
CREATE INDEX IF NOT EXISTS idx_pja_status ON public.partner_job_assignments(status);
CREATE INDEX IF NOT EXISTS idx_payouts_ref ON public.worker_payouts(reference_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.worker_payouts(status);

-- 9. ROW LEVEL SECURITY (RLS) & GRANTS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_job_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings_complaints ENABLE ROW LEVEL SECURITY;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Service role bypass policies
CREATE POLICY "service_role_all_admin_settings" ON public.admin_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_partners" ON public.service_partners FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_bookings" ON public.bookings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_pja" ON public.partner_job_assignments FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_payouts" ON public.worker_payouts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_ratings" ON public.ratings_complaints FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Anon / Public policies
CREATE POLICY "anon_select_admin_settings" ON public.admin_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_all_bookings" ON public.bookings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_partners" ON public.service_partners FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_pja" ON public.partner_job_assignments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_payouts" ON public.worker_payouts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_ratings" ON public.ratings_complaints FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
