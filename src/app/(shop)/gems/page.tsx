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
} from "@/lib/seo/schema";

interface GemsPageProps {
  searchParams: Promise<{
    colour?: string;
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
  const parts: string[] = [];
  if (resolved.colour) parts.push(resolved.colour);
  if (resolved.shape) parts.push(resolved.shape);
  if (resolved.variety) parts.push(resolved.variety);

  const prefix = parts.length > 0 ? `${parts.join(" ")} - ` : "";

  return {
    title: `${prefix}Natural Gemstones Vault`,
    description:
      "Explore certified unheated Ceylon Royal Blue Sapphires, Padparadschas, Rubies, and precious island gemstones with full laboratory certification from NGJA, GIA, and GRS.",
    alternates: {
      canonical: "/gems",
    },
  };
}

export default async function GemsPage({ searchParams }: GemsPageProps) {
  const resolved = await searchParams;

  // Resolve carat range presets
  let minCarat: number | undefined = undefined;
  let maxCarat: number | undefined = undefined;
  if (resolved.carat && resolved.carat !== "all") {
    const foundPreset = CARAT_PRESETS.find((p) => p.label === resolved.carat);
    if (foundPreset) {
      minCarat = foundPreset.min;
      maxCarat = foundPreset.max;
    }
  }

  // Resolve price range presets
  let minPrice: number | undefined = undefined;
  let maxPrice: number | undefined = undefined;
  if (resolved.price && resolved.price !== "all") {
    const foundPrice = PRICE_PRESETS.find((p) => p.label === resolved.price);
    if (foundPrice) {
      minPrice = foundPrice.min;
      maxPrice = foundPrice.max;
    }
  }

  const currentPage = resolved.page ? Math.max(1, parseInt(resolved.page, 10) || 1) : 1;
  const itemsPerPage = 12;

  // Fetch paginated stones from Supabase (with fallback)
  const { gems, total, totalPages } = await getGemstones({
    colour: resolved.colour,
    shape: resolved.shape,
    variety: resolved.variety,
    category: resolved.category,
    origin: resolved.origin,
    minCarat,
    maxCarat,
    minPrice,
    maxPrice,
    search: resolved.search,
    sort: resolved.sort,
    page: currentPage,
    limit: itemsPerPage,
  });

  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Gemstones Vault", url: "/gems" },
  ]);

  const collectionSchema = getCollectionPageSchema({
    title: "Natural Ceylon Gemstones Vault",
    description:
      "Explore certified unheated Ceylon Royal Blue Sapphires, Padparadschas, Rubies, and precious island gemstones with laboratory certifications.",
    url: "/gems",
    gems,
  });

  return (
    <div className="py-10 sm:py-14 bg-[#FAF8F5] min-h-screen">
      <JsonLd data={[breadcrumbSchema, collectionSchema]} />
      <div className="container-luxe">
        {/* Concept 03: Modern Ceylon Gemstone Collection Header */}
        <div className="relative pb-8 mb-8 border-b border-[#B8924A]/25 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2 relative">
            <div className="flex items-center gap-3">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#B8924A] font-semibold">
                Natural Ceylon Vault
              </span>
              <div className="h-px w-10 bg-[#B8924A]/50" />
            </div>

            <div className="flex items-center gap-4">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1D1B18] font-normal tracking-tight">
                Gemstone Collection
              </h1>
              {/* Botanical Leaf Accent */}
              <div className="w-8 h-8 opacity-60 text-[#B8924A] shrink-0 hidden sm:block">
                <svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                  <path d="M5 45 C 10 30, 25 15, 45 5 C 35 15, 25 30, 20 45" />
                  <path d="M22 20 C 18 15, 12 18, 10 22 C 15 22, 20 20, 22 20" />
                  <path d="M30 14 C 28 8, 22 10, 20 15 C 25 15, 28 14, 30 14" />
                </svg>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#736B63] max-w-xl">
              Curated natural unheated Ceylon sapphires, Padparadschas, rubies, and collector mineral specimens authenticated with laboratory certifications.
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
              Direct from Sri Lankan Mines
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
      </div>
    </div>
  );
}
