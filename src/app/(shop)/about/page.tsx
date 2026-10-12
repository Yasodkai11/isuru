import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GoldDivider } from "@/components/layout/gold-divider";
import { Compass, HeartHandshake, Shield } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Heritage & Mining Provenance | Isuru Gems Ceylon",
    description:
      "Four decades of ethical, artisanal gemstone discovery in Ratnapura, Sri Lanka. Learn about our traditional sustainable pit mining and unheated sapphire heritage.",
  };
}

export default function AboutPage() {
  return (
    <div className="py-16 bg-[#FAF6EE] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Heading */}
        <div className="text-center space-y-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold">
            Serendib’s Living Legacy
          </span>
          {/* Strictly the single H1 for this page */}
          <h1 className="font-serif text-4xl sm:text-5xl text-[#5E0F1E] font-normal leading-tight">
            The Chronicle of Ceylon Gems & Isuru Legacy
          </h1>
          <p className="text-base text-[#2B2B2B]/75 leading-relaxed max-w-2xl mx-auto">
            From the fertile valleys of Sabaragamuwa to the royal treasuries of ancient monarchs, Sri Lanka has remained the sapphire capital of the earth for over 2,500 years.
          </p>
          <GoldDivider withOrnament className="my-8 max-w-xs mx-auto" />
        </div>

        {/* Feature Image */}
        <div className="relative aspect-16/9 w-full bg-[#FAF6EE] border border-[#B8924A]/30 overflow-hidden shadow-md">
          <Image
            src="/isuru_images/hero1.jpg"
            alt="Artisanal gemstone sorting and evaluation in Ratnapura Sri Lanka showing natural raw crystals and cut sapphires"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Narrative Chapters */}
        <div className="space-y-12 text-sm text-[#2B2B2B]/85 leading-relaxed font-normal">
          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-[#5E0F1E]">
              1. The Earth of Ratnapura — City of Gems
            </h2>
            <p>
              In the southwestern foothills of Sri Lanka, beneath verdant tea slopes and tropical jungle, rests an ancient geological formation known as <em>Illam</em>: a prehistoric gravel layer dense with water-worn corundum crystals, chrysoberyls, spinels, and garnets washed down from the sacred mountain ranges of Sri Pada (Adam’s Peak).
            </p>
            <p>
              Unlike industrial open-cast diamond mines in other continents, Ceylon gem mining is intrinsically artisanal. Small groups of generational miners dig vertical shafts timbered with local rubber-tree logs, descending twenty to fifty feet to reach the gem-bearing gravel.
            </p>
          </section>

          <GoldDivider className="opacity-40" />

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-[#5E0F1E]">
              2. Washing with the Wattiya
            </h2>
            <p>
              Once hoisted to the surface in rattan baskets, the gravel is washed in circular conical wicker baskets known as <em>wattiya</em> in slow-moving river eddies or purpose-built reservoirs. Skilled lapidaries swirl the basket with a hypnotic rhythmic cadence, allowing heavier sapphire pebbles to settle gracefully into the conical vertex.
            </p>
            <p>
              When the miner holds the basket up to the afternoon sunlight, the unmistakable electric gleam of an unheated Royal Blue sapphire or the delicate sunset pink-orange of a Padparadscha reveals itself to human eyes for the first time in geological history.
            </p>
          </section>

          <GoldDivider className="opacity-40" />

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-[#5E0F1E]">
              3. Environmental Stewardship & Fair Wages
            </h2>
            <p>
              Sri Lankan law, enforced by the National Gem and Jewellery Authority (NGJA), prohibits heavy mechanical excavators in gem-mining zones to preserve the hydrological balance of river basins and protect agricultural paddy fields.
            </p>
            <p>
              Every mining pit funded by Isuru Gems is legally required to be backfilled and re-planted with native flora once the illam is harvested. Furthermore, our miners participate in traditional profit-sharing (<em>karuval</em>), earning direct equity dividends on every exceptional crystal recovered.
            </p>
          </section>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 bg-[#FDFBF7] border border-[#B8924A]/25 text-center space-y-3">
            <Compass className="w-6 h-6 text-[#B8924A] mx-auto" />
            <h3 className="font-serif text-lg text-[#5E0F1E]">Direct Mine Source</h3>
            <p className="text-xs text-[#2B2B2B]/70">No brokers or multi-tier markups. Direct from Ratnapura and Elahera pits to our lapidary.</p>
          </div>
          <div className="p-6 bg-[#FDFBF7] border border-[#B8924A]/25 text-center space-y-3">
            <Shield className="w-6 h-6 text-[#B8924A] mx-auto" />
            <h3 className="font-serif text-lg text-[#5E0F1E]">Natural & Unheated</h3>
            <p className="text-xs text-[#2B2B2B]/70">We champion pure unheated stones that retain their natural earth energy and crystal structure.</p>
          </div>
          <div className="p-6 bg-[#FDFBF7] border border-[#B8924A]/25 text-center space-y-3">
            <HeartHandshake className="w-6 h-6 text-[#B8924A] mx-auto" />
            <h3 className="font-serif text-lg text-[#5E0F1E]">Artisan Equity</h3>
            <p className="text-xs text-[#2B2B2B]/70">Generous profit dividends returned directly to the mining families of Sabaragamuwa province.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/gems"
            className="inline-flex items-center justify-center bg-[#5E0F1E] text-[#FAF6EE] px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#420A15] transition-subtle"
          >
            Explore Our Ethical Ceylon Vault
          </Link>
        </div>
      </div>
    </div>
  );
}
