-- ========================================================
-- ISURU GEMS - DATABASE & DATA INTEGRITY REMEDIATION
-- Migration: 20261025_database_audit_remediation.sql
-- Resolves:
--  - DATA-01: Atomic row-locked checkout (validated by process_checkout_order)
--  - DATA-02: Missing relational tables for Categories, Media Assets, and Store Settings
--  - DATA-03: Category column normalization & indexing on gemstones
--  - DATA-04: UUID type, foreign key constraint & indexing for inquiries(gem_id)
--  - DATA-05: Per-row subquery elimination in orders/order_items/inquiries RLS
--  - DATA-06: Database-level aggregated metrics stored procedure (get_vault_metrics)
--  - DATA-08: Order tracking and dispatch columns on public.orders
--  - DATA-09: Individual column GIN trigram indexes for PostgREST ILIKE queries
--  - DATA-10: Soft-deletion support (is_archived) on gemstones to preserve order integrity
-- ========================================================

-- Ensure extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- --------------------------------------------------------
-- 1. DATA-08: Order Shipping & Tracking Persistence Columns
-- --------------------------------------------------------
alter table public.orders
  add column if not exists tracking_carrier text,
  add column if not exists tracking_number text,
  add column if not exists customs_declaration_number text,
  add column if not exists dispatched_at timestamp with time zone;

create index if not exists idx_orders_tracking_number on public.orders (tracking_number) where tracking_number is not null;

-- --------------------------------------------------------
-- 2. DATA-10: Gemstones Soft-Deletion & Timestamp Columns
-- --------------------------------------------------------
alter table public.gemstones
  add column if not exists is_archived boolean default false not null,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

create index if not exists idx_gemstones_is_archived on public.gemstones (is_archived);

-- --------------------------------------------------------
-- 3. DATA-03: Gemstone Category Column & Taxonomy Alignment
-- --------------------------------------------------------
alter table public.gemstones
  add column if not exists category text;

create index if not exists idx_gemstones_category on public.gemstones (category);

-- Backfill existing gemstone category taxonomy
update public.gemstones
set category = 'blue-gems'
where category is null and (
  color ilike '%blue%'
  or variety ilike '%blue%'
  or (variety ilike '%sapphire%' and variety not ilike '%padparadscha%' and variety not ilike '%yellow%' and variety not ilike '%pink%')
);

update public.gemstones
set category = 'pink-purple-gems'
where category is null and (
  variety ilike '%padparadscha%'
  or color ilike '%pink%'
  or color ilike '%purple%'
  or color ilike '%violet%'
);

update public.gemstones
set category = 'rubies-spinel'
where category is null and (
  variety ilike '%ruby%'
  or variety ilike '%spinel%'
  or color ilike '%red%'
  or color ilike '%pigeon%'
);

update public.gemstones
set category = 'yellow-orange-gems'
where category is null and (
  color ilike '%yellow%'
  or color ilike '%golden%'
  or color ilike '%orange%'
  or variety ilike '%pushparaga%'
);

update public.gemstones
set category = 'rare-collector-gems'
where category is null;

-- --------------------------------------------------------
-- 4. DATA-04: Relational Foreign Key & Index on Inquiries (gem_id)
-- --------------------------------------------------------
-- Nullify any non-UUID legacy string representations to prevent cast failures
update public.inquiries
set gem_id = null
where gem_id is not null
  and gem_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

alter table public.inquiries
  alter column gem_id type uuid using (case when gem_id is not null then gem_id::uuid else null end);

alter table public.inquiries drop constraint if exists fk_inquiries_gem;
alter table public.inquiries
  add constraint fk_inquiries_gem foreign key (gem_id) references public.gemstones(id) on delete set null;

create index if not exists idx_inquiries_gem_id on public.inquiries (gem_id);

-- --------------------------------------------------------
-- 5. DATA-05: High-Performance JWT RLS Policies (Eliminating auth.users Subqueries)
-- --------------------------------------------------------

-- 5a. public.orders
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders
  for select
  using (
    auth.uid() = user_id
    or email = (auth.jwt() ->> 'email')
    or auth.jwt() ->> 'role' = 'service_role'
    or is_active_staff()
  );

-- 5b. public.order_items
drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items"
  on public.order_items
  for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and (
        o.user_id = auth.uid()
        or o.email = (auth.jwt() ->> 'email')
        or auth.jwt() ->> 'role' = 'service_role'
        or is_active_staff()
      )
    )
  );

