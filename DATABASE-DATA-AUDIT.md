# Isuru Gems Ceylon — Database Architecture, Data Integrity & Performance Audit

**Database Backend:** Supabase PostgreSQL 15+  
**ORM / Client Layer:** `@supabase/ssr` (v0.12.7), `@supabase/supabase-js` (v2.117.3), PostgREST REST API  
**Frontend Framework:** Next.js 16.4.0 (App Router), React 19.3.0  
**Hosting Infrastructure:** Hostinger Cloud / VPS (LiteSpeed, PM2, Node.js 22 Standalone `server.js`)  
**Audit Date:** October 2026  
**Auditor:** Database Administrator & Performance Engineer  
**Scope:** PostgreSQL migrations (`supabase/migrations/`), database schemas, relational integrity, primary and foreign keys, indexes, stored procedures, RLS query evaluation overhead, server action query efficiency, transaction boundaries, and backup/recovery readiness. No destructive SQL commands were executed and no production data was altered.

---

## Executive Summary

An architectural and performance audit of the database layer supporting **Isuru Gems** was performed. The data model is tasked with managing irreplaceable, high-value colored gemstones (unheated Royal Blue Sapphires, Padparadschas, Rubies, Alexandrite) where single inventory units range from $950 to $28,500+ USD.

The system features sophisticated stored procedure design in migration `20261021_fix_data_integrity_and_orders.sql` (`process_checkout_order`), utilizing PostgreSQL row-level locks (`SELECT ... FOR UPDATE`) to prevent concurrent overselling of single-gem specimens. Trigram indexing (`pg_trgm`) has also been introduced for multi-column text search.

However, several critical data integrity and performance risks exist:
1. **Critical Fallback Breakdown:** If the stored procedure is missing or fails, the application falls back to a non-atomic TypeScript routine that fails to lock rows, fails to insert relational `order_items`, and silently fails to reserve stock due to Row Level Security restrictions.
2. **Missing Persistence Layers:** Entire modules exposed in the administrative console—Categories, Media, SEO records, and Atelier Settings—do not exist in the database and persist only in browser `localStorage`.
3. **Foreign Key & Constraint Gaps:** Inquiries store `gem_id` as unstructured `text` without foreign key enforcement or indexing; gemstones lack soft-delete support, causing foreign key crashes when deleting ordered stones; and tracking metadata entered in the admin orders console is discarded on page refresh due to missing columns in `public.orders`.
4. **N-Row Subquery Overhead:** The RLS policy on `public.orders` executes a per-row subquery against `auth.users` for every record evaluated.
5. **Full Table Scans:** Administrative dashboard overview metrics and dynamic XML sitemap generation retrieve complete table dumps (`SELECT *`) with zero pagination or projection filters.

---

## 1. Database Schema & Migration Mapping

The database schema is defined across five sequential migrations and one seed file:

```
supabase/migrations/
├── 20261012_initial_schema.sql                   # Initial gemstones, orders, inquiries tables & RLS
├── 20261013_staff_management.sql                 # staff_members table, roles & admin helper functions
├── 20261014_customer_profiles.sql                # profiles table, loyalty tiers & auth.users trigger
├── 20261021_fix_data_integrity_and_orders.sql    # order_items table & process_checkout_order stored proc
└── 20261022_performance_indexes_and_storage.sql # pg_trgm extension, composite indexes & storage bucket
supabase/seed.sql                                 # 41 production-grade Ceylon gemstone catalog records
```

### Relational Entity Model

```
                    ┌─────────────────────────┐
                    │       auth.users        │
                    └────────────┬────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           │ 1:1                 │ 1:1                 │ 1:N
           ▼                     ▼                     ▼
┌─────────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│   public.profiles   │ │  staff_members  │ │    public.orders    │
│  (Customer CRM)     │ │  (Vault Team)   │ │  (Acquisitions)     │
└─────────────────────┘ └─────────────────┘ └──────────┬──────────┘
                                                       │ 1:N
                                                       ▼
┌─────────────────────┐                     ┌─────────────────────┐
│  public.inquiries   │                     │ public.order_items  │
│  (Client Requests)  │                     │  (Line Items)       │
└─────────────────────┘                     └──────────┬──────────┘
                                                       │ N:1 (RESTRICT)
                                                       ▼
                                            ┌─────────────────────┐
                                            │  public.gemstones   │
                                            │  (Vault Inventory)  │
                                            └─────────────────────┘
```

