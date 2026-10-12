"use client";

import React from "react";
import Link from "next/link";
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
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { BRAND } from "@/lib/constants";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { gemstones, orders, enquiries } = useAdminStore();

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
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link
          href="/admin"
          className="flex items-center gap-3 group focus:outline-none"
          onClick={onCloseMobile}
        >
          <div className="w-10 h-10 rounded-xs bg-gradient-to-br from-[#5E0F1E] via-[#3A0812] to-[#18191B] border border-[#B8924A]/60 flex items-center justify-center shadow-lg group-hover:border-[#B8924A] transition-all">
            <Gem className="w-5 h-5 text-[#B8924A]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg tracking-wider text-[#FAF6EE] font-medium leading-none">
                ISURU GEMS
              </span>
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-xs bg-[#B8924A]/20 text-[#D4AF67] border border-[#B8924A]/30 font-semibold">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] tracking-wider text-white/50 uppercase mt-1">
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
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {navItems.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <span className="px-3 text-[10px] uppercase tracking-[0.25em] font-semibold text-[#B8924A]/80">
              {section.title}
            </span>
            <div className="mt-2 space-y-0.5">
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
                    className={`flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xs transition-all group ${
                      isActive
                        ? "bg-[#5E0F1E]/60 text-[#FAF6EE] border-l-2 border-[#B8924A] shadow-inner font-semibold"
                        : "text-white/70 hover:bg-white/5 hover:text-white hover:pl-3.5"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-[#D4AF67]"
                            : "text-white/40 group-hover:text-[#B8924A]"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || "bg-white/10 text-white"}`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#B8924A]" />
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
      <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
        <div className="p-3 bg-gradient-to-r from-[#5E0F1E]/30 to-transparent border border-[#B8924A]/25 rounded-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#B8924A]" />
            <div className="text-[10px] leading-tight">
              <p className="font-semibold text-white/90">NGJA Verified</p>
              <p className="text-white/50">Lic. #8419</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xs transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#B8924A]" />
            <span>Live Storefront</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-white/40" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-10 animate-gentle-fade">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
