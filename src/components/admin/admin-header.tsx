"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  RotateCcw,
  User,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Gem,
  LogOut,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { formatCurrency } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";

interface AdminHeaderProps {
  onOpenMobile: () => void;
  currentUser?: {
    id: string;
    email: string;
    fullName: string;
    role?: string;
    department?: string;
  } | null;
}

export function AdminHeader({ onOpenMobile, currentUser }: AdminHeaderProps) {
  const pathname = usePathname();
  const { orders, enquiries, resetToDefaults, gemstones } = useAdminStore();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const pendingOrders = orders.filter((o) => o.status === "pending_verification");
  const pendingEnquiries = enquiries.filter((e) => e.status === "pending");
  const totalNotifications = pendingOrders.length + pendingEnquiries.length;

  const totalVaultValue = gemstones.reduce((sum, g) => sum + g.price, 0);

  // Compute breadcrumbs
  const pathSegments = pathname.split("/").filter(Boolean);
  const getBreadcrumbTitle = (seg: string) => {
    switch (seg) {
      case "admin":
        return "Dashboard";
      case "products":
        return "Gemstones";
      case "categories":
        return "Categories";
      case "orders":
        return "Orders";
      case "enquiries":
        return "Enquiries Inbox";
      case "customers":
        return "Customers CRM";
      case "media":
        return "Media Library";
      case "seo":
        return "SEO Manager";
      case "staff":
        return "Staff & Access";
      case "settings":
        return "Settings";
      default:
        return seg.charAt(0).toUpperCase() + seg.slice(1);
    }
  };

  const handleReset = () => {
    if (confirm("Reset admin demo data (gemstones, orders, inquiries, settings) to factory defaults?")) {
      resetToDefaults();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 sm:h-18 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#B8924A]/25 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 text-[#5E0F1E] hover:bg-[#B8924A]/10 rounded-xs transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Trail */}
        <nav className="flex items-center text-sm font-medium text-[#2B2B2B]/75 truncate">
          <Link
            href="/admin"
            className="hover:text-[#5E0F1E] transition-colors flex items-center gap-1.5"
          >
            <Gem className="w-4 h-4 text-[#B8924A]" />
            <span>Admin</span>
          </Link>

          {pathSegments.slice(1).map((segment, idx) => (
            <React.Fragment key={segment}>
              <ChevronRight className="w-4 h-4 mx-1.5 text-[#B8924A]/60 shrink-0" />
              <span className={`truncate ${idx === pathSegments.length - 2 ? "text-[#5E0F1E] font-semibold" : ""}`}>
                {getBreadcrumbTitle(segment)}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Quick Vault Worth Indicator */}
        <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 bg-[#F2EADB] border border-[#B8924A]/30 text-sm">
          <span className="text-xs uppercase tracking-wider text-[#5E0F1E] font-bold">
            Vault Valuation:
          </span>
          <span className="font-serif font-bold text-sm sm:text-base text-[#5E0F1E]">
            {formatCurrency(totalVaultValue)}
          </span>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={handleReset}
          title="Reset Demo Data to Initial Defaults"
          className="p-2 text-[#2B2B2B]/70 hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 rounded-xs transition-colors relative"
          aria-label="Reset demo dataset"
        >
          <RotateCcw className={`w-5 h-5 ${resetSuccess ? "text-emerald-600 animate-spin" : ""}`} />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-[#2B2B2B]/70 hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 rounded-xs transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {totalNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#5E0F1E] rounded-full ring-2 ring-[#FAF6EE]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FAF6EE] border border-[#B8924A]/40 shadow-2xl p-4 text-sm z-50 animate-gentle-fade rounded-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#B8924A]/20">
                <span className="font-bold uppercase tracking-wider text-xs text-[#5E0F1E]">
                  Vault Dispatch Alerts
                </span>
                <span className="text-xs text-[#2B2B2B]/70 font-semibold">
                  {totalNotifications} Pending
                </span>
              </div>

              <div className="py-2.5 space-y-2 max-h-72 overflow-y-auto">
                {pendingOrders.length === 0 && pendingEnquiries.length === 0 ? (
                  <div className="py-6 text-center text-[#2B2B2B]/60 italic text-sm">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-1.5 text-emerald-600" />
                    All gemstone dispatches and concierge inquiries are up to date.
                  </div>
                ) : (
                  <>
                    {pendingOrders.map((order) => (
                      <Link
                        key={order.id}
                        href="/admin/orders"
                        onClick={() => setNotificationsOpen(false)}
                        className="block p-3 bg-[#F2EADB]/60 hover:bg-[#F2EADB] border border-[#B8924A]/20 rounded-xs transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-[#5E0F1E]">{order.id}</span>
                          <span className="text-xs text-[#B8924A] font-bold">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                        <p className="text-xs text-[#2B2B2B]/80 mt-1 truncate">
                          {order.customerName} ({order.country}) • Needs verification
                        </p>
                      </Link>
                    ))}

                    {pendingEnquiries.map((enq) => (
                      <Link
                        key={enq.id}
                        href="/admin/enquiries"
                        onClick={() => setNotificationsOpen(false)}
                        className="block p-3 bg-[#1B3A8A]/5 hover:bg-[#1B3A8A]/10 border border-[#1B3A8A]/20 rounded-xs transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-[#1B3A8A]">{enq.fullName}</span>
                          <span className="text-xs text-[#1B3A8A] uppercase font-bold">
                            New Enquiry
                          </span>
                        </div>
                        <p className="text-xs text-[#2B2B2B]/80 mt-1 truncate">
                          {enq.gemName || "General Consultation"} • {enq.country}
                        </p>
                      </Link>
                    ))}
                  </>
                )}
              </div>

              <div className="pt-2.5 border-t border-[#B8924A]/20 flex justify-between text-xs">
                <Link
                  href="/admin/orders"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs text-[#5E0F1E] hover:underline font-semibold"
                >
                  View All Orders →
                </Link>
                <Link
                  href="/admin/enquiries"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs text-[#1B3A8A] hover:underline font-semibold"
                >
                  View Inbox →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-[#B8924A]/30" />

        {/* Admin Profile Pill & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 pl-1 p-1 hover:bg-[#B8924A]/10 rounded-xs transition-colors cursor-pointer text-left"
            aria-label="Staff account menu"
          >
            <div className="w-9 h-9 rounded-full bg-[#5E0F1E] text-[#FAF6EE] flex items-center justify-center font-serif font-bold text-sm border border-[#B8924A]/40 shadow-xs">
              {currentUser?.fullName
                ? currentUser.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "YG"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-[#2B2B2B] leading-none">
                {currentUser?.fullName || "Yohan Gunawardena"}
              </p>
              <p className="text-xs text-[#B8924A] font-medium leading-none mt-1 capitalize">
                {currentUser?.role?.replace("_", " ") || "Master Gemologist"}
              </p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#FAF6EE] border border-[#B8924A]/40 shadow-xl p-3.5 text-sm z-50 animate-gentle-fade rounded-xs">
              <div className="pb-2.5 mb-2.5 border-b border-[#B8924A]/20">
                <p className="font-semibold text-base text-[#5E0F1E] truncate">
                  {currentUser?.fullName || "Yohan Gunawardena"}
                </p>
                <p className="text-xs text-[#2B2B2B]/75 truncate mt-0.5">
                  {currentUser?.email || "yohan@isurugems.com"}
                </p>
                <span className="inline-block mt-1.5 text-xs uppercase tracking-wider bg-[#5E0F1E]/10 text-[#5E0F1E] px-2.5 py-0.5 rounded-xs font-semibold">
                  {currentUser?.role?.replace("_", " ") || "Super Admin"}
                </span>
              </div>

              <div className="space-y-1">
                <Link
                  href="/admin/staff"
                  onClick={() => setProfileOpen(false)}
                  className="block px-3 py-2 text-sm text-[#2B2B2B] hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 rounded-xs transition-colors"
                >
                  Staff Management & Roles
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="block px-3 py-2 text-sm text-[#2B2B2B] hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 rounded-xs transition-colors"
                >
                  Vault Console Settings
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="block px-3 py-2 text-sm text-[#2B2B2B] hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 rounded-xs transition-colors"
                >
                  View Storefront ↗
                </Link>
              </div>

              <div className="pt-2 mt-2.5 border-t border-[#B8924A]/20">
                <button
                  type="button"
                  onClick={async () => {
                    setProfileOpen(false);
                    await logoutAction();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 rounded-xs transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Vault</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
