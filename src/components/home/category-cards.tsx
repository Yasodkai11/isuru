import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GoldDivider } from "@/components/layout/gold-divider";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CategoryCards() {
  const categories = [
    {
      id: "blue-sapphires",
      title: "Royal & Cornflower Blue Sapphires",
      tagline: "The Sovereign Gem of Ratnapura",
      description:
        "Prized by international royalty and museums for their velvety azure clarity that retains vivid fire in any light without secondary grey.",
      caratRange: "1.50 – 15.00+ Carats",
      origin: "Ratnapura & Elahera",
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      alt: "Exquisite faceted Ceylon blue sapphire reflecting pure azure light",
      link: "/gems/category/blue-sapphires",
      badge: "Signature Collection",
    },
    {
      id: "padparadscha",
      title: "Padparadscha & Fancy Sapphires",
      tagline: "Sacred Lotus Blossom Sunset Hues",
      description:
        "The exceptionally rare marriage of delicate lotus pink and golden sunset orange, historically found almost exclusively in Sri Lanka's gravels.",
      caratRange: "1.00 – 8.50+ Carats",
      origin: "Pelmadulla & Balangoda",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      alt: "Rare Ceylon Padparadscha gemstone with radiant pink-orange lotus hues",
      link: "/gems/category/padparadscha",
      badge: "World’s Rarest Corundum",
    },
    {
      id: "rare-collector",
      title: "Collector’s Ceylon Treasures",
      tagline: "Asterism Star Sapphires & Rubies",
      description:
        "Sharp six-ray asterism star sapphires, natural untreated Ceylon rubies, and phenomenal color-change chrysoberyl alexandrites.",
      caratRange: "Museum & Investment Grade",
      origin: "Ratnapura Historic Mines",
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      alt: "Collector grade Ceylon precious gem showcasing natural asterism and fine fire",
      link: "/gems/category/rare-collector",
      badge: "Collector & Investment",
    },
  ];

  return (
    <section className="py-20 bg-[#FAF6EE] border-b border-[#B8924A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold block">
            Curated Classifications
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-normal leading-tight">
            Precious Gemstone Categories
          </h2>
          <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
            Directly sorted from the washed illam (gem gravel) of Sri Lanka. Each category represents the pinnacle of natural untreated Ceylon mineralogy.
          </p>
          <GoldDivider withOrnament className="my-5" />
        </div>

        {/* 3 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group bg-[#FDFBF7] border border-[#B8924A]/30 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between hover:border-[#B8924A]"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F2EADB]">
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/60 via-transparent to-transparent opacity-80" />

                  {/* Top Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <Badge variant="gold" className="text-[9px] py-0.5 px-2.5">
                      <Sparkles className="w-3 h-3 mr-1 inline text-[#B8924A]" />
                      {cat.badge}
                    </Badge>
                  </div>

                  {/* Origin Tag */}
                  <div className="absolute bottom-3 left-3.5 text-[#FAF6EE] text-[11px] font-medium tracking-wider">
                    <span>{cat.origin}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#B8924A] font-semibold block">
                    {cat.tagline}
                  </span>
                  <h3 className="font-serif text-2xl text-[#5E0F1E] font-medium leading-snug group-hover:text-[#420A15] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#2B2B2B]/70 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="pt-3 border-t border-[#B8924A]/15 flex items-center justify-between text-[11px] text-[#2B2B2B]/80 font-medium">
                    <span>Carat Weight:</span>
                    <span className="text-[#1B3A8A] font-semibold">{cat.caratRange}</span>
                  </div>
                </div>
              </div>

              {/* Card CTA Footer */}
              <div className="p-6 pt-0 mt-2">
                <Link
                  href={cat.link}
                  className="inline-flex items-center justify-between w-full border border-[#B8924A]/60 bg-[#FAF6EE] py-3 px-4 text-xs uppercase tracking-[0.18em] font-medium text-[#5E0F1E] group-hover:bg-[#5E0F1E] group-hover:text-[#FAF6EE] group-hover:border-[#5E0F1E] transition-all duration-300"
                >
                  <span>Explore Specimens</span>
                  <ArrowRight className="w-4 h-4 text-[#B8924A] group-hover:text-[#FAF6EE] transition-colors" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
