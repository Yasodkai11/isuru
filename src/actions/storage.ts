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

    // SEC-03: Verify file signature (magic bytes) to defend against MIME spoofing
    const isPng =
      buffer.length >= 4 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47;
    const isJpeg =
      buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isWebp =
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString() === "RIFF" &&
      buffer.subarray(8, 12).toString() === "WEBP";
    const isPdf = buffer.length >= 4 && buffer.subarray(0, 4).toString() === "%PDF";

    if (!isPng && !isJpeg && !isWebp && !isPdf) {
      return {
        success: false,
        message: "Invalid file signature. File contents do not match permitted image/PDF format.",
      };
    }

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
