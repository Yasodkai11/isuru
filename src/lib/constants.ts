export const BRAND = {
  name: "Isuru Ceylon",
  tagline: "From Generational Heritage to the Digital World",
  subheading: "A Legacy of Gems • A Future of Trust",
  established: 1964,
  ngjaLicense: "202610DL42288",
  location: "Ratnapura, Sri Lanka",
  headquarters: "Colombo 00500 & Main Street, Ratnapura, Sri Lanka",
  phone: "+94 76 273 5153",
  whatsapp: "+94 76 273 5153",
  email: "uththiyaisurudewamendis@gmail.com",
  mapUrl:
    "https://maps.google.com/maps/search/Colombo%2000500%2C%20Sri%20Lanka/@7.0338,79.8994,17z?hl=en",
};

export const CEYLON_ORIGINS = [
  "Ratnapura (City of Gems)",
  "Elahera",
  "Pelmadulla",
  "Balangoda",
  "Okchampitiya",
] as const;

export const GEM_VARIETIES = [
  "Royal Blue Sapphire",
  "Cornflower Blue Sapphire",
  "Padparadscha Sapphire",
  "Yellow Sapphire (Pushparaga)",
  "Pink Sapphire",
  "Star Sapphire",
  "Ceylon Ruby",
  "Chrysoberyl Alexandrite",
  "Spinel",
] as const;

export const GEM_COLOURS = [
  { label: "Blue", value: "Blue" },
  { label: "Green", value: "Green" },
  { label: "Pink & Purple", value: "Pink & Purple" },
  { label: "Red & Maroon", value: "Red & Maroon" },
  { label: "Yellow & Gold", value: "Yellow & Gold" },
  { label: "Spinel", value: "Spinel" },
  { label: "Alexandrite", value: "Alexandrite" },
  { label: "Collector Crystals", value: "Collector Crystals" },
  { label: "Gem Collections", value: "Gem Collections" },
] as const;

export const GEM_SHAPES = [
  { label: "Oval", value: "Oval" },
  { label: "Cushion", value: "Cushion" },
  { label: "Round", value: "Round" },
  { label: "Emerald / Step Cut", value: "Emerald" },
  { label: "Pear / Teardrop", value: "Pear" },
  { label: "Parcels / Assorted", value: "Assorted" },
] as const;

export const CARAT_PRESETS = [
  { label: "All Weights", min: undefined, max: undefined },
  { label: "Under 2.00 cts", min: 0, max: 2.0 },
  { label: "2.00 – 4.00 cts", min: 2.0, max: 4.0 },
  { label: "4.00 – 7.00 cts", min: 4.0, max: 7.0 },
  { label: "7.00+ cts (Imperial)", min: 7.0, max: 99.0 },
] as const;

export const PRICE_PRESETS = [
  { label: "All Prices", min: undefined, max: undefined },
  { label: "Under $10,000", min: 0, max: 10000 },
  { label: "$10,000 – $20,000", min: 10000, max: 20000 },
  { label: "$20,000 – $50,000", min: 20000, max: 50000 },
  { label: "Above $50,000", min: 50000, max: 999999 },
] as const;

const CATALOG_IMAGES = "/isuru_images/Gems_Categorized_By_Visible_Color";

export const CATEGORIES_CONFIG: Record<
  string,
  {
    title: string;
    subtitle: string;
    tagline: string;
    description: string;
    image: string;
    /** Used to filter Supabase rows, which have no category column. */
    match: { column: "color" | "variety"; value: string };
  }
