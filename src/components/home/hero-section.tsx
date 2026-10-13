"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Pause, ChevronLeft, ChevronRight, Award, ShieldCheck, Gem } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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
const EASE = [0.16, 1, 0.3, 1] as const;

const HERO_STATS = [
  { icon: Award, value: "Est. 1984", label: "Ratnapura, Sri Lanka" },
  { icon: ShieldCheck, value: "NGJA", label: "Govt. Licensed Exporter" },
  { icon: Gem, value: "GIA · GRS", label: "Independently Certified" },
];

export function HeroSection() {
  const reduce = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const playing = isPlaying && !reduce;

  const goToSlide = useCallback((index: number) => setCurrentSlide(index), []);
  const nextSlide = useCallback(() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length), []);
  const prevSlide = useCallback(
    () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length),
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextSlide();
    else if (e.key === "ArrowLeft") prevSlide();
    else if (e.key === " " && e.target === e.currentTarget) {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  const activeSlideData = HERO_SLIDES[currentSlide];
  const progressStyle = {
    animationDuration: `${SLIDE_DURATION_MS}ms`,
    animationPlayState: playing ? "running" : "paused",
  } as const;

  const headlineWords = ["The", "Timeless", "Beauty", "of"];

  return (
    <section
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Ceylon Gemstones Showcase"
      className="grain relative overflow-hidden bg-[#120F0D] text-[#FAF6EE] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF67] lg:min-h-[calc(100svh-7rem)] flex items-center"
    >
      {/* Background slides */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
                isActive ? "opacity-100 z-1" : "opacity-0 z-0"
              }`}
              aria-hidden={!isActive}
            >
              <div className={`relative w-full h-full ${isActive && playing ? slide.panClass : ""}`}>
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

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-[#120F0D] via-[#120F0D]/80 lg:via-[#120F0D]/55 to-[#120F0D]/20 z-2" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-[#120F0D] to-transparent z-2" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_35%,rgba(18,15,13,0.65)_100%)] z-2" />
      <div
        aria-hidden="true"
        className="absolute -left-40 top-1/3 w-[38rem] h-[38rem] rounded-full bg-[#5E0F1E]/25 blur-[120px] z-2"
      />

      {/* Vertical brand rail on wide screens */}
      <div
        aria-hidden="true"
        className="hidden 2xl:flex absolute left-8 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-6 text-[10px] uppercase tracking-[0.5em] text-[#D4AF67]/70"
      >
        <span className="w-px h-24 bg-linear-to-b from-transparent to-[#D4AF67]/60" />
        <span className="[writing-mode:vertical-rl] rotate-180">Isuru Gems · Ceylon</span>
        <span className="w-px h-24 bg-linear-to-t from-transparent to-[#D4AF67]/60" />
      </div>

      <div className="relative z-10 container-luxe w-full pt-16 pb-32 sm:pt-24 sm:pb-40 lg:pt-20 lg:pb-48 xl:pb-52">
        {/* Copy */}
        <div className="max-w-3xl">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex items-center gap-3 text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#D4AF67] font-medium"
            >
              <span className="w-10 h-px bg-[#D4AF67]" />
              Ratnapura · Sri Lanka · Since 1984
            </motion.p>

            <h1 className="mt-6 font-serif font-normal leading-[0.98] text-[2.9rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] 2xl:text-[6.5rem]">
              <span className="sr-only">The Timeless Beauty of Ceylon.</span>
              <span aria-hidden="true" className="block">
                {headlineWords.map((word, i) => (
                  <span key={word} className="inline-block overflow-hidden align-bottom pb-[0.2em] -mb-[0.12em] mr-[0.22em]">
                    <motion.span
                      className="inline-block"
                      initial={reduce ? false : { y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 1, delay: 0.15 + i * 0.09, ease: EASE }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
              <span aria-hidden="true" className="block overflow-hidden pb-[0.25em] -mb-[0.13em]">
                <motion.span
                  className="inline-block italic text-gold-gradient"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
                >
                  Ceylon.
                </motion.span>
              </span>
            </h1>

            <motion.div
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
              className="mt-7 flex items-center gap-3 max-w-xs origin-left"
              aria-hidden
            >
              <span className="h-px flex-1 bg-linear-to-r from-[#D4AF67] to-transparent" />
              <span className="w-2 h-2 rotate-45 border border-[#D4AF67]" />
              <span className="h-px flex-1 bg-linear-to-l from-[#D4AF67] to-transparent" />
            </motion.div>

            <div className="mt-7 min-h-[5rem] sm:min-h-[4rem]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeSlideData.id}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="text-base sm:text-lg xl:text-xl font-light text-[#FAF6EE]/85 leading-relaxed max-w-2xl"
                >
                  {activeSlideData.subtext}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: EASE }}
              className="mt-9 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/gems"
                className="shine-sweep group inline-flex items-center justify-center gap-3 bg-[#5E0F1E] hover:bg-[#7E1529] border border-[#B8924A]/60 px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-all duration-500 hover:shadow-[0_10px_40px_-6px_rgba(212,175,103,0.45)]"
              >
                Explore Gemstones
                <ArrowRight className="w-4 h-4 text-[#D4AF67] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-[#FAF6EE]/30 bg-[#FAF6EE]/5 hover:bg-[#FAF6EE] hover:text-[#120F0D] backdrop-blur-md px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-all duration-500"
              >
                Book a Private Viewing
              </Link>
            </motion.div>

            {/* Credentials */}
            <motion.dl
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.25 }}
              className="mt-12 hidden sm:grid grid-cols-3 gap-6 max-w-2xl border-t border-[#FAF6EE]/10 pt-7"
            >
              {HERO_STATS.map(({ icon: Icon, value, label }) => (
                <div key={value} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-[#D4AF67] shrink-0 mt-1" strokeWidth={1.4} />
                  <div>
                    <dt className="font-serif text-xl xl:text-2xl text-[#FAF6EE]">{value}</dt>
                    <dd className="text-[11px] uppercase tracking-[0.18em] text-[#FAF6EE]/55 mt-1">{label}</dd>
                  </div>
                </div>
              ))}
            </motion.dl>

            {/* Slideshow controls */}
            <div className="mt-10 flex items-center gap-4 max-w-sm">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="w-9 h-9 rounded-full border border-[#D4AF67]/30 flex items-center justify-center text-[#FAF6EE]/70 hover:text-[#D4AF67] hover:border-[#D4AF67] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                  className="w-9 h-9 rounded-full border border-[#D4AF67]/50 flex items-center justify-center text-[#D4AF67] hover:bg-[#D4AF67]/10 transition-colors cursor-pointer"
                >
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="w-9 h-9 rounded-full border border-[#D4AF67]/30 flex items-center justify-center text-[#FAF6EE]/70 hover:text-[#D4AF67] hover:border-[#D4AF67] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-1 gap-2">
                {HERO_SLIDES.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(i)}
                    aria-label={`Show slide ${i + 1}: ${slide.tag}`}
                    aria-current={i === currentSlide ? "true" : undefined}
                    className="relative h-1 flex-1 bg-[#FAF6EE]/20 hover:bg-[#FAF6EE]/40 transition-colors overflow-hidden cursor-pointer"
                  >
                    {i < currentSlide && <span className="absolute inset-0 bg-[#D4AF67]" />}
                    {i === currentSlide && (
                      <span
                        key={`ctrl-${currentSlide}`}
                        onAnimationEnd={nextSlide}
                        style={progressStyle}
                        className="hero-progress absolute inset-0 bg-[#D4AF67]"
                      />
                    )}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-mono tracking-wider text-[#FAF6EE]/60 shrink-0">
                0{currentSlide + 1} / 0{HERO_SLIDES.length}
              </span>
            </div>
          </div>
      </div>
    </section>
  );
}
