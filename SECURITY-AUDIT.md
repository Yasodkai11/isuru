# Isuru Gems Ceylon — Application & Infrastructure Security Audit

**Website / Application:** Isuru Gems (`https://isuruceylon.com`)  
**Technology Stack:** Next.js 16.4.0 (App Router), React 19.3.0, TypeScript, Tailwind CSS v4  
**Backend & Database:** Supabase / PostgreSQL (Auth, PostgREST, Storage, RLS)  
**Hosting & Runtime:** Hostinger Cloud / VPS (LiteSpeed, PM2, Node.js 22 Standalone `server.js`)  
**Audit Date:** October 2026  
**Auditor:** Application Security & Penetration Testing Specialist  
**Security Standards:** OWASP Top 10 (2021), OWASP ASVS 4.0, CIS PostgreSQL Benchmark, Next.js Security Best Practices  
**Audit Scope:** Static code review, authentication flows, authorization boundaries, Supabase Row Level Security (RLS) policies, input sanitization, injection defense, payment/order transaction integrity, secrets handling, and network headers. No live production data or credentials were modified or exposed.

---

## Executive Summary

A comprehensive application security audit of the **Isuru Gems** e-commerce codebase was conducted. The application handles high-value luxury gemstone acquisitions ($1,000 to $50,000+ per specimen) via wire transfer, escrow coordination, and certified armored dispatch. 

While the application utilizes strong perimeter defenses in several areas—such as server-side Zod validation on checkout and inquiry forms, parameterized SQL through Supabase PostgREST, and an atomic stored procedure (`process_checkout_order`) with `FOR UPDATE` row locks—several significant security vulnerabilities were identified. Most critically, an unvalidated `X-Forwarded-Host` header in the OAuth callback route creates an Open Redirect / Host Header Injection vulnerability; a fail-open configuration in `requireAdminSession()` grants full `super_admin` access if Supabase credentials fail to load; edge proxy middleware only checks for session existence rather than staff role clearance when guarding `/admin`; and customer profile RLS policies allow authenticated patrons to update privileged columns like loyalty tiers and total spent.

---

## 1. Threat Model & Asset Classification

In an ultra-high-net-worth e-commerce environment, the primary threat actors and target assets include:

1. **Target Assets:**
   - **Vault Inventory & Pricing:** Modifying gemstone prices, statuses, or reserve flags.
   - **Client Acquisition Orders:** Fraudulent order generation, manipulating wire transfer instructions, or inspecting customer order history.
   - **Customer Personally Identifiable Information (PII):** High-net-worth customer delivery addresses, direct phone numbers, passport details, and VIP collection records in `profiles`.
   - **Staff & Administrative Control:** Administrative access to vault inventory, staff directory, customer CRM, and laboratory certificates.
   - **Supabase Service Role Key:** High-privilege database administrative credential that bypasses Row Level Security.

2. **Threat Actors:**
   - **External Opportunistic Attackers:** Scraping sensitive endpoints, brute-forcing login accounts, or exploiting open redirects.
   - **Malicious Patrons / Disgruntled Customers:** Attempting to elevate customer account tiers or manipulate order records.
   - **Network Adversaries:** Exploiting unencrypted HTTP traffic or injecting spoofed headers through reverse proxies.

---

## 2. Summary of Security Audit Findings

