"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const SLIDE_DURATION_MS = 6500;

interface HeroScene {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  tag: string;
  specimen: string;
  panClass: string;
}

const HERO_SCENES: HeroScene[] = [
  {
    id: "modern-ceylon",
    src: "/images/concept03/hero-modern-ceylon.jpg",
    alt: "Fine loose faceted Ceylon Blue Sapphire, Pink Sapphire and Yellow Sapphire staged on white travertine stone blocks",
    title: "Master Faceted Sapphires",
    subtitle: "Natural · Unheated · Certified Ceylon",
    tag: "01 · Ceylon Trio",
    specimen: "Royal Blue, Lotus Pink & Golden Ceylon Sapphires",
    panClass: "animate-hero-pan-1",
  },
  {
    id: "heritage-chest",
    src: "/isuru_images/hero1.jpg",
    alt: "Ceylon royal sapphires and rubies displayed on an antique hand-carved mahogany chest in sunlight",
    title: "Sacred Heritage Salon",
    subtitle: "Ratnapura · Historic Alluvial Gravels Since 1984",
    tag: "02 · Royal Chest",
    specimen: "Ancient Alluvial Sapphires & Deep Ceylon Rubies",
    panClass: "animate-hero-pan-2",
  },
  {
    id: "highland-blues",
    src: "/isuru_images/hero2.jpg",
    alt: "Ceylon royal blue sapphires glistening in dawn light over mist-shrouded highland tea hills",
    title: "Highland Cornflower Blues",
    subtitle: "Sabaragamuwa · Electric Crystalline Brilliance",
    tag: "03 · Highland Blue",
    specimen: "Vivid Cornflower & Royal Blue Sapphires",
    panClass: "animate-hero-pan-3",
  },
  {
    id: "sunset-padparadscha",
    src: "/isuru_images/hero3.jpg",
    alt: "Rare fancy color sapphires and fiery gems catching the sunset at a luxury panoramic salon",
    title: "Twilight Lotus Padparadscha",
    subtitle: "Sunset Fire · Legendary Ceylon King of Sapphires",
    tag: "04 · Padparadscha",
    specimen: "Lotus-Hued Pink & Orange Sapphires",
    panClass: "animate-hero-pan-4",
  },
  {
    id: "collector-parcels",
    src: "/isuru_images/hero4.jpg",
    alt: "Master collection of natural precious sapphires and collector gems overlooking a calm lake and mountains",
    title: "Master Lapidary Parcels",
    subtitle: "Certified Investment Gems · Independent Dossiers",
    tag: "05 · Lapidary Parcels",
    specimen: "NGJA, GRS & GIA Authenticated Parcels",
    panClass: "animate-hero-pan-5",
  },
];

interface FloatingGemPodData {
  id: string;
  name: string;
  carat: string;
  tag: string;
  image: string;
  href: string;
  positionClasses: string;
  animationDelay: string;
}

const FLOATING_PODS: FloatingGemPodData[] = [
  {
    id: "royal-blue",
    name: "Royal Blue Sapphire",
    carat: "4.28 cts",
    tag: "Unheated Ceylon",
    image: "/isuru_images/blue1.jpg",
    href: "/gems?category=blue-sapphires",
    positionClasses: "-top-5 sm:-top-7 -left-3 sm:-left-7",
    animationDelay: "0s",
  },
  {
    id: "padparadscha",
    name: "Lotus Padparadscha",
    carat: "3.15 cts",
    tag: "Rare Collector Specimen",
    image: "/isuru_images/pink1.jpg",
    href: "/gems?category=padparadscha",
    positionClasses: "-bottom-5 sm:-bottom-7 -right-3 sm:-right-7",
    animationDelay: "-3.5s",
  },
];

