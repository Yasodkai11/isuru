"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Globe,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Share2,
  Sparkles,
  Edit,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { AdminSEORecord } from "@/types/admin";
import { DataTable, ColumnDef, FilterOption } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export default function AdminSEOPage() {
  const { seoRecords, updateSEORecord } = useAdminStore();
  const [selectedRecord, setSelectedRecord] = useState<AdminSEORecord | null>(null);

  // Form State for editing
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [schemaType, setSchemaType] = useState<AdminSEORecord["schemaType"]>("CollectionPage");
  const [indexStatus, setIndexStatus] = useState<"indexed" | "noindex">("indexed");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const openEditModal = (rec: AdminSEORecord) => {
    setSelectedRecord(rec);
    setMetaTitle(rec.metaTitle);
    setMetaDescription(rec.metaDescription);
    setCanonicalUrl(rec.canonicalUrl);
    setOgTitle(rec.ogTitle || rec.metaTitle);
    setOgDescription(rec.ogDescription || rec.metaDescription);
    setOgImage(rec.ogImage || "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85");
    setSchemaType(rec.schemaType);
    setIndexStatus(rec.indexStatus);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    updateSEORecord(selectedRecord.id, {
      metaTitle,
      metaDescription,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      schemaType,
      indexStatus,
    });
    setSelectedRecord(null);
  };

  // Helper length gauges
  const titleLen = metaTitle.length;
  const descLen = metaDescription.length;

  const columns: ColumnDef<AdminSEORecord>[] = [
    {
      key: "pagePath",
      header: "Route Path",
      sortable: true,
      sortValue: (row) => row.pagePath,
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-sm text-[#5E0F1E] block">
            {row.pagePath}
          </span>
          <span className="text-xs text-[#2B2B2B]/60">{row.pageTitle}</span>
        </div>
      ),
    },
    {
      key: "metaTitle",
      header: "Meta Title & Snippet",
      sortable: true,
      sortValue: (row) => row.metaTitle,
      render: (row) => (
        <div className="max-w-md">
          <p className="font-semibold text-[#2B2B2B] truncate text-sm">{row.metaTitle}</p>
          <p className="text-xs text-[#2B2B2B]/60 truncate mt-0.5">{row.metaDescription}</p>
        </div>
      ),
    },
    {
      key: "lengthScore",
      header: "SERP Health",
      sortable: false,
      render: (row) => {
        const isTitleGood = row.metaTitle.length >= 40 && row.metaTitle.length <= 65;
        const isDescGood = row.metaDescription.length >= 120 && row.metaDescription.length <= 165;
        const allGood = isTitleGood && isDescGood;

        return (
          <div className="flex items-center gap-1.5">
            {allGood ? (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-full">
                Optimal Length
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold rounded-full">
                Needs Polish
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "schemaType",
      header: "Schema.org",
      sortable: true,
      sortValue: (row) => row.schemaType,
      render: (row) => (
        <span className="font-mono text-sm text-[#1B3A8A] font-semibold">
          {row.schemaType}
        </span>
      ),
    },
    {
      key: "indexStatus",
      header: "Robots",
      sortable: true,
      sortValue: (row) => row.indexStatus,
      render: (row) => (
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
          {row.indexStatus}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openEditModal(row)}
            className="text-sm h-8 px-3 border-[#B8924A]/40 text-[#5E0F1E] hover:bg-[#B8924A]/10 font-semibold"
          >
            <span>Edit SERP</span>
            <Edit className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#B8924A]/25">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-medium tracking-wide">
            SEO & Metadata Manager
          </h1>
          <p className="text-sm sm:text-base text-[#2B2B2B]/75 mt-1">
            Optimize Google SERP titles, OpenGraph social cards, and Schema.org structured data for Ceylon gemstone search visibility.
          </p>
        </div>
      </div>

      {/* SEO Data Table */}
      <DataTable
        data={seoRecords}
        columns={columns}
        searchPlaceholder="Search routes by URL path, meta title, or keywords..."
        searchFilter={(row, query) =>
          row.pagePath.toLowerCase().includes(query) ||
          row.metaTitle.toLowerCase().includes(query) ||
          row.metaDescription.toLowerCase().includes(query)
        }
        defaultSortKey="pagePath"
        defaultSortDirection="asc"
        exportFilename="isuru-seo-metadata"
      />

      {/* Edit SEO & Live SERP Preview Modal */}
      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord ? `SEO Rules: ${selectedRecord.pagePath}` : "Edit SEO"}
        description="Fine-tune how Google and search engines crawl and present this route."
        size="xl"
      >
        {selectedRecord && (
          <form onSubmit={handleSave} className="space-y-6 text-sm">
            {/* Live Google Search Preview Box */}
            <div className="p-4 bg-white border border-[#B8924A]/30 rounded-xs space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#B8924A]/15 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-[#5E0F1E] flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-[#B8924A]" />
                  Live Google SERP Snippet Preview
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`px-2.5 py-1 rounded-xs text-xs font-semibold ${
                      previewDevice === "desktop" ? "bg-[#5E0F1E] text-white" : "text-[#2B2B2B]/60"
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`px-2.5 py-1 rounded-xs text-xs font-semibold ${
                      previewDevice === "mobile" ? "bg-[#5E0F1E] text-white" : "text-[#2B2B2B]/60"
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              {/* SERP Card rendering */}
              <div className={`p-4 bg-white font-sans ${previewDevice === "mobile" ? "max-w-sm border rounded-lg p-3" : ""}`}>
                <div className="flex items-center gap-2 text-xs text-[#202124] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#5E0F1E] text-white text-[10px] flex items-center justify-center font-serif font-bold">
                    IG
                  </span>
                  <div className="leading-tight">
                    <span className="font-semibold text-xs block text-[#202124]">isurugems.com</span>
                    <span className="text-xs text-[#5f6368] font-mono">
                      https://isurugems.com{selectedRecord.pagePath}
                    </span>
                  </div>
                </div>

                <h4 className="text-lg sm:text-xl text-[#1a0dab] hover:underline cursor-pointer leading-snug font-normal line-clamp-1">
                  {metaTitle || "Isuru Gems | Natural Ceylon Sapphires"}
                </h4>

                <p className="text-sm sm:text-base text-[#4d5156] mt-1 leading-relaxed line-clamp-2">
                  {metaDescription || "Direct from the historic gem gravels of Ratnapura, Sri Lanka. Ethically mined, unheated certified Ceylon gemstones."}
                </p>
              </div>
            </div>

            {/* Input Controls */}
            <div className="space-y-4">
              {/* Title & Counter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-sm text-[#2B2B2B]">Meta Title Tag (50-60 characters recommended)</label>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-xs ${
                      titleLen >= 50 && titleLen <= 65
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {titleLen} characters
                  </span>
                </div>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Isuru Gems | Natural Ceylon Sapphires"
                  required
                />
              </div>

              {/* Description & Counter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-sm text-[#2B2B2B]">Meta Description Tag (150-160 characters recommended)</label>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-xs ${
                      descLen >= 140 && descLen <= 165
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {descLen} characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Compelling SERP description highlighting NGJA certification and Ceylon provenance..."
                  className="w-full text-sm p-3 border border-[#B8924A]/30 bg-white rounded-xs focus:outline-none focus:border-[#5E0F1E]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-sm text-[#2B2B2B]">Canonical URL</label>
                  <Input
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://isurugems.com/gems"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-sm text-[#2B2B2B]">Schema.org Structured Type</label>
                  <select
                    value={schemaType}
                    onChange={(e) => setSchemaType(e.target.value as AdminSEORecord["schemaType"])}
                    className="w-full text-sm p-2.5 border border-[#B8924A]/30 bg-white rounded-xs focus:outline-none focus:border-[#5E0F1E]"
                  >
                    <option value="CollectionPage">CollectionPage (Catalog)</option>
                    <option value="Product">Product (Individual Gemstone)</option>
                    <option value="Organization">Organization (Brand / Atelier)</option>
                    <option value="AboutPage">AboutPage</option>
                    <option value="ContactPage">ContactPage</option>
                  </select>
                </div>
              </div>

              {/* Social OpenGraph Preview */}
              <div className="p-3.5 bg-[#FAF6EE] border border-[#B8924A]/30 rounded-xs space-y-2">
                <span className="font-bold text-xs uppercase tracking-wider text-[#5E0F1E] flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-[#B8924A]" />
                  OpenGraph Social Card Configuration (WhatsApp / iMessage / LinkedIn)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-sm text-[#2B2B2B]">OG Title</label>
                    <Input
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      placeholder="Title for social preview"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-sm text-[#2B2B2B]">OG Share Image URL</label>
                    <Input
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#B8924A]/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedRecord(null)}
                className="text-sm h-9 px-4 border-[#B8924A]/40"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-sm h-9 px-4 bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] font-semibold"
              >
                Save SEO Metadata
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
