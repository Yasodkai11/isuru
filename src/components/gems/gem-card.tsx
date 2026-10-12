import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Gemstone } from "@/types/gem";
import { formatCurrency, formatCarats } from "@/lib/utils";
import { CertificationBadge } from "./certification-badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

interface GemCardProps {
  gem: Gemstone;
}

export function GemCard({ gem }: GemCardProps) {
  const primaryImage = gem.images[0] || {
    url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80",
    alt: `Natural Ceylon ${gem.variety} gemstone weighing ${gem.carat} carats`,
  };

  return (
    <article className="group bg-[#FDFBF7] border border-[#B8924A]/25 overflow-hidden transition-subtle hover:border-[#B8924A]/70 hover:shadow-[0_4px_20px_rgba(184,146,74,0.12)] flex flex-col h-full">
      {/* Image Container with Natural Aspect Ratio & Alt Text */}
      <div className="relative aspect-4/3 w-full bg-[#FAF6EE] overflow-hidden border-b border-[#B8924A]/15">
        <Link href={`/gems/${gem.slug}`} className="block w-full h-full relative">
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || `${gem.name} - ${gem.carat} carats from ${gem.origin}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Origin / Treatment Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          <span className="bg-[#5E0F1E]/90 text-[#FAF6EE] text-[9px] uppercase tracking-widest px-2 py-0.5 font-medium shadow-xs">
            {gem.origin.split(" ")[0]}
          </span>
          {gem.treatment.toLowerCase().includes("unheated") && (
            <span className="bg-[#B8924A]/95 text-[#FAF6EE] text-[9px] uppercase tracking-widest px-2 py-0.5 font-medium shadow-xs">
              Natural Unheated
            </span>
          )}
        </div>
      </div>

      {/* Gem Details */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#B8924A] font-semibold">
              {gem.variety}
            </span>
            <CertificationBadge certificate={gem.certificate} />
          </div>

          <h3 className="font-serif text-xl font-medium text-[#5E0F1E] group-hover:text-[#420A15] transition-colors leading-snug">
            <Link href={`/gems/${gem.slug}`}>{gem.name}</Link>
          </h3>

          <div className="flex items-center space-x-3 text-xs text-[#2B2B2B]/70 pt-1">
            <span className="font-medium text-[#2B2B2B]">{formatCarats(gem.carat)}</span>
            <span>•</span>
            <span>{gem.cut}</span>
            <span>•</span>
            <span>{gem.color}</span>
          </div>
        </div>

        {/* Pricing & Acquisition Action */}
        <div className="pt-3 border-t border-[#B8924A]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#2B2B2B]/60 block">
              Investment
            </span>
            <span className="font-serif text-lg font-bold text-[#1B3A8A]">
              {formatCurrency(gem.price, gem.currency)}
            </span>
          </div>

          <AddToCartButton
            gem={gem}
            size="sm"
            variant="outline"
            className="text-xs"
          />
        </div>
      </div>
    </article>
  );
}
