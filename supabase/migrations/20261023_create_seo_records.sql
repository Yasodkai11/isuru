-- ========================================================
-- ISURU GEMS - PERSISTENT ADMINISTRATIVE SEO MODULE
-- Migration: 20261023_create_seo_records.sql
-- Description:
--  Creates the public.seo_records table to persist meta titles,
--  descriptions, canonical tags, OpenGraph cards, and schema types
--  edited within the Vault Admin Console (/admin/seo).
-- ========================================================

create table if not exists public.seo_records (
  id text primary key,
  page_path text unique not null,
  page_title text not null,
  meta_title text not null,
  meta_description text not null,
  keywords text[] default '{}',
  og_title text,
  og_description text,
  og_image text,
  canonical_url text not null,
  schema_type text default 'CollectionPage' not null,
  index_status text default 'indexed' not null,
  last_audited timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Index for instant lookup during Next.js SSR generateMetadata
create index if not exists idx_seo_records_page_path on public.seo_records (page_path);

-- Enable Row Level Security
alter table public.seo_records enable row level security;

-- 1. Public Read Access (for Next.js SSR / ISR pages and Googlebot crawls)
drop policy if exists "Public read access for seo_records" on public.seo_records;
create policy "Public read access for seo_records"
  on public.seo_records
  for select
  using (true);

-- 2. Staff & Service Role Write Access
drop policy if exists "Staff and service_role can manage seo_records" on public.seo_records;
create policy "Staff and service_role can manage seo_records"
  on public.seo_records
  for all
  using (
    auth.jwt() ->> 'role' = 'service_role'
    or exists (
      select 1 from public.staff_members
      where user_id = auth.uid() and status = 'active'
    )
  );

-- Seed Initial Base SEO Records
insert into public.seo_records (id, page_path, page_title, meta_title, meta_description, keywords, og_title, og_description, og_image, canonical_url, schema_type, index_status, last_audited)
values
  (
    'seo-01',
    '/',
    'Home Page (Showcase)',
    'Isuru Ceylon | Natural Ceylon Sapphires & Precious Island Gemstones',
    'Direct from the historic gem gravels of Ratnapura, Sri Lanka. Ethically mined, unheated Royal Blue Sapphires, Padparadscha, and fine Ceylon crystals certified by NGJA & GRS.',
    array['Ceylon Sapphires', 'Ratnapura Gemstones', 'Unheated Sapphires', 'Padparadscha Sri Lanka', 'NGJA Certified Gems'],
    'Isuru Ceylon | Natural Sapphires & Island Treasures',
    'Ethically mined, unheated certified Ceylon gemstones direct from Ratnapura.',
    '/isuru_images/blue1.webp',
    'https://isuruceylon.com',
    'Organization',
    'indexed',
    now()
  ),
  (
    'seo-02',
    '/gems',
    'Gemstones Catalog',
    'Natural Ceylon Gemstones & Sapphires Catalog | Isuru Ceylon',
    'Explore our collection of investment-grade natural Ceylon Sapphires, unheated Padparadscha, Rubies, and Star Sapphires. Certified by GRS, GIA, and NGJA with international vault delivery.',
    array['Buy Ceylon Sapphire', 'Natural Blue Sapphire', 'Loose Gemstones Sri Lanka', 'Investment Sapphires', 'Certified Ratnapura Gems'],
    'Natural Ceylon Gemstones & Sapphires Catalog | Isuru Ceylon',
    'Explore our collection of investment-grade natural Ceylon Sapphires, unheated Padparadscha, Rubies, and Star Sapphires.',
    '/isuru_images/blue1.webp',
    'https://isuruceylon.com/gems',
    'CollectionPage',
    'indexed',
    now()
  ),
  (
    'seo-03',
    '/gems/category/blue-gems',
    'Ceylon Blue Sapphires Category',
    'Ceylon Blue Sapphires | Royal Blue & Cornflower Blue Gems | Isuru Ceylon',
    'Discover authentic unheated Ceylon Blue Sapphires from Ratnapura and Elahera. Renowned for velvety saturation, open colors, and superior crystal luster. Complete with lab certification.',
    array['Ceylon Blue Sapphire', 'Royal Blue Sapphire Price', 'Cornflower Sapphire Sri Lanka', 'Unheated Blue Corundum'],
    'Ceylon Blue Sapphires | Royal Blue & Cornflower Blue Gems | Isuru Ceylon',
    'Discover authentic unheated Ceylon Blue Sapphires from Ratnapura and Elahera.',
    '/isuru_images/categories1.webp',
    'https://isuruceylon.com/gems/category/blue-gems',
    'CollectionPage',
    'indexed',
    now()
  ),
  (
    'seo-04',
    '/gems/category/pink-purple-gems',
    'Padparadscha & Pink Sapphires Category',
    'Padparadscha & Pink Sapphires | Lotus Sunset Color Gemstones | Isuru Ceylon',
    'Exquisite natural Ceylon Padparadscha sapphires balancing delicate lotus pink and fiery twilight orange. Certified unheated by SSEF and GRS with verified provenance.',
    array['Padparadscha Sapphire Sri Lanka', 'Lotus Flower Gemstone', 'Natural Pink Orange Sapphire', 'Rare Ceylon Gemstones'],
    'Padparadscha & Pink Sapphires | Lotus Sunset Color Gemstones | Isuru Ceylon',
    'Exquisite natural Ceylon Padparadscha sapphires balancing delicate lotus pink and fiery twilight orange.',
    '/isuru_images/Padparadscha%20Sapphire.webp',
    'https://isuruceylon.com/gems/category/pink-purple-gems',
    'CollectionPage',
    'indexed',
    now()
  ),
  (
    'seo-05',
    '/wholesale',
    'B2B Wholesale Atelier',
    'Wholesale Ceylon Gemstone Parcels & Atelier Supply | Isuru Ceylon',
    'Direct source calibrated parcels, layout pairs, and high-volume unheated Ceylon sapphires for international jewelry ateliers, watchmakers, and gem merchants.',
    array['Wholesale Sapphires Sri Lanka', 'Calibrated Ceylon Parcels', 'Gemstone Export Ratnapura', 'B2B Gem Suppliers'],
    'Wholesale & B2B Gemstone Parcels | Isuru Ceylon',
    'Direct mine-to-market calibrated parcels, layout pairs, and high-volume unheated Ceylon sapphires authenticated by the NGJA.',
    '/isuru_images/blue1.webp',
    'https://isuruceylon.com/wholesale',
    'Organization',
    'indexed',
    now()
  ),
  (
    'seo-06',
    '/about',
    'Our Heritage & Provenance',
    'Our Story: From Generational Heritage to the Digital World | Isuru Ceylon',
    'The authentic story of Isuru Gems. Rooted in the legacies of Reginald Mendis (b. 1922) and Premaratne Pathinayake, combining family mining heritage with modern gemology and official NGJA licensing (Reg: 202610DL42288).',
    array['Isuru Gems Heritage', 'Ceylon Gem Mining History', 'Ratnapura Legacy', 'NGJA Licensed Dealer'],
    'Our Story: A Legacy of Gems, A Future of Trust | Isuru Ceylon',
    'From generational Sri Lankan mining heritage to a trusted international digital presence. Licensed NGJA Dealer 202610DL42288.',
    '/isuru_images/blue1.webp',
    'https://isuruceylon.com/about',
    'AboutPage',
    'indexed',
    now()
  ),
  (
    'seo-07',
    '/contact',
    'Concierge & Private Viewings',
    'Bespoke Commissions & Concierge | Isuru Ceylon',
    'Contact the gemological concierge at Isuru Gems for loose unheated Ceylon sapphire acquisition, custom ring commissions, or private viewings in Colombo and Ratnapura.',
    array['Gem Concierge Colombo', 'Bespoke Sapphire Rings', 'Custom Gemstone Commission', 'Isuru Gems Contact'],
    'Bespoke Commissions & Concierge | Isuru Ceylon',
    'Direct inquiry with our master gemologists in Ratnapura and Colombo for natural certified Ceylon sapphires, custom jewelry, or salon appointments.',
    '/isuru_images/contactus.webp',
    'https://isuruceylon.com/contact',
    'ContactPage',
    'indexed',
    now()
  ),
  (
    'seo-08',
    '/certificates',
    'Laboratory Authenticity & NGJA',
    'Gemstone Certification & Authenticity | Isuru Ceylon',
    'All Isuru Gems stones are certified natural corundum authenticated by the National Gem and Jewellery Authority of Sri Lanka (NGJA), GIA, and GRS Swisslab with lifetime guarantees.',
    array['NGJA Certification', 'GRS Swisslab Sapphire', 'GIA Certified Gems Sri Lanka', 'Unheated Gem Verification'],
    'Gemstone Certification & Authenticity | Isuru Ceylon',
    'Every natural Ceylon gemstone is certified by the National Gem and Jewellery Authority (NGJA), GIA, or GRS Swisslab with an unconditional lifetime provenance guarantee.',
    '/isuru_images/blue1.webp',
    'https://isuruceylon.com/certificates',
    'AboutPage',
    'indexed',
    now()
  )
on conflict (page_path) do nothing;
