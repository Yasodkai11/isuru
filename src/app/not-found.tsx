import Link from "next/link";
import { GoldDivider } from "@/components/layout/gold-divider";
import { SEO_CONFIG } from "@/lib/seo-config";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-20 sm:py-28 bg-[#FAF6EE] min-h-[75vh] flex items-center justify-center text-center">
      <div className="max-w-lg mx-auto px-4 space-y-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#80601C] font-semibold block">
          {SEO_CONFIG.brand.name} · Archive 404
        </span>

        {/* Strictly the single H1 on the 404 page */}
        <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-normal leading-tight">
          Gemstone Specimen or Page Not Found
        </h1>

        <p className="text-sm text-[#2B2B2B]/75 leading-relaxed max-w-md mx-auto">
          The specimen or page you are seeking may have been acquired by a private collector, placed in reserve, or relocated within our vault.
        </p>

        <GoldDivider withOrnament className="my-6 max-w-xs mx-auto" />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/gems"
            className="inline-flex items-center justify-center gap-2 bg-[#5E0F1E] text-[#FAF6EE] px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#420A15] transition-colors shadow-xs"
          >
            <span>Explore Active Vault</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF67]" />
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center justify-center gap-1.5 border border-[#B8924A] text-[#5E0F1E] px-6 py-3.5 text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#FAF6EE] transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#80601C]" />
            <span>Knowledge Guides</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
