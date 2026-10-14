"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Gemstone, GemFilterOptions, PaginatedGemsResult } from "@/types/gem";
import { CATEGORIES_CONFIG } from "@/lib/constants";
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

      // Category filter
      if (filters?.category && filters.category !== "all") {
        const match = CATEGORIES_CONFIG[filters.category]?.match;
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

      // Search query
      if (filters?.search && filters.search.trim()) {
        const q = filters.search.trim();
        query = query.or(`name.ilike.%${q}%,variety.ilike.%${q}%,description.ilike.%${q}%,origin.ilike.%${q}%`);
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
    filtered = filtered.filter((g) => g.category === filters.category);
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

export async function getGemBySlug(slug: string): Promise<Gemstone | null> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("gemstones")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return mapDbRowToGemstone(data);
      }
    } catch (err) {
      console.warn("Supabase single gem fetch note:", err);
    }
    return null;
  }

  return CATALOG_GEMS.find((g) => g.slug === slug) || null;
}

export async function getRelatedGems(currentSlug: string, limit: number = 3): Promise<Gemstone[]> {
  const current = await getGemBySlug(currentSlug);
  const { gems } = await getGemstones({ limit: 100 });

  return gems
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