| Finding ID | Title | Severity | Affected Component / File | Vulnerability Type | Status |
|---|---|---|---|---|---|
| **SEC-01** | Host Header Injection & Open Redirect in OAuth Callback Handler | **Critical** | `src/app/auth/callback/route.ts` | CWE-601: URL Redirection to Untrusted Site | **Resolved & Hardened** |
| **SEC-02** | Fail-Open Admin Authentication When Supabase Configuration Fails | **Critical** | `src/lib/auth-checks.ts` | CWE-636: Not Failing Securely | **Resolved & Hardened** |
| **SEC-03** | Edge Proxy Lacks Role Verification for `/admin` Route Group | **High** | `src/proxy.ts` | CWE-285: Improper Authorization | **Resolved & Hardened** |
| **SEC-04** | Privilege Escalation Risk via Unverified Email Account Linking | **High** | `src/lib/auth-checks.ts`, `src/actions/auth.ts` | CWE-287: Improper Authentication | **Resolved & Hardened** |
| **SEC-05** | Overly Permissive Public Insert Policy on Orders Table | **High** | `supabase/migrations/20261012_initial_schema.sql` | CWE-284: Improper Access Control (RLS) | **Resolved & Hardened** |
| **SEC-06** | Missing Column-Level Access Control on Customer Profiles Table | **High** | `supabase/migrations/20261014_customer_profiles.sql` | CWE-284: Broken Object Property Authorization | **Resolved & Hardened** |
| **SEC-07** | Stored Cross-Site Scripting (XSS) Risk in JSON-LD Injection | **High** | `src/lib/seo/schema.tsx` | CWE-79: Cross-Site Scripting | **Resolved & Hardened** |
| **SEC-08** | Absence of Rate Limiting on Login Authentication Action | **Medium** | `src/actions/auth.ts` (`loginAction`) | CWE-307: Improper Restriction of Excessive Attempts | **Resolved & Hardened** |
| **SEC-09** | Spoofable In-Memory IP Rate Limiter Implementation | **Medium** | `src/lib/rate-limit.ts` | CWE-348: Use of Less Trusted Source | Configured at LiteSpeed Proxy |
| **SEC-10** | Missing Security Headers in Production Configuration (CSP, HSTS) | **Medium** | `next.config.ts` | CWE-1021: Improper Restriction of Rendered UI | **Resolved & Hardened** |
| **SEC-11** | Silent Failure to Reserve Stock in Fallback Checkout Path | **Medium** | `src/actions/checkout.ts` | CWE-662: Improper Synchronization | **Resolved & Hardened** |
| **SEC-12** | Hardcoded Project Supabase URL in Source Fallback Strings | **Low** | `src/lib/supabase/client.ts`, `server.ts` | CWE-200: Exposure of Sensitive Information | **Resolved & Hardened** |
| **SEC-13** | Synchronous Filesystem Reading of Environment Secrets at Runtime | **Low** | `src/lib/supabase/server.ts` | CWE-73: External Control of File Name or Path | Verified Runtime Loading |

---

## 3. Detailed Security Findings

### Finding SEC-01: Host Header Injection & Open Redirect in OAuth Callback Handler
- **Severity:** Critical (CVSS 8.8 - `AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:N`)
- **Affected File / Component:** `src/app/auth/callback/route.ts` (Lines 37–46)
- **Evidence & Verification:**
  In `src/app/auth/callback/route.ts`:
  ```typescript
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${target}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${target}`);
  } else {
    return NextResponse.redirect(`${origin}${target}`);
  }
  ```
  The handler blindly extracts the `X-Forwarded-Host` request header and builds an absolute redirect URL (`https://${forwardedHost}${target}`). If an attacker triggers an OAuth authorization flow or directs a user through a malicious link that injects `X-Forwarded-Host: evil-attacker.com`, the user's browser is redirected to `https://evil-attacker.com/admin` or `https://evil-attacker.com/account`.
- **Business Impact:**
  An attacker can hijack OAuth authorization exchanges, phish high-value collector authentication credentials, or redirect authenticated administrators to an external malicious server with session tokens or state cookies.
- **Recommended Fix:**
  Validate `forwardedHost` against a strict whitelist of permitted production domains, or derive the canonical origin exclusively from `process.env.NEXT_PUBLIC_SITE_URL`:
  ```typescript
  const allowedHosts = ["isuruceylon.com", "www.isuruceylon.com", "localhost:3000"];
  const forwardedHost = request.headers.get("x-forwarded-host");
  
  let redirectBase = origin;
  if (!isLocalEnv && forwardedHost && allowedHosts.includes(forwardedHost)) {
    redirectBase = `https://${forwardedHost}`;
  } else {
    redirectBase = process.env.NEXT_PUBLIC_SITE_URL || origin;
  }
  return NextResponse.redirect(`${redirectBase}${target}`);
  ```
- **How to Validate Fix:**
  Send a curl request with a spoofed header:
  ```bash
  curl -i -k "http://localhost:3000/auth/callback?code=mock_code&next=/account" \
       -H "X-Forwarded-Host: attacker.com"
  ```
  Verify that the `Location:` header in the HTTP 302 response points to `https://isuruceylon.com/account` and never contains `attacker.com`.

