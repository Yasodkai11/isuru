import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Gemstone } from "@/types/gem";
import { formatGemCarats, formatGemPrice, isPriceOnRequest } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

interface GemCardProps {
  gem: Gemstone;
}

export function GemCard({ gem }: GemCardProps) {
  const primaryImage = gem.images[0] || {
    url: "/isuru_images/blue1.webp",
    alt: `Natural Ceylon ${gem.variety} gemstone`,
  };

  return (
    <article className="group bg-[#FAF8F5] border border-[#B8924A]/25 overflow-hidden transition-all duration-400 hover:border-[#B8924A]/70 hover:shadow-[0_14px_30px_rgba(25,20,15,0.08)] flex flex-col justify-between h-full rounded-xl">
      <div>
        {/* Isolated Gemstone Showcase Area */}
        <div className="shine-sweep relative aspect-square w-full bg-[#F4EFEA]/60 overflow-hidden border-b border-[#B8924A]/15 flex items-center justify-center p-4">
          <Link href={`/gems/${gem.slug}`} className="block w-full h-full relative">
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || gem.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain gem-contact-shadow transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </Link>

          {/* Unheated Natural Seal */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className="inline-block text-[9px] uppercase tracking-wider font-semibold px-2.5 py-0.5 bg-[#0E2A20] text-[#FAF8F5] rounded-full shadow-xs">
              {gem.treatment.toLowerCase().includes("unheated") ? "Unheated" : "Natural"}
            </span>
          </div>

          {/* Certificate Authority */}
          {gem.certificate.lab && (
            <div className="absolute top-3 right-3 pointer-events-none">
              <span className="inline-block text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#FAF8F5] text-[#0E2A20] border border-[#B8924A]/40 rounded-full shadow-xs">
                {gem.certificate.lab}
              </span>
            </div>
          )}
        </div>

        {/* Gemstone Specifications */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#B8924A] font-semibold">
            <span>{gem.variety}</span>
            <span className="text-[#0E2A20] font-bold">{formatGemCarats(gem.carat)}</span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1D1B18] group-hover:text-[#0E2A20] transition-colors leading-snug">
            <Link href={`/gems/${gem.slug}`} className="hover:underline">
              {gem.name}
            </Link>
          </h3>

          <div className="flex items-center space-x-2 text-[11px] text-[#736B63] pt-0.5">
            <span>{gem.cut}</span>
            <span>•</span>
            <span>{gem.color}</span>
            <span>•</span>
            <span className="text-[#0E2A20] font-medium">{gem.origin.split(/[\s,]/)[0]}</span>
          </div>
        </div>
      </div>

      {/* Pricing & Acquisition Footer */}
      <div className="p-5 pt-0 mt-2">
        <div className="pt-3 border-t border-[#B8924A]/15 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#736B63] block font-medium">
              Net Valuation
            </span>
            <span className="font-serif text-lg font-bold text-[#0E2A20]">
              {formatGemPrice(gem.price, gem.currency)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isPriceOnRequest(gem.price) ? (
              <Link
                href={`/gems/${gem.slug}#inquiry-section`}
                className="inline-flex items-center border border-[#B8924A]/50 text-[#0E2A20] hover:bg-[#0E2A20] hover:text-[#FAF8F5] text-xs px-3.5 py-1.5 rounded-lg transition-colors font-medium"
              >
                Enquire
              </Link>
            ) : (
              <AddToCartButton
                gem={gem}
                size="sm"
                variant="outline"
                className="text-xs border-[#B8924A]/50 text-[#0E2A20] hover:bg-[#0E2A20] hover:text-[#FAF8F5] rounded-lg"
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
