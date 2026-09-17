alter table public.inspections
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists inspection_date date,
  add column if not exists site_address text,
  add column if not exists contact_person text,
  add column if not exists service_urgency text,
  add column if not exists floor_area text,
  add column if not exists notes text,
  add column if not exists main_pest_issue text,
  add column if not exists pest_premises_type text,
  add column if not exists approximate_size text,
  add column if not exists pest_details jsonb,
  add column if not exists kitchen_details jsonb,
  add column if not exists washroom_details jsonb,
  add column if not exists contact_consent boolean not null default false,
  add column if not exists status text not null default 'new';

create index if not exists inspections_status_idx on public.inspections (status);
create index if not exists inspections_created_at_idx on public.inspections (created_at desc);