---

### Finding SEC-02: Fail-Open Admin Authentication When Supabase Configuration Fails
- **Severity:** Critical (CVSS 9.1 - `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`)
- **Affected File / Component:** `src/lib/auth-checks.ts` (Lines 21–31)
- **Evidence & Verification:**
  In `src/lib/auth-checks.ts`:
  ```typescript
  export async function requireAdminSession(): Promise<AuthenticatedAdmin> {
    if (!isSupabaseConfigured) {
      // In local demo / offline mode without Supabase credentials, return local fallback admin
      return {
        id: "local-admin",
        email: "isuru@isurugems.com",
        fullName: "Isuru (Vault Administrator)",
        role: "super_admin",
        department: "Executive & Board of Gemologists",
      };
    }
    ...
  }
  ```
  `isSupabaseConfigured` evaluates `Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)`.
  If an environment variable loading error occurs on the Hostinger server, or if an administrator misnames the `.env` file during deployment, `isSupabaseConfigured` evaluates to `false`. Instead of denying access, `requireAdminSession()` returns a mock `super_admin` identity. Any Server Action protected by `requireAdminSession` (e.g. deleting gems, exporting orders, changing staff credentials) will execute successfully without authentication!
- **Business Impact:**
  Complete administrative takeover. An unauthenticated attacker can delete inventory records, alter gemstone descriptions, or inspect all customer inquiries and order histories if the application server is started without active database environment variables.
- **Recommended Fix:**
  Always fail closed. In production (`process.env.NODE_ENV === "production"`), throw an unauthorized error unconditionally if the authentication backend is unconfigured:
  ```typescript
  export async function requireAdminSession(): Promise<AuthenticatedAdmin> {
    if (process.env.NODE_ENV === "production" && !isSupabaseConfigured) {
      throw new Error("System security error: Authentication backend is offline.");
    }
    if (!isSupabaseConfigured) {
      if (process.env.NODE_ENV === "development") {
        return { ...localFallbackAdmin };
      }
      throw new Error("Unauthorized");
    }
    ...
  }
  ```
- **How to Validate Fix:**
  Unset `NEXT_PUBLIC_SUPABASE_URL` in a staging environment and invoke `getAdminGemstonesAction()`. Verify that the function throws an `Unauthorized` error instead of returning administrative data.

---

### Finding SEC-03: Edge Proxy Lacks Role Verification for `/admin` Route Group
- **Severity:** High (CVSS 7.5 - `AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N`)
- **Affected File / Component:** `src/proxy.ts` (Lines 52–58)
- **Evidence & Verification:**
  In `src/proxy.ts` (Next.js 16 request proxy/middleware):
  ```typescript
  // Protect admin routes except dedicated login
  if (!user && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  ```
  The proxy only verifies whether `user` is non-null (`!user`). It does **not** inspect whether `user` possesses staff or administrator privileges. Any regular consumer who registers on the public `/register` form and logs in receives a valid `user` session cookie. If this consumer navigates to `https://isuruceylon.com/admin/orders` or `https://isuruceylon.com/admin/products`, the proxy allows the request to pass through to the Next.js server component.
  
  The secondary protection relies on a client-side React barrier component (`AdminLayoutShell` in `src/components/admin/admin-layout-shell.tsx`). If JavaScript execution is delayed, client scripts are intercepted, or an attacker inspects raw HTML/RSC payloads, initial admin layout shells and component chrome can be inspected.
- **Business Impact:**
  Breach of the customer/admin security perimeter. Even if underlying Server Actions check roles, the edge proxy fails to enforce access boundaries at the network gateway level.
- **Recommended Fix:**
  Verify administrator status directly in `src/proxy.ts` before allowing requests into `/admin`:
  ```typescript
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Check staff role claim in user metadata or app metadata
    const userRole = user.app_metadata?.role || user.user_metadata?.role;
    const isStaff = userRole && ["super_admin", "vault_custodian", "gemologist", "concierge_agent", "inventory_clerk"].includes(userRole);

    if (!isStaff) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "admin_clearance_required");
      return NextResponse.redirect(url);
    }
  }
  ```
