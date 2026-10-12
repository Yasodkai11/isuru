"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await loginAction({ email, password });
    setLoading(false);

    if (result.success) {
      setSuccess(result.message || "Welcome back.");
      setTimeout(() => {
        router.push("/gems");
        router.refresh();
      }, 1000);
    } else {
      setError(result.message || "Invalid credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        <Label htmlFor="login-email">Registered Email Address</Label>
        <Input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="client@private.com"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="login-password" className="mb-0">Vault Password</Label>
          <span className="text-[11px] text-[#B8924A] hover:underline cursor-pointer">
            Forgot Password?
          </span>
        </div>
        <Input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full py-3.5 text-xs uppercase tracking-[0.2em]"
      >
        {loading ? "Authenticating..." : "Access Collector Portal"}
      </Button>

      <div className="text-center text-xs text-[#2B2B2B]/70 pt-2 border-t border-[#B8924A]/15">
        <span>New patron of Isuru Gems? </span>
        <Link href="/register" className="text-[#5E0F1E] font-semibold hover:underline">
          Create an Account
        </Link>
      </div>
    </form>
  );
}
