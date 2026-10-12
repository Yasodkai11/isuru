import type { Metadata } from "next";
import { getGemstones } from "@/actions/gems";
import { GemCard } from "@/components/gems/gem-card";
import { GemFilters } from "@/components/gems/gem-filters";
import { GoldDivider } from "@/components/layout/gold-divider";

interface GemsPageProps {
  searchParams: Promise<{
    variety?: string;
    origin?: string;
    sort?: "featured" | "price-asc" | "price-desc" | "carat-desc";
  }>;
}

export async function generateMetadata({ searchParams }: GemsPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const varietyTitle = resolvedParams.variety ? `${resolvedParams.variety} - ` : "";

  return {
    title: `${varietyTitle}Ceylon Gemstone Vault | Isuru Gems`,
    description:
      "Explore unheated Ceylon Royal Blue Sapphires, Padparadscha, Rubies, and Asterism Star Sapphires. Certified by NGJA, GIA, and Swiss laboratories.",
  };
}

export default async function GemsPage({ searchParams }: GemsPageProps) {
  const resolvedParams = await searchParams;
  const gems = await getGemstones({
    variety: resolvedParams.variety,
    origin: resolvedParams.origin,
    sort: resolvedParams.sort,
  });

  return (
    <div className="py-12 bg-[#FAF6EE] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold">
            Certified Natural Corundum
          </span>
          {/* Strictly the single H1 for this page */}
          <h1 className="font-serif text-4xl sm:text-5xl text-[#5E0F1E] font-normal tracking-tight">
            The Ceylon Gemstone Vault
          </h1>
          <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
            Every gemstone shown is unique, unrepeated, and earth-born in the legendary alluvial gem gravels of Sri Lanka. Accompanied by authoritative gemological reports.
          </p>
          <GoldDivider withOrnament className="my-6 max-w-sm mx-auto" />
        </div>

        {/* Client-side Filters */}
        <GemFilters />

        {/* Gemstones Grid */}
        {gems.length === 0 ? (
          <div className="bg-[#FDFBF7] border border-[#B8924A]/25 p-16 text-center space-y-4">
            <h2 className="font-serif text-2xl text-[#5E0F1E]">No specimens match your current criteria</h2>
            <p className="text-xs text-[#2B2B2B]/70 max-w-md mx-auto">
              Our master lapidaries regularly cut rough stones from our Ratnapura mines. Contact our concierge for unlisted rough or custom gemstone requests.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gems.map((gem) => (
              <GemCard key={gem.id} gem={gem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
