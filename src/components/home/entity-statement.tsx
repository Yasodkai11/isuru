import React from "react";
import Link from "next/link";
import { SEO_CONFIG } from "@/lib/seo-config";
import { ShieldCheck, MapPin, Award, ArrowRight } from "lucide-react";

export function EntityStatement() {
  return (
    <section
      aria-label="About Isuru Ceylon Gems"
      className="relative bg-[#FAF6EE] border-b border-[#B8924A]/25 py-8 sm:py-10"
    >
      <div className="container-luxe">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          {/* Institutional Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5E0F1E]/8 border border-[#B8924A]/30 text-[#5E0F1E] text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#80601C]" />
            <span>NGJA Registered Gem Dealer · License No. {SEO_CONFIG.brand.licenseNumber}</span>
          </div>

          {/* Plain-text 2-sentence Who We Are Statement for bots and human visitors */}
          <p className="font-serif text-lg sm:text-xl lg:text-2xl text-[#5E0F1E] font-normal leading-relaxed max-w-3xl mx-auto">
            {SEO_CONFIG.brand.entityStatement}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs text-[#2B2B2B]/75 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#80601C]" />
              Ratnapura Bureau & Colombo VIP Salon
            </span>
            <span className="hidden sm:inline text-[#B8924A]">•</span>
            <span>Est. 1964 · Ancestral Mining Heritage 1922</span>
            <span className="hidden sm:inline text-[#B8924A]">•</span>
            <Link
              href="/about"
              className="text-[#80601C] hover:text-[#5E0F1E] font-semibold underline underline-offset-4 transition-colors inline-flex items-center gap-1"
            >
              <span>Our Family Story</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
