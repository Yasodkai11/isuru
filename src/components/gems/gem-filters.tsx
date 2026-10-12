"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  GEM_COLOURS,
  GEM_SHAPES,
  CARAT_PRESETS,
  PRICE_PRESETS,
  CEYLON_ORIGINS,
} from "@/lib/constants";
import { Filter, RotateCcw, X, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GemFiltersProps {
  totalCount?: number;
}

export function GemFilters({ totalCount }: GemFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read current URL state
  const currentColour = searchParams.get("colour") || "all";
  const currentShape = searchParams.get("shape") || "all";
  const currentCarat = searchParams.get("carat") || "all";
  const currentPrice = searchParams.get("price") || "all";
  const currentOrigin = searchParams.get("origin") || "all";
  const currentSort = searchParams.get("sort") || "featured";
  const currentSearch = searchParams.get("search") || "";

  // Helper to update URL params and reset page to 1
  const updateParams = (newParams: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset page to 1 on filter changes
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleReset = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  // Determine active filters for badge chips
  const activeChips: { key: string; label: string; value: string }[] = [];
  if (currentColour !== "all") activeChips.push({ key: "colour", label: "Colour", value: currentColour });
  if (currentShape !== "all") activeChips.push({ key: "shape", label: "Shape", value: currentShape });
  if (currentCarat !== "all") activeChips.push({ key: "carat", label: "Carat", value: currentCarat });
  if (currentPrice !== "all") activeChips.push({ key: "price", label: "Price", value: currentPrice });
  if (currentOrigin !== "all") activeChips.push({ key: "origin", label: "Origin", value: currentOrigin });
  if (currentSearch) activeChips.push({ key: "search", label: "Search", value: `"${currentSearch}"` });

  return (
    <div className="bg-[#FDFBF7] border border-[#B8924A]/30 p-5 sm:p-6 mb-8 space-y-5 shadow-xs">
      {/* Top Filter Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#B8924A]/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-none border border-[#B8924A]/40 flex items-center justify-center text-[#5E0F1E] bg-[#FAF6EE]">
            <Filter className="w-4 h-4 text-[#B8924A]" />
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-[0.22em] text-[#5E0F1E] font-semibold">
              Filter Ceylon Collection
            </h2>
            {totalCount !== undefined && (
              <span className="text-[11px] text-[#2B2B2B]/65">
                {totalCount} authenticated specimen{totalCount === 1 ? "" : "s"} available
              </span>
            )}
          </div>
        </div>

        {/* Right Actions: Mobile Toggle & Reset */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="sm:hidden flex items-center gap-1.5 text-xs text-[#5E0F1E] border border-[#B8924A]/40 px-3 py-1.5 bg-[#FAF6EE]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B8924A]" />
            <span>{mobileFiltersOpen ? "Hide Filters" : "Filter Options"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`} />
          </button>

          {activeChips.length > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-[#B8924A] hover:text-[#5E0F1E] flex items-center gap-1 transition-colors cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs ${mobileFiltersOpen ? "block" : "hidden sm:grid"}`}>
        {/* 1. Colour Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block">
            Colour
          </label>
          <select
            value={currentColour}
            onChange={(e) => updateParams({ colour: e.target.value })}
            className="w-full bg-[#FAF6EE] border border-[#B8924A]/40 px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B8924A] transition-subtle cursor-pointer"
          >
            <option value="all">All Colours</option>
            {GEM_COLOURS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Shape / Cut Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block">
            Shape / Cut
          </label>
          <select
            value={currentShape}
            onChange={(e) => updateParams({ shape: e.target.value })}
            className="w-full bg-[#FAF6EE] border border-[#B8924A]/40 px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B8924A] transition-subtle cursor-pointer"
          >
            <option value="all">All Shapes</option>
            {GEM_SHAPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Carat Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block">
            Carat Weight
          </label>
          <select
            value={currentCarat}
            onChange={(e) => updateParams({ carat: e.target.value })}
            className="w-full bg-[#FAF6EE] border border-[#B8924A]/40 px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B8924A] transition-subtle cursor-pointer"
          >
            {CARAT_PRESETS.map((cp) => (
              <option key={cp.label} value={cp.label === "All Weights" ? "all" : cp.label}>
                {cp.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Price Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block">
            Investment Range
          </label>
          <select
            value={currentPrice}
            onChange={(e) => updateParams({ price: e.target.value })}
            className="w-full bg-[#FAF6EE] border border-[#B8924A]/40 px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B8924A] transition-subtle cursor-pointer"
          >
            {PRICE_PRESETS.map((pp) => (
              <option key={pp.label} value={pp.label === "All Prices" ? "all" : pp.label}>
                {pp.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Sort Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block">
            Sort Order
          </label>
          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="w-full bg-[#FAF6EE] border border-[#B8924A]/40 px-3 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B8924A] transition-subtle cursor-pointer font-medium"
          >
            <option value="featured">Featured Specimens</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="carat-desc">Carat: High to Low</option>
            <option value="carat-asc">Carat: Low to High</option>
            <option value="newest">Recently Extracted</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#B8924A]/15">
          <span className="text-[11px] text-[#2B2B2B]/60 uppercase tracking-wider mr-1">
            Active Criteria:
          </span>
          {activeChips.map((chip) => (
            <Badge
              key={chip.key}
              variant="gold"
              className="inline-flex items-center gap-1.5 py-1 px-2.5 text-[10px] bg-[#F2EADB] border-[#B8924A]/40 text-[#5E0F1E]"
            >
              <span className="text-[#2B2B2B]/60">{chip.label}:</span>
              <span className="font-semibold">{chip.value}</span>
              <button
                type="button"
                onClick={() => updateParams({ [chip.key]: null })}
                className="hover:text-red-700 ml-0.5 p-0.5 cursor-pointer"
                aria-label={`Remove filter ${chip.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Loading Indicator for Transition */}
      {isPending && (
        <div className="text-[11px] text-[#B8924A] tracking-wider animate-pulse pt-1">
          Filtering Ceylon inventory...
        </div>
      )}
    </div>
  );
}
