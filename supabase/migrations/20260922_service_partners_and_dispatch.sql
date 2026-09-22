-- ==============================================================================
-- OSMIDA SERVICE PARTNERS & QUICK-COMMERCE DISPATCH SCHEMA
-- ==============================================================================

-- 1. SERVICE PARTNERS (WORKERS / TECHNICIANS)
CREATE TABLE IF NOT EXISTS public.service_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  whatsapp_number TEXT NOT NULL,
  auth_pin TEXT NOT NULL DEFAULT '1234', -- 4-digit simple login PIN
  categories TEXT[] NOT NULL DEFAULT '{"ac"}', -- 'ac', 'pest', 'cleaning'
  skills TEXT[] DEFAULT '{}',
  coverage_localities TEXT[] NOT NULL DEFAULT '{"Pogathota"}',
  assigned_hub TEXT DEFAULT 'Central', -- 'Central', 'East', 'South', 'North'
  status TEXT NOT NULL DEFAULT 'offline', -- 'online', 'offline', 'on_job', 'suspended'
  rating NUMERIC NOT NULL DEFAULT 5.0,
  completed_jobs_count INT NOT NULL DEFAULT 0,
  payout_balance NUMERIC NOT NULL DEFAULT 0,
  upi_id TEXT,
  aadhaar_last4 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PARTNER JOB ASSIGNMENTS (DISPATCH & EXECUTION LIFECYCLE)
CREATE TABLE IF NOT EXISTS public.partner_job_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  partner_id UUID NOT NULL REFERENCES public.service_partners(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'offered', -- 'offered', 'accepted', 'dispatched', 'in_progress', 'completed', 'declined', 'expired'
  service_name TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  locality TEXT,
  payout_amount NUMERIC NOT NULL DEFAULT 0,
  offered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  start_otp TEXT NOT NULL DEFAULT LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  before_photo_url TEXT,
  after_photo_url TEXT,
  collected_amount NUMERIC,
  payment_method TEXT DEFAULT 'cash', -- 'cash', 'upi', 'prepaid'
  customer_rating INT CHECK (customer_rating BETWEEN 1 AND 5),
  customer_feedback TEXT,
  partner_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. INDEXES FOR LIGHTNING FAST DISPATCH QUERY
CREATE INDEX IF NOT EXISTS idx_partners_status ON public.service_partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_phone ON public.service_partners(phone);
CREATE INDEX IF NOT EXISTS idx_partners_hub ON public.service_partners(assigned_hub);
CREATE INDEX IF NOT EXISTS idx_assignments_partner ON public.partner_job_assignments(partner_id);
CREATE INDEX IF NOT EXISTS idx_assignments_ref ON public.partner_job_assignments(reference_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.partner_job_assignments(status);

-- 4. RLS & PERMISSIONS
ALTER TABLE public.service_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_job_assignments ENABLE ROW LEVEL SECURITY;

GRANT ALL PRIVILEGES ON public.service_partners TO service_role;
GRANT ALL PRIVILEGES ON public.partner_job_assignments TO service_role;

GRANT SELECT, UPDATE ON public.service_partners TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.partner_job_assignments TO anon, authenticated;

CREATE POLICY "service_role_all_partners" ON public.service_partners FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_assignments" ON public.partner_job_assignments FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "anon_select_partners" ON public.service_partners FOR SELECT TO anon USING (true);
CREATE POLICY "anon_select_assignments" ON public.partner_job_assignments FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_assignments" ON public.partner_job_assignments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_assignments" ON public.partner_job_assignments FOR UPDATE TO anon USING (true);