---

## 2. Summary of Database Audit Findings

| Finding ID | Title | Severity | Affected Object / Component | Category | Status |
|---|---|---|---|---|---|
| **DATA-01** | Overselling Race Condition & Missing Line Items in Checkout Fallback | **Critical** | `src/actions/checkout.ts`, `orders`, `gemstones` | Concurrency & Integrity | Confirmed Issue |
| **DATA-02** | Absence of Database Tables for Categories, Media, SEO, & Settings | **High** | `src/stores/admin-store.ts`, Database Schema | Schema Completeness | Confirmed Issue |
| **DATA-03** | Schema & Typing Discrepancy on Gemstone Categories | **High** | `src/types/supabase.ts`, `gemstones` table | Schema Normalization | Confirmed Issue |
| **DATA-04** | Unindexed Loose Text Reference on Inquiries (`gem_id`) | **High** | `public.inquiries` table | Referential Integrity | Confirmed Issue |
| **DATA-05** | Per-Row Subquery Overhead in Orders RLS Policy | **High** | `public.orders`, `public.order_items` RLS | Query Performance | Confirmed Issue |
| **DATA-06** | Unbounded In-Memory Table Aggregation in Dashboard Overview & Sitemap | **Medium** | `src/actions/admin-db.ts`, `src/app/sitemap.ts` | Memory & Performance | Confirmed Issue |
| **DATA-07** | Redundant Authentication Round-Trips (N+1 Auth Calls) | **Medium** | `src/actions/admin-db.ts` | Query Efficiency | Confirmed Issue |
| **DATA-08** | Order Shipping Tracking Data Lost Due to Missing Schema Columns | **Medium** | `public.orders`, `admin/orders/page.tsx` | Data Persistence | Confirmed Issue |
| **DATA-09** | Trigram Search Index Mismatch with PostgREST Query Construction | **Medium** | `public.gemstones`, `src/actions/gems.ts` | Index Utilization | Confirmed Issue |
| **DATA-10** | Hard Deletion Violates Foreign Key Restraints on Ordered Gemstones | **Low** | `public.gemstones`, `public.order_items` | Data Lifecycle | Confirmed Issue |
| **DATA-11** | Lack of Automated Database Backup & Point-In-Time Recovery Runbooks | **Low** | Deployment Operations | Disaster Recovery | Potential Risk |

---

## 3. Detailed Database Findings

### Finding DATA-01: Overselling Race Condition & Missing Line Items in Checkout Fallback
- **Severity:** Critical
- **Affected Tables / Files:**
  - `src/actions/checkout.ts` (Lines 80–135)
  - `public.orders`, `public.order_items`, `public.gemstones`
- **Evidence & Verification:**
  In `src/actions/checkout.ts`, the primary checkout execution invokes the stored procedure `process_checkout_order`.
  However, the fallback branch (triggered if the RPC has not been migrated or errors) executes manual client-side queries:
  ```typescript
  // 1. Fetches gemstones without row-level locking
  const { data: availableGems, error: fetchErr } = await supabase
    .from("gemstones")
    .select("id, name, variety, carat, price, currency, in_stock")
    .in("id", itemIds);

  ...
  // 2. Inserts into orders table
  const { error: insertOrderError } = await supabase.from("orders").insert({
    id: orderReference,
    user_id: userId,
    customer_name: fullName,
    ...
    total_amount: calculatedTotal,
  });

  // 3. Attempts to update gemstones stock using ANON client
  await supabase.from("gemstones").update({ in_stock: false }).in("id", itemIds);
  ```
  Verification reveals three catastrophic failures in this fallback path:
  1. **Time-of-Check to Time-of-Use (TOCTOU):** There is no `FOR UPDATE` lock. Two concurrent buyers can check out the same unique gemstone simultaneously.
  2. **RLS Blocks Stock Reservation:** `supabase` is the anonymous client (`createClient()`). The RLS policy on `gemstones` (`Admins can manage gemstones`) restricts updates strictly to `service_role`. The update to `in_stock = false` is rejected by PostgreSQL, leaving the stone active and available for purchase.
  3. **Order Items Dropped:** The fallback routine **never inserts any records into `public.order_items`**. The order exists as an empty header with a dollar total but zero relational item records.