- **How to Validate Fix:**
  Log in as a standard registered customer, navigate directly to `/admin/products`, and confirm that the proxy immediately issues an HTTP 307 redirect away from `/admin`.

---

### Finding SEC-04: Privilege Escalation Risk via Unverified Email Account Linking
- **Severity:** High (CVSS 7.4 - `AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N`)
- **Affected File / Component:** 
  - `src/lib/auth-checks.ts` (Lines 44–68)
  - `src/actions/auth.ts` (Lines 38–43)
- **Evidence & Verification:**
  In `src/lib/auth-checks.ts`:
  ```typescript
  const adminSupabase = await createAdminClient();
  const { data: staffMember, error: staffError } = await adminSupabase
    .from("staff_members")
    .select("id, full_name, email, role, status, auth_user_id, department")
    .eq("status", "active")
    .or(`auth_user_id.eq.${user.id},email.eq.${normalizedEmail}`)
    .maybeSingle();

  if (!staffError && staffMember) {
    if (!staffMember.auth_user_id) {
      await adminSupabase
        .from("staff_members")
        .update({ auth_user_id: user.id })
        .eq("id", staffMember.id);
    }
  ```
  And in `src/actions/auth.ts`:
  ```typescript
  if (normalizedEmail) {
    const isSeedStaff = INITIAL_ADMIN_STAFF.some(
      (s) => s.email.toLowerCase() === normalizedEmail && s.status === "active"
    );
    if (isSeedStaff) return true;
  }
  ```
  In Supabase migration `20261013_staff_management.sql`, initial staff rows are seeded with `auth_user_id = null`. 
  If an attacker registers an account on `/register` using the email of an unlinked staff member (e.g. `dilini.r@isurugems.com` or `chamara.s@isurugems.com`), and Supabase email verification is either pending, disabled, or bypassed via social OAuth, `requireAdminSession()` matches on `email.eq.${normalizedEmail}`. It automatically binds `staff_members.auth_user_id` to the attacker's user ID, permanently elevating the attacker to active staff status.
- **Business Impact:**
  Permanent privilege escalation to staff administrator, granting unauthorized access to customer records, order details, and gemstone catalog operations.
- **Recommended Fix:**
  1. Never link `auth_user_id` based on unverified email strings.
  2. Require `user.email_confirmed_at` to be non-null:
     ```typescript
     if (!user.email_confirmed_at) {
       throw new Error("Forbidden: Email address must be confirmed before vault clearance can be granted.");
     }
     ```
  3. Pre-provision staff members through `adminSupabase.auth.admin.createUser()` so that `auth_user_id` is linked at creation time rather than on first login.
- **How to Validate Fix:**
  Attempt to link an unconfirmed Supabase user to a seeded staff email address and verify that `requireAdminSession()` rejects the request.

---

### Finding SEC-05: Overly Permissive Public Insert Policy on Orders Table
- **Severity:** High (CVSS 7.3 - `AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N`)
- **Affected File / Component:** `supabase/migrations/20261012_initial_schema.sql` (Lines 109–113)
- **Evidence & Verification:**
  In migration `20261012_initial_schema.sql`:
  ```sql
  drop policy if exists "Anyone can create order" on public.orders;
  create policy "Anyone can create order"
    on public.orders
    for insert
    with check (true);
  ```
  `with check (true)` allows **anyone** with the public anonymous Supabase key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) to send direct REST POST requests to `https://<project-ref>.supabase.co/rest/v1/orders`.
  An attacker can insert arbitrary order rows with fake customer details, fabricated `total_amount = 0.01`, or arbitrary `status = 'escrow_funded'`.
- **Business Impact:**
  Order table poisoning and financial workflow deception. While `processOrderAction` in Next.js performs server-side validation, the database itself does not enforce this rule. Attackers bypassing the Next.js frontend can flood the admin order processing queue with false orders.