-- 5c. public.inquiries
drop policy if exists "Users can view own inquiries" on public.inquiries;
create policy "Users can view own inquiries"
  on public.inquiries
  for select
  using (
    auth.jwt() ->> 'role' = 'service_role'
    or is_active_staff()
    or (auth.uid() is not null and email = (auth.jwt() ->> 'email'))
  );

-- --------------------------------------------------------
-- 6. DATA-02: Missing Relational Tables for Admin Modules
-- --------------------------------------------------------

-- 6a. Categories Table
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  subtitle text,
  tagline text,
  description text,
  image text not null,
  variety_query text,
  product_count integer default 0,
  featured boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_categories_slug on public.categories (slug);
create index if not exists idx_categories_sort_order on public.categories (sort_order);

alter table public.categories enable row level security;

drop policy if exists "Public read access for categories" on public.categories;
create policy "Public read access for categories"
  on public.categories
  for select
  using (true);

drop policy if exists "Staff and service_role can manage categories" on public.categories;
create policy "Staff and service_role can manage categories"
  on public.categories
  for all
  using (
    auth.jwt() ->> 'role' = 'service_role'
    or is_active_staff()
  );

-- 6b. Media Assets Table
create table if not exists public.media_assets (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  url text not null,
  type text default 'gem_photo' not null,
  size text,
  dimensions text,
  format text,
  associated_gem_slug text,
  tag text default 'General',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_media_assets_created_at on public.media_assets (created_at desc);
create index if not exists idx_media_assets_gem_slug on public.media_assets (associated_gem_slug);

alter table public.media_assets enable row level security;

drop policy if exists "Public read access for media_assets" on public.media_assets;
create policy "Public read access for media_assets"
  on public.media_assets
  for select
  using (true);

drop policy if exists "Staff and service_role can manage media_assets" on public.media_assets;
create policy "Staff and service_role can manage media_assets"
  on public.media_assets
  for all
  using (
    auth.jwt() ->> 'role' = 'service_role'
    or is_active_staff()
  );

-- 6c. Store Settings Table
create table if not exists public.store_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.store_settings enable row level security;

drop policy if exists "Public read access for store_settings" on public.store_settings;
create policy "Public read access for store_settings"
  on public.store_settings
  for select
  using (true);

drop policy if exists "Staff and service_role can manage store_settings" on public.store_settings;
create policy "Staff and service_role can manage store_settings"
  on public.store_settings
  for all
  using (
    auth.jwt() ->> 'role' = 'service_role'
    or is_active_staff()
  );

-- --------------------------------------------------------
-- Seed Initial Records for Admin Modules
-- --------------------------------------------------------

-- Seed Categories
insert into public.categories (slug, name, subtitle, tagline, description, image, variety_query, product_count, featured, sort_order)
values
  ('blue-sapphires', 'Ceylon Blue Sapphires', 'Royal Blue & Cornflower Blue', 'The Sovereign Gem of Serendib', 'Celebrated for their velvety, open-color saturation that remains luminous in candlelight and daylight alike.', '/isuru_images/categories1.webp', 'Blue', 4, true, 1),
  ('ceylon-rubies', 'Natural Ceylon Rubies', 'Pigeon Blood & Scarlet Fluorescence', 'The Glowing King of Precious Gems', 'Renowned for their luminous pigeon blood luminescence and natural scarlet fluorescence under sunlight.', '/isuru_images/ruby%20category.webp', 'Ruby', 2, true, 2),
  ('padparadscha', 'Padparadscha Sapphires', 'Sacred Lotus Blossom Sunset Hues', 'The World''s Rarest Corundum', 'Named after the Sinhalese term for aquatic lotus blossom. A tender balance of soft morning rose pink and evening twilight orange.', '/isuru_images/Padparadscha%20Sapphire.webp', 'Padparadscha', 2, true, 3),
  ('alexandrite', 'Chrysoberyl Alexandrite', 'Day-to-Night Optical Miracle', 'Emerald by Day, Ruby by Night', 'Displays an extraordinary transition from vibrant teal green in daylight to rich raspberry red under warm light.', '/isuru_images/Alexandrite%20category.webp', 'Alexandrite', 1, true, 4),
  ('yellow-sapphires', 'Ceylon Yellow Sapphires', 'Golden Amber & Imperial Honey Corundum (Pushparaga)', 'Auspicious Brilliance from Balangoda', 'Revered for centuries across Vedic traditions as Pushparaga. Displaying dazzling brilliance and fiery golden undertones.', '/isuru_images/yellow.webp', 'Yellow', 2, true, 5),
  ('rare-collector', 'Rare Collector Crystals', 'Asterism Star Sapphires, Rough Crystals & Minerals', 'Museum & Investment Grade Crystals', 'Singular mineralogical phenomena including six-ray asterism crystals, untreated rough stones, and high-dome cabochons.', '/isuru_images/categories3.webp', 'Star', 3, true, 6),
  ('ceylon-spinel', 'Ceylon Natural Spinel', 'Flame Red & Cobalt Fire', 'High Refractive Index Splendor', 'Naturally untreated singly-refractive gemstones showcasing pure unheated fiery dispersion.', '/isuru_images/Red%20Ceylon%20Spinel.webp', 'Spinel', 1, true, 7)
on conflict (slug) do update set
  name = excluded.name,
  subtitle = excluded.subtitle,
  tagline = excluded.tagline,
  description = excluded.description,
  image = excluded.image,
  variety_query = excluded.variety_query,
  sort_order = excluded.sort_order;

-- Seed Initial Store Settings
insert into public.store_settings (key, value)
values (
  'main_settings',
  jsonb_build_object(
    'storeName', 'Isuru Gems Ceylon',
    'tagline', 'Generational Ceylon Gemological Heritage & Mine-to-Market Royal Sapphires',
    'ngjaLicense', 'NGJA/EXP/2026/04882',
    'ratnapuraVaultAddress', '42 Main Street, Demuwawatha, Ratnapura, Sabaragamuwa Province, Sri Lanka',
    'colomboShowroomAddress', 'Level 28, World Trade Center, West Tower, Echelon Square, Colombo 00100, Sri Lanka',
    'primaryEmail', 'vault@isurugems.com',
    'conciergePhone', '+94 77 123 4567',
    'whatsappNumber', '+94 77 123 4567',
    'baseCurrency', 'USD',
    'exchangeRates', jsonb_build_object('USD', 1, 'LKR', 308.5, 'EUR', 0.92, 'GBP', 0.79, 'AED', 3.67, 'SGD', 1.34),
    'autoSyncRates', true,
    'secureCourierPartners', jsonb_build_array('Brinks Global Services', 'Malca-Amit Armoured', 'Ferrari Logistics', 'DHL Express Diplomatic'),
    'defaultEscrowDays', 7,
    'emailNotifications', jsonb_build_object('newOrder', true, 'newEnquiry', true, 'lowInventory', false)
  )
)
on conflict (key) do nothing;

-- --------------------------------------------------------
-- 7. DATA-09: Dedicated Trigram Indexes for PostgREST ILIKE Queries
-- --------------------------------------------------------
create index if not exists idx_gemstones_name_trgm on public.gemstones using gin (name gin_trgm_ops);
create index if not exists idx_gemstones_variety_trgm on public.gemstones using gin (variety gin_trgm_ops);
create index if not exists idx_gemstones_origin_trgm on public.gemstones using gin (origin gin_trgm_ops);

-- --------------------------------------------------------
-- 8. DATA-06: Database Aggregation Stored Procedure for Dashboard Metrics
-- --------------------------------------------------------
create or replace function public.get_vault_metrics()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_gem_metrics record;
  v_order_metrics record;
  v_inquiry_metrics record;
begin
  select
    count(*) as total_gems,
    coalesce(sum(price), 0) as total_val,
    coalesce(sum(carat), 0) as total_cts,
    count(*) filter (where in_stock = true and is_archived = false) as in_stock,
    count(*) filter (where lower(treatment) like '%unheated%' or lower(treatment) like '%none%') as unheated
  into v_gem_metrics
  from public.gemstones
  where is_archived = false;

  select
    coalesce(sum(total_amount), 0) filter (where status <> 'cancelled') as total_revenue,
    count(*) filter (where status = 'pending_verification') as pending_orders,
    count(*) filter (where status in ('dispatched', 'customs_clearance')) as in_transit_orders
  into v_order_metrics
  from public.orders;

  select
    count(*) filter (where status = 'pending') as pending_inquiries
  into v_inquiry_metrics
  from public.inquiries;

  return jsonb_build_object(
    'total_gemstones', v_gem_metrics.total_gems,
    'total_vault_value', v_gem_metrics.total_val,
    'total_carats', v_gem_metrics.total_cts,
    'in_stock_count', v_gem_metrics.in_stock,
    'unheated_count', v_gem_metrics.unheated,
    'total_order_revenue', v_order_metrics.total_revenue,
    'pending_orders', v_order_metrics.pending_orders,
    'in_transit_orders', v_order_metrics.in_transit_orders,
    'pending_enquiries', v_inquiry_metrics.pending_inquiries
  );
end;
$$;
