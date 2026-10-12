import type { Metadata } from "next";
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
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold block">
            Natural Earth-Mined Corundum
          </span>
          {/* Strictly the single H1 for this page */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#5E0F1E] font-normal tracking-tight">
            The Ceylon Gemstone Vault
          </h1>
          <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
            Every gemstone in our vault is singular, unheated, and recovered from the ancient alluvial gem gravels of Ratnapura, Sri Lanka. Filter by colour, shape, carat weight, and investment range.
          </p>
          <GoldDivider withOrnament className="my-6 max-w-sm mx-auto" />
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
