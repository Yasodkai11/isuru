"use server";

import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Gemstone } from "@/types/gem";
import {
  AdminOrder,
  OrderStatus,
  AdminEnquiry,
  EnquiryStatus,
  AdminCategory,
  MediaAsset,
  AdminSettingsData,
  MediaType,
} from "@/types/admin";
import { CATALOG_GEMS } from "@/lib/catalog-gems";
import {
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_ENQUIRIES,
  INITIAL_ADMIN_CATEGORIES,
  INITIAL_ADMIN_MEDIA,
  INITIAL_ADMIN_SETTINGS,
} from "@/lib/admin-seed";
import { mapDbRowToGemstone } from "@/lib/map-gemstone";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-checks";
import { Database, Json } from "@/types/supabase";

export interface AdminActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface DbOrderRow {
  id: string;
  created_at: string;
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  city: string;
  country: string;
  total_amount: number | string;
  currency?: string | null;
  status: string;
  notes?: string | null;
  tracking_carrier?: string | null;
  tracking_number?: string | null;
  customs_declaration_number?: string | null;
  dispatched_at?: string | null;
}

interface DbOrderItemRow {
  id?: string;
  created_at?: string;
  order_id?: string;
  gem_id?: string | null;
  gem_name?: string | null;
  variety?: string | null;
  carat?: number | string | null;
  price?: number | string | null;
  currency?: string | null;
}

interface DbInquiryRow {
  id: string;
  created_at: string;
  gem_id?: string | null;
  gem_name?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  country: string;
  message: string;
  preferred_currency?: string | null;
  status: string;
  reply_notes?: string | null;
  replied_at?: string | null;
}

/**
 * Fetch all real gemstones directly from Supabase for the Admin Panel.
 * Requires verified administrator clearance.
 */
export async function getAdminGemstonesAction(): Promise<AdminActionResult<Gemstone[]>> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
      data: [],
    };
  }

  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Supabase not configured, returning local catalog.",
      data: CATALOG_GEMS,
    };
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("gemstones")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("getAdminGemstonesAction Supabase query error:", error.message);
      return {
        success: true,
        message: `Supabase query note: ${error.message}. Serving local catalog (${CATALOG_GEMS.length} items).`,
        data: CATALOG_GEMS,
      };
    }

    const gems = (data ?? []).map(mapDbRowToGemstone);
    return {
      success: true,
      message: `Retrieved ${gems.length} gemstones from Supabase.`,
      data: gems.length > 0 ? gems : CATALOG_GEMS,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("getAdminGemstonesAction note:", msg);
    return {
      success: true,
      message: `Could not load from Supabase (${msg}). Serving local catalog (${CATALOG_GEMS.length} items).`,
      data: CATALOG_GEMS,
    };
  }
}

/**
 * Insert or update a gemstone in Supabase.
 * Requires verified administrator clearance.
 */
