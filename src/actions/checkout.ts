"use server";

import { headers } from "next/headers";
import { createAdminClient, createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { checkoutSchema, CheckoutInput } from "@/schemas/checkout";
import { CATALOG_GEMS } from "@/lib/catalog-gems";
import { checkRateLimit } from "@/lib/rate-limit";

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function processOrderAction(data: CheckoutInput): Promise<CheckoutResult> {
  // 1. Rate Limiting Check
  const headerList = await headers();
  const clientIp =
    headerList.get("x-forwarded-for")?.split(",")[0].trim() ||
    headerList.get("x-real-ip") ||
    "client-session";

  const rateCheck = checkRateLimit(`checkout:${clientIp}`, {
    limit: 5,
    windowMs: 60 * 1000,
  });

  if (!rateCheck.success) {
    return {
      success: false,
      message: rateCheck.message || "Too many acquisition requests sent. Please pause a moment before retrying.",
    };
  }

  // 2. Zod Validation
  const parsed = checkoutSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please complete all required shipping & acquisition fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { fullName, email, phone, address, city, country, postalCode, specialInstructions, itemIds, paymentMethod } =
    parsed.data;

  // Collision-resistant order reference (e.g. ISU-M5K89A-7Z3P)
  const orderReference = `ISU-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data: userAuth } = await supabase.auth.getUser();
      const userId = userAuth?.user?.id || null;

      const formattedNotes = [
        `Payment Method: ${paymentMethod}`,
        specialInstructions ? `Special Instructions: ${specialInstructions}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      // Execute atomic checkout stored procedure (locks rows, checks stock, creates order & items, decrements stock)
      const { data: rpcData, error: rpcError } = await supabase.rpc("process_checkout_order", {
        p_order_id: orderReference,
        p_user_id: userId,
        p_customer_name: fullName,
        p_email: email,
        p_phone: phone,
        p_shipping_address: `${address}${postalCode ? `, ${postalCode}` : ""}`,
        p_city: city,
        p_country: country,
        p_notes: formattedNotes,
        p_gem_ids: itemIds,
      });

      if (rpcError) {
        console.error("Critical checkout RPC failure:", rpcError);
        return {
          success: false,
          message: rpcError.message?.includes("longer available")
            ? rpcError.message
            : "Unable to lock vault inventory for checkout. Please refresh or contact the concierge desk.",
        };
      }

      // Sync customer delivery profile details safely (without permitting client tier tampering)
      if (userId) {
        try {
          await supabase
            .from("profiles")
            .update({
              full_name: fullName,
              phone,
              shipping_address: address,
              city,
              country,
              postal_code: postalCode || null,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
        } catch (profileErr) {
          console.warn("Non-fatal profile sync note:", profileErr);
        }
      }

      return {
        success: true,
        orderId: orderReference,
        message:
          "Your gemstone acquisition request has been securely registered. Our gemological concierge will contact you within 24 hours with flight/courier tracking and escrow details.",
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `Acquisition service error: ${msg}. Please retry or contact the vault desk.`,
      };
    }
  }

  // Graceful offline fallback when Supabase is unconfigured
  return {
    success: true,
    orderId: orderReference,
    message: "Your acquisition request has been recorded (demo mode). Our concierge will be in touch shortly.",
  };
}
