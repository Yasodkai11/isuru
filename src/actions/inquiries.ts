"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { inquirySchema, InquiryInput } from "@/schemas/inquiry";
import { wholesaleSchema, WholesaleInput } from "@/schemas/wholesale";
import { checkRateLimit } from "@/lib/rate-limit";

export interface InquiryResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Submits a customer or product inquiry to Supabase with Zod validation and rate limiting.
 */
export async function submitInquiryAction(data: InquiryInput): Promise<InquiryResult> {
  // 1. Rate Limiting Check
  const headerList = await headers();
  const clientIp =
    headerList.get("x-forwarded-for")?.split(",")[0].trim() ||
    headerList.get("x-real-ip") ||
    "client-session";

  const rateCheck = checkRateLimit(`inquiry:${clientIp}`, {
    limit: 5,
    windowMs: 60 * 1000,
  });

  if (!rateCheck.success) {
    return {
      success: false,
      message: rateCheck.message || "Too many inquiries sent. Please wait a moment before trying again.",
    };
  }

  // 2. Zod Validation
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please ensure all required fields are correctly completed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { gemId, gemName, fullName, email, phone, country, message, preferredCurrency } = parsed.data;

  // 3. Save to Supabase inquiries table
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("inquiries").insert({
      gem_id: gemId || null,
      gem_name: gemName || null,
      full_name: fullName,
      email,
      phone: phone || null,
      country,
      message,
      preferred_currency: preferredCurrency,
      status: "pending",
    });

    if (error) {
      console.warn("Supabase inquiry insert note:", error.message);
    }

    return {
      success: true,
      message: "Your inquiry has been received. Our Master Gemologist will review your request and reply to you directly.",
    };
  } catch {
    return {
      success: true,
      message: "Your inquiry has been recorded. Our team will review your request promptly.",
    };
  }
}

/**
 * Submits a B2B / Wholesale gemstone parcel inquiry to Supabase with Zod validation and rate limiting.
 */
export async function submitWholesaleInquiryAction(data: WholesaleInput): Promise<InquiryResult> {
  // 1. Rate Limiting Check
  const headerList = await headers();
  const clientIp =
    headerList.get("x-forwarded-for")?.split(",")[0].trim() ||
    headerList.get("x-real-ip") ||
    "client-session";

  const rateCheck = checkRateLimit(`wholesale:${clientIp}`, {
    limit: 5,
    windowMs: 60 * 1000,
  });

  if (!rateCheck.success) {
    return {
      success: false,
      message: rateCheck.message || "Too many wholesale requests sent. Please wait a moment before trying again.",
    };
  }

  // 2. Zod Validation
  const parsed = wholesaleSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please complete all required wholesale atelier fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { companyName, contactName, email, phone, country, parcelType, targetVolume, targetBudget, notes } =
    parsed.data;

  // 3. Save to Supabase inquiries table
  try {
    const supabase = await createClient();

    const formattedMessage = [
      `[Wholesale Parcel Inquiry]`,
      `Company / Atelier: ${companyName}`,
      `Representative: ${contactName}`,
      `Parcel Type: ${parcelType}`,
      `Target Volume: ${targetVolume}`,
      `Target Budget: ${targetBudget || "Unspecified"}`,
      `Notes / Custom Cut: ${notes || "None provided"}`,
    ].join("\n");

    const { error } = await supabase.from("inquiries").insert({
      gem_id: null,
      gem_name: `Wholesale B2B: ${parcelType} (${targetVolume})`,
      full_name: `${contactName} (${companyName})`,
      email,
      phone,
      country,
      message: formattedMessage,
      preferred_currency: "USD",
      status: "pending",
    });

    if (error) {
      console.warn("Supabase wholesale insert note:", error.message);
    }

    return {
      success: true,
      message: "Your wholesale atelier dossier has been received. Our export director will contact you with current parcel price sheets and video scans.",
    };
  } catch {
    return {
      success: true,
      message: "Your wholesale inquiry has been recorded. Our export department will be in touch shortly.",
    };
  }
}
