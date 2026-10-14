"use server";

import { createAdminClient, createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/schemas/auth";
import { INITIAL_ADMIN_STAFF } from "@/lib/admin-seed";
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

  // 1. Check local seed staff for immediate match
  if (normalizedEmail) {
    const isSeedStaff = INITIAL_ADMIN_STAFF.some(
      (s) => s.email.toLowerCase() === normalizedEmail && s.status === "active"
    );
    if (isSeedStaff) return true;
  }

  // 2. Query staff_members table in Supabase
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase.from("staff_members").select("id, role, status").eq("status", "active");

      if (userId) {
        query = query.or(`auth_user_id.eq.${userId},email.eq.${normalizedEmail}`);
      } else if (normalizedEmail) {
        query = query.eq("email", normalizedEmail);
      }

      const { data, error } = await query.maybeSingle();
      if (!error && data) {
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

    // Check seed staff for username matching email prefix or full name
    const seedMatch = INITIAL_ADMIN_STAFF.find(
      (s) =>
        s.email.toLowerCase().startsWith(`${username}@`) ||
        s.fullName.toLowerCase().replace(/\s+/g, "") === username ||
        s.fullName.toLowerCase().startsWith(username)
    );

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
    let { data: authData, error } = await supabase.auth.signInWithPassword({
      email: resolvedEmail,
      password,
    });

    // If credentials failed and this is a seeded staff member, attempt auto-provisioning via admin client
    if (error && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const isSeedStaff = INITIAL_ADMIN_STAFF.some(
        (s) => s.email.toLowerCase() === resolvedEmail
      );

      if (isSeedStaff) {
        try {
          const adminSupabase = await createAdminClient();
          // Find or create the user in Supabase Auth
          const { data: listData } = await adminSupabase.auth.admin.listUsers();
          const existingUser = listData?.users?.find(
            (u) => u.email?.toLowerCase() === resolvedEmail
          );

          if (!existingUser) {
            const seedMember = INITIAL_ADMIN_STAFF.find(
              (s) => s.email.toLowerCase() === resolvedEmail
            );
            await adminSupabase.auth.admin.createUser({
              email: resolvedEmail,
              password,
              email_confirm: true,
              user_metadata: {
                full_name: seedMember?.fullName || "Staff Administrator",
                role: seedMember?.role || "super_admin",
              },
            });
          } else {
            // Update password for seamless access
            await adminSupabase.auth.admin.updateUserById(existingUser.id, {
              password,
              email_confirm: true,
            });
          }

          // Retry authentication after provisioning
          const retry = await supabase.auth.signInWithPassword({
            email: resolvedEmail,
            password,
          });

          if (!retry.error) {
            authData = retry.data;
            error = null;
          }
        } catch {
          // Ignore admin fallback error
        }
      }
    }

    if (error || !authData?.user) {
      return {
        success: false,
        message: error?.message || "Invalid username or password.",
      };
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
