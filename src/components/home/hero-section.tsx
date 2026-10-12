import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GoldDivider } from "@/components/layout/gold-divider";
import { ArrowRight, Sparkles, Shield, Award, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative bg-[#FAF6EE] pt-12 pb-20 md:py-24 overflow-hidden border-b border-[#B8924A]/25">
      {/* Subtle background ambient luxury glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B8924A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#5E0F1E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Narrative */}
          <div className="lg:col-span-7 space-y-6 animate-gentle-fade">
            <div className="inline-flex items-center gap-2">
              <Badge variant="gold" className="text-[10px] tracking-[0.25em] py-1.5 px-3">
                <Sparkles className="w-3.5 h-3.5 text-[#B8924A] mr-1.5 inline" />
                Pure Serendib Provenance • Est. 1984
              </Badge>
            </div>

            {/* Exactly the requested hero headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#5E0F1E] font-normal leading-[1.12] tracking-tight">
              The Timeless Beauty of Ceylon
            </h1>

            <p className="text-base sm:text-lg text-[#2B2B2B]/80 font-normal leading-relaxed max-w-2xl">
              Rare, unheated sapphires and investment-grade gems curated directly from the storied alluvial gravels of Ratnapura, Sri Lanka. Each singular treasure is ethically recovered, precision-cut, and authenticated with rigorous NGJA, GIA, and GRS reports.
            </p>

            <GoldDivider className="my-6 max-w-md" />

            {/* CTAs using the Button UI Component */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/gems">
                <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                  <span>Explore Gemstones</span>
                  <ArrowRight className="w-4 h-4 text-[#B8924A]" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Private Concierge & Sourcing
                </Button>
              </Link>
            </div>

            {/* Heritage Trust Badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#B8924A]/20">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#B8924A]">
                  <Award className="w-4 h-4" />
                  <span className="font-serif text-xl sm:text-2xl text-[#1B3A8A] font-semibold">1984</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#2B2B2B]/70 block font-medium">
                  Family Heritage
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#B8924A]">
                  <Gem className="w-4 h-4" />
                  <span className="font-serif text-xl sm:text-2xl text-[#1B3A8A] font-semibold">100%</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#2B2B2B]/70 block font-medium">
                  Natural & Unheated
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#B8924A]">
                  <Shield className="w-4 h-4" />
                  <span className="font-serif text-xl sm:text-2xl text-[#1B3A8A] font-semibold">NGJA</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#2B2B2B]/70 block font-medium">
                  Govt. Licensed
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#B8924A]">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-serif text-xl sm:text-2xl text-[#1B3A8A] font-semibold">Ratnapura</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#2B2B2B]/70 block font-medium">
                  Single Origin Pit
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative antique gold frame */}
              <div className="absolute -inset-3.5 border border-[#B8924A]/40 -rotate-1 pointer-events-none transition-transform duration-700 hover:rotate-0" />
              <div className="absolute -inset-1 border border-[#B8924A]/25 rotate-1 pointer-events-none" />

              <div className="relative aspect-4/5 bg-[#F2EADB] overflow-hidden border border-[#B8924A]/50 shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85"
                  alt="A rare museum grade unheated Ceylon Royal Blue Sapphire refracting intense azure light"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-[#2B2B2B]/70 via-transparent to-transparent pointer-events-none" />

                {/* Floating Specimen Badge */}
                <div className="absolute bottom-5 left-5 right-5 bg-[#FAF6EE]/95 backdrop-blur-md border border-[#B8924A]/50 p-4 shadow-lg transition-subtle">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="unheated" className="text-[9px] py-0.5 px-2">
                          Unheated Natural
                        </Badge>
                        <Badge variant="gold" className="text-[9px] py-0.5 px-2">
                          GRS & NGJA Certified
                        </Badge>
                      </div>
                      <span className="font-serif text-base sm:text-lg text-[#5E0F1E] font-medium block">
                        Royal Blue Cushion Sapphire • 4.28 cts
                      </span>
                      <span className="text-[11px] text-[#2B2B2B]/70">
                        Ratnapura Alluvial Bed • Eye Clean VVS1
                      </span>
                    </div>
                    <Link
                      href="/gems/ceylon-royal-blue-sapphire-4-28ct"
                      className="text-xs uppercase tracking-wider text-[#5E0F1E] hover:text-[#B8924A] font-semibold border-b border-[#B8924A] pb-0.5 ml-3 shrink-0"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
