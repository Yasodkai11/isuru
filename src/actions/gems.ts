"use server";

import { createClient } from "@/lib/supabase/server";
import { Gemstone, GemFilterOptions, GemImage } from "@/types/gem";
import { SAMPLE_GEMS } from "@/lib/constants";

export async function getGemstones(filters?: GemFilterOptions): Promise<Gemstone[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("gemstones").select("*");

    if (filters?.variety && filters.variety !== "all") {
      query = query.ilike("variety", `%${filters.variety}%`);
    }

    if (filters?.origin && filters.origin !== "all") {
      query = query.ilike("origin", `%${filters.origin}%`);
    }

    if (filters?.minCarat) {
      query = query.gte("carat", filters.minCarat);
    }

    if (filters?.maxCarat) {
      query = query.lte("carat", filters.maxCarat);
    }

    if (filters?.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        variety: row.variety,
        carat: row.carat,
        origin: row.origin,
        cut: row.cut,
        dimensions: row.dimensions,
        color: row.color,
        treatment: row.treatment,
        clarity: row.clarity,
        price: row.price,
        currency: (row.currency as "USD" | "LKR") || "USD",
        inStock: row.in_stock,
        featured: row.featured,
        description: row.description,
        certificate: {
          lab: row.certificate_lab,
          number: row.certificate_number,
          pdfUrl: row.certificate_pdf_url || undefined,
        },
        images: Array.isArray(row.images) ? (row.images as unknown as GemImage[]) : [],
      }));
    }
  } catch {
    // Graceful fallback to rich sample inventory
  }

  // Filter in-memory sample inventory
  let result = [...SAMPLE_GEMS];

  if (filters?.variety && filters.variety !== "all") {
    result = result.filter((g) => g.variety.toLowerCase().includes(filters.variety!.toLowerCase()));
  }

  if (filters?.origin && filters.origin !== "all") {
    result = result.filter((g) => g.origin.toLowerCase().includes(filters.origin!.toLowerCase()));
  }

  if (filters?.minCarat) {
    result = result.filter((g) => g.carat >= filters.minCarat!);
  }

  if (filters?.maxCarat) {
    result = result.filter((g) => g.carat <= filters.maxCarat!);
  }

  if (filters?.maxPrice) {
    result = result.filter((g) => g.price <= filters.maxPrice!);
  }

  if (filters?.sort === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (filters?.sort === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (filters?.sort === "carat-desc") {
    result.sort((a, b) => b.carat - a.carat);
  }

  return result;
}

export async function getGemBySlug(slug: string): Promise<Gemstone | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gemstones")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        variety: data.variety,
        carat: data.carat,
        origin: data.origin,
        cut: data.cut,
        dimensions: data.dimensions,
        color: data.color,
        treatment: data.treatment,
        clarity: data.clarity,
        price: data.price,
        currency: (data.currency as "USD" | "LKR") || "USD",
        inStock: data.in_stock,
        featured: data.featured,
        description: data.description,
        certificate: {
          lab: data.certificate_lab,
          number: data.certificate_number,
          pdfUrl: data.certificate_pdf_url || undefined,
        },
        images: Array.isArray(data.images) ? (data.images as unknown as GemImage[]) : [],
      };
    }
  } catch {
    // Fallback to sample inventory
  }

  return SAMPLE_GEMS.find((g) => g.slug === slug) || null;
}
