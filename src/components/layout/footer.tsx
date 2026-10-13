"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants";
import { Award, MapPin, Mail, Phone, CheckCircle2, ArrowUp, ArrowRight } from "lucide-react";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gemstones Catalog", href: "/gems" },
  { label: "Our Story & Heritage", href: "/about" },
  { label: "Wholesale & B2B", href: "/wholesale" },
  { label: "Certificates", href: "/certificates" },
  { label: "Contact Concierge", href: "/contact" },
];

const VARIETY_LINKS = [
  { label: "Royal Blue Sapphires", href: "/gems?variety=Royal+Blue" },
  { label: "Natural Ceylon Rubies", href: "/gems/category/ceylon-rubies" },
  { label: "Padparadscha Sapphires", href: "/gems?variety=Padparadscha" },
  { label: "Chrysoberyl Alexandrite", href: "/gems/category/alexandrite" },
  { label: "Pushparaga (Yellow)", href: "/gems?variety=Yellow" },
  { label: "Asterism Star Sapphires", href: "/gems?variety=Star" },
];

export function Footer() {
  const pathname = usePathname();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#120F0D] text-[#FAF6EE] border-t border-[#B8924A]/30">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#D4AF67] to-transparent" />

      <div className="container-luxe pt-20 lg:pt-24 pb-10">
        {/* Newsletter band */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end pb-14 lg:pb-16 border-b border-[#FAF6EE]/10">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF67]">Ceylon Legacy · Since 1984</p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl xl:text-5xl font-normal leading-tight">
              Be first to see <em className="text-gold-gradient">rare arrivals</em>
            </h2>
            <p className="mt-4 text-sm xl:text-base font-light text-[#FAF6EE]/60 max-w-lg">
              Private previews of newly cut stones from our Ratnapura atelier, sent to you before they reach the public catalogue.
            </p>
          </div>
          <div>
            {subscribed ? (
              <div className="flex items-center gap-3 text-sm text-[#D4AF67] border border-[#B8924A]/30 p-4">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Thank you. You are enrolled for confidential acquisitions.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border-b border-[#D4AF67]/50 focus-within:border-[#D4AF67] transition-colors">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent py-4 text-base xl:text-lg font-light text-[#FAF6EE] placeholder:text-[#FAF6EE]/35 focus:outline-none"
                />
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D4AF67] hover:text-[#F3DFA2] pl-4 cursor-pointer"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pt-14 lg:pt-16">
          <div className="space-y-5 lg:col-span-4">
            <h3 className="font-serif text-3xl tracking-[0.12em] font-normal">ISURU GEMS</h3>
            <p className="text-sm font-light text-[#FAF6EE]/65 leading-relaxed max-w-sm">
              Ethically sourced, unheated Ceylon sapphires and precious island gemstones directly from the alluvial riverbeds and historic pits of Ratnapura, Sri Lanka.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#D4AF67]">
              <Award className="w-4 h-4 shrink-0" />
              <span>National Gem & Jewellery Authority #NGJA-8419</span>
            </div>
          </div>

          <nav aria-label="Explore" className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-xs uppercase tracking-[0.3em] text-[#D4AF67] mb-5">Explore</h4>
            <ul className="space-y-3 text-sm font-light text-[#FAF6EE]/70">
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
            <h4 className="text-xs uppercase tracking-[0.3em] text-[#D4AF67] mb-5">Gem Varieties</h4>
            <ul className="space-y-3 text-sm font-light text-[#FAF6EE]/70">
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
            <h4 className="text-xs uppercase tracking-[0.3em] text-[#D4AF67] mb-5">Salons & Concierge</h4>
            <div className="space-y-4 text-sm font-light text-[#FAF6EE]/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF67] shrink-0 mt-0.5" />
                <span>{BRAND.headquarters}</span>
              </div>
              <a href={`tel:${BRAND.phone}`} className="flex items-center gap-3 hover:text-[#FAF6EE] transition-colors">
                <Phone className="w-4 h-4 text-[#D4AF67] shrink-0" />
                <span>{BRAND.phone}</span>
              </a>
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 hover:text-[#FAF6EE] transition-colors">
                <Mail className="w-4 h-4 text-[#D4AF67] shrink-0" />
                <span>{BRAND.email}</span>
              </a>
              <Link
                href="/contact"
                className="link-underline inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D4AF67] pt-1"
              >
                Schedule Private Viewing
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div
          aria-hidden="true"
          className="mt-16 lg:mt-20 select-none text-center font-serif leading-none tracking-[0.08em] text-transparent [-webkit-text-stroke:1px_rgba(212,175,103,0.22)] text-[17vw] lg:text-[13vw] 2xl:text-[12rem]"
        >
          ISURU GEMS
        </div>

        <div className="mt-8 pt-8 border-t border-[#FAF6EE]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#FAF6EE]/50">
          <p>© {new Date().getFullYear()} {BRAND.name}. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 tracking-wide">
            <span>100% Conflict-Free Natural Mined</span>
            <span className="text-[#D4AF67]" aria-hidden="true">✦</span>
            <span>NGJA Registered Exporter</span>
            <span className="text-[#D4AF67]" aria-hidden="true">✦</span>
            <span>Zero Synthetic Policy</span>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 uppercase tracking-[0.25em] text-[#D4AF67] hover:text-[#F3DFA2] cursor-pointer"
          >
            Back to top
            <span className="w-8 h-8 rounded-full border border-[#D4AF67]/40 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
