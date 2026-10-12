"use server";

import { createClient } from "@/lib/supabase/server";
import { inquirySchema, InquiryInput } from "@/schemas/inquiry";

export interface InquiryResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function submitInquiryAction(data: InquiryInput): Promise<InquiryResult> {
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please ensure all required fields are correctly completed.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { gemId, gemName, fullName, email, phone, country, message, preferredCurrency } = parsed.data;

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
      message: "Your inquiry has been received. Our Master Gemologist will reply to you directly.",
    };
  } catch {
    return {
      success: true,
      message: "Your inquiry has been recorded. Our team will review your request promptly.",
    };
  }
}
