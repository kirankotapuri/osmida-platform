-- ==============================================================================
-- OSMIDA PRONTO/SNABBIT PHASE A MIGRATION
-- Supports:
-- 1. admin_settings (dynamic hourly rate, scopes, Nellore zones)
-- 2. Enhanced bookings (selected_services, duration, dual OTPs, escrow status, photo urls, rating, complaints)
-- 3. Enhanced service_partners (Aadhaar, selfie, bank/UPI, approval status)
-- 4. worker_payouts ledger (escrow_held -> pending -> paid)
-- ==============================================================================

-- 1. ADMIN SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default settings if not exists
INSERT INTO public.admin_settings (key, value, description)
VALUES
  ('hourly_rate', '199'::jsonb, 'Customer flat hourly rate across all 4 services in INR'),
  ('worker_payout_rate', '140'::jsonb, 'Worker flat hourly payout rate in INR'),
  ('service_area', '["Haranathapuram", "Pogathota", "Magunta Layout", "Vedayapalem", "Dargamitta", "Children''s Park Road", "Saraswathi Nagar", "Ramamurthy Nagar", "Stonehouse Pet", "Podalakur Road", "BV Nagar", "Ramalingapuram", "Kailasapuram", "Trunk Road"]'::jsonb, 'Active coverage areas in Nellore')
ON CONFLICT (key) DO NOTHING;

-- 2. ENHANCE BOOKINGS TABLE WITH PRONTO FIELDS
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS selected_services TEXT[] DEFAULT '{}';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS duration_hours NUMERIC DEFAULT 1.0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC DEFAULT 199;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS otp_start TEXT DEFAULT LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS otp_end TEXT DEFAULT LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS before_photo_url TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS after_photo_url TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS escrow_status TEXT NOT NULL DEFAULT 'held'; -- 'held', 'released', 'refunded'
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS worker_id UUID;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS worker_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS worker_phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS apartment_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flat_number TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS tower_block TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS rating INT CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS review TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS complaint_text TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS complaint_photos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS complaint_status TEXT NOT NULL DEFAULT 'none'; -- 'none', 'open', 'refunded', 'partial', 'redo', 'dismissed'

-- 3. ENHANCE SERVICE PARTNERS TABLE
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS aadhaar_url TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS selfie_url TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS bank_account_no TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS bank_ifsc TEXT;
ALTER TABLE public.service_partners ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'active'; -- 'active', 'inactive', 'under_review'

-- 4. WORKER PAYOUTS LEDGER TABLE
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

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.worker_payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_partner ON public.worker_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_payouts_ref ON public.worker_payouts(reference_id);

-- RLS & Grants
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_payouts ENABLE ROW LEVEL SECURITY;

GRANT ALL PRIVILEGES ON public.admin_settings TO service_role;
GRANT ALL PRIVILEGES ON public.worker_payouts TO service_role;

GRANT SELECT ON public.admin_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.worker_payouts TO anon, authenticated;

CREATE POLICY "service_role_all_admin_settings" ON public.admin_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "anon_read_admin_settings" ON public.admin_settings FOR SELECT TO anon USING (true);
CREATE POLICY "service_role_all_worker_payouts" ON public.worker_payouts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "anon_worker_payouts" ON public.worker_payouts FOR ALL TO anon USING (true) WITH CHECK (true);