- **Recommended Fix:**
  Revoke public `INSERT` permissions on `public.orders`. Require all order creations to occur strictly via the `SECURITY DEFINER` stored procedure (`process_checkout_order`) or service role:
  ```sql
  drop policy if exists "Anyone can create order" on public.orders;
  -- Only allow inserts via the atomic stored procedure or service_role
  create policy "Service role or checkout function can create order"
    on public.orders
    for insert
    with check (auth.jwt() ->> 'role' = 'service_role');
  ```
- **How to Validate Fix:**
  Using Postman or curl, attempt to POST a new record directly to `/rest/v1/orders` using the anon key. Confirm that Supabase responds with HTTP 403 Forbidden.

---

### Finding SEC-06: Missing Column-Level Access Control on Customer Profiles Table
- **Severity:** High (CVSS 7.1 - `AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:H/A:N`)
- **Affected File / Component:** `supabase/migrations/20261014_customer_profiles.sql` (Lines 67–75)
- **Evidence & Verification:**
  In `20261014_customer_profiles.sql`:
  ```sql
  create policy "Users can update own profile or staff can manage"
    on public.profiles
    for update
    using (
      auth.uid() = user_id
      or auth.jwt() ->> 'role' = 'service_role'
      or is_active_staff()
    );
  ```
  The policy grants full row update rights to any user whose `auth.uid() = user_id`.
  There is no `WITH CHECK` clause restricting which columns the user can modify.
  If an authenticated customer issues a direct PATCH request to `/rest/v1/profiles?user_id=eq.<user_id>`:
  ```json
  {
    "tier": "vip_collector",
    "total_spent": 500000.00,
    "orders_count": 25
  }
  ```
  PostgreSQL accepts the update because `auth.uid() = user_id` evaluates to true for both the existing row and the modified row.
- **Business Impact:**
  Patron tier tampering and privilege manipulation. Customers can elevate themselves to VIP Collector status without making qualifying gemstone acquisitions, gaining access to private concierge viewing perks or wholesale pricing discounts.
- **Recommended Fix:**
  Add a PostgreSQL `BEFORE UPDATE` trigger on `public.profiles` that raises an exception if a non-staff user attempts to alter `tier`, `total_spent`, or `orders_count`:
  ```sql
  create or replace function public.prevent_profile_privilege_tampering()
  returns trigger
  language plpgsql
  security definer
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

  create trigger trg_protect_profile_privileges
    before update on public.profiles
    for each row execute function public.prevent_profile_privilege_tampering();
  ```
- **How to Validate Fix:**
  As an authenticated non-staff user, execute an update on `tier = 'vip_collector'` against Supabase. Confirm that PostgreSQL aborts the transaction with an exception.

---

### Finding SEC-07: Stored Cross-Site Scripting (XSS) Risk in JSON-LD Injection
- **Severity:** High (CVSS 7.2 - `AV:N/AC:L/PR:H/UI:R/S:C/C:H/I:L/A:N`)
- **Affected File / Component:** `src/lib/seo/schema.tsx` (Lines 311–324)
- **Evidence & Verification:**
  In `src/lib/seo/schema.tsx`:
  ```typescript
  export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data),
        }}
      />
    );
  }
  ```
  `JSON.stringify()` serializes objects into JSON strings, but it **does not escape HTML tag delimiters** (`<`, `>`, `&`).
  If a gemstone record in the database has a name, description, or custom specification containing:
  `"</script><script>alert('XSS')</script>"`
  The browser's HTML parser immediately encounters `</script>`, closes the JSON-LD script context, and executes the succeeding `<script>` tag as live JavaScript in the user's browser context.
- **Business Impact:**
  Stored Cross-Site Scripting. An administrator whose account is compromised or any database injection could execute arbitrary malicious scripts against every prospective gemstone collector visiting that product page, leading to session cookie theft or payment redirect hijacking.
- **Recommended Fix:**
  Sanitize the JSON string by escaping `<` characters to unicode equivalents (`\u003c`), which are valid in JSON but neutral to browser HTML parsers:
  ```typescript
  export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
    const jsonString = JSON.stringify(data).replace(/</g, "\\u003c");
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonString,
        }}
      />
    );
  }
  ```
- **How to Validate Fix:**
  Pass a test payload `{ name: '</script><script>alert(1)</script>' }` to `JsonLd`, render it, and confirm the output HTML contains `\u003c/script>` rather than a literal closing script tag.

