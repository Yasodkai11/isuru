-- ========================================================
-- ISURU GEMS - CEYLON GEMSTONE E-COMMERCE DATABASE SCHEMA
-- Stack: Supabase (Postgres, Auth, Storage, RLS)
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. GEMSTONES TABLE
create table if not exists public.gemstones (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  slug text unique not null,
  name text not null,
  variety text not null,
  carat numeric(5, 2) not null check (carat > 0),
  origin text not null,
  cut text not null,
  dimensions text not null,
  color text not null,
  treatment text not null,
  clarity text not null,
  price numeric(12, 2) not null check (price >= 0),
  currency text default 'USD' not null,
  in_stock boolean default true not null,
  featured boolean default false not null,
  description text not null,
  certificate_lab text not null,
  certificate_number text not null,
  certificate_pdf_url text,
  images jsonb default '[]'::jsonb not null
);

-- Index for fast search and catalog filtering
create index if not exists idx_gemstones_slug on public.gemstones (slug);
create index if not exists idx_gemstones_variety on public.gemstones (variety);
create index if not exists idx_gemstones_origin on public.gemstones (origin);
create index if not exists idx_gemstones_price on public.gemstones (price);
create index if not exists idx_gemstones_featured on public.gemstones (featured);

-- 2. ORDERS TABLE
create table if not exists public.orders (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  email text not null,
  phone text not null,
  shipping_address text not null,
  city text not null,
  country text not null,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  currency text default 'USD' not null,
  status text default 'pending_verification' not null,
  notes text
);

create index if not exists idx_orders_user on public.orders (user_id);
create index if not exists idx_orders_status on public.orders (status);

-- 3. INQUIRIES TABLE
create table if not exists public.inquiries (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  gem_id text,
  gem_name text,
  full_name text not null,
  email text not null,
  phone text,
  country text not null,
  message text not null,
  preferred_currency text default 'USD' not null,
  status text default 'pending' not null
);

create index if not exists idx_inquiries_email on public.inquiries (email);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS on all tables
alter table public.gemstones enable row level security;
alter table public.orders enable row level security;
alter table public.inquiries enable row level security;

-- Gemstones: Anyone can read available catalog
create policy "Public can view gemstones"
  on public.gemstones
  for select
  using (true);

-- Gemstones: Only service role / admin can mutate
create policy "Admins can manage gemstones"
  on public.gemstones
  for all
  using (auth.jwt() ->> 'role' = 'service_role');

-- Orders: Users can view their own orders
create policy "Users can view own orders"
  on public.orders
  for select
  using (auth.uid() = user_id);

-- Orders: Public / client can insert an order during checkout
create policy "Anyone can create order"
  on public.orders
  for insert
  with check (true);

-- Inquiries: Anyone can submit an inquiry
create policy "Anyone can submit inquiry"
  on public.inquiries
  for insert
  with check (true);

-- Inquiries: Only service role / staff can view inquiries
create policy "Admins can view inquiries"
  on public.inquiries
  for select
  using (auth.jwt() ->> 'role' = 'service_role');
