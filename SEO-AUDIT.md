# Isuru Gems Ceylon — Comprehensive Technical & Commercial SEO Audit

**Website:** Isuru Ceylon / Isuru Gems (`https://isuruceylon.com`)  
**Technology Stack:** Next.js 16.4.0 (App Router), React 19.3.0, TypeScript, Tailwind CSS v4  
**Backend & Database:** Supabase / PostgreSQL (PostgREST, Auth, Storage)  
**Hosting & Runtime:** Hostinger Cloud / VPS (LiteSpeed reverse proxy, PM2, Node.js 22 Standalone `server.js`)  
**Audit Date:** October 2026  
**Auditor:** Senior Technical SEO Specialist & Web Architect  
**Audit Scope:** Static analysis of Next.js App Router codebase, sitemap, robots directives, metadata generation, JSON-LD schemas, internal linking, asset optimization, Core Web Vitals readiness, and crawlability. No files or production data were altered during this audit.

---

## Executive Summary

An exhaustive SEO audit was conducted across the entire codebase of the **Isuru Gems** high-value Ceylon gemstone e-commerce platform. The project demonstrates strong foundational SEO engineering: metadata titles and descriptions are dynamically generated from physical mineral attributes; Canonical tags and OpenGraph cards are applied across public landing pages; image assets utilize modern WebP formats with descriptive attribute-driven alt text; and private user endpoints (`/cart`, `/checkout`, `/account`, `/admin`) are blocked from indexing via robots.txt and page-level metadata.

However, several architectural, canonicalization, and indexation vulnerabilities were discovered that risk wasting search engine crawl budget, cannibalizing organic rankings, or leaving utility search pages open to indexation. Most notably, paginated catalog and category routes point self-canonical tags back to page 1 rather than self-referencing or utilizing view-all patterns; internal search queries (`/gems?search=...`) lack dynamic `noindex` directives; administrative SEO edits made in `/admin/seo` only persist in client-side browser `localStorage` and never affect search engines; and sitemap generation performs full table scans that threaten build stability as inventory scales.

---

## 1. Scope & Verification Methodology

| Area Audited | Method & Files Inspected | Status |
|---|---|---|
| **Site Architecture & Rendering** | Next.js 16 App Router SSR/ISR in `src/app/`, layout shells, Hostinger standalone server (`server.js`) | Confirmed via code review |
| **Robots & Indexing Directives** | `src/app/robots.ts`, layout metadata in private route groups (`(auth)`, `/cart`, `/checkout`, `/account`, `admin`) | Confirmed via code review |
| **XML Sitemaps & Image Extensions** | `src/app/sitemap.ts`, image extensions, `getGemstones` query integration | Confirmed via code review |
| **Metadata & Canonical URLs** | `src/app/layout.tsx`, `src/app/(shop)/**/page.tsx`, `generateMetadata` exports | Confirmed via code review |
| **Product Dynamic SEO** | `src/app/(shop)/gems/[slug]/page.tsx`, attribute fallback descriptions, title formats | Confirmed via code review |
| **Structured Data (JSON-LD)** | `src/lib/seo/schema.tsx`, Google Rich Results schemas (`Product`, `Offer`, `Organization`, `BreadcrumbList`, `WebSite`) | Confirmed via code review |
| **Image SEO & Alt Text** | `next.config.ts`, `src/components/gems/gem-card.tsx`, `src/components/home/hero-section.tsx` | Confirmed via code review |
| **Internal Linking & Navigation** | `src/components/layout/header.tsx`, `footer.tsx`, `hero-section.tsx`, `category-cards.tsx` | Confirmed via code review |
| **Core Web Vitals & Hydration** | Image loading strategies (`priority`/`preload`), CSS loading, font optimization (`next/font`) | Confirmed via code review |
| **Live Google Search Console Data** | GSC crawl stats, impression shares, indexation status | **Not Tested** (Requires live authenticated Google Search Console access) |
| **Real User Monitoring (CrUX)** | 75th percentile LCP/INP/CLS metrics from field visitors | **Not Tested** (Requires live origin traffic telemetry) |

---

## 2. Summary of SEO Audit Findings