export async function saveAdminGemstoneAction(gem: Gemstone): Promise<AdminActionResult<Gemstone>> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Saved to local store (Supabase unconfigured).",
      data: gem,
    };
  }

  try {
    const supabase = await createAdminClient();

    // Check if ID is a valid UUID
    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(gem.id);

    const dbPayload: Database["public"]["Tables"]["gemstones"]["Insert"] = {
      ...(isValidUuid ? { id: gem.id } : {}),
      slug: gem.slug,
      name: gem.name,
      variety: gem.variety,
      carat: Math.max(0.01, Number(gem.carat) || 1.0),
      origin: gem.origin,
      cut: gem.cut,
      dimensions: gem.dimensions,
      color: gem.color,
      treatment: gem.treatment,
      clarity: gem.clarity,
      price: Math.max(0, Number(gem.price) || 0),
      currency: gem.currency || "USD",
      in_stock: gem.inStock,
      featured: Boolean(gem.featured),
      description: gem.description,
      certificate_lab: gem.certificate.lab || "NGJA",
      certificate_number: gem.certificate.number || "NGJA-PENDING",
      certificate_pdf_url: gem.certificate.pdfUrl || null,
      images: (gem.images || []) as unknown as Json,
    };

    const { data, error } = await supabase
      .from("gemstones")
      .upsert(dbPayload, { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: `Failed to save to database: ${error.message}`,
        error: error.message,
      };
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/gems");
    revalidatePath(`/gems/${gem.slug}`);

    return {
      success: true,
      message: `Gemstone "${gem.name}" saved directly to Supabase DB.`,
      data: data ? mapDbRowToGemstone(data) : gem,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Database save exception: ${msg}`,
      error: msg,
    };
  }
}

/**
 * Delete a gemstone from Supabase.
 * Requires verified administrator clearance.
 */
export async function deleteAdminGemstoneAction(idOrSlug: string): Promise<AdminActionResult> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) {
    return { success: true, message: "Deleted locally." };
  }

  try {
    const supabase = await createAdminClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
    const identifierCol = isUuid ? "id" : "slug";

    // DATA-10: Check if gemstone is referenced in historical orders before attempting hard delete
    const { data: gemRecord } = await supabase
      .from("gemstones")
      .select("id, name")
      .eq(identifierCol, idOrSlug)
      .maybeSingle();

    if (gemRecord) {
      const { data: existingItems } = await supabase
        .from("order_items")
        .select("id")
        .eq("gem_id", gemRecord.id)
        .limit(1);

      if (existingItems && existingItems.length > 0) {
        // Soft delete to protect referential integrity and customer order receipts
        await supabase
          .from("gemstones")
          .update({ is_archived: true, in_stock: false })
          .eq("id", gemRecord.id);

        revalidatePath("/admin/products");
        revalidatePath("/admin");
        revalidatePath("/gems");
        return {
          success: true,
          message: "Gemstone is referenced in past acquisitions. Soft-archived to protect historical records.",
        };
      }
    }

    const { error } = isUuid
      ? await supabase.from("gemstones").delete().eq("id", idOrSlug)
      : await supabase.from("gemstones").delete().eq("slug", idOrSlug);

    if (error) {
      if (error.message.includes("violates foreign key constraint") || error.code === "23503") {
        await supabase
          .from("gemstones")
          .update({ is_archived: true, in_stock: false })
          .eq(identifierCol, idOrSlug);

        revalidatePath("/admin/products");
        revalidatePath("/admin");
        revalidatePath("/gems");
        return {
          success: true,
          message: "Gemstone has associated historical orders. Soft-archived to protect audit history.",
        };
      }
      return { success: false, message: error.message, error: error.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/gems");

    return { success: true, message: "Gemstone deleted from database." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg, error: msg };
  }
}

/**
 * Toggle stock availability directly in Supabase.
 * Requires verified administrator clearance.
 */
export async function toggleAdminGemstoneStockAction(idOrSlug: string, inStock: boolean): Promise<AdminActionResult> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) {
    return { success: true, message: "Toggled stock locally." };
  }

  try {
    const supabase = await createAdminClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);

    const { error } = isUuid
      ? await supabase.from("gemstones").update({ in_stock: inStock }).eq("id", idOrSlug)
      : await supabase.from("gemstones").update({ in_stock: inStock }).eq("slug", idOrSlug);

    if (error) {
      return { success: false, message: error.message, error: error.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return { success: true, message: `Stock status updated to ${inStock ? "Available" : "Reserved/Sold"}.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg, error: msg };
  }
}

/**
 * Toggle featured showcase status directly in Supabase.
 * Requires verified administrator clearance.
 */
