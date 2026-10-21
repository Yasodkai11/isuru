import { cache } from "react";
import { createAdminClient, createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  fullName: string;
  role: string;
  department?: string;
}

export interface AuthCheckResult {
  isAuthorized: boolean;
  user: AuthenticatedAdmin | null;
  error?: string;
}

/**
 * Validates that the current request has an authenticated session belonging to
 * an active staff administrator. Throws an Error or returns null if unauthorized.
 * Wrapped in React cache() to memoize verification per-request (DATA-07).
 */
export const requireAdminSession = cache(async (): Promise<AuthenticatedAdmin> => {
  // SEC-02: Fail closed in production or non-development environments
  if (process.env.NODE_ENV === "production" && !isSupabaseConfigured) {
    throw new Error("System security error: Authentication backend is offline.");
  }

  if (!isSupabaseConfigured) {
    if (process.env.NODE_ENV === "development") {
      // In local development demo / offline mode without Supabase credentials, return local fallback admin
      return {
        id: "local-admin",
        email: "isuru@isurugems.com",
        fullName: "Isuru (Vault Administrator)",
        role: "super_admin",
        department: "Executive & Board of Gemologists",
      };
    }
    throw new Error("Unauthorized: Authentication backend is unconfigured.");
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    throw new Error("Unauthorized: You must be signed in to perform this operation.");
  }

  const user = authData.user;
  const normalizedEmail = (user.email || "").trim().toLowerCase();

  // Authoritatively query staff_members using server admin client to verify active staff status
  const adminSupabase = await createAdminClient();
  const { data: staffMember, error: staffError } = await adminSupabase
    .from("staff_members")
    .select("id, full_name, email, role, status, auth_user_id, department")
    .eq("status", "active")
    .or(`auth_user_id.eq.${user.id},email.eq.${normalizedEmail}`)
    .maybeSingle();

  if (!staffError && staffMember) {
    // SEC-04: If the staff record is already bound to another auth account, reject immediately
    if (staffMember.auth_user_id && staffMember.auth_user_id !== user.id) {
      throw new Error("Forbidden: Account mismatch with registered staff profile.");
    }

    // SEC-04: Require verified email confirmation before binding auth_user_id to prevent unconfirmed account linking
    if (!staffMember.auth_user_id) {
      if (!user.email_confirmed_at) {
        throw new Error("Forbidden: Email address must be confirmed before vault clearance can be granted.");
      }
      await adminSupabase
        .from("staff_members")
        .update({ auth_user_id: user.id })
        .eq("id", staffMember.id);
    }

    return {
      id: user.id,
      email: normalizedEmail,
      fullName: staffMember.full_name,
      role: staffMember.role,
      department: staffMember.department,
    };
  }

  throw new Error("Forbidden: Administrator clearance required for this operation.");
});
