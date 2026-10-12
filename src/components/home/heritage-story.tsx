import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GoldDivider } from "@/components/layout/gold-divider";

export function HeritageStory() {
  return (
    <section className="py-20 bg-[#FDFBF7] border-y border-[#B8924A]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image composition with alt text */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative aspect-3/4 max-w-md mx-auto border border-[#B8924A]/30 p-2 bg-[#FAF6EE] shadow-lg">
              <div className="relative w-full h-full">
                <Image
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80"
                  alt="Traditional gemstone sorting and evaluation in Ratnapura Sri Lanka showing natural raw crystals"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            </div>
            {/* Small decorative accent */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-[#5E0F1E] text-[#FAF6EE] p-5 border border-[#B8924A]/50 max-w-xs shadow-md">
              <span className="text-[10px] uppercase tracking-widest text-[#B8924A] font-semibold block">
                Sustainable Craft
              </span>
              <p className="font-serif text-sm italic mt-1 text-[#FAF6EE]/90">
                &ldquo;No heavy excavation machinery. Pure artisanal pit mining preserving our island soil for future generations.&rdquo;
              </p>
            </div>
          </div>

          {/* Story Text */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold block">
              The Legend of Ratnapura
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-normal leading-tight">
              An Island Blessed with the World’s Oldest Sapphire Heritage
            </h2>

            <p className="text-sm text-[#2B2B2B]/80 leading-relaxed">
              Known throughout antiquity as <em className="text-[#5E0F1E] font-medium not-italic">Ratna-Dweepa</em> (The Island of Gems), Sri Lanka has adorned royal crowns for millennia. From King Solomon wooing the Queen of Sheba with Ceylon rubies to the iconic 12-carat oval Ceylon sapphire gracing the British Royal Family, our island’s stones represent the eternal benchmark of regal beauty.
            </p>

            <p className="text-sm text-[#2B2B2B]/80 leading-relaxed">
              At Isuru Gems, our family traces four decades of direct relationships with master pit miners in Ratnapura, Pelmadulla, and Elahera. We source rough stones at source, cut them according to classical proportions to maintain maximum optical clarity, and preserve every stone’s natural, unheated integrity whenever possible.
            </p>

            <GoldDivider className="my-6 max-w-xs" />

            <div>
              <Link
                href="/about"
                className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-[#5E0F1E] font-semibold hover:text-[#B8924A] transition-colors gap-2"
              >
                <span>Read The Full Island Chronicle</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
