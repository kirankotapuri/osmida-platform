
begin;

create extension if not exists pgcrypto;

drop table if exists public.bookings cascade;
drop table if exists public.leads cascade;
drop table if exists public.osmida_processed_refs cascade;
drop table if exists public.data_deletion_requests cascade;
drop table if exists public.inspections cascade;

create table public.inspections (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique,
  facility_type text not null,
  selected_service text not null,
  locality text not null,
  site_address text not null,
  inspection_date date,
  time_slot text,
  service_urgency text,
  business_name text not null,
  contact_person text not null,
  whatsapp_number text not null,
  floor_area text,
  notes text,
  main_pest_issue text,
  pest_premises_type text,
  approximate_size text,
  pest_details jsonb,
  kitchen_details jsonb,
  washroom_details jsonb,
  ac_details jsonb,
  contact_consent boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  reference_id text unique,
  customer_name text,
  business_name text,
  phone text,
  whatsapp_number text,
  facility_type text,
  selected_service text,
  service_price text,
  preferred_date text,
  inspection_date date,
  time_slot text,
  service_urgency text,
  address text,
  site_address text,
  locality text,
  floor_area text,
  notes text,
  main_pest_issue text,
  pest_premises_type text,
  approximate_size text,
  pest_details jsonb,
  kitchen_details jsonb,
  washroom_details jsonb,
  ac_details jsonb,
  contact_consent boolean not null default false,
  is_free_audit boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null,
  contact_person text,
  phone text not null,
  whatsapp_number text,
  business_name text,
  facility_type text,
  service_type text not null,
  selected_service text,
  service_price integer,
  preferred_date date,
  inspection_date date,
  time_slot text not null,
  address text,
  site_address text,
  locality text not null,
  floor_area text,
  notes text,
  service_urgency text,
  main_pest_issue text,
  pest_premises_type text,
  approximate_size text,
  pest_details jsonb,
  kitchen_details jsonb,
  washroom_details jsonb,
  ac_details jsonb,
  contact_consent boolean not null default false,
  status text not null default 'pending'
);

create table public.osmida_processed_refs (
  reference_id text primary key,
  processed_at timestamptz not null default now()
);

create table public.data_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  reference_id text,
  business_name text not null,
  contact_person text not null,
  whatsapp_number text not null,
  email text,
  reason text,
  status text not null default 'requested',
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  processed_by text,
  notes text
);

create or replace function public.set_inspections_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger inspections_updated_at_trigger
before update on public.inspections
for each row
execute function public.set_inspections_updated_at();

create trigger leads_updated_at_trigger
before update on public.leads
for each row
execute function public.set_inspections_updated_at();

create trigger bookings_updated_at_trigger
before update on public.bookings
for each row
execute function public.set_inspections_updated_at();

create index inspections_status_idx
  on public.inspections (status);

create index inspections_created_at_idx
  on public.inspections (created_at desc);

create index inspections_selected_service_idx
  on public.inspections (selected_service);

create index leads_status_idx
  on public.leads (status);

create index leads_created_at_idx
  on public.leads (created_at desc);

create index bookings_status_idx
  on public.bookings (status);

create index bookings_preferred_date_idx
  on public.bookings (preferred_date);

create index data_deletion_requests_status_idx
  on public.data_deletion_requests (status);

create index data_deletion_requests_created_at_idx
  on public.data_deletion_requests (created_at desc);

alter table public.inspections enable row level security;
alter table public.leads enable row level security;
alter table public.bookings enable row level security;
alter table public.osmida_processed_refs enable row level security;
alter table public.data_deletion_requests enable row level security;

revoke all on public.inspections from anon, authenticated;
revoke all on public.leads, public.bookings, public.osmida_processed_refs from anon, authenticated;
revoke all on public.data_deletion_requests from anon, authenticated;
revoke all on public.inspections, public.leads, public.bookings, public.osmida_processed_refs, public.data_deletion_requests from public;
grant all on public.inspections to service_role;
grant all on public.leads, public.bookings, public.osmida_processed_refs, public.data_deletion_requests to service_role;

commit;
