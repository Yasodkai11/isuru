"use server";

import { headers } from "next/headers";
import { createAdminClient, createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/schemas/auth";
import { INITIAL_ADMIN_STAFF } from "@/lib/admin-seed";
import { checkRateLimit } from "@/lib/rate-limit";
import { redirect } from "next/navigation";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
  isAdmin?: boolean;
  redirectUrl?: string;
}

export interface CurrentUserSession {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: {
    id: string;
    email: string;
    fullName: string;
    role?: string;
    department?: string;
  } | null;
}

/**
 * Determine if an email or user ID belongs to an authorized staff/admin member.
 */
export async function verifyIsAdmin(email?: string | null, userId?: string | null): Promise<boolean> {
  if (!email && !userId) return false;

  const normalizedEmail = (email || "").trim().toLowerCase();

  // SEC-04: In development mode only, allow matching local seed staff if Supabase is offline
  if (!isSupabaseConfigured && process.env.NODE_ENV === "development" && normalizedEmail) {
    const isSeedStaff = INITIAL_ADMIN_STAFF.some(
      (s) => s.email.toLowerCase() === normalizedEmail && s.status === "active"
    );
    if (isSeedStaff) return true;
  }

  // 2. Query staff_members table authoritatively in Supabase
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase.from("staff_members").select("id, role, status, auth_user_id").eq("status", "active");

      if (userId) {
        query = query.eq("auth_user_id", userId);
      } else if (normalizedEmail) {
        query = query.eq("email", normalizedEmail);
      }

      const { data, error } = await query.maybeSingle();
      if (!error && data) {
        // If queried with userId, ensure auth_user_id matches
        if (userId && data.auth_user_id && data.auth_user_id !== userId) {
          return false;
        }
        return true;
      }
    } catch {
      // Fallback
    }
  }

  return false;
}

/**
 * Authenticate with Username or Email and Password.
 * Automatically resolves usernames to registered emails.
 */
