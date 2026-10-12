"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle,
  XCircle,
  Gem,
  Award,
  Filter,
  Eye,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { Gemstone, GemImage } from "@/types/gem";
import { DataTable, ColumnDef, FilterOption } from "@/components/admin/data-table";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";
import { formatCurrency, formatCarats, slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  GEM_VARIETIES,
  CEYLON_ORIGINS,
  GEM_SHAPES,
  GEM_COLOURS,
  CERTIFICATIONS,
} from "@/lib/constants";

export default function AdminProductsPage() {
  const {
    gemstones,
    addGemstone,
    updateGemstone,
    deleteGemstone,
    toggleStock,
    toggleFeatured,
  } = useAdminStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGem, setEditingGem] = useState<Gemstone | null>(null);
  const [deleteConfirmGem, setDeleteConfirmGem] = useState<Gemstone | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formVariety, setFormVariety] = useState<string>(GEM_VARIETIES[0]);
  const [formCategory, setFormCategory] = useState("blue-sapphires");
  const [formCarat, setFormCarat] = useState("3.50");
  const [formOrigin, setFormOrigin] = useState<string>(CEYLON_ORIGINS[0]);
  const [formCut, setFormCut] = useState("Cushion Brilliant");
  const [formDimensions, setFormDimensions] = useState("8.50 x 7.20 x 5.10 mm");
  const [formColor, setFormColor] = useState("Vivid Royal Blue");
  const [formTreatment, setFormTreatment] = useState("None / Unheated (Certified 100% Natural)");
  const [formClarity, setFormClarity] = useState("Eye Clean / VVS1");
  const [formPrice, setFormPrice] = useState("12500");
  const [formInStock, setFormInStock] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formDescription, setFormDescription] = useState("");
  const [formCertLab, setFormCertLab] = useState("GRS & NGJA");
  const [formCertNumber, setFormCertNumber] = useState("");
  const [formCertPdfUrl, setFormCertPdfUrl] = useState("");
  const [formImages, setFormImages] = useState<GemImage[]>([]);
  const [formError, setFormError] = useState("");

  const openAddModal = () => {
    setEditingGem(null);
    setFormName("");
    setFormSlug("");
    setFormVariety(GEM_VARIETIES[0]);
    setFormCategory("blue-sapphires");
    setFormCarat("3.50");
    setFormOrigin(CEYLON_ORIGINS[0]);
    setFormCut("Cushion Brilliant");
    setFormDimensions("8.50 x 7.20 x 5.10 mm");
    setFormColor("Vivid Royal Blue");
    setFormTreatment("None / Unheated (Certified 100% Natural)");
    setFormClarity("Eye Clean / VVS1");
    setFormPrice("15000");
    setFormInStock(true);
    setFormFeatured(false);
    setFormDescription(
      "A magnificent natural Ceylon sapphire with exemplary saturation and vivid crystal brilliance direct from the historic alluvial gravels of Ratnapura."
    );
    setFormCertLab("GRS & NGJA");
    setFormCertNumber(`NGJA-${Date.now().toString().slice(-6)}`);
    setFormCertPdfUrl("");
    setFormImages([
      {
        url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85",
        alt: "Vivid Ceylon Royal Blue Cushion sapphire",
      },
    ]);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (gem: Gemstone) => {
    setEditingGem(gem);
    setFormName(gem.name);
    setFormSlug(gem.slug);
    setFormVariety(gem.variety);
    setFormCategory(gem.category || "blue-sapphires");
    setFormCarat(gem.carat.toString());
    setFormOrigin(gem.origin);
    setFormCut(gem.cut);
    setFormDimensions(gem.dimensions);
    setFormColor(gem.color);
    setFormTreatment(gem.treatment);
    setFormClarity(gem.clarity);
    setFormPrice(gem.price.toString());
    setFormInStock(gem.inStock);
    setFormFeatured(!!gem.featured);
    setFormDescription(gem.description);
    setFormCertLab(gem.certificate.lab);
    setFormCertNumber(gem.certificate.number);
    setFormCertPdfUrl(gem.certificate.pdfUrl || "");
    setFormImages(gem.images.length > 0 ? [...gem.images] : []);
    setFormError("");
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormName(name);
    if (!editingGem) {
      setFormSlug(slugify(name));
    }
  };

  const handleSaveGem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Gemstone name is required.");
      return;
    }
    const caratVal = parseFloat(formCarat);
    if (isNaN(caratVal) || caratVal <= 0) {
      setFormError("Valid positive carat weight is required.");
      return;
    }
    const priceVal = parseFloat(formPrice);
    if (isNaN(priceVal) || priceVal <= 0) {
      setFormError("Valid positive price in USD is required.");
      return;
    }
    if (formImages.length === 0) {
      setFormError("Please provide at least one photo view for this gemstone.");
      return;
    }

    const gemData: Gemstone = {
      id: editingGem ? editingGem.id : `gem-${Date.now().toString().slice(-6)}`,
      slug: formSlug.trim() || slugify(formName),
      name: formName.trim(),
      variety: formVariety,
      category: formCategory,
      carat: caratVal,
      origin: formOrigin,
      cut: formCut,
      dimensions: formDimensions.trim(),
      color: formColor.trim(),
      treatment: formTreatment.trim(),
      clarity: formClarity.trim(),
      price: priceVal,
      currency: "USD",
      inStock: formInStock,
      featured: formFeatured,
      description: formDescription.trim(),
      certificate: {
        lab: formCertLab.trim(),
        number: formCertNumber.trim() || "NGJA-PENDING",
        pdfUrl: formCertPdfUrl.trim() || undefined,
      },
      images: formImages,
    };

    if (editingGem) {
      updateGemstone(editingGem.id, gemData);
    } else {
      addGemstone(gemData);
    }

    setModalOpen(false);
  };

  // Table Columns Definition
  const columns: ColumnDef<Gemstone>[] = [
    {
      key: "images",
      header: "Visual",
      sortable: false,
      render: (row) => {
        const cover = row.images[0]?.url || "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=400&q=80";
        return (
          <div className="flex items-center gap-2">
            <div className="relative w-12 h-12 rounded-xs overflow-hidden border border-[#B8924A]/30 shrink-0 bg-[#FAF6EE]">
              <Image src={cover} alt={row.name} fill className="object-cover" sizes="48px" />
              {row.images.length > 1 && (
                <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 font-bold">
                  +{row.images.length - 1}
                </span>
              )}
            </div>
            {row.featured && (
              <Star className="w-3.5 h-3.5 text-[#B8924A] fill-current" title="Featured on Showcase" />
            )}
          </div>
        );
      },
    },
    {
      key: "name",
      header: "Gemstone Name & Ref",
      sortable: true,
      sortValue: (row) => row.name,
      render: (row) => (
        <div>
          <span className="font-semibold text-[#2B2B2B] hover:text-[#5E0F1E] block">
            {row.name}
          </span>
          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#2B2B2B]/60 font-mono">
            <span>Slug: {row.slug}</span>
            <span>•</span>
            <span className="text-[#5E0F1E] font-medium">{row.certificate.lab} #{row.certificate.number}</span>
          </div>
        </div>
      ),
    },
    {
      key: "variety",
      header: "Variety & Cut",
      sortable: true,
      sortValue: (row) => row.variety,
      render: (row) => (
        <div>
          <span className="font-medium text-[#2B2B2B] block">{row.variety}</span>
          <span className="text-[10px] text-[#2B2B2B]/60">{row.cut}</span>
        </div>
      ),
    },
    {
      key: "carat",
      header: "Weight",
      sortable: true,
      sortValue: (row) => row.carat,
      render: (row) => (
        <span className="font-bold text-[#5E0F1E] font-serif text-sm">
          {formatCarats(row.carat)}
        </span>
      ),
    },
    {
      key: "origin",
      header: "Ceylon Provenance",
      sortable: true,
      sortValue: (row) => row.origin,
      render: (row) => (
        <span className="text-[11px] text-[#2B2B2B]/80 font-medium">{row.origin}</span>
      ),
    },
    {
      key: "price",
      header: "Price (USD)",
      sortable: true,
      sortValue: (row) => row.price,
      render: (row) => (
        <span className="font-bold text-sm font-serif text-[#2B2B2B]">
          {formatCurrency(row.price)}
        </span>
      ),
    },
    {
      key: "inStock",
      header: "Stock Status",
      sortable: true,
      sortValue: (row) => (row.inStock ? 1 : 0),
      render: (row) => (
        <button
          onClick={() => toggleStock(row.id)}
          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer border ${
            row.inStock
              ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
              : "bg-red-50 text-red-800 border-red-300 hover:bg-red-100"
          }`}
          title="Click to toggle stock availability"
        >
          {row.inStock ? "Available" : "Reserved / Sold"}
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <Link
            href={`/gems/${row.slug}`}
            target="_blank"
            className="p-1.5 text-[#2B2B2B]/60 hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 rounded-xs transition-colors"
            title="Preview Live on Storefront"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 text-[#2B2B2B]/60 hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 rounded-xs transition-colors"
            title="Edit Gemstone Details"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDeleteConfirmGem(row)}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors"
            title="Delete from Catalog"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Filter options for dropdowns
  const filterOptions: FilterOption[] = [
    {
      key: "variety",
      label: "Variety",
      options: [
        { label: "Royal Blue Sapphire", value: "Royal Blue Sapphire" },
        { label: "Padparadscha Sapphire", value: "Padparadscha Sapphire" },
        { label: "Star Sapphire", value: "Star Sapphire" },
        { label: "Ceylon Ruby", value: "Ceylon Ruby" },
        { label: "Yellow Sapphire", value: "Yellow Sapphire (Pushparaga)" },
      ],
    },
    {
      key: "inStock",
      label: "Availability",
      options: [
        { label: "Available in Vault", value: "true" },
        { label: "Reserved / Sold", value: "false" },
      ],
    },
    {
      key: "origin",
      label: "Origin Pit",
      options: CEYLON_ORIGINS.map((o) => ({ label: o, value: o })),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#B8924A]/25">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-medium tracking-wide">
            Gemstone Products CRUD
          </h1>
          <p className="text-xs sm:text-sm text-[#2B2B2B]/75 mt-1">
            Manage your fine Ceylon gemstone inventory with multi-angle photography, certificate data, and live vault stock states.
          </p>
        </div>

        <Button
          onClick={openAddModal}
          size="sm"
          className="bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] text-xs font-semibold shrink-0"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add New Gemstone
        </Button>
      </div>

      {/* Main Data Table */}
      <DataTable
        data={gemstones}
        columns={columns}
        searchPlaceholder="Search gemstone by title, variety, lab, or certificate #..."
        filterOptions={filterOptions}
        filterFn={(row, activeFilters) => {
          if (activeFilters.variety && activeFilters.variety !== "all") {
            if (row.variety.toLowerCase() !== activeFilters.variety.toLowerCase()) return false;
          }
          if (activeFilters.inStock && activeFilters.inStock !== "all") {
            const wantStock = activeFilters.inStock === "true";
            if (row.inStock !== wantStock) return false;
          }
          if (activeFilters.origin && activeFilters.origin !== "all") {
            if (!row.origin.toLowerCase().includes(activeFilters.origin.toLowerCase())) return false;
          }
          return true;
        }}
        searchFilter={(row, query) => {
          return (
            row.name.toLowerCase().includes(query) ||
            row.variety.toLowerCase().includes(query) ||
            row.origin.toLowerCase().includes(query) ||
            row.slug.toLowerCase().includes(query) ||
            row.certificate.lab.toLowerCase().includes(query) ||
            row.certificate.number.toLowerCase().includes(query)
          );
        }}
        defaultSortKey="price"
        defaultSortDirection="desc"
        exportFilename="isuru-gemstones-catalog"
      />

      {/* Add / Edit Gemstone Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGem ? `Edit Gemstone: ${editingGem.name}` : "Add New Ceylon Gemstone"}
        description="Provide comprehensive gemological data, NGJA/GRS certificate details, and multiple high-resolution photos."
        size="xl"
      >
        <form onSubmit={handleSaveGem} className="space-y-6">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Basic Identity */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-[#5E0F1E] border-b border-[#B8924A]/20 pb-1">
              1. Gemstone Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-[#2B2B2B]">Gemstone Name *</label>
                <Input
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Ceylon Royal Blue Sapphire (Unheated 4.28ct)"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">URL Slug (Auto-generated)</label>
                <Input
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="ceylon-royal-blue-sapphire-4-28ct"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Variety Category *</label>
                <select
                  value={formVariety}
                  onChange={(e) => setFormVariety(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[#B8924A]/30 bg-white rounded-xs focus:outline-none focus:border-[#5E0F1E]"
                >
                  {GEM_VARIETIES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Carat Weight (cts) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formCarat}
                  onChange={(e) => setFormCarat(e.target.value)}
                  placeholder="4.28"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Ceylon Origin Pit *</label>
                <select
                  value={formOrigin}
                  onChange={(e) => setFormOrigin(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[#B8924A]/30 bg-white rounded-xs focus:outline-none focus:border-[#5E0F1E]"
                >
                  {CEYLON_ORIGINS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Lapidary Cut & Shape</label>
                <select
                  value={formCut}
                  onChange={(e) => setFormCut(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[#B8924A]/30 bg-white rounded-xs focus:outline-none focus:border-[#5E0F1E]"
                >
                  {GEM_SHAPES.map((s) => (
                    <option key={s.label} value={s.label}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Physical Dimensions (mm)</label>
                <Input
                  value={formDimensions}
                  onChange={(e) => setFormDimensions(e.target.value)}
                  placeholder="9.84 x 8.12 x 5.96 mm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Color Saturation</label>
                <Input
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  placeholder="Vivid Royal Blue / Lotus Pink-Orange"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Thermal Treatment</label>
                <Input
                  value={formTreatment}
                  onChange={(e) => setFormTreatment(e.target.value)}
                  placeholder="None / Unheated (Certified 100% Natural)"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Clarity Grade</label>
                <Input
                  value={formClarity}
                  onChange={(e) => setFormClarity(e.target.value)}
                  placeholder="Eye Clean / VVS1"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Price in USD ($) *</label>
                <Input
                  type="number"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="18500"
                  required
                />
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2B2B2B]">
                <input
                  type="checkbox"
                  checked={formInStock}
                  onChange={(e) => setFormInStock(e.target.checked)}
                  className="rounded-xs text-[#5E0F1E] focus:ring-[#5E0F1E]"
                />
                <span>Available In Vault Stock</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2B2B2B]">
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="rounded-xs text-[#5E0F1E] focus:ring-[#5E0F1E]"
                />
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#B8924A] fill-current" />
                  Featured in Main Showcase
                </span>
              </label>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-[#2B2B2B]">Gemological Description</label>
              <textarea
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Narrative of crystal inclusions, optical luster, and provenance..."
                className="w-full text-xs p-2.5 border border-[#B8924A]/30 bg-white rounded-xs focus:outline-none focus:border-[#5E0F1E]"
              />
            </div>
          </div>

          {/* Section 2: Laboratory Certification */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-[#5E0F1E] border-b border-[#B8924A]/20 pb-1">
              2. Gemological Certification & Verification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Accredited Lab</label>
                <Input
                  value={formCertLab}
                  onChange={(e) => setFormCertLab(e.target.value)}
                  placeholder="GRS, GIA, NGJA, SSEF, Gübelin"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Report / Certificate #</label>
                <Input
                  value={formCertNumber}
                  onChange={(e) => setFormCertNumber(e.target.value)}
                  placeholder="GRS2024-089921"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Certificate PDF URL</label>
                <Input
                  value={formCertPdfUrl}
                  onChange={(e) => setFormCertPdfUrl(e.target.value)}
                  placeholder="/certs/GRS-report.pdf"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Multi-Image Upload & Reorder */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-medium text-[#5E0F1E] border-b border-[#B8924A]/20 pb-1">
              3. Multi-Angle Macro Photography
            </h3>
            <MultiImageUploader images={formImages} onChange={setFormImages} />
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#B8924A]/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="text-xs border-[#B8924A]/40"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-xs bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] font-semibold"
            >
              {editingGem ? "Save Changes" : "Create Gemstone Listing"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmGem}
        onClose={() => setDeleteConfirmGem(null)}
        title="Remove Gemstone from Vault Catalog?"
        description="This action will delete the item from the active database and archive its public listing."
        size="sm"
      >
        {deleteConfirmGem && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#FAF6EE] border border-[#B8924A]/30 rounded-xs">
              <p className="font-bold text-[#5E0F1E]">{deleteConfirmGem.name}</p>
              <p className="text-[11px] text-[#2B2B2B]/70 mt-0.5">
                {deleteConfirmGem.variety} • {formatCarats(deleteConfirmGem.carat)} • {formatCurrency(deleteConfirmGem.price)}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmGem(null)}
                className="text-xs"
              >
                Keep Item
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  deleteGemstone(deleteConfirmGem.id);
                  setDeleteConfirmGem(null);
                }}
                className="text-xs bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
