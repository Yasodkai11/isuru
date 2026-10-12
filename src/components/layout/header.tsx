"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { ShoppingBag, User, Menu, Search, X } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { Input } from "@/components/ui/input";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gemstones", href: "/gems" },
  { label: "Our Story", href: "/about" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const itemCount = useCartStore((s) => s.items.length);
  const setOpen = useCartStore((s) => s.setOpen);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/gems?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF6EE] border-b border-[#B8924A]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-[#5E0F1E] hover:bg-[#B8924A]/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="group flex flex-col items-center leading-none">
            <Image
              src="/isuru_images/logo-isuru.png"
              alt=""
              width={64}
              height={24}
              sizes="64px"
              className="w-14 sm:w-16 h-auto mix-blend-multiply"
              priority
            />
            <span className="font-serif text-xl sm:text-2xl tracking-[0.08em] text-[#5E0F1E] font-medium group-hover:text-[#420A15] transition-colors">
              ISURU GEMS
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold mt-0.5">
              Sri Lanka
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden lg:flex items-center gap-8 mr-6 text-xs uppercase tracking-[0.2em] font-medium text-[#2B2B2B]">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-1 border-b transition-colors ${
                    isActive
                      ? "text-[#5E0F1E] font-semibold border-[#B8924A]"
                      : "border-transparent hover:text-[#5E0F1E] hover:border-[#B8924A]/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-[#B8924A] hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 transition-colors"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/login"
            className="p-2 text-[#2B2B2B] hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 transition-colors"
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="relative p-2 text-[#5E0F1E] hover:text-[#420A15] hover:bg-[#B8924A]/10 transition-colors cursor-pointer"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-0 w-4 h-4 rounded-full bg-[#B8924A] text-[#FAF6EE] text-[9px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="bg-[#FAF6EE] border-t border-[#B8924A]/30 py-3 px-4 sm:px-8 animate-gentle-fade shadow-md">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <Input
                type="search"
                autoFocus
                placeholder="Search sapphires, rubies, padparadscha..."
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

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
