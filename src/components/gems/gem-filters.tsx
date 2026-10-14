"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  GEM_COLOURS,
  GEM_SHAPES,
  CARAT_PRESETS,
  PRICE_PRESETS,
} from "@/lib/constants";
import { RotateCcw, SlidersHorizontal, ChevronDown, Check } from "lucide-react";

interface GemFiltersProps {
  totalCount?: number;
}

export function GemFilters({ totalCount }: GemFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Local state initialized from URL params for crisp form control
  const [selectedColour, setSelectedColour] = useState(searchParams.get("colour") || "all");
  const [selectedShape, setSelectedShape] = useState(searchParams.get("shape") || "all");
  const [selectedCarat, setSelectedCarat] = useState(searchParams.get("carat") || "all");
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get("price") || "all");
  const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "featured");

  const hasActiveFilters =
    selectedColour !== "all" ||
    selectedShape !== "all" ||
    selectedCarat !== "all" ||
    selectedPrice !== "all" ||
    Boolean(searchParams.get("search"));

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (selectedColour === "all") params.delete("colour");
    else params.set("colour", selectedColour);

    if (selectedShape === "all") params.delete("shape");
    else params.set("shape", selectedShape);

    if (selectedCarat === "all") params.delete("carat");
    else params.set("carat", selectedCarat);

    if (selectedPrice === "all") params.delete("price");
    else params.set("price", selectedPrice);

    if (selectedSort === "featured") params.delete("sort");
    else params.set("sort", selectedSort);

    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleReset = () => {
    setSelectedColour("all");
    setSelectedShape("all");
    setSelectedCarat("all");
    setSelectedPrice("all");
    setSelectedSort("featured");

    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#B8924A]/30 p-5 sm:p-6 mb-10 shadow-xs rounded-xl">
      {/* Mobile Toggle */}
      <div className="flex sm:hidden items-center justify-between pb-3 border-b border-[#B8924A]/20">
        <span className="text-xs uppercase tracking-widest text-[#0E2A20] font-semibold">
          Filters ({totalCount} Stones)
        </span>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-1.5 text-xs text-[#0E2A20] border border-[#B8924A]/40 px-3 py-1.5 bg-[#FAF8F5] rounded-full"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#B8924A]" />
          <span>{mobileFiltersOpen ? "Close" : "Open Filters"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Filter Form Matching Modern Ceylon Mockup */}
      <form
        onSubmit={handleApplyFilters}
        className={`pt-2 sm:pt-0 ${mobileFiltersOpen ? "block" : "hidden sm:block"}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* 1. Colour */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.22em] text-[#0E2A20] font-semibold block">
              Colour
            </label>
            <select
              value={selectedColour}
              onChange={(e) => setSelectedColour(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#B8924A]/40 px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#0E2A20] transition-all rounded-lg cursor-pointer font-medium"
            >
              <option value="all">All Colours</option>
              {GEM_COLOURS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Shape */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.22em] text-[#0E2A20] font-semibold block">
              Shape
            </label>
            <select
              value={selectedShape}
              onChange={(e) => setSelectedShape(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#B8924A]/40 px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#0E2A20] transition-all rounded-lg cursor-pointer font-medium"
            >
              <option value="all">All Shapes</option>
              {GEM_SHAPES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Carat */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.22em] text-[#0E2A20] font-semibold block">
              Carat
            </label>
            <select
              value={selectedCarat}
              onChange={(e) => setSelectedCarat(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#B8924A]/40 px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#0E2A20] transition-all rounded-lg cursor-pointer font-medium"
            >
              <option value="all">All Carat</option>
              {CARAT_PRESETS.filter((p) => p.label !== "All Weights").map((p) => (
                <option key={p.label} value={p.label}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Action: Modern Emerald "Apply Filters" Pill Button */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#0E2A20] hover:bg-[#173E30] text-[#FAF8F5] py-2.5 px-5 text-xs uppercase tracking-[0.18em] font-medium transition-all duration-300 shadow-sm cursor-pointer text-center rounded-lg hover:shadow-md"
            >
              {isPending ? "Filtering..." : "Apply Filters"}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 text-[#B8924A] hover:text-[#0E2A20] border border-[#B8924A]/40 bg-[#FAF8F5] hover:bg-[#B8924A]/10 transition-colors cursor-pointer rounded-lg"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
