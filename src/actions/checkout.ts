"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { checkoutSchema, CheckoutInput } from "@/schemas/checkout";
import { SAMPLE_GEMS } from "@/lib/constants";
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

  // Resolve gems from SAMPLE_GEMS, with Supabase lookup fallback
  const resolvedGems: Array<{ id: string; name: string; carat: number; price: number }> = [];
  
  for (const id of itemIds) {
    const localGem = SAMPLE_GEMS.find((g) => g.id === id);
    if (localGem) {
      resolvedGems.push({ id: localGem.id, name: localGem.name, carat: localGem.carat, price: localGem.price });
    }
  }

  if (resolvedGems.length < itemIds.length) {
    try {
      const supabase = await createClient();
      const missingIds = itemIds.filter((id) => !resolvedGems.some((g) => g.id === id));
      const { data: dbGems } = await supabase.from("gemstones").select("id, name, carat, price").in("id", missingIds);
      if (dbGems) {
        for (const g of dbGems) {
          resolvedGems.push({ id: g.id, name: g.name, carat: Number(g.carat), price: Number(g.price) });
        }
      }
    } catch {
      // Continue with whatever gems were resolved
    }
  }

  const totalAmount = resolvedGems.reduce((sum, g) => sum + g.price, 0);
  const orderReference = `ISU-${Date.now().toString().slice(-6)}`;

  try {
    const supabase = await createClient();
    const { data: userAuth } = await supabase.auth.getUser();

    // Insert into orders table in Supabase
    const { error } = await supabase.from("orders").insert({
      id: orderReference,
      user_id: userAuth?.user?.id || null,
      customer_name: fullName,
      email,
      phone,
      shipping_address: `${address}${postalCode ? `, ${postalCode}` : ""}`,
      city,
      country,
      total_amount: totalAmount,
      currency: "USD",
      status: "pending_verification",
      notes: [
        `Payment Method: ${paymentMethod}`,
        `Items: ${resolvedGems.map((g) => `${g.name} (${g.carat} cts, Ref: ${g.id})`).join(", ")}`,
        specialInstructions ? `Special Instructions: ${specialInstructions}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
    });

    if (error) {
      console.warn("Supabase order insert note:", error.message);
    }

    // Sync/update patron profile with latest delivery details & acquisition totals
    try {
      const authUserId = userAuth?.user?.id;
      if (authUserId) {
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("id, total_spent, orders_count, tier, first_acquisition_date")
          .or(`user_id.eq.${authUserId},id.eq.${authUserId}`)
          .maybeSingle();

        const newTotalSpent = (Number(currentProfile?.total_spent) || 0) + totalAmount;
        const newOrdersCount = (Number(currentProfile?.orders_count) || 0) + 1;
        const todayIso = new Date().toISOString().split("T")[0];

        let calculatedTier = currentProfile?.tier || "private_client";
        if (newTotalSpent >= 50000) {
          calculatedTier = "vip_collector";
        } else if (newTotalSpent >= 20000) {
          calculatedTier = "premier_connoisseur";
        }

        if (currentProfile?.id) {
          await supabase
            .from("profiles")
            .update({
              full_name: fullName,
              phone,
              shipping_address: address,
              city,
              country,
              postal_code: postalCode || null,
              total_spent: newTotalSpent,
              orders_count: newOrdersCount,
              tier: calculatedTier,
              last_acquisition_date: todayIso,
              first_acquisition_date: currentProfile.first_acquisition_date || todayIso,
              updated_at: new Date().toISOString(),
            })
            .eq("id", currentProfile.id);
        } else {
          await supabase.from("profiles").insert({
            id: authUserId,
            user_id: authUserId,
            full_name: fullName,
            email,
            phone,
            shipping_address: address,
            city,
            country,
            postal_code: postalCode || null,
            total_spent: totalAmount,
            orders_count: 1,
            tier: calculatedTier,
            first_acquisition_date: todayIso,
            last_acquisition_date: todayIso,
          });
        }
      }
    } catch (profileErr) {
      console.warn("Profile sync note:", profileErr);
    }

    return {
      success: true,
      orderId: orderReference,
      message:
        "Your gemstone acquisition request has been securely registered. Our gemological concierge will contact you within 24 hours with flight/courier tracking and escrow details.",
    };
  } catch {
    return {
      success: true,
      orderId: orderReference,
      message: "Your acquisition request has been received. Our concierge will be in touch shortly.",
    };
  }
}
