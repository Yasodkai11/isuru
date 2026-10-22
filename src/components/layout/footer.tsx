import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants";
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { BackToTop, NewsletterSignup } from "./newsletter-signup";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gemstones Catalog", href: "/gems" },
  { label: "Our Story & Heritage", href: "/about" },
  { label: "Certification & Authenticity", href: "/certificates" },
  { label: "Wholesale & B2B", href: "/wholesale" },
  { label: "Contact Concierge", href: "/contact" },
];

const SHOP_BY_COLOUR = [
  { label: "Blue Sapphires", href: "/gemstones?color=Blue" },
  { label: "Rubies & Red Gems", href: "/gemstones?color=Red" },
  { label: "Padparadscha & Pink", href: "/gemstones?color=Pink" },
  { label: "Yellow & Gold Gems", href: "/gemstones?color=Yellow" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#120F0D] text-[#FAF6EE] border-t border-[#B8924A]/30">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#D4AF67] to-transparent" />

      <div className="container-luxe pt-6 sm:pt-8 pb-5 sm:pb-6">
        {/* Tightly merged Newsletter band */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#FAF6EE]/10">
          <div className="max-w-md">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF67] font-semibold block">
              Ceylon Legacy · Since 1964
            </span>
            <h2 className="mt-1 font-serif text-lg sm:text-xl font-normal leading-snug">
              Be first to preview <em className="text-gold-gradient font-serif">rare acquisitions</em>
            </h2>
            <p className="mt-0.5 text-xs text-[#FAF6EE]/60">
              Private previews of newly cut stones direct from our Ratnapura atelier.
            </p>
          </div>
          <div className="w-full md:w-auto md:min-w-[320px] lg:min-w-[380px]">
            <NewsletterSignup />
          </div>
        </div>

        {/* Compact 4-Column Grid (2 Columns on Mobile, 4 Columns on Desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-6 sm:pt-7">
          {/* Column 1: Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-2.5">
            <Link href="/" className="inline-block" aria-label="Isuru Ceylon Home">
              <Image
                src="/isuru_images/logo-isuru-light.webp"
                alt="Isuru Ceylon"
                width={160}
                height={50}
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-[#FAF6EE]/65 leading-relaxed pr-2">
              Ethically sourced, unheated Ceylon sapphires and precious island gemstones directly from Ratnapura, Sri Lanka.
            </p>
          </div>

          {/* Column 2: Explore */}
          <nav aria-label="Explore" className="col-span-1">
            <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF67] font-semibold mb-2.5">
              Explore
            </h3>
            <ul className="space-y-1.5 text-xs text-[#FAF6EE]/75">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#D4AF67] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Shop by Colour */}
          <nav aria-label="Shop by Colour" className="col-span-1">
            <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF67] font-semibold mb-2.5">
              Shop by Colour
            </h3>
            <ul className="space-y-1.5 text-xs text-[#FAF6EE]/75">
              {SHOP_BY_COLOUR.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-[#D4AF67] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/gemstones"
                  className="inline-flex items-center gap-1 text-xs font-serif text-[#D4AF67] hover:text-[#FAF6EE] transition-colors group"
                >
                  <span>View all colours</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 4: Salons & Concierge */}
          <div className="col-span-2 sm:col-span-1 space-y-2">
            <h3 className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF67] font-semibold mb-2.5">
              Salons & Concierge
            </h3>
            <div className="space-y-2 text-xs text-[#FAF6EE]/75">
              <a
                href={BRAND.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-[#FAF6EE] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#D4AF67] shrink-0 mt-0.5" />
                <span className="line-clamp-2">{BRAND.headquarters}</span>
              </a>
              <a
                href={`tel:${BRAND.phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-2 hover:text-[#FAF6EE] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF67] shrink-0" />
                <span>{BRAND.phone}</span>
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-2 hover:text-[#FAF6EE] transition-colors truncate"
              >
                <Mail className="w-3.5 h-3.5 text-[#D4AF67] shrink-0" />
                <span className="truncate">{BRAND.email}</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#D4AF67] hover:text-[#FAF6EE] pt-1"
              >
                <span>Schedule Viewing</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-[#FAF6EE]/10 flex flex-col lg:flex-row items-center justify-between gap-3 text-[11px] text-[#FAF6EE]/50">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 text-center lg:text-left">
            <span>© {new Date().getFullYear()} {BRAND.name}. All Rights Reserved.</span>
            <span className="hidden sm:inline text-[#FAF6EE]/20">•</span>
            <span>
              Designed & Developed by{" "}
              <a
                href="https://premierdigital.lk/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF67] hover:text-[#F3DFA2] underline underline-offset-2 transition-colors"
              >
                Premier Digital
              </a>
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 tracking-wide">
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
