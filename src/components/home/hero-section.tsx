"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { formatCurrency, formatCarats } from "@/lib/utils";

interface FloatingGem {
  id: string;
  name: string;
  variety: string;
  carat: number;
  cut: string;
  color: string;
  treatment: string;
  price: number;
  currency: "USD" | "LKR";
  cert: string;
  image: string;
  slug: string;
  positionDesktop: string;
  animation: string;
  glowColor: string;
  accentColor: string;
  sizeClass: string;
}

const HERO_PERSPECTIVES = [
  {
    url: "/isuru_images/hero1.jpg",
    title: "Ratnapura Gem Tray",
    subtitle: "Raw corundum crystals & cut royal blue sapphires",
  },
  {
    url: "/isuru_images/hero2.jpg",
    title: "Alluvial Pit Recovery",
    subtitle: "Generational wattiya washing baskets & illam gravel",
  },
  {
    url: "/isuru_images/hero3.jpg",
    title: "High-Jewelry Lapidary",
    subtitle: "Master faceting wheel in Sabaragamuwa",
  },
  {
    url: "/isuru_images/hero4.jpg",
    title: "Natural Ceylon Corundum",
    subtitle: "Untreated royal blue & imperial padparadscha specimens",
  },
];

const FLOATING_GEMSTONES: FloatingGem[] = [
  {
    id: "gem-royal-blue",
    name: "Ceylon Royal Blue Cushion",
    variety: "Royal Blue Sapphire",
    carat: 4.28,
    cut: "Cushion Brilliant",
    color: "Vivid Royal Blue",
    treatment: "100% Unheated Natural",
    price: 18500,
    currency: "USD",
    cert: "GRS & NGJA",
    image: "/isuru_images/blue1.jpg",
    slug: "ceylon-royal-blue-sapphire-4-28ct",
    positionDesktop: "top-[6%] right-[28%] md:right-[34%] lg:right-[26%]",
    animation: "animate-float-1",
    glowColor: "rgba(27, 58, 138, 0.65)",
    accentColor: "#2A51B8",
    sizeClass: "w-20 h-20 lg:w-24 lg:h-24",
  },
  {
    id: "gem-padparadscha",
    name: "Lotus Padparadscha Oval",
    variety: "Padparadscha Sapphire",
    carat: 3.15,
    cut: "Oval Mixed Cut",
    color: "Sunset Rose Pink-Orange",
    treatment: "Unheated Natural",
    price: 24000,
    currency: "USD",
    cert: "SSEF & NGJA",
    image: "/isuru_images/pink1.jpg",
    slug: "padparadscha-sapphire-oval-3-15ct",
    positionDesktop: "top-[28%] right-[4%] lg:right-[6%]",
    animation: "animate-float-2",
    glowColor: "rgba(219, 39, 119, 0.6)",
    accentColor: "#E11D48",
    sizeClass: "w-18 h-18 lg:w-22 lg:h-22",
  },
  {
    id: "gem-pushparaga",
    name: "Imperial Pushparaga Emerald Cut",
    variety: "Yellow Sapphire",
    carat: 5.60,
    cut: "Emerald Step Cut",
    color: "Imperial Honey Gold",
    treatment: "Unheated",
    price: 11400,
    currency: "USD",
    cert: "NGJA Certified",
    image: "/isuru_images/yellow.jpg",
    slug: "golden-yellow-sapphire-pushparaga-5-60ct",
    positionDesktop: "bottom-[18%] right-[8%] lg:right-[12%]",
    animation: "animate-float-3",
    glowColor: "rgba(234, 179, 8, 0.6)",
    accentColor: "#D4AF67",
    sizeClass: "w-18 h-18 lg:w-22 lg:h-22",
  },
  {
    id: "gem-green-sapphire",
    name: "Vivid Ceylon Green Sapphire",
    variety: "Green Sapphire",
    carat: 4.10,
    cut: "Oval Mixed Cut",
    color: "Lustrous Emerald Green",
    treatment: "100% Unheated",
    price: 15800,
    currency: "USD",
    cert: "GRS & NGJA",
    image: "/isuru_images/green.jpg",
    slug: "ceylon-vivid-cornflower-oval-4-10ct",
    positionDesktop: "bottom-[10%] right-[32%] lg:right-[32%]",
    animation: "animate-float-4",
    glowColor: "rgba(16, 185, 129, 0.55)",
    accentColor: "#10B981",
    sizeClass: "w-16 h-16 lg:w-20 lg:h-20",
  },
  {
    id: "gem-star-sapphire",
    name: "Asterism Star Sapphire Cabochon",
    variety: "Star Sapphire",
    carat: 6.80,
    cut: "High Dome Cabochon",
    color: "Silvery Denim Blue (6-Ray Star)",
    treatment: "Natural Asterism",
    price: 14800,
    currency: "USD",
    cert: "GIA & NGJA",
    image: "/isuru_images/lightblue.jpg",
    slug: "ceylon-star-sapphire-cabochon-6-80ct",
    positionDesktop: "top-[16%] right-[52%] lg:right-[48%]",
    animation: "animate-float-2",
    glowColor: "rgba(56, 189, 248, 0.55)",
    accentColor: "#38BDF8",
    sizeClass: "w-16 h-16 lg:w-20 lg:h-20",
  },
  {
    id: "gem-ruby",
    name: "Natural Ceylon Ruby Cushion",
    variety: "Ceylon Ruby",
    carat: 2.05,
    cut: "Cushion Brilliant",
    color: "Vibrant Crimson Pink-Red",
    treatment: "Unheated",
    price: 16200,
    currency: "USD",
    cert: "GRS Certified",
    image: "/isuru_images/pink2.jpg",
    slug: "ceylon-ruby-cushion-2-05ct",
    positionDesktop: "bottom-[36%] right-[44%] lg:right-[42%]",
    animation: "animate-float-1",
    glowColor: "rgba(225, 29, 72, 0.6)",
    accentColor: "#BE123C",
    sizeClass: "w-16 h-16 lg:w-20 lg:h-20",
  },
];

