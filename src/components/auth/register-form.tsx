"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction } from "@/actions/auth";
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
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        router.push("/login");
      }, 1500);
    } else {
      setError(result.message || "Registration failed.");
      if (result.errors) {
        setFieldErrors(result.errors);
      }
    }
  };

  return (
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
          <span>{error}</span>
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
        <Label htmlFor="reg-pass">Create Password (Min. 8 characters) *</Label>
        <Input
          id="reg-pass"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
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
          placeholder="••••••••••••"
        />
        {fieldErrors?.confirmPassword && (
          <p className="text-[11px] text-red-700 mt-1">{fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full py-3.5 text-xs uppercase tracking-[0.2em] mt-2"
      >
        {loading ? "Registering..." : "Create Collector Account"}
      </Button>

      <div className="text-center text-xs text-[#2B2B2B]/70 pt-2 border-t border-[#B8924A]/15">
        <span>Already have an account? </span>
        <Link href="/login" className="text-[#5E0F1E] font-semibold hover:underline">
          Sign In Here
        </Link>
      </div>
    </form>
  );
}
