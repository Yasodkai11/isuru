"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Search, ShieldCheck, Phone, Mail, MessageSquare } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/gems?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Gemstones", href: "/gems" },
    { label: "Our Story", href: "/about" },
    { label: "Wholesale", href: "/wholesale" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-end" role="dialog" aria-modal="true">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-[#2B2B2B]/60 backdrop-blur-xs transition-opacity animate-gentle-fade"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-[#FAF6EE] border-l border-[#B8924A]/40 h-full p-6 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl animate-gentle-fade">
        <div className="space-y-6">
          {/* Header & Close */}
          <div className="flex items-center justify-between pb-4 border-b border-[#B8924A]/25">
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold block">
                Serendib Legacy • Est. 1984
              </span>
              <span className="font-serif text-2xl text-[#5E0F1E] font-medium tracking-wide">
                ISURU GEMS
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#5E0F1E] hover:text-[#420A15] hover:bg-[#B8924A]/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search blue sapphires, rubies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startIcon={<Search className="w-4 h-4 text-[#B8924A]" />}
                className="bg-[#FDFBF7] text-xs h-10"
              />
            </div>
            <Button type="submit" variant="gold" size="sm" className="w-full justify-center">
              Search Catalog
            </Button>
          </form>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block py-3 px-3 text-xs uppercase tracking-[0.22em] font-medium text-[#2B2B2B] hover:text-[#5E0F1E] hover:bg-[#F2EADB]/60 border-b border-[#B8924A]/15 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Drawer Footer & Concierge Info */}
        <div className="pt-6 mt-6 border-t border-[#B8924A]/25 space-y-4">
          <div className="flex items-center gap-2 text-[10px] text-[#5E0F1E] uppercase tracking-wider font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#B8924A] shrink-0" />
            <span>NGJA Govt. Licensed Gem Exporter</span>
          </div>

          <div className="space-y-2 text-xs text-[#2B2B2B]/80">
            <a
              href={`tel:${BRAND.phone}`}
              className="flex items-center gap-2.5 hover:text-[#5E0F1E] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#B8924A]" />
              <span>{BRAND.phone}</span>
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="flex items-center gap-2.5 hover:text-[#5E0F1E] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#B8924A]" />
              <span>{BRAND.email}</span>
            </a>
            <a
              href={`https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-[#1B3A8A] font-medium hover:underline"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#B8924A]" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