export function HeroSection() {
  const [activePerspectiveIndex, setActivePerspectiveIndex] = useState(0);
  const [selectedGemId, setSelectedGemId] = useState<string>("gem-royal-blue");
  const [hoveredGemId, setHoveredGemId] = useState<string | null>(null);

  const activePerspective = HERO_PERSPECTIVES[activePerspectiveIndex];
  const activeGem =
    FLOATING_GEMSTONES.find((g) => g.id === (hoveredGemId || selectedGemId)) ||
    FLOATING_GEMSTONES[0];

  return (
    <section className="relative min-h-[680px] lg:min-h-[760px] bg-[#120F0D] text-[#FAF6EE] overflow-hidden border-b border-[#B8924A]/35">
      {/* Dynamic Background Photography with Editorial Scrim */}
      <div className="absolute inset-0 z-0">
        <Image
          src={activePerspective.url}
          alt={activePerspective.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-all duration-1000 scale-102"
        />
        {/* Multi-layered luxury scrim: high readability on left, atmospheric reveal on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#120F0D] via-[#120F0D]/85 to-[#120F0D]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-transparent to-black/50" />
        {/* Subtle warm ambient radial highlight */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#B8924A]/10 blur-[120px] pointer-events-none" />
      </div>

      {/* Floating Gemstones Layer (Desktop & Tablet) */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
        <div className="relative w-full h-full max-w-7xl mx-auto px-4">
          {FLOATING_GEMSTONES.map((gem) => {
            const isSelected = activeGem.id === gem.id;
            const isHovered = hoveredGemId === gem.id;

            return (
              <div
                key={gem.id}
                className={`absolute ${gem.positionDesktop} ${gem.animation} pointer-events-auto transition-transform duration-400 z-20`}
                style={{
                  transform: isSelected || isHovered ? "scale(1.15)" : undefined,
                }}
                onMouseEnter={() => setHoveredGemId(gem.id)}
                onMouseLeave={() => setHoveredGemId(null)}
                onClick={() => setSelectedGemId(gem.id)}
              >
                <div className="group relative cursor-pointer">
                  {/* Outer Pulsing Jewel Glow Halo */}
                  <div
                    className="absolute -inset-3 rounded-full blur-xl transition-all duration-500 opacity-60 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle, ${gem.glowColor} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Concentric Rotating Gold Rings on Selected State */}
                  {isSelected && (
                    <div className="absolute -inset-2 rounded-full border border-[#D4AF67]/60 animate-gem-halo pointer-events-none" />
                  )}

                  {/* Jewel Bezel Pod Container */}
                  <div
                    className={`relative ${gem.sizeClass} rounded-full overflow-hidden p-1 bg-[#1E1813]/90 backdrop-blur-md border transition-all duration-400 ${
                      isSelected
                        ? "border-[#D4AF67] shadow-[0_0_30px_rgba(212,175,103,0.8)] scale-105"
                        : "border-[#B8924A]/50 hover:border-[#D4AF67] hover:shadow-[0_0_20px_rgba(212,175,103,0.5)]"
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-[#120F0D]">
                      <Image
                        src={gem.image}
                        alt={gem.name}
                        fill
                        sizes="100px"
                        className="object-cover p-0.5 transition-transform duration-700 group-hover:scale-120"
                      />
                    </div>

                    {/* Specular Diamond Star Sparkle */}
                    <div className="absolute top-1.5 right-2 w-2.5 h-2.5 rounded-full bg-white/90 blur-[1px] animate-pulse pointer-events-none" />
                  </div>

                  {/* Floating Micro-Badge */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#120F0D]/95 border border-[#B8924A]/70 px-2 py-0.5 rounded-full shadow-lg text-[9px] font-mono text-[#D4AF67] tracking-wider pointer-events-none flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#D4AF67] animate-ping" />
                    <span>{formatCarats(gem.carat)}</span>
                  </div>

                  {/* Floating Interactive Hover Tooltip */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 p-3 rounded-xs bg-[#1A1410]/95 backdrop-blur-md border border-[#B8924A]/70 text-left whitespace-nowrap shadow-2xl transition-all duration-300 min-w-[210px] z-30 ${
                      isHovered
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-[#B8924A] font-semibold border-b border-[#B8924A]/25 pb-1 mb-1.5">
                      <span>{gem.variety}</span>
                      <span className="text-[#FAF6EE]/80">{gem.cert}</span>
                    </div>
                    <div className="font-serif text-sm text-[#FAF6EE] font-medium leading-tight mb-1">
                      {gem.name}
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[#FAF6EE]/75 font-mono text-[11px]">
                        {gem.cut} • {gem.treatment}
                      </span>
                      <span className="font-serif font-bold text-[#D4AF67]">
                        {formatCurrency(gem.price, gem.currency)}
                      </span>
                    </div>
                    <Link
                      href={`/gems/${gem.slug}`}
                      className="mt-2.5 flex items-center justify-center gap-1.5 w-full bg-[#5E0F1E] hover:bg-[#7E1529] text-[#FAF6EE] text-[10px] uppercase tracking-widest py-1.5 font-medium transition-colors border border-[#B8924A]/40"
                    >
                      <span>Inspect Specimen</span>
                      <ArrowRight className="w-3 h-3 text-[#D4AF67]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 min-h-[680px] lg:min-h-[760px] flex flex-col justify-between">
        {/* Top/Center Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
          {/* Left Column: Brand Typography & Direct CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 animate-gentle-fade max-w-2xl">
            {/* Traditional Sri Lankan Emblem Kicker */}
            <div className="inline-flex items-center gap-2.5 text-[#B8924A] text-[11px] sm:text-xs uppercase tracking-[0.28em] font-medium">
              <span className="w-5 h-[1px] bg-[#B8924A]" />
              <span>A Traditional Sri Lankan Design</span>
              <span className="w-5 h-[1px] bg-[#B8924A]" />
            </div>

            {/* Headline: "The Timeless Beauty of Ceylon." */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#FAF6EE] font-normal leading-[1.08] tracking-tight">
              The Timeless Beauty of Ceylon.
            </h1>

            {/* Traditional Gold Ornamental Divider */}
            <div className="flex items-center gap-3 max-w-md py-1">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#B8924A] via-[#D4AF67] to-transparent" />
              <div className="flex items-center gap-1.5 text-[#D4AF67]">
                <span className="w-1.5 h-1.5 rotate-45 bg-[#B8924A]" />
                <span className="w-2.5 h-2.5 rotate-45 border border-[#D4AF67] bg-[#120F0D]" />
                <span className="w-1.5 h-1.5 rotate-45 bg-[#B8924A]" />
              </div>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-[#B8924A] via-[#D4AF67] to-transparent" />
            </div>

            {/* Subheading / Description */}
            <p className="text-sm sm:text-base text-[#FAF6EE]/85 font-normal leading-relaxed max-w-xl">
              Ethically recovered, natural unheated Ceylon Royal Blue Sapphires, Padparadschas, and precious island crystals direct from the historic gem gravels of Ratnapura since 1984.
            </p>

            {/* Dual CTAs Matching Proposal Mockup */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              {/* Primary Maroon CTA */}
              <Link href="/gems" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#5E0F1E] hover:bg-[#7E1529] text-[#FAF6EE] border border-[#B8924A]/60 px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(94,15,30,0.7)] cursor-pointer">
                  <span>Explore Gemstones</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF67]" />
                </button>
              </Link>

              {/* Secondary Translucent Gold CTA */}
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A1410]/70 hover:bg-[#1A1410]/95 text-[#FAF6EE] border border-[#B8924A]/70 px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:border-[#D4AF67] hover:text-[#D4AF67] backdrop-blur-sm cursor-pointer">
                  <span>Enquire Now</span>
                </button>
              </Link>
            </div>

            {/* Heritage Trust Badges Matrix */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#B8924A]/25 text-xs">
              <div className="space-y-0.5">
                <span className="font-serif text-lg font-bold text-[#D4AF67] block">1984</span>
                <span className="text-[10px] uppercase tracking-wider text-[#FAF6EE]/70">Family Heritage</span>
              </div>
              <div className="space-y-0.5">
                <span className="font-serif text-lg font-bold text-[#D4AF67] block">100%</span>
                <span className="text-[10px] uppercase tracking-wider text-[#FAF6EE]/70">Natural & Unheated</span>
              </div>
              <div className="space-y-0.5">
                <span className="font-serif text-lg font-bold text-[#D4AF67] block">NGJA</span>
                <span className="text-[10px] uppercase tracking-wider text-[#FAF6EE]/70">Govt. Licensed</span>
              </div>
              <div className="space-y-0.5">
                <span className="font-serif text-lg font-bold text-[#D4AF67] block">Ratnapura</span>
                <span className="text-[10px] uppercase tracking-wider text-[#FAF6EE]/70">Single Mine Origin</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Floating Specimen Stage Spotlight (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center relative">
            {/* Centerpiece Spotlight Pedestal */}
            <div className="relative w-72 h-72 xl:w-80 xl:h-80 rounded-full flex items-center justify-center">
              {/* Pulsing Backlight */}
              <div
                className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 opacity-70"
                style={{
                  background: `radial-gradient(circle, ${activeGem.glowColor} 0%, transparent 70%)`,
                }}
              />

              {/* Concentric Gold Orbit Rings */}
              <div className="absolute inset-0 rounded-full border border-[#B8924A]/30 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-4 rounded-full border border-dashed border-[#D4AF67]/25 pointer-events-none" />

              {/* Active Hero Floating Gem Preview Card */}
              <div className="relative z-10 w-64 p-5 bg-[#1A1410]/90 backdrop-blur-md border border-[#B8924A]/60 shadow-[0_12px_40px_rgba(0,0,0,0.6)] text-center animate-gentle-fade space-y-3">
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border border-[#D4AF67] bg-[#120F0D] shadow-[0_0_20px_rgba(212,175,103,0.4)]">
                  <Image
                    src={activeGem.image}
                    alt={activeGem.name}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-500 hover:scale-115"
                  />
                  <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-white/80 blur-[1px] animate-pulse" />
                </div>

                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#B8924A] font-semibold">
                    Featured Floating Specimen
                  </div>
                  <h3 className="font-serif text-lg text-[#FAF6EE] font-medium leading-snug">
                    {activeGem.name}
                  </h3>
                  <div className="text-xs text-[#FAF6EE]/70 font-mono mt-0.5">
                    {formatCarats(activeGem.carat)} • {activeGem.cert}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#B8924A]/25 flex items-center justify-between">
                  <span className="font-serif text-base font-bold text-[#D4AF67]">
                    {formatCurrency(activeGem.price, activeGem.currency)}
                  </span>
                  <Link
                    href={`/gems/${activeGem.slug}`}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#FAF6EE] bg-[#5E0F1E] hover:bg-[#7E1529] px-3 py-1.5 font-semibold transition-colors border border-[#B8924A]/40"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3 h-3 text-[#D4AF67]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Floating Gemstones Carousel Bar */}
        <div className="block md:hidden pt-8 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-[#B8924A] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#D4AF67]" />
              <span>Tap to Inspect Floating Gems:</span>
            </span>
            <span className="text-[10px] text-[#FAF6EE]/60 font-mono">
              {FLOATING_GEMSTONES.length} Rare Lots
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {FLOATING_GEMSTONES.map((gem) => {
              const isSelected = activeGem.id === gem.id;
              return (
                <button
                  key={gem.id}
                  onClick={() => setSelectedGemId(gem.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 shrink-0 bg-[#1A1410]/85 border transition-all rounded-xs ${
                    isSelected
                      ? "border-[#D4AF67] shadow-[0_0_15px_rgba(212,175,103,0.4)]"
                      : "border-[#B8924A]/30"
                  }`}
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#B8924A]/40 bg-[#120F0D]">
                    <Image src={gem.image} alt={gem.name} fill className="object-cover" sizes="32px" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-serif text-[#FAF6EE] block font-medium leading-tight whitespace-nowrap">
                      {gem.name.split(" ")[0]} {gem.name.split(" ")[1]}
                    </span>
                    <span className="text-[9px] text-[#D4AF67] font-mono block">
                      {formatCarats(gem.carat)} • {formatCurrency(gem.price, gem.currency)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Control Bar: Perspective Selector & Gemstone Explorer Count */}
        <div className="pt-6 border-t border-[#B8924A]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#FAF6EE]/80">
            <span className="text-[10px] uppercase tracking-widest text-[#B8924A] font-semibold">
              Authentic Mining Archives:
            </span>
            <span className="italic text-[#FAF6EE]/90">{activePerspective.title}</span>
            <span className="hidden md:inline text-[#FAF6EE]/50">•</span>
            <span className="hidden md:inline text-[11px] text-[#FAF6EE]/60">
              {activePerspective.subtitle}
            </span>
          </div>

          {/* Perspective Thumbnails */}
          <div className="flex items-center gap-2">
            {HERO_PERSPECTIVES.map((persp, idx) => (
              <button
                key={persp.url}
                onClick={() => setActivePerspectiveIndex(idx)}
                className={`relative w-12 h-8 overflow-hidden border transition-all cursor-pointer ${
                  activePerspectiveIndex === idx
                    ? "border-[#D4AF67] scale-105 shadow-[0_0_12px_rgba(212,175,103,0.6)]"
                    : "border-white/20 opacity-50 hover:opacity-90"
                }`}
                title={persp.title}
              >
                <Image
                  src={persp.url}
                  alt={persp.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
