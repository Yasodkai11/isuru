"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";

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
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Layered Image Collage                        */}
          {/* Mobile: order-2 (stacked below text)                     */}
          {/* Desktop: order-1 (left column)                           */}
          {/* ======================================================== */}
          <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6">
            <div className="relative max-w-md sm:max-w-lg lg:max-w-none mx-auto pt-6 pb-10 sm:py-8 px-3 sm:px-6">
              
              {/* Parallax wrapper for main craftsman image */}
              <motion.div
                style={isDesktop && !shouldReduceMotion ? { y: mainParallaxY } : undefined}
                className="relative z-10"
              >
                {/* 16px offset decorative gold border with corner marks & shimmer */}
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

                  {/* One-time gold shimmer sweep across the image border */}
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 0 } : { x: "-100%", opacity: 0 }}
                    animate={
                      isInView && !shouldReduceMotion
                        ? { x: ["-100%", "200%"], opacity: [0, 0.75, 0] }
                        : { opacity: 0 }
                    }
                    transition={{
                      duration: 1.8,
                      delay: 0.7,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#F7E7A9]/75 to-transparent pointer-events-none"
                  />
                </div>

                {/* Main image container with 4:5 tall portrait ratio */}
                <div className="relative z-10 aspect-[4/5] w-full bg-[#1A1410] shadow-[0_20px_50px_rgba(43,43,43,0.14)] overflow-hidden">
                  {/* Framer-motion clip-path wipe from bottom to top & scale from 1.1 to 1 */}
                  <motion.div
                    initial={
                      shouldReduceMotion
                        ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
                        : { clipPath: "inset(100% 0% 0% 0%)", scale: 1.1 }
                    }
                    animate={
                      isInView
                        ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
                        : shouldReduceMotion
                        ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
                        : { clipPath: "inset(100% 0% 0% 0%)", scale: 1.1 }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.9,
                      ease: [0.16, 1, 0.3, 1] as const,
                    }}
                    className="group relative w-full h-full overflow-hidden"
                  >
                    <Image
                      src="/images/story/image2.jpg"
                      alt="Master Ceylon gem cutter in Ratnapura hand-faceting a natural Ceylon blue sapphire on a traditional lapidary wheel"
                      fill
                      priority
                      sizes="(max-width: 768px) 92vw, (max-width: 1200px) 48vw, 560px"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Subtle warm vignette on edges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                  </motion.div>
                </div>
              </motion.div>

              {/* OVERLAPPING IMAGE 1: Ring Image Accent (Top-Left) */}
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
                  delay: shouldReduceMotion ? 0 : 0.25, // 0.25s stagger
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                className="absolute z-20 -top-3 -left-2 sm:-top-6 sm:-left-6 lg:-top-8 lg:-left-8"
              >
                <div className="group relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 bg-[#FAF6EE] border-2 border-[#B8924A] shadow-[0_12px_32px_rgba(43,43,43,0.18)]">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-[#1A1410]">
                    <Image
                      src="/images/story/image3.jpg"
                      alt="Handcrafted artisanal gold ring set with an ethically mined Ceylon royal blue sapphire"
                      fill
                      sizes="(max-width: 768px) 80px, 120px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>
                </div>
              </motion.div>

              {/* OVERLAPPING IMAGE 2: Sapphire on Stand (Bottom-Right) */}
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
                  delay: shouldReduceMotion ? 0 : 0.5, // 0.25s stagger after ring
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                className="absolute z-20 -bottom-5 -right-2 sm:-bottom-8 sm:-right-6 lg:-bottom-10 lg:-right-8 w-[52%] sm:w-[48%] max-w-[280px]"
              >
                <div className="group relative aspect-square p-2 sm:p-2.5 bg-[#FAF6EE] border border-[#B8924A]/40 shadow-[0_22px_55px_rgba(43,43,43,0.22)]">
                  <div className="relative w-full h-full overflow-hidden bg-[#1A1410]">
                    <Image
                      src="/images/story/image1.jpg"
                      alt="Unheated Ceylon oval blue sapphire with royal blue brilliance displayed on an antique carved wooden stand"
                      fill
                      sizes="(max-width: 768px) 48vw, 260px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* 3-4 subtle sparkle dots near the blue sapphire pulsing slowly */}
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
                        {/* 4-pointed diamond sparkle star */}
                        <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
                      </motion.svg>
                    ))}
                  </div>
                </div>
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
              className="space-y-6 sm:space-y-7 max-w-xl mx-auto lg:mx-0"
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
                className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl text-[#5E0F1E] font-normal leading-[1.18] tracking-tight"
              >
                Four decades in the gem city of Ratnapura
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
