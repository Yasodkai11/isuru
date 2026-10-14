"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gem,
  FolderTree,
  ShoppingBag,
  Inbox,
  Users,
  Image as ImageIcon,
  Globe,
  Settings,
  ExternalLink,
  Shield,
  ChevronRight,
  Sparkles,
  X,
  UserCheck,
  LogOut,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { BRAND } from "@/lib/constants";
import { logoutAction } from "@/actions/auth";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  currentUser?: {
    id: string;
    email: string;
    fullName: string;
    role?: string;
    department?: string;
  } | null;
}

export function AdminSidebar({
  mobileOpen = false,
  onCloseMobile,
  currentUser,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { gemstones, orders, enquiries, staff } = useAdminStore();

  const pendingOrdersCount = orders.filter((o) => o.status === "pending_verification").length;
  const pendingEnquiriesCount = enquiries.filter((e) => e.status === "pending").length;

  const navItems = [
    {
      title: "Main",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          label: "Gemstones (Products)",
          href: "/admin/products",
          icon: Gem,
          badge: gemstones.length,
          badgeColor: "bg-[#B8924A]/20 text-[#5E0F1E]",
        },
        {
          label: "Categories",
          href: "/admin/categories",
          icon: FolderTree,
        },
        {
          label: "Orders",
          href: "/admin/orders",
          icon: ShoppingBag,
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
          badgeColor: "bg-[#5E0F1E] text-[#FAF6EE]",
        },
        {
          label: "Enquiries Inbox",
          href: "/admin/enquiries",
          icon: Inbox,
          badge: pendingEnquiriesCount > 0 ? pendingEnquiriesCount : undefined,
          badgeColor: "bg-[#1B3A8A] text-[#FAF6EE]",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          label: "Staff & Access",
          href: "/admin/staff",
          icon: UserCheck,
          badge: staff?.length,
          badgeColor: "bg-[#B8924A]/30 text-[#FAF6EE]",
        },
        {
          label: "Customers & VIPs",
          href: "/admin/customers",
          icon: Users,
        },
        {
          label: "Media Library",
          href: "/admin/media",
          icon: ImageIcon,
        },
        {
          label: "SEO Manager",
          href: "/admin/seo",
          icon: Globe,
        },
        {
          label: "Settings",
          href: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#18191B] text-[#FAF6EE] border-r border-[#B8924A]/20 select-none">
      {/* Brand & Crest Header */}
      <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
        <Link
          href="/admin"
          className="flex items-center gap-3.5 group focus:outline-none"
          onClick={onCloseMobile}
        >
          <div className="w-11 h-11 rounded-xs bg-gradient-to-br from-[#5E0F1E] via-[#3A0812] to-[#18191B] border border-[#B8924A]/60 flex items-center justify-center p-1.5 shadow-lg group-hover:border-[#B8924A] transition-all">
            <Image
              src="/isuru_images/logo-isuru-symbol.png"
              alt="Isuru Gems"
              width={36}
              height={20}
              className="w-full h-auto object-contain brightness-110"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl tracking-wider text-[#FAF6EE] font-medium leading-none">
                ISURU GEMS
              </span>
              <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[#B8924A]/25 text-[#D4AF67] border border-[#B8924A]/40 font-bold">
                ADMIN
              </span>
            </div>
            <p className="text-xs tracking-wider text-white/60 uppercase mt-1 font-medium">
              Ceylon Vault Console
            </p>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xs transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-3.5 py-6 space-y-7">
        {navItems.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <span className="px-3.5 text-xs uppercase tracking-[0.2em] font-bold text-[#B8924A]">
              {section.title}
            </span>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3.5 py-3 text-sm font-medium rounded-xs transition-all group ${
                      isActive
                        ? "bg-[#5E0F1E]/70 text-[#FAF6EE] border-l-3 border-[#B8924A] shadow-inner font-semibold"
                        : "text-white/75 hover:bg-white/5 hover:text-white hover:pl-4"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors ${
                          isActive
                            ? "text-[#D4AF67]"
                            : "text-white/50 group-hover:text-[#B8924A]"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge !== undefined && (
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${item.badgeColor || "bg-white/10 text-white"}`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-[#B8924A]" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Security & Storefront Footer Link */}
      <div className="p-4 sm:p-5 border-t border-white/10 bg-black/20 space-y-3.5">
        <div className="p-3.5 bg-gradient-to-r from-[#5E0F1E]/30 to-transparent border border-[#B8924A]/25 rounded-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#B8924A]" />
            <div className="text-xs leading-tight">
              <p className="font-semibold text-white/90">NGJA Verified</p>
              <p className="text-white/60 mt-0.5">Lic. #8419</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3.5 py-2.5 text-sm font-medium text-white/75 hover:text-white bg-white/5 hover:bg-white/10 rounded-xs transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#B8924A]" />
            <span>Live Storefront</span>
          </span>
          <ExternalLink className="w-4 h-4 text-white/40" />
        </Link>

        <button
          type="button"
          onClick={async () => {
            await logoutAction();
          }}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm font-medium text-red-300 hover:text-red-200 bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 rounded-xs transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="truncate">Sign Out of Vault</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] shadow-2xl z-10 animate-gentle-fade">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
