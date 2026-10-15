import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import { GoldDivider } from "@/components/layout/gold-divider";
import { ShieldCheck, Lock, Sparkles, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Vault Console Sign In | Isuru Gems Ceylon",
  description: "Executive gemstone inventory, acquisition workflow, and client concierge authentication portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#120F0D] text-[#FAF6EE] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#5E0F1E]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#B8924A]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Top Back Link */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/"
            className="text-sm uppercase tracking-wider font-semibold text-[#FAF6EE]/70 hover:text-[#D4AF67] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#D4AF67] bg-[#D4AF67]/10 px-3 py-1.5 border border-[#D4AF67]/30 rounded-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF67]" />
            <span>NGJA Vault Security</span>
          </span>
        </div>

        {/* Brand Crest */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center mb-3">
            <Image
              src="/isuru_images/logo-isuru-light.webp"
              alt="Isuru Ceylon Gems"
              width={220}
              height={68}
              className="h-12 w-auto object-contain drop-shadow-md"
              priority
            />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF6EE] font-medium tracking-wide">
            Admin Vault Console
          </h1>
          <p className="text-sm text-[#FAF6EE]/80 uppercase tracking-[0.18em] font-medium">
            Executive Clearance & Staff Authentication
          </p>
        </div>

        <GoldDivider className="my-6" />

        {/* Login Container */}
        <div className="bg-[#FAF6EE] text-[#2B2B2B] p-6 sm:p-8 border border-[#B8924A]/40 shadow-2xl rounded-xs">
          <Suspense fallback={<div className="py-8 text-center text-sm text-[#5E0F1E]">Initializing staff vault credentials...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Security Disclaimers */}
        <div className="mt-6 text-center text-xs sm:text-sm text-[#FAF6EE]/60 space-y-1">
          <p>Restricted to licensed National Gem and Jewellery Authority signatories.</p>
          <p className="text-[#D4AF67]/90 font-medium">Armored dispatch, certificate vaults, and client records are encrypted.</p>
        </div>
      </div>
    </div>
  );
}