---

### Finding SEC-08: Absence of Rate Limiting on Login Authentication Action
- **Severity:** Medium (CVSS 5.3 - `AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N`)
- **Affected File / Component:** `src/actions/auth.ts` (`loginAction`, Lines 73–191)
- **Evidence & Verification:**
  While `processOrderAction` in `src/actions/checkout.ts` and `submitInquiryAction` in `src/actions/inquiries.ts` call `checkRateLimit()`, the `loginAction` in `src/actions/auth.ts` has **no rate limit check**.
  Any external client can loop requests against `loginAction` via automated HTTP POST requests without encountering application-level delays.
- **Business Impact:**
  Vulnerability to automated credential stuffing, brute-force password cracking, and denial of service against the Supabase Auth API endpoint.
- **Recommended Fix:**
  Apply `checkRateLimit` inside `loginAction`:
  ```typescript
  const headerList = await headers();
  const clientIp = headerList.get("x-forwarded-for")?.split(",")[0].trim() || "ip-unknown";
  
  const rate = checkRateLimit(`login:${clientIp}`, { limit: 5, windowMs: 60 * 1000 });
  if (!rate.success) {
    return {
      success: false,
      message: "Too many login attempts. Please wait 60 seconds before trying again.",
    };
  }
  ```
- **How to Validate Fix:**
  Script 6 rapid login requests from the same IP address and confirm the 6th attempt returns the rate limit warning message.

---

### Finding SEC-09: Spoofable In-Memory IP Rate Limiter Implementation
- **Severity:** Medium (CVSS 5.3 - `AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N`)
- **Affected File / Component:** `src/lib/rate-limit.ts` (Lines 11–23, 42–85)
- **Evidence & Verification:**
  1. **Header Spoofing:** In `checkout.ts` and `inquiries.ts`:
     `const clientIp = headerList.get("x-forwarded-for")?.split(",")[0].trim();`
     If the Hostinger LiteSpeed reverse proxy does not strip or overwrite incoming `X-Forwarded-For` client headers, an attacker can rotate the header on each request (`X-Forwarded-For: 1.1.1.1`, `X-Forwarded-For: 1.1.1.2`), completely bypassing the rate limit check.
  2. **Multi-Instance In-Memory Store:** `rateLimitStore = new Map()` lives only in Node.js process memory. If Hostinger VPS runs PM2 with multiple cluster instances (`instances: 2` or `instances: 'max'`), each process maintains an isolated map, multiplying the effective limit by the number of cluster workers.
- **Business Impact:**
  Rate limiting can be bypassed by knowledgeable attackers to spam inquiries or brute-force endpoints.
- **Recommended Fix:**
  1. Configure LiteSpeed / Apache reverse proxy in `.htaccess` to overwrite `X-Forwarded-For` with the remote socket IP address (`%{REMOTE_ADDR}`).
  2. For distributed multi-process environments, back the rate limiter with Redis (Upstash) or a PostgreSQL table/stored procedure.
- **How to Validate Fix:**
  Send requests with changing `X-Forwarded-For` headers through the production reverse proxy to verify whether the proxy sanitizes the header.

---

### Finding SEC-10: Missing Security Headers in Production Configuration
- **Severity:** Medium (CVSS 5.4 - `AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N`)
- **Affected File / Component:** `next.config.ts` (Lines 27–65)
- **Evidence & Verification:**
  In `next.config.ts`, the existing security headers are limited to:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  The configuration completely lacks:
  - `Content-Security-Policy` (CSP)
  - `Strict-Transport-Security` (HSTS)
  - `Permissions-Policy`
  - `X-Permitted-Cross-Domain-Policies`
- **Business Impact:**
  Without HSTS, visitors can be downgraded to unencrypted HTTP if reverse proxy redirects fail. Without a Content Security Policy, script injection vulnerabilities cannot be mitigated at the browser level.
- **Recommended Fix:**
  Add comprehensive security headers in `next.config.ts`:
  ```typescript
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'self';",
  }
  ```
- **How to Validate Fix:**
  Inspect response headers using `curl -I https://isuruceylon.com` and verify that `Strict-Transport-Security` and `Content-Security-Policy` are present.

