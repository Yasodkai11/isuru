# Isuru Gems E-commerce — Complete Technical & On-Page SEO Audit Report

**Website:** Isuru Gems (`https://isuruceylon.com`)  
**Framework:** Next.js 16.4.0 (App Router), React 19.3.0, TypeScript  
**Database / CMS:** Supabase / PostgreSQL  
**Hosting / Deployment:** Hostinger VPS / Node.js Standalone (`server.js`)  
**Audit Date:** October 21, 2026  
**Auditor:** Senior Technical SEO Engineer & Next.js Specialist  

---

## Executive Summary

An in-depth, production-ready SEO audit and technical implementation was conducted for the **Isuru Gems** luxury gemstone e-commerce platform. The project previously suffered from several architectural SEO vulnerabilities, including orphaned public landing pages (`/certificates`), broken internal links pointing to non-existent query parameter routes (`/gems?category=...`), crawler leakage into private cart/checkout/admin sessions, incomplete OpenGraph social cards, generic non-attribute image `alt` tags, and unformatted JSON-LD dates.

All SEO defects have been rectified directly within the Next.js App Router codebase **without altering the UI layout, visual aesthetics, database schemas, or production records**. All changes were validated against the TypeScript compiler, ESLint, and a full production build (`next build --webpack`), successfully generating 79 static and dynamic routes.

---

## 1. Issues Found Before Changes (With Code Evidence)

| # | Category | Issue Description | Code Evidence Before Fix | SEO Impact |
|---|---|---|---|---|
| **1** | **Robots Directives** | Disallow rules did not use wildcard suffix matching, risking crawler access to nested admin, auth, and user account subroutes. | `robots.ts` had: `disallow: ['/admin', '/account', '/cart', '/checkout', '/auth', '/api']` | Crawlers could index URLs like `/admin/login`, `/account/orders`, leaking private endpoints. |
| **2** | **Sitemap Freshness & In-Stock Filter** | Sitemap used static `new Date()` fallback for all items without timestamps, and included out-of-stock gemstones (`gem.inStock === false`). | `sitemap.ts` lacked filtering for `gem.inStock !== false` and used `new Date()` without prioritizing real update timestamps. | Inactive/out-of-stock gems consume crawl budget; search engines crawl stale items. |
| **3** | **Google Image Sitemaps** | Sitemap did not take advantage of Next.js 16 native `images` metadata in `MetadataRoute.Sitemap`. | `sitemap.ts` only generated `url`, `lastModified`, `changeFrequency`, `priority`. | Missed organic ranking in Google Image Search for high-value colored gemstone queries. |
| **4** | **Orphaned Page** | The high-trust `/certificates` page existed in the filesystem but was absent from site navigation (header, mobile menu, footer, and product details). | Missing from `NAV_ITEMS` in `header.tsx`, `mobile-nav.tsx`, and `footer.tsx`. | Search engines could not discover or pass PageRank to lab certification credentials (GIA, Gübelin, SSEF). |
| **5** | **Broken Internal Links** | Hero pod badges and Category cards linked to query parameters (`/gems?category=blue-gems`) instead of canonical dynamic routes (`/gems/category/blue-gems`). | `category-cards.tsx`: `href: "/gems?category=blue-gems"`; `hero-section.tsx`: `href: "/gems?category=blue-gems"`. | Diluted internal link equity; caused duplicate content canonicalization conflicts. |
| **6** | **Cart Page Indexability** | `/cart` was a client-rendered component (`"use client"`) lacking server-side metadata, `noindex` directives, and canonical tags. | `src/app/(shop)/cart/page.tsx` had no `layout.tsx` or `metadata` export. | Utility checkout pages risk being indexed as thin content. |
| **7** | **Incomplete Breadcrumbs** | Product details page breadcrumbs skipped the intermediate category level (Jumped directly from `Home` > `Gemstones` > `Product Name`). | `[slug]/page.tsx`: Breadcrumb array only had `Home`, `Gemstones`, and `gem.name`. | Weakened topical hierarchy in Google SERP snippet rich breadcrumbs. |
| **8** | **Placeholder Image URLs** | OpenGraph tags and fallback image URLs referenced third-party Unsplash images (`images.unsplash.com/...`). | `schema.tsx` and `[slug]/page.tsx` contained Unsplash fallback strings. | Risk of broken third-party links, slow external DNS lookups, and unbranded SERP snippets. |
| **9** | **Generic Image Alt Tags** | Gem listing cards used generic fallback strings (`"Gemstone"`) when `gem.image_alt` was null. | `gem-card.tsx`: `alt={gem.image_alt \|\| gem.name \|\| 'Gemstone'}` without carat weight, variety, or origin. | Poor accessibility and weak visual keyword signals for Google Images. |
| **10** | **JSON-LD Date & AdditionalProperty** | `Organization` JSON-LD schema had `foundingDate: 1964` (integer instead of ISO string); `additionalProperty` included `undefined` values. | `schema.tsx`: `foundingDate: 1964` and `additionalProperty` items with undefined values. | Triggered Schema.org validator warnings in Google Rich Results Test. |
| **11** | **Missing Social Meta** | Public pages (`/about`, `/certificates`, `/wholesale`, `/contact`, `/gems`, `/gems/category/...`) lacked explicit `openGraph` and `twitter` metadata. | Pages only exported basic `title` and `description`. | Poor click-through rates and broken link previews when shared on LinkedIn, Twitter, and WhatsApp. |
| **12** | **Utility Canonical URLs** | `/checkout`, `/account`, `/login`, and `/register` lacked explicit self-referential canonical URLs. | Missing `alternates: { canonical: "/..." }`. | Search engines could index parameter variations (e.g. `?redirect=...`). |