export async function loginAction(formData: FormData | LoginInput): Promise<ActionResult> {
  // SEC-08: Apply rate limiting on login action to prevent brute-force attacks
  const headerList = await headers();
  const clientIp =
    headerList.get("x-forwarded-for")?.split(",")[0].trim() ||
    headerList.get("x-real-ip") ||
    "client-session";

  const rateCheck = checkRateLimit(`login:${clientIp}`, {
    limit: 5,
    windowMs: 60 * 1000,
  });

  if (!rateCheck.success) {
    return {
      success: false,
      message: rateCheck.message || "Too many login attempts. Please wait 60 seconds before trying again.",
    };
  }

  const rawData =
    formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter your username/email and vault password.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { password } = parsed.data;
  const rawIdentifier = (parsed.data.identifier || parsed.data.email || "").trim();

  if (!rawIdentifier) {
    return {
      success: false,
      message: "Username or email address is required.",
    };
  }

  let resolvedEmail = rawIdentifier.toLowerCase();

  // If user entered a username without @, resolve to email
  if (!rawIdentifier.includes("@")) {
    const username = rawIdentifier.toLowerCase();

    // Check seed staff: prioritize email prefix match (e.g. isuru@ -> isuru@isurugems.com)
    // before fuzzy name matching to prevent matching staff-00 (uththiyaisurudewamendis@gmail.com)
    const seedMatch =
      INITIAL_ADMIN_STAFF.find((s) => s.email.toLowerCase().startsWith(`${username}@`)) ||
      INITIAL_ADMIN_STAFF.find(
        (s) =>
          s.fullName.toLowerCase().replace(/\s+/g, "") === username ||
          s.fullName.toLowerCase() === username
      ) ||
      INITIAL_ADMIN_STAFF.find((s) => s.fullName.toLowerCase().startsWith(username));

    if (seedMatch) {
      resolvedEmail = seedMatch.email.toLowerCase();
    } else {
      // Try resolving from staff_members table in Supabase
      if (isSupabaseConfigured) {
        try {
          const supabase = await createClient();
          const { data } = await supabase
            .from("staff_members")
            .select("email")
            .ilike("email", `${username}@%`)
            .maybeSingle();

          if (data?.email) {
            resolvedEmail = data.email.toLowerCase();
          } else {
            // Default domain fallback
            resolvedEmail = `${username}@isurugems.com`;
          }
        } catch {
          resolvedEmail = `${username}@isurugems.com`;
        }
      } else {
        resolvedEmail = `${username}@isurugems.com`;
      }
    }
  }

  try {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: resolvedEmail,
      password,
    });

    if (error || !authData?.user) {
      return {
        success: false,
        message: error?.message || "Invalid username or password.",
      };
    }

    // SEC-04: When staff logs in successfully, sync last_login and safely ensure auth_user_id is linked
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const adminSupabase = await createAdminClient();
        const { data: existingStaff } = await adminSupabase
          .from("staff_members")
          .select("id, auth_user_id")
          .eq("email", resolvedEmail)
          .maybeSingle();

        if (existingStaff) {
          const updatePayload: Database["public"]["Tables"]["staff_members"]["Update"] = {
            last_login: new Date().toISOString(),
          };

          // Only link auth_user_id if not already bound, and caller email is confirmed
          if (!existingStaff.auth_user_id && authData.user.email_confirmed_at) {
            updatePayload.auth_user_id = authData.user.id;
          }

          if (existingStaff.auth_user_id === authData.user.id || !existingStaff.auth_user_id) {
            await adminSupabase
              .from("staff_members")
              .update(updatePayload)
              .eq("id", existingStaff.id);
          }
        }
      } catch {
        // Non-fatal background sync
      }
    }

    // Verify staff/admin status
    const isAdmin = await verifyIsAdmin(authData.user.email, authData.user.id);

    return {
      success: true,
      isAdmin,
      redirectUrl: isAdmin ? "/admin" : "/account",
      message: isAdmin
        ? "Administrative authentication verified. Welcome to the Vault Console."
        : "Welcome back to Isuru Gems.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during authentication.",
    };
  }
}

/**
 * Register a new collector patron account.
 */
export async function registerAction(
  formData: FormData | RegisterInput
): Promise<ActionResult> {
  const rawData =
    formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the form fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password, fullName } = parsed.data;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    // If auto-confirmed or session created, determine redirect
    const hasSession = Boolean(data.session);

    return {
      success: true,
      isAdmin: false,
      redirectUrl: hasSession ? "/account" : "/login?registered=true",
      message: hasSession
        ? "Account created successfully. Welcome to Isuru Gems."
        : "Registration successful. Please check your email to confirm your account.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "An error occurred during account creation.",
    };
  }
}

/**
 * Retrieve current authenticated session and role.
 */
export async function getCurrentUserAction(): Promise<CurrentUserSession> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null,
      };
    }

    const email = data.user.email || "";
    const fullName =
      data.user.user_metadata?.full_name ||
      data.user.user_metadata?.name ||
      email.split("@")[0] ||
      "Collector";

    const isAdmin = await verifyIsAdmin(email, data.user.id);

    // If staff, get details
    let role = (data.user.user_metadata?.role as string) || (isAdmin ? "super_admin" : "collector");
    let department = "Private Collector";

    if (isAdmin) {
      const staffMember = INITIAL_ADMIN_STAFF.find(
        (s) => s.email.toLowerCase() === email.toLowerCase()
      );
      if (staffMember) {
        role = staffMember.role;
        department = staffMember.department;
      }
    }

    return {
      isAuthenticated: true,
      isAdmin,
      user: {
        id: data.user.id,
        email,
        fullName,
        role,
        department,
      },
    };
  } catch {
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
    };
  }
}

/**
 * Sign out current session and redirect to homepage.
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