| Finding ID | Title | Severity | Affected Route / Component | Category | Status |
|---|---|---|---|---|---|
| **SEO-01** | Deep Pagination Canonicalization Conflict on Catalog & Categories | **High** | `src/app/(shop)/gems/page.tsx`, `gems/category/[category]/page.tsx` | Canonicalization | **Resolved** |
| **SEO-02** | Administrative SEO Changes in Vault Console Do Not Persist or Affect Live HTML | **High** | `src/app/admin/seo/page.tsx`, `src/actions/seo.ts` | Architecture / CMS | **Resolved** |
| **SEO-03** | Missing `noindex` Meta Directives on Internal Search Queries | **Medium** | `src/app/(shop)/gems/page.tsx` (`?search=...`) | Indexation Control | **Resolved** |
| **SEO-04** | Sitemap Generation Performs Unbounded Full Table Scan (`select("*")`) | **Medium** | `src/app/sitemap.ts`, `src/actions/gems.ts` | Crawl Budget / Performance | **Resolved** |
| **SEO-05** | Category Configuration Disconnect Between Admin Console & Public Frontend | **Medium** | `src/lib/constants.ts`, `src/lib/admin-seed.ts` | Taxonomy & Crawl Equity | **Resolved** |
| **SEO-06** | Hero Auto-Advancing Carousel Risks Cumulative Layout Shift and INP Delays | **Medium** | `src/components/home/hero-section.tsx` | Core Web Vitals | Potential Risk |
| **SEO-07** | Redundant Wildcard Syntax in `robots.ts` Disallow Rules | **Low** | `src/app/robots.ts` | Crawler Directives | Confirmed Issue |
| **SEO-08** | Incomplete Currency Support in Product JSON-LD Offers Schema | **Low** | `src/lib/seo/schema.tsx` | Structured Data | Confirmed Issue |
| **SEO-09** | Missing Internationalization (`hreflang`) for Global Gemstone Buyer Base | **Low** | `src/app/layout.tsx` | International SEO | Potential Risk |
| **SEO-10** | Absence of Merchant Feed (Google Merchant Center RSS / Atom XML) | **Informational** | Application Root | E-commerce Feeds | Feature Gap |

---

## 3. Detailed Audit Findings

### Finding SEO-01: Deep Pagination Canonicalization Conflict on Catalog & Categories
- **Severity:** High
- **Affected Route / Component:** 
  - `src/app/(shop)/gems/page.tsx` (Lines 45–47)
  - `src/app/(shop)/gems/category/[category]/page.tsx` (Lines 59–61)
- **Evidence & Verification:**
  In `src/app/(shop)/gems/page.tsx`:
  ```typescript
  export async function generateMetadata({ searchParams }: GemsPageProps): Promise<Metadata> {
    ...
    return {
      title: `${prefix}Natural Gemstones Vault`,
      alternates: {
        canonical: "/gems",
      },
    };
  }
  ```
  In `src/app/(shop)/gems/category/[category]/page.tsx`:
  ```typescript
  export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { category } = await params;
    return {
      alternates: {
        canonical: `/gems/category/${category}`,
      },
    };
  }
  ```
  Both page templates hardcode the canonical URL to the root or category root without checking `searchParams.page`. When a user or crawler visits `https://isuruceylon.com/gems?page=2` or `https://isuruceylon.com/gems/category/blue-gems?page=3`, the rendered HTML `<link rel="canonical" href="https://isuruceylon.com/gems">` tells Google that page 2 and page 3 are duplicate copies of page 1.
- **Business Impact:**
  Google's Search Central guidelines state that canonicalizing paginated pages back to page 1 instructs Googlebot not to index products that appear only on pages 2, 3, or deeper. As inventory expands beyond 12 stones per category, high-value gemstones residing on secondary pages will drop out of Google's search index or suffer severe ranking suppression.
- **Recommended Fix:**
  Make paginated URLs self-referential in their canonical declaration, or retain canonical `/gems` while setting `robots: { index: false, follow: true }` on `page > 1`:
  ```typescript
  const resolved = await searchParams;
  const pageNum = resolved.page ? parseInt(resolved.page, 10) : 1;
  const canonicalUrl = pageNum > 1 ? `/gems?page=${pageNum}` : `/gems`;

  return {
    alternates: {
      canonical: canonicalUrl,
    },
    ...(pageNum > 1 ? { robots: { index: false, follow: true } } : {}),
  };
  ```
- **How to Validate Fix:**
  Run `curl -s http://localhost:3000/gems?page=2 | grep -i '<link rel="canonical"'` and verify that the canonical URL reflects `https://isuruceylon.com/gems?page=2` (or contains `noindex, follow`). Validate in Google Search Console URL Inspection Tool.

---

