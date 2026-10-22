import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GoldDivider } from "@/components/layout/gold-divider";
import { JsonLd, getBreadcrumbListSchema } from "@/lib/seo/schema";
import { SEO_CONFIG } from "@/lib/seo-config";
import { ArrowRight, BookOpen, Clock, Calendar, ShieldCheck } from "lucide-react";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Gemological Guides & Educational Resources | Isuru Ceylon Gems",
  description:
    "Authoritative gemological buying guides from Isuru Ceylon Gems. Learn about Ceylon blue sapphires, rare Padparadschas, unheated gemstone identification, laboratory certification, and Ratnapura mining heritage.",
  alternates: {
    canonical: `${SEO_CONFIG.site.url}/guides`,
  },
  openGraph: {
    title: "Gemological Knowledge Guides | Isuru Ceylon Gems",
    description:
      "Deep educational guides on natural Ceylon sapphires, rubies, thermal enhancement detection, and gemstone certification direct from Sri Lanka.",
    url: `${SEO_CONFIG.site.url}/guides`,
    images: [{ url: "/isuru_images/blue1.webp", width: 1200, height: 630, alt: "Isuru Ceylon Gems Guides" }],
  },
};

const GUIDES = [
  {
    slug: "ceylon-blue-sapphire-buying-guide",
    title: "Ceylon Blue Sapphire Buying Guide: Royal Blue, Cornflower, Cut & Carat Valuation",
    subtitle: "Color grading (Royal vs Cornflower), unheated rarity factors, cut symmetry, and market price per carat.",
    image: "/isuru_images/blue1.webp",
    readTime: "8 min",
    lastUpdated: "2026-10-22",
    tag: "Sapphires",
  },
  {
    slug: "padparadscha-sapphire-guide",
    title: "Padparadscha Sapphire Guide: Lotus Blossom Color, Origin, Testing & Market Value",
    subtitle: "The world's rarest corundum: defining the pinkish-orange spectrum, color stability testing, and Ceylon provenance.",
    image: "/isuru_images/Padparadscha%20Sapphire.webp",
    readTime: "8 min",
    lastUpdated: "2026-10-22",
    tag: "Padparadscha",
  },
  {
    slug: "natural-vs-heated-gemstones-guide",
    title: "Natural vs. Heated vs. Synthetic Gemstones: Detection, Inclusions & Value Guide",
    subtitle: "Microscopic inclusion signatures, thermal alteration of rutile silk, diffusion risks, and fair pricing rules.",
    image: "/isuru_images/categories1.webp",
    readTime: "9 min",
    lastUpdated: "2026-10-22",
    tag: "Gemology",
  },
  {
    slug: "pigeon-blood-ruby-guide",
    title: "Pigeon Blood Ruby Guide: Chromium Fluorescence, Ceylon vs. Burma & Pricing",
    subtitle: "The physics of chromium fluorescence, vivid scarlet saturation, Ceylon clarity advantages, and investment valuation.",
    image: "/isuru_images/ruby%20category.webp",
    readTime: "8 min",
    lastUpdated: "2026-10-22",
    tag: "Rubies",
  },
  {
    slug: "how-to-read-gemstone-certificate",
    title: "How to Read a Gemstone Certificate: GIA, GRS, GIC & NGJA Reports Decoded",
    subtitle: "Deciphering treatment codes, origin opinions, millimeter tolerances, and online QR verification against counterfeits.",
    image: "/isuru_images/blue1.webp",
    readTime: "8 min",
    lastUpdated: "2026-10-22",
    tag: "Certification",
  },
  {
    slug: "ratnapura-gem-mining-heritage",
    title: "Ratnapura Gem Mining Heritage: Alluvial Pits, River Illam & Ethical Craft",
    subtitle: "2,500 years of artisanal shaft mining, conical wicker basket washing, and sustainable environmental stewardship.",
    image: "/isuru_images/work/work-pit-mining.webp",
    readTime: "9 min",
    lastUpdated: "2026-10-22",
    tag: "Heritage",
  },
];

export default function GuidesHubPage() {
  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Gemological Guides", url: "/guides" },
  ]);

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2B2B2B] py-12 sm:py-16 lg:py-20">
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="w-5 h-px bg-[#B8924A]" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#80601C]">
              {SEO_CONFIG.brand.name} · Educational Archive
            </span>
            <span className="w-5 h-px bg-[#B8924A]" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#5E0F1E] font-normal leading-tight">
            Gemological Knowledge Guides
          </h1>

          <p className="font-serif text-base sm:text-lg text-[#2B2B2B]/80 leading-relaxed italic">
            “True connoisseurship begins with gemological science, historical integrity, and unvarnished facts.”
          </p>

          <p className="text-sm text-[#2B2B2B]/75 leading-relaxed max-w-2xl mx-auto">
            Authored by certified gemologists and licensed merchants at Isuru Ceylon Gems in Ratnapura. Explore our comprehensive evergreen guides to color grading, unheated rarity, and laboratory authentication.
          </p>

          <GoldDivider withOrnament className="my-6 max-w-xs mx-auto" />
        </header>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {GUIDES.map((guide) => (
            <article
              key={guide.slug}
              className="group flex flex-col bg-[#FDFBF7] rounded-xl overflow-hidden border border-[#B8924A]/30 shadow-xs hover:shadow-md transition-all duration-300 hover:border-[#B8924A]/70"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1A1410]">
                <Image
                  src={guide.image}
                  alt={guide.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#5E0F1E]/90 text-[#F7E7A9] text-[10px] font-semibold uppercase tracking-wider backdrop-blur-xs">
                  {guide.tag}
                </span>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-[#2B2B2B]/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#B8924A]" />
                      {guide.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#B8924A]" />
                      Updated {guide.lastUpdated}
                    </span>
                  </div>

                  <h2 className="font-serif text-lg sm:text-xl text-[#5E0F1E] font-medium leading-snug group-hover:text-[#80601C] transition-colors">
                    <Link href={`/guides/${guide.slug}`}>
                      {guide.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#2B2B2B]/75 leading-relaxed line-clamp-3">
                    {guide.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#B8924A]/20">
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#80601C] hover:text-[#5E0F1E] transition-colors uppercase tracking-wider group-hover:gap-2.5 duration-200"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Institutional Guarantee Banner */}
        <section className="p-6 sm:p-8 rounded-xl bg-[#F5EFE0] border border-[#B8924A]/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-[#80601C] shrink-0 mt-1" />
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-semibold text-[#5E0F1E]">
                Official Sri Lankan Licensing & Standards
              </h3>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/80 max-w-xl leading-relaxed">
                All educational materials and gemstone evaluations comply with the statutory guidelines of the National Gem and Jewellery Authority of Sri Lanka (NGJA License: <strong>{SEO_CONFIG.brand.licenseNumber}</strong>).
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="shrink-0 bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            Consult Our Gemologist
          </Link>
        </section>
      </div>
    </div>
  );
}
