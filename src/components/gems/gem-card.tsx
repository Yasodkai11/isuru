import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Gemstone } from "@/types/gem";
import { formatCurrency, formatCarats } from "@/lib/utils";
import { CertificationBadge } from "./certification-badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Sparkles, ArrowRight } from "lucide-react";

interface GemCardProps {
  gem: Gemstone;
}

export function GemCard({ gem }: GemCardProps) {
  const primaryImage = gem.images[0] || {
    url: "/isuru_images/blue1.jpg",
    alt: `Natural Ceylon ${gem.variety} gemstone`,
  };

  return (
    <article className="group bg-[#FDFBF7] border border-[#B8924A]/30 overflow-hidden transition-all duration-400 hover:border-[#B8924A] hover:shadow-[0_12px_30px_rgba(184,146,74,0.16)] flex flex-col justify-between h-full rounded-xs">
      <div>
        {/* Isolated Gemstone Showcase Area */}
        <div className="relative aspect-square w-full bg-[#FAF6EE] overflow-hidden border-b border-[#B8924A]/20 flex items-center justify-center p-6">
          <Link href={`/gems/${gem.slug}`} className="block w-full h-full relative">
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || `${gem.name} - ${gem.carat} carats`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
            />
          </Link>

          {/* Unheated Natural Seal */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className="inline-block text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#5E0F1E] text-[#FAF6EE] shadow-xs">
              {gem.treatment.toLowerCase().includes("unheated") ? "Unheated" : "Natural"}
            </span>
          </div>

          {/* Certificate Authority */}
          <div className="absolute top-3 right-3 pointer-events-none">
            <span className="inline-block text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#FAF6EE] text-[#5E0F1E] border border-[#B8924A]/40 shadow-xs">
              {gem.certificate.lab}
            </span>
          </div>
        </div>

        {/* Gemstone Specifications */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#B8924A] font-semibold">
            <span>{gem.variety}</span>
            <span className="text-[#1B3A8A] font-bold">{formatCarats(gem.carat)}</span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-medium text-[#5E0F1E] group-hover:text-[#420A15] transition-colors leading-snug">
            <Link href={`/gems/${gem.slug}`} className="hover:underline">
              {gem.name}
            </Link>
          </h3>

          <div className="flex items-center space-x-2 text-[11px] text-[#2B2B2B]/70 pt-1">
            <span>{gem.cut}</span>
            <span>•</span>
            <span>{gem.color}</span>
            <span>•</span>
            <span className="text-emerald-800 font-medium">{gem.origin.split(" ")[0]}</span>
          </div>
        </div>
      </div>

      {/* Pricing & Acquisition Footer */}
      <div className="p-5 pt-0 mt-2">
        <div className="pt-3 border-t border-[#B8924A]/15 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#2B2B2B]/60 block font-medium">
              Net Valuation
            </span>
            <span className="font-serif text-lg font-bold text-[#1B3A8A]">
              {formatCurrency(gem.price, gem.currency)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <AddToCartButton
              gem={gem}
              size="sm"
              variant="outline"
              className="text-xs border-[#B8924A]/50 text-[#5E0F1E] hover:bg-[#5E0F1E] hover:text-[#FAF6EE]"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