export async function toggleAdminGemstoneFeaturedAction(idOrSlug: string, featured: boolean): Promise<AdminActionResult> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) {
    return { success: true, message: "Toggled featured locally." };
  }

  try {
    const supabase = await createAdminClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);

    const { error } = isUuid
      ? await supabase.from("gemstones").update({ featured }).eq("id", idOrSlug)
      : await supabase.from("gemstones").update({ featured }).eq("slug", idOrSlug);

    if (error) {
      return { success: false, message: error.message, error: error.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: `Featured status updated to ${featured ? "Featured" : "Standard"}.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg, error: msg };
  }
}

/**
 * Fetch real orders from Supabase.
 * Requires verified administrator clearance.
 */
export async function getAdminOrdersAction(): Promise<AdminActionResult<AdminOrder[]>> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
      data: [],
    };
  }

  if (!isSupabaseConfigured) {
    return { success: true, message: "Using local orders seed.", data: INITIAL_ADMIN_ORDERS };
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { success: true, message: "Default seed fallback.", data: INITIAL_ADMIN_ORDERS };
    }

    const orders: AdminOrder[] = (data as unknown as Array<DbOrderRow & { order_items?: DbOrderItemRow[] }>).map((row) => {
      const realItems = Array.isArray(row.order_items) && row.order_items.length > 0
        ? row.order_items.map((item) => ({
          gemId: item.gem_id || "gem-item",
          name: item.gem_name || "Ceylon Gemstone",
          variety: item.variety || "Ceylon Corundum",
          carat: Number(item.carat) || 1.0,
          price: Number(item.price) || 0,
          image: "/isuru_images/blue1.webp",
          certificateLab: "NGJA Certified",
          certificateNumber: "NGJA-LOT",
        }))
        : [
          {
            gemId: "gem-ceylon",
            name: row.notes?.split("|")[1]?.replace("Items:", "")?.trim() || "Natural Ceylon Gemstone Acquisition",
            variety: "Ceylon Sapphire",
            carat: 3.5,
            price: Number(row.total_amount),
            image: "/isuru_images/blue1.webp",
            certificateLab: "GRS & NGJA",
            certificateNumber: "NGJA-2024",
          },
        ];

      return {
        id: row.id,
        createdAt: row.created_at,
        customerName: row.customer_name,
        email: row.email,
        phone: row.phone,
        shippingAddress: row.shipping_address,
        city: row.city,
        country: row.country,
        totalAmount: Number(row.total_amount),
        currency: (row.currency as "USD" | "LKR") || "USD",
        status: row.status as OrderStatus,
        paymentMethod: "Bank Escrow Wire Transfer",
        notes: row.notes || undefined,
        trackingCarrier: row.tracking_carrier || undefined,
        trackingNumber: row.tracking_number || undefined,
        customsDeclarationNumber: row.customs_declaration_number || undefined,
        items: realItems,
      };
    });

    return {
      success: true,
      message: `Retrieved ${orders.length} real orders from Supabase database.`,
      data: orders,
    };
  } catch {
    return { success: true, message: "Fallback to local orders.", data: INITIAL_ADMIN_ORDERS };
  }
}

/**
 * Update order status in Supabase.
 * Requires verified administrator clearance.
 */
export async function updateAdminOrderStatusAction(orderId: string, status: OrderStatus): Promise<AdminActionResult> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) return { success: true, message: "Updated locally." };

  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) return { success: false, message: error.message, error: error.message };
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true, message: `Order status set to ${status}.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg, error: msg };
  }
}

/**
 * Update and persist order shipping carrier & waybill tracking to Supabase (DATA-08).
 * Requires verified administrator clearance.
 */
export async function updateAdminOrderTrackingAction(
  orderId: string,
  carrier: string,
  trackingNumber: string,
  customsDeclarationNumber?: string
): Promise<AdminActionResult> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) return { success: true, message: "Updated tracking locally." };

  try {
    const supabase = await createAdminClient();
    const updatePayload: Database["public"]["Tables"]["orders"]["Update"] = {
      tracking_carrier: carrier,
      tracking_number: trackingNumber,
      customs_declaration_number: customsDeclarationNumber || null,
      dispatched_at: new Date().toISOString(),
      status: "dispatched",
    };

    const { error } = await supabase.from("orders").update(updatePayload).eq("id", orderId);
    if (error) return { success: false, message: error.message, error: error.message };

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/account");
    return { success: true, message: "Armored transport tracking details persisted to database." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg, error: msg };
  }
}

/**
 * Fetch real customer inquiries from Supabase.
 * Requires verified administrator clearance.
 */
export async function getAdminInquiriesAction(): Promise<AdminActionResult<AdminEnquiry[]>> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
      data: [],
    };
  }

  if (!isSupabaseConfigured) {
    return { success: true, message: "Using local enquiries seed.", data: INITIAL_ADMIN_ENQUIRIES };
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { success: true, message: "Default inquiries seed fallback.", data: INITIAL_ADMIN_ENQUIRIES };
    }

    const enquiries: AdminEnquiry[] = (data as DbInquiryRow[]).map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      gemId: row.gem_id || undefined,
      gemName: row.gem_name || "General Collection Inquiry",
      fullName: row.full_name,
      email: row.email,
      phone: row.phone || undefined,
      country: row.country,
      type: (row.gem_id ? "gem_consultation" : "wholesale_parcel") as "gem_consultation" | "wholesale_parcel",
      message: row.message,
      preferredCurrency: (row.preferred_currency as "USD" | "LKR") || "USD",
      status: (row.status as EnquiryStatus) || "pending",
      replyNotes: row.reply_notes || undefined,
    }));

    return {
      success: true,
      message: `Retrieved ${enquiries.length} real inquiries from Supabase database.`,
      data: enquiries,
    };
  } catch {
    return { success: true, message: "Fallback to local enquiries.", data: INITIAL_ADMIN_ENQUIRIES };
  }
}

