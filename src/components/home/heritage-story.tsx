import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GoldDivider } from "@/components/layout/gold-divider";

export function HeritageStory() {
  return (
    <section className="py-20 lg:py-24 bg-[#FDFBF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative aspect-4/5 max-w-sm w-full mx-auto border border-[#B8924A]/40 p-2 bg-[#FAF6EE] shadow-xl">
          <div className="relative w-full h-full overflow-hidden bg-[#1A1410]">
            <Image
              src="/isuru_images/crown.jpg"
              alt="Ceylon sapphire crown jewellery"
              fill
              sizes="(max-width: 1024px) 90vw, 384px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold">
            Our Story
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#5E0F1E] font-normal leading-tight">
            Four decades in the gem city of Ratnapura
          </h2>
          <p className="text-base text-[#2B2B2B]/75 leading-relaxed max-w-lg">
            A family business sourcing rough stones directly from local miners and cutting them by hand to classical proportions.
          </p>
          <GoldDivider className="my-6 max-w-xs" />
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#FAF6EE] bg-[#5E0F1E] hover:bg-[#7E1529] px-6 py-3 font-semibold transition-colors border border-[#B8924A]/50"
            >
              Our Story
              <ArrowRight className="w-4 h-4 text-[#D4AF67]" />
            </Link>
            <Link
              href="/wholesale"
              className="text-xs uppercase tracking-[0.2em] text-[#5E0F1E] hover:text-[#B8924A] font-semibold transition-colors border-b border-[#B8924A]/40 pb-0.5"
            >
              Wholesale
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
