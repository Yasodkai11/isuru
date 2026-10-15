"use server";

import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { requireAdminSession } from "@/lib/auth-checks";

export interface StorageUploadResult {
  success: boolean;
  message: string;
  url?: string;
  name?: string;
  size?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = ["image/webp", "image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Upload an image or certificate PDF to Supabase Storage in the 'gemstones' bucket.
 * Requires verified administrator clearance.
 */
export async function uploadGemMediaAction(formData: FormData): Promise<StorageUploadResult> {
  try {
    await requireAdminSession();
  } catch (authErr) {
    return {
      success: false,
      message: authErr instanceof Error ? authErr.message : "Unauthorized",
      error: "UNAUTHORIZED",
    };
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return {
      success: false,
      message: "No file was provided for upload.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      message: "File exceeds maximum permitted size of 10 MB.",
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      message: `Invalid file type "${file.type}". Allowed formats: WebP, JPEG, PNG, PDF.`,
    };
  }

  const cleanName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");
  const fileName = `${Date.now()}-${cleanName}`;

  if (!isSupabaseConfigured) {
    // Offline / demo fallback
    return {
      success: true,
      message: "File accepted (local offline mode).",
      url: `/isuru_images/${cleanName}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    };
  }

  try {
    const adminSupabase = await createAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await adminSupabase.storage
      .from("gemstones")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      return {
        success: false,
        message: `Upload to Supabase Storage failed: ${uploadError.message}`,
        error: uploadError.message,
      };
    }

    const { data: urlData } = adminSupabase.storage.from("gemstones").getPublicUrl(fileName);

    return {
      success: true,
      message: "File uploaded successfully to Supabase Storage.",
      url: urlData.publicUrl,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Storage error: ${msg}`,
      error: msg,
    };
  }
}
