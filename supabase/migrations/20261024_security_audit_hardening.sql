-- ========================================================
-- ISURU GEMS - SECURITY AUDIT HARDENING MIGRATION
-- Fixes:
--  - SEC-05: Revoke public INSERT policy on orders; restrict to service_role / security definer
--  - SEC-06: Column-level access control trigger to prevent customer privilege tampering
-- ========================================================

-- 1. SEC-05: Harden Orders Table Insert Policy
-- Revoke arbitrary public insert policy; allow inserts strictly from service_role
-- Note: Stored procedures created with SECURITY DEFINER execute with database owner privileges
drop policy if exists "Anyone can create order" on public.orders;
drop policy if exists "Service role or checkout function can create order" on public.orders;

create policy "Service role or checkout function can create order"
  on public.orders
  for insert
  with check (auth.jwt() ->> 'role' = 'service_role');

-- 2. SEC-06: Prevent Profile Privilege & Tier Tampering
-- Ensure patrons cannot modify privileged columns: tier, total_spent, orders_count
create or replace function public.prevent_profile_privilege_tampering()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Allow service_role or active staff to update any column
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
