"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Lock, ArrowLeft, KeyRound, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminAuthBarrierProps {
  onBypassDemo?: () => void;
}

export function AdminAuthBarrier({ onBypassDemo }: AdminAuthBarrierProps) {
  return (
    <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#FDFBF7] border-2 border-[#B8924A]/40 shadow-xl p-8 sm:p-10 text-center space-y-6 animate-gentle-fade relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#B8924A]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#B8924A]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#B8924A]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#B8924A]" />

        <div className="inline-flex p-4 rounded-full bg-[#5E0F1E]/10 border border-[#5E0F1E]/20 text-[#5E0F1E] mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] text-[#B8924A] font-bold block">
            National Gem & Jewellery Authority Clearance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-medium tracking-wide">
            Vault Authorization Required
          </h1>
          <p className="text-sm sm:text-base text-[#2B2B2B]/75 leading-relaxed max-w-md mx-auto">
            The Isuru Gems Executive Console is restricted to authenticated staff, gemologists, and vault custodians. Please sign in to proceed.
          </p>
        </div>

        <div className="p-4 bg-[#F2EADB]/60 border border-[#B8924A]/25 text-left text-sm space-y-2 rounded-xs">
          <div className="flex items-center gap-2 font-semibold text-[#5E0F1E]">
            <KeyRound className="w-4 h-4 text-[#B8924A]" />
            <span>Authorized Staff Credentials</span>
          </div>
          <p className="text-[#2B2B2B]/70 text-xs">
            Staff accounts use registered company emails (e.g., <code className="bg-white/80 px-1.5 py-0.5 border border-[#B8924A]/30 font-mono">yohan@isurugems.com</code>) or staff usernames.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/admin/login" className="flex-1">
            <Button variant="primary" className="w-full text-sm font-semibold uppercase tracking-wider py-3.5">
              Sign In as Staff
            </Button>
          </Link>

          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full text-sm font-semibold uppercase tracking-wider py-3.5 border-[#B8924A]/40 text-[#5E0F1E]">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Storefront
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
