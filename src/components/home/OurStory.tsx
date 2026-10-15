"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
  type Variants,
} from "framer-motion";

interface WorkSlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  src: string;
  alt: string;
  position: string;
}

const workSlides: WorkSlide[] = [
  {
    id: "pit-mining",
    title: "Traditional Shaft Mining",
    subtitle: "Ratnapura Gem Pit • 40ft Alluvial Shaft",
    tag: "Mine Site",
    src: "/isuru_images/work/work-pit-mining.jpeg",
    alt: "Authentic gem miner inside a deep timbered shaft in Ratnapura Sri Lanka",
    position: "object-cover object-center",
  },
  {
    id: "river-washing",
    title: "River Illam Washing",
    subtitle: "Artisanal Woven Wattiya Baskets",
    tag: "Ethical Sourcing",
    src: "/isuru_images/work/work-river-washing.jpeg",
    alt: "Traditional alluvial gem washing in Sri Lankan river with conical bamboo basket",
    position: "object-cover object-center",
  },
  {
    id: "gem-selection",
    title: "Hand-Grading Gem Parcels",
    subtitle: "Unheated Ceylon Sapphires & Spinels",
    tag: "Inspection",
    src: "/isuru_images/work/work-gem-selection.jpeg",
    alt: "Gemologist reviewing parcels of genuine cut and raw gemstones on display trays",
    position: "object-cover object-center",
  },
  {
    id: "three-generations",
    title: "Three Generations of Craft",
    subtitle: "Family Legacy in Ratnapura Atelier",
    tag: "Heritage",
    src: "/isuru_images/work/work-three-generations.jpeg",
    alt: "Three generations of Sri Lankan gem merchants and family craftsmen",
    position: "object-cover object-top",
  },
  {
    id: "partnership",
    title: "Direct Miner Partnerships",
    subtitle: "Certified Origin & Fair Trade",
    tag: "100% Direct",
    src: "/isuru_images/work/work-partnership.jpeg",
    alt: "Direct trade and certification exchange with local miners",
    position: "object-cover object-center",
  },
];

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
  isVisible: boolean;
  shouldReduceMotion: boolean;
}

function CountUp({
  end,
  suffix = "",
  duration = 1.8,
  isVisible,
  shouldReduceMotion,
}: CountUpProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isVisible || shouldReduceMotion) return;

    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // easeOutExpo for a luxurious deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.floor(easeProgress * end));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, end, duration, shouldReduceMotion]);

  const displayValue = shouldReduceMotion ? end : isVisible ? value : 0;

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

