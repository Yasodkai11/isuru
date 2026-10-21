"use server";

import { cache } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Gemstone, GemFilterOptions, PaginatedGemsResult } from "@/types/gem";
import { CATEGORIES_CONFIG, resolveCategoryKey } from "@/lib/constants";
import { CATALOG_GEMS } from "@/lib/catalog-gems";
import { mapDbRowToGemstone } from "@/lib/map-gemstone";

export async function getGemstones(filters?: GemFilterOptions): Promise<PaginatedGemsResult> {
  const page = Math.max(1, filters?.page || 1);
  const limit = Math.max(1, filters?.limit || 6);
  const offset = (page - 1) * limit;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase.from("gemstones").select("*", { count: "exact" });

      // Colour filter
      if (filters?.colour && filters.colour !== "all") {
        query = query.ilike("color", `%${filters.colour}%`);
      }

      // Shape/Cut filter
      if (filters?.shape && filters.shape !== "all") {
        query = query.ilike("cut", `%${filters.shape}%`);
      }

      // Variety filter
      if (filters?.variety && filters.variety !== "all") {
        query = query.ilike("variety", `%${filters.variety}%`);
      }

      // Category filter (supports both direct config keys and mineral variety slugs)
      if (filters?.category && filters.category !== "all") {
        const resolvedKey = resolveCategoryKey(filters.category) || filters.category;
        const match = CATEGORIES_CONFIG[resolvedKey]?.match;
        if (match) {
          query = query.ilike(match.column, `%${match.value}%`);
        }
      }

      // Origin filter
      if (filters?.origin && filters.origin !== "all") {
        query = query.ilike("origin", `%${filters.origin}%`);
      }

      // Carat range filters
      if (filters?.minCarat !== undefined) {
        query = query.gte("carat", filters.minCarat);
      }
      if (filters?.maxCarat !== undefined) {
        query = query.lte("carat", filters.maxCarat);
      }

      // Price range filters
      if (filters?.minPrice !== undefined) {
        query = query.gte("price", filters.minPrice);
      }
      if (filters?.maxPrice !== undefined) {
        query = query.lte("price", filters.maxPrice);
      }

      // Search query (sanitized against PostgREST syntax delimiters)
      if (filters?.search && filters.search.trim()) {
        const cleanQ = filters.search.trim().replace(/[,()]/g, " ");
        query = query.or(`name.ilike.%${cleanQ}%,variety.ilike.%${cleanQ}%,description.ilike.%${cleanQ}%,origin.ilike.%${cleanQ}%`);
      }

      // Sorting
      switch (filters?.sort) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "carat-desc":
          query = query.order("carat", { ascending: false });
          break;
        case "carat-asc":
          query = query.order("carat", { ascending: true });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "featured":
        default:
          query = query.order("featured", { ascending: false }).order("price", { ascending: false });
          break;
      }

      // Server-side pagination range
      query = query.range(offset, offset + limit - 1);

      const { data, count, error } = await query;

      if (error) {
        console.warn("Supabase gemstones query failed:", error.message);
        return { gems: [], total: 0, page, limit, totalPages: 1 };
      }

      const gems = (data ?? []).map(mapDbRowToGemstone);
      const total = count ?? gems.length;

      return {
        gems,
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      };
    } catch (err) {
      console.warn("Supabase gemstones query failed:", err);
      return { gems: [], total: 0, page, limit, totalPages: 1 };
    }
  }

  // Graceful in-memory fallback with full filtering, sorting, and pagination
  let filtered = [...CATALOG_GEMS];

  if (filters?.colour && filters.colour !== "all") {
    const col = filters.colour.toLowerCase();
    filtered = filtered.filter(
      (g) => g.color.toLowerCase().includes(col) || g.name.toLowerCase().includes(col)
    );
  }

  if (filters?.shape && filters.shape !== "all") {
    const shp = filters.shape.toLowerCase();
    filtered = filtered.filter((g) => g.cut.toLowerCase().includes(shp));
  }

  if (filters?.variety && filters.variety !== "all") {
    const v = filters.variety.toLowerCase();
    filtered = filtered.filter((g) => g.variety.toLowerCase().includes(v));
  }

  if (filters?.category && filters.category !== "all") {
    const resolvedCat = resolveCategoryKey(filters.category) || filters.category;
    const match = CATEGORIES_CONFIG[resolvedCat]?.match;
    if (match) {
      if (match.column === "color") {
        filtered = filtered.filter(
          (g) =>
            g.category === filters.category ||
            g.category === resolvedCat ||
            g.color.toLowerCase().includes(match.value.toLowerCase())
        );
      } else {
        filtered = filtered.filter(
          (g) =>
            g.category === filters.category ||
            g.category === resolvedCat ||
            g.variety.toLowerCase().includes(match.value.toLowerCase())
        );
      }
    } else {
      filtered = filtered.filter((g) => g.category === filters.category || g.category === resolvedCat);
    }
  }

  if (filters?.origin && filters.origin !== "all") {
    const orig = filters.origin.toLowerCase();
    filtered = filtered.filter((g) => g.origin.toLowerCase().includes(orig));
  }

  if (filters?.minCarat !== undefined) {
    filtered = filtered.filter((g) => g.carat >= filters.minCarat!);
  }
  if (filters?.maxCarat !== undefined) {
    filtered = filtered.filter((g) => g.carat <= filters.maxCarat!);
  }

  if (filters?.minPrice !== undefined) {
    filtered = filtered.filter((g) => g.price >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    filtered = filtered.filter((g) => g.price <= filters.maxPrice!);
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.variety.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.origin.toLowerCase().includes(q) ||
        g.color.toLowerCase().includes(q) ||
        g.cut.toLowerCase().includes(q)
    );
  }

  // Sorting
  switch (filters?.sort) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "carat-desc":
      filtered.sort((a, b) => b.carat - a.carat);
      break;
    case "carat-asc":
      filtered.sort((a, b) => a.carat - b.carat);
      break;
    case "newest":
      break;
    case "featured":
    default:
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  const total = filtered.length;
  const paginatedGems = filtered.slice(offset, offset + limit);

  return {
    gems: paginatedGems,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export const getGemBySlug = cache(async (slug: string): Promise<Gemstone | null> => {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("gemstones")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        return mapDbRowToGemstone(data);
      }
    } catch (err) {
      console.warn("Supabase single gem fetch note:", err);
    }
    return null;
  }

  return CATALOG_GEMS.find((g) => g.slug === slug) || null;
});

