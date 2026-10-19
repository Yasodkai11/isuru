"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Search, Phone, Mail, User, LogOut, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CurrentUserSession, logoutAction } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  session?: CurrentUserSession;
}

export function MobileNav({ isOpen, onClose, session }: MobileNavProps) {
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
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end" role="dialog" aria-modal="true">
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
              <Link href="/" onClick={onClose} className="block">
                <Image
                  src="/isuru_images/logo-isuru.webp"
                  alt="Isuru Ceylon"
                  width={180}
                  height={56}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold block mt-1.5">
                Serendib Legacy • Est. 1984
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

            {/* Account / Vault Access */}
            {session?.isAuthenticated && session.user ? (
              <div className="pt-2 space-y-1 border-t border-[#B8924A]/30">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center gap-2 py-2.5 px-3 text-xs uppercase tracking-[0.2em] font-semibold text-[#5E0F1E] bg-[#F2EADB]/70 rounded-xs"
                >
                  <User className="w-4 h-4 text-[#B8924A]" />
                  <span>My Collector Vault</span>
                </Link>

                {session.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-2 py-2.5 px-3 text-xs uppercase tracking-[0.2em] font-semibold text-[#FAF6EE] bg-[#5E0F1E] rounded-xs"
                  >
                    <Sparkles className="w-4 h-4 text-[#D4AF67]" />
                    <span>Admin Vault Console</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={async () => {
                    onClose();
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    await logoutAction();
                  }}
                  className="flex items-center gap-2 w-full text-left py-2 px-3 text-xs text-red-700 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out ({session.user.fullName})</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-[#B8924A]/30">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 py-3 px-3 text-xs uppercase tracking-[0.22em] font-semibold text-[#FAF6EE] bg-[#5E0F1E] hover:bg-[#420A15] transition-colors rounded-xs shadow-xs"
                >
                  <User className="w-4 h-4 text-[#D4AF67]" />
                  <span>Collector Sign In</span>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Drawer Footer & Concierge Info */}
        <div className="pt-6 mt-6 border-t border-[#B8924A]/25 space-y-4">
          <div className="space-y-2 text-xs text-[#2B2B2B]/80">
            <a
              href={`tel:${BRAND.phone.replace(/[^\d+]/g, "")}`}
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
              <Image
                src="/isuru_images/whatsapp.png"
                alt="WhatsApp"
                width={16}
                height={16}
                className="w-4 h-4 object-contain rounded-full"
              />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
