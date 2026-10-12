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
    title: "Ceylon Blue Sapphires",
    subtitle: "Royal Blue & Cornflower Blue",
    tagline: "The Sovereign Gem of Serendib",
    description:
      "Celebrated for their velvety, open-color saturation that remains luminous in candlelight and daylight alike. Sourced directly from the historic gravels of Ratnapura and Elahera.",
    image:
      "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85",
    varietyQuery: "Blue",
  },
  "padparadscha": {
    title: "Padparadscha Sapphires",
    subtitle: "Sacred Lotus Blossom Sunset Hues",
    tagline: "The World's Rarest Corundum",
    description:
      "Named after the Sinhalese term for aquatic lotus blossom (Padma Raga). A tender, celestial balance of soft morning rose pink and evening twilight orange.",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
    varietyQuery: "Padparadscha",
  },
  "rare-collector": {
    title: "Collector's Rare Ceylon Gems",
    subtitle: "Asterism Star Sapphires, Rubies & Alexandrites",
    tagline: "Museum & Investment Grade Crystals",
    description:
      "Singular mineralogical phenomena including six-ray asterism crystals, untreated Ceylon Pigeon Blood rubies, and daylight-green to candlelight-raspberry Alexandrites.",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85",
    varietyQuery: "Star",
  },
  "yellow-sapphires": {
    title: "Ceylon Yellow Sapphires (Pushparaga)",
    subtitle: "Golden Amber & Imperial Honey Corundum",
    tagline: "Auspicious Brilliance from Balangoda",
    description:
      "Revered for centuries across Vedic traditions as Pushparaga. Displaying dazzling brilliance, fiery golden undertones, and outstanding natural crystal clarity.",
    image:
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85",
    varietyQuery: "Yellow",
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
        url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85",
        alt: "Glistening unheated 4.28 carat Ceylon Royal Blue Cushion cut sapphire with royal luster",
      },
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85",
        alt: "Macro facet view of the 4.28ct Ceylon Royal Blue sapphire showing exceptional clarity",
      },
      {
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85",
        alt: "Profile perspective of the gemstone showing pavilion proportions",
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
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
        alt: "Rare 3.15 carat natural Ceylon Padparadscha sapphire in delicate pink-orange sunset hues",
      },
      {
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85",
        alt: "Side profile showing depth and fire of Ceylon Padparadscha sapphire",
      },
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85",
        alt: "Macro inclusion inspection view",
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
        url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85",
        alt: "Vibrant 2.85 carat round brilliant Ceylon Cornflower blue sapphire",
      },
      {
        url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85",
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
        url: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85",
        alt: "Flawless 5.60 carat Ceylon Yellow Sapphire emerald cut in honey gold tone",
      },
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
        alt: "Step cut facets displaying amber flashes",
      },
    ],
    featured: false,
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
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
        alt: "Sharp 6-ray star sapphire cabochon from Sri Lanka showing perfect asterism under direct light",
      },
      {
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85",
        alt: "Dome profile displaying silky rutile needle orientation",
      },
    ],
    featured: false,
    description:
      "A rare phenomenon gem exhibiting sharp, centered asterism. Under sunlight or single-source beam, six razor-sharp light rays glide seamlessly across the high-domed cabochon surface.",
  },
  {
    id: "gem-006",
    slug: "ceylon-ruby-cushion-2-05ct",
    name: "Natural Ceylon Ruby (Pigeon Blood Glow)",
    variety: "Ceylon Ruby",
    category: "rare-collector",
    carat: 2.05,
    origin: "Pelmadulla, Sri Lanka",
    cut: "Cushion Brilliant",
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
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
        alt: "Luminous Ceylon Ruby cushion cut showing natural crimson fluorescence and intense fire",
      },
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85",
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
    name: "Ceylon Vivid Cornflower Sapphire (Unheated)",
    variety: "Cornflower Blue Sapphire",
    category: "blue-sapphires",
    carat: 4.1,
    origin: "Ratnapura (City of Gems)",
    cut: "Oval Mixed Cut",
    dimensions: "10.15 x 8.20 x 5.45 mm",
    color: "Vivid Cornflower Blue",
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
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85",
        alt: "Untreated 4.10 carat Oval Ceylon Cornflower Sapphire of supreme velvety azure",
      },
      {
        url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85",
        alt: "Scintillation under direct spotlight",
      },
    ],
    featured: false,
    description:
      "Mined from the gravels of the Kalu Ganga basin, this unheated oval corundum demonstrates velvety cornflower saturation without secondary extinction. Exceptional cut symmetry.",
  },
  {
    id: "gem-008",
    slug: "padparadscha-cushion-brilliant-2-42ct",
    name: "Ceylon Imperial Padparadscha Cushion",
    variety: "Padparadscha Sapphire",
    category: "padparadscha",
    carat: 2.42,
    origin: "Elahera, Sri Lanka",
    cut: "Cushion Brilliant",
    dimensions: "8.10 x 7.35 x 4.88 mm",
    color: "Delicate Lotus Blossom Pink-Orange",
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
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
        alt: "2.42 ct Cushion Padparadscha displaying genuine lotus sunset coloration",
      },
      {
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85",
        alt: "Crown facet brilliance under diffuse daylight",
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
    category: "rare-collector",
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
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85",
        alt: "Rare 1.85 ct Ceylon Alexandrite with 90% color shift from lush forest teal to fiery raspberry",
      },
      {
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
        alt: "Incandescent lamp view showing raspberry purple fluorescence",
      },
    ],
    featured: false,
    description:
      "Emerald by day, ruby by night. This singular Ceylon chrysoberyl demonstrates an extraordinary 85-90% color transition. Authenticated by the prestigious Gubelin Gem Lab of Lucerne.",
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
        url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85",
        alt: "5.20 ct Royal Blue Pear cut sapphire displaying intense saturation and flawless polish",
      },
      {
        url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85",
        alt: "Teardrop tip and wing proportions",
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
        url: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85",
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
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
        alt: "2.30 ct intense Ceylon Pink Sapphire with dazzling magenta sparkle",
      },
    ],
    featured: false,
    description:
      "A striking unheated pink corundum displaying vivid magenta flashes without any brown or grey modifier. Certified 100% natural Ceylon origin.",
  },
];
