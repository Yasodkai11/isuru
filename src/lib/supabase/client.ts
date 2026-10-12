import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

/**
 * Creates a Supabase client for client-side components using NEXT_PUBLIC keys.
 * Never includes or exposes service-role keys.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-isuru-gems.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key";

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
