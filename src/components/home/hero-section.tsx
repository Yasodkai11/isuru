"use client";

import React, { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}


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
    src: "/images/concept03/hero-modern-ceylon.webp",
    alt: "Natural unheated Ceylon royal blue sapphire, lotus pink sapphire, and golden sapphire specimens, master faceted, from Ratnapura, Sri Lanka",
    title: "Master Faceted Sapphires",
    subtitle: "Natural · Unheated · Certified Ceylon",
    tag: "01 · Ceylon Trio",
    specimen: "Royal Blue, Lotus Pink & Golden Ceylon Sapphires",
    panClass: "animate-hero-pan-1",
  },
  {
    id: "heritage-chest",
    src: "/isuru_images/hero1.webp",
    alt: "Natural unheated Ceylon royal blue sapphires and scarlet rubies displayed on antique carved mahogany chest in Ratnapura atelier",
    title: "Sacred Heritage Atelier",
    subtitle: "Ratnapura · Historic Alluvial Gravels Since 1964",
    tag: "02 · Royal Chest",
    specimen: "Ancient Alluvial Sapphires & Deep Ceylon Rubies",
    panClass: "animate-hero-pan-2",
  },
  {
    id: "highland-blues",
    src: "/isuru_images/hero2.webp",
    alt: "Natural unheated Ceylon cornflower blue and royal blue sapphires glistening over mist-shrouded Sabaragamuwa gem hills, Sri Lanka",
    title: "Highland Cornflower Blues",
    subtitle: "Sabaragamuwa · Electric Crystalline Brilliance",
    tag: "03 · Highland Blue",
    specimen: "Vivid Cornflower & Royal Blue Sapphires",
    panClass: "animate-hero-pan-3",
  },
  {
    id: "sunset-padparadscha",
    src: "/isuru_images/hero3.webp",
    alt: "Rare natural unheated Ceylon Padparadscha sapphire and sunset-fire corundum crystals from Ratnapura alluvial gravels",
    title: "Twilight Lotus Padparadscha",
    subtitle: "Sunset Fire · Legendary Ceylon King of Sapphires",
    tag: "04 · Padparadscha",
    specimen: "Lotus-Hued Pink & Orange Sapphires",
    panClass: "animate-hero-pan-4",
  },
  {
    id: "collector-parcels",
    src: "/isuru_images/hero4.webp",
    alt: "Master collection parcels of natural unheated Ceylon sapphires with independent NGJA, GIA, and GRS authentication dossiers",
    title: "Master Lapidary Parcels",
    subtitle: "Certified Investment Gems · Independent Dossiers",
    tag: "05 · Lapidary Parcels",
    specimen: "NGJA, GRS & GIA Authenticated Parcels",
    panClass: "animate-hero-pan-5",
  },
];



