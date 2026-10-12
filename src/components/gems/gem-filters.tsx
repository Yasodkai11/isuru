"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CEYLON_ORIGINS, GEM_VARIETIES } from "@/lib/constants";
import { Filter, RotateCcw } from "lucide-react";

export function GemFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentVariety = searchParams.get("variety") || "all";
  const currentOrigin = searchParams.get("origin") || "all";
  const currentSort = searchParams.get("sort") || "featured";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/gems?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/gems");
  };

  return (
    <div className="bg-[#FDFBF7] border border-[#B8924A]/25 p-5 mb-8 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#B8924A]/15">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#5E0F1E] font-semibold">
          <Filter className="w-4 h-4 text-[#B8924A]" />
          <span>Refine Ceylon Collection</span>
        </div>
        {(currentVariety !== "all" || currentOrigin !== "all" || currentSort !== "featured") && (
          <button
            onClick={handleReset}
            className="text-xs text-[#B8924A] hover:text-[#5E0F1E] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* Variety Selector */}
        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/70 font-medium block">
            Gemstone Variety
          </label>
          <select
            value={currentVariety}
            onChange={(e) => handleFilterChange("variety", e.target.value)}
            className="w-full bg-[#FAF6EE] border border-[#B8924A]/30 px-3 py-2 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B8924A]"
          >
            <option value="all">All Varieties</option>
            {GEM_VARIETIES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Origin Selector */}
        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/70 font-medium block">
            Ceylon Mining Origin
          </label>
          <select
            value={currentOrigin}
            onChange={(e) => handleFilterChange("origin", e.target.value)}
            className="w-full bg-[#FAF6EE] border border-[#B8924A]/30 px-3 py-2 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B8924A]"
          >
            <option value="all">All Ceylon Regions</option>
            {CEYLON_ORIGINS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/70 font-medium block">
            Sort Order
          </label>
          <select
            value={currentSort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="w-full bg-[#FAF6EE] border border-[#B8924A]/30 px-3 py-2 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#B8924A]"
          >
            <option value="featured">Featured Specimens</option>
            <option value="carat-desc">Carat Weight: High to Low</option>
            <option value="price-asc">Price: Modest to Royal</option>
            <option value="price-desc">Price: Royal to Modest</option>
          </select>
        </div>
      </div>
    </div>
  );
}
