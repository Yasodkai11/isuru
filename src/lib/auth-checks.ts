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
 */
export async function requireAdminSession(): Promise<AuthenticatedAdmin> {
  if (!isSupabaseConfigured) {
    // In local demo / offline mode without Supabase credentials, return local fallback admin
    return {
      id: "local-admin",
      email: "isuru@isurugems.com",
      fullName: "Isuru (Vault Administrator)",
      role: "super_admin",
      department: "Executive & Board of Gemologists",
    };
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
    // Ensure auth_user_id is linked to the authenticated user's ID
    if (!staffMember.auth_user_id) {
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
}
