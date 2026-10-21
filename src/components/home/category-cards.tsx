import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ModernCategory {
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

const MODERN_CATEGORIES: ModernCategory[] = [
  {
    title: "Blue Sapphires",
    subtitle: "Royal & Cornflower Ceylon Sapphires",
    image: "/images/concept03/category-blue-sapphires.webp",
    link: "/gems/category/blue-gems",
  },
  {
    title: "Coloured Gemstones",
    subtitle: "Rubies, Padparadschas & Fancy Gems",
    image: "/images/concept03/category-coloured-gems.webp",
    link: "/gems/category/pink-purple-gems",
  },
  {
    title: "Gem Collections",
    subtitle: "Trade Parcels & Curated Crystal Trays",
    image: "/images/concept03/category-rough-gems.webp",
    link: "/gems/category/gem-collections",
  },
];


export function CategoryCards() {
  return (
    <section className="bg-[#FAF8F5] pb-20 sm:pb-28 pt-2">
      <div className="container-luxe">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold mb-2">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] font-normal">
            Explore Our Collection
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="h-px w-10 bg-[#B8924A]/40" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B8924A]" />
            <span className="h-px w-10 bg-[#B8924A]/40" />
          </div>
        </div>

        {/* 3 Modern Ceylon Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {MODERN_CATEGORIES.map((cat) => (
            <div key={cat.title}>
              <Link
                href={cat.link}
                className="group block bg-[#F5EFEB] rounded-xl overflow-hidden border border-[#B8924A]/25 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#B8924A]/70 hover:shadow-[0_20px_40px_-15px_rgba(25,20,15,0.14)]"
              >
                {/* Staged Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF8F5]">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 767px) calc(100vw - clamp(2rem, 8vw, 10rem)), 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Card Label matching Concept 03 banner */}
                <div className="p-5 sm:p-6 bg-[#FAF8F5] flex items-center justify-between border-t border-[#B8924A]/15">
                  <div>
                    <h3 className="font-serif text-xl font-normal text-[#1D1B18] group-hover:text-[#0E2A20] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-[#736B63] mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#B8924A]/40 text-[#0E2A20] flex items-center justify-center transition-all duration-300 group-hover:bg-[#0E2A20] group-hover:border-[#0E2A20] group-hover:text-[#FAF8F5] group-hover:translate-x-1 shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
