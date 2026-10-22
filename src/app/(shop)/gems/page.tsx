import type { Metadata } from "next";
import Image from "next/image";
import { getGemstones } from "@/actions/gems";
import { GemCard } from "@/components/gems/gem-card";
import { GemFilters } from "@/components/gems/gem-filters";
import { GemPagination } from "@/components/gems/gem-pagination";
import { GoldDivider } from "@/components/layout/gold-divider";
import { CARAT_PRESETS, PRICE_PRESETS } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  JsonLd,
  getBreadcrumbListSchema,
  getCollectionPageSchema,
  getFAQPageSchema,
} from "@/lib/seo/schema";
import { getSEORecordByPath } from "@/actions/seo";
import { SEO_CONFIG } from "@/lib/seo-config";
import { HelpCircle, ArrowRight, BookOpen } from "lucide-react";

interface GemsPageProps {
  searchParams: Promise<{
    colour?: string;
    color?: string;
    shape?: string;
    carat?: string;
    price?: string;
    sort?: "featured" | "price-asc" | "price-desc" | "carat-desc" | "carat-asc" | "newest";
    page?: string;
    variety?: string;
    origin?: string;
    search?: string;
    category?: string;
  }>;
}

export async function generateMetadata({ searchParams }: GemsPageProps): Promise<Metadata> {
  const resolved = await searchParams;
  const pageNum = resolved.page ? Math.max(1, parseInt(resolved.page, 10)) : 1;
  const seo = await getSEORecordByPath("/gems");

  const effectiveColour = resolved.colour || resolved.color;
  const hasSearch = Boolean(resolved.search && resolved.search.trim().length > 0);
  const isFiltered = Boolean(
    (effectiveColour && effectiveColour !== "all") ||
    (resolved.shape && resolved.shape !== "all") ||
    (resolved.variety && resolved.variety !== "all") ||
    (resolved.category && resolved.category !== "all") ||
    (resolved.origin && resolved.origin !== "all") ||
    (resolved.carat && resolved.carat !== "all") ||
    (resolved.price && resolved.price !== "all")
  );

  const parts: string[] = [];
  if (resolved.search) parts.push(`Search: "${resolved.search}"`);
  if (effectiveColour && effectiveColour !== "all") parts.push(effectiveColour);
  if (resolved.shape && resolved.shape !== "all") parts.push(resolved.shape);
  if (resolved.variety && resolved.variety !== "all") parts.push(resolved.variety);

  const prefix = parts.length > 0 ? `${parts.join(" ")} - ` : "";
  const pageSuffix = pageNum > 1 ? ` (Page ${pageNum})` : "";
  const baseTitle = prefix
    ? `${prefix}Natural Gemstones Vault | ${SEO_CONFIG.brand.name}`
    : (seo?.metaTitle || `Natural Ceylon Gemstones Vault | ${SEO_CONFIG.brand.name}`);
  const baseDesc =
    seo?.metaDescription ||
    "Explore certified unheated Ceylon Royal Blue Sapphires, Padparadschas, Rubies, and precious island gemstones from Isuru Ceylon Gems with full laboratory certification from NGJA, GIA, and GRS.";

  const canonicalUrl =
    pageNum > 1 && !hasSearch && !isFiltered
      ? `${SEO_CONFIG.site.url}/gems?page=${pageNum}`
      : `${SEO_CONFIG.site.url}/gems`;

  return {
    title: `${baseTitle}${pageSuffix}`,
    description: baseDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: (hasSearch || isFiltered)
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title: `${prefix}Natural Gemstones Vault${pageSuffix} | ${SEO_CONFIG.brand.name}`,
      description:
        "Explore certified unheated Ceylon Royal Blue Sapphires, Padparadschas, Rubies, and precious island gemstones authenticated by NGJA, GIA, and GRS.",
      url: canonicalUrl,
      images: [
        {
          url: "/isuru_images/blue1.webp",
          width: 1200,
          height: 630,
          alt: `${SEO_CONFIG.brand.name} Gemstones Vault`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${prefix}Natural Gemstones Vault | ${SEO_CONFIG.brand.name}`,
      description: baseDesc,
      images: ["/isuru_images/blue1.webp"],
    },
  };
}

const GEM_FAQS = [
  {
    question: "What is a Ceylon sapphire?",
    directAnswer:
      "A Ceylon sapphire is a natural corundum gemstone mined from the gem-bearing gravels of Sri Lanka (formerly Ceylon). Celebrated worldwide for over two millennia, Ceylon sapphires are renowned for their vivid, open luminosity, high crystalline clarity, and iconic shades ranging from royal blue and cornflower blue to rare lotus-hued padparadschas.",
    detail:
      "Unlike basaltic sapphires from Australia or Thailand, Ceylon corundum contains low iron content, preventing the stone from appearing dark or inky in evening light.",
  },
  {
    question: "What does unheated sapphire mean?",
    directAnswer:
      "An unheated sapphire is a completely natural gemstone that has undergone zero thermal, chemical, or lattice enhancement after being unearthed. Less than one percent of gem-grade sapphires possess sufficient natural color and clarity to remain unheated, making them significantly rarer, purer, and more valuable to connoisseurs and investors than heated stones.",
    detail:
      "Unheated status must be confirmed through microscopic inspection of intact rutile silk and laboratory spectroscopy documented on an independent GIA, GRS, or NGJA certificate.",
  },
  {
    question: "What is a padparadscha sapphire?",
    directAnswer:
      "A padparadscha sapphire is the rarest variety of corundum, showcasing an exquisite, delicate blend of lotus-pink and sunset-orange simultaneously. Originating from the Sinhalese term 'padma raga' (meaning the color of the aquatic lotus blossom), authentic natural unheated padparadschas from Sri Lanka command exceptional prestige in global high jewelry.",
    detail:
      "The color must be a pastel to medium tone free from dark or brown masking, verified by specialized laboratory color-stability light testing.",
  },
  {
    question: "What is pigeon blood ruby?",
    directAnswer:
      "Pigeon blood ruby denotes the most coveted color grade in precious corundum—a vivid, intensely saturated red with an electrifying scarlet fluorescence. Natural Ceylon rubies are particularly prized for their radiant internal fire and transparency, glowing with dramatic crimson luminosity in both natural sunlight and evening candlelight.",
    detail:
      "This glow is caused by high chromium content paired with very low iron, allowing the crystal to fluoresce pure red under ultraviolet light wavelengths.",
  },
  {
    question: "How do I verify a gemstone certificate (GIA / GRS / GIC / NGJA)?",
    directAnswer:
      "Every gemstone from Isuru Ceylon Gems includes a verifiable identification report from world-renowned independent laboratories—including GIA, GRS, GIC (Gemmological Institute of Colombo), or NGJA. You can verify authentication online by entering the report number and carat weight into the issuing laboratory’s official verification portal or scanning the QR code.",
    detail:
      "The online database displays a digital facsimile of the original dossier, allowing you to cross-reference millimeter dimensions, cut, and weight directly with the physical stone.",
  },
  {
    question: "How much does a natural Ceylon blue sapphire cost?",
    directAnswer:
      "The price of a natural Ceylon blue sapphire typically ranges from $1,500 to $4,500 per carat for commercial fine grades (1–2 carats), rising to $5,000 to $18,000+ per carat for unheated royal blue or cornflower specimens of 3 to 7+ carats with master symmetry and international GIA or GRS certification.",
    detail:
      "Prices escalate non-linearly at significant carat milestones (3 carats, 5 carats, 10 carats), as larger unheated crystals represent less than a fraction of one percent of annual mine production.",
  },
];

export default async function GemsPage({ searchParams }: GemsPageProps) {
  const resolved = await searchParams;
  const effectiveColour = resolved.colour || resolved.color;
  const currentPage = resolved.page ? Math.max(1, parseInt(resolved.page, 10)) : 1;
  const itemsPerPage = 12;

  let minCarat: number | undefined;
  let maxCarat: number | undefined;
  if (resolved.carat && resolved.carat !== "all") {
    const preset = CARAT_PRESETS.find((p) => p.label === resolved.carat);
    if (preset) {
      minCarat = preset.min;
      maxCarat = preset.max;
    }
  }

  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  if (resolved.price && resolved.price !== "all") {
    const preset = PRICE_PRESETS.find((p) => p.label === resolved.price);
    if (preset) {
      minPrice = preset.min;
      maxPrice = preset.max;
    }
  }

  const { gems, total } = await getGemstones({
    colour: effectiveColour !== "all" ? effectiveColour : undefined,
    shape: resolved.shape !== "all" ? resolved.shape : undefined,
    variety: resolved.variety !== "all" ? resolved.variety : undefined,
    origin: resolved.origin !== "all" ? resolved.origin : undefined,
    search: resolved.search,
    minCarat,
    maxCarat,
    minPrice,
    maxPrice,
    sort: resolved.sort || "featured",
    page: currentPage,
    limit: itemsPerPage,
  });

  const totalPages = Math.ceil(total / itemsPerPage);

  const breadcrumbs = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Gemstones Vault", url: "/gems" },
  ]);

  const collectionSchema = getCollectionPageSchema({
    title: `Natural Ceylon Gemstones Vault | ${SEO_CONFIG.brand.name}`,
    description: "Curated collection of unheated, certified natural Ceylon sapphires, rubies, and precious gemstones direct from Ratnapura.",
    url: "/gems",
    gems,
  });

  const faqSchema = getFAQPageSchema(
    GEM_FAQS.map((f) => ({
      question: f.question,
      answer: f.detail ? `${f.directAnswer} ${f.detail}` : f.directAnswer,
    }))
  );

  return (
    <div className="min-h-screen bg-[#FAF6EE] py-8 sm:py-12">
      <JsonLd data={[breadcrumbs, collectionSchema, faqSchema]} />

      <div className="container-luxe space-y-8 sm:space-y-10">
        {/* Editorial Collection Header with single H1 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#B8924A]/25 pb-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-4 h-px bg-[#80601C]" />
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#80601C]">
                {SEO_CONFIG.brand.name} · Certified Vault
              </span>
            </div>

            <div className="relative inline-block">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#5E0F1E]">
                The Natural Gemstones Vault
              </h1>
              <div className="absolute -top-3 -right-6 w-5 h-5 pointer-events-none opacity-40 hidden sm:block">
                <svg viewBox="0 0 24 24" fill="none" stroke="#80601C" strokeWidth="1.2">
                  <path d="M12 2 L14 9 L21 12 L14 15 L12 22 L10 15 L3 12 L10 9 Z" />
                </svg>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#736B63] max-w-xl">
              Curated natural unheated Ceylon sapphires, Padparadschas, rubies, and collector mineral specimens authenticated with laboratory certifications from NGJA, GIA, and GRS.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#B8924A] font-semibold">
              Curated Selection
            </span>
            <span className="font-serif text-xl sm:text-2xl font-medium text-[#0E2A20]">
              {total} Exceptional Specimens
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#736B63] mt-0.5">
              Direct from Sri Lankan Mines · NGJA Lic: {SEO_CONFIG.brand.licenseNumber}
            </span>
          </div>
        </div>

        {/* URL-synchronized Client Filters */}
        <GemFilters totalCount={total} />

        {/* Gemstones Grid */}
        {gems.length === 0 ? (
          <div className="bg-[#FDFBF7] border border-[#B8924A]/25 p-16 text-center space-y-5 my-8 shadow-xs">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
              No Specimens Match Your Current Criteria
            </h2>
            <p className="text-xs sm:text-sm text-[#2B2B2B]/70 max-w-md mx-auto leading-relaxed">
              Our master lapidaries regularly facet unheated rough crystals from our Ratnapura and Elahera mines. Contact our concierge desk for private off-market viewings or custom sourcing.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <Link href="/gems">
                <Button variant="outline" size="sm">
                  Clear All Filters
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="primary" size="sm">
                  Request Custom Sourcing
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
              {gems.map((gem) => (
                <GemCard key={gem.id} gem={gem} />
              ))}
            </div>

            {/* Pagination Controls */}
            <GemPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={total}
              limit={itemsPerPage}
            />
          </div>
        )}

        {/* Internal Linking: Gemological Guides Ribbon */}
        <section aria-label="Educational Guides" className="pt-10 border-t border-[#B8924A]/20">
          <div className="p-6 sm:p-8 rounded-xl bg-[#FDFBF7] border border-[#B8924A]/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#80601C] font-semibold">
                <BookOpen className="w-4 h-4" />
                <span>Gemological Knowledge Guides</span>
              </div>
              <Link
                href="/guides"
                className="text-xs font-semibold text-[#5E0F1E] hover:text-[#80601C] inline-flex items-center gap-1"
              >
                <span>View All 6 Guides</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
              <Link
                href="/guides/ceylon-blue-sapphire-buying-guide"
                className="p-3 rounded bg-[#FAF6EE] border border-[#B8924A]/20 hover:border-[#80601C] transition-colors"
              >
                <span className="font-serif font-medium text-[#5E0F1E] block text-sm">Ceylon Sapphire Buying Guide</span>
                <span className="text-[#2B2B2B]/70">Royal Blue vs Cornflower, cuts & pricing per carat.</span>
              </Link>
              <Link
                href="/guides/padparadscha-sapphire-guide"
                className="p-3 rounded bg-[#FAF6EE] border border-[#B8924A]/20 hover:border-[#80601C] transition-colors"
              >
                <span className="font-serif font-medium text-[#5E0F1E] block text-sm">Padparadscha Sapphire Guide</span>
                <span className="text-[#2B2B2B]/70">Lotus blossom color spectrum & stability testing.</span>
              </Link>
              <Link
                href="/guides/natural-vs-heated-gemstones-guide"
                className="p-3 rounded bg-[#FAF6EE] border border-[#B8924A]/20 hover:border-[#80601C] transition-colors"
              >
                <span className="font-serif font-medium text-[#5E0F1E] block text-sm">Natural vs. Heated Guide</span>
                <span className="text-[#2B2B2B]/70">Microscopic inclusions, thermal alteration & values.</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Visible Crawlable AEO Direct Answer Q&A Section */}
        <section aria-labelledby="gems-faq-heading" className="space-y-6 pt-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2">
              <span className="w-4 h-px bg-[#80601C]" />
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-[#80601C]">
                Gemological Questions & Answers
              </span>
              <span className="w-4 h-px bg-[#80601C]" />
            </div>
            <h2 id="gems-faq-heading" className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
              Ceylon Gemstone Connoisseurship: Direct Answers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {GEM_FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 sm:p-6 rounded-lg bg-[#FDFBF7] border border-[#B8924A]/30 space-y-2.5">
                <h3 className="font-serif text-lg font-medium text-[#5E0F1E] leading-snug">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-[#2B2B2B] font-medium leading-relaxed bg-[#FAF6EE] p-3 rounded border-l-2 border-[#80601C]">
                  {faq.directAnswer}
                </p>
                {faq.detail && (
                  <p className="text-xs text-[#2B2B2B]/75 leading-relaxed pt-1">
                    {faq.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