> = {
  // --- High-Intent Gemological Varieties (Admin & Organic Search Targets) ---
  "blue-sapphires": {
    title: "Ceylon Blue Sapphires",
    subtitle: "Royal Blue & Cornflower Blue",
    tagline: "The Sovereign Gem of Serendib",
    description:
      "Celebrated for their velvety, open-color saturation that remains luminous in candlelight and daylight alike.",
    image: "/isuru_images/categories1.webp",
    match: { column: "color", value: "Blue" },
  },
  "ceylon-rubies": {
    title: "Natural Ceylon Rubies",
    subtitle: "Pigeon Blood & Scarlet Fluorescence",
    tagline: "The Glowing King of Precious Gems",
    description:
      "Renowned for their luminous pigeon blood luminescence and natural scarlet fluorescence under sunlight.",
    image: "/isuru_images/ruby%20category.webp",
    match: { column: "variety", value: "Ruby" },
  },
  "padparadscha": {
    title: "Padparadscha Sapphires",
    subtitle: "Sacred Lotus Blossom Sunset Hues",
    tagline: "The World's Rarest Corundum",
    description:
      "Named after the Sinhalese term for aquatic lotus blossom. A tender balance of soft morning rose pink and evening twilight orange.",
    image: "/isuru_images/Padparadscha%20Sapphire.webp",
    match: { column: "variety", value: "Padparadscha" },
  },
  "alexandrite": {
    title: "Chrysoberyl Alexandrite",
    subtitle: "Day-to-Night Optical Miracle",
    tagline: "Emerald by Day, Ruby by Night",
    description:
      "Displays an extraordinary transition from vibrant teal green in daylight to rich raspberry red under warm light.",
    image: "/isuru_images/Alexandrite%20category.webp",
    match: { column: "variety", value: "Alexandrite" },
  },
  "yellow-sapphires": {
    title: "Ceylon Yellow Sapphires",
    subtitle: "Golden Amber & Imperial Honey Corundum (Pushparaga)",
    tagline: "Auspicious Brilliance from Balangoda",
    description:
      "Revered for centuries across Vedic traditions as Pushparaga. Displaying dazzling brilliance and fiery golden undertones.",
    image: "/isuru_images/yellow.webp",
    match: { column: "color", value: "Yellow" },
  },
  "rare-collector": {
    title: "Rare Collector Crystals",
    subtitle: "Asterism Star Sapphires, Rough Crystals & Minerals",
    tagline: "Museum & Investment Grade Crystals",
    description:
      "Singular mineralogical phenomena including six-ray asterism crystals, untreated rough stones, and high-dome cabochons.",
    image: "/isuru_images/categories3.webp",
    match: { column: "variety", value: "Star" },
  },
  "ceylon-spinel": {
    title: "Ceylon Natural Spinel",
    subtitle: "Flame Red & Cobalt Fire",
    tagline: "High Refractive Index Splendor",
    description:
      "Naturally untreated singly-refractive gemstones showcasing pure unheated fiery dispersion.",
    image: "/isuru_images/Red%20Ceylon%20Spinel.webp",
    match: { column: "variety", value: "Spinel" },
  },

  // --- Visual Color Categories (Storefront Legacy & Color Filtering) ---
  "blue-gems": {
    title: "Blue Gems",
    subtitle: "Royal, Cornflower & Pastel Blue",
    tagline: "Signature Ceylon Blue",
    description:
      "Natural blue gemstones from our Sri Lankan stock - from saturated royal blue to soft pastel cornflower tones.",
    image: `${CATALOG_IMAGES}/03_Individual_Gem_Photos/Blue/32_light_blue_round_gem_white_background.webp`,
    match: { column: "color", value: "Blue" },
  },
  "pink-purple-gems": {
    title: "Pink & Purple Gems",
    subtitle: "Hot Pink, Pastel & Violet",
    tagline: "Romantic Hues",
    description:
      "Pink and purple gemstones ranging from vivid hot pink cushions to soft pastel and deep violet ovals.",
    image: `${CATALOG_IMAGES}/01_Single_Gems/Pink_and_Purple/01_pink_gem_square_display.webp`,
    match: { column: "color", value: "Pink" },
  },
  "red-gems": {
    title: "Red & Maroon Gems",
    subtitle: "Deep Crimson & Maroon",
    tagline: "Fiery Red",
    description: "Deep red and maroon gemstones with bright crimson flashes.",
    image: `${CATALOG_IMAGES}/01_Single_Gems/Red_and_Maroon/02_dark_red_oval_gem_display.webp`,
    match: { column: "color", value: "Red" },
  },
  "yellow-gems": {
    title: "Yellow & Gold Gems",
    subtitle: "Golden Honey & Amber",
    tagline: "Golden Brilliance",
    description: "Golden yellow and honey-toned gemstones with strong natural brilliance.",
    image: `${CATALOG_IMAGES}/01_Single_Gems/Yellow_and_Gold/03_yellow_gold_oval_gem_display.webp`,
    match: { column: "color", value: "Yellow" },
  },
  "green-gems": {
    title: "Green Gems",
    subtitle: "Forest & Olive Green",
    tagline: "Natural Green",
    description: "Forest green and olive green gemstones with lively golden-green sparkle.",
    image: `${CATALOG_IMAGES}/01_Single_Gems/Green/10_olive_green_gem_display.webp`,
    match: { column: "color", value: "Green" },
  },
  "gem-collections": {
    title: "Gem Collections & Trays",
    subtitle: "Parcels for Jewellers & Collectors",
    tagline: "Trade Parcels",
    description:
      "Trays and parcels of loose natural gemstones in mixed and matched colours - available as lots or individually.",
    image: `${CATALOG_IMAGES}/02_Gem_Collections_and_Trays/Mixed_Colors/15_multicolor_round_gems_tray.webp`,
    match: { column: "variety", value: "Parcel" },
  },
};

/**
 * Bidirectional aliases ensuring legacy color slugs and high-intent variety slugs cross-resolve.
 */
export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  "blue-sapphires": "blue-gems",
  "ceylon-rubies": "red-gems",
  "padparadscha": "pink-purple-gems",
  "yellow-sapphires": "yellow-gems",
  "ceylon-spinel": "red-gems",
  "alexandrite": "green-gems",
  "rare-collector": "gem-collections",
};

/**
 * Resolves a category slug, checking direct config match first, then aliases.
 */
export function resolveCategoryKey(slug: string): string | undefined {
  if (!slug) return undefined;
  if (CATEGORIES_CONFIG[slug]) return slug;
  const aliased = CATEGORY_SLUG_ALIASES[slug];
  if (aliased && CATEGORIES_CONFIG[aliased]) return aliased;
  return undefined;
}


export const CERTIFICATIONS = [
  { code: "NGJA", name: "National Gem and Jewellery Authority of Sri Lanka", trusted: true },
  { code: "GIA", name: "Gemological Institute of America", trusted: true },
  { code: "GRS", name: "GemResearch Swisslab", trusted: true },
  { code: "SSEF", name: "Swiss Gemmological Institute", trusted: true },
] as const;
