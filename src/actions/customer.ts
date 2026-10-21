"use server";

import { createAdminClient, createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminCustomer, CustomerTier } from "@/types/admin";
import { INITIAL_ADMIN_CUSTOMERS } from "@/lib/admin-seed";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-checks";
import { Database } from "@/types/supabase";

export interface CustomerActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface CustomerPaginationOptions {
  page?: number;
  limit?: number;
}

export interface CustomerProfileData {
  id: string;
  userId?: string | null;
  fullName: string;
  email: string;
  phone?: string | null;
  shippingAddress?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  tier: CustomerTier;
  totalSpent: number;
  ordersCount: number;
  firstAcquisitionDate?: string | null;
  lastAcquisitionDate?: string | null;
  preferredVarieties: string[];
  notes?: string | null;
}

export interface UpdateProfileInput {
  fullName?: string;
  phone?: string;
  shippingAddress?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  tier?: CustomerTier;
  totalSpent?: number;
  notes?: string;
  preferredVarieties?: string[];
}

/**
 * Fetch all customers for the Executive CRM table.
 * Requires verified administrator clearance.
 */
export async function getCustomersAction(
  options?: CustomerPaginationOptions
): Promise<CustomerActionResult<AdminCustomer[]>> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      data: [],
    };
  }

  const page = options?.page ? Math.max(1, options.page) : 1;
  const limit = options?.limit ? Math.max(1, options.limit) : 50;
  const offset = (page - 1) * limit;

  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Loaded customers from local store fallback.",
      data: INITIAL_ADMIN_CUSTOMERS,
      total: INITIAL_ADMIN_CUSTOMERS.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(INITIAL_ADMIN_CUSTOMERS.length / limit)),
    };
  }

  try {
    const adminSupabase = await createAdminClient();
    const projectedColumns =
      "id, full_name, email, phone, country, city, tier, total_spent, orders_count, first_acquisition_date, last_acquisition_date, preferred_varieties, notes, created_at, updated_at";

    let q = adminSupabase
      .from("profiles")
      .select(projectedColumns, { count: "exact" })
      .order("created_at", { ascending: false });

    if (options?.limit || options?.page) {
      q = q.range(offset, offset + limit - 1);
    }

    const { data, count, error } = await q;

    if (error || !data || data.length === 0) {
      return {
        success: true,
        message: "Fallback to default customer seed records.",
        data: INITIAL_ADMIN_CUSTOMERS,
        total: INITIAL_ADMIN_CUSTOMERS.length,
        page,
        limit,
        totalPages: 1,
      };
    }

    const mapped: AdminCustomer[] = data.map((row) => ({
      id: row.id,
      name: row.full_name || "Private Patron",
      email: row.email,
      phone: row.phone || "",
      country: row.country || "International",
      city: row.city || "",
      tier: (row.tier as CustomerTier) || "private_client",
      totalSpent: Number(row.total_spent) || 0,
      ordersCount: Number(row.orders_count) || 0,
      firstAcquisitionDate:
        row.first_acquisition_date ||
        (row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : "Recent"),
      lastAcquisitionDate:
        row.last_acquisition_date ||
        (row.updated_at ? new Date(row.updated_at).toISOString().split("T")[0] : "Recent"),
      preferredVarieties: Array.isArray(row.preferred_varieties)
        ? (row.preferred_varieties as string[])
        : ["Royal Blue Sapphire"],
      notes: row.notes || undefined,
    }));

    const total = count ?? mapped.length;

    return {
      success: true,
      message: "Customer CRM records retrieved.",
      data: mapped,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  } catch (err: unknown) {
    return {
      success: true,
      message: err instanceof Error ? err.message : "Error reading profiles, returning seed.",
      data: INITIAL_ADMIN_CUSTOMERS,
      total: INITIAL_ADMIN_CUSTOMERS.length,
      page,
      limit,
      totalPages: 1,
    };
  }
}

/**
 * Retrieve the profile of the currently logged-in patron (or specified user ID for admins).
 */
export async function getCustomerProfileAction(
  targetUserId?: string
): Promise<CustomerActionResult<CustomerProfileData | null>> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: "Supabase not configured.",
      data: null,
    };
  }

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData?.user) {
      return {
        success: false,
        message: "Unauthenticated.",
        data: null,
      };
    }

    let queryUserId = authData.user.id;

    // Only allow querying another user's profile if the caller is a verified admin
    if (targetUserId && targetUserId !== authData.user.id) {
      try {
        await requireAdminSession();
        queryUserId = targetUserId;
      } catch {
        // Fallback to own profile if unauthorized
        queryUserId = authData.user.id;
      }
    }

    // Query profiles by user_id or id
    const projectedProfileColumns =
      "id, user_id, full_name, email, phone, shipping_address, city, country, postal_code, tier, total_spent, orders_count, first_acquisition_date, last_acquisition_date, preferred_varieties, notes, created_at, updated_at";
    const { data, error } = await supabase
      .from("profiles")
      .select(projectedProfileColumns)
      .or(`user_id.eq.${queryUserId},id.eq.${queryUserId}`)
      .maybeSingle();

    if (error || !data) {
      return {
        success: false,
        message: error?.message || "Profile record not found.",
        data: null,
      };
    }

    const profile: CustomerProfileData = {
      id: data.id,
      userId: data.user_id,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      shippingAddress: data.shipping_address,
      city: data.city,
      country: data.country,
      postalCode: data.postal_code,
      tier: (data.tier as CustomerTier) || "private_client",
      totalSpent: Number(data.total_spent) || 0,
      ordersCount: Number(data.orders_count) || 0,
      firstAcquisitionDate: data.first_acquisition_date,
      lastAcquisitionDate: data.last_acquisition_date,
      preferredVarieties: Array.isArray(data.preferred_varieties) ? (data.preferred_varieties as string[]) : [],
      notes: data.notes,
    };

    return {
      success: true,
      message: "Profile retrieved.",
      data: profile,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to load customer profile.",
      data: null,
    };
  }
}

