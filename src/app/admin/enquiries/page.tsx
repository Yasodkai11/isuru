"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Archive,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Send,
  Trash2,
  RefreshCw,
  Database,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { AdminEnquiry, EnquiryStatus } from "@/types/admin";
import { DataTable, ColumnDef, FilterOption } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  getAdminInquiriesAction,
  updateAdminInquiryStatusAction,
  deleteAdminInquiryAction,
} from "@/actions/admin-db";

const CANNED_TEMPLATES = [
  {
    title: "Schedule Private Ratnapura Bureau Appointment",
    text: "Thank you for reaching out to Isuru Gems Ceylon. We would be delighted to welcome you to our private viewing bureau in Ratnapura. Our Master Gemologist will have the selected crystals and gemological microscope prepared for your inspection.",
  },
  {
    title: "High-Res 360° Video & GRS/NGJA Certificate Scan",
    text: "Thank you for your inquiry. We have prepared an uncompressed 4K daylight video (5500K standard gemological illumination) and a high-resolution scan of the accredited laboratory report. Please review the attached secure vault link.",
  },
  {
    title: "Wholesale Calibrated Ceylon Parcel Dossier",
    text: "Dear Atelier Partner, thank you for contacting Isuru Gems Export Division. Attached please find our current assay weights, calibrated parcel cuts, and mine-to-market wholesale export schedule with certified export assay seals.",
  },
];