export function HeroSection() {
  const reduce = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeScene = HERO_SCENES[currentSlide];

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SCENES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SCENES.length) % HERO_SCENES.length);
  }, []);

  // Auto-advance loop when playing, not hovering, and reduced-motion is not requested
  useEffect(() => {
    if (!isPlaying || isHovered || reduce) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SCENES.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, reduce, currentSlide]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === " " && e.target === e.currentTarget) {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] text-[#2B2B2B] pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-24 lg:pb-28">
      {/* Subtle organic light & palm leaf ambient gradients */}
      <div className="absolute top-0 right-0 w-[55vw] h-[55vw] max-w-[850px] max-h-[850px] bg-[radial-gradient(circle,rgba(212,175,103,0.08)_0%,rgba(14,42,32,0.03)_40%,transparent_70%)] pointer-events-none select-none blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[radial-gradient(circle,rgba(184,146,74,0.06)_0%,transparent_70%)] pointer-events-none blur-2xl" />

      <div className="container-luxe relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-center">
          
          {/* Left Column: Editorial Typography & Actions */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-7 sm:space-y-8 relative">
            
            {/* Eyebrow Tag with Fine Gold Line */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex items-center gap-3.5"
            >
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#B8924A] font-semibold">
                Fine Gemstones From Sri Lanka
              </span>
              <div className="h-px w-14 bg-gradient-to-r from-[#B8924A] to-transparent" />
            </motion.div>

            {/* Main Headline - Concept 03: Modern Ceylon */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            >
              <h1 className="font-serif font-normal text-4xl sm:text-5xl lg:text-[3.65rem] xl:text-[4.25rem] text-[#1D1B18] leading-[1.12] tracking-tight">
                Extraordinary Gems.<br />
                <span className="text-[#0E2A20] font-normal italic font-serif">
                  Beautiful Possibilities.
                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
              className="text-base sm:text-lg text-[#554E46] font-light leading-relaxed max-w-xl"
            >
              Direct from the historic gem gravels of Ratnapura, Sri Lanka. Curators of natural, unheated Royal Blue Sapphires, fiery Padparadschas, and certified collector gemstones.
            </motion.p>

            {/* Pill CTA Buttons */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <Link href="/gems" className="modern-pill-primary group">
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF67] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="modern-pill-secondary">
                <span>Enquire Now</span>
              </Link>
            </motion.div>

            {/* Botanical Leaf Vector Flourish */}
            <div className="absolute -bottom-6 right-8 w-28 h-28 pointer-events-none opacity-40 hidden xl:block">
              <svg viewBox="0 0 100 100" fill="none" stroke="#B8924A" strokeWidth="1.2" className="w-full h-full">
                <path d="M10 90 C 20 60, 45 35, 85 15 C 65 35, 50 60, 45 90" />
                <path d="M45 40 C 35 30, 25 35, 20 45 C 30 45, 40 40, 45 40" />
                <path d="M60 28 C 55 18, 45 20, 40 30 C 50 30, 55 28, 60 28" />
                <path d="M30 60 C 20 55, 15 65, 18 75 C 25 70, 30 65, 30 60" />
              </svg>
            </div>

            {/* Credibility Markers */}
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.55 }}
              className="pt-7 border-t border-[#B8924A]/25 grid grid-cols-2 gap-4 sm:gap-6 max-w-md"
            >
              <div>
                <span className="block font-serif text-lg sm:text-xl font-medium text-[#1D1B18]">Est. 1984</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#736B63] block mt-0.5">Ratnapura, Ceylon</span>
              </div>
              <div>
                <span className="block font-serif text-lg sm:text-xl font-medium text-[#1D1B18]">Mine Direct</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#736B63] block mt-0.5">Ethical Traceability</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: High-Jewelry Staged Photography with Floating Gemstones & Hero Gallery */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div
              ref={containerRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="region"
              aria-roledescription="carousel"
              aria-label="Ceylon Gemstones Staged Gallery"
              className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8924A] rounded-2xl"
            >

              {/* Floating Gem Pod 1: Royal Blue Sapphire (Top Left) */}
              <Link
                href={FLOATING_PODS[0].href}
                aria-label={`${FLOATING_PODS[0].name}, ${FLOATING_PODS[0].carat}`}
                className={`hidden sm:flex absolute ${FLOATING_PODS[0].positionClasses} z-30 animate-gem-float group/pod items-center gap-3 bg-[#FAF8F5]/95 backdrop-blur-md border border-[#B8924A]/50 px-3.5 py-2.5 rounded-2xl shadow-[0_12px_30px_rgba(25,20,15,0.16)] transition-all duration-300 hover:scale-105 hover:border-[#B8924A] hover:shadow-[0_16px_36px_rgba(184,146,74,0.3)] cursor-pointer`}
                style={{ animationDelay: FLOATING_PODS[0].animationDelay }}
              >
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#D4AF67] shadow-inner shrink-0 bg-[#0E2A20]">
                  <Image
                    src={FLOATING_PODS[0].image}
                    alt={FLOATING_PODS[0].name}
                    fill
                    sizes="44px"
                    className="object-cover transition-transform duration-500 group-hover/pod:scale-115"
                  />
                  <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-white/90 blur-[0.5px]" />
                </div>
                <div className="text-left pr-1">
                  <div className="text-[9px] uppercase tracking-wider text-[#B8924A] font-semibold">
                    {FLOATING_PODS[0].tag}
                  </div>
                  <div className="font-serif text-xs font-medium text-[#1D1B18] leading-tight">
                    {FLOATING_PODS[0].name}
                  </div>
                  <div className="text-[10px] font-mono text-[#736B63]">
                    {FLOATING_PODS[0].carat}
                  </div>
                </div>
              </Link>

              {/* Floating Gem Pod 2: Lotus Padparadscha (Bottom Right) */}
              <Link
                href={FLOATING_PODS[1].href}
                aria-label={`${FLOATING_PODS[1].name}, ${FLOATING_PODS[1].carat}`}
                className={`hidden sm:flex absolute ${FLOATING_PODS[1].positionClasses} z-30 animate-gem-float group/pod items-center gap-3 bg-[#FAF8F5]/95 backdrop-blur-md border border-[#B8924A]/50 px-3.5 py-2.5 rounded-2xl shadow-[0_12px_30px_rgba(25,20,15,0.16)] transition-all duration-300 hover:scale-105 hover:border-[#B8924A] hover:shadow-[0_16px_36px_rgba(184,146,74,0.3)] cursor-pointer`}
                style={{ animationDelay: FLOATING_PODS[1].animationDelay }}
              >
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#D4AF67] shadow-inner shrink-0 bg-[#0E2A20]">
                  <Image
                    src={FLOATING_PODS[1].image}
                    alt={FLOATING_PODS[1].name}
                    fill
                    sizes="44px"
                    className="object-cover transition-transform duration-500 group-hover/pod:scale-115"
                  />
                  <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-white/90 blur-[0.5px]" />
                </div>
                <div className="text-left pr-1">
                  <div className="text-[9px] uppercase tracking-wider text-[#B8924A] font-semibold">
                    {FLOATING_PODS[1].tag}
                  </div>
                  <div className="font-serif text-xs font-medium text-[#1D1B18] leading-tight">
                    {FLOATING_PODS[1].name}
                  </div>
                  <div className="text-[10px] font-mono text-[#736B63]">
                    {FLOATING_PODS[1].carat}
                  </div>
                </div>
              </Link>

              {/* Main Staged Photography Showcase Frame */}
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: EASE }}
                className="relative rounded-2xl overflow-hidden border border-[#B8924A]/30 bg-[#F4EFEA] shadow-[0_20px_50px_-15px_rgba(25,20,15,0.18)] group"
              >
                {/* Subtle top edge gold highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF67]/70 to-transparent z-20 pointer-events-none" />

                {/* Staged Imagery Stage with Ken Burns Floating Pan Motion */}
                <div className="relative aspect-[16/11] sm:aspect-[16/11] lg:aspect-[16/11] w-full overflow-hidden bg-[#1D1B18]">
                  {HERO_SCENES.map((scene, index) => {
                    const isActive = index === currentSlide;
                    return (
                      <div
                        key={scene.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                          isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                        aria-hidden={!isActive}
                      >
                        <div
                          className={`relative w-full h-full ${
                            isActive && !reduce ? scene.panClass : ""
                          }`}
                        >
                          <Image
                            src={scene.src}
                            alt={scene.alt}
                            fill
                            priority={index === 0}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover object-center"
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Soft bottom vignette for text contrast */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-15 pointer-events-none" />

                  {/* Previous / Next Arrow Controls */}
                  <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous gemstone scene"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF8F5]/85 hover:bg-[#FAF8F5] text-[#1D1B18] border border-[#B8924A]/40 flex items-center justify-center transition-all duration-200 pointer-events-auto shadow-md opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#1D1B18]" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next gemstone scene"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF8F5]/85 hover:bg-[#FAF8F5] text-[#1D1B18] border border-[#B8924A]/40 flex items-center justify-center transition-all duration-200 pointer-events-auto shadow-md opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 text-[#1D1B18]" />
                    </button>
                  </div>
                </div>

                {/* Refined Glassmorphism Badge */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 bg-[#FAF8F5]/92 backdrop-blur-md border border-[#B8924A]/30 p-3.5 sm:p-4 rounded-xl flex items-center justify-between shadow-lg z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0E2A20] text-[#FAF8F5] flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-4 h-4 text-[#D4AF67]" />
                    </div>
                    <div>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeScene.id}
                          initial={reduce ? false : { opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduce ? undefined : { opacity: 0, y: -4 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="font-serif text-sm sm:text-base font-medium text-[#1D1B18] leading-tight">
                            {activeScene.title}
                          </h3>
                          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#736B63] mt-0.5">
                            {activeScene.subtitle}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                  <Link
                    href="/gems"
                    className="inline-flex items-center gap-1.5 text-xs text-[#0E2A20] font-semibold hover:text-[#B8924A] transition-colors shrink-0 ml-2"
                  >
                    <span className="hidden sm:inline">Explore Gems</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>

              {/* Floating Scene Thumbnails Selector (Floating along the bottom of the showcase) */}
              <div className="mt-4 sm:mt-5 p-2.5 sm:p-3 bg-[#FAF8F5]/90 backdrop-blur-md border border-[#B8924A]/30 rounded-xl shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                  {HERO_SCENES.map((scene, idx) => {
                    const isCurrent = idx === currentSlide;
                    return (
                      <button
                        key={scene.id}
                        type="button"
                        onClick={() => goToSlide(idx)}
                        aria-label={`View scene: ${scene.title}`}
                        className={`group/thumb relative rounded-lg overflow-hidden border transition-all duration-300 shrink-0 cursor-pointer ${
                          isCurrent
                            ? "ring-2 ring-[#B8924A] border-transparent scale-105 shadow-[0_4px_12px_rgba(184,146,74,0.35)]"
                            : "border-[#B8924A]/25 opacity-70 hover:opacity-100 hover:border-[#B8924A]/60"
                        }`}
                      >
                        <div className="relative w-12 h-9 sm:w-14 sm:h-10">
                          <Image
                            src={scene.src}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        {isCurrent && (
                          <div className="absolute inset-0 bg-[#B8924A]/10 pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 shrink-0 border-l border-[#B8924A]/25 pl-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying ? "Pause hero rotation" : "Play hero rotation"}
                    className="w-7 h-7 rounded-full border border-[#B8924A]/40 flex items-center justify-center text-[#0E2A20] hover:text-[#B8924A] hover:border-[#B8924A] transition-colors cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    )}
                  </button>
                  <span className="text-[11px] font-mono tracking-wider text-[#736B63]">
                    0{currentSlide + 1} / 0{HERO_SCENES.length}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