---

## 2. Fixes Implemented

### Phase 2: Technical SEO Infrastructure
1. **Robots Directives (`src/app/robots.ts`)**:
   - Upgraded disallow rules to full wildcard coverage:
     ```typescript
     disallow: [
       '/admin', '/admin/*',
       '/account', '/account/*',
       '/cart', '/cart/*',
       '/checkout', '/checkout/*',
       '/auth', '/auth/*',
       '/api', '/api/*',
       '/login', '/login/*',
       '/register', '/register/*',
     ]
     ```
   - Configured `host: baseUrl` alongside `sitemap: https://isuruceylon.com/sitemap.xml`.

2. **Dynamic Sitemap (`src/app/sitemap.ts`)**:
   - Configured dynamic `lastModified` matching recent release timestamps.
   - Filtered active gemstones to exclude out-of-stock pieces (`gem.inStock !== false`).
   - Added Google Image Sitemap integration using Next.js 16's `images?: string[]` on `MetadataRoute.Sitemap`, mapping category banner images and high-resolution gemstone galleries.

3. **Global Layout Metadata (`src/app/layout.tsx`)**:
   - Added self-referencing canonical root: `alternates: { canonical: './' }`.
   - Added granular crawler directives:
     ```typescript
     robots: {
       index: true,
       follow: true,
       googleBot: {
         index: true,
         follow: true,
         'max-video-preview': -1,
         'max-image-preview': 'large',
         'max-snippet': -1,
       },
     }
     ```
   - Added metadata attributes for `category`, `creator`, and `publisher`.

4. **Private Route Protection & Canonical Tags**:
   - Created `src/app/(shop)/cart/layout.tsx` to provide server-rendered metadata (`robots: { index: false, follow: false }`, canonical `/cart`).
   - Added `alternates: { canonical: '/checkout' }` to `/checkout`.
   - Added `alternates: { canonical: '/account' }` to `/account`.
   - Added `alternates: { canonical: '/login' }` to `/login`.
   - Added `alternates: { canonical: '/register' }` to `/register`.

### Phase 3: Product and On-Page SEO
1. **Product Meta Descriptions & Titles (`src/app/(shop)/gems/[slug]/page.tsx`)**:
   - Implemented dynamic, natural, 145–160 character meta descriptions utilizing actual database attributes:
     - Includes carat weight, cut, variety, origin, lab certification, and price in USD.
     - Never fabricates unverified claims.
   - Standardized page titles: `${gem.name} | Natural Ceylon ${gem.variety} | Isuru Gems`.

2. **Categorical Breadcrumb Navigation**:
   - Linked intermediate category level in both the visual HTML `<nav aria-label="Breadcrumb">` and the JSON-LD `BreadcrumbList`:
     `Home` → `Gemstones` → `[Category Name]` (`/gems/category/[slug]`) → `[Product Name]`.

3. **Orphaned Page Recovery (`/certificates`)**:
   - Integrated "Certification" into main navigation in `header.tsx` and `mobile-nav.tsx`.
   - Added "Certification & Authenticity" under Explore links in `footer.tsx`.
   - Added direct internal contextual links from individual product certificate badges and authenticity guarantee seals directly to `/certificates`.

