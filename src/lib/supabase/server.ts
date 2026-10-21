import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Creates a server-side Supabase client with Next.js cookies support.
 * Safe for Server Components, Server Actions, and Route Handlers.
 */
export async function createClient() {
  let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null;
  try {
    cookieStore = await cookies();
  } catch {
    // In static prerendering, sitemaps, or ISR tasks, cookies() is not available
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-isuru-gems.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key";

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore ? cookieStore.getAll() : [];
        },
        setAll(cookiesToSet) {
          if (!cookieStore) return;
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore!.set(name, value, options)
            );
          } catch {
            // Can be ignored if called from a Server Component.
          }
        },
      },
    }
  );
}

/**
 * Server-only admin client with service role key.
 * STRICT SECURITY: Never import in client components or leak to browser.
 */
export async function createAdminClient() {
  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-isuru-gems.supabase.co";

  // Fallback: If not in process.env (e.g. custom standalone runtime), read from .env.local on disk
  if (!serviceRoleKey || !supabaseUrl) {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const envPath = path.resolve(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf8");
        const keyMatch = content.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
        const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
        if (keyMatch && !serviceRoleKey) {
          serviceRoleKey = keyMatch[1].trim().replace(/^['"]|['"]$/g, "");
          process.env["SUPABASE_SERVICE_ROLE_KEY"] = serviceRoleKey;
        }
        if (urlMatch && !supabaseUrl) {
          supabaseUrl = urlMatch[1].trim().replace(/^['"]|['"]$/g, "");
        }
      }
    } catch {
      // Ignore fallback read errors
    }
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in server environment variables.");
  }

  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