- **Business Impact:**
  Severe commercial liability. A customer wire transfers $20,000 for a unique 4-carat royal blue sapphire, but the gemstone remains listed as available, allowing another customer to acquire it. When administrators inspect the order in the Vault Console, no gemstone line items appear.
- **Recommended Fix:**
  Eliminate the non-atomic fallback path entirely. Enforce that checkout **must** execute via `process_checkout_order`. If the RPC fails, abort the transaction immediately and return an explicit error:
  ```typescript
  if (rpcError) {
    console.error("Critical checkout RPC failure:", rpcError);
    return {
      success: false,
      message: "Unable to lock vault inventory for checkout. Please contact the concierge.",
    };
  }
  ```
- **How to Validate Fix:**
  Temporarily disable the RPC in staging, attempt checkout, and verify that the system securely aborts rather than writing orphaned orders with unreserved gemstones.

---

### Finding DATA-02: Absence of Database Tables for Categories, Media, SEO, & Settings
- **Severity:** High
- **Affected Tables / Files:**
  - `src/stores/admin-store.ts` (Lines 30–38, 90–102)
  - `src/app/admin/categories/page.tsx`
  - `src/app/admin/media/page.tsx`
  - `src/app/admin/seo/page.tsx`
  - `src/app/admin/settings/page.tsx`
- **Evidence & Verification:**
  Inspection of `supabase/migrations/` confirms that the database contains only 5 tables:
  - `gemstones`, `orders`, `order_items`, `inquiries`, `staff_members`, `profiles`.
  There are **no tables** for:
  - `categories`
  - `media_assets`
  - `seo_records`
  - `store_settings`
  In `src/stores/admin-store.ts`, these modules are managed through Zustand `persist`:
  ```typescript
  export const useAdminStore = create<AdminState>()(
    persist(
      (set, get) => ({
        categories: [...INITIAL_ADMIN_CATEGORIES],
        mediaAssets: [...INITIAL_ADMIN_MEDIA],
        seoRecords: [...INITIAL_ADMIN_SEO],
        settings: { ...INITIAL_ADMIN_SETTINGS },
        ...
  ```
- **Business Impact:**
  Data volatility and isolation.
  - If an administrator uploads a new media asset, reorganizes category sort orders, or updates company contact info in `/admin/settings`, the changes are saved strictly in their personal browser's `localStorage`.
  - A second administrator logging in from another workstation sees none of these updates.
  - If the administrator clears their browser cache, all custom categories, settings, and media records revert to seed defaults.
  - Public Next.js storefront pages cannot access any of these updates.
- **Recommended Fix:**
  Create a migration defining relational PostgreSQL tables for these four entities:
  ```sql
  create table if not exists public.categories (
    id uuid primary key default uuid_generate_v4(),
    slug text unique not null,
    name text not null,
    subtitle text,
    tagline text,
    description text,
    image text not null,
    sort_order integer default 0,
    featured boolean default true
  );

  create table if not exists public.media_assets (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    url text not null,
    size text,
    file_type text,
    created_at timestamptz default now()
  );

  create table if not exists public.store_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamptz default now()
  );
  ```
- **How to Validate Fix:**
  Apply migration, update a setting from the admin panel, refresh from an incognito window, and verify that the new value is fetched directly from Supabase.

---

### Finding DATA-03: Schema & Typing Discrepancy on Gemstone Categories
- **Severity:** High
- **Affected Tables / Files:**
  - `src/types/supabase.ts` (Lines 35, 59, 83)
  - `supabase/migrations/20261012_initial_schema.sql`
  - `src/lib/constants.ts` (Line 82)
- **Evidence & Verification:**
  In `src/types/supabase.ts`:
  ```typescript
  gemstones: {
    Row: {
      ...
      category?: string | null;
    }
  }
  ```
  However, in `20261012_initial_schema.sql`, the `gemstones` table definition has no `category` column.
  In `src/lib/constants.ts`:
  ```typescript
  /** Used to filter Supabase rows, which have no category column. */
  match: { column: "color" | "variety"; value: string };
  ```
  The application works around the missing database column by executing substring regex filters on `color` or `variety` (`determineCategory` in `src/lib/map-gemstone.ts`).
