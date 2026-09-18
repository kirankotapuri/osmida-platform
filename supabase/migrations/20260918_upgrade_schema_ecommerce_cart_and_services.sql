-- ==============================================================================
-- OSMIDA DATABASE SCHEMA UPGRADE: E-COMMERCE CART, MULTI-SERVICE & COMPLIANCE
-- Date: 2026-09-18
-- Safe, non-destructive migration using IF NOT EXISTS
-- Preserves all existing tables, records, constraints and relationships
-- ==============================================================================

BEGIN;

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. UPGRADE 'inspections' TABLE
-- Adds missing ac_details (resolves AC Shield insert error), cleaning_details,
-- and Urban Company cart e-commerce columns (cart_items, total_amount, etc.)
ALTER TABLE public.inspections
  ADD COLUMN IF NOT EXISTS ac_details jsonb,
  ADD COLUMN IF NOT EXISTS cleaning_details jsonb,
  ADD COLUMN IF NOT EXISTS cart_items jsonb,
  ADD COLUMN IF NOT EXISTS total_amount integer,
  ADD COLUMN IF NOT EXISTS advance_amount integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS booking_type text DEFAULT 'inspection',
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

-- 3. UPGRADE 'leads' TABLE
-- Ensures parity for all customer enquiry pipelines
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS ac_details jsonb,
  ADD COLUMN IF NOT EXISTS cleaning_details jsonb,
  ADD COLUMN IF NOT EXISTS cart_items jsonb,
  ADD COLUMN IF NOT EXISTS total_amount integer,
  ADD COLUMN IF NOT EXISTS advance_amount integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS booking_type text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

-- 4. UPGRADE 'bookings' TABLE
-- Stores confirmed scheduled orders, AC specs, deep cleaning room configs, and cart line items
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS ac_details jsonb,
  ADD COLUMN IF NOT EXISTS cleaning_details jsonb,
  ADD COLUMN IF NOT EXISTS cart_items jsonb,
  ADD COLUMN IF NOT EXISTS total_amount integer,
  ADD COLUMN IF NOT EXISTS advance_amount integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS booking_type text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

-- 5. CREATE 'data_deletion_requests' TABLE (Used by /api/data-deletion for DPDP / Privacy compliance)
CREATE TABLE IF NOT EXISTS public.data_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id text,
  business_name text NOT NULL,
  contact_person text NOT NULL,
  whatsapp_number text NOT NULL,
  email text,
  reason text,
  status text NOT NULL DEFAULT 'requested',
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processed_by text,
  notes text
);

-- 6. AUTOMATIC 'updated_at' TIMESTAMP TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Attach updated_at triggers
DROP TRIGGER IF EXISTS inspections_updated_at_trigger ON public.inspections;
CREATE TRIGGER inspections_updated_at_trigger
  BEFORE UPDATE ON public.inspections
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS leads_updated_at_trigger ON public.leads;
CREATE TRIGGER leads_updated_at_trigger
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS bookings_updated_at_trigger ON public.bookings;
CREATE TRIGGER bookings_updated_at_trigger
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS quotes_updated_at_trigger ON public.quotes;
CREATE TRIGGER quotes_updated_at_trigger
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 7. PERFORMANCE & SEARCH INDEXES
CREATE INDEX IF NOT EXISTS idx_inspections_status ON public.inspections (status);
CREATE INDEX IF NOT EXISTS idx_inspections_created_at ON public.inspections (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inspections_whatsapp ON public.inspections (whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_inspections_locality ON public.inspections (locality);
CREATE INDEX IF NOT EXISTS idx_inspections_booking_type ON public.inspections (booking_type);
CREATE INDEX IF NOT EXISTS idx_inspections_category ON public.inspections (category);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_preferred_date ON public.bookings (preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings (phone);
CREATE INDEX IF NOT EXISTS idx_bookings_category ON public.bookings (category);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON public.leads (whatsapp_number);

CREATE INDEX IF NOT EXISTS idx_data_deletion_status ON public.data_deletion_requests (status);
CREATE INDEX IF NOT EXISTS idx_data_deletion_created_at ON public.data_deletion_requests (created_at DESC);

-- 8. ROW LEVEL SECURITY (RLS) & ACCESS CONTROL
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osmida_processed_refs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osmida_message_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Grant full access to Supabase service_role key (used securely by Next.js API routes)
GRANT ALL ON public.inspections TO service_role;
GRANT ALL ON public.leads TO service_role;
GRANT ALL ON public.bookings TO service_role;
GRANT ALL ON public.osmida_processed_refs TO service_role;
GRANT ALL ON public.osmida_message_status TO service_role;
GRANT ALL ON public.quotes TO service_role;
GRANT ALL ON public.data_deletion_requests TO service_role;

-- Revoke direct anonymous / public reading of customer PII (addresses, phone numbers)
REVOKE SELECT ON public.inspections FROM anon, authenticated;
REVOKE SELECT ON public.leads FROM anon, authenticated;
REVOKE SELECT ON public.bookings FROM anon, authenticated;
REVOKE SELECT ON public.quotes FROM anon, authenticated;
REVOKE SELECT ON public.data_deletion_requests FROM anon, authenticated;

-- Allow public insert policies if client-side fallback is ever used
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inspections' AND policyname = 'Allow public insert for inspections'
  ) THEN
    CREATE POLICY "Allow public insert for inspections" ON public.inspections FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'data_deletion_requests' AND policyname = 'Allow public insert for data deletion'
  ) THEN
    CREATE POLICY "Allow public insert for data deletion" ON public.data_deletion_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
END $$;

COMMIT;
