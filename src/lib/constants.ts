import { Gemstone } from "@/types/gem";

export const BRAND = {
  name: "Isuru Gems",
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
  { label: "Royal Blue", value: "Royal Blue" },
  { label: "Cornflower Blue", value: "Cornflower" },
  { label: "Padparadscha (Pink-Orange)", value: "Padparadscha" },
  { label: "Golden Yellow", value: "Yellow" },
  { label: "Crimson / Red", value: "Red" },
  { label: "Soft Pink", value: "Pink" },
  { label: "Peacock / Teal", value: "Teal" },
] as const;

export const GEM_SHAPES = [
  { label: "Cushion Brilliant", value: "Cushion" },
  { label: "Oval Mixed Cut", value: "Oval" },
  { label: "Round Brilliant", value: "Round" },
  { label: "Emerald / Step Cut", value: "Emerald" },
  { label: "Pear / Teardrop", value: "Pear" },
  { label: "Cabochon High Dome", value: "Cabochon" },
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

export const CATEGORIES_CONFIG: Record<
  string,
  {
    title: string;
    subtitle: string;
    tagline: string;
    description: string;
    image: string;
    varietyQuery?: string;
  }
> = {
  "blue-sapphires": {
    title: "Blue Sapphires",
    subtitle: "Royal Blue & Cornflower Blue",
    tagline: "The Sovereign Gem of Serendib",
    description:
      "Celebrated for their velvety, open-color saturation that remains luminous in candlelight and daylight alike. Sourced directly from the historic gravels of Ratnapura and Elahera.",
    image: "/isuru_images/categories1.jpg",
    varietyQuery: "Blue",
  },
  "ceylon-rubies": {
    title: "Natural Ceylon Rubies",
    subtitle: "Pigeon Blood & Scarlet Fluorescence",
    tagline: "The Glowing King of Precious Gems",
    description:
      "Celebrated worldwide for their intense ultraviolet daylight fluorescence and glowing crimson hues. Completely unheated and ethically sourced from ancient river gravels.",
    image: "/isuru_images/ruby%20category.jpg",
    varietyQuery: "Ruby",
  },
  "padparadscha": {
    title: "Padparadscha & Fancy Sapphires",
    subtitle: "Sacred Lotus Blossom Sunset Hues",
    tagline: "The World's Rarest Corundum",
    description:
      "Named after the Sinhalese term for aquatic lotus blossom (Padma Raga). A tender, celestial balance of soft morning rose pink, sunset orange, and fiery yellow.",
    image: "/isuru_images/categories2.jpg",
    varietyQuery: "Padparadscha",
  },
  "alexandrite": {
    title: "Chrysoberyl Alexandrite",
    subtitle: "Dramatic Day-to-Night Color Change",
    tagline: "Emerald by Day, Ruby by Night",
    description:
      "One of the rarest optical phenomena in the mineral kingdom. Displays an extraordinary transition from vibrant teal green in daylight to rich raspberry red under warm light.",
    image: "/isuru_images/Alexandrite%20category.jpg",
    varietyQuery: "Alexandrite",
  },
  "yellow-sapphires": {
    title: "Ceylon Yellow Sapphires (Pushparaga)",
    subtitle: "Golden Amber & Imperial Honey Corundum",
    tagline: "Auspicious Brilliance from Balangoda",
    description:
      "Revered for centuries across Vedic traditions as Pushparaga. Displaying dazzling brilliance, fiery golden undertones, and outstanding natural crystal clarity.",
    image: "/isuru_images/yellow.jpg",
    varietyQuery: "Yellow",
  },
  "rare-collector": {
    title: "Rough & Collector Gemstones",
    subtitle: "Uncut Crystals, Star Sapphires & Minerals",
    tagline: "Museum & Investment Grade Crystals",
    description:
      "Singular mineralogical phenomena including natural unheated rough crystals direct from Ratnapura washing baskets, six-ray asterism crystals, and rare alluvial discoveries.",
    image: "/isuru_images/categories3.jpg",
    varietyQuery: "Star",
  },
};

export const CERTIFICATIONS = [
  { code: "NGJA", name: "National Gem and Jewellery Authority of Sri Lanka", trusted: true },
  { code: "GIA", name: "Gemological Institute of America", trusted: true },
  { code: "GRS", name: "GemResearch Swisslab", trusted: true },
  { code: "SSEF", name: "Swiss Gemmological Institute", trusted: true },
] as const;

export const SAMPLE_GEMS: Gemstone[] = [
  {
    id: "gem-001",
    slug: "ceylon-royal-blue-sapphire-4-28ct",
    name: "Ceylon Royal Blue Sapphire (Unheated)",
    variety: "Royal Blue Sapphire",
    category: "blue-sapphires",
    carat: 4.28,
    origin: "Ratnapura (City of Gems)",
    cut: "Cushion Brilliant",
    dimensions: "9.84 x 8.12 x 5.96 mm",
    color: "Vivid Royal Blue",
    treatment: "None / Unheated (Certified 100% Natural)",
    clarity: "Eye Clean / VVS1",
    price: 18500,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "GRS & NGJA",
      number: "GRS2024-089921",
      pdfUrl: "/certs/GRS2024-089921.pdf",
    },
    images: [
      {
        url: "/isuru_images/blue1.jpg",
        alt: "Glistening unheated 4.28 carat Ceylon Royal Blue Cushion cut sapphire with royal luster",
      },
      {
        url: "/isuru_images/blue2.jpg",
        alt: "Macro facet view of the 4.28ct Ceylon Royal Blue sapphire showing exceptional clarity",
      },
    ],
    featured: true,
    description:
      "An extraordinary specimen from the historic gem gravels of Ratnapura. Possessing the intensely saturated, velvety Royal Blue hue revered by connoisseurs worldwide. Completely unheated with museum-grade brilliance and exceptional depth.",
  },
  {
    id: "gem-002",
    slug: "padparadscha-sapphire-oval-3-15ct",
    name: "Ceylon Padparadscha Sapphire (Lotus Blossom)",
    variety: "Padparadscha Sapphire",
    category: "padparadscha",
    carat: 3.15,
    origin: "Pelmadulla, Sri Lanka",
    cut: "Oval Mixed Cut",
    dimensions: "8.75 x 7.10 x 5.22 mm",
    color: "Sunset Salmon Pink-Orange",
    treatment: "Unheated",
    clarity: "VS",
    price: 24000,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "SSEF & NGJA",
      number: "SSEF-118492",
      pdfUrl: "/certs/SSEF-118492.pdf",
    },
    images: [
      {
        url: "/isuru_images/Padparadscha%20Sapphire.jpg",
        alt: "Rare 3.15 carat natural Ceylon Padparadscha sapphire in delicate pink-orange sunset hues",
      },
      {
        url: "/isuru_images/pink1.jpg",
        alt: "Side profile showing depth and fire of Ceylon Padparadscha sapphire",
      },
    ],
    featured: true,
    description:
      "Named after the Sinhalese word for lotus blossom (Padma Raga), this natural Ceylon Padparadscha captures the sacred equilibrium between soft rose pink and golden sunset orange. Unheated with definitive Swiss SSEF pedigree.",
  },
  {
    id: "gem-003",
    slug: "cornflower-blue-sapphire-round-2-85ct",
    name: "Cornflower Blue Sapphire (Classic Ceylon)",
    variety: "Cornflower Blue Sapphire",
    category: "blue-sapphires",
    carat: 2.85,
    origin: "Elahera, Sri Lanka",
    cut: "Round Brilliant",
    dimensions: "8.02 x 8.00 x 5.15 mm",
    color: "Vibrant Cornflower Blue",
    treatment: "Traditional Gentle Heat Only",
    clarity: "VVS",
    price: 9200,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "GIA & NGJA",
      number: "GIA-2215904321",
    },
    images: [
      {
        url: "/isuru_images/blue2.jpg",
        alt: "Vibrant 2.85 carat round brilliant Ceylon Cornflower blue sapphire",
      },
      {
        url: "/isuru_images/blue1.jpg",
        alt: "Table facet reflection under daylight",
      },
    ],
    featured: true,
    description:
      "The quintessence of Ceylon blue sapphires: luminous, lively, and pure cornflower hue that sparkles across lighting environments without extinguishing into dark tones.",
  },
  {
    id: "gem-004",
    slug: "golden-yellow-sapphire-pushparaga-5-60ct",
    name: "Ceylon Golden Pushparaga (Yellow Sapphire)",
    variety: "Yellow Sapphire (Pushparaga)",
    category: "yellow-sapphires",
    carat: 5.6,
    origin: "Balangoda, Sri Lanka",
    cut: "Emerald Cut",
    dimensions: "11.20 x 8.45 x 6.10 mm",
    color: "Imperial Honey Gold",
    treatment: "Unheated",
    clarity: "Eye Clean / Flawless",
    price: 11400,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "NGJA Certified",
      number: "NGJA-2024-C9081",
    },
    images: [
      {
        url: "/isuru_images/yellow.jpg",
        alt: "Flawless 5.60 carat Ceylon Yellow Sapphire emerald cut in honey gold tone",
      },
    ],
    featured: true,
    description:
      "Revered in Vedic gemology as Pushparaga and associated with auspicious fortune and wisdom. Cut in an aristocratic emerald step profile showing radiant amber gold flashes.",
  },
  {
    id: "gem-005",
    slug: "ceylon-star-sapphire-cabochon-6-80ct",
    name: "Ceylon Asterism Star Sapphire Cabochon",
    variety: "Star Sapphire",
    category: "rare-collector",
    carat: 6.8,
    origin: "Ratnapura (City of Gems)",
    cut: "High Dome Oval Cabochon",
    dimensions: "11.80 x 9.90 x 7.30 mm",
    color: "Silvery Denim Blue",
    treatment: "Unheated (Natural Rutile Needles)",
    clarity: "Translucent with Crisp 6-Ray Star",
    price: 14800,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "GIA & NGJA",
      number: "GIA-5542198034",
    },
    images: [
      {
        url: "/isuru_images/Star%20Sapphire.jpg",
        alt: "Sharp 6-ray star sapphire cabochon from Sri Lanka showing perfect asterism under direct light",
      },
      {
        url: "/isuru_images/lightblue.jpg",
        alt: "Dome profile displaying silky rutile needle orientation",
      },
    ],
    featured: true,
    description:
      "A rare phenomenon gem exhibiting sharp, centered asterism. Under sunlight or single-source beam, six razor-sharp light rays glide seamlessly across the high-domed cabochon surface.",
  },
  {
    id: "gem-006",
    slug: "ceylon-ruby-cushion-2-05ct",
    name: "Natural Ceylon Ruby (Pigeon Blood Glow)",
    variety: "Ceylon Ruby",
    category: "ceylon-rubies",
    carat: 2.05,
    origin: "Pelmadulla, Sri Lanka",
    cut: "Oval Mixed Cut",
    dimensions: "7.60 x 6.55 x 4.80 mm",
    color: "Vibrant Crimson Pink-Red",
    treatment: "Unheated",
    clarity: "VS",
    price: 16200,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "GRS Certified",
      number: "GRS-RUB-88412",
    },
    images: [
      {
        url: "/isuru_images/Natural%20Ruby.jpg",
        alt: "Luminous oval cut Ceylon Ruby showing natural crimson fluorescence and intense pigeon blood fire",
      },
      {
        url: "/isuru_images/pink2.jpg",
        alt: "Facet fire view of natural Ceylon Ruby",
      },
    ],
    featured: true,
    description:
      "Famous for high fluorescence under ultraviolet daylight, Ceylon rubies shine with an internal scarlet luminescence rarely matched by stones from other mining regions.",
  },
  {
    id: "gem-007",
    slug: "ceylon-vivid-cornflower-oval-4-10ct",
    name: "Ceylon Vivid Green Sapphire (Rare Untreated)",
    variety: "Green Sapphire",
    category: "rare-collector",
    carat: 4.1,
    origin: "Ratnapura (City of Gems)",
    cut: "Oval Mixed Cut",
    dimensions: "10.15 x 8.20 x 5.45 mm",
    color: "Lustrous Ceylon Emerald Green",
    treatment: "Unheated",
    clarity: "Loupe Clean / VVS1",
    price: 15800,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "GRS & NGJA",
      number: "GRS2024-09144",
    },
    images: [
      {
        url: "/isuru_images/green.jpg",
        alt: "Untreated 4.10 carat Oval Ceylon Green Sapphire with exceptional luster",
      },
    ],
    featured: true,
    description:
      "Mined from the gravels of the Kalu Ganga basin, this unheated green corundum demonstrates pure natural forest green hue without secondary extinction. Exceptional cut symmetry.",
  },
  {
    id: "gem-008",
    slug: "padparadscha-cushion-brilliant-2-42ct",
    name: "Ceylon Electric Light Blue Sapphire Cushion",
    variety: "Cornflower Blue Sapphire",
    category: "blue-sapphires",
    carat: 2.42,
    origin: "Elahera, Sri Lanka",
    cut: "Cushion Brilliant",
    dimensions: "8.10 x 7.35 x 4.88 mm",
    color: "Electric Sky Blue",
    treatment: "Unheated Natural",
    clarity: "Eye Clean VVS",
    price: 21500,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "GIA & GRS",
      number: "GIA-6218903120",
    },
    images: [
      {
        url: "/isuru_images/lightblue.jpg",
        alt: "2.42 ct Cushion Ceylon Light Blue Sapphire displaying intense diamond-like dispersion",
      },
    ],
    featured: false,
    description:
      "A quintessential Padparadscha gemstone possessing the exact 55/45 equilibrium of lotus petal pink and sunset peach. Accompanied by definitive dual reports from GIA and GRS Swisslab.",
  },
  {
    id: "gem-009",
    slug: "ceylon-chrysoberyl-alexandrite-1-85ct",
    name: "Phenomenal Ceylon Alexandrite (Color Change)",
    variety: "Chrysoberyl Alexandrite",
    category: "alexandrite",
    carat: 1.85,
    origin: "Morawaka, Sri Lanka",
    cut: "Oval Mixed Cut",
    dimensions: "7.80 x 6.10 x 4.30 mm",
    color: "Teal Green to Raspberry Red",
    treatment: "None / 100% Earth Mined",
    clarity: "VS1",
    price: 28500,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "Gubelin & NGJA",
      number: "GUB-2024-9982",
    },
    images: [
      {
        url: "/isuru_images/Alexandrite%20category.jpg",
        alt: "Rare 1.85 ct Ceylon Natural Alexandrite exhibiting dramatic green-to-raspberry color change",
      },
      {
        url: "/isuru_images/blue3.jpg",
        alt: "Table reflection under daylight",
      },
    ],
    featured: true,
    description:
      "Emerald by day, ruby by night. This singular Ceylon gem demonstrates extraordinary optical brilliance direct from Morawaka mines.",
  },
  {
    id: "gem-010",
    slug: "ceylon-royal-blue-pear-shape-5-20ct",
    name: "Imperial Ceylon Royal Blue Pear Brilliant",
    variety: "Royal Blue Sapphire",
    category: "blue-sapphires",
    carat: 5.2,
    origin: "Ratnapura (City of Gems)",
    cut: "Pear / Teardrop",
    dimensions: "12.85 x 8.40 x 6.15 mm",
    color: "Vivid Royal Blue",
    treatment: "Unheated",
    clarity: "Loupe Clean / Flawless",
    price: 36000,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "GRS Swisslab & NGJA",
      number: "GRS-2024-81992",
    },
    images: [
      {
        url: "/isuru_images/natural%20heart.jpg",
        alt: "5.20 ct Imperial Royal Blue Pear cut sapphire displaying intense saturation and flawless polish",
      },
      {
        url: "/isuru_images/blue1.jpg",
        alt: "Macro facet view of 5.20ct Ceylon Royal Blue sapphire",
      },
    ],
    featured: true,
    description:
      "A monument of Ceylon sapphire mining. Exceeding 5 carats in pure unheated state with no thermal treatment whatsoever. Cut in an aristocratic pear shape tailored for a royal pendant or high-jewelry ring.",
  },
  {
    id: "gem-011",
    slug: "ceylon-yellow-sapphire-cushion-3-75ct",
    name: "Ceylon Canary Yellow Sapphire Cushion",
    variety: "Yellow Sapphire (Pushparaga)",
    category: "yellow-sapphires",
    carat: 3.75,
    origin: "Balangoda, Sri Lanka",
    cut: "Cushion Brilliant",
    dimensions: "9.20 x 8.40 x 5.60 mm",
    color: "Vivid Canary Yellow",
    treatment: "Unheated",
    clarity: "VVS",
    price: 7800,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "NGJA & GIA",
      number: "GIA-11942001",
    },
    images: [
      {
        url: "/isuru_images/yellow.jpg",
        alt: "3.75 ct Cushion brilliant Yellow Ceylon sapphire radiating intense solar fire",
      },
    ],
    featured: false,
    description:
      "Electric lemon and canary yellow hues with clean clarity and crisp cushion facets. Earth-mined from the rich decomposed granite gravels of Balangoda.",
  },
  {
    id: "gem-012",
    slug: "ceylon-hot-pink-sapphire-oval-2-30ct",
    name: "Ceylon Vivid Hot Pink Sapphire Oval",
    variety: "Pink Sapphire",
    category: "rare-collector",
    carat: 2.3,
    origin: "Pelmadulla, Sri Lanka",
    cut: "Oval Mixed Cut",
    dimensions: "8.15 x 6.50 x 4.60 mm",
    color: "Intense Magenta Pink",
    treatment: "Unheated",
    clarity: "Eye Clean",
    price: 8900,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "GRS Certified",
      number: "GRS-PNK-19402",
    },
    images: [
      {
        url: "/isuru_images/pink1.jpg",
        alt: "2.30 ct intense Ceylon Pink Sapphire with dazzling magenta sparkle",
      },
    ],
    featured: false,
    description:
      "A striking unheated pink corundum displaying vivid magenta flashes without any brown or grey modifier. Certified 100% natural Ceylon origin.",
  },
  {
    id: "gem-013",
    slug: "ceylon-vivid-orange-sapphire-oval-3-40ct",
    name: "Ceylon Vivid Mandarin Orange Sapphire Oval",
    variety: "Orange Sapphire",
    category: "padparadscha",
    carat: 3.4,
    origin: "Balangoda, Sri Lanka",
    cut: "Oval Mixed Cut",
    dimensions: "9.10 x 7.30 x 5.10 mm",
    color: "Intense Fire Mandarin Orange",
    treatment: "Unheated",
    clarity: "Eye Clean / VVS",
    price: 13500,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "GRS & NGJA",
      number: "GRS2024-ORG8812",
    },
    images: [
      {
        url: "/isuru_images/Orange%20Sapphire.jpg",
        alt: "3.40 ct oval brilliant Ceylon Orange Sapphire radiating fiery solar brilliance",
      },
    ],
    featured: true,
    description:
      "A magnificent unheated fancy sapphire displaying pure, saturated mandarin orange brilliance without any brown overtone. Mined from the decomposed granite gravels of Balangoda and cut to ideal optical proportions.",
  },
  {
    id: "gem-014",
    slug: "ceylon-flame-red-spinel-oval-2-95ct",
    name: "Ceylon Flame Red Spinel (Natural Unheated)",
    variety: "Spinel",
    category: "rare-collector",
    carat: 2.95,
    origin: "Pelmadulla, Sri Lanka",
    cut: "Oval Mixed Cut",
    dimensions: "8.80 x 6.95 x 4.90 mm",
    color: "Vibrant Flame Red",
    treatment: "None / 100% Earth Mined",
    clarity: "Loupe Clean / VVS1",
    price: 11200,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "GIA & NGJA",
      number: "GIA-SPN-77401",
    },
    images: [
      {
        url: "/isuru_images/Red%20Ceylon%20Spinel.jpg",
        alt: "2.95 ct vivid flame red Ceylon Spinel displaying singly-refractive high brilliance",
      },
    ],
    featured: true,
    description:
      "An extraordinary untreated singly-refractive gemstone exhibiting fiery crimson brilliance. Sourced from the alluvial deposits of Pelmadulla with exceptional optical purity and no thermal treatment.",
  },
  {
    id: "gem-015",
    slug: "ceylon-royal-blue-pear-tear-of-serendib-4-15ct",
    name: "Ceylon Royal Blue Pear 'Tear of Serendib'",
    variety: "Royal Blue Sapphire",
    category: "blue-sapphires",
    carat: 4.15,
    origin: "Ratnapura (City of Gems)",
    cut: "Pear / Teardrop",
    dimensions: "11.20 x 7.80 x 5.60 mm",
    color: "Vivid Royal Blue",
    treatment: "Unheated (100% Natural)",
    clarity: "Eye Clean / VVS1",
    price: 22800,
    currency: "USD",
    inStock: true,
    certificate: {
      lab: "SSEF & NGJA",
      number: "SSEF-BLU-90214",
    },
    images: [
      {
        url: "/isuru_images/natural%20heart.jpg",
        alt: "4.15 ct unheated Pear cut Ceylon Royal Blue sapphire displaying aristocratic fire",
      },
      {
        url: "/isuru_images/blue2.jpg",
        alt: "Table reflection under daylight",
      },
    ],
    featured: true,
    description:
      "A poetic masterpiece of Ceylon gemstone heritage. Mined from the legendary Kalu Ganga riverbeds of Ratnapura, this completely untreated pear brilliant combines deep velvety blue saturation with pure crystal transparency.",
  },
];
