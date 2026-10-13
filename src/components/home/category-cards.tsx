"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

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

export function CategoryCards() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative z-20 -mt-20 sm:-mt-24 lg:-mt-28 pb-12 sm:pb-16 lg:pb-20">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group/track">
          {/* Mobile/Tablet Scroll Controls */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll categories left"
            className="lg:hidden absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-[#120F0D]/90 border border-[#B8924A]/70 text-[#D4AF67] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-xs transition-all active:scale-95 hover:bg-[#B8924A] hover:text-[#120F0D]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll categories right"
            className="lg:hidden absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-[#120F0D]/90 border border-[#B8924A]/70 text-[#D4AF67] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-xs transition-all active:scale-95 hover:bg-[#B8924A] hover:text-[#120F0D]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Categories Floating One Line */}
          <div
            ref={scrollRef}
            className="flex lg:grid lg:grid-cols-6 gap-3 lg:gap-3 xl:gap-4 overflow-x-auto lg:overflow-visible no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.title}
                href={cat.link}
                className="group relative block min-w-[210px] sm:min-w-[230px] lg:min-w-0 flex-1 shrink-0 snap-start h-[280px] sm:h-[300px] lg:h-[285px] xl:h-[315px] overflow-hidden border border-[#B8924A]/40 bg-[#14100D] shadow-[0_15px_35px_rgba(0,0,0,0.38)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#D4AF67] hover:shadow-[0_22px_45px_rgba(184,146,74,0.3)]"
              >
                {/* Subtle top gold accent line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF67]/70 to-transparent z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 35vw, 18vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Multistep Luxury Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-[#120F0D]/55 via-45% to-[#120F0D]/10" />

                {/* Top Tag */}
                {cat.tag && (
                  <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-10 max-w-[calc(100%-1.25rem)]">
                    <span className="inline-flex items-center gap-1 text-[8px] sm:text-[8.5px] uppercase tracking-[0.16em] font-medium px-2 py-0.5 bg-[#120F0D]/85 text-[#D4AF67] border border-[#B8924A]/40 backdrop-blur-xs truncate max-w-full">
                      <Sparkles className="w-2.5 h-2.5 shrink-0 text-[#D4AF67]" />
                      <span className="truncate">{cat.tag}</span>
                    </span>
                  </div>
                )}

                {/* Bottom Content */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5 xl:p-4 flex items-end justify-between text-[#FAF6EE] z-10">
                  <div className="space-y-1 min-w-0 pr-2">
                    <span className="text-[8px] sm:text-[8.5px] xl:text-[9.5px] uppercase tracking-[0.16em] text-[#D4AF67] font-medium block truncate">
                      {cat.subtitle}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base lg:text-[15px] xl:text-lg font-normal tracking-wide text-[#FAF6EE] group-hover:text-[#F3E7C4] transition-colors leading-tight line-clamp-2">
                      {cat.title}
                    </h3>
                  </div>
                  <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full border border-[#B8924A]/40 bg-[#120F0D]/70 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-[#D4AF67] group-hover:bg-[#B8924A] group-hover:text-[#120F0D]">
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF67] group-hover:text-[#120F0D] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
