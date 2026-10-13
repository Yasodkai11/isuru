import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#120F0D] text-[#FAF6EE]">
      <Image
        src="/isuru_images/hero1.jpg"
        alt="Ceylon sapphires and rubies on a carved wooden tray"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[65%_center]"
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#120F0D] via-[#120F0D]/80 to-[#120F0D]/40" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#120F0D] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-36 lg:pt-36 lg:pb-48">
        <div className="max-w-xl animate-gentle-fade">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#D4AF67]">
            Ratnapura · Sri Lanka · Since 1984
          </p>

          <h1 className="mt-5 font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05]">
            The Timeless Beauty of Ceylon.
          </h1>

          <div className="mt-6 flex items-center gap-3 max-w-xs" aria-hidden>
            <span className="h-px flex-1 bg-linear-to-r from-[#D4AF67] to-transparent" />
            <span className="w-2 h-2 rotate-45 border border-[#D4AF67]" />
            <span className="h-px flex-1 bg-linear-to-l from-[#D4AF67] to-transparent" />
          </div>

          <p className="mt-6 text-base sm:text-lg text-[#FAF6EE]/80 leading-relaxed">
            Natural, certified sapphires direct from the mines of Ratnapura.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link
              href="/gems"
              className="inline-flex items-center justify-center gap-2 bg-[#5E0F1E] hover:bg-[#7E1529] border border-[#B8924A]/60 px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
            >
              Explore Gemstones
              <ArrowRight className="w-4 h-4 text-[#D4AF67]" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-[#B8924A]/70 bg-[#120F0D]/40 hover:border-[#D4AF67] hover:text-[#D4AF67] px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-colors"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
