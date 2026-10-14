"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  FileText,
  Video,
  Sparkles,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { MediaAsset, MediaType } from "@/types/admin";
import { DataTable, ColumnDef, FilterOption } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export default function AdminMediaPage() {
  const { mediaAssets, addMediaAsset, deleteMediaAsset } = useAdminStore();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Media Form
  const [assetName, setAssetName] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [assetType, setAssetType] = useState<MediaType>("gem_photo");
  const [assetTag, setAssetTag] = useState("Gem Photography");
  const [assetSize, setAssetSize] = useState("2.5 MB");

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetUrl.trim()) return;

    addMediaAsset({
      id: `media-${Date.now().toString().slice(-5)}`,
      name: assetName.trim() || `gem-asset-${Date.now().toString().slice(-4)}.jpg`,
      url: assetUrl.trim(),
      type: assetType,
      size: assetSize,
      dimensions: "3840 x 2560",
      format: assetType === "certificate_pdf" ? "PDF" : "JPEG",
      createdAt: new Date().toISOString().split("T")[0],
      tag: assetTag,
    });

    setModalOpen(false);
    setAssetUrl("");
    setAssetName("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAssetUrl(dataUrl);
        setAssetName(file.name);
        setAssetSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      }
    };
    reader.readAsDataURL(file);
  };

  const columns: ColumnDef<MediaAsset>[] = [
    {
      key: "preview",
      header: "Asset Preview",
      sortable: false,
      render: (row) => (
        <div className="relative w-12 h-12 rounded-xs overflow-hidden border border-[#B8924A]/30 bg-[#FAF6EE] shrink-0">
          {row.type === "certificate_pdf" ? (
            <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-700">
              <FileText className="w-5 h-5" />
            </div>
          ) : (
            <Image src={row.url} alt={row.name} fill className="object-cover" sizes="48px" />
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "File Name",
      sortable: true,
      sortValue: (row) => row.name,
      render: (row) => (
        <div>
          <span className="font-semibold text-sm sm:text-base text-[#2B2B2B] block">{row.name}</span>
          <span className="text-xs text-[#2B2B2B]/60 font-mono truncate max-w-xs block">
            {row.url}
          </span>
        </div>
      ),
    },
    {
      key: "tag",
      header: "Category Tag",
      sortable: true,
      sortValue: (row) => row.tag,
      render: (row) => (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B8924A]/10 text-[#5E0F1E] border border-[#B8924A]/30">
          {row.tag}
        </span>
      ),
    },
    {
      key: "dimensions",
      header: "Resolution / Format",
      sortable: false,
      render: (row) => (
        <span className="text-sm text-[#2B2B2B]/75 font-mono">
          {row.dimensions || "Vector"} ({row.format})
        </span>
      ),
    },
    {
      key: "size",
      header: "File Size",
      sortable: true,
      sortValue: (row) => row.size,
      render: (row) => (
        <span className="text-sm text-[#2B2B2B]/75 font-mono">{row.size}</span>
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
            onClick={() => copyToClipboard(row.url, row.id)}
            className="text-sm h-8 px-3 border-[#B8924A]/40 text-[#5E0F1E] font-semibold"
            title="Copy URL to clipboard"
          >
            {copiedId === row.id ? (
              <span className="flex items-center gap-1 text-emerald-700">
                <Check className="w-3.5 h-3.5" />
                Copied
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" />
                Copy
              </span>
            )}
          </Button>

          <button
            onClick={() => deleteMediaAsset(row.id)}
            className="p-1.5 text-red-500 hover:text-red-700 rounded-xs"
            title="Delete Asset"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filterOptions: FilterOption[] = [
    {
      key: "tag",
      label: "Media Tag",
      options: [
        { label: "Gem Photography", value: "Gem Photography" },
        { label: "Certificates", value: "Certificates" },
        { label: "Vault Media", value: "Vault Media" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#B8924A]/25">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-medium tracking-wide">
            Media & Asset Library
          </h1>
          <p className="text-sm sm:text-base text-[#2B2B2B]/75 mt-1">
            Central repository for 4K gemstone macro photography, NGJA laboratory appraisal PDFs, and provenance imagery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center border border-[#B8924A]/30 rounded-xs bg-white p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-xs transition-colors ${
                viewMode === "grid" ? "bg-[#5E0F1E] text-white" : "text-[#2B2B2B]/60 hover:text-[#5E0F1E]"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-xs transition-colors ${
                viewMode === "table" ? "bg-[#5E0F1E] text-white" : "text-[#2B2B2B]/60 hover:text-[#5E0F1E]"
              }`}
              title="Data Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            size="sm"
            className="bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] text-sm h-9 px-4 font-semibold"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Upload Asset
          </Button>
        </div>
      </div>

      {/* Grid or Table Display */}
      {viewMode === "grid" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaAssets.map((asset) => (
              <div
                key={asset.id}
                className="group relative bg-white border border-[#B8924A]/30 hover:border-[#5E0F1E] rounded-xs p-2.5 shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-[#FAF6EE] rounded-xs mb-2">
                  {asset.type === "certificate_pdf" ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-700 p-2 text-center">
                      <FileText className="w-8 h-8 mb-1" />
                      <span className="text-xs font-bold">PDF Document</span>
                    </div>
                  ) : (
                    <Image
                      src={asset.url}
                      alt={asset.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 50vw, 300px"
                    />
                  )}

                  <span className="absolute top-1.5 left-1.5 px-2.5 py-1 bg-black/75 text-white text-xs font-bold uppercase rounded-xs">
                    {asset.tag}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#2B2B2B] truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  <p className="text-xs text-[#2B2B2B]/60 font-mono">
                    {asset.dimensions || "Vector"} • {asset.size}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#B8924A]/20">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(asset.url, asset.id)}
                    className="text-xs h-7 px-2.5 border-[#B8924A]/30 text-[#5E0F1E] font-semibold"
                  >
                    {copiedId === asset.id ? (
                      <span className="text-emerald-700 flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3.5 h-3.5" /> Copy URL
                      </span>
                    )}
                  </Button>

                  <button
                    onClick={() => deleteMediaAsset(asset.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <DataTable
          data={mediaAssets}
          columns={columns}
          searchPlaceholder="Search media by file name or tag..."
          filterOptions={filterOptions}
          searchFilter={(row, query) =>
            row.name.toLowerCase().includes(query) || row.tag.toLowerCase().includes(query)
          }
          defaultSortKey="name"
          defaultSortDirection="asc"
          exportFilename="isuru-media-library"
        />
      )}

      {/* Add Media Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Upload Gemstone Media Asset"
        description="Add macro photos, certificate scans, or gemstone video assets."
        size="md"
      >
        <form onSubmit={handleCreateAsset} className="space-y-4 text-sm">
          {/* File Picker */}
          <div className="p-4 border-2 border-dashed border-[#B8924A]/40 rounded-xs text-center space-y-2 bg-[#FAF6EE]">
            <Upload className="w-7 h-7 mx-auto text-[#B8924A]" />
            <p className="text-sm font-semibold text-[#5E0F1E]">Choose local file to load data preview</p>
            <label className="inline-block px-3.5 py-2 bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] text-sm font-semibold rounded-xs cursor-pointer shadow-xs">
              Select Device File
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-sm text-[#2B2B2B]">Asset / Image URL *</label>
            <Input
              value={assetUrl}
              onChange={(e) => setAssetUrl(e.target.value)}
              placeholder="https://... or data URL"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-sm text-[#2B2B2B]">Asset Name</label>
            <Input
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="ceylon-blue-sapphire-facet.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-sm text-[#2B2B2B]">Media Category</label>
              <select
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                className="w-full text-sm p-2.5 border border-[#B8924A]/30 bg-white rounded-xs focus:outline-none focus:border-[#5E0F1E]"
              >
                <option value="Gem Photography">Gem Photography</option>
                <option value="Certificates">Certificates</option>
                <option value="Vault Media">Vault Media</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-sm text-[#2B2B2B]">File Size</label>
              <Input
                value={assetSize}
                onChange={(e) => setAssetSize(e.target.value)}
                placeholder="2.4 MB"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#B8924A]/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="text-sm h-9 px-4 border-[#B8924A]/40"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-sm h-9 px-4 bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] font-semibold"
            >
              Add to Library
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
