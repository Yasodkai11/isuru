import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants";
import { SEO_CONFIG } from "@/lib/seo-config";
import { MapPin, Mail, Phone, ArrowRight, BookOpen } from "lucide-react";
import { BackToTop, NewsletterSignup } from "./newsletter-signup";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gemstones Catalog", href: "/gems" },
  { label: "Our Story & Heritage", href: "/about" },
  { label: "Certification & Authenticity", href: "/certificates" },
  { label: "Wholesale & B2B Parcels", href: "/wholesale" },
  { label: "Contact Concierge", href: "/contact" },
];

const GUIDES_LINKS = [
  { label: "Sapphire Buying Guide", href: "/guides/ceylon-blue-sapphire-buying-guide" },
  { label: "Padparadscha Guide", href: "/guides/padparadscha-sapphire-guide" },
  { label: "Natural vs. Heated Guide", href: "/guides/natural-vs-heated-gemstones-guide" },
  { label: "Pigeon Blood Ruby Guide", href: "/guides/pigeon-blood-ruby-guide" },
  { label: "Certificate Reading Guide", href: "/guides/how-to-read-gemstone-certificate" },
  { label: "Ratnapura Mining Heritage", href: "/guides/ratnapura-gem-mining-heritage" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#120F0D] text-[#FAF6EE] border-t border-[#B8924A]/30">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#D4AF67] to-transparent" />

      <div className="container-luxe pt-6 sm:pt-8 pb-5 sm:pb-6">
        {/* Tightly merged Newsletter band */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#FAF6EE]/10">
          <div className="max-w-md">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF67] font-semibold block">
              {SEO_CONFIG.brand.name} · Since 1964
            </span>
            <h2 className="mt-1 font-serif text-lg sm:text-xl font-normal leading-snug">
              Be first to preview <em className="text-gold-gradient font-serif">rare acquisitions</em>
            </h2>
            <p className="mt-1 text-sm text-[#FAF6EE]/75">
              Private previews of unheated stones direct from our Ratnapura bureau.
            </p>
          </div>
          <div className="w-full md:w-auto md:min-w-[320px] lg:min-w-[380px]">
            <NewsletterSignup />
          </div>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-6 sm:pt-7">
          {/* Column 1: Brand & Entity Information */}
          <div className="col-span-2 sm:col-span-1 space-y-2.5">
            <Link href="/" className="inline-block" aria-label="Isuru Ceylon Gems Home">
              <Image
                src="/isuru_images/logo-isuru-light.webp"
                alt="Isuru Ceylon Gems"
                width={160}
                height={50}
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-[#FAF6EE]/80 leading-relaxed pr-2">
              {SEO_CONFIG.brand.name} is a licensed Sri Lankan gemstone dealer (NGJA Reg: {SEO_CONFIG.brand.licenseNumber}), specializing in unheated natural Ceylon sapphires, rubies, and collector stones.
            </p>
            <div className="pt-1 text-xs text-[#D4AF67]">
              <span>Est. 1964 · Heritage 1922</span>
            </div>
          </div>

          {/* Column 2: Explore */}
          <nav aria-label="Explore" className="col-span-1">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[#D4AF67] font-semibold mb-2.5">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-[#FAF6EE]/85">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#D4AF67] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Gemological Knowledge Guides */}
          <nav aria-label="Gemological Guides" className="col-span-1">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[#D4AF67] font-semibold mb-2.5 flex items-center gap-1.5">
              <span>Knowledge Guides</span>
            </h3>
            <ul className="space-y-2 text-sm text-[#FAF6EE]/85">
              {GUIDES_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#D4AF67] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-1 text-sm font-serif text-[#D4AF67] hover:text-[#FAF6EE] transition-colors"
                >
                  <span>All Guides Index →</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 4: Physical Bureau & Concierge (NAP) */}
          <div className="col-span-2 sm:col-span-1 space-y-2.5">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[#D4AF67] font-semibold mb-2.5">
              Physical Bureau
            </h3>
            <div className="space-y-3 text-sm text-[#FAF6EE]/85">

              {/* Ratnapura Bureau */}
              <div>
                <Link
                  href="/locations/ratnapura"
                  className="font-medium text-[#FAF6EE] hover:text-[#D4AF67] transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF67] shrink-0" />
                  <span>Ratnapura Lapidary Bureau</span>
                </Link>
                <p className="text-xs text-[#FAF6EE]/75 pl-5">
                  Main Street, Ratnapura, Sri Lanka
                </p>
              </div>

              {/* Phone & Email */}
              <div className="pt-1 space-y-1.5">
                <a
                  href={`tel:${SEO_CONFIG.contact.phone.replace(/[^\d+]/g, "")}`}
                  className="flex items-center gap-2 hover:text-[#FAF6EE] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF67] shrink-0" />
                  <span>{SEO_CONFIG.contact.phone}</span>
                </a>
                <a
                  href={`mailto:${SEO_CONFIG.contact.email}`}
                  className="flex items-center gap-2 hover:text-[#FAF6EE] transition-colors truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D4AF67] shrink-0" />
                  <span className="truncate">{SEO_CONFIG.contact.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-[#FAF6EE]/10 flex flex-col lg:flex-row items-center justify-between gap-3 text-xs text-[#FAF6EE]/70">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 text-center lg:text-left">
            <span>© {new Date().getFullYear()} {SEO_CONFIG.brand.name}. All Rights Reserved.</span>
            <span className="hidden sm:inline text-[#FAF6EE]/20">•</span>
            <span>NGJA License: {SEO_CONFIG.brand.licenseNumber}</span>
            <span className="hidden sm:inline text-[#FAF6EE]/20">•</span>
            <Link href="/llms.txt" className="text-[#D4AF67] hover:underline">
              llms.txt
            </Link>
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
