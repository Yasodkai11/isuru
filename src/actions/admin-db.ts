"use server";

import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Gemstone } from "@/types/gem";
import { AdminOrder, OrderStatus, AdminEnquiry, EnquiryStatus } from "@/types/admin";
import { CATALOG_GEMS } from "@/lib/catalog-gems";
import { INITIAL_ADMIN_ORDERS, INITIAL_ADMIN_ENQUIRIES } from "@/lib/admin-seed";
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

    const { error } = isUuid
      ? await supabase.from("gemstones").delete().eq("id", idOrSlug)
      : await supabase.from("gemstones").delete().eq("slug", idOrSlug);

    if (error) {
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

    const orders: AdminOrder[] = (data as unknown as Array<DbOrderRow & { order_items?: any[] }>).map((row) => {
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
 * Requires verified administrator clearance.
 */
export async function getAdminOverviewMetricsAction() {
  await requireAdminSession();

  const [gemsRes, ordersRes, inqRes] = await Promise.all([
    getAdminGemstonesAction(),
    getAdminOrdersAction(),
    getAdminInquiriesAction(),
  ]);

  const gems = gemsRes.data ?? [];
  const orders = ordersRes.data || INITIAL_ADMIN_ORDERS;
  const enquiries = inqRes.data || INITIAL_ADMIN_ENQUIRIES;

  const totalVaultValue = gems.reduce((sum, g) => sum + g.price, 0);
  const totalCarats = gems.reduce((sum, g) => sum + g.carat, 0);
  const inStockCount = gems.filter((g) => g.inStock).length;
  const unheatedCount = gems.filter((g) =>
    g.treatment.toLowerCase().includes("unheated") || g.treatment.toLowerCase().includes("none")
  ).length;

  const varietyBreakdown = gems.reduce((acc, gem) => {
    acc[gem.variety] = (acc[gem.variety] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalOrderRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending_verification").length;
  const inTransitOrders = orders.filter((o) => o.status === "dispatched" || o.status === "customs_clearance").length;
  const pendingEnquiries = enquiries.filter((e) => e.status === "pending").length;

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
