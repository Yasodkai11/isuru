import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export function CategoryCards() {
  const categories = [
    {
      id: "blue-sapphires",
      title: "Blue Sapphires",
      subtitle: "Royal & Cornflower Hues",
      specimensCount: "12 Certified Specimens",
      description: "Velvety open-color azure clarity from Ratnapura & Elahera",
      image: "/isuru_images/categories1.jpg",
      alt: "Natural Ceylon Blue Sapphire Specimen on Gem Tray",
      link: "/gems/category/blue-sapphires",
      accent: "#1B3A8A",
    },
    {
      id: "coloured-gemstones",
      title: "Coloured Gemstones",
      subtitle: "Padparadscha, Rubies & Yellows",
      specimensCount: "8 Rare Formations",
      description: "Sunset lotus blossom pink-orange and imperial Pushparaga gold",
      image: "/isuru_images/categories2.jpg",
      alt: "Coloured Ceylon Gemstones, Rubies and Padparadscha",
      link: "/gems/category/padparadscha",
      accent: "#DB2777",
    },
    {
      id: "rough-gemstones",
      title: "Rough Gemstones",
      subtitle: "Uncut Crystals & Rare Asterism",
      specimensCount: "Collector Mineral Lots",
      description: "Earth-mined uncut alluvial corundum crystals direct from pits",
      image: "/isuru_images/categories3.jpg",
      alt: "Uncut Ceylon Rough Sapphire Crystals and Asterism Star",
      link: "/gems/category/rare-collector",
      accent: "#B8924A",
    },
  ];

  return (
    <section className="py-14 lg:py-20 bg-[#161210] border-b border-[#B8924A]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold">
            <Sparkles className="w-3 h-3 text-[#D4AF67]" />
            <span>Curated Classifications</span>
            <Sparkles className="w-3 h-3 text-[#D4AF67]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF6EE] font-normal tracking-wide">
            Precious Gemstone Categories
          </h2>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF67] to-transparent mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#FAF6EE]/75 max-w-md mx-auto">
            Directly sorted from the alluvial illam gravels of Ratnapura, graded according to classical CIBJO and NGJA standards.
          </p>
        </div>

        {/* 3 Elevated Banner Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.link}
              className="group block relative overflow-hidden bg-[#201A16] border border-[#B8924A]/40 rounded-xs p-5 sm:p-6 transition-all duration-400 hover:border-[#D4AF67] hover:bg-[#28201B] hover:shadow-[0_12px_35px_rgba(184,146,74,0.22)]"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Gem Aperture Thumbnail */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xs overflow-hidden border border-[#B8924A]/40 bg-[#120F0D] shadow-md">
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-115"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card Title & Link */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#B8924A] font-medium block truncate">
                      {cat.subtitle}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#FAF6EE] font-medium group-hover:text-[#D4AF67] transition-colors flex items-center justify-between gap-2 mt-1">
                    <span className="truncate">{cat.title}</span>
                    <ArrowRight className="w-4 h-4 text-[#B8924A] shrink-0 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[#D4AF67]" />
                  </h3>

                  <p className="text-[11px] text-[#FAF6EE]/70 line-clamp-2 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-[#B8924A]/20 flex items-center justify-between text-[10px] text-[#D4AF67] font-mono">
                    <span>{cat.specimensCount}</span>
                    <span className="text-[9px] uppercase tracking-widest text-[#FAF6EE]/50 group-hover:text-[#FAF6EE]/90 transition-colors">
                      Explore Vault →
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Subtle Gold Hairline Accent on Hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF67] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
