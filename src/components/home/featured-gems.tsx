import Link from "next/link";
import Image from "next/image";
import { Gemstone } from "@/types/gem";
import { Badge } from "@/components/ui/badge";
import { formatGemCarats, formatGemPrice } from "@/lib/utils";
import { ArrowRight, Eye } from "lucide-react";
import {
  FeaturedGemEnquiryProvider,
  GemEnquiryButton,
} from "@/components/home/featured-gem-enquiry";

interface FeaturedGemsProps {
  gems: Gemstone[];
}

export function FeaturedGems({ gems }: FeaturedGemsProps) {
  return (
    <section className="relative pt-8 pb-24 lg:pb-32 bg-[#FAF6EE] overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-24 w-[42rem] h-[42rem] rounded-full bg-[#1B3A8A]/[0.06] blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 bottom-0 w-[36rem] h-[36rem] rounded-full bg-[#B8924A]/[0.08] blur-[100px]"
      />

      <div className="relative container-luxe">
        {/* Section header */}
        <div className="mb-12 lg:mb-16">
          <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
            <p className="flex items-center justify-center md:justify-start gap-3 text-xs uppercase tracking-[0.35em] text-[#80601C]">
              <span className="w-8 h-px bg-[#B8924A]" />
              The Vault Selection
            </p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl xl:text-6xl text-[#5E0F1E] font-normal leading-[1.05]">
              Featured <em className="text-[#80601C]">Gemstones</em>
            </h2>
            <p className="mt-5 text-base xl:text-lg font-light text-[#2B2B2B]/70 leading-relaxed">
              Hand-selected, laboratory-certified specimens from our Ratnapura atelier, each one traceable
              from mine head to final polish.
            </p>
          </div>
        </div>

        {/* Gemstones Grid */}
        <FeaturedGemEnquiryProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
          {gems.slice(0, 8).map((gem, index) => {
            const primaryImage = gem.images[0] || {
              url: "/isuru_images/blue1.webp",
              alt: `${gem.name}`,
            };

            return (
              <article
                key={gem.id}
                className={`group bg-[#FDFBF7] border border-[#B8924A]/25 overflow-hidden transition-[border-color,box-shadow,translate] duration-500 hover:-translate-y-1.5 hover:border-[#B8924A]/80 hover:shadow-[0_30px_60px_-20px_rgba(94,15,30,0.28)] flex-col justify-between ${
                  index >= 6 ? "hidden 2xl:flex" : "flex"
                }`}
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="shine-sweep relative aspect-4/3 w-full bg-[#FAF6EE] overflow-hidden border-b border-[#B8924A]/20">
                    <Link href={`/gems/${gem.slug}`} className="block w-full h-full relative">
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt || `${gem.name} from ${gem.origin}`}
                        fill
                        sizes="(max-width: 640px) calc(100vw - clamp(2rem, 8vw, 10rem)), (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      />
                      <span className="absolute inset-0 bg-linear-to-t from-[#120F0D]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="absolute left-1/2 bottom-4 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 inline-flex items-center gap-2 bg-[#FAF6EE]/95 backdrop-blur px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#5E0F1E] whitespace-nowrap">
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </span>
                    </Link>

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                      <Badge variant="maroon" className="text-[9px] py-0.5 px-2">
                        {gem.origin.split(/[\s,]/)[0]}
                      </Badge>
                      {gem.treatment.toLowerCase().includes("unheated") && (
                        <Badge variant="unheated" className="text-[9px] py-0.5 px-2 bg-[#FAF6EE]/90">
                          100% Unheated
                        </Badge>
                      )}
                    </div>

                    {gem.certificate.lab && (
                      <div className="absolute top-3 right-3 pointer-events-none">
                        <Badge variant="gold" className="text-[9px] py-0.5 px-2 bg-[#FAF6EE]/90">
                          {gem.certificate.lab}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Gem Details */}
                  <div className="p-5 xl:p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-[#80601C] font-medium uppercase tracking-[0.18em]">
                      <span className="truncate pr-2">{gem.variety}</span>
                      <span className="text-[#1B3A8A] font-semibold shrink-0">{formatGemCarats(gem.carat)}</span>
                    </div>

                    <h3 className="font-serif text-xl xl:text-[1.35rem] font-normal text-[#5E0F1E] group-hover:text-[#420A15] transition-colors leading-snug line-clamp-2 min-h-[2.8em]">
                      <Link href={`/gems/${gem.slug}`}>{gem.name}</Link>
                    </h3>
                  </div>
                </div>

                {/* Footer with Price and Actions */}
                <div className="p-5 xl:p-6 pt-0 xl:pt-0">
                  <div className="pt-4 border-t border-[#B8924A]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#2B2B2B]/50 block">Price</span>
                      <span className="font-serif text-xl xl:text-2xl text-[#1B3A8A]">
                        {formatGemPrice(gem.price, gem.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <GemEnquiryButton
                        gem={{
                          name: gem.name,
                          variety: gem.variety,
                          carat: gem.carat,
                          origin: gem.origin,
                          cut: gem.cut,
                          treatment: gem.treatment,
                          price: gem.price,
                          currency: gem.currency,
                          certificate: { lab: gem.certificate.lab },
                        }}
                      />

                      <Link
                        href={`/gems/${gem.slug}`}
                        className="p-2.5 border border-[#B8924A]/30 text-[#2B2B2B] hover:text-[#5E0F1E] hover:border-[#B8924A] transition-colors"
                        aria-label={`View full details of ${gem.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
          </div>
        </FeaturedGemEnquiryProvider>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            href="/gems"
            className="modern-pill-primary group shadow-lg"
          >
            <span>View Complete Vault</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF67] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