export function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReduced);

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Slide state and auto-play for real work showcase
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || shouldReduceMotion || !isInView) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % workSlides.length);
    }, 4600);
    return () => clearInterval(timer);
  }, [isHovered, shouldReduceMotion, isInView]);

  const currentSlide = workSlides[currentSlideIndex];

  // Parallax configuration for desktop
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const mainParallaxY = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const sapphireParallaxY = useTransform(scrollYProgress, [0, 1], [35, -35]); // faster
  const ringParallaxY = useTransform(scrollYProgress, [0, 1], [-25, 25]); // faster

  // Staggered text animation variants
  const textContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const textItemVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.65,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  // Sapphire sparkle dots configuration
  const sparkles = [
    { top: "25%", left: "44%", size: 14, delay: 0 },
    { top: "34%", left: "64%", size: 18, delay: 1.1 },
    { top: "45%", left: "38%", size: 12, delay: 2.2 },
    { top: "20%", left: "56%", size: 16, delay: 3.1 },
  ];

  return (
    <section
      id="our-story"
      ref={sectionRef}
      aria-labelledby="our-story-title"
      className="relative py-20 sm:py-24 lg:py-32 xl:py-36 overflow-hidden bg-[#FAF6EE]"
    >
      {/* 1. Thin maroon-to-gold gradient line at the top */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5E0F1E] via-[#B8924A] to-[#5E0F1E]"
      />

      {/* 2. Subtle damask/lotus inline SVG background pattern (4-5% opacity) */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="story-damask-lotus"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* Center lotus blossom */}
            <path
              d="M40 22 C36 30 38 40 40 46 C42 40 44 30 40 22 Z"
              fill="#5E0F1E"
            />
            <path
              d="M40 46 C34 40 25 34 29 27 C34 27 37 36 40 46 Z"
              fill="#B8924A"
            />
            <path
              d="M40 46 C46 40 55 34 51 27 C46 27 43 36 40 46 Z"
              fill="#B8924A"
            />
            {/* Ornamental scrollwork / filigree vine */}
            <path
              d="M40 46 C35 52 24 54 20 48 C16 42 22 36 28 38"
              fill="none"
              stroke="#B8924A"
              strokeWidth="0.8"
            />
            <path
              d="M40 46 C45 52 56 54 60 48 C64 42 58 36 52 38"
              fill="none"
              stroke="#B8924A"
              strokeWidth="0.8"
            />
            {/* Corner motifs for seamless tiling */}
            <path
              d="M0 2 C2 6 2 10 0 14 C-2 10 -2 6 0 2 Z"
              fill="#B8924A"
            />
            <path
              d="M80 2 C82 6 82 10 80 14 C78 10 78 6 80 2 Z"
              fill="#B8924A"
            />
            <path
              d="M0 78 C2 74 2 70 0 66 C-2 70 -2 74 0 78 Z"
              fill="#B8924A"
            />
            <path
              d="M80 78 C82 74 82 70 80 66 C78 70 78 74 80 78 Z"
              fill="#B8924A"
            />
            {/* Diamond tip accent */}
            <polygon
              points="40,16 42,19 40,22 38,19"
              fill="#B8924A"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#story-damask-lotus)" />
      </svg>

      {/* Main 2-column container */}
      <div className="relative container-luxe">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Layered Image Collage                        */}
          {/* Mobile: order-2 (stacked below text)                     */}
          {/* Desktop: order-1 (left column)                           */}
          {/* ======================================================== */}
          <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6">
            <div className="relative max-w-md sm:max-w-lg lg:max-w-none mx-auto pt-6 pb-10 sm:py-8 px-3 sm:px-6">
              
              {/* Subtle ambient warm gold glow behind the collage */}
              <div 
                aria-hidden="true" 
                className="absolute -inset-4 bg-gradient-to-tr from-[#B8924A]/15 via-transparent to-[#5E0F1E]/10 rounded-3xl blur-2xl pointer-events-none -z-10" 
              />

              {/* Parallax wrapper for main showcase */}
              <motion.div
                style={isDesktop && !shouldReduceMotion ? { y: mainParallaxY } : undefined}
                className="relative z-10"
              >
                {/* Decorative gold border with corner marks & recurring shimmer sweep */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-3.5 translate-y-3.5 sm:translate-x-4 sm:translate-y-4 border border-[#B8924A]/45 pointer-events-none z-0 overflow-hidden"
                >
                  {/* Antique gold ornamental diamond corner marks */}
                  <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rotate-45 bg-[#B8924A]" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rotate-45 bg-[#B8924A]" />
                  <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rotate-45 bg-[#B8924A]" />
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rotate-45 bg-[#B8924A]" />

                  {/* Classical L-bracket gold corner accents */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-[#B8924A]" />
                  <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-[#B8924A]" />
                  <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-[#B8924A]" />
                  <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-[#B8924A]" />

                  {/* Periodic gold shimmer sweep across the image border */}
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 0 } : { x: "-100%", opacity: 0 }}
                    animate={
                      isInView && !shouldReduceMotion
                        ? { x: ["-100%", "220%"], opacity: [0, 0.85, 0] }
                        : { opacity: 0 }
                    }
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      repeatDelay: 4.5,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#F7E7A9]/75 to-transparent pointer-events-none"
                  />
                </div>

                {/* Main image container with 4:5 tall portrait ratio */}
                <div 
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="group relative z-10 aspect-[4/5] w-full bg-[#1A1410] shadow-[0_20px_50px_rgba(43,43,43,0.18)] overflow-hidden rounded-xs border border-[#B8924A]/30 select-none"
                >
                  {/* Real work images with smooth animated crossfade and Ken Burns motion */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide.id}
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.7,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }}
                      className="relative w-full h-full overflow-hidden"
                    >
                      <Image
                        src={currentSlide.src}
                        alt={currentSlide.alt}
                        fill
                        priority={currentSlideIndex === 0}
                        sizes="(max-width: 768px) 92vw, (max-width: 1200px) 48vw, 560px"
                        className={`${currentSlide.position} transition-transform duration-1000 ease-out group-hover:scale-105`}
                      />

                      {/* Luxury cinematic gradients */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />
                      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/30 pointer-events-none" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Top Badges */}
                  <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-none">
                    {/* Live field archive indicator */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#B8924A]/40 text-[#FAF6EE] text-[10px] sm:text-[11px] font-medium tracking-wider uppercase shadow-md pointer-events-auto">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF67] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF67]" />
                      </span>
                      <span>Ratnapura Field Work</span>
                    </div>

                    {/* Stage Tag */}
                    <motion.div
                      key={currentSlide.tag}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-2.5 py-1 rounded-sm bg-[#5E0F1E]/90 backdrop-blur-md border border-[#B8924A]/50 text-[#F7E7A9] text-[10px] font-semibold tracking-widest uppercase shadow-md"
                    >
                      {currentSlide.tag}
                    </motion.div>
                  </div>

                  {/* Bottom glassmorphic interactive caption & control bar */}
                  <div className="absolute bottom-0 inset-x-0 z-20 p-3.5 sm:p-4.5 bg-gradient-to-t from-black/95 via-black/75 to-transparent backdrop-blur-[2px]">
                    <div className="flex items-end justify-between gap-3 mb-2.5">
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF67] block">
                          0{currentSlideIndex + 1} / 0{workSlides.length} • Genuine Field Archive
                        </span>
                        <h4 className="text-sm sm:text-base font-serif font-medium text-white tracking-wide leading-tight truncate">
                          {currentSlide.title}
                        </h4>
                        <p className="text-[11px] text-white/75 truncate mt-0.5">
                          {currentSlide.subtitle}
                        </p>
                      </div>

                      {/* Tactile navigation arrows */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlideIndex((prev) => (prev - 1 + workSlides.length) % workSlides.length);
                          }}
                          aria-label="Previous work photo"
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-[#5E0F1E] border border-[#B8924A]/40 text-white flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
                        >
                          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F7E7A9]" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlideIndex((prev) => (prev + 1) % workSlides.length);
                          }}
                          aria-label="Next work photo"
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-[#5E0F1E] border border-[#B8924A]/40 text-white flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
                        >
                          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F7E7A9]" />
                        </button>
                      </div>
                    </div>

                    {/* Segmented interactive progress indicators */}
                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                      {workSlides.map((slide, idx) => {
                        const isActive = idx === currentSlideIndex;
                        const isPast = idx < currentSlideIndex;
                        return (
                          <button
                            key={slide.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentSlideIndex(idx);
                            }}
                            title={slide.title}
                            aria-label={`Switch to ${slide.title}`}
                            className="group/seg relative h-1.5 w-full bg-white/20 hover:bg-white/40 rounded-full overflow-hidden cursor-pointer transition-colors"
                          >
                            {isActive ? (
                              <motion.div
                                key={`progress-${currentSlideIndex}`}
                                initial={shouldReduceMotion ? { width: "100%" } : { width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{
                                  duration: shouldReduceMotion || isHovered ? 0 : 4.6,
                                  ease: "linear",
                                }}
                                className="h-full bg-gradient-to-r from-[#D4AF67] to-[#F7E7A9]"
                              />
                            ) : isPast ? (
                              <div className="h-full w-full bg-[#B8924A]" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* OVERLAPPING THUMBNAIL 1: River Gem Washing Accent (Top-Left) with gentle continuous floating */}
              <motion.div
                style={isDesktop && !shouldReduceMotion ? { y: ringParallaxY } : undefined}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, scale: 1, x: 0, y: 0 }
                    : { opacity: 0, scale: 0.85, x: -16, y: -16 }
                }
                animate={
                  isInView
                    ? { opacity: 1, scale: 1, x: 0, y: 0 }
                    : shouldReduceMotion
                    ? { opacity: 1, scale: 1, x: 0, y: 0 }
                    : { opacity: 0, scale: 0.85, x: -16, y: -16 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.7,
                  delay: shouldReduceMotion ? 0 : 0.25,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                className="absolute z-20 -top-3 -left-2 sm:-top-6 sm:-left-6 lg:-top-8 lg:-left-8"
              >
                {/* Continuous floating micro-animation */}
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: [-4, 4, -4],
                          rotate: [-1.5, 1.5, -1.5],
                        }
                  }
                  transition={{
                    duration: 4.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  onClick={() => setCurrentSlideIndex(1)}
                  title="Click to view River Illam Washing"
                  className="group relative cursor-pointer"
                >
                  {/* Rotating ornamental dashed gold ring */}
                  <motion.div
                    aria-hidden="true"
                    animate={shouldReduceMotion ? {} : { rotate: 360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-1.5 rounded-full border border-dashed border-[#B8924A]/70 pointer-events-none"
                  />

                  {/* Circular image badge */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 bg-[#FAF6EE] border-2 border-[#B8924A] shadow-[0_12px_32px_rgba(43,43,43,0.22)] transition-transform duration-300 group-hover:scale-105">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-[#1A1410]">
                      <Image
                        src="/isuru_images/work/work-river-washing.jpeg"
                        alt="River washing with traditional conical wicker basket in Ratnapura"
                        fill
                        sizes="(max-width: 768px) 80px, 120px"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-115"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      {/* Mini pill badge */}
                      <span className="absolute bottom-1 inset-x-0 text-center text-[8px] sm:text-[9px] font-semibold text-[#F7E7A9] tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        River Wash
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* OVERLAPPING THUMBNAIL 2: Natural Gem Parcels Card (Bottom-Right) with twinkling facet stars */}
              <motion.div
                style={isDesktop && !shouldReduceMotion ? { y: sapphireParallaxY } : undefined}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, scale: 1, x: 0, y: 0 }
                    : { opacity: 0, scale: 0.88, x: 20, y: 24 }
                }
                animate={
                  isInView
                    ? { opacity: 1, scale: 1, x: 0, y: 0 }
                    : shouldReduceMotion
                    ? { opacity: 1, scale: 1, x: 0, y: 0 }
                    : { opacity: 0, scale: 0.88, x: 20, y: 24 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.75,
                  delay: shouldReduceMotion ? 0 : 0.5,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                className="absolute z-20 -bottom-5 -right-2 sm:-bottom-8 sm:-right-6 lg:-bottom-10 lg:-right-8 w-[52%] sm:w-[48%] max-w-[280px]"
              >
                {/* Continuous floating micro-animation out-of-phase */}
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: [5, -5, 5],
                          rotate: [0.8, -0.8, 0.8],
                        }
                  }
                  transition={{
                    duration: 5.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6,
                  }}
                  onClick={() => setCurrentSlideIndex(2)}
                  title="Click to view Gem Parcel Grading"
                  className="group relative cursor-pointer"
                >
                  <div className="relative aspect-square p-2 sm:p-2.5 bg-[#FAF6EE] border border-[#B8924A]/50 shadow-[0_22px_55px_rgba(43,43,43,0.22)] transition-transform duration-300 group-hover:scale-[1.03]">
                    <div className="relative w-full h-full overflow-hidden bg-[#1A1410] border border-[#B8924A]/30">
                      <Image
                        src="/isuru_images/work/work-gem-selection.jpeg"
                        alt="Hand-grading natural rough and cut gemstones on display trays"
                        fill
                        sizes="(max-width: 768px) 48vw, 260px"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                      />

                      {/* Bottom gold label */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-1.5 sm:p-2 text-center">
                        <span className="text-[8px] sm:text-[10px] font-semibold text-[#F7E7A9] tracking-wider uppercase block truncate">
                          Gem Parcels • Hand-Sorted
                        </span>
                      </div>

                      {/* Animated sparkle stars dancing over the natural gem parcels */}
                      {sparkles.map((s, idx) => (
                        <motion.svg
                          key={idx}
                          aria-hidden="true"
                          style={{ top: s.top, left: s.left }}
                          className="absolute pointer-events-none text-[#F7E7A9] drop-shadow-[0_0_8px_rgba(212,175,103,0.95)] z-20"
                          width={s.size}
                          height={s.size}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          initial={{ opacity: 0.2, scale: 0.6 }}
                          animate={
                            shouldReduceMotion
                              ? { opacity: 0.7, scale: 1 }
                              : {
                                  opacity: [0.2, 1, 0.2],
                                  scale: [0.6, 1.25, 0.6],
                                  rotate: [0, 45, 0],
                                }
                          }
                          transition={
                            shouldReduceMotion
                              ? { duration: 0 }
                              : {
                                  duration: 3.2,
                                  repeat: Infinity,
                                  delay: s.delay,
                                  ease: "easeInOut",
                                }
                          }
                        >
                          <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
                        </motion.svg>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Story Narrative & Stats                     */}
          {/* Mobile: order-1 (stacked on top)                         */}
          {/* Desktop: order-2 (right column)                          */}
          {/* ======================================================== */}
          <div className="order-1 lg:order-2 lg:col-span-6 xl:col-span-6">
            <motion.div
              variants={textContainerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-6 sm:space-y-7 max-w-xl 2xl:max-w-2xl mx-auto lg:mx-0"
            >
              {/* Eyebrow */}
              <motion.div variants={textItemVariants} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rotate-45 bg-[#B8924A]" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#B8924A] font-semibold">
                  OUR STORY
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                id="our-story-title"
                variants={textItemVariants}
                className="font-serif text-4xl sm:text-5xl xl:text-6xl text-[#5E0F1E] font-normal leading-[1.08] tracking-tight"
              >
                Four decades in the gem city of <em className="text-[#B8924A]">Ratnapura</em>
              </motion.h2>

              {/* Gold gradient divider with center diamond & shimmer sweep */}
              <motion.div variants={textItemVariants} className="pt-1 pb-1">
                <div className="relative max-w-md">
                  <div className="relative flex items-center justify-center">
                    {/* Left gradient line */}
                    <div className="relative flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#B8924A]/40 to-[#B8924A]/75 overflow-hidden">
                      <motion.div
                        initial={shouldReduceMotion ? { opacity: 0 } : { x: "-100%" }}
                        animate={isInView && !shouldReduceMotion ? { x: "200%" } : {}}
                        transition={{ duration: 1.4, delay: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-[#F7E7A9] to-transparent"
                      />
                    </div>

                    {/* Center ornamental diamond */}
                    <div className="mx-3.5 flex items-center gap-1.5 text-[#B8924A]">
                      <span className="w-1 h-1 rotate-45 bg-[#B8924A]/70" />
                      <span className="w-2.5 h-2.5 rotate-45 border border-[#B8924A] bg-[#FAF6EE] flex items-center justify-center shadow-xs">
                        <span className="w-1 h-1 rotate-45 bg-[#5E0F1E]" />
                      </span>
                      <span className="w-1 h-1 rotate-45 bg-[#B8924A]/70" />
                    </div>

                    {/* Right gradient line */}
                    <div className="relative flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#B8924A]/40 to-[#B8924A]/75 overflow-hidden">
                      <motion.div
                        initial={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
                        animate={isInView && !shouldReduceMotion ? { x: "-200%" } : {}}
                        transition={{ duration: 1.4, delay: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 w-full bg-gradient-to-l from-transparent via-[#F7E7A9] to-transparent"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Paragraph 1: Sourcing directly from miners with gold drop cap */}
              <motion.p
                variants={textItemVariants}
                className="text-base sm:text-[17px] text-[#2B2B2B]/85 leading-relaxed font-normal"
              >
                <span className="float-left text-5xl sm:text-6xl font-serif text-[#B8924A] leading-[0.78] pr-3 pt-1.5 font-semibold select-none">
                  F
                </span>
                or over four decades, our family business has sourced rough stones directly from local miners across the historic alluvial gravels of Ratnapura—the legendary City of Gems. By bypassing brokers and selecting unheated rough crystals right at the mine head, we honor multi-generational mining traditions while ensuring total ethical traceability.
              </motion.p>

              {/* Paragraph 2: Hand-cutting to classical proportions */}
              <motion.p
                variants={textItemVariants}
                className="text-base sm:text-[17px] text-[#2B2B2B]/85 leading-relaxed font-normal"
              >
                In our atelier, ancient lapidary wisdom meets uncompromising precision. Rather than cutting for maximum raw carat weight at the expense of brilliance, our master artisans hand-cut every sapphire to classical proportions and optimal optical angles. This singular devotion allows light to dance through undisturbed crystalline lattices, producing the iconic royal blue brilliance celebrated by collectors worldwide.
              </motion.p>

              {/* Stats Row with count-up numbers */}
              <motion.div
                variants={textItemVariants}
                className="grid grid-cols-3 gap-3 sm:gap-6 pt-5 pb-5 border-t border-b border-[#B8924A]/25"
              >
                {/* Stat 1 */}
                <div>
                  <div className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-semibold tracking-tight">
                    <CountUp
                      end={40}
                      suffix="+"
                      isVisible={isInView}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  </div>
                  <div className="text-[11px] sm:text-xs uppercase tracking-wider text-[#4A4A4A] mt-1 font-medium">
                    Years of Craft
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="border-l border-[#B8924A]/20 pl-3 sm:pl-6">
                  <div className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-semibold tracking-tight">
                    <CountUp
                      end={3}
                      suffix=""
                      isVisible={isInView}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  </div>
                  <div className="text-[11px] sm:text-xs uppercase tracking-wider text-[#4A4A4A] mt-1 font-medium">
                    Generations
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="border-l border-[#B8924A]/20 pl-3 sm:pl-6">
                  <div className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-semibold tracking-tight">
                    <CountUp
                      end={100}
                      suffix="%"
                      isVisible={isInView}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  </div>
                  <div className="text-[11px] sm:text-xs uppercase tracking-wider text-[#4A4A4A] mt-1 font-medium">
                    Direct from Miners
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                variants={textItemVariants}
                className="flex flex-wrap items-center gap-4 sm:gap-5 pt-2"
              >
                {/* Maroon filled button */}
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] font-semibold text-[#FAF6EE] bg-[#5E0F1E] hover:bg-[#7E1529] px-7 py-3.5 border border-[#B8924A]/40 shadow-sm hover:shadow-md transition-all duration-300 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B8924A] focus-visible:ring-offset-2"
                >
                  Read Our Story
                  <ArrowRight className="w-4 h-4 text-[#D4AF67] group-hover:translate-x-1 transition-transform duration-200" />
                </Link>

                {/* Gold outlined button (fills with gold and text turns maroon on hover) */}
                <Link
                  href="/wholesale"
                  className="inline-flex items-center text-xs uppercase tracking-[0.22em] font-semibold border border-[#B8924A] text-[#5E0F1E] bg-transparent hover:bg-[#B8924A] hover:text-[#5E0F1E] px-7 py-3.5 transition-all duration-300 shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#B8924A] focus-visible:ring-offset-2"
                >
                  Wholesale
                </Link>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
