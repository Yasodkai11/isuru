"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { ShoppingBag, User, Menu, Search, Shield, PhoneCall, X } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { MobileNav } from "./mobile-nav";
import { Input } from "@/components/ui/input";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { items, setOpen } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Gemstones", href: "/gems" },
    { label: "Our Story", href: "/about" },
    { label: "Wholesale", href: "/wholesale" },
    { label: "Contact", href: "/contact" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/gems?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#B8924A]/25 transition-subtle">
      {/* Top Heritage Banner */}
      <div className="bg-[#5E0F1E] text-[#FAF6EE] text-[11px] tracking-[0.2em] uppercase py-2 px-4 text-center border-b border-[#B8924A]/40 flex items-center justify-between font-medium">
        <div className="hidden md:flex items-center gap-2 text-[#FAF6EE]/80">
          <Shield className="w-3.5 h-3.5 text-[#B8924A]" />
          <span>National Gem & Jewellery Authority (NGJA) Licensed</span>
        </div>
        <div className="mx-auto">
          <span>Mine-to-Market Ceylon Sapphires • Direct from Ratnapura</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[#FAF6EE]/80">
          <PhoneCall className="w-3.5 h-3.5 text-[#B8924A]" />
          <span>Concierge: {BRAND.phone}</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Mobile hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-[#5E0F1E] hover:bg-[#B8924A]/10 transition-colors focus:outline-none"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Left Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs uppercase tracking-[0.2em] font-medium text-[#2B2B2B]">
            {navLinks.slice(0, 3).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-1 relative transition-colors ${
                    isActive
                      ? "text-[#5E0F1E] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#B8924A]"
                      : "hover:text-[#5E0F1E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#B8924A] hover:after:w-full after:transition-all"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Central Crest & Logo */}
          <div className="flex flex-col items-center justify-center text-center">
            <Link href="/" className="group flex flex-col items-center">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#B8924A] font-semibold">
                Est. {BRAND.established} • Ratnapura
              </span>
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-wide text-[#5E0F1E] font-medium leading-none mt-1 group-hover:text-[#420A15] transition-colors">
                ISURU GEMS
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[#1B3A8A] font-medium mt-1">
                Ceylon Fine Gemstones
              </span>
            </Link>
          </div>

          {/* Right Navigation & Utility Actions */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Right Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs uppercase tracking-[0.2em] font-medium text-[#2B2B2B]">
              {navLinks.slice(3).map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-1 relative transition-colors ${
                      isActive
                        ? "text-[#5E0F1E] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#B8924A]"
                        : "hover:text-[#5E0F1E] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#B8924A] hover:after:w-full after:transition-all"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="h-4 w-[1px] bg-[#B8924A]/30 hidden lg:block" />

            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#2B2B2B] hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 transition-colors"
              aria-label="Toggle search bar"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8924A]" />
            </button>

            {/* Account Login */}
            <Link
              href="/login"
              className="p-2 text-[#2B2B2B] hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 transition-colors"
              aria-label="Account Login"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Vault Cart Trigger */}
            <button
              onClick={() => setOpen(true)}
              className="relative p-2 text-[#5E0F1E] hover:text-[#420A15] hover:bg-[#B8924A]/10 transition-colors cursor-pointer"
              aria-label="Open acquisition vault"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {items.length > 0 && (
                <span className="absolute top-1 right-0 w-4 h-4 rounded-full bg-[#B8924A] text-[#FAF6EE] text-[9px] font-bold flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Quick Search Bar */}
      {searchOpen && (
        <div className="bg-[#FAF6EE] border-t border-b border-[#B8924A]/30 py-3 px-4 sm:px-8 animate-gentle-fade shadow-md">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto flex items-center gap-3"
          >
            <div className="relative flex-1">
              <Input
                type="search"
                autoFocus
                placeholder="Search natural Ceylon sapphires, padparadscha, ruby..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startIcon={<Search className="w-4 h-4 text-[#B8924A]" />}
                className="bg-[#FDFBF7] text-sm h-11"
              />
            </div>
            <button
              type="submit"
              className="bg-[#5E0F1E] text-[#FAF6EE] px-5 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-[#420A15] transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-[#2B2B2B]/70 hover:text-[#5E0F1E] transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
