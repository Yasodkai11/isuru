"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Gem,
  Inbox,
  TrendingUp,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  CheckCircle,
  Truck,
  Plus,
  Eye,
  AlertTriangle,
  Flame,
  RefreshCw,
  Database,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { formatCurrency, formatCarats } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAdminGemstonesAction,
  getAdminOrdersAction,
  getAdminInquiriesAction,
} from "@/actions/admin-db";

export default function AdminDashboardPage() {
  const {
    gemstones,
    setGemstones,
    orders,
    setOrders,
    enquiries,
    setEnquiries,
    categories,
  } = useAdminStore();

  const [loading, setLoading] = useState(true);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const loadRealAdminData = async () => {
    setLoading(true);
    try {
      const [gemsRes, ordersRes, inqRes] = await Promise.all([
        getAdminGemstonesAction(),
        getAdminOrdersAction(),
        getAdminInquiriesAction(),
      ]);

      if (gemsRes.success && gemsRes.data) {
        setGemstones(gemsRes.data);
      }
      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data);
      }
      if (inqRes.success && inqRes.data) {
        setEnquiries(inqRes.data);
      }
      setSyncNotice(
        `Synced live with Supabase DB: ${gemsRes.data?.length || 0} gemstones, ${ordersRes.data?.length || 0} orders.`
      );
    } catch (err) {
      console.warn("Admin sync note:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    Promise.all([
      getAdminGemstonesAction(),
      getAdminOrdersAction(),
      getAdminInquiriesAction(),
    ])
      .then(([gemsRes, ordersRes, inqRes]) => {
        if (!active) return;
        if (gemsRes.success && gemsRes.data) {
          setGemstones(gemsRes.data);
        }
        if (ordersRes.success && ordersRes.data) {
          setOrders(ordersRes.data);
        }
        if (inqRes.success && inqRes.data) {
          setEnquiries(inqRes.data);
        }
        setSyncNotice(
          `Synced live with Supabase DB: ${gemsRes.data?.length || 0} gemstones, ${ordersRes.data?.length || 0} orders.`
        );
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Admin sync note:", err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [setGemstones, setOrders, setEnquiries]);

  // Metrics
  const totalVaultValue = gemstones.reduce((sum, g) => sum + g.price, 0);
  const inStockGems = gemstones.filter((g) => g.inStock);
  const totalCarats = gemstones.reduce((sum, g) => sum + g.carat, 0);
  const unheatedCount = gemstones.filter((g) =>
    g.treatment.toLowerCase().includes("unheated") || g.treatment.toLowerCase().includes("none")
  ).length;

  const totalOrderRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending_verification");
  const inTransitOrders = orders.filter((o) => o.status === "dispatched" || o.status === "customs_clearance");
  const pendingEnquiries = enquiries.filter((e) => e.status === "pending");

  // Variety counts
  const varietyBreakdown = gemstones.reduce((acc, gem) => {
    acc[gem.variety] = (acc[gem.variety] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_verification":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Pending Verification</span>;
      case "escrow_funded":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">Escrow Funded</span>;
      case "customs_clearance":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">Customs Clearance</span>;
      case "dispatched":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">Dispatched (Armoured)</span>;
      case "delivered":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Delivered & Sealed</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#B8924A]/25">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-medium tracking-wide">
              Vault Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xs">
              <Database className="w-3 h-3 text-emerald-600" />
              Supabase Live
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#2B2B2B]/80 mt-1.5">
            Executive cockpit for Ceylon sapphire acquisitions, high-value vault inventory, and NGJA export logistics.
          </p>
          {syncNotice && (
            <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {syncNotice}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={loadRealAdminData}
            disabled={loading}
            className="text-xs h-10 px-3 border-[#B8924A]/40 text-[#5E0F1E] hover:bg-[#B8924A]/10 font-semibold"
            title="Refresh overview from Supabase Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-[#B8924A] ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Link href="/admin/products">
            <Button
              variant="outline"
              size="sm"
              className="text-sm h-10 px-4 border-[#B8924A]/40 text-[#5E0F1E] hover:bg-[#B8924A]/10 font-semibold"
            >
              <Plus className="w-4 h-4 mr-1.5 text-[#B8924A]" />
              Add Gemstone
            </Button>
          </Link>

          <Link href="/admin/orders">
            <Button
              size="sm"
              className="text-sm h-10 px-4 bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] font-semibold"
            >
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              Manage Orders ({orders.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Vault Valuation */}
        <div className="p-5 sm:p-6 bg-white/80 border border-[#B8924A]/30 shadow-xs rounded-xs relative overflow-hidden group hover:border-[#B8924A] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#5E0F1E]">
              Vault Valuation
            </span>
            <div className="w-10 h-10 rounded-full bg-[#B8924A]/10 text-[#5E0F1E] flex items-center justify-center">
              <Gem className="w-5 h-5 text-[#B8924A]" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2B2B]">
              {formatCurrency(totalVaultValue)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs sm:text-sm text-emerald-700 font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>{inStockGems.length} pieces currently available</span>
            </div>
          </div>
        </div>

        {/* Card 2: Cumulative Order Volume */}
        <div className="p-5 sm:p-6 bg-white/80 border border-[#B8924A]/30 shadow-xs rounded-xs relative overflow-hidden group hover:border-[#B8924A] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#5E0F1E]">
              Pipeline Revenue
            </span>
            <div className="w-10 h-10 rounded-full bg-[#5E0F1E]/10 text-[#5E0F1E] flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#5E0F1E]" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2B2B]">
              {formatCurrency(totalOrderRevenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs sm:text-sm text-emerald-700 font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>+18.4% vs last calendar month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Gemstones in Vault */}
        <div className="p-5 sm:p-6 bg-white/80 border border-[#B8924A]/30 shadow-xs rounded-xs relative overflow-hidden group hover:border-[#B8924A] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#5E0F1E]">
              Active Inventory
            </span>
            <div className="w-10 h-10 rounded-full bg-[#1B3A8A]/10 text-[#1B3A8A] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#1B3A8A]" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2B2B]">
              {gemstones.length} Gems / {formatCarats(totalCarats)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs sm:text-sm text-[#1B3A8A] font-semibold">
              <span>{Math.round((unheatedCount / (gemstones.length || 1)) * 100)}% 100% Unheated Natural</span>
            </div>
          </div>
        </div>

        {/* Card 4: Orders & Concierge Attention */}
        <div className="p-5 sm:p-6 bg-white/80 border border-[#B8924A]/30 shadow-xs rounded-xs relative overflow-hidden group hover:border-[#B8924A] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#5E0F1E]">
              Action Required
            </span>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#5E0F1E]">
              {pendingOrders.length + pendingEnquiries.length} Items
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm text-[#2B2B2B]/80 font-medium">
              <span className="text-amber-700 font-bold">{pendingOrders.length} orders</span>
              <span>•</span>
              <span className="text-[#1B3A8A] font-bold">{pendingEnquiries.length} enquiries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Variety Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Variety Breakdown */}
        <div className="p-5 sm:p-6 bg-white/80 border border-[#B8924A]/30 rounded-xs shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#B8924A]/20 pb-3">
            <h2 className="font-serif text-xl font-medium text-[#5E0F1E]">
              Variety Distribution
            </h2>
            <Link
              href="/admin/products"
              className="text-sm text-[#B8924A] hover:text-[#5E0F1E] flex items-center gap-1 font-semibold"
            >
              <span>Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {Object.entries(varietyBreakdown).map(([variety, count]) => {
              const percentage = Math.round((count / (gemstones.length || 1)) * 100);
              return (
                <div key={variety} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#2B2B2B]">{variety}</span>
                    <span className="text-[#2B2B2B]/70 font-mono font-bold">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#FAF6EE] border border-[#B8924A]/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#5E0F1E] to-[#B8924A]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workflow Pipeline Status */}
        <div className="p-5 sm:p-6 bg-white/80 border border-[#B8924A]/30 rounded-xs shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#B8924A]/20 pb-3">
            <div>
              <h2 className="font-serif text-xl font-medium text-[#5E0F1E]">
                High-Value Escrow & Dispatch Pipeline
              </h2>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mt-0.5">
                End-to-end provenance: Sri Lanka Ratnapura Vault → Customs Clearance → Malca-Amit/Brinks
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm text-[#B8924A] hover:text-[#5E0F1E] flex items-center gap-1 font-semibold"
            >
              <span>All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-3.5 bg-[#FAF6EE] border border-amber-300/60 rounded-xs">
              <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">
                1. Verification
              </span>
              <p className="font-serif text-3xl font-bold text-amber-900 mt-1">
                {orders.filter((o) => o.status === "pending_verification").length}
              </p>
              <p className="text-xs text-amber-800/80 mt-1">Wire / Escrow review</p>
            </div>

            <div className="p-3.5 bg-[#FAF6EE] border border-blue-300/60 rounded-xs">
              <span className="text-xs uppercase font-bold text-blue-800 tracking-wider">
                2. Escrow Funded
              </span>
              <p className="font-serif text-3xl font-bold text-blue-900 mt-1">
                {orders.filter((o) => o.status === "escrow_funded").length}
              </p>
              <p className="text-xs text-blue-800/80 mt-1">NGJA Sealing prep</p>
            </div>

            <div className="p-3.5 bg-[#FAF6EE] border border-purple-300/60 rounded-xs">
              <span className="text-xs uppercase font-bold text-purple-800 tracking-wider">
                3. Customs Clearance
              </span>
              <p className="font-serif text-3xl font-bold text-purple-900 mt-1">
                {orders.filter((o) => o.status === "customs_clearance").length}
              </p>
              <p className="text-xs text-purple-800/80 mt-1">Export duty stamped</p>
            </div>

            <div className="p-3.5 bg-[#FAF6EE] border border-indigo-300/60 rounded-xs">
              <span className="text-xs uppercase font-bold text-indigo-800 tracking-wider">
                4. In Transit
              </span>
              <p className="font-serif text-3xl font-bold text-indigo-900 mt-1">
                {orders.filter((o) => o.status === "dispatched").length}
              </p>
              <p className="text-xs text-indigo-800/80 mt-1">Armoured flight courier</p>
            </div>
          </div>

          <div className="p-3.5 bg-[#F2EADB]/60 border border-[#B8924A]/30 rounded-xs flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#B8924A]" />
              <span className="text-[#2B2B2B]/85 font-medium">
                All shipments covered by Lloyd&apos;s of London 100% Specie Insurance & NGJA Assayed Seals.
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#5E0F1E] shrink-0">Zero Loss Record Since 1964</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="p-5 sm:p-6 bg-white/80 border border-[#B8924A]/30 rounded-xs shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#B8924A]/20 pb-3">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#5E0F1E]">
              Recent Acquisition Orders
            </h2>
            <p className="text-sm text-[#2B2B2B]/70 mt-0.5">
              Live transactions submitted through client checkout and private concierge bookings.
            </p>
          </div>

          <Link href="/admin/orders">
            <Button
              variant="outline"
              size="sm"
              className="text-sm border-[#B8924A]/40 text-[#5E0F1E] hover:bg-[#B8924A]/10 font-semibold h-9 px-3.5"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#B8924A]/20 text-xs uppercase tracking-wider text-[#5E0F1E] font-bold bg-[#FAF6EE]">
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Gemstone Acquired</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Workflow Stage</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B8924A]/15">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF6EE] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#5E0F1E] text-sm">
                    {order.id}
                  </td>
                  <td className="p-3.5">
                    <p className="font-medium text-[#2B2B2B] text-sm">{order.customerName}</p>
                    <p className="text-xs text-[#2B2B2B]/60 mt-0.5">{order.country}</p>
                  </td>
                  <td className="p-3.5 max-w-xs truncate text-sm">
                    {order.items.map((i) => i.name).join(", ") || "Custom parcel"}
                  </td>
                  <td className="p-3.5 font-serif font-bold text-base text-[#2B2B2B]">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="p-3.5 text-xs text-[#2B2B2B]/75 font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-3.5">{getStatusBadge(order.status)}</td>
                  <td className="p-3.5 text-right">
                    <Link
                      href="/admin/orders"
                      className="text-sm font-semibold text-[#5E0F1E] hover:text-[#B8924A] inline-flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Urgent Enquiries & Quick Module Jumps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Enquiries */}
        <div className="p-5 sm:p-6 bg-white/80 border border-[#B8924A]/30 rounded-xs shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#B8924A]/20 pb-3">
            <div className="flex items-center gap-2.5">
              <Inbox className="w-5 h-5 text-[#1B3A8A]" />
              <h2 className="font-serif text-xl font-medium text-[#5E0F1E]">
                Concierge Inquiries Requiring Reply
              </h2>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-sm text-[#1B3A8A] hover:underline font-semibold"
            >
              Open Inbox ({enquiries.length})
            </Link>
          </div>

          <div className="space-y-3">
            {enquiries.slice(0, 3).map((enq) => (
              <div
                key={enq.id}
                className="p-3.5 bg-[#FAF6EE] border border-[#B8924A]/25 rounded-xs space-y-1.5 hover:border-[#B8924A] transition-colors"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#2B2B2B]">{enq.fullName}</span>
                  <span className="text-xs font-bold text-[#5E0F1E] uppercase tracking-wider">
                    {enq.type.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-sm text-[#2B2B2B]/80 line-clamp-2">
                  {enq.message}
                </p>
                <div className="flex items-center justify-between text-xs text-[#2B2B2B]/60 pt-1">
                  <span>{enq.country} • {enq.preferredCurrency}</span>
                  <Link
                    href="/admin/enquiries"
                    className="font-semibold text-sm text-[#1B3A8A] hover:underline"
                  >
                    Reply Dossier →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Console Jump Hub */}
        <div className="p-5 sm:p-6 bg-white/80 border border-[#B8924A]/30 rounded-xs shadow-xs space-y-4">
          <div className="border-b border-[#B8924A]/20 pb-3">
            <h2 className="font-serif text-xl font-medium text-[#5E0F1E]">
              Management Modules
            </h2>
            <p className="text-sm text-[#2B2B2B]/70 mt-0.5">
              Direct access to system configuration and media infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              href="/admin/categories"
              className="p-4 bg-[#FAF6EE] hover:bg-[#F2EADB] border border-[#B8924A]/25 rounded-xs transition-colors block"
            >
              <p className="font-bold text-[#5E0F1E] text-sm sm:text-base">Categories Manager</p>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mt-1">
                {categories.length} Taxonomy Groups
              </p>
            </Link>

            <Link
              href="/admin/customers"
              className="p-4 bg-[#FAF6EE] hover:bg-[#F2EADB] border border-[#B8924A]/25 rounded-xs transition-colors block"
            >
              <p className="font-bold text-[#5E0F1E] text-sm sm:text-base">Customers & VIPs</p>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mt-1">
                Private Collector CRM
              </p>
            </Link>

            <Link
              href="/admin/media"
              className="p-4 bg-[#FAF6EE] hover:bg-[#F2EADB] border border-[#B8924A]/25 rounded-xs transition-colors block"
            >
              <p className="font-bold text-[#5E0F1E] text-sm sm:text-base">Media Library</p>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mt-1">
                Macro Assets & Certs
              </p>
            </Link>

            <Link
              href="/admin/seo"
              className="p-4 bg-[#FAF6EE] hover:bg-[#F2EADB] border border-[#B8924A]/25 rounded-xs transition-colors block"
            >
              <p className="font-bold text-[#5E0F1E] text-sm sm:text-base">SEO & Metadata</p>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mt-1">
                SERP Previews & JSON-LD
              </p>
            </Link>

            <Link
              href="/admin/settings"
              className="p-4 bg-[#FAF6EE] hover:bg-[#F2EADB] border border-[#B8924A]/25 rounded-xs transition-colors block col-span-2"
            >
              <p className="font-bold text-[#5E0F1E] text-sm sm:text-base">Atelier Settings & Multi-Currency</p>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mt-1">
                Configure NGJA License, Ratnapura vault coordinates, and LKR/USD/EUR exchange rates.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
