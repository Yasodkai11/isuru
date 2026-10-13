"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Pause, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface HeroSlide {
  id: number;
  src: string;
  alt: string;
  tag: string;
  scenery: string;
  headlineAccent: string;
  subtext: string;
  highlightBadge: string;
  panClass: string;
  objectPosition: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    src: "/isuru_images/hero1.jpg",
    alt: "Ceylon royal sapphires and rubies displayed on an antique hand-carved mahogany chest in sunlight",
    tag: "Sacred Heritage Salon",
    scenery: "Ratnapura · Royal Chest",
    headlineAccent: "Sacred Gems of Antiquity",
    subtext: "Natural, unheated sapphires and rubies directly curated from the ancient alluvial mines of Ratnapura.",
    highlightBadge: "Royal Sapphires & Rubies",
    panClass: "animate-hero-pan-1",
    objectPosition: "object-[65%_center]",
  },
  {
    id: 2,
    src: "/isuru_images/hero2.jpg",
    alt: "Ceylon royal blue sapphires glistening in dawn light over mist-shrouded highland tea hills",
    tag: "Highland Cornflower Blues",
    scenery: "Sabaragamuwa · Mountain Mist",
    headlineAccent: "Highland Dawn Cornflower",
    subtext: "Ethically unearthed Ceylon blue sapphires celebrated worldwide for their electric crystalline brilliance.",
    highlightBadge: "Cornflower & Royal Blue",
    panClass: "animate-hero-pan-2",
    objectPosition: "object-[60%_center]",
  },
  {
    id: 3,
    src: "/isuru_images/hero3.jpg",
    alt: "Rare fancy color sapphires and fiery gems catching the sunset at a luxury panoramic salon",
    tag: "Sunset Padparadscha",
    scenery: "Ceylon Horizon · Sunset Fire",
    headlineAccent: "Twilight Lotus Fire",
    subtext: "Legendary lotus-hued Padparadschas and luminous Ceylon fancy gems catching the evening tropical glow.",
    highlightBadge: "Rare Lotus Padparadscha",
    panClass: "animate-hero-pan-3",
    objectPosition: "object-[65%_center]",
  },
  {
    id: 4,
    src: "/isuru_images/hero4.jpg",
    alt: "Master collection of natural precious sapphires and collector gems overlooking a calm lake and mountains",
    tag: "Master Lapidary Parcels",
    scenery: "Gem City · Direct Mines",
    headlineAccent: "Precision Collector Gems",
    subtext: "Precision-cut investment specimens authenticated with independent NGJA, GRS, and GIA laboratory dossiers.",
    highlightBadge: "Certified Collector Parcels",
    panClass: "animate-hero-pan-4",
    objectPosition: "object-[65%_center]",
  },
];

const SLIDE_DURATION_MS = 6500;
const TICK_INTERVAL_MS = 50;

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  // Timer loop for video-like auto-advance and progress bar
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const increment = (TICK_INTERVAL_MS / SLIDE_DURATION_MS) * 100;
        const next = prev + increment;
        if (next >= 100) {
          setCurrentSlide((cur) => (cur + 1) % HERO_SLIDES.length);
          return 0;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === " ") {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <section
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Ceylon Gemstones Video Showcase"
      className="relative overflow-hidden bg-[#120F0D] text-[#FAF6EE] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF67]"
    >
      {/* Background Video-like Floating Slides */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
                isActive ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <div className={`relative w-full h-full ${isActive && isPlaying ? slide.panClass : ""}`}>
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={`object-cover ${slide.objectPosition} scale-105`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Luxury Cinematic Overlays */}
      {/* Dark gradient for text contrast */}
      <div className="absolute inset-0 bg-linear-to-r from-[#120F0D] via-[#120F0D]/85 md:via-[#120F0D]/70 to-[#120F0D]/35 z-2" />
      {/* Bottom fade into the page */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-[#120F0D] to-transparent z-2" />
      {/* Subtle radial luxury vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,transparent_40%,rgba(18,15,13,0.7)_100%)] z-2" />

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 sm:pt-24 sm:pb-36 lg:pt-28 lg:pb-44">
        <div className="grid gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-12 max-w-2xl animate-gentle-fade">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#D4AF67] font-medium">
              Ratnapura · Sri Lanka · Since 1984
            </p>

            <div className="mt-3.5 inline-flex items-center gap-2.5 px-3 py-1 bg-[#120F0D]/75 backdrop-blur-md border border-[#D4AF67]/40 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#D4AF67]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF67] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF67]"></span>
              </span>
              <span className="font-medium">
                Scene 0{currentSlide + 1} of 04 · {activeSlideData.tag}
              </span>
            </div>

            <h1 className="mt-5 font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05]">
              The Timeless Beauty of Ceylon.
            </h1>

            <div className="mt-6 flex items-center gap-3 max-w-xs" aria-hidden>
              <span className="h-px flex-1 bg-linear-to-r from-[#D4AF67] to-transparent" />
              <span className="w-2 h-2 rotate-45 border border-[#D4AF67]" />
              <span className="h-px flex-1 bg-linear-to-l from-[#D4AF67] to-transparent" />
            </div>

            <p className="mt-6 text-base sm:text-lg text-[#FAF6EE]/85 leading-relaxed min-h-[3.5rem] transition-opacity duration-500">
              {activeSlideData.subtext}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/gems"
                className="inline-flex items-center justify-center gap-2 bg-[#5E0F1E] hover:bg-[#7E1529] border border-[#B8924A]/60 px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all hover:shadow-[0_0_20px_rgba(184,146,74,0.3)]"
              >
                Explore Gemstones
                <ArrowRight className="w-4 h-4 text-[#D4AF67]" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-[#B8924A]/70 bg-[#120F0D]/60 hover:border-[#D4AF67] hover:text-[#D4AF67] backdrop-blur-xs px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
