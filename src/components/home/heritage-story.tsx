import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GoldDivider } from "@/components/layout/gold-divider";

export function HeritageStory() {
  return (
    <section className="py-20 lg:py-24 bg-[#FDFBF7] border-y border-[#B8924A]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image Composition featuring authentic pit mining & lapidary */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative aspect-4/5 max-w-md mx-auto border border-[#B8924A]/40 p-2.5 bg-[#FAF6EE] shadow-xl">
              <div className="relative w-full h-full bg-[#1A1410] overflow-hidden">
                <Image
                  src="/isuru_images/crown.jpg"
                  alt="Artisanal gemstone pit washing and recovery in Ratnapura Sri Lanka showing illam gravel and wattiya baskets"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Overlapping Lapidary Inset */}
            <div className="hidden sm:block absolute -bottom-8 -right-4 bg-[#1E1813] text-[#FAF6EE] p-4 border border-[#B8924A]/60 max-w-xs shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 shrink-0 rounded-xs overflow-hidden border border-[#D4AF67]/60">
                  <Image
                    src="/isuru_images/master.jpg"
                    alt="Master Ceylon gem cutter faceting a royal sapphire"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#D4AF67] font-semibold block">
                    Generational Lapidary
                  </span>
                  <p className="font-serif text-xs italic text-[#FAF6EE]/90 mt-0.5 leading-snug">
                    Classical proportions cut by hand to maximize optical fire and internal light life.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Story Text */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold block">
              The Legend of Ratnapura
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#5E0F1E] font-normal leading-tight">
              An Island Blessed with the World’s Oldest Sapphire Heritage
            </h2>

            <p className="text-sm sm:text-base text-[#2B2B2B]/80 leading-relaxed font-normal">
              Known throughout antiquity as <em className="text-[#5E0F1E] font-medium not-italic">Ratna-Dweepa</em> (The Island of Gems), Sri Lanka has adorned royal crowns for millennia. From King Solomon wooing the Queen of Sheba with Ceylon rubies to the iconic 12-carat oval Ceylon sapphire gracing the British Royal Family, our island’s stones represent the eternal benchmark of regal beauty.
            </p>

            <p className="text-sm sm:text-base text-[#2B2B2B]/80 leading-relaxed font-normal">
              At Isuru Gems, our family traces four decades of direct relationships with master pit miners in Ratnapura, Pelmadulla, and Elahera. We source rough stones at source, cut them according to classical proportions to maintain maximum optical clarity, and preserve every stone’s natural, unheated integrity whenever possible.
            </p>

            <GoldDivider className="my-6 max-w-xs" />

            <div className="pt-2 flex flex-wrap items-center gap-6">
              <Link
                href="/about"
                className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-[#FAF6EE] bg-[#5E0F1E] hover:bg-[#7E1529] px-6 py-3 font-semibold transition-colors border border-[#B8924A]/50 gap-2 shadow-md"
              >
                <span>Read The Full Island Chronicle</span>
                <span>→</span>
              </Link>

              <Link
                href="/wholesale"
                className="text-xs uppercase tracking-[0.2em] text-[#5E0F1E] hover:text-[#B8924A] font-semibold transition-colors border-b border-[#B8924A]/40 pb-0.5"
              >
                Wholesale Gemstone Parcels →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