4. **Internal Link Rectification**:
   - Fixed `hero-section.tsx` floating pod badges to link to canonical category routes: `/gems/category/blue-gems` and `/gems/category/pink-purple-gems`.
   - Fixed `category-cards.tsx` cards to target `/gems/category/blue-gems`, `/gems/category/pink-purple-gems`, and `/gems/category/gem-collections`.

5. **Attribute-Driven Image Alt Tags (`src/components/gems/gem-card.tsx`)**:
   - Replaced generic alt strings with descriptive attributes:
     ```typescript
     alt={
       gem.image_alt ||
       `${gem.carat_weight ? `${gem.carat_weight}ct ` : ''}${gem.name} - Natural ${gem.variety} from ${gem.origin}`
     }
     ```

6. **Social Graph Metadata**:
   - Added rich `openGraph` and `twitter` metadata across `/gems`, `/gems/category/[category]`, `/about`, `/wholesale`, `/certificates`, and `/contact`.

### Phase 4: Structured Data (JSON-LD)
1. **Schema Enhancements (`src/lib/seo/schema.tsx`)**:
   - Replaced third-party Unsplash URLs with local branded assets (`/isuru_images/blue1.webp`).
   - Formatted `foundingDate` as ISO 8601 string: `"1964"`.
   - Configured dynamic `priceValidUntil` set one year forward from the generation date.
   - Filtered out undefined or null values from `additionalProperty` to ensure compliant Schema.org output.
2. **Added BreadcrumbList Schemas**:
   - Embedded JSON-LD `BreadcrumbList` schemas across `/about`, `/certificates`, `/wholesale`, and `/contact`.

### Phase 5: Performance and Image SEO
1. **LCP Image Prioritization**:
   - Confirmed the homepage hero image (`/isuru_images/isuru_hero.webp`) uses `priority` and `fetchPriority="high"`.
2. **Catalog Lazy Loading**:
   - Gemstone listing grids utilize Next.js `Image` with standard responsive breakpoints and automatic lazy loading below the fold.
3. **React 19 Hydration Stability**:
   - Refactored `useIsMobile` in `hero-section.tsx` using `useSyncExternalStore` to eliminate synchronous `setState` in `useEffect`, preventing layout shifts (CLS) and passing ESLint with zero warnings.

---

## 3. Validation Results

| Test Item | Type | Target Route(s) | Status | Details / Evidence |
|---|---|---|---|---|
| **TypeScript Compilation** | Build | All 79 routes | **Passed** | `Finished TypeScript in 1751ms` with 0 type errors. |
| **ESLint Rules** | Lint | Entire workspace | **Passed** | React 19 hooks and Next.js rules validated; 0 errors. |
| **Production Build** | Next.js | Standalone Hostinger bundle | **Passed** | `next build --webpack` exited with code 0 (79/79 static/dynamic pages generated). |
| **Robots.txt Output** | Directives | `/robots.txt` | **Passed** | Verified wildcard disallow on `/admin/*`, `/account/*`, `/cart/*`, `/checkout/*`, `/auth/*`, `/api/*`. Host and Sitemap headers declared. |
| **Sitemap XML Output** | XML Format | `/sitemap.xml` | **Passed** | Serves static routes, category landing pages, active gems, and Google image extensions without runtime errors. |
| **Canonical Link Tags** | On-Page | All public & utility routes | **Passed** | Absolute self-referential canonical tags with `metadataBase: https://isuruceylon.com`. |
| **JSON-LD Schema** | Structured Data | Product details, Home, About, Certificates | **Passed** | Verified valid `Product`, `Offer`, `Organization`, `WebSite`, and `BreadcrumbList` without undefined properties. |
| **Internal Broken Links** | Navigation | Header, Footer, Hero, Category Cards | **Passed** | All category links point to canonical `/gems/category/...` rather than query strings. `/certificates` fully integrated. |
| **OpenGraph & Twitter Cards** | Social | Public marketing & catalog pages | **Passed** | Complete title, description, image, and url properties declared. |
| **Cart Page Protection** | Robots | `/cart` | **Passed** | Isolated in server layout with `noindex, nofollow`. |
| **Live Googlebot Fetch** | SERP Indexing | Live Server (`https://isuruceylon.com`) | **Not Tested** | Requires deployment of the newly built standalone bundle to Hostinger VPS. |
| **Google Search Console Verification** | External | DNS / GSC Dashboard | **Not Tested** | Requires external domain verification via Hostinger DNS TXT record. |
| **Field Core Web Vitals (CWV)** | Real User Monitoring | Real Chrome User Experience (CrUX) | **Not Tested** | Field CWV requires 28 days of live user traffic in Chrome. |

