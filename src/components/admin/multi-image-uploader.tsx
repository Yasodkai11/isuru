"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Star,
  Sparkles,
  Loader2,
} from "lucide-react";
import { GemImage } from "@/types/gem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadGemMediaAction } from "@/actions/storage";

interface MultiImageUploaderProps {
  images: GemImage[];
  onChange: (images: GemImage[]) => void;
}

const PRESET_CEYLON_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85",
    alt: "Ceylon Royal Blue Cushion sapphire with vivid saturation",
  },
  {
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
    alt: "Rare unheated Padparadscha lotus sunset hue oval gem",
  },
  {
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85",
    alt: "Ceylon Pigeon Blood Ruby macro crystalline facet reflection",
  },
  {
    url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85",
    alt: "Six-ray asterism cornflower star sapphire high dome cabochon",
  },
  {
    url: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85",
    alt: "Golden Pushparaga yellow sapphire from Balangoda",
  },
];

export function MultiImageUploader({ images, onChange }: MultiImageUploaderProps) {
  const [urlInput, setUrlInput] = useState("");
  const [altInput, setAltInput] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  // Move image left (closer to primary index 0)
  const moveLeft = (index: number) => {
    if (index <= 0) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onChange(updated);
  };

  // Move image right
  const moveRight = (index: number) => {
    if (index >= images.length - 1) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onChange(updated);
  };

  // Set as primary hero (move to index 0)
  const setPrimary = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    onChange(updated);
  };

  // Remove image
  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Update alt text for an image
  const updateAlt = (index: number, newAlt: string) => {
    const updated = images.map((img, i) => (i === index ? { ...img, alt: newAlt } : img));
    onChange(updated);
  };

  // Add image by URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    onChange([
      ...images,
      {
        url: urlInput.trim(),
        alt: altInput.trim() || `Gemstone view ${images.length + 1}`,
      },
    ]);
    setUrlInput("");
    setAltInput("");
  };

  const [uploading, setUploading] = useState(false);

  // File upload to Supabase Storage (with graceful data URL fallback)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedImages: GemImage[] = [];

    for (const file of Array.from(files)) {
      let resolvedUrl: string | null = null;
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadGemMediaAction(formData);
        if (res.success && res.url) {
          resolvedUrl = res.url;
        }
      } catch {
        // Fallback to local data URL
      }

      if (!resolvedUrl) {
        resolvedUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve((event.target?.result as string) || "");
          };
          reader.readAsDataURL(file);
        });
      }

      if (resolvedUrl) {
        uploadedImages.push({
          url: resolvedUrl,
          alt: file.name.replace(/\.[^/.]+$/, ""),
        });
      }
    }

    if (uploadedImages.length > 0) {
      onChange([...images, ...uploadedImages]);
    }
    setUploading(false);
    e.target.value = "";
  };

  const addPreset = (preset: { url: string; alt: string }) => {
    onChange([...images, preset]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm uppercase tracking-wider font-semibold text-[#5E0F1E] block">
            Gemstone Photography & Macro Views ({images.length})
          </label>
          <p className="text-xs text-[#2B2B2B]/70 mt-0.5">
            The first image is the primary cover. Use the arrows to reorder or click &apos;Make Cover&apos;.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-sm text-[#B8924A] hover:text-[#5E0F1E] flex items-center gap-1.5 font-medium underline cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF67]" />
          <span>{showPresets ? "Hide Gallery Presets" : "Pick from Presets"}</span>
        </button>
      </div>

      {/* Preset Pickers */}
      {showPresets && (
        <div className="p-3.5 bg-[#F2EADB] border border-[#B8924A]/40 rounded-xs space-y-2.5 animate-gentle-fade">
          <p className="text-xs uppercase font-bold tracking-wider text-[#5E0F1E]">
            Curated Ceylon High-Res Presets (Click to Add):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {PRESET_CEYLON_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addPreset(preset)}
                className="group relative aspect-square rounded-xs overflow-hidden border border-[#B8924A]/30 hover:border-[#5E0F1E] text-left transition-all"
              >
                <Image
                  src={preset.url}
                  alt={preset.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="120px"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                  + Add View
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Images Gallery with Reordering */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {images.map((img, index) => {
            const isPrimary = index === 0;

            return (
              <div
                key={`${img.url}-${index}`}
                className={`relative border bg-white p-2.5 flex flex-col justify-between transition-all rounded-xs shadow-xs ${
                  isPrimary
                    ? "border-[#5E0F1E] ring-2 ring-[#5E0F1E]/20"
                    : "border-[#B8924A]/30 hover:border-[#B8924A]"
                }`}
              >
                {/* Image preview */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-[#FAF6EE] mb-2 rounded-xs">
                  <Image
                    src={img.url}
                    alt={img.alt || `View ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />

                  {/* Primary Cover Badge */}
                  {isPrimary ? (
                    <span className="absolute top-2 left-2 px-2.5 py-1 bg-[#5E0F1E] text-[#FAF6EE] text-xs uppercase tracking-wider font-bold flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-current text-[#D4AF67]" />
                      Primary Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPrimary(index)}
                      className="absolute top-2 left-2 px-2.5 py-1 bg-black/70 hover:bg-[#5E0F1E] text-white text-xs uppercase tracking-wider font-semibold opacity-0 hover:opacity-100 transition-opacity"
                    >
                      Make Cover
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-xs shadow-md transition-colors"
                    title="Remove Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Alt Text Input */}
                <div className="space-y-1 mb-2">
                  <span className="text-xs text-[#2B2B2B]/70 font-semibold uppercase">
                    Alt Text (SEO):
                  </span>
                  <input
                    type="text"
                    value={img.alt}
                    onChange={(e) => updateAlt(index, e.target.value)}
                    placeholder="Describe angle, facet, or lighting"
                    className="w-full text-xs p-2 border border-[#B8924A]/30 rounded-xs bg-[#FAF6EE]/50 focus:bg-white focus:outline-none focus:border-[#5E0F1E]"
                  />
                </div>

                {/* Reorder Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-[#B8924A]/20 text-xs">
                  <span className="text-xs text-[#2B2B2B]/70 font-mono font-bold">
                    Slot #{index + 1}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveLeft(index)}
                      disabled={index === 0}
                      className="h-7 w-7 p-0 border-[#B8924A]/40 text-[#5E0F1E] disabled:opacity-30"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveRight(index)}
                      disabled={index === images.length - 1}
                      className="h-7 w-7 p-0 border-[#B8924A]/40 text-[#5E0F1E] disabled:opacity-30"
                      title="Move Right"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 border-2 border-dashed border-[#B8924A]/40 text-center bg-[#FAF6EE] rounded-xs space-y-2">
          <Upload className="w-8 h-8 mx-auto text-[#B8924A]" />
          <p className="text-sm font-semibold text-[#5E0F1E]">No images uploaded yet</p>
          <p className="text-xs text-[#2B2B2B]/60 max-w-sm mx-auto">
            Add high-resolution macro photography, facet angles, or certificates below.
          </p>
        </div>
      )}

      {/* Add New Image Controls */}
      <div className="p-4 bg-[#F2EADB]/60 border border-[#B8924A]/30 rounded-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5E0F1E] block">
          Add Photo via File Upload or URL
        </span>

        {/* File input button */}
        <div className="flex flex-wrap items-center gap-3">
          <label className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 text-[#FAF6EE] text-sm font-semibold rounded-xs shadow-xs transition-colors ${uploading ? "bg-[#5E0F1E]/70 cursor-wait" : "bg-[#5E0F1E] hover:bg-[#420A15]"}`}>
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#D4AF67]" />
                <span>Uploading to Vault...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Device Files</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <span className="text-xs text-[#2B2B2B]/60 font-medium">or paste remote image link:</span>
        </div>

        {/* Add by URL Form */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://... image URL (Unsplash, CDN, Supabase Storage)"
            className="text-sm h-10 flex-1 bg-white"
          />
          <Input
            value={altInput}
            onChange={(e) => setAltInput(e.target.value)}
            placeholder="Image Alt Description"
            className="text-sm h-10 sm:w-56 bg-white"
          />
          <Button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
            variant="outline"
            className="text-sm h-10 px-4 border-[#B8924A]/50 text-[#5E0F1E] shrink-0 font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Image
          </Button>
        </div>
      </div>
    </div>
  );
}
