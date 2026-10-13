"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface CategoryItem {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  tag?: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    title: "Blue Sapphires",
    subtitle: "Royal & Cornflower Blue",
    image: "/isuru_images/categories1.jpg",
    link: "/gems/category/blue-sapphires",
    tag: "Signature Ceylon",
  },
  {
    title: "Natural Ceylon Rubies",
    subtitle: "Pigeon Blood & Crimson Fire",
    image: "/isuru_images/ruby%20category.jpg",
    link: "/gems/category/ceylon-rubies",
    tag: "High Fluorescence",
  },
  {
    title: "Padparadscha Sapphires",
    subtitle: "Sacred Lotus Blossom Sunset",
    image: "/isuru_images/categories2.jpg",
    link: "/gems/category/padparadscha",
    tag: "Rarest Corundum",
  },
  {
    title: "Chrysoberyl Alexandrite",
    subtitle: "Day-to-Night Color Change",
    image: "/isuru_images/Alexandrite%20category.jpg",
    link: "/gems/category/alexandrite",
    tag: "Optical Phenomenon",
  },
  {
    title: "Yellow Sapphires",
    subtitle: "Imperial Honey Pushparaga",
    image: "/isuru_images/yellow.jpg",
    link: "/gems/category/yellow-sapphires",
    tag: "Auspicious Vedic",
  },
  {
    title: "Rough & Collector Gems",
    subtitle: "Natural Crystals & Asterism",
    image: "/isuru_images/categories3.jpg",
    link: "/gems/category/rare-collector",
    tag: "Museum Grade",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function CategoryCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const track: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: reduce ? 0 : 0.2 } },
  };
  const card: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <section className="relative z-20 -mt-24 sm:-mt-28 lg:-mt-36 xl:-mt-40 pb-16 sm:pb-20 lg:pb-28">
      <div className="container-luxe">
        <div className="relative group/track">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll categories left"
            className="lg:hidden absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-[#120F0D]/90 border border-[#B8924A]/70 text-[#D4AF67] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-xs transition-all active:scale-95 hover:bg-[#B8924A] hover:text-[#120F0D]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll categories right"
            className="lg:hidden absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-[#120F0D]/90 border border-[#B8924A]/70 text-[#D4AF67] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-xs transition-all active:scale-95 hover:bg-[#B8924A] hover:text-[#120F0D]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <motion.div
            ref={scrollRef}
            variants={track}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="flex lg:grid lg:grid-cols-6 gap-3 xl:gap-5 2xl:gap-6 overflow-x-auto lg:overflow-visible no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                variants={card}
                className={`min-w-[220px] sm:min-w-[240px] lg:min-w-0 flex-1 shrink-0 snap-start ${
                  i % 2 === 1 ? "lg:translate-y-6" : ""
                }`}
              >
                <Link
                  href={cat.link}
                  className="shine-sweep group relative block h-[300px] sm:h-[320px] lg:h-[300px] xl:h-[360px] 2xl:h-[420px] overflow-hidden border border-[#B8924A]/40 bg-[#14100D] shadow-[0_20px_45px_-10px_rgba(0,0,0,0.45)] transition-all duration-700 ease-out hover:-translate-y-2 hover:border-[#D4AF67] hover:shadow-[0_30px_60px_-12px_rgba(184,146,74,0.4)]"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#D4AF67]/70 to-transparent z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 35vw, 18vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-[#120F0D] via-[#120F0D]/50 via-45% to-[#120F0D]/5 transition-opacity duration-500 group-hover:opacity-90" />

                  {cat.tag && (
                    <div className="absolute top-3 left-3 z-10 max-w-[calc(100%-1.5rem)]">
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 bg-[#120F0D]/80 text-[#D4AF67] border border-[#B8924A]/40 backdrop-blur-sm truncate max-w-full">
                        <Sparkles className="w-3 h-3 shrink-0 text-[#D4AF67]" />
                        <span className="truncate">{cat.tag}</span>
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-4 xl:p-5 flex items-end justify-between text-[#FAF6EE] z-10">
                    <div className="space-y-1.5 min-w-0 pr-2">
                      <span className="text-[10px] xl:text-[11px] uppercase tracking-[0.14em] leading-snug text-[#D4AF67] block line-clamp-2">
                        {cat.subtitle}
                      </span>
                      <h3 className="font-serif text-lg xl:text-xl font-normal text-[#FAF6EE] group-hover:text-[#F3E7C4] transition-colors leading-tight">
                        {cat.title}
                      </h3>
                      <span className="block h-px w-0 bg-[#D4AF67] transition-all duration-700 group-hover:w-16" />
                    </div>
                    <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full border border-[#B8924A]/40 bg-[#120F0D]/70 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:border-[#D4AF67] group-hover:bg-[#D4AF67] group-hover:rotate-[-45deg]">
                      <ArrowRight className="w-4 h-4 text-[#D4AF67] group-hover:text-[#120F0D] transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
