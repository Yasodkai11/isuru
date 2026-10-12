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
    title: `${prefix}Ceylon Gemstone Vault | Isuru Gems`,
    description:
      "Explore certified unheated Ceylon Royal Blue Sapphires, Padparadschas, Rubies, and precious island gemstones with full laboratory certification from NGJA, GIA, and GRS.",
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
  const itemsPerPage = 6;

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

  return (
    <div className="py-12 bg-[#FAF6EE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Gemstones Vault Banner Matching Proposal Laptop Screen */}
        <div className="relative overflow-hidden bg-[#161210] border border-[#B8924A]/40 p-6 sm:p-10 mb-8 rounded-xs shadow-md">
          {/* Subtle gold ornamentation borders */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF67] to-transparent" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full overflow-hidden border border-[#B8924A]/50 bg-[#221C16] shadow-[0_0_20px_rgba(27,58,138,0.3)]">
                <Image
                  src="/isuru_images/blue1.jpg"
                  alt="Ceylon Gemstones Vault"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#B8924A] text-[10px] uppercase tracking-[0.25em] font-medium justify-center sm:justify-start">
                  <span className="w-3 h-[1px] bg-[#B8924A]" />
                  <span>Ceylon Vault Catalog</span>
                </div>
                {/* Strictly single H1 for this route */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF6EE] font-normal tracking-wide">
                  Gemstones
                </h1>
                <p className="text-xs text-[#FAF6EE]/75 max-w-lg">
                  Natural unheated sapphires, rare Padparadschas, and precious crystals direct from Ratnapura alluvial gravels.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#B8924A]">
              <div className="px-4 py-2 border border-[#B8924A]/30 bg-[#221C16]/80 text-center">
                <span className="font-serif text-lg font-bold text-[#D4AF67] block">{total}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#FAF6EE]/70">Available Pieces</span>
              </div>
              <div className="px-4 py-2 border border-[#B8924A]/30 bg-[#221C16]/80 text-center">
                <span className="font-serif text-lg font-bold text-[#D4AF67] block">100%</span>
                <span className="text-[9px] uppercase tracking-wider text-[#FAF6EE]/70">Earth-Mined</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B8924A]/50 to-transparent" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
