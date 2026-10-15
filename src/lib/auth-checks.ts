import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { INITIAL_ADMIN_STAFF } from "@/lib/admin-seed";

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

  // Query staff_members table to verify active staff status and role
  const { data: staffMember, error: staffError } = await supabase
    .from("staff_members")
    .select("id, full_name, email, role, status, auth_user_id, department")
    .eq("status", "active")
    .or(`auth_user_id.eq.${user.id},email.eq.${normalizedEmail}`)
    .maybeSingle();

  if (!staffError && staffMember) {
    return {
      id: user.id,
      email: normalizedEmail,
      fullName: staffMember.full_name,
      role: staffMember.role,
      department: staffMember.department,
    };
  }

  // Fallback: Check if user matches local seed staff
  const isSeedStaff = INITIAL_ADMIN_STAFF.find(
    (s) => s.email.toLowerCase() === normalizedEmail && s.status === "active"
  );

  if (isSeedStaff) {
    return {
      id: user.id,
      email: normalizedEmail,
      fullName: isSeedStaff.fullName,
      role: isSeedStaff.role,
      department: isSeedStaff.department,
    };
  }

  throw new Error("Forbidden: Administrator clearance required for this operation.");
}
