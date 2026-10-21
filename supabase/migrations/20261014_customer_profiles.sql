-- ========================================================
-- ISURU GEMS - CUSTOMER PROFILES & CRM MIGRATION
-- Stack: Supabase (Postgres, Auth, Storage, RLS)
-- Enables patron profile storage, automated signup triggers,
-- persistent delivery addresses, loyalty tiers, and admin CRM.
-- ========================================================

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text unique not null,
  phone text,
  shipping_address text,
  city text,
  country text,
  postal_code text,
  tier text default 'private_client' not null check (tier in ('vip_collector', 'premier_connoisseur', 'trade_jeweller', 'private_client')),
  total_spent numeric(12, 2) default 0.00 not null check (total_spent >= 0),
  orders_count integer default 0 not null check (orders_count >= 0),
  first_acquisition_date date,
  last_acquisition_date date,
  preferred_varieties jsonb default '[]'::jsonb not null,
  notes text
);

-- Indexes for performance
create index if not exists idx_profiles_user_id on public.profiles (user_id);
create index if not exists idx_profiles_email on public.profiles (email);
create index if not exists idx_profiles_tier on public.profiles (tier);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Helper function to check if the caller is an active staff member (SECURITY DEFINER avoids RLS recursion)
create or replace function public.is_active_staff()
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
  );
$$;

-- 2. RLS POLICIES FOR PROFILES

-- Policy: Select (Users view own profile; staff or service_role can view all)
drop policy if exists "Users can view own profile or staff can view all" on public.profiles;
create policy "Users can view own profile or staff can view all"
  on public.profiles
  for select
  using (
    auth.uid() = user_id
    or auth.jwt() ->> 'role' = 'service_role'
    or is_active_staff()
  );

-- Policy: Update (Users update own profile; staff can manage CRM profiles)
drop policy if exists "Users can update own profile or staff can manage" on public.profiles;
create policy "Users can update own profile or staff can manage"
  on public.profiles
  for update
  using (
    auth.uid() = user_id
    or auth.jwt() ->> 'role' = 'service_role'
    or is_active_staff()
  );

-- SEC-06: Column-level access control trigger to prevent patron privilege tampering
create or replace function public.prevent_profile_privilege_tampering()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not (auth.jwt() ->> 'role' = 'service_role' or is_active_staff()) then
    if new.tier is distinct from old.tier
       or new.total_spent is distinct from old.total_spent
       or new.orders_count is distinct from old.orders_count then
      raise exception 'Forbidden: Customer cannot modify privileged profile attributes.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_privileges on public.profiles;
create trigger trg_protect_profile_privileges
  before update on public.profiles
  for each row execute function public.prevent_profile_privilege_tampering();

-- Policy: Insert (Allow insertion by auth triggers, service_role, or staff)
drop policy if exists "Allow inserts from trigger or staff" on public.profiles;
create policy "Allow inserts from trigger or staff"
  on public.profiles
  for insert
  with check (
    auth.uid() = user_id
    or auth.jwt() ->> 'role' = 'service_role'
    or is_active_staff()
  );

-- Policy: Delete (Restricted to service_role or staff admins)
drop policy if exists "Staff admin can delete profile" on public.profiles;
create policy "Staff admin can delete profile"
  on public.profiles
  for delete
  using (
    auth.jwt() ->> 'role' = 'service_role'
    or is_active_staff()
  );

-- 3. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.USERS
-- Automatically creates or syncs a public.profiles row whenever a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_profile_id uuid;
begin
  -- Check if profile with this email was already entered into CRM
  select id into existing_profile_id from public.profiles where lower(email) = lower(new.email) limit 1;

  if existing_profile_id is not null then
    -- Link existing CRM record with the newly registered auth account
    update public.profiles
    set
      user_id = new.id,
      full_name = coalesce(public.profiles.full_name, new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      updated_at = timezone('utc'::text, now())
    where id = existing_profile_id;
  else
    -- Create fresh patron profile
    insert into public.profiles (
      id,
      user_id,
      full_name,
      email,
      tier
    ) values (
      new.id,
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      new.email,
      'private_client'
    )
    on conflict (email) do update set
      user_id = excluded.user_id,
      full_name = coalesce(excluded.full_name, public.profiles.full_name),
      updated_at = timezone('utc'::text, now());
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. BACKFILL EXISTING AUTH USERS
insert into public.profiles (id, user_id, full_name, email, tier)
select 
  u.id,
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.email,
  'private_client'
from auth.users u
where u.email is not null
on conflict (email) do update set
  user_id = excluded.user_id;

-- 5. INITIAL EXECUTIVE CRM SEED CLIENTS
insert into public.profiles (
  id,
  full_name,
  email,
  phone,
  country,
  city,
  tier,
  total_spent,
  orders_count,
  first_acquisition_date,
  last_acquisition_date,
  preferred_varieties,
  notes
) values
(
  'c0570001-1111-4000-8000-000000000001',
  'Lord Julian Hastings',
  'julian.hastings@mayfairholdings.co.uk',
  '+44 20 7946 0912',
  'United Kingdom',
  'London',
  'vip_collector',
  63500.00,
  3,
  '2024-03-15',
  '2026-10-11',
  '["Royal Blue Sapphire", "Ceylon Ruby"]'::jsonb,
  'Prefers unheated stones over 4 carats with GRS Swiss reports. High priority concierge contact.'
),
(
  'c0570002-2222-4000-8000-000000000002',
  'Elena Vane-Tempest',
  'elena.vane@genevafamilyoffice.ch',
  '+41 22 555 0198',
  'Switzerland',
  'Geneva',
  'premier_connoisseur',
  48000.00,
  2,
  '2025-01-20',
  '2026-10-10',
  '["Padparadscha Sapphire", "Star Sapphire"]'::jsonb,
  'Represents family trust focusing on rare natural Ceylon specimens for investment vaulting.'
),
(
  'c0570003-3333-4000-8000-000000000003',
  'Kenjiro Takahashi',
  'k.takahashi@ginzagems.tokyo.jp',
  '+81 3 5555 0142',
  'Japan',
  'Tokyo',
  'trade_jeweller',
  85000.00,
  4,
  '2023-11-10',
  '2026-10-08',
  '["Ceylon Ruby", "Cornflower Blue Sapphire"]'::jsonb,
  'High-end Ginza atelier owner. Orders matched calibrated parcel lots and exceptional single stones.'
)
on conflict (email) do nothing;