- **Business Impact:**
  1. Broken taxonomy: Stones that have unique varieties (e.g. Alexandrite, Zircon, Spinel) get miscategorized under generic fallback buckets (e.g. `blue-gems`).
  2. Index inefficiency: Because categories are derived from arbitrary substrings, PostgreSQL cannot use index lookups (`eq`) and must execute slower case-insensitive wildcard pattern matching (`ilike %...%`).
- **Recommended Fix:**
  Add a real `category_id` (or `category_slug`) column to `public.gemstones` with an index:
  ```sql
  alter table public.gemstones add column if not exists category text;
  create index if not exists idx_gemstones_category on public.gemstones (category);
  ```
- **How to Validate Fix:**
  Run `\d public.gemstones` in `psql` and confirm the column and index are present.

---

### Finding DATA-04: Unindexed Loose Text Reference on Inquiries (`gem_id`)
- **Severity:** High
- **Affected Tables / Files:**
  - `supabase/migrations/20261012_initial_schema.sql` (Line 65)
  - `public.inquiries`
- **Evidence & Verification:**
  In `20261012_initial_schema.sql`:
  ```sql
  create table if not exists public.inquiries (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    gem_id text,
    gem_name text,
    ...
  );
  ```
  1. `gem_id` is defined as `text` rather than `uuid references public.gemstones(id) on delete set null`.
  2. There is no index on `public.inquiries(gem_id)`.
  3. When querying inquiries related to a specific gemstone in the Vault Console (`gemId = row.id`), PostgreSQL must perform a sequential scan across the entire `inquiries` table.
- **Business Impact:**
  Orphaned inquiry data and degraded query performance. If a gemstone is re-cataloged or its ID formatted differently, historical client consultations lose linkability to the specimen.
- **Recommended Fix:**
  Convert `gem_id` to UUID with foreign key constraint and index:
  ```sql
  alter table public.inquiries
    alter column gem_id type uuid using (gem_id::uuid),
    add constraint fk_inquiries_gem foreign key (gem_id) references public.gemstones(id) on delete set null;

  create index if not exists idx_inquiries_gem_id on public.inquiries (gem_id);
  ```
- **How to Validate Fix:**
  Verify foreign key constraint in `information_schema.table_constraints`.

---

### Finding DATA-05: Per-Row Subquery Overhead in Orders RLS Policy
- **Severity:** High
- **Affected Tables / Files:**
  - `supabase/migrations/20261021_fix_data_integrity_and_orders.sql` (Lines 40–44)
  - `public.orders`, `public.order_items`
- **Evidence & Verification:**
  In `20261021_fix_data_integrity_and_orders.sql`:
  ```sql
  create policy "Users can view own orders"
    on public.orders
    for select
    using (
      auth.uid() = user_id
      or email = (select email from auth.users where id = auth.uid())
      or auth.jwt() ->> 'role' = 'service_role'
      or is_active_staff()
    );
  ```
  The predicate:
  `email = (select email from auth.users where id = auth.uid())`
  forces PostgreSQL to execute an independent scalar subquery into `auth.users` for **every single evaluated row** in `public.orders` unless optimized away by the query planner. In addition, the subquery requires accessing the privileged `auth` schema during normal customer table scans.
- **Business Impact:**
  Severe latency spikes during customer order history retrieval (`/account`), increasing database CPU utilization exponentially as the order table scales.
- **Recommended Fix:**
  Extract the user's verified email directly from the JWT claims payload without hitting `auth.users`:
  ```sql
  create policy "Users can view own orders"
    on public.orders
    for select
    using (
      auth.uid() = user_id
      or email = (auth.jwt() ->> 'email')
      or auth.jwt() ->> 'role' = 'service_role'
      or is_active_staff()
    );
  ```
- **How to Validate Fix:**
  Run `EXPLAIN ANALYZE SELECT * FROM public.orders;` under an authenticated patron role and verify that the subquery plan node on `auth.users` is eliminated.

---

