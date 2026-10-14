-- ========================================================
-- ISURU GEMS - STAFF & ACCESS CONTROL MIGRATION
-- Enables Admin governance, staff member roles, credential
-- management, and permission matrix for Ceylon Gemstone Vault.
-- ========================================================

-- Create staff_members table
create table if not exists public.staff_members (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  auth_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text unique not null,
  role text not null check (role in ('super_admin', 'vault_custodian', 'gemologist', 'concierge_agent', 'inventory_clerk')),
  department text not null,
  phone text,
  status text default 'active' not null check (status in ('active', 'inactive', 'suspended')),
  can_manage_gems boolean default true not null,
  can_manage_orders boolean default true not null,
  can_manage_staff boolean default false not null,
  can_export_data boolean default false not null,
  last_login timestamp with time zone,
  notes text
);

-- Indexes for lightning-fast queries
create index if not exists idx_staff_email on public.staff_members (email);
create index if not exists idx_staff_role on public.staff_members (role);
create index if not exists idx_staff_status on public.staff_members (status);
create index if not exists idx_staff_auth_user on public.staff_members (auth_user_id);

-- Enable Row Level Security (RLS)
alter table public.staff_members enable row level security;

-- Helper function to check if the current user can manage staff (SECURITY DEFINER avoids RLS recursion)
create or replace function public.is_staff_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.staff_members
    where auth_user_id = auth.uid()
    and status = 'active'
    and can_manage_staff = true
  );
$$;

-- Policy: Only service role or authorized staff can view/manage staff directory
drop policy if exists "Admins can view and manage staff" on public.staff_members;
create policy "Admins can view and manage staff"
  on public.staff_members
  for all
  using (
    auth.jwt() ->> 'role' = 'service_role'
    or auth.uid() = auth_user_id
    or is_staff_admin()
  );

-- Seed initial executive staff records
insert into public.staff_members (
  id,
  full_name,
  email,
  role,
  department,
  phone,
  status,
  can_manage_gems,
  can_manage_orders,
  can_manage_staff,
  can_export_data,
  notes
) values
(
  '9011a001-1111-4000-8000-000000000001',
  'Yohan Gunawardena',
  'yohan@isurugems.com',
  'super_admin',
  'Executive & Board of Gemologists',
  '+94 77 123 4567',
  'active',
  true,
  true,
  true,
  true,
  'Chief Gemologist and NGJA license signatory.'
),
(
  '9011a002-2222-4000-8000-000000000002',
  'Chamara Senanayake',
  'chamara.s@isurugems.com',
  'vault_custodian',
  'Ratnapura Vault Logistics',
  '+94 71 889 2211',
  'active',
  true,
  true,
  false,
  true,
  'In charge of physical vault custody, armored courier handovers, and sealing procedures.'
),
(
  '9011a003-3333-4000-8000-000000000003',
  'Dilini Ratnayake',
  'dilini.r@isurugems.com',
  'gemologist',
  'Laboratory & NGJA Certification',
  '+94 76 345 9988',
  'active',
  true,
  false,
  false,
  false,
  'Spectroscopy, microscopic inclusions analysis, and laboratory report verifications.'
),
(
  '9011a004-4444-4000-8000-000000000004',
  'Priyantha Perera',
  'priyantha.p@isurugems.com',
  'concierge_agent',
  'Private Client Concierge & B2B',
  '+94 70 554 3322',
  'active',
  false,
  true,
  false,
  false,
  'High-net-worth client appointments, bespoke inquiries, and escrow coordination.'
)
on conflict (email) do nothing;
