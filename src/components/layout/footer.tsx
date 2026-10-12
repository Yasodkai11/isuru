"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants";
import { GoldDivider } from "@/components/layout/gold-divider";
import { Award, MapPin, Mail, Phone, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <footer className="bg-[#2B2B2B] text-[#FAF6EE] pt-10 pb-6 border-t border-[#B8924A]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Provenance */}
          <div className="space-y-3 lg:col-span-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
              Ceylon Legacy • Since 1984
            </span>
            <h3 className="font-serif text-2xl text-[#FAF6EE] font-normal tracking-wide">
              ISURU GEMS
            </h3>
            <p className="text-xs text-[#FAF6EE]/75 leading-relaxed max-w-sm">
              Ethically sourced, unheated Ceylon sapphires and precious island gemstones directly from the alluvial riverbeds and historic pits of Ratnapura, Sri Lanka.
            </p>
            <div className="flex items-center gap-2 pt-0.5 text-[11px] text-[#B8924A]">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>National Gem & Jewellery Authority #NGJA-8419</span>
            </div>

            {/* Newsletter */}
            <div className="pt-1 max-w-sm">
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-[#B8924A] bg-[#FAF6EE]/5 border border-[#B8924A]/30 p-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B8924A]" />
                  <span>Thank you. You are enrolled for confidential acquisitions.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    required
                    placeholder="Enter email for rare lots"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#FAF6EE]/10 border-[#B8924A]/30 text-[#FAF6EE] placeholder:text-[#FAF6EE]/40 text-xs h-8"
                  />
                  <Button type="submit" variant="gold" size="sm" className="h-8 px-3 text-xs shrink-0">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Nav & Collections */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#B8924A] font-semibold">
              Explore
            </h4>
            <ul className="space-y-1.5 text-xs text-[#FAF6EE]/80">
              <li>
                <Link href="/" className="hover:text-[#B8924A] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/gems" className="hover:text-[#B8924A] transition-colors">
                  Gemstones Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#B8924A] transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="hover:text-[#B8924A] transition-colors">
                  Wholesale & B2B
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#B8924A] transition-colors">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Precious Ceylon Gems */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#B8924A] font-semibold">
              Gem Varieties
            </h4>
            <ul className="space-y-1.5 text-xs text-[#FAF6EE]/80">
              <li>
                <Link href="/gems?variety=Royal+Blue" className="hover:text-[#B8924A] transition-colors">
                  Royal Blue Sapphires
                </Link>
              </li>
              <li>
                <Link href="/gems?variety=Padparadscha" className="hover:text-[#B8924A] transition-colors">
                  Padparadscha Sapphires
                </Link>
              </li>
              <li>
                <Link href="/gems?variety=Cornflower" className="hover:text-[#B8924A] transition-colors">
                  Cornflower Blue Sapphires
                </Link>
              </li>
              <li>
                <Link href="/gems?variety=Yellow" className="hover:text-[#B8924A] transition-colors">
                  Pushparaga (Yellow)
                </Link>
              </li>
              <li>
                <Link href="/gems?variety=Star" className="hover:text-[#B8924A] transition-colors">
                  Asterism Star Sapphires
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Concierge */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#B8924A] font-semibold">
              Salons & Concierge
            </h4>
            <div className="space-y-2 text-xs text-[#FAF6EE]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B8924A] shrink-0 mt-0.5" />
                <span>{BRAND.headquarters}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B8924A] shrink-0" />
                <span>{BRAND.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B8924A] shrink-0" />
                <span>{BRAND.email}</span>
              </div>
              <div className="pt-1">
                <Link
                  href="/contact"
                  className="text-[11px] text-[#B8924A] hover:underline uppercase tracking-wider inline-flex items-center gap-1"
                >
                  Schedule Private Viewing →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <GoldDivider withOrnament className="my-5 opacity-35" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FAF6EE]/60 gap-3">
          <p>© {new Date().getFullYear()} {BRAND.name}. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span>100% Conflict-Free Natural Mined</span>
            <span>•</span>
            <span>NGJA Registered Exporter</span>
            <span>•</span>
            <span>Zero Synthetic Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