### Finding DATA-06: Unbounded In-Memory Table Aggregation in Dashboard Overview & Sitemap
- **Severity:** Medium
- **Affected Tables / Files:**
  - `src/actions/admin-db.ts` (Lines 560–611)
  - `src/app/sitemap.ts` (Line 74)
- **Evidence & Verification:**
  In `src/actions/admin-db.ts`:
  ```typescript
  export async function getAdminOverviewMetricsAction() {
    ...
    const [gemsRes, ordersRes, inqRes] = await Promise.all([
      getAdminGemstonesAction(),
      getAdminOrdersAction(),
      getAdminInquiriesAction(),
    ]);
    ...
    const totalVaultValue = gems.reduce((sum, g) => sum + g.price, 0);
    const totalCarats = gems.reduce((sum, g) => sum + g.carat, 0);
    const inStockCount = gems.filter((g) => g.inStock).length;
    const totalOrderRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }
  ```
  To display the 6 summary cards on the admin homepage (`/admin`), the server action calls `select("*")` on all gemstones, all orders, and all inquiries, transferring the entire database over the wire to Node.js and calculating sums and counts in JavaScript memory using `.reduce()` and `.filter()`.
- **Business Impact:**
  High database egress bandwidth, excessive Node.js memory consumption, and slow dashboard loading times. With 10,000 orders and 1,000 gemstones, this pattern can trigger Node.js Out-Of-Memory (OOM) crashes on a 1GB Hostinger VPS.
- **Recommended Fix:**
  Offload metrics calculation to a single PostgreSQL stored procedure that returns pre-aggregated numbers:
  ```sql
  create or replace function public.get_vault_metrics()
  returns jsonb
  language sql
  stable
  as $$
    select jsonb_build_object(
      'total_gemstones', count(*),
      'in_stock_count', count(*) filter (where in_stock = true),
      'total_vault_value', coalesce(sum(price), 0),
      'total_carats', coalesce(sum(carat), 0)
    ) from public.gemstones;
  $$;
  ```
- **How to Validate Fix:**
  Compare execution time and payload size: aggregated RPC payload should be < 1 KB, compared to hundreds of kilobytes for full object transfers.

---

### Finding DATA-07: Redundant Authentication Round-Trips (N+1 Auth Calls)
- **Severity:** Medium
- **Affected Tables / Files:**
  - `src/actions/admin-db.ts` (Lines 563, 567–569)
  - `src/lib/auth-checks.ts` (`requireAdminSession`)
- **Evidence & Verification:**
  When `/admin` loads, `getAdminOverviewMetricsAction` executes:
  1. `await requireAdminSession()` (Query 1 to `staff_members`)
  2. `getAdminGemstonesAction()` -> `await requireAdminSession()` (Query 2 to `staff_members`)
  3. `getAdminOrdersAction()` -> `await requireAdminSession()` (Query 3 to `staff_members`)
  4. `getAdminInquiriesAction()` -> `await requireAdminSession()` (Query 4 to `staff_members`)
  Every single sub-action redundantly queries `staff_members` to verify that the administrator is active.
- **Business Impact:**
  Triples or quadruples round-trip latency to Supabase on every admin dashboard render.
- **Recommended Fix:**
  Wrap session verification in React `cache()` for server requests, or pass the verified session object into internal helper queries:
  ```typescript
  import { cache } from "react";
  export const requireAdminSession = cache(async (): Promise<AuthenticatedAdmin> => {
    ...
  });
  ```
- **How to Validate Fix:**
  Trace Supabase database request logs during an admin dashboard refresh; verify only 1 query to `staff_members` is logged.

---

### Finding DATA-08: Order Shipping Tracking Data Lost Due to Missing Schema Columns
- **Severity:** Medium
- **Affected Tables / Files:**
  - `src/app/admin/orders/page.tsx` (Lines 117–128)
  - `supabase/migrations/20261012_initial_schema.sql` (`public.orders`)
