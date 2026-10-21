import React, { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { GoldDivider } from "@/components/layout/gold-divider";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Collector Sign In",
    description: "Access your private gemstone orders, vault selections, and certification archives.",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: "/login",
    },
  };
}

export default function LoginPage() {
  return (
    <div className="py-16 bg-[#FAF6EE] min-h-[75vh] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-[#FDFBF7] border border-[#B8924A]/30 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
              Private Patron Area
            </span>
            {/* Strictly the single H1 for this page */}
            <h1 className="font-serif text-3xl text-[#5E0F1E] font-normal">
              Collector Portal Sign In
            </h1>
            <p className="text-xs text-[#2B2B2B]/70 leading-relaxed">
              Sign in to manage acquisitions, view verified laboratory dossiers, and track armored delivery.
            </p>
          </div>

          <GoldDivider className="my-4" />

          <Suspense fallback={<div className="py-8 text-center text-xs text-[#B8924A]">Loading authentication vault...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