/**
 * Update inquiry status in Supabase.
 * Requires verified administrator clearance.
 */
export async function updateAdminInquiryStatusAction(id: string, status: EnquiryStatus, replyNotes?: string): Promise<AdminActionResult> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) return { success: true, message: "Updated locally." };

  try {
    const supabase = await createAdminClient();
    const updatePayload: Database["public"]["Tables"]["inquiries"]["Update"] = { status };
    if (replyNotes) {
      updatePayload.reply_notes = replyNotes;
      updatePayload.replied_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("inquiries")
      .update(updatePayload)
      .eq("id", id);

    if (error) return { success: false, message: error.message, error: error.message };
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");
    return { success: true, message: `Inquiry status updated to ${status}.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg, error: msg };
  }
}

/**
 * Delete inquiry from Supabase.
 * Requires verified administrator clearance.
 */
export async function deleteAdminInquiryAction(id: string): Promise<AdminActionResult> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) return { success: true, message: "Deleted locally." };

  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("inquiries").delete().eq("id", id);

    if (error) return { success: false, message: error.message, error: error.message };
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");
    return { success: true, message: "Inquiry deleted from database." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg, error: msg };
  }
}

/**
 * Get dashboard overview metrics calculated from real database gemstones, orders, and inquiries.
 * Uses high-performance get_vault_metrics() stored procedure when available (DATA-06).
 * Requires verified administrator clearance.
 */
export async function getAdminOverviewMetricsAction() {
  await requireAdminSession();

  let totalVaultValue = 0;
  let totalCarats = 0;
  let totalGemstones = 0;
  let inStockCount = 0;
  let unheatedCount = 0;
  let totalOrderRevenue = 0;
  let pendingOrders = 0;
  let inTransitOrders = 0;
  let pendingEnquiries = 0;
  let varietyBreakdown: Record<string, number> = {};

  if (isSupabaseConfigured) {
    try {
      const supabase = await createAdminClient();
      const { data: rpcMetrics, error: rpcErr } = await supabase.rpc("get_vault_metrics");
      if (!rpcErr && rpcMetrics && typeof rpcMetrics === "object") {
        const m = rpcMetrics as Record<string, unknown>;
        totalVaultValue = Number(m.total_vault_value) || 0;
        totalCarats = Number(m.total_carats) || 0;
        totalGemstones = Number(m.total_gemstones) || 0;
        inStockCount = Number(m.in_stock_count) || 0;
        unheatedCount = Number(m.unheated_count) || 0;
        totalOrderRevenue = Number(m.total_order_revenue) || 0;
        pendingOrders = Number(m.pending_orders) || 0;
        inTransitOrders = Number(m.in_transit_orders) || 0;
        pendingEnquiries = Number(m.pending_enquiries) || 0;

        const [gemsRes, ordersRes, inqRes] = await Promise.all([
          getAdminGemstonesAction(),
          getAdminOrdersAction(),
          getAdminInquiriesAction(),
        ]);

        const gems = gemsRes.data ?? [];
        varietyBreakdown = gems.reduce((acc, gem) => {
          acc[gem.variety] = (acc[gem.variety] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return {
          gemstones: gems,
          orders: ordersRes.data || [],
          enquiries: inqRes.data || [],
          totalVaultValue,
          totalCarats,
          totalGemstones,
          inStockCount,
          unheatedCount,
          varietyBreakdown,
          totalOrderRevenue,
          pendingOrders,
          inTransitOrders,
          pendingEnquiries,
        };
      }
    } catch (err) {
      console.warn("get_vault_metrics RPC fallback note:", err);
    }
  }

  // Graceful fallback in-memory aggregation if stored procedure is offline
  const [gemsRes, ordersRes, inqRes] = await Promise.all([
    getAdminGemstonesAction(),
    getAdminOrdersAction(),
    getAdminInquiriesAction(),
  ]);

  const gems = gemsRes.data ?? [];
  const orders = ordersRes.data || INITIAL_ADMIN_ORDERS;
  const enquiries = inqRes.data || INITIAL_ADMIN_ENQUIRIES;

  totalVaultValue = gems.reduce((sum, g) => sum + g.price, 0);
  totalCarats = gems.reduce((sum, g) => sum + g.carat, 0);
  inStockCount = gems.filter((g) => g.inStock).length;
  unheatedCount = gems.filter((g) =>
    g.treatment.toLowerCase().includes("unheated") || g.treatment.toLowerCase().includes("none")
  ).length;

  varietyBreakdown = gems.reduce((acc, gem) => {
    acc[gem.variety] = (acc[gem.variety] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  totalOrderRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  pendingOrders = orders.filter((o) => o.status === "pending_verification").length;
  inTransitOrders = orders.filter((o) => o.status === "dispatched" || o.status === "customs_clearance").length;
  pendingEnquiries = enquiries.filter((e) => e.status === "pending").length;

  return {
    gemstones: gems,
    orders,
    enquiries,
    totalVaultValue,
    totalCarats,
    totalGemstones: gems.length,
    inStockCount,
    unheatedCount,
    varietyBreakdown,
    totalOrderRevenue,
    pendingOrders,
    inTransitOrders,
    pendingEnquiries,
  };
}

// ========================================================
// DATA-02: Relational Admin Modules (Categories, Media, Settings)
// ========================================================

/**
 * Retrieve all categories directly from Supabase (DATA-02).
 */
export async function getAdminCategoriesAction(): Promise<AdminActionResult<AdminCategory[]>> {
  if (!isSupabaseConfigured) {
    return { success: true, message: "Using local category seed.", data: INITIAL_ADMIN_CATEGORIES };
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return { success: true, message: "Fallback to initial categories.", data: INITIAL_ADMIN_CATEGORIES };
    }

    const categories: AdminCategory[] = data.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      subtitle: c.subtitle || "",
      tagline: c.tagline || "",
      description: c.description || "",
      image: c.image,
      varietyQuery: c.variety_query || undefined,
      productCount: c.product_count,
      featured: c.featured,
      sortOrder: c.sort_order,
    }));

    return {
      success: true,
      message: `Retrieved ${categories.length} categories from Supabase.`,
      data: categories,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: true, message: `Fallback due to error: ${msg}`, data: INITIAL_ADMIN_CATEGORIES };
  }
}

/**
 * Save or update category in Supabase (DATA-02).
 * Requires verified administrator clearance.
 */
export async function saveAdminCategoryAction(category: AdminCategory): Promise<AdminActionResult<AdminCategory>> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) {
    return { success: true, message: "Category saved in demo mode.", data: category };
  }

  try {
    const supabase = await createAdminClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(category.id);
    const insertPayload: Database["public"]["Tables"]["categories"]["Insert"] = {
      slug: category.slug,
      name: category.name,
      subtitle: category.subtitle || null,
      tagline: category.tagline || null,
      description: category.description || null,
      image: category.image,
      variety_query: category.varietyQuery || null,
      product_count: category.productCount || 0,
      featured: category.featured ?? true,
      sort_order: category.sortOrder || 0,
    };
    if (isUuid) {
      insertPayload.id = category.id;
    }

    const { data, error } = await supabase
      .from("categories")
      .upsert(insertPayload, { onConflict: "slug" })
      .select()
      .single();

    if (error) return { success: false, message: error.message, error: error.message };

    revalidatePath("/admin/categories");
    revalidatePath("/gems");
    revalidatePath("/");
    return {
      success: true,
      message: `Category '${category.name}' persisted to database.`,
      data: {
        ...category,
        id: data.id,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg, error: msg };
  }
}

/**
 * Delete category from Supabase (DATA-02).
 * Requires verified administrator clearance.
 */
export async function deleteAdminCategoryAction(idOrSlug: string): Promise<AdminActionResult> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) return { success: true, message: "Category deleted locally." };

  try {
    const supabase = await createAdminClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
    const { error } = isUuid
      ? await supabase.from("categories").delete().eq("id", idOrSlug)
      : await supabase.from("categories").delete().eq("slug", idOrSlug);

    if (error) return { success: false, message: error.message, error: error.message };

    revalidatePath("/admin/categories");
    revalidatePath("/gems");
    revalidatePath("/");
    return { success: true, message: "Category deleted from database." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg, error: msg };
  }
}

/**
 * Retrieve all media assets directly from Supabase (DATA-02).
 */
export async function getAdminMediaAssetsAction(): Promise<AdminActionResult<MediaAsset[]>> {
  if (!isSupabaseConfigured) {
    return { success: true, message: "Using local media seed.", data: INITIAL_ADMIN_MEDIA };
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { success: true, message: "Fallback to local media seed.", data: INITIAL_ADMIN_MEDIA };
    }

    const assets: MediaAsset[] = data.map((m) => ({
      id: m.id,
      name: m.name,
      url: m.url,
      type: (m.type as MediaType) || "gem_photo",
      size: m.size || "Unknown",
      dimensions: m.dimensions || undefined,
      format: m.format || "WEBP",
      createdAt: m.created_at.split("T")[0],
      associatedGemSlug: m.associated_gem_slug || undefined,
      tag: m.tag || "General",
    }));

    return {
      success: true,
      message: `Retrieved ${assets.length} media assets from Supabase.`,
      data: assets,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: true, message: `Fallback due to: ${msg}`, data: INITIAL_ADMIN_MEDIA };
  }
}

/**
 * Save new media asset record to Supabase (DATA-02).
 * Requires verified administrator clearance.
 */
export async function saveAdminMediaAssetAction(asset: MediaAsset): Promise<AdminActionResult<MediaAsset>> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) return { success: true, message: "Asset saved locally.", data: asset };

  try {
    const supabase = await createAdminClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(asset.id);
    const insertPayload: Database["public"]["Tables"]["media_assets"]["Insert"] = {
      name: asset.name,
      url: asset.url,
      type: asset.type,
      size: asset.size || null,
      dimensions: asset.dimensions || null,
      format: asset.format || null,
      associated_gem_slug: asset.associatedGemSlug || null,
      tag: asset.tag || "General",
    };
    if (isUuid) {
      insertPayload.id = asset.id;
    }

    const { data, error } = await supabase
      .from("media_assets")
      .upsert(insertPayload)
      .select()
      .single();

    if (error) return { success: false, message: error.message, error: error.message };

    revalidatePath("/admin/media");
    return {
      success: true,
      message: "Media asset persisted to database.",
      data: {
        ...asset,
        id: data.id,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg, error: msg };
  }
}

/**
 * Delete media asset from Supabase (DATA-02).
 * Requires verified administrator clearance.
 */
export async function deleteAdminMediaAssetAction(id: string): Promise<AdminActionResult> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) return { success: true, message: "Deleted locally." };

  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("media_assets").delete().eq("id", id);
    if (error) return { success: false, message: error.message, error: error.message };

    revalidatePath("/admin/media");
    return { success: true, message: "Media asset deleted from database." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg, error: msg };
  }
}

/**
 * Retrieve store settings directly from Supabase (DATA-02).
 */
export async function getAdminSettingsAction(): Promise<AdminActionResult<AdminSettingsData>> {
  if (!isSupabaseConfigured) {
    return { success: true, message: "Using local settings seed.", data: INITIAL_ADMIN_SETTINGS };
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("store_settings")
      .select("value")
      .eq("key", "main_settings")
      .maybeSingle();

    if (error || !data || !data.value) {
      return { success: true, message: "Using fallback settings.", data: INITIAL_ADMIN_SETTINGS };
    }

    return {
      success: true,
      message: "Store settings loaded from Supabase.",
      data: data.value as unknown as AdminSettingsData,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: true, message: `Fallback due to: ${msg}`, data: INITIAL_ADMIN_SETTINGS };
  }
}

/**
 * Update store settings in Supabase (DATA-02).
 * Requires verified administrator clearance.
 */
export async function updateAdminSettingsAction(
  partial: Partial<AdminSettingsData>
): Promise<AdminActionResult<AdminSettingsData>> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Settings updated locally.",
      data: { ...INITIAL_ADMIN_SETTINGS, ...partial },
    };
  }

  try {
    const supabase = await createAdminClient();
    const current = await getAdminSettingsAction();
    const merged = { ...(current.data || INITIAL_ADMIN_SETTINGS), ...partial };

    const { error } = await supabase.from("store_settings").upsert({
      key: "main_settings",
      value: merged as unknown as Json,
      updated_at: new Date().toISOString(),
    });

    if (error) return { success: false, message: error.message, error: error.message };

    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    return { success: true, message: "Store settings saved to database.", data: merged };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg, error: msg };
  }
}