---

## 4. Modified Files Summary

| File Path | Description of Changes |
|---|---|
| [src/app/robots.ts](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/robots.ts) | Added wildcard exclusion rules (`/admin/*`, `/cart/*`, etc.) and set canonical host header. |
| [src/app/sitemap.ts](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/sitemap.ts) | Filtered in-stock gems, added Google Image Sitemap metadata, and standardized timestamps. |
| [src/app/layout.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/layout.tsx) | Added root canonical alternates, Googlebot max-image-preview directives, and publisher metadata. |
| [src/app/(shop)/cart/layout.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/(shop)/cart/layout.tsx) | Created server layout applying `noindex, nofollow` and canonical `/cart` for client cart page. |
| [src/app/(shop)/checkout/page.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/(shop)/checkout/page.tsx) | Added canonical URL to checkout metadata. |
| [src/app/(shop)/account/page.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/(shop)/account/page.tsx) | Added canonical URL to account metadata. |
| [src/app/(auth)/login/page.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/(auth)/login/page.tsx) | Added canonical URL to login metadata. |
| [src/app/(auth)/register/page.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/(auth)/register/page.tsx) | Added canonical URL to registration metadata. |
| [src/app/(shop)/gems/[slug]/page.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/(shop)/gems/[slug]/page.tsx) | Created dynamic attribute-based meta descriptions, category breadcrumb integration, and `/certificates` links. |
| [src/app/(shop)/gems/page.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/(shop)/gems/page.tsx) | Added OpenGraph and Twitter social metadata. |
| [src/app/(shop)/gems/category/[category]/page.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/(shop)/gems/category/[category]/page.tsx) | Added OpenGraph and Twitter cards for all category landing pages. |
| [src/app/(shop)/about/page.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/(shop)/about/page.tsx) | Added OpenGraph, Twitter cards, and `BreadcrumbList` JSON-LD. |
| [src/app/(shop)/certificates/page.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/(shop)/certificates/page.tsx) | Added OpenGraph, Twitter cards, and `BreadcrumbList` JSON-LD. |
| [src/app/(shop)/wholesale/page.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/(shop)/wholesale/page.tsx) | Added OpenGraph, Twitter cards, and `BreadcrumbList` JSON-LD. |
| [src/app/(shop)/contact/page.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/app/(shop)/contact/page.tsx) | Added OpenGraph, Twitter cards, and `BreadcrumbList` JSON-LD. |
| [src/components/layout/header.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/components/layout/header.tsx) | Added `/certificates` ("Certification") to desktop navigation. |
| [src/components/layout/mobile-nav.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/components/layout/mobile-nav.tsx) | Added `/certificates` ("Certification") to mobile drawer menu. |
| [src/components/layout/footer.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/components/layout/footer.tsx) | Added `/certificates` ("Certification & Authenticity") to footer explore links. |
| [src/components/home/hero-section.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/components/home/hero-section.tsx) | Fixed non-canonical query links to `/gems/category/...`; replaced synchronous state with `useSyncExternalStore`. |
| [src/components/home/category-cards.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/components/home/category-cards.tsx) | Fixed category card links to canonical `/gems/category/...`. |
| [src/components/gems/gem-card.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/components/gems/gem-card.tsx) | Implemented attribute-driven image alt text (carats, name, variety, origin). |
| [src/lib/seo/schema.tsx](file:///d:/Projects_YK/isuru_gems_ecommerce/src/lib/seo/schema.tsx) | Replaced Unsplash URLs, formatted foundingDate as ISO string, added priceValidUntil, and filtered undefined values. |

---

## 5. Google Search Console & Hostinger Deployment Instructions

To ensure Google indexes the upgraded site immediately upon deployment, follow these exact production steps:

### Step 1: Deploy Standalone Build to Hostinger
The build process has automatically prepared the `.next/standalone` folder via `node scripts/copy-standalone-assets.mjs`.
1. Upload `.next/standalone`, `.next/static`, and `public` to your Hostinger server.
2. Restart the PM2 process or Node daemon:
   ```bash
   pm2 restart isuru-gems
   ```
3. Test that `https://isuruceylon.com/robots.txt` and `https://isuruceylon.com/sitemap.xml` are accessible via curl or browser.

### Step 2: Domain Verification in Google Search Console
1. Navigate to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** → Choose **Domain** property (e.g. `isuruceylon.com`).
3. Copy the provided `google-site-verification` TXT record token.
4. Log in to **Hostinger hPanel** → **DNS Zone Editor**:
   - **Type:** `TXT`
   - **Name:** `@` (or leave blank depending on Hostinger prompt)
   - **TXT Value:** `google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
   - **TTL:** `14400`
5. Click **Verify** in Search Console.

### Step 3: Sitemap Submission
1. In Google Search Console, navigate to **Sitemaps** under the *Indexing* menu.
2. Under "Add a new sitemap", enter:
   ```text
   sitemap.xml
   ```
3. Click **Submit**. Google will fetch `https://isuruceylon.com/sitemap.xml` and report the number of discovered URLs (static routes + category pages + active gemstones).

### Step 4: URL Inspection & Priority Indexing Request
To accelerate indexing of key pages:
1. In the top search bar ("Inspect any URL in 'isuruceylon.com'"), test:
   - `https://isuruceylon.com/`
   - `https://isuruceylon.com/certificates`
   - `https://isuruceylon.com/gems`
   - Representative product page: `https://isuruceylon.com/gems/natural-blue-sapphire-2-05ct`
2. Click **Test Live URL**.
3. Verify:
   - HTTP response is 200 OK.
   - Canonical URL detected matches the declared URL.
   - Structured data (Product, Organization, BreadcrumbList) passes with 0 critical errors.
4. Click **Request Indexing**.

### Step 5: Monitoring Performance & Indexing Health
- **Performance Report:** Monitor weekly **Total Clicks**, **Total Impressions**, **Average CTR**, and **Average Position**. Look for high-impression, low-CTR gemstone queries to refine product titles.
- **Pages Report (Indexing):** Verify that excluded pages are strictly intended exclusions (`Blocked by 'noindex'` for `/cart`, `/checkout`, `/account`, `/login`). Ensure zero `Server error (5xx)` or `Soft 404` errors.
- **Rich Results / Enhancements:** Monitor the **Product Snippets** and **Merchant Listings** tab in Search Console to verify Google approves the structured data pricing and availability tags.

---

## 6. How to Run Lighthouse & Measure Performance

To objectively benchmark Core Web Vitals (CWV) before and after production deployment:

### Automated Headless CLI Commands
Install and run Lighthouse from your terminal:
```bash
# Install Lighthouse globally if not installed
npm install -g lighthouse

# Test Desktop Homepage Performance
lighthouse https://isuruceylon.com/ \
  --preset=desktop \
  --output=html \
  --output-path=./lighthouse-desktop-home.html \
  --view

# Test Mobile Product Page Performance
lighthouse https://isuruceylon.com/gems/natural-blue-sapphire-2-05ct \
  --form-factor=mobile \
  --screenEmulation.mobile \
  --throttling.rttMs=150 \
  --throttling.throughputKbps=1638.4 \
  --output=html \
  --output-path=./lighthouse-mobile-product.html \
  --view
```

### Manual Chrome DevTools Audit
1. Open Google Chrome in an **Incognito Window** (to disable extensions).
2. Press `F12` or `Ctrl + Shift + I` → Select the **Lighthouse** tab.
3. Select Categories: **Performance**, **Accessibility**, **Best Practices**, **SEO**.
4. Select Device: **Mobile** (Google indexes using a mobile-first crawler).
5. Click **Analyze page load**.
6. Target benchmarks:
   - **SEO:** 100 / 100
   - **Accessibility:** 95+ / 100
   - **Largest Contentful Paint (LCP):** < 2.5s
   - **Cumulative Layout Shift (CLS):** < 0.1
   - **Interaction to Next Paint (INP):** < 200ms

---

## 7. Recommended Next Priorities (Post-Deployment)

1. **Hostinger SSL & Canonical HTTPS Redirection:**
   - Verify that HTTP traffic (`http://isuruceylon.com` and `http://www.isuruceylon.com`) redirects with HTTP 301 to `https://isuruceylon.com`.
2. **Supabase Webhook for On-Demand Incremental Static Regeneration (ISR):**
   - Whenever an admin adds or edits a gemstone in Supabase, trigger Next.js `revalidatePath('/gems/[slug]')` and `revalidatePath('/sitemap.xml')` via an API route to instantly update sitemaps and cache without full redeployment.
3. **High-Resolution Gemstone Video Schema:**
   - If 360-degree gemstone rotation videos are added to the Supabase media library, implement `VideoObject` structured data to capture Google Video Rich Snippets.
4. **Google Merchant Center Feed:**
   - With valid `Product` and `Offer` schema now active, register an automated feed in Google Merchant Center to unlock free organic Google Shopping listings.
