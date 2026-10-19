import type { Metadata } from "next";
import Link from "next/link";
import { GoldDivider } from "@/components/layout/gold-divider";
import { Compass, HeartHandshake, Shield } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Heritage & Mining Provenance",
    description:
      "Four decades of ethical, artisanal gemstone discovery in Ratnapura, Sri Lanka. Learn about our traditional sustainable pit mining and unheated sapphire heritage.",
    alternates: {
      canonical: "/about",
    },
  };
}

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-20 lg:py-24 bg-[#FAF6EE] min-h-screen">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-20 lg:space-y-28">
        {/* Editorial Heading */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold">
            Serendib’s Living Legacy
          </span>
          {/* Strictly the single H1 for this page */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#5E0F1E] font-normal leading-[1.15]">
            The Chronicle of Ceylon Gems & Isuru Legacy
          </h1>
          <p className="text-base sm:text-lg text-[#2B2B2B]/75 leading-relaxed max-w-2xl mx-auto">
            From the fertile valleys of Sabaragamuwa to the royal treasuries of ancient monarchs, Sri Lanka has remained the sapphire capital of the earth for over 2,500 years.
          </p>
          <GoldDivider withOrnament className="my-8 max-w-xs mx-auto" />
        </div>

        {/* Feature Video - Cinematic Gallery Presentation */}
        <div className="max-w-5xl mx-auto w-full">
          <div className="relative p-2 sm:p-3 bg-[#FDFBF7] border border-[#B8924A]/35 shadow-xl">
            {/* Museum Corner Accents */}
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#B8924A]" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#B8924A]" />
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#B8924A]" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#B8924A]" />

            <div className="relative aspect-16/9 w-full bg-black/90 overflow-hidden shadow-inner">
              <video
                className="h-full w-full object-cover"
                src="/isuru_images/our%20story%20video.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
                aria-label="Our story video"
              />
            </div>
          </div>
          {/* Subtle Provenance Hallmark Bar */}
          <div className="mt-3 px-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#B8924A]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#B8924A]" />
              Sabaragamuwa Province, Sri Lanka
            </span>
            <span className="text-[#2B2B2B]/60 hidden sm:inline">
              Documentary Footage • Traditional Pit Extraction
            </span>
          </div>
        </div>

        {/* Narrative Chapters - 2-Column Editorial Spreads on Desktop */}
        <div className="space-y-16 lg:space-y-24">
          {/* Chapter 1 */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
                <span className="w-6 h-px bg-[#B8924A]" />
                Chapter 01
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#5E0F1E] font-normal leading-snug">
                1. The Earth of Ratnapura — City of Gems
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#2B2B2B]/85 leading-relaxed font-normal">
                <p>
                  In the southwestern foothills of Sri Lanka, beneath verdant tea slopes and tropical jungle, rests an ancient geological formation known as <em>Illam</em>: a prehistoric gravel layer dense with water-worn corundum crystals, chrysoberyls, spinels, and garnets washed down from the sacred mountain ranges of Sri Pada (Adam’s Peak).
                </p>
                <p>
                  Unlike industrial open-cast diamond mines in other continents, Ceylon gem mining is intrinsically artisanal. Small groups of generational miners dig vertical shafts timbered with local rubber-tree logs, descending twenty to fifty feet to reach the gem-bearing gravel.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative bg-[#FDFBF7] border border-[#B8924A]/30 p-8 sm:p-10 shadow-sm space-y-5">
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#B8924A]/60" />
                <div className="text-[#B8924A]/40 font-serif text-5xl leading-none select-none">“</div>
                <blockquote className="font-serif text-lg sm:text-xl text-[#5E0F1E] leading-relaxed -mt-3 italic">
                  Ceylon gem mining is intrinsically artisanal. Small groups of generational miners dig vertical shafts timbered with local rubber-tree logs.
                </blockquote>
                <div className="pt-3 border-t border-[#B8924A]/20 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#B8924A] font-medium">
                  <span>The Illam Formation</span>
                  <span>20–50 Ft Shafts</span>
                </div>
              </div>
            </div>
          </section>

          <GoldDivider withOrnament className="opacity-40" />

          {/* Chapter 2 - Alternating Column Layout on Desktop */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative bg-[#FDFBF7] border border-[#B8924A]/30 p-8 sm:p-10 shadow-sm space-y-5">
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#B8924A]/60" />
                <div className="text-[#B8924A]/40 font-serif text-5xl leading-none select-none">“</div>
                <blockquote className="font-serif text-lg sm:text-xl text-[#5E0F1E] leading-relaxed -mt-3 italic">
                  When the miner holds the basket up to the afternoon sunlight, the unmistakable electric gleam reveals itself to human eyes for the first time.
                </blockquote>
                <div className="pt-3 border-t border-[#B8924A]/20 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#B8924A] font-medium">
                  <span>Wattiya Technique</span>
                  <span>Unheated Sapphires</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
                <span className="w-6 h-px bg-[#B8924A]" />
                Chapter 02
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#5E0F1E] font-normal leading-snug">
                2. Washing with the Wattiya
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#2B2B2B]/85 leading-relaxed font-normal">
                <p>
                  Once hoisted to the surface in rattan baskets, the gravel is washed in circular conical wicker baskets known as <em>wattiya</em> in slow-moving river eddies or purpose-built reservoirs. Skilled lapidaries swirl the basket with a hypnotic rhythmic cadence, allowing heavier sapphire pebbles to settle gracefully into the conical vertex.
                </p>
                <p>
                  When the miner holds the basket up to the afternoon sunlight, the unmistakable electric gleam of an unheated Royal Blue sapphire or the delicate sunset pink-orange of a Padparadscha reveals itself to human eyes for the first time in geological history.
                </p>
              </div>
            </div>
          </section>

          <GoldDivider withOrnament className="opacity-40" />

          {/* Chapter 3 */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
                <span className="w-6 h-px bg-[#B8924A]" />
                Chapter 03
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#5E0F1E] font-normal leading-snug">
                3. Environmental Stewardship & Fair Wages
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#2B2B2B]/85 leading-relaxed font-normal">
                <p>
                  Sri Lankan law, enforced by the National Gem and Jewellery Authority (NGJA), prohibits heavy mechanical excavators in gem-mining zones to preserve the hydrological balance of river basins and protect agricultural paddy fields.
                </p>
                <p>
                  Every mining pit funded by Isuru Gems is legally required to be backfilled and re-planted with native flora once the illam is harvested. Furthermore, our miners participate in traditional profit-sharing (<em>karuval</em>), earning direct equity dividends on every exceptional crystal recovered.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative bg-[#FDFBF7] border border-[#B8924A]/30 p-8 sm:p-10 shadow-sm space-y-5">
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#B8924A]/60" />
                <div className="text-[#B8924A]/40 font-serif text-5xl leading-none select-none">“</div>
                <blockquote className="font-serif text-lg sm:text-xl text-[#5E0F1E] leading-relaxed -mt-3 italic">
                  Every mining pit funded by Isuru Gems is legally required to be backfilled and re-planted with native flora once the illam is harvested.
                </blockquote>
                <div className="pt-3 border-t border-[#B8924A]/20 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#B8924A] font-medium">
                  <span>NGJA Regulated</span>
                  <span>Karuval Profit Sharing</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Pillars Grid - Architectural Pledges */}
        <div className="pt-6">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold">
              The Pillars of Serendib
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E]">
              Our Three Unbroken Pledges
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="relative p-8 sm:p-10 bg-[#FDFBF7] border border-[#B8924A]/30 text-center space-y-4 hover:border-[#B8924A] transition-all duration-300 hover:shadow-lg group">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#B8924A]/60 to-transparent group-hover:via-[#B8924A]" />
              <div className="w-14 h-14 rounded-full bg-[#FAF6EE] border border-[#B8924A]/35 mx-auto flex items-center justify-center text-[#B8924A] group-hover:scale-105 transition-transform duration-300 shadow-xs">
                <Compass className="w-6 h-6 text-[#B8924A]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#5E0F1E]">Direct Mine Source</h3>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/75 leading-relaxed">
                No brokers or multi-tier markups. Direct from Ratnapura and Elahera pits to our lapidary.
              </p>
            </div>

            <div className="relative p-8 sm:p-10 bg-[#FDFBF7] border border-[#B8924A]/30 text-center space-y-4 hover:border-[#B8924A] transition-all duration-300 hover:shadow-lg group">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#B8924A]/60 to-transparent group-hover:via-[#B8924A]" />
              <div className="w-14 h-14 rounded-full bg-[#FAF6EE] border border-[#B8924A]/35 mx-auto flex items-center justify-center text-[#B8924A] group-hover:scale-105 transition-transform duration-300 shadow-xs">
                <Shield className="w-6 h-6 text-[#B8924A]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#5E0F1E]">Natural & Unheated</h3>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/75 leading-relaxed">
                We champion pure unheated stones that retain their natural earth energy and crystal structure.
              </p>
            </div>

            <div className="relative p-8 sm:p-10 bg-[#FDFBF7] border border-[#B8924A]/30 text-center space-y-4 hover:border-[#B8924A] transition-all duration-300 hover:shadow-lg group">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#B8924A]/60 to-transparent group-hover:via-[#B8924A]" />
              <div className="w-14 h-14 rounded-full bg-[#FAF6EE] border border-[#B8924A]/35 mx-auto flex items-center justify-center text-[#B8924A] group-hover:scale-105 transition-transform duration-300 shadow-xs">
                <HeartHandshake className="w-6 h-6 text-[#B8924A]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#5E0F1E]">Artisan Equity</h3>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/75 leading-relaxed">
                Generous profit dividends returned directly to the mining families of Sabaragamuwa province.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 sm:pt-12 pb-4">
          <Link
            href="/gems"
            className="inline-flex items-center justify-center bg-[#5E0F1E] text-[#FAF6EE] px-10 py-4.5 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#420A15] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 border border-[#B8924A]/40"
          >
            Explore Our Ethical Ceylon Vault
          </Link>
        </div>
      </div>
    </div>
  );
}
