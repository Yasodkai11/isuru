-- ========================================================
-- ISURU GEMS - DATA INTEGRITY, ORDER ITEMS & CONCURRENCY FIX
-- Stack: Supabase (Postgres, Auth, Storage, RLS)
-- Solves:
--  1. Missing relational order_items table
--  2. Inquiries message overwrite data loss
--  3. Account portal RLS blockers on orders and inquiries
--  4. Checkout race conditions & overselling via atomic stored procedure
-- ========================================================

-- 1. Create dedicated order_items table
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id text not null references public.orders(id) on delete cascade,
  gem_id uuid not null references public.gemstones(id) on delete restrict,
  gem_name text not null,
  variety text not null,
  carat numeric(5, 2) not null check (carat > 0),
  price numeric(12, 2) not null check (price >= 0),
  currency text default 'USD' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_order_items_gem_id on public.order_items (gem_id);

alter table public.order_items enable row level security;

-- 2. Add reply notes columns to inquiries to prevent overwriting original customer message
alter table public.inquiries 
  add column if not exists reply_notes text,
  add column if not exists replied_at timestamp with time zone;

-- 3. Fix Orders RLS (Allows users to view orders linked to their user_id OR their verified email)
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders
  for select
  using (
    auth.uid() = user_id
    or email = (select email from auth.users where id = auth.uid())
    or auth.jwt() ->> 'role' = 'service_role'
    or is_active_staff()
  );

-- 4. Order Items RLS Policy
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
        or o.email = (select email from auth.users where id = auth.uid())
        or auth.jwt() ->> 'role' = 'service_role'
        or is_active_staff()
      )
    )
  );

-- 5. Fix Inquiries RLS Policy (Allows customers to view inquiries submitted under their email)
drop policy if exists "Admins can view inquiries" on public.inquiries;
drop policy if exists "Users can view own inquiries" on public.inquiries;
create policy "Users can view own inquiries"
  on public.inquiries
  for select
  using (
    auth.jwt() ->> 'role' = 'service_role'
    or is_active_staff()
    or (auth.uid() is not null and email = (select email from auth.users where id = auth.uid()))
  );

-- 6. Atomic Stored Procedure: Prevent overselling race conditions
create or replace function public.process_checkout_order(
  p_order_id text,
  p_user_id uuid,
  p_customer_name text,
  p_email text,
  p_phone text,
  p_shipping_address text,
  p_city text,
  p_country text,
  p_notes text,
  p_gem_ids uuid[]
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_gem record;
  v_total numeric(12, 2) := 0;
  v_available_count int;
begin
  -- Row-level lock: Lock requested gemstones to prevent concurrent checkout
  select count(*) into v_available_count
  from public.gemstones
  where id = any(p_gem_ids)
  and in_stock = true
  for update;

  if v_available_count <> array_length(p_gem_ids, 1) then
    raise exception 'One or more selected gemstones are no longer available in the vault.';
  end if;

  -- Authoritatively calculate order total from locked rows
  select coalesce(sum(price), 0) into v_total
  from public.gemstones
  where id = any(p_gem_ids);

  -- Insert order header
  insert into public.orders (
    id, user_id, customer_name, email, phone,
    shipping_address, city, country, total_amount,
    currency, status, notes
  ) values (
    p_order_id, p_user_id, p_customer_name, p_email, p_phone,
    p_shipping_address, p_city, p_country, v_total,
    'USD', 'pending_verification', p_notes
  );

  -- Insert line items and set inventory status to sold (in_stock = false)
  for v_gem in
    select id, name, variety, carat, price, currency
    from public.gemstones
    where id = any(p_gem_ids)
  loop
    insert into public.order_items (
      order_id, gem_id, gem_name, variety, carat, price, currency
    ) values (
      p_order_id, v_gem.id, v_gem.name, v_gem.variety, v_gem.carat, v_gem.price, v_gem.currency
    );

    update public.gemstones
    set in_stock = false
    where id = v_gem.id;
  end loop;

  return jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'total_amount', v_total
  );
end;
$$;
