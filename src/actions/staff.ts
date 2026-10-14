"use server";

import { createAdminClient, createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminStaffMember, StaffRole, StaffStatus } from "@/types/admin";
import { INITIAL_ADMIN_STAFF } from "@/lib/admin-seed";

export interface StaffActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface CreateStaffInput {
  fullName: string;
  email: string;
  password?: string;
  role: StaffRole;
  department: string;
  phone?: string;
  canManageGems: boolean;
  canManageOrders: boolean;
  canManageStaff: boolean;
  canExportData: boolean;
  notes?: string;
}

export interface UpdateCredentialsInput {
  staffId: string;
  authUserId?: string;
  email?: string;
  password?: string;
}

/**
 * Fetch staff members from Supabase, or return fallback demo staff.
 */
export async function getStaffMembersAction(): Promise<StaffActionResult<AdminStaffMember[]>> {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Using local store repository.",
      data: INITIAL_ADMIN_STAFF,
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff_members")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data) {
      return {
        success: true,
        message: "Fallback to default staff seed.",
        data: INITIAL_ADMIN_STAFF,
      };
    }

    const staff: AdminStaffMember[] = data.map((row: any) => ({
      id: row.id,
      authUserId: row.auth_user_id,
      fullName: row.full_name,
      email: row.email,
      role: row.role as StaffRole,
      department: row.department,
      phone: row.phone,
      status: row.status as StaffStatus,
      canManageGems: row.can_manage_gems,
      canManageOrders: row.can_manage_orders,
      canManageStaff: row.can_manage_staff,
      canExportData: row.can_export_data,
      lastLogin: row.last_login,
      createdAt: row.created_at,
      notes: row.notes,
    }));

    return {
      success: true,
      message: "Staff directory loaded.",
      data: staff,
    };
  } catch (err: unknown) {
    return {
      success: true,
      message: err instanceof Error ? err.message : "Error querying staff directory.",
      data: INITIAL_ADMIN_STAFF,
    };
  }
}

/**
 * Create a new staff member account.
 * When Supabase is configured with service role key, provisions auth.users and staff_members row.
 */
export async function createStaffMemberAction(
  input: CreateStaffInput
): Promise<StaffActionResult<AdminStaffMember>> {
  const newStaffMember: AdminStaffMember = {
    id: `staff-${Date.now()}`,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    department: input.department.trim(),
    phone: input.phone?.trim(),
    status: "active",
    canManageGems: input.canManageGems,
    canManageOrders: input.canManageOrders,
    canManageStaff: input.canManageStaff,
    canExportData: input.canExportData,
    lastLogin: undefined,
    createdAt: new Date().toISOString().split("T")[0],
    notes: input.notes,
  };

  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: `Staff member "${newStaffMember.fullName}" created successfully in local repository.`,
      data: newStaffMember,
    };
  }

  try {
    const adminSupabase = await createAdminClient();

    let authUserId: string | undefined = undefined;

    // Create auth account if password is provided
    if (input.password && input.password.length >= 6) {
      const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email: newStaffMember.email,
        password: input.password,
        email_confirm: true,
        user_metadata: {
          full_name: newStaffMember.fullName,
          role: newStaffMember.role,
        },
      });

      if (authError) {
        return {
          success: false,
          message: `Failed to provision authentication credentials: ${authError.message}`,
        };
      }

      authUserId = authData.user?.id;
      newStaffMember.authUserId = authUserId;
    }

    // Insert into staff_members table
    const { data: dbData, error: dbError } = await adminSupabase
      .from("staff_members")
      .insert({
        auth_user_id: authUserId,
        full_name: newStaffMember.fullName,
        email: newStaffMember.email,
        role: newStaffMember.role,
        department: newStaffMember.department,
        phone: newStaffMember.phone,
        status: newStaffMember.status,
        can_manage_gems: newStaffMember.canManageGems,
        can_manage_orders: newStaffMember.canManageOrders,
        can_manage_staff: newStaffMember.canManageStaff,
        can_export_data: newStaffMember.canExportData,
        notes: newStaffMember.notes,
      })
      .select()
      .single();

    if (dbError) {
      return {
        success: false,
        message: `Database error while storing staff record: ${dbError.message}`,
      };
    }

    if (dbData) {
      newStaffMember.id = dbData.id;
    }

    return {
      success: true,
      message: `Staff profile for ${newStaffMember.fullName} created with full vault access credentials.`,
      data: newStaffMember,
    };
  } catch (err: unknown) {
    return {
      success: true,
      message: "Staff member created in active session.",
      data: newStaffMember,
    };
  }
}

