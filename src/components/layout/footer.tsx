import Link from "next/link";
import Image from "next/image";
import { BRAND, CATEGORIES_CONFIG } from "@/lib/constants";
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { BackToTop, NewsletterSignup } from "./newsletter-signup";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gemstones Catalog", href: "/gems" },
  { label: "Our Story & Heritage", href: "/about" },
  { label: "Wholesale & B2B", href: "/wholesale" },
  { label: "Contact Concierge", href: "/contact" },
];

const VARIETY_LINKS = Object.entries(CATEGORIES_CONFIG).map(([slug, config]) => ({
  label: config.title,
  href: `/gems/category/${slug}`,
}));

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#120F0D] text-[#FAF6EE] border-t border-[#B8924A]/30">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#D4AF67] to-transparent" />

      <div className="container-luxe pt-10 lg:pt-14 pb-6 lg:pb-8">
        {/* Newsletter band */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center pb-8 lg:pb-10 border-b border-[#FAF6EE]/10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF67]">Ceylon Legacy · Since 1984</p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-normal leading-tight">
              Be first to see <em className="text-gold-gradient">rare arrivals</em>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm font-light text-[#FAF6EE]/60 max-w-md">
              Private previews of newly cut stones from our Ratnapura atelier, sent to you before they reach the public catalogue.
            </p>
          </div>
          <NewsletterSignup />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pt-8 lg:pt-10">
          <div className="space-y-3.5 lg:col-span-4">
            <Link href="/" className="inline-block" aria-label="Isuru Ceylon Home">
              <Image
                src="/isuru_images/logo-isuru-light.webp"
                alt="Isuru Ceylon"
                width={190}
                height={59}
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </Link>
            <p className="text-xs sm:text-sm font-light text-[#FAF6EE]/65 leading-relaxed max-w-sm">
              Ethically sourced, unheated Ceylon sapphires and precious island gemstones directly from the alluvial riverbeds and historic pits of Ratnapura, Sri Lanka.
            </p>
          </div>

          <nav aria-label="Explore" className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF67] mb-3">Explore</h3>
            <ul className="space-y-2 text-xs sm:text-sm font-light text-[#FAF6EE]/70">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline hover:text-[#FAF6EE] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Gem varieties" className="lg:col-span-2">
            <h3 className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF67] mb-3">Shop by Colour</h3>
            <ul className="space-y-2 text-xs sm:text-sm font-light text-[#FAF6EE]/70">
              {VARIETY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline hover:text-[#FAF6EE] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-10">
            <h3 className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF67] mb-3">Salons & Concierge</h3>
            <div className="space-y-2.5 text-xs sm:text-sm font-light text-[#FAF6EE]/70">
              <a
                href={BRAND.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-[#FAF6EE] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#D4AF67] shrink-0 mt-0.5" />
                <span>{BRAND.headquarters}</span>
              </a>
              <a href={`tel:${BRAND.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2.5 hover:text-[#FAF6EE] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#D4AF67] shrink-0" />
                <span>{BRAND.phone}</span>
              </a>
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2.5 hover:text-[#FAF6EE] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#D4AF67] shrink-0" />
                <span>{BRAND.email}</span>
              </a>
              <Link
                href="/contact"
                className="link-underline inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#D4AF67] pt-0.5"
              >
                Schedule Private Viewing
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#FAF6EE]/10 flex flex-col lg:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-[#FAF6EE]/50">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 text-center lg:text-left">
            <span>© {new Date().getFullYear()} {BRAND.name}. All Rights Reserved.</span>
            <span className="hidden sm:inline text-[#FAF6EE]/20">•</span>
            <span>
              Designed and Developed by{" "}
              <a
                href="https://premierdigital.lk/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF67] hover:text-[#F3DFA2] underline underline-offset-2 transition-colors"
              >
                Premier Digital Pvt Ltd
              </a>
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 tracking-wide">
            <span>100% Conflict-Free Natural Mined</span>
            <span className="text-[#D4AF67]" aria-hidden="true">✦</span>
            <span>Zero Synthetic Policy</span>
          </div>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
