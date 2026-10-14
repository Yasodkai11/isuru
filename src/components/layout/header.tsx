"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { ShoppingBag, User, Menu, Search, X, Phone, ShieldCheck, LogOut, Sparkles, ChevronDown } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/constants";
import { getCurrentUserAction, logoutAction, CurrentUserSession } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";

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
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [session, setSession] = useState<CurrentUserSession>({
    isAuthenticated: false,
    isAdmin: false,
    user: null,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadUser() {
      try {
        const res = await getCurrentUserAction();
        if (isMounted) setSession(res);
      } catch {}
    }
    loadUser();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      if (isMounted) {
        const res = await getCurrentUserAction();
        setSession(res);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [pathname]);

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
    <>
    <div className="hidden md:block bg-[#120F0D] text-[#FAF6EE]/75 text-[11px] tracking-[0.18em] uppercase border-b border-[#B8924A]/20">
      <div className="container-luxe h-9 flex items-center justify-between gap-6">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF67]" />
          NGJA Licensed · Certified Natural Ceylon Gemstones
        </span>
        <span className="hidden lg:block text-[#D4AF67]">Fully insured worldwide shipping</span>
        <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2 hover:text-[#D4AF67] transition-colors">
          <Phone className="w-3.5 h-3.5 text-[#D4AF67]" />
          {BRAND.phone}
        </a>
      </div>
    </div>
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF6EE]/85 backdrop-blur-xl border-[#B8924A]/30 shadow-[0_8px_30px_-12px_rgba(43,43,43,0.18)]"
          : "bg-[#FAF6EE] border-[#B8924A]/20"
      }`}
    >
      <div
        className={`container-luxe flex items-center justify-between gap-4 transition-[height] duration-500 ${
          scrolled ? "h-16" : "h-16 sm:h-20"
        }`}
      >
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
            <span className="font-serif text-xl sm:text-2xl tracking-[0.12em] text-[#5E0F1E] font-medium group-hover:text-[#420A15] transition-colors">
              ISURU GEMS
            </span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#B8924A] font-medium mt-0.5">
              Sri Lanka
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden lg:flex items-center gap-8 xl:gap-11 mr-6 xl:mr-10 text-[13px] uppercase tracking-[0.22em] text-[#2B2B2B]">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`link-underline py-1 transition-colors ${
                    isActive ? "text-[#5E0F1E] font-medium" : "hover:text-[#5E0F1E]"
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

          {/* Account Menu / Login Button */}
          {session.isAuthenticated && session.user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 hover:bg-[#B8924A]/10 rounded-xs transition-colors cursor-pointer text-left"
                aria-label="User account menu"
              >
                <div className="w-7 h-7 rounded-full bg-[#5E0F1E] text-[#FAF6EE] flex items-center justify-center font-serif font-bold text-xs border border-[#B8924A]/40 shadow-xs relative">
                  {session.user.fullName
                    ? session.user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "P"}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#FAF6EE]" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#B8924A] hidden sm:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FAF6EE] border border-[#B8924A]/40 shadow-xl p-3 text-xs z-50 animate-gentle-fade rounded-xs">
                  <div className="pb-2.5 mb-2 border-b border-[#B8924A]/20">
                    <p className="font-semibold text-[#5E0F1E] truncate">
                      {session.user.fullName}
                    </p>
                    <p className="text-[11px] text-[#2B2B2B]/70 truncate">
                      {session.user.email}
                    </p>
                    {session.isAdmin ? (
                      <span className="inline-block mt-1 text-[9px] uppercase tracking-wider bg-[#5E0F1E] text-[#FAF6EE] px-2 py-0.5 rounded-xs font-semibold">
                        Staff Administrator
                      </span>
                    ) : (
                      <span className="inline-block mt-1 text-[9px] uppercase tracking-wider bg-[#B8924A]/20 text-[#5E0F1E] px-2 py-0.5 rounded-xs font-semibold">
                        Registered Patron
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-2.5 py-1.5 text-[#2B2B2B] hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 rounded-xs transition-colors font-medium"
                    >
                      My Collector Vault
                    </Link>

                    {session.isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[#5E0F1E] hover:bg-[#5E0F1E]/10 rounded-xs transition-colors font-semibold"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#B8924A]" />
                        <span>Admin Vault Console</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#B8924A]/20">
                    <button
                      type="button"
                      onClick={async () => {
                        setUserMenuOpen(false);
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        await logoutAction();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-red-700 hover:bg-red-50 flex items-center gap-2 rounded-xs transition-colors font-medium cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="p-2 text-[#2B2B2B] hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 transition-colors"
              aria-label="Account sign in"
              title="Patron Sign In"
            >
              <User className="w-5 h-5" />
            </Link>
          )}

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

      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        session={session}
      />
    </header>
    </>
  );
}
