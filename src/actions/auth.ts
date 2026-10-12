"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/schemas/auth";
import { redirect } from "next/navigation";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
}

export async function loginAction(formData: FormData | LoginInput): Promise<ActionResult> {
  const rawData = formData instanceof FormData
    ? Object.fromEntries(formData.entries())
    : formData;

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please verify the information provided.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Welcome back to Isuru Gems.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "An unexpected error occurred during authentication.",
    };
  }
}

export async function registerAction(formData: FormData | RegisterInput): Promise<ActionResult> {
  const rawData = formData instanceof FormData
    ? Object.fromEntries(formData.entries())
    : formData;

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
    const { error } = await supabase.auth.signUp({
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

    return {
      success: true,
      message: "Registration successful. Please check your email for confirmation.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "An error occurred during account creation.",
    };
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
