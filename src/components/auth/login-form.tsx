"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, ShieldCheck, Eye, EyeOff, Lock, User, Sparkles } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || searchParams.get("next");
  const roleParam = searchParams.get("role");
  const errorParam = searchParams.get("error");
  const registeredParam = searchParams.get("registered");

  // Mode: "collector" or "admin"
  const [mode, setMode] = useState<"collector" | "admin">(
    roleParam === "admin" || (redirectParam && redirectParam.startsWith("/admin")) ? "admin" : "collector"
  );

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam ? "Authentication failed or session expired. Please sign in again." : null
  );
  const [success, setSuccess] = useState<string | null>(
    registeredParam ? "Account registered successfully. Please sign in to access your vault." : null
  );

  useEffect(() => {
    if (roleParam === "admin" || (redirectParam && redirectParam.startsWith("/admin"))) {
      setMode("admin");
    }
  }, [roleParam, redirectParam]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        redirectParam || (mode === "admin" ? "/admin" : "/account")
      )}`;

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (oauthError) {
        if (oauthError.message.toLowerCase().includes("not enabled") || oauthError.message.toLowerCase().includes("provider")) {
          setError(
            "Google sign-in is not yet enabled in the Supabase project configuration. Please sign in using your username or email and password below."
          );
        } else {
          setError(oauthError.message);
        }
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to initiate Google authentication.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await loginAction({ identifier, password });
    setLoading(false);

    if (result.success) {
      setSuccess(result.message || "Authentication verified.");
      const destination = redirectParam || result.redirectUrl || (result.isAdmin ? "/admin" : "/account");
      setTimeout(() => {
        router.push(destination);
        router.refresh();
      }, 800);
    } else {
      setError(result.message || "Invalid credentials provided.");
    }
  };

  const handleFillDemoAdmin = () => {
    setIdentifier("yohan@isurugems.com");
    setPassword("MasterGem2026!");
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Portal Selection Tabs */}
      <div className="grid grid-cols-2 p-1 bg-[#F2EADB]/60 border border-[#B8924A]/30 rounded-xs text-sm font-medium">
        <button
          type="button"
          onClick={() => {
            setMode("collector");
            setError(null);
          }}
          className={`py-2.5 px-3 rounded-xs flex items-center justify-center gap-2 transition-all ${
            mode === "collector"
              ? "bg-[#5E0F1E] text-[#FAF6EE] shadow-xs font-semibold"
              : "text-[#2B2B2B]/70 hover:text-[#5E0F1E]"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Collector Portal</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("admin");
            setError(null);
          }}
          className={`py-2.5 px-3 rounded-xs flex items-center justify-center gap-2 transition-all ${
            mode === "admin"
              ? "bg-[#5E0F1E] text-[#FAF6EE] shadow-xs font-semibold"
              : "text-[#2B2B2B]/70 hover:text-[#5E0F1E]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Staff Vault Admin</span>
        </button>
      </div>

      {mode === "collector" && (
        <>
          {/* Google Sign-in Button for Patrons */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full py-3.5 px-4 bg-white hover:bg-neutral-50 text-[#2B2B2B] border border-[#B8924A]/35 shadow-xs font-sans text-sm uppercase tracking-wider font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-60"
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
            <span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#B8924A]/25 w-full" />
            <span className="bg-[#FDFBF7] px-3 text-xs uppercase tracking-wider text-[#2B2B2B]/60 shrink-0 font-medium">
              or sign in with password
            </span>
            <div className="border-t border-[#B8924A]/25 w-full" />
          </div>
        </>
      )}

      {/* Main Authentication Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm flex items-center gap-2 animate-gentle-fade">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-300 text-red-900 text-sm flex items-center gap-2 animate-gentle-fade">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <div>
          <Label htmlFor="login-identifier">
            {mode === "admin" ? "Staff Username or Registered Email" : "Username or Email Address"}
          </Label>
          <Input
            id="login-identifier"
            type="text"
            required
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={mode === "admin" ? "yohan or yohan@isurugems.com" : "collector_ceylon or client@private.com"}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="login-password" className="mb-0">
              {mode === "admin" ? "Vault Authorization Password" : "Vault Password"}
            </Label>
            <span className="text-xs text-[#B8924A] hover:underline cursor-pointer font-medium">
              Forgot Password?
            </span>
          </div>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2B2B2B]/50 hover:text-[#5E0F1E] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading || googleLoading}
          className="w-full py-3.5 text-sm uppercase tracking-[0.18em] font-semibold"
        >
          {loading
            ? "Verifying Credentials..."
            : mode === "admin"
            ? "Authorize Vault Access"
            : "Access Collector Portal"}
        </Button>

        {mode === "admin" && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="text-xs text-[#B8924A] hover:text-[#5E0F1E] underline inline-flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B8924A]" />
              <span>Use Executive Seed Credentials (Yohan Gunawardena)</span>
            </button>
          </div>
        )}

        <div className="text-center text-xs sm:text-sm text-[#2B2B2B]/70 pt-2 border-t border-[#B8924A]/15">
          {mode === "collector" ? (
            <>
              <span>New patron of Isuru Gems? </span>
              <Link href="/register" className="text-[#5E0F1E] font-semibold hover:underline">
                Create an Account
              </Link>
            </>
          ) : (
            <p className="text-xs text-[#2B2B2B]/60">
              Strictly restricted to licensed NGJA staff & administrators. Unauthorized access attempts are audited.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