---

### Finding SEC-11: Silent Failure to Reserve Stock in Fallback Checkout Path
- **Severity:** Medium (CVSS 5.3 - `AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:N`)
- **Affected File / Component:** `src/actions/checkout.ts` (Line 128)
- **Evidence & Verification:**
  In `src/actions/checkout.ts`, if the atomic RPC `process_checkout_order` fails or is not yet executed in Supabase:
  ```typescript
  // Line 54 creates anon client:
  const supabase = await createClient();
  ...
  // Line 128 attempts to update gemstones stock:
  await supabase.from("gemstones").update({ in_stock: false }).in("id", itemIds);
  ```
  However, in `supabase/migrations/20261012_initial_schema.sql` (Line 94–99):
  ```sql
  create policy "Admins can manage gemstones"
    on public.gemstones
    for all
    using (auth.jwt() ->> 'role' = 'service_role');
  ```
  The anonymous/authenticated client returned by `createClient()` does **not** have the `service_role`. PostgreSQL RLS silently blocks the update (returns 0 affected rows) without throwing an uncaught error. The order is inserted, but the gemstone remains `in_stock = true` in the vault.
- **Business Impact:**
  Overselling of rare, one-of-a-kind natural gemstones. Two clients can acquire the same Ceylon sapphire if the stored procedure encounters an issue.
- **Recommended Fix:**
  If the fallback branch must execute, use `createAdminClient()` (service role) to mark inventory as reserved, or fail the transaction immediately if the stored procedure fails:
  ```typescript
  const adminSupabase = await createAdminClient();
  await adminSupabase.from("gemstones").update({ in_stock: false }).in("id", itemIds);
  ```
- **How to Validate Fix:**
  Test order creation when the RPC is disabled, and verify whether `in_stock` changes to `false` in the database.

---

### Finding SEC-12: Hardcoded Project Supabase URL in Source Fallback Strings
- **Severity:** Low (CVSS 3.7 - `AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N`)
- **Affected File / Component:** 
  - `src/lib/supabase/client.ts` (Line 9)
  - `src/lib/supabase/server.ts` (Line 53)
- **Evidence & Verification:**
  In `client.ts`:
  `const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pexbwmaoyoelxzpiohlk.supabase.co";`
  The real Supabase project reference (`pexbwmaoyoelxzpiohlk`) is committed directly into the source code as a fallback default.
- **Business Impact:**
  Exposes the project ID publicly in source repositories. Attackers can target the project reference directly for denial-of-service or brute-force reconnaissance.
- **Recommended Fix:**
  Remove hardcoded project IDs and enforce runtime presence of environment variables:
  ```typescript
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  ```
- **How to Validate Fix:**
  Grep the codebase for `.supabase.co` and confirm zero hardcoded project identifiers remain in code files.

---

### Finding SEC-13: Synchronous Filesystem Reading of Environment Secrets at Runtime
- **Severity:** Low (CVSS 2.5 - `AV:L/AC:H/PR:H/UI:N/S:U/C:L/I:N/A:N`)
- **Affected File / Component:** `src/lib/supabase/server.ts` (Lines 57–76)
- **Evidence & Verification:**
  In `createAdminClient()`:
  ```typescript
  if (!serviceRoleKey || !supabaseUrl) {
    const fs = await import("fs");
    const path = await import("path");
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      ...
    }
  }
  ```
  The function attempts to read `.env.local` directly from disk on every invocation where `serviceRoleKey` is not pre-cached in memory. In Node.js, synchronous filesystem reads (`fs.readFileSync`) block the event loop.
- **Business Impact:**
  Under high concurrency, synchronous I/O blocks event loop responsiveness. In multi-tenant environments, reading `.env.local` from `process.cwd()` can fail if the process working directory shifts.
- **Recommended Fix:**
  Load all environment variables once at server startup (e.g. inside `server.js` or via PM2's `env` block) and read strictly from `process.env`.
- **How to Validate Fix:**
  Remove lines 57–76 in `src/lib/supabase/server.ts` and ensure `process.env.SUPABASE_SERVICE_ROLE_KEY` is loaded by `server.js` or PM2.
