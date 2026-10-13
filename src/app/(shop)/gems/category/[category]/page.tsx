import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getGemstones } from "@/actions/gems";
import { GemCard } from "@/components/gems/gem-card";
import { GemFilters } from "@/components/gems/gem-filters";
import { GemPagination } from "@/components/gems/gem-pagination";
import { GoldDivider } from "@/components/layout/gold-divider";
import { CATEGORIES_CONFIG, CARAT_PRESETS, PRICE_PRESETS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    colour?: string;
    shape?: string;
    carat?: string;
    price?: string;
    sort?: "featured" | "price-asc" | "price-desc" | "carat-desc" | "carat-asc" | "newest";
    page?: string;
    origin?: string;
    search?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const config = CATEGORIES_CONFIG[category];

  if (!config) {
    return {
      title: "Gemstone Category | Isuru Gems Ceylon",
    };
  }

  return {
    title: `${config.title} | ${config.subtitle} | Isuru Gems Ceylon`,
    description: config.description,
    openGraph: {
      title: `${config.title} | Isuru Gems`,
      description: config.description,
      images: [{ url: config.image, width: 1200, height: 630, alt: config.title }],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const config = CATEGORIES_CONFIG[category];

  if (!config) {
    notFound();
  }

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

  // Fetch gems filtered by this category + any active searchParams
  const { gems, total, totalPages } = await getGemstones({
    category,
    colour: resolved.colour,
    shape: resolved.shape,
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

  const categoryNavItems = [
    { slug: "blue-sapphires", label: "Blue Sapphires" },
    { slug: "ceylon-rubies", label: "Ceylon Rubies" },
    { slug: "padparadscha", label: "Padparadscha" },
    { slug: "alexandrite", label: "Alexandrite" },
    { slug: "yellow-sapphires", label: "Yellow Sapphires" },
    { slug: "rare-collector", label: "Rough & Collector" },
  ];

  return (
    <div className="py-12 bg-[#FAF6EE] min-h-screen">
      <div className="container-luxe space-y-10">
        {/* Breadcrumb and Back */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#2B2B2B]/70">
            <Link href="/" className="hover:text-[#5E0F1E] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/gems" className="hover:text-[#5E0F1E] transition-colors">
              Gemstones
            </Link>
            <span>/</span>
            <span className="text-[#5E0F1E] font-semibold">{config.title}</span>
          </nav>

          <Link
            href="/gems"
            className="inline-flex items-center text-xs uppercase tracking-widest text-[#5E0F1E] hover:text-[#B8924A] transition-colors gap-2 self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All Collections</span>
          </Link>
        </div>

        {/* Editorial Category Showcase Banner */}
        <div className="relative overflow-hidden bg-[#161210] border border-[#B8924A]/40 p-6 sm:p-10 rounded-xs shadow-md">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF67] to-transparent" />
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-xs overflow-hidden border border-[#B8924A]/50 bg-[#221C16] shadow-[0_0_25px_rgba(184,146,74,0.3)]">
              <Image
                src={config.image}
                alt={config.title}
                fill
                priority
                sizes="(max-width: 640px) 112px, 144px"
                className="object-cover"
              />
            </div>
            <div className="space-y-3 text-center md:text-left flex-1">
              <Badge variant="gold" className="text-[10px] tracking-[0.25em] py-0.5 px-3">
                <Sparkles className="w-3 h-3 text-[#B8924A] mr-1 inline" />
                {config.tagline}
              </Badge>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF6EE] font-normal tracking-tight">
                {config.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#FAF6EE]/80 leading-relaxed max-w-2xl">
                {config.description}
              </p>
            </div>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categoryNavItems.map((item) => {
            const isActive = item.slug === category;
            return (
              <Link
                key={item.slug}
                href={`/gems/category/${item.slug}`}
                className={`text-xs uppercase tracking-wider px-4 py-2 border transition-all font-medium ${
                  isActive
                    ? "bg-[#5E0F1E] text-[#FAF6EE] border-[#5E0F1E] shadow-xs"
                    : "bg-[#FDFBF7] text-[#2B2B2B] border-[#B8924A]/30 hover:border-[#B8924A]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Filters */}
        <GemFilters totalCount={total} />

        {/* Gemstones Grid */}
        {gems.length === 0 ? (
          <div className="bg-[#FDFBF7] border border-[#B8924A]/25 p-16 text-center space-y-5 my-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E]">
              No {config.title} match current filter parameters
            </h2>
            <p className="text-xs sm:text-sm text-[#2B2B2B]/70 max-w-md mx-auto leading-relaxed">
              Contact our Ratnapura acquisition concierge for unlisted rough specimens or custom cut reserves in this category.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <Link href={`/gems/category/${category}`}>
                <Button variant="outline" size="sm">
                  Clear Filters
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="primary" size="sm">
                  Request Private Sourcing
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