export async function getRelatedGems(currentSlug: string, limit: number = 3): Promise<Gemstone[]> {
  const current = await getGemBySlug(currentSlug);

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from("gemstones")
        .select("*")
        .neq("slug", currentSlug)
        .eq("in_stock", true)
        .limit(limit);

      if (current?.variety) {
        query = query.ilike("variety", `%${current.variety}%`);
      }

      const { data } = await query;
      if (data && data.length > 0) {
        return data.map(mapDbRowToGemstone);
      }
    } catch (err) {
      console.warn("Related gems query note:", err);
    }
  }

  return CATALOG_GEMS
    .filter((g) => g.slug !== currentSlug)
    .sort((a, b) => {
      // Prioritize same category, then same variety
      const score = (g: Gemstone) =>
        (current && g.category && g.category === current.category ? 2 : 0) +
        (current && g.variety === current.variety ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, limit);
}

export interface SitemapGemRecord {
  slug: string;
  updated_at?: string;
  images: Array<{ url: string; alt?: string }>;
}

/**
 * Lightweight projected query for sitemap generation.
 * Selects only slug, updated_at, and images for in-stock gems, avoiding heavy full table scans.
 */
export async function getSitemapGemstones(): Promise<SitemapGemRecord[]> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("gemstones")
        .select("slug, updated_at, images")
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data as SitemapGemRecord[];
      }
    } catch (err) {
      console.warn("Supabase sitemap gems query note:", err);
    }
  }

  return CATALOG_GEMS.filter((g) => g.inStock !== false).map((g) => ({
    slug: g.slug,
    images: g.images,
  }));
}