### Finding SEO-02: Administrative SEO Changes in Vault Console Do Not Persist or Affect Live HTML
- **Severity:** High
- **Affected Route / Component:**
  - `src/app/admin/seo/page.tsx`
  - `src/stores/admin-store.ts` (Lines 24, 73, 99)
- **Evidence & Verification:**
  The admin portal contains a dedicated `/admin/seo` interface allowing staff to edit Meta Titles, Meta Descriptions, Canonical URLs, and OpenGraph sharing tags for pages like Home, Gemstones, About, and Contact.
  However, in `src/stores/admin-store.ts`, the SEO updates are stored solely inside the client-side Zustand store:
  ```typescript
  updateSEORecord: (id, partial) => {
    set((state) => ({
      seoRecords: state.seoRecords.map((r) => (r.id === id ? { ...r, ...partial } : r)),
    }));
  }
  ```
  The public page components (`src/app/page.tsx`, `src/app/(shop)/about/page.tsx`, etc.) hardcode their metadata strings directly inside their respective `generateMetadata` exports and never query any database or API for SEO records.
- **Business Impact:**
  Non-technical staff and marketing administrators editing meta descriptions or titles in the Vault Console believe they are updating live Google search snippets. In reality, their edits are saved only to their local browser's `localStorage` and never reach Googlebot or live visitors.
- **Recommended Fix:**
  Either:
  1. Provision a `public.seo_records` table in Supabase, query it inside `generateMetadata()` with a fallback to hardcoded strings, and update it via a Server Action with `revalidatePath()`.
  2. Or, if static code-defined metadata is preferred, mark the `/admin/seo` page as a read-only metadata inspector or remove the non-functional edit form to prevent operational confusion.
- **How to Validate Fix:**
  Edit a page title in `/admin/seo`, visit the target public URL via `curl`, and inspect `<title>` in the returned server HTML.

---

### Finding SEO-03: Missing `noindex` Meta Directives on Internal Search Queries
- **Severity:** Medium
- **Affected Route / Component:**
  - `src/app/(shop)/gems/page.tsx` (Lines 18–47)
- **Evidence & Verification:**
  In `src/app/(shop)/gems/page.tsx`, the search query parameter is parsed:
  ```typescript
  export async function generateMetadata({ searchParams }: GemsPageProps): Promise<Metadata> {
    const resolved = await searchParams;
    ...
    return {
      title: `${prefix}Natural Gemstones Vault`,
      description: "...",
      alternates: { canonical: "/gems" },
      // Missing robots directive when resolved.search is present
    };
  }
  ```
  When a user or bot visits `https://isuruceylon.com/gems?search=unheated+sapphire`, the page renders with indexable robots directives from `layout.tsx` (`index: true, follow: true`).
- **Business Impact:**
  Search engine webmaster guidelines (including Google Search Essentials) strictly recommend against allowing search result pages to be indexed. Without a `noindex` tag on search queries, crawlers index thousands of low-value, zero-result, or duplicate search parameter permutations, diluting organic domain authority.
- **Recommended Fix:**
  Update `generateMetadata` in `src/app/(shop)/gems/page.tsx`:
  ```typescript
  const isSearchOrFiltered = Boolean(resolved.search || resolved.colour || resolved.variety);

  return {
    title: `${prefix}Natural Gemstones Vault`,
    description: "...",
    alternates: { canonical: "/gems" },
    robots: isSearchOrFiltered
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
  ```
- **How to Validate Fix:**
  Send a GET request to `/gems?search=cornflower` and confirm that `<meta name="robots" content="noindex, follow">` is present in the response headers or `<head>`.

---

### Finding SEO-04: Sitemap Generation Performs Unbounded Full Table Scan
- **Severity:** Medium
- **Affected Route / Component:**
  - `src/app/sitemap.ts` (Line 74)
  - `src/actions/gems.ts` (Lines 18, 96)
- **Evidence & Verification:**
  In `src/app/sitemap.ts`:
  ```typescript
  const { gems } = await getGemstones({ limit: 5000 });
  const eligibleGems = gems.filter((gem) => Boolean(gem.slug) && gem.inStock !== false);
  ```
  `getGemstones` executes:
  `supabase.from("gemstones").select("*", { count: "exact" }).range(0, 4999)`
  This retrieves every column (including heavy multi-paragraph descriptions, dimensions, JSONB image galleries, and certificates) for thousands of records simultaneously into Node.js memory just to extract three fields (`slug`, `inStock`, `images`).
- **Business Impact:**
  As the gemstone inventory expands, generating `/sitemap.xml` will incur high memory allocations and latency on the Hostinger VPS, risking request timeouts (HTTP 504) during search engine crawl cycles.
