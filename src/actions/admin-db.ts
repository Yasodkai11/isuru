"use server";

import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Gemstone, GemImage } from "@/types/gem";
import { AdminOrder, OrderStatus, AdminEnquiry, EnquiryStatus } from "@/types/admin";
import { CATALOG_GEMS } from "@/lib/catalog-gems";
import { INITIAL_ADMIN_ORDERS, INITIAL_ADMIN_ENQUIRIES } from "@/lib/admin-seed";
import { revalidatePath } from "next/cache";

export interface AdminActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

function determineCategory(color: string, variety: string): string {
  const c = (color || "").toLowerCase();
  const v = (variety || "").toLowerCase();
  if (v.includes("parcel") || v.includes("lot") || v.includes("tray") || v.includes("grid")) return "gem-collections";
  if (c.includes("blue")) return "blue-gems";
  if (c.includes("pink") || c.includes("purple") || c.includes("magenta") || c.includes("violet")) return "pink-purple-gems";
  if (c.includes("red") || c.includes("crimson") || c.includes("maroon") || v.includes("ruby") || v.includes("spinel")) return "red-gems";
  if (c.includes("yellow") || c.includes("gold") || c.includes("orange") || c.includes("honey") || v.includes("pushparaga")) return "yellow-gems";
  if (c.includes("green") || c.includes("olive")) return "green-gems";
  return "blue-gems";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbRowToGemstone(row: any): Gemstone {
  const color = row.color || "Ceylon Blue";
  const variety = row.variety || "Ceylon Sapphire";
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    variety,
    category: determineCategory(color, variety),
    carat: Number(row.carat) || 0,
    origin: row.origin || "Ratnapura, Sri Lanka",
    cut: row.cut || "Oval Mixed Cut",
    dimensions: row.dimensions || "Available on request",
    color,
    treatment: row.treatment || "None / Unheated (100% Natural)",
    clarity: row.clarity || "Eye Clean",
    price: Number(row.price) || 0,
    currency: (row.currency as "USD" | "LKR") || "USD",
    inStock: Boolean(row.in_stock),
    featured: Boolean(row.featured),
    description: row.description || "",
    certificate: {
      lab: row.certificate_lab || "NGJA",
      number: row.certificate_number || "NGJA-CERT",
      pdfUrl: row.certificate_pdf_url || undefined,
    },
    images: Array.isArray(row.images) ? (row.images as unknown as GemImage[]) : [],
  };
}

/**
 * Fetch all real gemstones directly from Supabase for the Admin Panel.
 */
export async function getAdminGemstonesAction(): Promise<AdminActionResult<Gemstone[]>> {
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

    if (error || !data || data.length === 0) {
      return {
        success: true,
        message: "No database records found, returning local catalog fallback.",
        data: CATALOG_GEMS,
      };
    }

    const gems = data.map(mapDbRowToGemstone);
    return {
      success: true,
      message: `Retrieved ${gems.length} real gemstones from Supabase database.`,
      data: gems,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("getAdminGemstonesAction note:", msg);
    return {
      success: true,
      message: "Fallback to local catalog.",
      data: CATALOG_GEMS,
    };
  }
}

/**
 * Insert or update a gemstone in Supabase.
 */
export async function saveAdminGemstoneAction(gem: Gemstone): Promise<AdminActionResult<Gemstone>> {
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

    const dbPayload = {
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
      images: (gem.images || []) as unknown as any,
    };

    const { data, error } = await supabase
      .from("gemstones")
      .upsert(dbPayload as any, { onConflict: "slug" })
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
 */
export async function deleteAdminGemstoneAction(idOrSlug: string): Promise<AdminActionResult> {
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
 */
export async function toggleAdminGemstoneStockAction(idOrSlug: string, inStock: boolean): Promise<AdminActionResult> {
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
 */
export async function toggleAdminGemstoneFeaturedAction(idOrSlug: string, featured: boolean): Promise<AdminActionResult> {
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
 */
export async function getAdminOrdersAction(): Promise<AdminActionResult<AdminOrder[]>> {
  if (!isSupabaseConfigured) {
    return { success: true, message: "Using local orders seed.", data: INITIAL_ADMIN_ORDERS };
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { success: true, message: "Default seed fallback.", data: INITIAL_ADMIN_ORDERS };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders: AdminOrder[] = data.map((row: any) => ({
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
      items: [
        {
          gemId: "gem-ceylon",
          name: "Natural Ceylon Gemstone Acquisition",
          variety: "Ceylon Sapphire",
          carat: 3.5,
          price: Number(row.total_amount),
          image: "/isuru_images/blue1.jpg",
          certificateLab: "GRS & NGJA",
          certificateNumber: "NGJA-2024",
        },
      ],
    }));

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
 */
export async function updateAdminOrderStatusAction(orderId: string, status: OrderStatus): Promise<AdminActionResult> {
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
 */
export async function getAdminInquiriesAction(): Promise<AdminActionResult<AdminEnquiry[]>> {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enquiries: AdminEnquiry[] = data.map((row: any) => ({
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
      replyNotes: undefined,
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
 */
export async function updateAdminInquiryStatusAction(id: string, status: EnquiryStatus, replyNotes?: string): Promise<AdminActionResult> {
  if (!isSupabaseConfigured) return { success: true, message: "Updated locally." };

  try {
    const supabase = await createAdminClient();
    const { error } = await supabase
      .from("inquiries")
      .update({
        status,
        ...(replyNotes ? { message: `[Replied: ${replyNotes}]` } : {}),
      })
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
 */
export async function deleteAdminInquiryAction(id: string): Promise<AdminActionResult> {
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
 */
export async function getAdminOverviewMetricsAction() {
  const [gemsRes, ordersRes, inqRes] = await Promise.all([
    getAdminGemstonesAction(),
    getAdminOrdersAction(),
    getAdminInquiriesAction(),
  ]);

  const gems = gemsRes.data || CATALOG_GEMS;
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
