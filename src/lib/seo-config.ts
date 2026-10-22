/**
 * ============================================================================
 * ISURU CEYLON GEMS — AUTHORITATIVE SEO, GEO & AEO CONFIGURATION
 * ============================================================================
 * Single source of truth for:
 * - Canonical Brand Entity & Naming
 * - Contact, NAP (Name, Address, Phone) & Dual Location Data
 * - Social Media (sameAs) & External Verification Profiles
 * - AI Engine / LLM Optimization Constants
 * - Core Knowledge Graph & Declarative Facts
 */

export const SEO_CONFIG = {
  // 1. CANONICAL BRAND IDENTITY
  brand: {
    /** Canonical brand name to be used consistently across all titles, headers, schema and text */
    name: "Isuru Ceylon Gems",
    /** Short form allowed in compact layouts and breadcrumbs */
    shortName: "Isuru Ceylon",
    /** Secondary historical and colloquial names for schema alternateName */
    alternateNames: [
      "Isuru Ceylon",
      "Isuru Gems",
      "Isuru Ceylon (Pvt) Ltd",
      "Isuru Gems Ceylon",
    ],
    tagline: "Natural Unheated Ceylon Sapphires & Precious Island Gemstones",
    subheading: "From Generational Heritage to the Digital World",
    /** Plain-text 2-sentence entity statement for Home, Our Story and AI engines */
    entityStatement:
      "Isuru Ceylon Gems is a registered gemstone dealer in Ratnapura, Sri Lanka, selling natural, unheated Ceylon sapphires, rubies, padparadschas and spinels, founded on gem-mining heritage dating back to the 1920s. Operating under National Gem and Jewellery Authority dealer license 202610DL42288, the bureau combines generational alluvial mining tradition with internationally certified gemological authentication.",
    foundingYear: 1964,
    ancestralHeritageYear: 1922,
    licenseNumber: "202610DL42288",
    licenseAuthority: "National Gem and Jewellery Authority of Sri Lanka (NGJA)",
  },

  // 2. SITE URLS & CANONICAL DOMAIN
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://isuruceylon.com",
    titleTemplate: "%s | Isuru Ceylon Gems",
    defaultTitle: "Isuru Ceylon Gems | Natural Unheated Ceylon Sapphires from Ratnapura, Sri Lanka",
    defaultDescription:
      "Isuru Ceylon Gems is a registered gemstone dealer in Ratnapura and Colombo, Sri Lanka (NGJA Reg: 202610DL42288). Direct source of natural, unheated Ceylon royal blue sapphires, padparadschas, rubies and spinels with GIA, GRS and NGJA certification.",
    ogImage: "/isuru_images/blue1.webp",
    locale: "en_US",
    language: "en",
  },

  // 3. CONTACT & CONCIERGE DETAILS
  contact: {
    phone: "+94 76 273 5153",
    phoneTel: "+94762735153",
    whatsapp: "+94 76 273 5153",
    email: "uththiyaisurudewamendis@gmail.com",
    conciergeLead: "Uththiya Isuru Dewa Mendis",
  },

  // 4. DUAL PHYSICAL LOCATIONS (RATNAPURA & COLOMBO)
  locations: {
    ratnapura: {
      name: "Isuru Ceylon Gems — Ratnapura Bureau & Lapidary",
      hubType: "Mining Operations, Lapidary Atelier & Mine-Head Trade",
      address: {
        streetAddress: "Main Street",
        addressLocality: "Ratnapura",
        addressRegion: "Sabaragamuwa Province",
        postalCode: "70000",
        addressCountry: "LK",
      },
      geo: {
        latitude: 6.6828,
        longitude: 80.4036,
      },
      hasMap: "https://maps.google.com/?q=Ratnapura,+Sri+Lanka",
      phone: "+94 76 273 5153",
      openingHours: ["Mo-Sa 09:00-18:00"],
      visitingPolicy: "Private viewing by advance appointment or direct field expedition.",
    },
    colombo: {
      name: "Isuru Ceylon Gems — Colombo VIP Salon & Export Concierge",
      hubType: "Private Collector Salon & International Export Bureau",
      address: {
        streetAddress: "Havelock Town / Colombo 00500",
        addressLocality: "Colombo",
        addressRegion: "Western Province",
        postalCode: "00500",
        addressCountry: "LK",
      },
      geo: {
        latitude: 6.892,
        longitude: 79.866,
      },
      hasMap:
        "https://maps.google.com/maps/search/Colombo%2000500%2C%20Sri%20Lanka/@6.892,79.866,16z?hl=en",
      phone: "+94 76 273 5153",
      openingHours: ["Mo-Sa 10:00-19:00"],
      visitingPolicy: "Private high-security concierge viewing by prior appointment.",
    },
  },

  // 5. FOUNDERS & HISTORICAL ENTITIES
  founders: [
    {
      name: "Reginald Mendis",
      birthYear: 1922,
      role: "Alluvial Gem Mining Pioneer & Grandfather",
      description:
        "Pioneering Ratnapura alluvial pit miner and merchant whose 1920s riverbank gravel workings established the generational gemstone legacy of Isuru Ceylon Gems.",
    },
    {
      name: "Premaratne Pathinayake",
      role: "Plantation Proprietor & Traditional Gem Merchant",
      description:
        "Sabaragamuwa agricultural landholder and gem merchant whose direct miner alliances cemented the family's ethical sourcing traditions.",
    },
    {
      name: "Uththiya Isuru Dewa Mendis",
      role: "Founder, Registered Gem Dealer & Gemologist",
      description:
        "Third-generation Sri Lankan gem merchant, licensed by the National Gem and Jewellery Authority (License: 202610DL42288), advancing scientific gemological testing and direct international client relations.",
    },
  ],

  // 6. EXTERNAL PROFILES & SOCIAL MEDIA (sameAs)
  // Note: TODO placeholders are explicitly marked for user confirmation
  sameAs: [
    "https://www.instagram.com/isurugems",
    "https://www.facebook.com/isurugems",
    "https://www.linkedin.com/company/isuru-gems",
    // TODO: Confirm official YouTube channel link once published
    "https://www.youtube.com/@isurugems",
    // TODO: Confirm Google Business Profile verification URL
    "https://maps.google.com/?cid=isuru-ceylon-gems",
    // TODO: Supply Wikidata entity URI if created (e.g. https://www.wikidata.org/wiki/Q...)
    "https://www.wikidata.org/wiki/Q_TODO_ISURU_CEYLON_GEMS",
  ],

  // 7. AI CRAWLERS & SEARCH ENGINE AGENTS (Strictly Allowed in robots.txt)
  aiCrawlers: [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "PerplexityBot",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
  ],

  // 8. GEMOLOGICAL EXPERTISE & KNOWLEDGE DOMAINS (for knowsAbout schema)
  knowsAbout: [
    "Ceylon Blue Sapphires",
    "Royal Blue Sapphire",
    "Cornflower Blue Sapphire",
    "Padparadscha Sapphires",
    "Natural Ceylon Rubies",
    "Pigeon Blood Rubies",
    "Ceylon Spinel",
    "Chrysoberyl Alexandrite",
    "Star Sapphires (Asterism)",
    "Unheated Natural Gemstones",
    "Thermal Enhancement Detection",
    "Ratnapura Alluvial Gem Mining",
    "National Gem and Jewellery Authority of Sri Lanka",
    "GIA Gemstone Authentication",
    "GRS Swiss Gemstone Certification",
    "Gemmological Institute of Colombo (GIC)",
    "International Insured Gem Courier Shipping",
  ],

  // 9. DECLARATIVE MACHINE-READABLE FACTS (For GEO & AI Quote Verification)
  facts: [
    {
      fact: "Isuru Ceylon Gems is headquartered in Ratnapura and Colombo, Sri Lanka.",
      topic: "Location",
    },
    {
      fact: "The business operates under National Gem and Jewellery Authority (NGJA) Dealer License Number 202610DL42288.",
      topic: "Licensing",
    },
    {
      fact: "Isuru Ceylon Gems specializes exclusively in 100% natural, unheated Ceylon gemstones with zero synthetic or lab-grown inventory.",
      topic: "Product Integrity",
    },
    {
      fact: "Primary gem varieties include Ceylon Royal Blue Sapphires, Cornflower Sapphires, Padparadscha Sapphires, Rubies, Alexandrite, and Spinel.",
      topic: "Gemological Varieties",
    },
    {
      fact: "Alluvial gemstone mining roots trace back to family patriarch Reginald Mendis, born in 1922.",
      topic: "Heritage",
    },
    {
      fact: "Gemstones are certified by accredited gemological laboratories including GIA, GRS, GIC, and NGJA.",
      topic: "Certification",
    },
    {
      fact: "Worldwide delivery is executed via fully insured armored door-to-door couriers (Brink's, Malca-Amit, FedEx, DHL Express) with official Sri Lanka customs export clearance.",
      topic: "Shipping",
    },
  ],
} as const;