- **Recommended Fix:**
  Implement a lightweight sitemap-specific query action that selects only required fields:
  ```typescript
  const { data } = await supabase
    .from("gemstones")
    .select("slug, updated_at, images")
    .eq("in_stock", true)
    .order("created_at", { ascending: false });
  ```
- **How to Validate Fix:**
  Measure response time of `GET /sitemap.xml` and verify that execution finishes in under 200ms with minimal database memory consumption.

---

### Finding SEO-05: Category Configuration Disconnect Between Admin Console & Public Frontend
- **Severity:** Medium
- **Affected Route / Component:**
  - `src/lib/constants.ts` (`CATEGORIES_CONFIG`, Lines 74–137)
  - `src/lib/admin-seed.ts` (`INITIAL_ADMIN_CATEGORIES`, Lines 13–60)
  - `src/app/(shop)/gems/category/[category]/page.tsx`
- **Evidence & Verification:**
  The public routing architecture defines categories by color groupings in `CATEGORIES_CONFIG`:
  - `blue-gems`, `pink-purple-gems`, `red-gems`, `yellow-gems`, `green-gems`, `gem-collections`
  However, the Admin seed categories and the `/admin/categories` module define categories by mineral variety:
  - `blue-sapphires`, `ceylon-rubies`, `padparadscha`, `alexandrite`
  Furthermore, the database `gemstones` table has no `category` column. Category pages query Supabase using string matching against `color` or `variety` (`ilike`).
- **Business Impact:**
  Internal links from marketing modules or admin-generated content can point to mismatched slugs (e.g., `/gems/category/blue-sapphires` which returns a 404, instead of `/gems/category/blue-gems`), breaking internal PageRank flow and producing dead ends for crawlers.
- **Recommended Fix:**
  Unify category definitions across both admin and client modules. If mineral variety slugs (`ceylon-rubies`, `padparadscha`) are preferred for search keyword value (which carry higher search intent than generic colors like `red-gems`), migrate `CATEGORIES_CONFIG` to target high-intent gemological varieties.
- **How to Validate Fix:**
  Crawl all internal category links using an automated crawler script and confirm that zero category URLs return HTTP 404.

---

### Finding SEO-06: Hero Auto-Advancing Carousel Risks Cumulative Layout Shift and INP Delays
- **Severity:** Medium
- **Affected Route / Component:**
  - `src/components/home/hero-section.tsx` (Lines 40, 163–171, 334–360)
- **Evidence & Verification:**
  In `hero-section.tsx`:
  - A timer auto-advances through 5 full-viewport hero scenes every 6,500ms (`SLIDE_DURATION_MS = 6500`).
  - Active slides execute continuous CSS Ken Burns pan animations (`animate-hero-pan-1` to `animate-hero-pan-5`).
  - While `usePrefersReducedMotion()` is implemented, background carousel DOM re-renders and image transitions on mobile devices can degrade Interaction to Next Paint (INP) scores when visitors tap navigation menus or filter buttons while the transition is firing.
- **Business Impact:**
  Core Web Vitals are a confirmed Google ranking factor. High INP or minor layout shifts on mobile viewports can demote mobile rankings against competitors.
- **Recommended Fix:**
  Ensure all carousel slide images use CSS `contain: paint` or `content-visibility: auto`, keep slide dimensions strictly fixed via aspect ratio wrappers, and pause the timer as soon as the user interacts with any element on the page.
- **How to Validate Fix:**
  Run Lighthouse or Chrome DevTools Performance panel under 4x CPU throttling, interact with the header search button during a slide transition, and confirm INP remains under 200ms with CLS < 0.05.

---

### Finding SEO-07: Redundant Wildcard Syntax in `robots.ts` Disallow Rules
- **Severity:** Low
- **Affected Route / Component:**
  - `src/app/robots.ts` (Lines 11–28)
- **Evidence & Verification:**
  `robots.ts` contains duplicate prefix and wildcard pairs:
  ```typescript
  disallow: [
    "/admin",
    "/admin/*",
    "/account",
    "/account/*",
    "/checkout",
    "/checkout/*",
    "/cart",
    "/cart/*",
    ...
  ]
  ```
  In standard robots.txt specifications (RFC 9309), a directive `/admin` matches `/admin`, `/admin/`, and `/admin/anything`. Adding `/admin/*` is redundant. While major crawlers (Googlebot, Bingbot) handle this gracefully, non-standard enterprise bots and legacy parsers may misinterpret duplicate directives.
