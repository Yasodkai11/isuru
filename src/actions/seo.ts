"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminSEORecord } from "@/types/admin";
import { INITIAL_ADMIN_SEO } from "@/lib/admin-seed";
import { requireAdminSession } from "@/lib/auth-checks";

/**
 * Fast cached lookup for Next.js SSR generateMetadata.
 * Queries Supabase seo_records table if configured, otherwise falls back to seed defaults.
 */
export const getSEORecordByPath = cache(async (path: string): Promise<AdminSEORecord | null> => {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("seo_records")
        .select("*")
        .eq("page_path", path)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          pagePath: data.page_path,
          pageTitle: data.page_title,
          metaTitle: data.meta_title,
          metaDescription: data.meta_description,
          keywords: data.keywords || [],
          ogTitle: data.og_title || undefined,
          ogDescription: data.og_description || undefined,
          ogImage: data.og_image || undefined,
          canonicalUrl: data.canonical_url,
          schemaType: data.schema_type,
          indexStatus: data.index_status,
          lastAudited: data.last_audited || new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn(`[getSEORecordByPath] Falling back to seed for ${path}:`, err);
    }
  }

  return INITIAL_ADMIN_SEO.find((r) => r.pagePath === path) || null;
});

/**
 * Retrieves all SEO records for the admin portal.
 */
export async function getAllSEORecordsAction(): Promise<{
  success: boolean;
  records: AdminSEORecord[];
  error?: string;
}> {
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("seo_records")
        .select("*")
        .order("page_path", { ascending: true });

      if (!error && data && data.length > 0) {
        const records: AdminSEORecord[] = data.map((d) => ({
          id: d.id,
          pagePath: d.page_path,
          pageTitle: d.page_title,
          metaTitle: d.meta_title,
          metaDescription: d.meta_description,
          keywords: d.keywords || [],
          ogTitle: d.og_title || undefined,
          ogDescription: d.og_description || undefined,
          ogImage: d.og_image || undefined,
          canonicalUrl: d.canonical_url,
          schemaType: d.schema_type,
          indexStatus: d.index_status,
          lastAudited: d.last_audited || new Date().toISOString(),
        }));
        return { success: true, records };
      }
    } catch (err) {
      console.warn("[getAllSEORecordsAction] Database fetch error, falling back to seed:", err);
    }
  }

  return { success: true, records: INITIAL_ADMIN_SEO };
}

/**
 * Persists changes made in the Admin SEO console to Supabase and invalidates SSR cache.
 */
export async function updateSEORecordAction(
  id: string,
  pagePath: string,
  updates: Partial<AdminSEORecord>
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    // 1. Authorize admin session
    await requireAdminSession();

    // 2. Persist to database if Supabase is connected
    if (isSupabaseConfigured) {
      const supabase = createAdminClient();
      const payload: Record<string, any> = {
        id,
        page_path: pagePath,
        updated_at: new Date().toISOString(),
        last_audited: new Date().toISOString(),
      };

      if (updates.pageTitle !== undefined) payload.page_title = updates.pageTitle;
      if (updates.metaTitle !== undefined) payload.meta_title = updates.metaTitle;
      if (updates.metaDescription !== undefined) payload.meta_description = updates.metaDescription;
      if (updates.canonicalUrl !== undefined) payload.canonical_url = updates.canonicalUrl;
      if (updates.ogTitle !== undefined) payload.og_title = updates.ogTitle;
      if (updates.ogDescription !== undefined) payload.og_description = updates.ogDescription;
      if (updates.ogImage !== undefined) payload.og_image = updates.ogImage;
      if (updates.schemaType !== undefined) payload.schema_type = updates.schemaType;
      if (updates.indexStatus !== undefined) payload.index_status = updates.indexStatus;
      if (updates.keywords !== undefined) payload.keywords = updates.keywords;

      const { error } = await supabase.from("seo_records").upsert(payload, { onConflict: "id" });
      if (error) {
        throw new Error(error.message);
      }
    }

    // 3. Revalidate Next.js SSR/ISR cache for target route and admin portal
    revalidatePath(pagePath);
    revalidatePath("/admin/seo");

    return {
      success: true,
      message: `SEO metadata successfully updated and SSR cache revalidated for ${pagePath}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: "Failed to persist SEO updates to live server.",
      error: err.message || "Unknown error",
    };
  }
}
