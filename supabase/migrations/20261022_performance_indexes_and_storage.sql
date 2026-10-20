-- ========================================================
-- ISURU GEMS - PERFORMANCE INDEXES & STORAGE SETUP
-- Stack: Supabase (Postgres, Auth, Storage, RLS)
-- Solves:
--  1. Missing composite and partial catalog indexes
--  2. Inefficient text search (installs pg_trgm and GIN index)
--  3. Storage bucket provisioning & RLS policies
-- ========================================================

-- 1. Enable trigram extension for fuzzy text search
create extension if not exists pg_trgm;

-- 2. Query optimization indexes for gemstones
create index if not exists idx_gemstones_featured_price on public.gemstones (featured desc, price desc);
create index if not exists idx_gemstones_in_stock on public.gemstones (in_stock) where in_stock = true;
create index if not exists idx_gemstones_created_at on public.gemstones (created_at desc);
create index if not exists idx_gemstones_color on public.gemstones (color);

-- GIN trigram index for multi-column search
create index if not exists idx_gemstones_search_trgm on public.gemstones using gin (
  (name || ' ' || variety || ' ' || description || ' ' || origin) gin_trgm_ops
);

-- 3. Query optimization indexes for orders and inquiries
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_email on public.orders (email);
create index if not exists idx_inquiries_created_at on public.inquiries (created_at desc);
create index if not exists idx_inquiries_status on public.inquiries (status);

-- 4. Supabase Storage bucket provisioning & RLS
insert into storage.buckets (id, name, public)
values ('gemstones', 'gemstones', true)
on conflict (id) do nothing;

drop policy if exists "Public can view gemstone media" on storage.objects;
create policy "Public can view gemstone media"
  on storage.objects for select
  using (bucket_id = 'gemstones');

drop policy if exists "Admins can upload gemstone media" on storage.objects;
create policy "Admins can upload gemstone media"
  on storage.objects for insert
  with check (
    bucket_id = 'gemstones'
    and (auth.jwt() ->> 'role' = 'service_role' or is_active_staff())
  );