- **Evidence & Verification:**
  In `src/app/admin/orders/page.tsx`, staff can assign:
  - Armored carrier (`carrierInput`, e.g. "Brinks Global Services" or "Malca-Amit")
  - Waybill tracking number (`trackingNumberInput`)
  - Customs declaration export number (`customsNumberInput`)
  When the staff clicks "Save Dispatch Tracking", `handleSaveTracking` updates the local Zustand store.
  However, `public.orders` in `20261012_initial_schema.sql` has no columns for:
  - `tracking_carrier`
  - `tracking_number`
  - `customs_declaration_number`
  - `dispatched_at`
  The action never writes to Supabase. When the page is reloaded, all tracking metadata disappears.
- **Business Impact:**
  Operational tracking failure. Armored courier tracking details are lost, and clients cannot track their multi-thousand-dollar gemstone deliveries from the customer account portal.
- **Recommended Fix:**
  Add tracking columns to `public.orders`:
  ```sql
  alter table public.orders
    add column if not exists tracking_carrier text,
    add column if not exists tracking_number text,
    add column if not exists customs_declaration_number text,
    add column if not exists dispatched_at timestamptz;
  ```
- **How to Validate Fix:**
  Update an order's tracking number in the admin panel, reload the page from an incognito session, and verify that the tracking information persists.

---

### Finding DATA-09: Trigram Search Index Mismatch with PostgREST Query Construction
- **Severity:** Medium
- **Affected Tables / Files:**
  - `supabase/migrations/202622_performance_indexes_and_storage.sql` (Lines 19–23)
  - `src/actions/gems.ts` (Lines 65–68)
- **Evidence & Verification:**
  In migration `20261022_performance_indexes_and_storage.sql`, a GIN trigram index is created:
  ```sql
  create index if not exists idx_gemstones_search_trgm on public.gemstones using gin (
    (name || ' ' || variety || ' ' || description || ' ' || origin) gin_trgm_ops
  );
  ```
  However, in `src/actions/gems.ts`, the search query is constructed as:
  ```typescript
  query = query.or(`name.ilike.%${cleanQ}%,variety.ilike.%${cleanQ}%,description.ilike.%${cleanQ}%,origin.ilike.%${cleanQ}%`);
  ```
  PostgreSQL's query planner **cannot** utilize an index on a concatenated expression `(name || ' ' || variety || ...)` when the query issues separate `OR` conditions on individual columns (`name ILIKE ... OR variety ILIKE ...`).
- **Business Impact:**
  Search queries bypass the GIN index and execute sequential table scans.
- **Recommended Fix:**
  Create individual trigram indexes on the searched columns, or query a generated search vector column:
  ```sql
  create index if not exists idx_gemstones_name_trgm on public.gemstones using gin (name gin_trgm_ops);
  create index if not exists idx_gemstones_variety_trgm on public.gemstones using gin (variety gin_trgm_ops);
  create index if not exists idx_gemstones_origin_trgm on public.gemstones using gin (origin gin_trgm_ops);
  ```
- **How to Validate Fix:**
  Run `EXPLAIN ANALYZE SELECT * FROM public.gemstones WHERE name ILIKE '%sapphire%' OR variety ILIKE '%sapphire%';` and verify `Bitmap Index Scan using idx_gemstones_name_trgm` appears in the execution plan.

---

### Finding DATA-10: Hard Deletion Violates Foreign Key Restraints on Ordered Gemstones
- **Severity:** Low
- **Affected Tables / Files:**
  - `src/actions/admin-db.ts` (`deleteAdminGemstoneAction`, Lines 217–220)
  - `supabase/migrations/20261021_fix_data_integrity_and_orders.sql` (Line 15)
- **Evidence & Verification:**
  In `20261021_fix_data_integrity_and_orders.sql`:
  ```sql
  create table if not exists public.order_items (
    ...
    gem_id uuid not null references public.gemstones(id) on delete restrict,
    ...
  );
  ```
  Notice `ON DELETE RESTRICT`.
  In `src/actions/admin-db.ts`:
  ```typescript
  await supabase.from("gemstones").delete().eq("id", idOrSlug);
  ```
  If an administrator attempts to delete a gemstone that was previously purchased in any order, PostgreSQL enforces referential integrity and rejects the query with:
  `update or delete on table "gemstones" violates foreign key constraint "order_items_gem_id_fkey"`.
- **Business Impact:**
  Staff receives an unhandled error when attempting to purge sold inventory.