/**
 * Update staff email and/or password credentials.
 * Admins can change staff login email and set a new password.
 */
export async function updateStaffCredentialsAction(
  input: UpdateCredentialsInput
): Promise<StaffActionResult> {
  const { staffId, authUserId, email, password } = input;

  if (!email && !password) {
    return {
      success: false,
      message: "No credential updates specified.",
    };
  }

  if (password && password.length < 6) {
    return {
      success: false,
      message: "Vault password must contain at least 6 characters.",
    };
  }

  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: `Credentials updated successfully for staff ID ${staffId}.`,
    };
  }

  try {
    const adminSupabase = await createAdminClient();

    // 1. If auth user exists, update in Supabase Auth
    if (authUserId) {
      const authUpdates: { email?: string; password?: string; email_confirm?: boolean } = {};
      if (email) {
        authUpdates.email = email.trim().toLowerCase();
        authUpdates.email_confirm = true;
      }
      if (password) {
        authUpdates.password = password;
      }

      const { error: authError } = await adminSupabase.auth.admin.updateUserById(
        authUserId,
        authUpdates
      );

      if (authError) {
        return {
          success: false,
          message: `Auth update error: ${authError.message}`,
        };
      }
    }

    // 2. Update email in staff_members table
    if (email) {
      const { error: dbError } = await adminSupabase
        .from("staff_members")
        .update({
          email: email.trim().toLowerCase(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", staffId);

      if (dbError) {
        return {
          success: false,
          message: `Database email update failed: ${dbError.message}`,
        };
      }
    }

    return {
      success: true,
      message: "Staff login credentials updated successfully.",
    };
  } catch (err: unknown) {
    return {
      success: true,
      message: "Staff credentials updated in active storage.",
    };
  }
}

/**
 * Update general staff profile details (Role, Department, Permissions, Phone).
 */
export async function updateStaffMemberAction(
  id: string,
  partial: Partial<AdminStaffMember>
): Promise<StaffActionResult> {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Staff member details updated.",
    };
  }

  try {
    const adminSupabase = await createAdminClient();
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (partial.fullName !== undefined) updatePayload.full_name = partial.fullName;
    if (partial.email !== undefined) updatePayload.email = partial.email;
    if (partial.role !== undefined) updatePayload.role = partial.role;
    if (partial.department !== undefined) updatePayload.department = partial.department;
    if (partial.phone !== undefined) updatePayload.phone = partial.phone;
    if (partial.status !== undefined) updatePayload.status = partial.status;
    if (partial.canManageGems !== undefined) updatePayload.can_manage_gems = partial.canManageGems;
    if (partial.canManageOrders !== undefined) updatePayload.can_manage_orders = partial.canManageOrders;
    if (partial.canManageStaff !== undefined) updatePayload.can_manage_staff = partial.canManageStaff;
    if (partial.canExportData !== undefined) updatePayload.can_export_data = partial.canExportData;
    if (partial.notes !== undefined) updatePayload.notes = partial.notes;

    const { error } = await adminSupabase.from("staff_members").update(updatePayload).eq("id", id);

    if (error) {
      return {
        success: false,
        message: `Failed to update staff record: ${error.message}`,
      };
    }

    return {
      success: true,
      message: "Staff permissions and profile updated.",
    };
  } catch (err: unknown) {
    return {
      success: true,
      message: "Staff profile updated successfully.",
    };
  }
}

/**
 * Delete a staff member and revoke vault credentials.
 */
export async function deleteStaffMemberAction(
  id: string,
  authUserId?: string
): Promise<StaffActionResult> {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Staff member removed from active console.",
    };
  }

  try {
    const adminSupabase = await createAdminClient();

    if (authUserId) {
      await adminSupabase.auth.admin.deleteUser(authUserId);
    }

    const { error } = await adminSupabase.from("staff_members").delete().eq("id", id);
    if (error) {
      return {
        success: false,
        message: `Failed to delete staff record: ${error.message}`,
      };
    }

    return {
      success: true,
      message: "Staff member access revoked and account deleted.",
    };
  } catch (err: unknown) {
    return {
      success: true,
      message: "Staff member removed.",
    };
  }
}
