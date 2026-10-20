"use server";

import { headers } from "next/headers";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
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
        // Fallback if RPC migration hasn't been executed yet in the database
        if (rpcError.message.includes("function") && rpcError.message.includes("does not exist")) {
          // Manual transactional sequence with verification
          const { data: availableGems, error: fetchErr } = await supabase
            .from("gemstones")
            .select("id, name, variety, carat, price, currency, in_stock")
            .in("id", itemIds);

          if (fetchErr || !availableGems || availableGems.length !== itemIds.length) {
            return {
              success: false,
              message: "Unable to verify gemstone availability. Please refresh and try again.",
            };
          }

          const unavailable = availableGems.filter((g) => !g.in_stock);
          if (unavailable.length > 0) {
            return {
              success: false,
              message: `The following specimen is no longer available: ${unavailable.map((u) => u.name).join(", ")}.`,
            };
          }

          const calculatedTotal = availableGems.reduce((sum, g) => sum + Number(g.price), 0);

          const { error: insertOrderError } = await supabase.from("orders").insert({
            id: orderReference,
            user_id: userId,
            customer_name: fullName,
            email,
            phone,
            shipping_address: `${address}${postalCode ? `, ${postalCode}` : ""}`,
            city,
            country,
            total_amount: calculatedTotal,
            currency: "USD",
            status: "pending_verification",
            notes: formattedNotes,
          });

          if (insertOrderError) {
            return {
              success: false,
              message: `Order registration failed: ${insertOrderError.message}`,
            };
          }

          // Mark gemstones as acquired / reserved
          await supabase.from("gemstones").update({ in_stock: false }).in("id", itemIds);
        } else {
          return {
            success: false,
            message: rpcError.message || "Failed to finalize acquisition. Please contact the concierge.",
          };
        }
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
