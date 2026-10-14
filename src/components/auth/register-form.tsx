"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/account`,
        },
      });

      if (oauthError) {
        if (oauthError.message.toLowerCase().includes("not enabled") || oauthError.message.toLowerCase().includes("provider")) {
          setError(
            "Google sign-in is not yet enabled in the Supabase project configuration. Please register with your email address below."
          );
        } else {
          setError(oauthError.message);
        }
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to initiate Google sign up.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors(null);
    setSuccess(null);

    const result = await registerAction({
      fullName,
      email,
      password,
      confirmPassword,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(result.message || "Account registered successfully.");
      setTimeout(() => {
        router.push(result.redirectUrl || "/login");
      }, 1500);
    } else {
      setError(result.message || "Registration failed.");
      if (result.errors) {
        setFieldErrors(result.errors);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Sign-Up Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={googleLoading || loading}
        className="w-full py-3 px-4 bg-white hover:bg-neutral-50 text-[#2B2B2B] border border-[#B8924A]/35 shadow-xs font-sans text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-60"
      >
        {googleLoading ? (
          <span className="w-4 h-4 border-2 border-[#5E0F1E] border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{googleLoading ? "Connecting to Google..." : "Sign up with Google"}</span>
      </button>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#B8924A]/25 w-full" />
        <span className="bg-[#FDFBF7] px-3 text-[11px] uppercase tracking-wider text-[#2B2B2B]/60 shrink-0">
          or register with email
        </span>
        <div className="border-t border-[#B8924A]/25 w-full" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-300 text-red-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <div>
          <Label htmlFor="reg-name">Full Name *</Label>
          <Input
            id="reg-name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Sir / Lady / Full Name"
          />
          {fieldErrors?.fullName && (
            <p className="text-[11px] text-red-700 mt-1">{fieldErrors.fullName[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="reg-email">Email Address *</Label>
          <Input
            id="reg-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@private.com"
          />
          {fieldErrors?.email && (
            <p className="text-[11px] text-red-700 mt-1">{fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="reg-password">Vault Password *</Label>
          <Input
            id="reg-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
          />
          {fieldErrors?.password && (
            <p className="text-[11px] text-red-700 mt-1">{fieldErrors.password[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="reg-confirm">Confirm Password *</Label>
          <Input
            id="reg-confirm"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
          />
          {fieldErrors?.confirmPassword && (
            <p className="text-[11px] text-red-700 mt-1">{fieldErrors.confirmPassword[0]}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading || googleLoading}
          className="w-full py-3.5 text-xs uppercase tracking-[0.2em]"
        >
          {loading ? "Creating Patron Account..." : "Create Patron Account"}
        </Button>

        <div className="text-center text-xs text-[#2B2B2B]/70 pt-2 border-t border-[#B8924A]/15">
          <span>Already registered? </span>
          <Link href="/login" className="text-[#5E0F1E] font-semibold hover:underline">
            Sign In to Vault
          </Link>
        </div>
      </form>
    </div>
  );
}
