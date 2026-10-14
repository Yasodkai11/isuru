"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, ShieldCheck, Gem, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const reduce = useReducedMotion();

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

            {/* Botanical Leaf Vector Flourish (Concept 03 Motif) */}
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
              className="pt-7 border-t border-[#B8924A]/25 grid grid-cols-3 gap-4 sm:gap-6 max-w-lg"
            >
              <div>
                <span className="block font-serif text-lg sm:text-xl font-medium text-[#1D1B18]">Est. 1984</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#736B63] block mt-0.5">Ratnapura, Ceylon</span>
              </div>
              <div>
                <span className="block font-serif text-lg sm:text-xl font-medium text-[#0E2A20]">NGJA & GIA</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#736B63] block mt-0.5">Govt. Certified</span>
              </div>
              <div>
                <span className="block font-serif text-lg sm:text-xl font-medium text-[#1D1B18]">Mine Direct</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#736B63] block mt-0.5">Ethical Traceability</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: High-Jewelry Staged Photography */}
          <div className="lg:col-span-6 xl:col-span-6">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              className="relative rounded-2xl overflow-hidden border border-[#B8924A]/30 bg-[#F4EFEA] shadow-[0_20px_50px_-15px_rgba(25,20,15,0.18)] group"
            >
              {/* Subtle top edge gold highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF67]/70 to-transparent z-10" />

              <div className="relative aspect-[16/10] sm:aspect-[16/11] lg:aspect-[16/11] w-full overflow-hidden">
                <Image
                  src="/images/concept03/hero-modern-ceylon.jpg"
                  alt="Fine loose faceted Ceylon Blue Sapphire, Pink Sapphire and Yellow Sapphire staged on white travertine stone blocks"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>

              {/* Refined Glassmorphism Badge */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 bg-[#FAF8F5]/90 backdrop-blur-md border border-[#B8924A]/30 p-3.5 sm:p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0E2A20] text-[#FAF8F5] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#D4AF67]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm sm:text-base font-medium text-[#1D1B18]">
                      Master Faceted Sapphires
                    </h3>
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#736B63]">
                      Natural · Unheated · Certified Ceylon
                    </p>
                  </div>
                </div>
                <Link
                  href="/gems"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#0E2A20] font-semibold hover:text-[#B8924A] transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
