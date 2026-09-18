-- ==============================================================================
-- OSMIDA CLEAN REBUILD SCHEMA (V3 - Web App + n8n Multi-Stage Automation)
-- Compatible with:
--   1. n8n Workflow 1: Lead Ingestion Webhook (osmida-lead-ingest)
--   2. n8n Workflow 2: Schedule Inspection Form Trigger
--   3. n8n Workflow 3: Create Quote & Quote Decision (Won -> Bookings)
--   4. n8n Workflow 4: Job Status Update Form Trigger (WhatsApp status)
--   5. Osmida Web App: Multi-Service Cart Drawer, UC Flow, & Booking Wizards
-- ==============================================================================

-- 1. DROP EXISTING TABLES IN REVERSE DEPENDENCY ORDER
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.quotes CASCADE;
DROP TABLE IF EXISTS public.inspections CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.osmida_processed_refs CASCADE;
DROP TABLE IF EXISTS public.osmida_message_status CASCADE;
DROP TABLE IF EXISTS public.data_deletion_requests CASCADE;

-- 2. DEDUPLICATION / IDEMPOTENCY TABLE
-- Used by n8n Workflow 1 to avoid processing duplicate webhook submissions
CREATE TABLE public.osmida_processed_refs (
  reference_id TEXT PRIMARY KEY,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. LEADS TABLE (STAGE 1: Inbound Web / Audit Submissions)
-- Populated by n8n Workflow 1 & Web App API Route (/api/book-inspection)
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT NOT NULL UNIQUE,
  customer_name TEXT,
  contact_person TEXT,
  business_name TEXT NOT NULL,
  phone TEXT,
  whatsapp_number TEXT NOT NULL,
  facility_type TEXT NOT NULL DEFAULT 'residential',
  selected_service TEXT NOT NULL,
  service_price NUMERIC,
  preferred_date TEXT,
  inspection_date DATE,
  time_slot TEXT,
  service_urgency TEXT,
  address TEXT,
  site_address TEXT NOT NULL,
  locality TEXT NOT NULL,
  floor_area TEXT,
  notes TEXT,
  main_pest_issue TEXT,
  pest_premises_type TEXT,
  approximate_size TEXT,
  pest_details JSONB DEFAULT '{}'::jsonb,
  kitchen_details JSONB DEFAULT '{}'::jsonb,
  washroom_details JSONB DEFAULT '{}'::jsonb,
  ac_details JSONB DEFAULT '{}'::jsonb,
  cleaning_details JSONB DEFAULT '{}'::jsonb,
  cart_items JSONB DEFAULT '[]'::jsonb,
  total_amount NUMERIC,
  advance_amount NUMERIC DEFAULT 0,
  booking_type TEXT DEFAULT 'inspection',
  category TEXT,
  payment_status TEXT DEFAULT 'pending',
  contact_consent BOOLEAN NOT NULL DEFAULT false,
  is_free_audit BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. INSPECTIONS TABLE (STAGE 2: Scheduled Technical Inspections)
-- Created when Coordinator schedules inspection via n8n Workflow 2
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT NOT NULL UNIQUE,
  facility_type TEXT NOT NULL DEFAULT 'residential',
  selected_service TEXT NOT NULL,
  locality TEXT NOT NULL,
  site_address TEXT NOT NULL,
  inspection_date DATE,
  time_slot TEXT,
  service_urgency TEXT,
  business_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  floor_area TEXT,
  notes TEXT,
  main_pest_issue TEXT,
  pest_premises_type TEXT,
  approximate_size TEXT,
  pest_details JSONB DEFAULT '{}'::jsonb,
  kitchen_details JSONB DEFAULT '{}'::jsonb,
  washroom_details JSONB DEFAULT '{}'::jsonb,
  ac_details JSONB DEFAULT '{}'::jsonb,
  cleaning_details JSONB DEFAULT '{}'::jsonb,
  cart_items JSONB DEFAULT '[]'::jsonb,
  total_amount NUMERIC,
  advance_amount NUMERIC DEFAULT 0,
  booking_type TEXT DEFAULT 'inspection',
  category TEXT,
  payment_status TEXT DEFAULT 'pending',
  contact_consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. QUOTES TABLE (STAGE 3: Commercial Quotations & Proposals)
-- Created and managed by Admin via n8n Workflow 3
CREATE TABLE public.quotes (
  id BIGSERIAL PRIMARY KEY,
  quote_no TEXT UNIQUE,
  reference_id TEXT NOT NULL,
  business_name TEXT,
  contact_person TEXT,
  whatsapp_number TEXT,
  service_type TEXT,
  line_items TEXT,
  amount INTEGER,
  advance_percent INTEGER DEFAULT 50,
  advance_amount INTEGER,
  validity_days INTEGER DEFAULT 15,
  terms TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. BOOKINGS TABLE (STAGE 4: Confirmed Jobs & Field Execution)
-- Created when Quote is marked 'Won' in n8n Workflow 3, and updated in n8n Workflow 4
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT NOT NULL UNIQUE,
  customer_name TEXT,
  contact_person TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  business_name TEXT,
  facility_type TEXT DEFAULT 'residential',
  service_type TEXT,
  selected_service TEXT,
  service_price NUMERIC DEFAULT 0,
  preferred_date DATE,
  inspection_date DATE,
  time_slot TEXT DEFAULT 'TBD',
  address TEXT,
  site_address TEXT,
  locality TEXT,
  floor_area TEXT,
  notes TEXT,
  service_urgency TEXT,
  main_pest_issue TEXT,
  pest_premises_type TEXT,
  approximate_size TEXT,
  pest_details JSONB DEFAULT '{}'::jsonb,
  kitchen_details JSONB DEFAULT '{}'::jsonb,
  washroom_details JSONB DEFAULT '{}'::jsonb,
  ac_details JSONB DEFAULT '{}'::jsonb,
  cleaning_details JSONB DEFAULT '{}'::jsonb,
  cart_items JSONB DEFAULT '[]'::jsonb,
  total_amount NUMERIC,
  advance_amount NUMERIC DEFAULT 0,
  booking_type TEXT DEFAULT 'inspection',
  category TEXT,
  payment_status TEXT DEFAULT 'pending',
  contact_consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. DATA DELETION REQUESTS (Privacy & Meta Compliance)
CREATE TABLE public.data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT,
  business_name TEXT,
  contact_person TEXT,
  whatsapp_number TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- 8. OSMIDA MESSAGE STATUS (WhatsApp Delivery Audit)
CREATE TABLE public.osmida_message_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT,
  phone TEXT,
  message_id TEXT,
  status TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. AUTOMATIC updated_at TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_inspections_updated_at
BEFORE UPDATE ON public.inspections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 10. HIGH PERFORMANCE INDEXES
CREATE INDEX idx_leads_ref ON public.leads(reference_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created ON public.leads(created_at DESC);
CREATE INDEX idx_leads_phone ON public.leads(whatsapp_number);

CREATE INDEX idx_inspections_ref ON public.inspections(reference_id);
CREATE INDEX idx_inspections_status ON public.inspections(status);
CREATE INDEX idx_inspections_created ON public.inspections(created_at DESC);

CREATE INDEX idx_quotes_ref ON public.quotes(reference_id);
CREATE INDEX idx_quotes_no ON public.quotes(quote_no);
CREATE INDEX idx_quotes_status ON public.quotes(status);

CREATE INDEX idx_bookings_ref ON public.bookings(reference_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_created ON public.bookings(created_at DESC);

CREATE INDEX idx_processed_refs ON public.osmida_processed_refs(reference_id);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.osmida_processed_refs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.osmida_message_status ENABLE ROW LEVEL SECURITY;

-- Grants for Supabase Service Role and Authenticated/Anon clients
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO anon;

-- Open policies for service_role (Bypass RLS)
CREATE POLICY "service_role_all_osmida_processed_refs" ON public.osmida_processed_refs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_leads" ON public.leads FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_inspections" ON public.inspections FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_quotes" ON public.quotes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_bookings" ON public.bookings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_deletion" ON public.data_deletion_requests FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_msg_status" ON public.osmida_message_status FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Public / Anon insertion policies for booking wizards
CREATE POLICY "anon_insert_leads" ON public.leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_leads" ON public.leads FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_inspections" ON public.inspections FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_inspections" ON public.inspections FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_deletion" ON public.data_deletion_requests FOR INSERT TO anon WITH CHECK (true);