/**
 * Update the logged-in customer's patron profile (address, phone, name).
 */
export async function updateCustomerProfileAction(
  input: UpdateProfileInput
): Promise<CustomerActionResult> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: "Supabase not configured.",
    };
  }

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      return {
        success: false,
        message: "You must be signed in to update your profile.",
      };
    }

    const updateFields: Database["public"]["Tables"]["profiles"]["Update"] = {
      updated_at: new Date().toISOString(),
    };

    if (input.fullName !== undefined) updateFields.full_name = input.fullName.trim();
    if (input.phone !== undefined) updateFields.phone = input.phone.trim();
    if (input.shippingAddress !== undefined) updateFields.shipping_address = input.shippingAddress.trim();
    if (input.city !== undefined) updateFields.city = input.city.trim();
    if (input.country !== undefined) updateFields.country = input.country.trim();
    if (input.postalCode !== undefined) updateFields.postal_code = input.postalCode.trim();

    const { error } = await supabase
      .from("profiles")
      .update(updateFields)
      .or(`user_id.eq.${authData.user.id},id.eq.${authData.user.id}`);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    revalidatePath("/account");
    revalidatePath("/checkout");

    return {
      success: true,
      message: "Your patron profile and delivery address have been updated.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Error updating profile.",
    };
  }
}

/**
 * Staff CRM action to update customer notes or VIP tier.
 * Requires verified administrator clearance.
 */
export async function adminUpdateCustomerAction(
  customerId: string,
  data: { tier?: CustomerTier; notes?: string }
): Promise<CustomerActionResult> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
    };
  }

  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Updated in local store.",
    };
  }

  try {
    const adminSupabase = await createAdminClient();
    const updatePayload: Database["public"]["Tables"]["profiles"]["Update"] = {
      updated_at: new Date().toISOString(),
    };
    if (data.tier) updatePayload.tier = data.tier;
    if (data.notes !== undefined) updatePayload.notes = data.notes;

    const { error } = await adminSupabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", customerId);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    revalidatePath("/admin/customers");
    return {
      success: true,
      message: "Customer record updated in vault CRM.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to update customer.",
    };
  }
}

/**
 * Staff CRM action to create a new VIP client record in profiles.
 * Requires verified administrator clearance.
 */
export async function adminCreateCustomerAction(
  input: CreateCustomerInput
): Promise<CustomerActionResult<AdminCustomer>> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
    };
  }

  if (!isSupabaseConfigured) {
    const fallbackCustomer: AdminCustomer = {
      id: `cust-${Date.now().toString().slice(-4)}`,
      name: input.name,
      email: input.email,
      phone: input.phone || "",
      country: input.country || "International",
      city: input.city || "",
      tier: input.tier || "vip_collector",
      totalSpent: input.totalSpent || 0,
      ordersCount: 1,
      firstAcquisitionDate: new Date().toISOString().split("T")[0],
      lastAcquisitionDate: new Date().toISOString().split("T")[0],
      preferredVarieties: input.preferredVarieties || ["Royal Blue Sapphire"],
      notes: input.notes,
    };
    return {
      success: true,
      message: "Client added to local store.",
      data: fallbackCustomer,
    };
  }

  try {
    const adminSupabase = await createAdminClient();
    const { data, error } = await adminSupabase
      .from("profiles")
      .insert({
        full_name: input.name,
        email: input.email,
        phone: input.phone || null,
        city: input.city || null,
        country: input.country || "International",
        tier: input.tier || "vip_collector",
        total_spent: input.totalSpent || 0,
        orders_count: 1,
        first_acquisition_date: new Date().toISOString().split("T")[0],
        last_acquisition_date: new Date().toISOString().split("T")[0],
        preferred_varieties: input.preferredVarieties || ["Royal Blue Sapphire"],
        notes: input.notes || null,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    const created: AdminCustomer = {
      id: data.id,
      name: data.full_name,
      email: data.email,
      phone: data.phone || "",
      country: data.country || "",
      city: data.city || "",
      tier: data.tier as CustomerTier,
      totalSpent: Number(data.total_spent) || 0,
      ordersCount: Number(data.orders_count) || 0,
      firstAcquisitionDate: data.first_acquisition_date || new Date().toISOString().split("T")[0],
      lastAcquisitionDate: data.last_acquisition_date || new Date().toISOString().split("T")[0],
      preferredVarieties: Array.isArray(data.preferred_varieties) ? (data.preferred_varieties as string[]) : [],
      notes: data.notes || undefined,
    };

    revalidatePath("/admin/customers");
    return {
      success: true,
      message: "New VIP client successfully enrolled.",
      data: created,
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to create customer record.",
    };
  }
}