export default function AdminEnquiriesPage() {
  const { enquiries, setEnquiries, updateEnquiryStatus, deleteEnquiry } = useAdminStore();
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<EnquiryStatus>("replied");

  const loadRealInquiries = async () => {
    try {
      const res = await getAdminInquiriesAction();
      if (res.success && res.data && res.data.length > 0) {
        setEnquiries(res.data);
      }
    } catch (err) {
      console.warn("Could not load inquiries from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealInquiries();
  }, []);

  const openEnquiry = (enq: AdminEnquiry) => {
    setSelectedEnquiry(enq);
    setReplyText(enq.replyNotes || "");
    setReplyStatus(enq.status === "pending" ? "in_progress" : enq.status);
  };

  const handleSaveReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    updateEnquiryStatus(selectedEnquiry.id, replyStatus, replyText);
    const targetId = selectedEnquiry.id;
    setSelectedEnquiry(null);

    try {
      await updateAdminInquiryStatusAction(targetId, replyStatus, replyText);
    } catch (err) {
      console.warn("Inquiry DB sync note:", err);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to remove this inquiry dossier?")) return;
    deleteEnquiry(id);
    try {
      await deleteAdminInquiryAction(id);
    } catch (err) {
      console.warn("Inquiry deletion sync note:", err);
    }
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">New / Unreplied</span>;
      case "in_progress":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">In Progress</span>;
      case "replied":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Replied</span>;
      case "archived":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">Archived</span>;
    }
  };

  const columns: ColumnDef<AdminEnquiry>[] = [
    {
      key: "fullName",
      header: "Client / Atelier",
      sortable: true,
      sortValue: (row) => row.fullName,
      render: (row) => (
        <div>
          <span className="font-semibold text-sm sm:text-base text-[#2B2B2B] block">{row.fullName}</span>
          <span className="text-xs text-[#2B2B2B]/60 mt-0.5 block">{row.email}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Inquiry Type",
      sortable: true,
      sortValue: (row) => row.type,
      render: (row) => (
        <span className="text-xs font-bold uppercase tracking-wider text-[#5E0F1E]">
          {row.type.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "gemName",
      header: "Gem Reference",
      sortable: false,
      render: (row) => (
        <span className="text-sm text-[#2B2B2B] font-medium max-w-xs truncate block">
          {row.gemName || "General Consultation"}
        </span>
      ),
    },
    {
      key: "country",
      header: "Origin & Currency",
      sortable: true,
      sortValue: (row) => row.country,
      render: (row) => (
        <span className="text-sm text-[#2B2B2B]/85 font-medium">
          {row.country} ({row.preferredCurrency})
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Received",
      sortable: true,
      sortValue: (row) => new Date(row.createdAt).getTime(),
      render: (row) => (
        <span className="text-xs text-[#2B2B2B]/75 font-medium">
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "actions",
      header: "Action",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openEnquiry(row)}
            className="text-sm h-8 px-3 border-[#B8924A]/40 text-[#5E0F1E] hover:bg-[#B8924A]/10 font-semibold"
          >
            <span>Review</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
          <button
            onClick={() => handleDeleteEnquiry(row.id)}
            className="p-1 text-red-500 hover:text-red-700"
            title="Delete Enquiry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filterOptions: FilterOption[] = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "New / Pending", value: "pending" },
        { label: "In Progress", value: "in_progress" },
        { label: "Replied", value: "replied" },
        { label: "Archived", value: "archived" },
      ],
    },
    {
      key: "type",
      label: "Inquiry Type",
      options: [
        { label: "Gem Consultation", value: "gem_consultation" },
        { label: "Wholesale Parcel", value: "wholesale_parcel" },
        { label: "Private Viewing", value: "private_viewing" },
        { label: "Custom Cut", value: "custom_cut" },
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
              Concierge Enquiries Inbox
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <Database className="w-3 h-3 text-emerald-600" />
              Live DB Sync
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#2B2B2B]/80 mt-1.5">
            Private client dossiers, bespoke gem inquiries, and international high jewellery wholesale parcel requests.
          </p>
        </div>
        <Button
          onClick={loadRealInquiries}
          disabled={loading}
          variant="outline"
          className="border-[#B8924A]/50 text-[#5E0F1E] hover:bg-[#FAF6EE] flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Syncing..." : "Refresh DB"}</span>
        </Button>
      </div>

      {/* Enquiries Data Table */}
      <DataTable
        data={enquiries}
        columns={columns}
        searchPlaceholder="Search by client name, email, country, or message text..."
        filterOptions={filterOptions}
        searchFilter={(row, query) =>
          row.fullName.toLowerCase().includes(query) ||
          row.email.toLowerCase().includes(query) ||
          row.country.toLowerCase().includes(query) ||
          row.message.toLowerCase().includes(query) ||
          Boolean(row.gemName && row.gemName.toLowerCase().includes(query))
        }
        defaultSortKey="createdAt"
        defaultSortDirection="desc"
        exportFilename="isuru-concierge-enquiries"
      />

      {/* Review & Reply Modal */}
      <Modal
        isOpen={!!selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        title={selectedEnquiry ? `Enquiry from ${selectedEnquiry.fullName}` : "Enquiry Dossier"}
        description={selectedEnquiry ? `${selectedEnquiry.country} • ${selectedEnquiry.email} • ${selectedEnquiry.phone || "No phone provided"}` : ""}
        size="lg"
      >
        {selectedEnquiry && (
          <form onSubmit={handleSaveReply} className="space-y-5 text-xs">
            {/* Client Query Card */}
            <div className="p-4 bg-[#FAF6EE] border border-[#B8924A]/30 rounded-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] uppercase tracking-wider text-[#5E0F1E]">
                  Requested: {selectedEnquiry.gemName || "General Consultation"}
                </span>
                <span className="text-[10px] text-[#2B2B2B]/60">
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-[#2B2B2B] leading-relaxed whitespace-pre-wrap p-2 bg-white/70 border border-[#B8924A]/20 rounded-xs">
                {selectedEnquiry.message}
              </p>
            </div>

            {/* Quick Canned Templates */}
            <div className="space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-[10px] text-[#5E0F1E] block">
                Insert Quick Concierge Response Template:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CANNED_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(tmpl.text)}
                    className="px-2.5 py-1 text-[10px] bg-[#F2EADB] hover:bg-[#B8924A]/20 border border-[#B8924A]/30 rounded-xs text-[#5E0F1E] font-medium transition-colors"
                  >
                    + {tmpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Reply / Internal Notes Textarea */}
            <div className="space-y-1">
              <label className="font-semibold text-[#2B2B2B]">
                Concierge Reply / Internal Case Notes
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Log email conversation, WhatsApp dispatch notes, or Zoom viewing scheduling..."
                className="w-full text-xs p-2.5 border border-[#B8924A]/30 bg-white rounded-xs focus:outline-none focus:border-[#5E0F1E]"
              />
            </div>

            {/* Status Update */}
            <div className="flex items-center gap-3">
              <label className="font-semibold text-[#2B2B2B]">Update Dossier Status:</label>
              <select
                value={replyStatus}
                onChange={(e) => setReplyStatus(e.target.value as EnquiryStatus)}
                className="text-xs p-1.5 border border-[#B8924A]/30 bg-white rounded-xs font-semibold text-[#5E0F1E]"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#B8924A]/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedEnquiry(null)}
                className="text-xs border-[#B8924A]/40"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] font-semibold"
              >
                Save Dossier Status
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