- **Recommended Fix:**
  Implement soft-deletion (`is_archived` or `deleted_at`) rather than hard deletion:
  ```sql
  alter table public.gemstones add column if not exists is_archived boolean default false not null;
  create index if not exists idx_gemstones_archived on public.gemstones (is_archived);
  ```
  Update `deleteAdminGemstoneAction` to execute `update({ is_archived: true })`.
- **How to Validate Fix:**
  Create an order referencing a gemstone, attempt to archive the gemstone via the admin panel, and confirm that the operation succeeds while preserving the historical line item record.

---

### Finding DATA-11: Lack of Automated Database Backup & Point-In-Time Recovery Runbooks
- **Severity:** Low
- **Affected Components:**
  - Supabase Project Management & Hostinger Deployment Operations
- **Evidence & Verification:**
  The repository contains complete scripts for building deployment zips (`scripts/create-deploy-zip.ps1`) and image processing (`scripts/process-gem-images.mjs`), but **contains no automated database backup scripts, dump utilities, or disaster recovery runbooks**.
- **Business Impact:**
  Dependence on Supabase's internal automated daily snapshots. If an accidental administrative deletion, database corruption, or malicious table truncation occurs, restoring data requires manual tier support intervention with potential recovery point objective (RPO) data loss.
- **Recommended Fix:**
  Add a scheduled backup script utilizing `pg_dump` with automated encryption and off-site cloud storage:
  ```bash
  pg_dump -h $SUPABASE_DB_HOST -U postgres -d postgres -F c -b -v -f "/backups/isuru_gems_$(date +%Y%m%d_%H%M%S).dump"
  ```
- **How to Validate Fix:**
  Perform a test database dump and verify a clean restore into a local test PostgreSQL instance.

---

## 4. Recommended Priority Remediation Roadmap