export function HeroSection() {
  const reduce = usePrefersReducedMotion();
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
    <section
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Ceylon Gemstones Showcase"
      className="relative w-full overflow-hidden bg-[#071510] text-[#FAF6EE] min-h-[640px] lg:h-[calc(100vh-116px)] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF67]"
    >
      {/* Full-Bleed Edge-to-Edge Hero Image Slider */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {HERO_SCENES.map((scene, index) => {
          const isActive = index === currentSlide;
          const isNext = index === (currentSlide + 1) % HERO_SCENES.length;
          const shouldRenderImage = index === 0 || isActive || isNext;

          return (
            <div
              key={scene.id}
              className={`absolute inset-0 transition-opacity duration-300 ease-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              style={{ transitionDuration: "0.3s", transitionTimingFunction: "ease-out" }}
              aria-hidden={!isActive}
            >
              <div
                className={`relative w-full h-full ${
                  isActive && !reduce ? scene.panClass : ""
                }`}
              >
                {shouldRenderImage && (
                  <Image
                    src={scene.src}
                    alt={scene.alt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Soft Gradient Overlay: Dark green/black on left fading to transparent on right */}
      <div
        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#071510]/95 via-[#071510]/80 to-[#071510]/60 lg:bg-gradient-to-r lg:from-[#071510]/90 lg:via-[#0A1A14]/70 lg:via-50% lg:to-transparent"
        aria-hidden="true"
      />
      {/* Secondary bottom vignette to ensure complete legibility for controls and badges */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 lg:h-36 bg-gradient-to-t from-[#071510]/85 via-[#071510]/35 to-transparent z-10 pointer-events-none"
        aria-hidden="true"
      />


      {/* Previous / Next Arrow Controls (Sides) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous gemstone scene"
        className="flex absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-black/40 hover:bg-black/75 text-[#FAF6EE] border border-white/25 hover:border-[#D4AF67] items-center justify-center transition-all duration-200 backdrop-blur-md shadow-xl opacity-75 hover:opacity-100 hover:scale-105 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#FAF6EE]" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next gemstone scene"
        className="flex absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-black/40 hover:bg-black/75 text-[#FAF6EE] border border-white/25 hover:border-[#D4AF67] items-center justify-center transition-all duration-200 backdrop-blur-md shadow-xl opacity-75 hover:opacity-100 hover:scale-105 cursor-pointer"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#FAF6EE]" />
      </button>

      {/* Left Column: Hero Text Layered Over Image */}
      <div className="container-luxe relative z-20 w-full py-16 sm:py-20 lg:py-0">
        <div className="max-w-[580px] space-y-6 sm:space-y-7 relative">
          
          {/* Eyebrow Tag with Fine Gold Line */}
          <div className="flex items-center gap-3.5 animate-hero-fade-up">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#D4AF67] font-semibold">
              Fine Gemstones From Sri Lanka
            </span>
            <div className="h-px w-14 bg-gradient-to-r from-[#D4AF67] to-transparent" />
          </div>

          {/* Main Headline */}
          <div className="animate-hero-fade-up [animation-delay:100ms]">
            <h1 className="font-serif font-normal text-4xl sm:text-5xl lg:text-[3.65rem] xl:text-[4.25rem] text-[#FAF6EE] leading-[1.12] tracking-tight">
              Extraordinary Gems.<br />
              <span className="text-[#D4AF67] font-normal not-italic font-serif">
                Beautiful Possibilities.
              </span>
            </h1>
          </div>

          {/* Subtext Paragraph */}
          <p className="font-serif font-normal text-[18px] sm:text-[19px] lg:text-[20px] text-[#FAF6EE]/90 leading-[1.7] max-w-[560px] animate-hero-fade-up [animation-delay:200ms]">
            Direct from the historic gem gravels of Ratnapura, Sri Lanka. Curators of natural, unheated Royal Blue Sapphires, fiery Padparadschas, and certified collector gemstones.
          </p>

          {/* Pill CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1 animate-hero-fade-up [animation-delay:300ms]">
            <Link
              href="/gems"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#B8924A] hover:bg-[#D4AF67] text-[#0A1A14] px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(184,146,74,0.45)] hover:translate-y-[-2px] group cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 text-[#0A1A14] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF6EE] border border-white/25 hover:border-[#D4AF67] backdrop-blur-md px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-medium transition-all duration-300 hover:translate-y-[-2px] cursor-pointer"
            >
              <span>Enquire Now</span>
            </Link>
          </div>

          {/* Botanical Leaf Vector Flourish */}
          <div className="absolute -bottom-6 right-4 w-28 h-28 pointer-events-none opacity-20 hidden xl:block">
            <svg viewBox="0 0 100 100" fill="none" stroke="#D4AF67" strokeWidth="1.2" className="w-full h-full">
              <path d="M10 90 C 20 60, 45 35, 85 15 C 65 35, 50 60, 45 90" />
              <path d="M45 40 C 35 30, 25 35, 20 45 C 30 45, 40 40, 45 40" />
              <path d="M60 28 C 55 18, 45 20, 40 30 C 50 30, 55 28, 60 28" />
              <path d="M30 60 C 20 55, 15 65, 18 75 C 25 70, 30 65, 30 60" />
            </svg>
          </div>

          {/* Credibility Markers */}
          <div className="pt-6 sm:pt-7 border-t border-[#FAF6EE]/20 grid grid-cols-2 gap-4 sm:gap-6 max-w-md animate-hero-fade-up [animation-delay:400ms]">
            <div>
              <span className="block font-serif text-lg sm:text-xl font-medium text-[#FAF6EE]">Est. 1964</span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#FAF6EE]/70 block mt-0.5">Ratnapura, Ceylon</span>
            </div>
            <div>
              <span className="block font-serif text-lg sm:text-xl font-medium text-[#FAF6EE]">Mine Direct</span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#FAF6EE]/70 block mt-0.5">Ethical Traceability</span>
            </div>
          </div>
        </div>
      </div>


      {/* Floating Scene Thumbnails Selector (Bottom Right) */}
      <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-6 lg:right-12 xl:right-16 z-20 p-2 sm:p-2.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl flex items-center justify-between gap-3 max-w-[calc(100vw-2rem)]">
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          {HERO_SCENES.map((scene, idx) => {
            const isCurrent = idx === currentSlide;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`View scene: ${scene.title}`}
                className={`group/thumb relative rounded-lg overflow-hidden border transition-all duration-300 ease-out shrink-0 cursor-pointer ${
                  isCurrent
                    ? "ring-2 ring-[#D4AF67] border-transparent scale-105 shadow-[0_4px_12px_rgba(212,175,103,0.4)]"
                    : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/50"
                }`}
                style={{ transitionDuration: "0.3s", transitionTimingFunction: "ease-out" }}
              >
                <div className="relative w-11 h-8 sm:w-13 sm:h-9">
                  <Image
                    src={scene.src}
                    alt=""
                    fill
                    sizes="52px"
                    loading="lazy"
                    className="object-cover transition-transform duration-300 ease-out group-hover/thumb:scale-110"
                    style={{ transitionDuration: "0.3s", transitionTimingFunction: "ease-out" }}
                  />
                </div>
                {isCurrent && (
                  <div className="absolute inset-0 bg-[#D4AF67]/15 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Compact active scene label for mobile where thumbnails are hidden */}
        <div className="sm:hidden px-2 text-xs font-serif text-[#FAF6EE] truncate max-w-[160px]">
          {activeScene.title}
        </div>

        <div className="flex items-center gap-2 shrink-0 sm:border-l sm:border-white/20 sm:pl-3">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "Pause hero rotation" : "Play hero rotation"}
            className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center text-[#FAF6EE] hover:text-[#D4AF67] hover:border-[#D4AF67] transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>
          <span className="text-[11px] font-mono tracking-wider text-[#FAF6EE]/80">
            0{currentSlide + 1} / 0{HERO_SCENES.length}
          </span>
        </div>
      </div>

    </section>
  );
}
