"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  ExternalLink,
  Star,
  Check,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { AdminCategory } from "@/types/admin";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { slugify } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, gemstones } = useAdminStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AdminCategory | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [varietyQuery, setVarietyQuery] = useState("");
  const [featured, setFeatured] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [formError, setFormError] = useState("");

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setSubtitle("");
    setTagline("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85");
    setVarietyQuery("");
    setFeatured(true);
    setSortOrder(categories.length + 1);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setSubtitle(cat.subtitle);
    setTagline(cat.tagline);
    setDescription(cat.description);
    setImage(cat.image);
    setVarietyQuery(cat.varietyQuery || "");
    setFeatured(cat.featured);
    setSortOrder(cat.sortOrder);
    setFormError("");
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Category title is required.");
      return;
    }

    const currentCount = gemstones.filter((g) => {
      if (g.category === slug) return true;
      if (varietyQuery && g.variety.toLowerCase().includes(varietyQuery.toLowerCase())) return true;
      return false;
    }).length;

    const data: AdminCategory = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now().toString().slice(-5)}`,
      slug: slug.trim() || slugify(name),
      name: name.trim(),
      subtitle: subtitle.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      image: image.trim(),
      varietyQuery: varietyQuery.trim() || undefined,
      productCount: currentCount,
      featured,
      sortOrder: Number(sortOrder) || 1,
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, data);
    } else {
      addCategory(data);
    }
    setModalOpen(false);
  };

  const columns: ColumnDef<AdminCategory>[] = [
    {
      key: "image",
      header: "Hero Banner",
      sortable: false,
      render: (row) => (
        <div className="relative w-16 h-10 rounded-xs overflow-hidden border border-[#B8924A]/30 bg-[#FAF6EE] shrink-0">
          <Image src={row.image} alt={row.name} fill className="object-cover" sizes="64px" />
        </div>
      ),
    },
    {
      key: "name",
      header: "Category Name",
      sortable: true,
      sortValue: (row) => row.name,
      render: (row) => (
        <div>
          <span className="font-semibold text-sm sm:text-base text-[#2B2B2B] block">{row.name}</span>
          <span className="text-xs text-[#2B2B2B]/60 font-mono mt-0.5 block">/gems?category={row.slug}</span>
        </div>
      ),
    },
    {
      key: "tagline",
      header: "Tagline & Theme",
      sortable: false,
      render: (row) => (
        <div>
          <span className="font-medium text-sm text-[#5E0F1E] block">{row.tagline}</span>
          <span className="text-xs text-[#2B2B2B]/65 line-clamp-1 mt-0.5 block">{row.subtitle}</span>
        </div>
      ),
    },
    {
      key: "productCount",
      header: "Catalog Gems",
      sortable: true,
      sortValue: (row) => row.productCount,
      render: (row) => (
        <span className="font-serif font-bold text-base text-[#5E0F1E]">
          {row.productCount} Listed
        </span>
      ),
    },
    {
      key: "sortOrder",
      header: "Sort Order",
      sortable: true,
      sortValue: (row) => row.sortOrder,
      render: (row) => (
        <span className="font-mono font-bold text-sm text-[#2B2B2B]/75">
          #{row.sortOrder}
        </span>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      sortable: true,
      sortValue: (row) => (row.featured ? 1 : 0),
      render: (row) => (
        <button
          onClick={() => updateCategory(row.id, { featured: !row.featured })}
          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
            row.featured
              ? "bg-[#B8924A]/10 text-[#5E0F1E] border-[#B8924A]/40"
              : "bg-gray-100 text-gray-500 border-gray-200"
          }`}
        >
          {row.featured ? "Showcase" : "Secondary"}
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2 justify-end">
          <Link
            href={`/gems?category=${row.slug}`}
            target="_blank"
            className="p-1.5 text-[#2B2B2B]/60 hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 rounded-xs transition-colors"
            title="View Storefront Collection"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 text-[#2B2B2B]/60 hover:text-[#5E0F1E] hover:bg-[#B8924A]/10 rounded-xs transition-colors"
            title="Edit Category"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteConfirm(row)}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#B8924A]/25">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-medium tracking-wide">
            Categories & Taxonomies
          </h1>
          <p className="text-sm sm:text-base text-[#2B2B2B]/80 mt-1.5">
            Organize Ceylon sapphires into curated storefront collections with custom editorial headers and imagery.
          </p>
        </div>

        <Button
          onClick={openAddModal}
          size="sm"
          className="bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] text-sm h-10 px-4 font-semibold shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Categories Data Table */}
      <DataTable
        data={categories}
        columns={columns}
        searchPlaceholder="Search categories by name, slug, or theme..."
        searchFilter={(row, query) =>
          row.name.toLowerCase().includes(query) ||
          row.slug.toLowerCase().includes(query) ||
          row.tagline.toLowerCase().includes(query)
        }
        defaultSortKey="sortOrder"
        defaultSortDirection="asc"
        exportFilename="isuru-gem-categories"
      />

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? `Edit: ${editingCategory.name}` : "Create New Category"}
        description="Configure how this gemstone variety is presented on the public showcase."
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {formError && (
            <div className="p-2.5 bg-red-50 border border-red-300 text-red-800 rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#2B2B2B]">Category Title *</label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Ceylon Blue Sapphires"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#2B2B2B]">URL Slug</label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="blue-sapphires"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-[#2B2B2B]">Tagline Header</label>
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="The Sovereign Gem of Serendib"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-[#2B2B2B]">Subheading</label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Royal Blue & Cornflower Blue Varieties"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-[#2B2B2B]">Hero Banner Image URL</label>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#2B2B2B]">Auto-filter Variety Keyword</label>
              <Input
                value={varietyQuery}
                onChange={(e) => setVarietyQuery(e.target.value)}
                placeholder="e.g. Blue or Padparadscha"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#2B2B2B]">Display Sort Order</label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                placeholder="1"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#2B2B2B]">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed historical and gemological context..."
              className="w-full text-xs p-2.5 border border-[#B8924A]/30 bg-white rounded-xs focus:outline-none focus:border-[#5E0F1E]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="cat-featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded-xs text-[#5E0F1E] focus:ring-[#5E0F1E]"
            />
            <label htmlFor="cat-featured" className="font-semibold cursor-pointer">
              Promote as Featured Category on Navigation & Home Page
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#B8924A]/20">
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
              {editingCategory ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Category?"
        description="This will remove the category taxonomy. Existing gemstones assigned to this category will remain in the catalog."
        size="sm"
      >
        {deleteConfirm && (
          <div className="space-y-4 text-xs">
            <p className="font-bold text-[#5E0F1E]">{deleteConfirm.name}</p>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirm(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  deleteCategory(deleteConfirm.id);
                  setDeleteConfirm(null);
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
