"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  ShieldCheck,
  AlertCircle,
  Search,
  Eye,
  ArrowRight,
  FileText,
  User,
  MapPin,
  DollarSign,
  Send,
  Plane,
  RefreshCw,
  Database,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { AdminOrder, OrderStatus } from "@/types/admin";
import { DataTable, ColumnDef, FilterOption } from "@/components/admin/data-table";
import { formatCurrency, formatCarats } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  getAdminOrdersAction,
  updateAdminOrderStatusAction,
} from "@/actions/admin-db";

const WORKFLOW_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  {
    status: "pending_verification",
    label: "1. Verification",
    desc: "Awaiting bank wire or escrow verification",
  },
  {
    status: "escrow_funded",
    label: "2. Escrow Funded",
    desc: "Payment secured in trust; packaging gem packet",
  },
  {
    status: "customs_clearance",
    label: "3. NGJA Customs",
    desc: "National Gem & Jewellery Authority export appraisal & seal",
  },
  {
    status: "dispatched",
    label: "4. Dispatched",
    desc: "Handed over to armoured air transit (Brinks/Malca-Amit)",
  },
  {
    status: "delivered",
    label: "5. Delivered",
    desc: "Client vault reception & handover confirmed",
  },
];

export default function AdminOrdersPage() {
  const { orders, setOrders, updateOrderStatus, updateOrderTracking } = useAdminStore();
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Tracking form inputs
  const [carrierInput, setCarrierInput] = useState("");
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [customsNumberInput, setCustomsNumberInput] = useState("");

  const loadRealOrders = async () => {
    try {
      const res = await getAdminOrdersAction();
      if (res.success && res.data && res.data.length > 0) {
        setOrders(res.data);
      }
    } catch (err) {
      console.warn("Could not load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealOrders();
  }, []);

  const openOrderDetail = (order: AdminOrder) => {
    setSelectedOrder(order);
    setCarrierInput(order.trackingCarrier || "Brinks Global Services");
    setTrackingNumberInput(order.trackingNumber || "");
    setCustomsNumberInput(order.customsDeclarationNumber || `LK-CUSTOMS-2026-EXP-${order.id.slice(-4)}`);
  };

  const advanceWorkflow = async (currentStatus: OrderStatus) => {
    if (!selectedOrder) return;
    let nextStatus: OrderStatus = currentStatus;

    if (currentStatus === "pending_verification") nextStatus = "escrow_funded";
    else if (currentStatus === "escrow_funded") nextStatus = "customs_clearance";
    else if (currentStatus === "customs_clearance") nextStatus = "dispatched";
    else if (currentStatus === "dispatched") nextStatus = "delivered";

    updateOrderStatus(selectedOrder.id, nextStatus);
    setSelectedOrder({ ...selectedOrder, status: nextStatus });

    try {
      await updateAdminOrderStatusAction(selectedOrder.id, nextStatus);
    } catch (err) {
      console.warn("Order status sync note:", err);
    }
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateOrderTracking(selectedOrder.id, carrierInput, trackingNumberInput);
    setSelectedOrder({
      ...selectedOrder,
      trackingCarrier: carrierInput,
      trackingNumber: trackingNumberInput,
      status: selectedOrder.status === "customs_clearance" ? "dispatched" : selectedOrder.status,
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
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
      case "cancelled":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">Cancelled</span>;
      default:
        return null;
    }
  };

  const columns: ColumnDef<AdminOrder>[] = [
    {
      key: "id",
      header: "Order Ref",
      sortable: true,
      sortValue: (row) => row.id,
      render: (row) => (
        <span className="font-mono font-bold text-[#5E0F1E] text-sm">
          {row.id}
        </span>
      ),
    },
    {
      key: "customerName",
      header: "Customer & Destination",
      sortable: true,
      sortValue: (row) => row.customerName,
      render: (row) => (
        <div>
          <span className="font-semibold text-sm text-[#2B2B2B] block">{row.customerName}</span>
          <span className="text-xs text-[#2B2B2B]/60 mt-0.5 block">
            {row.city}, {row.country}
          </span>
        </div>
      ),
    },
    {
      key: "items",
      header: "Gemstone(s)",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2.5 max-w-xs">
          {row.items[0] && (
            <div className="relative w-9 h-9 rounded-xs overflow-hidden border border-[#B8924A]/30 shrink-0">
              <Image src={row.items[0].image} alt={row.items[0].name} fill className="object-cover" sizes="36px" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#2B2B2B] truncate">
              {row.items.map((i) => i.name).join(", ")}
            </p>
            <p className="text-xs text-[#2B2B2B]/60 mt-0.5">
              {row.items.length} piece{row.items.length > 1 ? "s" : ""} • {row.items.map((i) => formatCarats(i.carat)).join(", ")}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Total Value",
      sortable: true,
      sortValue: (row) => row.totalAmount,
      render: (row) => (
        <span className="font-serif font-bold text-base text-[#2B2B2B]">
          {formatCurrency(row.totalAmount)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date Placed",
      sortable: true,
      sortValue: (row) => new Date(row.createdAt).getTime(),
      render: (row) => (
        <span className="text-xs text-[#2B2B2B]/75 font-medium">
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Workflow Status",
      sortable: true,
      sortValue: (row) => row.status,
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "actions",
      header: "Action",
      sortable: false,
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => openOrderDetail(row)}
          className="text-sm h-8 px-3 border-[#B8924A]/40 text-[#5E0F1E] hover:bg-[#B8924A]/10 font-semibold"
        >
          <span>Manage</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      ),
    },
  ];

  const filterOptions: FilterOption[] = [
    {
      key: "status",
      label: "Workflow Stage",
      options: [
        { label: "Pending Verification", value: "pending_verification" },
        { label: "Escrow Funded", value: "escrow_funded" },
        { label: "Customs Clearance", value: "customs_clearance" },
        { label: "Dispatched", value: "dispatched" },
        { label: "Delivered", value: "delivered" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#B8924A]/25">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-medium tracking-wide">
              Acquisition Orders & Dispatch Workflow
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <Database className="w-3 h-3 text-emerald-600" />
              Live DB Sync
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#2B2B2B]/80 mt-1.5">
            Progress high-value client gem acquisitions from escrow funding through NGJA export sealing and armored courier flight dispatch.
          </p>
        </div>
        <Button
          onClick={loadRealOrders}
          disabled={loading}
          variant="outline"
          className="border-[#B8924A]/50 text-[#5E0F1E] hover:bg-[#FAF6EE] flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Syncing..." : "Refresh DB"}</span>
        </Button>
      </div>

      {/* Orders Data Table */}
      <DataTable
        data={orders}
        columns={columns}
        searchPlaceholder="Search by order reference, client name, email, or country..."
        filterOptions={filterOptions}
        searchFilter={(row, query) =>
          row.id.toLowerCase().includes(query) ||
          row.customerName.toLowerCase().includes(query) ||
          row.email.toLowerCase().includes(query) ||
          row.country.toLowerCase().includes(query)
        }
        defaultSortKey="createdAt"
        defaultSortDirection="desc"
        exportFilename="isuru-acquisition-orders"
      />

      {/* Order Detail & Workflow Progress Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Acquisition Dossier: ${selectedOrder.id}` : "Order Details"}
        description={selectedOrder ? `${selectedOrder.customerName} • Placed ${new Date(selectedOrder.createdAt).toLocaleDateString()}` : ""}
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs">
            {/* 1. Visual Workflow Timeline */}
            <div className="p-4 bg-[#F2EADB]/70 border border-[#B8924A]/30 rounded-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#5E0F1E]">
                  Current Status:
                </span>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>

              {/* Steps Progress */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
                {WORKFLOW_STEPS.map((step, idx) => {
                  const currentIdx = WORKFLOW_STEPS.findIndex((s) => s.status === selectedOrder.status);
                  const isCompleted = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div
                      key={step.status}
                      className={`p-2.5 rounded-xs border text-left transition-all ${
                        isCurrent
                          ? "bg-white border-[#5E0F1E] ring-2 ring-[#5E0F1E]/20"
                          : isCompleted
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                          : "bg-white/40 border-gray-200 text-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px]">
                          {step.label}
                        </span>
                        {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <p className="text-[9px] leading-tight opacity-80">{step.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Advance Action Button */}
              {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                <div className="pt-2 flex items-center justify-between border-t border-[#B8924A]/20">
                  <span className="text-[11px] text-[#2B2B2B]/70 font-medium">
                    Ready for the next operational milestone?
                  </span>
                  <Button
                    onClick={() => advanceWorkflow(selectedOrder.status)}
                    className="text-xs bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] font-semibold"
                  >
                    Advance to Next Stage →
                  </Button>
                </div>
              )}
            </div>

            {/* 2. Client & Shipping Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-[#B8924A]/30 rounded-xs space-y-2">
                <div className="flex items-center gap-1.5 text-[#5E0F1E] font-semibold">
                  <User className="w-4 h-4" />
                  <span>Client & Contact Dossier</span>
                </div>
                <div className="space-y-1 text-xs">
                  <p><strong className="text-[#2B2B2B]">Full Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong className="text-[#2B2B2B]">Email:</strong> {selectedOrder.email}</p>
                  <p><strong className="text-[#2B2B2B]">Phone:</strong> {selectedOrder.phone}</p>
                  <p><strong className="text-[#2B2B2B]">Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-[#B8924A]/30 rounded-xs space-y-2">
                <div className="flex items-center gap-1.5 text-[#5E0F1E] font-semibold">
                  <MapPin className="w-4 h-4" />
                  <span>Vault Destination Address</span>
                </div>
                <div className="space-y-1 text-xs">
                  <p>{selectedOrder.shippingAddress}</p>
                  <p>{selectedOrder.city}, {selectedOrder.postalCode || ""}</p>
                  <p><strong className="text-[#2B2B2B]">Country:</strong> {selectedOrder.country}</p>
                  {selectedOrder.notes && (
                    <p className="mt-2 text-[11px] italic text-[#2B2B2B]/70 bg-[#FAF6EE] p-1.5 rounded-xs">
                      Note: {selectedOrder.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Items Acquired Table */}
            <div className="p-4 bg-white border border-[#B8924A]/30 rounded-xs space-y-3">
              <span className="font-semibold text-[#5E0F1E] block">
                Acquired Gemstones ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-[#B8924A]/15">
                {selectedOrder.items.map((item) => (
                  <div key={item.gemId} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xs overflow-hidden border border-[#B8924A]/30 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div>
                        <p className="font-bold text-[#2B2B2B]">{item.name}</p>
                        <p className="text-[10px] text-[#2B2B2B]/60 font-mono">
                          {item.variety} • {formatCarats(item.carat)} • Cert: {item.certificateLab} #{item.certificateNumber}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-sm text-[#5E0F1E]">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#B8924A]/20 flex justify-between font-serif text-base font-bold text-[#5E0F1E]">
                <span>Total Acquisition Amount</span>
                <span>{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            {/* 4. Tracking & Courier Dispatch Form */}
            <form onSubmit={handleSaveTracking} className="p-4 bg-[#FAF6EE] border border-[#B8924A]/30 rounded-xs space-y-3">
              <div className="flex items-center gap-1.5 text-[#5E0F1E] font-semibold">
                <Truck className="w-4 h-4" />
                <span>Armoured Air Transport & Tracking Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#2B2B2B]">Armoured Courier</label>
                  <Input
                    value={carrierInput}
                    onChange={(e) => setCarrierInput(e.target.value)}
                    placeholder="Brinks Global / Malca-Amit"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#2B2B2B]">Air Waybill / Tracking #</label>
                  <Input
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="e.g. BGS-LHR-882190"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#2B2B2B]">NGJA Export Dec #</label>
                  <Input
                    value={customsNumberInput}
                    onChange={(e) => setCustomsNumberInput(e.target.value)}
                    placeholder="LK-CUSTOMS-2026-EXP-..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-[#2B2B2B]/60">
                  Saving tracking automatically sets status to Dispatched if currently under customs clearance.
                </span>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] text-xs font-semibold"
                >
                  Save Dispatch Info
                </Button>
              </div>
            </form>

            {/* Modal Close Action */}
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
                className="text-xs border-[#B8924A]/40"
              >
                Close Dossier
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