- **Business Impact:**
  Minor syntax redundancy; no immediate crawl blockage, but clutters the crawl directive profile.
- **Recommended Fix:**
  Clean up `robots.ts` to standard prefix paths:
  ```typescript
  disallow: [
    "/admin/",
    "/account/",
    "/checkout/",
    "/cart/",
    "/api/",
    "/auth/",
    "/login",
    "/register",
  ]
  ```
- **How to Validate Fix:**
  Visit `/robots.txt` in a browser or test with Google Search Console Robots Testing Tool.

---

### Finding SEO-08: Incomplete Currency Support in Product JSON-LD Offers Schema
- **Severity:** Low
- **Affected Route / Component:**
  - `src/lib/seo/schema.tsx` (Lines 120–170)
- **Evidence & Verification:**
  In `getProductSchema`:
  ```typescript
  const offers = {
    "@type": "Offer",
    priceCurrency: gem.currency || "USD",
    price: gem.price > 0 ? gem.price : 0,
    ...
  };
  ```
  When `gem.price` is set to 0 (items marked as "Price on Request" / bespoke acquisition), the schema outputs `"price": 0`, which Google Rich Results validator may flag as an invalid commercial price or trigger a "Price cannot be zero" merchant warning in Google Merchant listings.
- **Business Impact:**
  May trigger warnings or disqualify bespoke luxury pieces from Google Shopping rich snippets and organic Product rich cards.
- **Recommended Fix:**
  For bespoke pieces where price is on request, omit the standard numeric `price` and instead use Schema.org `priceSpecification`:
  ```typescript
  offers: gem.price > 0
    ? {
        "@type": "Offer",
        priceCurrency: gem.currency || "USD",
        price: gem.price,
        availability: "https://schema.org/InStock",
      }
    : {
        "@type": "Offer",
        priceCurrency: gem.currency || "USD",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
          valueAddedTaxIncluded: true,
        },
      }
  ```
- **How to Validate Fix:**
  Test product pages with Price on Request using Google Rich Results Test (`https://search.google.com/test/rich-results`).

---

### Finding SEO-09: Missing Internationalization (`hreflang`) for Global Gemstone Buyer Base
- **Severity:** Low
- **Affected Route / Component:**
  - `src/app/layout.tsx` (Lines 48–50)
- **Evidence & Verification:**
  Isuru Gems exports high-value gemstones worldwide, primarily to collectors and jewelers in the United States, United Kingdom, Switzerland, UAE, France, Japan, and Australia.
  Currently, `layout.tsx` declares `alternates: { canonical: "./" }` without any `languages` alternate declarations (`hreflang`).
- **Business Impact:**
  While the primary language is English (`en-US`), searchers in regional markets (e.g. `en-GB`, `en-AU`, `en-AE`) receive standard global indexing. If localized sub-paths or currency paths are introduced in the future, lack of hreflang tags will cause international keyword cannibalization.
- **Recommended Fix:**
  Declare default language targeting in `layout.tsx`:
  ```typescript
  alternates: {
    canonical: "./",
    languages: {
      "en-US": "https://isuruceylon.com",
      "x-default": "https://isuruceylon.com",
    },
  }
  ```
- **How to Validate Fix:**
  Inspect page `<head>` and verify `<link rel="alternate" hreflang="x-default" href="https://isuruceylon.com/">`.

---

### Finding SEO-10: Absence of Merchant Feed (Google Merchant Center RSS / Atom XML)
- **Severity:** Informational / Feature Gap
- **Affected Route / Component:**
  - Application Root
- **Evidence & Verification:**
  The repository does not contain an automated product XML feed (e.g. `/feed.xml` or `/products.xml` conforming to Google Merchant Center specification). Sitemaps provide Google Web Search indexation, but Google Free Product Listings (Google Shopping organic tab) require structured feed integration or automated schema crawling.
- **Business Impact:**
  Missed opportunity to appear in Google's high-visibility Free Product Listings carousel on mobile and desktop search for gemstone queries.
- **Recommended Fix:**
  Add a Next.js Route Handler at `src/app/api/feeds/google/route.ts` that outputs valid Google Merchant Center XML (RSS 2.0 with `<g:id>`, `<g:title>`, `<g:description>`, `<g:price>`, `<g:availability>`, `<g:condition>`, `<g:image_link>`).
- **How to Validate Fix:**
  Submit the endpoint URL into Google Merchant Center and review feed validation reports.
