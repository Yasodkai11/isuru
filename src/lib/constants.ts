export const BRAND = {
  name: "Isuru Ceylon",
  tagline: "Treasures of Serendib",
  subheading: "Finest Natural Ceylon Sapphires & Precious Island Gemstones",
  established: 1984,
  location: "Ratnapura, Sri Lanka",
  headquarters: "42 York Street, Colombo 01 & Main Street, Ratnapura, Sri Lanka",
  phone: "+94 (11) 244-8899",
  whatsapp: "+94 (77) 389-1200",
  email: "concierge@isurugems.com",
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
  { label: "Pink", value: "Pink" },
  { label: "Purple / Violet", value: "Purple" },
  { label: "Red / Maroon", value: "Red" },
  { label: "Yellow / Gold", value: "Yellow" },
  { label: "Black / Dark", value: "Dark" },
  { label: "Mixed Colours", value: "Mixed" },
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
  { label: "2.00 â€“ 4.00 cts", min: 2.0, max: 4.0 },
  { label: "4.00 â€“ 7.00 cts", min: 4.0, max: 7.0 },
  { label: "7.00+ cts (Imperial)", min: 7.0, max: 99.0 },
] as const;

export const PRICE_PRESETS = [
  { label: "All Prices", min: undefined, max: undefined },
  { label: "Under $10,000", min: 0, max: 10000 },
  { label: "$10,000 â€“ $20,000", min: 10000, max: 20000 },
  { label: "$20,000 â€“ $50,000", min: 20000, max: 50000 },
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
  "blue-gems": {
    title: "Blue Gems",
    subtitle: "Royal, Cornflower & Pastel Blue",
    tagline: "Signature Ceylon Blue",
    description:
      "Natural blue gemstones from our Sri Lankan stock - from saturated royal blue to soft pastel cornflower tones.",
    image: `${CATALOG_IMAGES}/03_Individual_Gem_Photos/Blue/32_light_blue_round_gem_white_background.jpeg`,
    match: { column: "color", value: "Blue" },
  },
  "pink-purple-gems": {
    title: "Pink & Purple Gems",
    subtitle: "Hot Pink, Pastel & Violet",
    tagline: "Romantic Hues",
    description:
      "Pink and purple gemstones ranging from vivid hot pink cushions to soft pastel and deep violet ovals.",
    image: `${CATALOG_IMAGES}/01_Single_Gems/Pink_and_Purple/01_pink_gem_square_display.jpeg`,
    match: { column: "color", value: "Pink" },
  },
  "red-gems": {
    title: "Red & Maroon Gems",
    subtitle: "Deep Crimson & Maroon",
    tagline: "Fiery Red",
    description: "Deep red and maroon gemstones with bright crimson flashes.",
    image: `${CATALOG_IMAGES}/01_Single_Gems/Red_and_Maroon/02_dark_red_oval_gem_display.jpeg`,
    match: { column: "color", value: "Red" },
  },
  "yellow-gems": {
    title: "Yellow & Gold Gems",
    subtitle: "Golden Honey & Amber",
    tagline: "Golden Brilliance",
    description: "Golden yellow and honey-toned gemstones with strong natural brilliance.",
    image: `${CATALOG_IMAGES}/01_Single_Gems/Yellow_and_Gold/03_yellow_gold_oval_gem_display.jpeg`,
    match: { column: "color", value: "Yellow" },
  },
  "green-gems": {
    title: "Green Gems",
    subtitle: "Forest & Olive Green",
    tagline: "Natural Green",
    description: "Forest green and olive green gemstones with lively golden-green sparkle.",
    image: `${CATALOG_IMAGES}/01_Single_Gems/Green/10_olive_green_gem_display.jpeg`,
    match: { column: "color", value: "Green" },
  },
  "gem-collections": {
    title: "Gem Collections & Trays",
    subtitle: "Parcels for Jewellers & Collectors",
    tagline: "Trade Parcels",
    description:
      "Trays and parcels of loose natural gemstones in mixed and matched colours - available as lots or individually.",
    image: `${CATALOG_IMAGES}/02_Gem_Collections_and_Trays/Mixed_Colors/15_multicolor_round_gems_tray.jpeg`,
    match: { column: "variety", value: "Parcel" },
  },
};

export const CERTIFICATIONS = [
  { code: "NGJA", name: "National Gem and Jewellery Authority of Sri Lanka", trusted: true },
  { code: "GIA", name: "Gemological Institute of America", trusted: true },
  { code: "GRS", name: "GemResearch Swisslab", trusted: true },
  { code: "SSEF", name: "Swiss Gemmological Institute", trusted: true },
] as const;