To ensure flawless transactional integrity, high-throughput query execution, and complete administrative data persistence, the remediation roadmap is structured into four sequential phases:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Critical Financial & Inventory Concurrency Control (P0)       │
│ • DATA-01: Eliminate non-atomic checkout fallback                      │
│ • Enforce process_checkout_order row locking (FOR UPDATE)             │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Relational Persistence & Schema Alignment (P1)                │
│ • DATA-02: Create categories, media_assets, and store_settings tables  │
│ • DATA-03: Add category column & index to gemstones                    │
│ • DATA-04: Convert inquiries(gem_id) to UUID foreign key with index    │
│ • DATA-08: Add carrier tracking & customs declaration columns to orders│
├────────────────────────────────────────────────────────────────────────┤
│ Phase 3: Query Latency & RLS Optimization (P2)                         │
│ • DATA-05: Eliminate auth.users per-row subqueries via JWT claims     │
│ • DATA-06: Offload dashboard metrics to get_vault_metrics() stored proc│
│ • DATA-07: Memoize admin session verification via React cache()        │
│ • DATA-09: Deploy dedicated column GIN trigram indexes for ILIKE search│
├────────────────────────────────────────────────────────────────────────┤
│ Phase 4: Lifecycle Safeguards & Disaster Recovery (P3)                 │
│ • DATA-10: Implement soft-deletion (is_archived) on gemstones         │
│ • DATA-11: Provision backup-database scripts and recovery runbook      │
└────────────────────────────────────────────────────────────────────────┘
```

### Remediation Action Plan Matrix

| Phase | Finding ID | Severity | Action Items | Deliverables / Files | Status |
|---|---|---|---|---|---|
| **Phase 1: Immediate** | **DATA-01** | **Critical** | Remove insecure manual checkout fallback in `src/actions/checkout.ts`. Abort transaction immediately if row lock fails or stored procedure is missing, preventing overselling races and orphan orders. | `src/actions/checkout.ts` | **Remediated** |
| **Phase 2: High** | **DATA-02** | **High** | Create relational PostgreSQL tables with RLS and seed defaults for Categories, Media Assets, and Store Settings. Wire Admin UI modules to database server actions. | `supabase/migrations/20261025_database_audit_remediation.sql`, `src/actions/admin-db.ts`, `src/app/admin/categories/page.tsx`, `src/app/admin/media/page.tsx`, `src/app/admin/settings/page.tsx` | **Remediated** |
| **Phase 2: High** | **DATA-03** | **High** | Add `category` column and B-tree index to `public.gemstones`. Backfill historical taxonomy for all 41 seed catalog gems. Update PostgREST filter builder in `src/actions/gems.ts`. | `supabase/migrations/20261025_database_audit_remediation.sql`, `src/types/supabase.ts`, `src/actions/gems.ts` | **Remediated** |
| **Phase 2: High** | **DATA-04** | **High** | Alter `inquiries.gem_id` to UUID with foreign key constraint `REFERENCES public.gemstones(id) ON DELETE SET NULL` and create B-tree index `idx_inquiries_gem_id`. | `supabase/migrations/20261025_database_audit_remediation.sql`, `src/types/supabase.ts` | **Remediated** |
| **Phase 2: High** | **DATA-08** | **High** | Add `tracking_carrier`, `tracking_number`, `customs_declaration_number`, and `dispatched_at` columns to `public.orders`. Add `updateAdminOrderTrackingAction` and wire dispatch form. | `supabase/migrations/20261025_database_audit_remediation.sql`, `src/types/supabase.ts`, `src/actions/admin-db.ts`, `src/app/admin/orders/page.tsx` | **Remediated** |
| **Phase 3: Medium** | **DATA-05** | **High** | Replace `email = (select email from auth.users where id = auth.uid())` subqueries in `orders`, `order_items`, and `inquiries` RLS policies with direct JWT claim evaluation `auth.jwt() ->> 'email'`. | `supabase/migrations/20261025_database_audit_remediation.sql` | **Remediated** |
| **Phase 3: Medium** | **DATA-06** | **Medium** | Implement database-level aggregation stored procedure `public.get_vault_metrics()`. Offload calculation of vault values, carats, revenues, and counts from Node.js memory to PostgreSQL. | `supabase/migrations/20261025_database_audit_remediation.sql`, `src/actions/admin-db.ts` | **Remediated** |
| **Phase 3: Medium** | **DATA-07** | **Medium** | Wrap `requireAdminSession` in React's `cache()` to eliminate duplicate `staff_members` queries during concurrent server component / server action evaluations. | `src/lib/auth-checks.ts` | **Remediated** |
| **Phase 3: Medium** | **DATA-09** | **Medium** | Create dedicated single-column GIN trigram indexes on `name`, `variety`, and `origin` in `public.gemstones` to accelerate PostgREST ILIKE search patterns. | `supabase/migrations/20261025_database_audit_remediation.sql` | **Remediated** |
| **Phase 4: Low** | **DATA-10** | **Low** | Add `is_archived` column and index to `public.gemstones`. Update `deleteAdminGemstoneAction` to soft-archive gems that have historical order line items, preserving relational integrity. | `supabase/migrations/20261025_database_audit_remediation.sql`, `src/actions/admin-db.ts`, `src/actions/gems.ts` | **Remediated** |
| **Phase 4: Low** | **DATA-11** | **Low** | Provision automated backup scripts (`scripts/backup-database.sh`, `scripts/backup-database.ps1`) using `pg_dump` with custom binary compression and automated retention rotation. | `scripts/backup-database.sh`, `scripts/backup-database.ps1` | **Remediated** |

---

## 5. Verification & Validation Protocol

After applying migration `20261025_database_audit_remediation.sql` in Supabase SQL Editor:
1. **Concurrency Validation (DATA-01):**
   Execute parallel checkout requests for the same gemstone. Verify that the first request locks the row and completes, while the concurrent request is safely aborted with inventory notification.
2. **Persistence Validation (DATA-02, DATA-08):**
   - In `/admin/categories`, create or modify a category; reload page in an incognito session and confirm persistence from Supabase.
   - In `/admin/orders`, enter courier waybill details and click "Save Dispatch Tracking"; reload and verify tracking info remains attached to the order.
3. **RLS Performance Check (DATA-05):**
   Run `EXPLAIN ANALYZE SELECT * FROM public.orders;` as an authenticated patron user. Verify zero plan nodes accessing `auth.users`.
4. **Soft-Delete Integrity (DATA-10):**
   Attempt to delete a gemstone previously acquired in an order via `/admin/products`. Confirm the specimen status transitions to `is_archived = true` without throwing foreign key constraint errors (`23503`).

