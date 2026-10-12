import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatCurrency, formatCarats } from "@/lib/utils";

interface FloatingGem {
  name: string;
  carat: number;
  price: number;
  image: string;
  slug: string;
  glow: string;
  position: string;
  size: string;
  duration: string;
  delay: string;
}

const FLOATING_GEMS: FloatingGem[] = [
  {
    name: "Royal Blue Sapphire",
    carat: 4.28,
    price: 18500,
    image: "/isuru_images/blue1.jpg",
    slug: "ceylon-royal-blue-sapphire-4-28ct",
    glow: "rgba(42, 81, 184, 0.55)",
    position: "top-[8%] left-[34%]",
    size: "w-28 h-28 xl:w-32 xl:h-32",
    duration: "7s",
    delay: "0s",
  },
  {
    name: "Padparadscha",
    carat: 3.15,
    price: 24000,
    image: "/isuru_images/pink1.jpg",
    slug: "padparadscha-sapphire-oval-3-15ct",
    glow: "rgba(236, 72, 153, 0.5)",
    position: "top-[30%] right-[4%]",
    size: "w-24 h-24 xl:w-28 xl:h-28",
    duration: "8s",
    delay: "-2s",
  },
  {
    name: "Yellow Sapphire",
    carat: 5.6,
    price: 11400,
    image: "/isuru_images/yellow.jpg",
    slug: "golden-yellow-sapphire-pushparaga-5-60ct",
    glow: "rgba(234, 179, 8, 0.5)",
    position: "bottom-[10%] right-[22%]",
    size: "w-20 h-20 xl:w-24 xl:h-24",
    duration: "6.5s",
    delay: "-4s",
  },
  {
    name: "Ceylon Ruby",
    carat: 2.05,
    price: 16200,
    image: "/isuru_images/pink2.jpg",
    slug: "ceylon-ruby-cushion-2-05ct",
    glow: "rgba(225, 29, 72, 0.5)",
    position: "bottom-[24%] left-[10%]",
    size: "w-20 h-20 xl:w-24 xl:h-24",
    duration: "7.5s",
    delay: "-1s",
  },
  {
    name: "Green Sapphire",
    carat: 4.1,
    price: 15800,
    image: "/isuru_images/green.jpg",
    slug: "ceylon-vivid-cornflower-oval-4-10ct",
    glow: "rgba(16, 185, 129, 0.45)",
    position: "top-[4%] right-[16%]",
    size: "w-16 h-16 xl:w-20 xl:h-20",
    duration: "9s",
    delay: "-3s",
  },
];

function FloatingGemPod({ gem }: { gem: FloatingGem }) {
  return (
    <Link
      href={`/gems/${gem.slug}`}
      aria-label={`${gem.name}, ${formatCarats(gem.carat)}`}
      className={`group absolute ${gem.position} animate-gem-float hover:[animation-play-state:paused] focus-visible:outline-none`}
      style={{ animationDuration: gem.duration, animationDelay: gem.delay }}
    >
      <span
        aria-hidden
        className="absolute -inset-6 rounded-full opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${gem.glow} 0%, transparent 70%)` }}
      />
      <span
        className={`relative block ${gem.size} rounded-full overflow-hidden border border-[#D4AF67]/70 bg-[#120F0D] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 group-focus-visible:border-[#FAF6EE]`}
      >
        <Image src={gem.image} alt="" fill sizes="128px" className="object-cover scale-125" />
        <span aria-hidden className="absolute top-[18%] right-[22%] w-1.5 h-1.5 rounded-full bg-white/90" />
      </span>

      <span className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-xs border border-[#B8924A]/60 bg-[#1A1410] px-3 py-2 text-center opacity-0 translate-y-1 transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
        <span className="block font-serif text-sm text-[#FAF6EE]">{gem.name}</span>
        <span className="block text-[11px] text-[#D4AF67]">
          {formatCarats(gem.carat)} · {formatCurrency(gem.price, "USD")}
        </span>
      </span>
    </Link>
  );
}

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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32 sm:pt-20 lg:pt-28 lg:pb-40 grid lg:grid-cols-2 gap-10 items-center">
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

        <div className="relative hidden lg:block h-[440px]">
          {FLOATING_GEMS.map((gem) => (
            <FloatingGemPod key={gem.slug} gem={gem} />
          ))}
        </div>

        <div className="lg:hidden flex items-center gap-5 overflow-x-auto pt-4 pb-10 -mx-4 px-6">
          {FLOATING_GEMS.map((gem) => (
            <Link
              key={gem.slug}
              href={`/gems/${gem.slug}`}
              className="shrink-0 animate-gem-float text-center"
              style={{ animationDuration: gem.duration, animationDelay: gem.delay }}
            >
              <span className="relative block w-16 h-16 mx-auto rounded-full overflow-hidden border border-[#D4AF67]/70 bg-[#120F0D]">
                <Image src={gem.image} alt={gem.name} fill sizes="64px" className="object-cover scale-125" />
              </span>
              <span className="mt-2 block text-[11px] text-[#FAF6EE]/80 whitespace-nowrap">{gem.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
