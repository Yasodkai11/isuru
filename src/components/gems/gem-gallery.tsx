"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GemImage } from "@/types/gem";
import { ZoomIn, Sparkles, X, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GemGalleryProps {
  images: GemImage[];
  gemName: string;
  origin: string;
  certificateLab: string;
}

export function GemGallery({
  images,
  gemName,
  origin,
  certificateLab,
}: GemGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const fallbackImage: GemImage = {
    url: "/isuru_images/blue1.jpg",
    alt: `${gemName} macro gemstone view`,
  };

  const galleryImages = images.length > 0 ? images : [fallbackImage];
  const activeImage = galleryImages[activeIndex] || fallbackImage;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(((e.clientX - left) / width) * 100, 0), 100);
    const y = Math.min(Math.max(((e.clientY - top) / height) * 100, 0), 100);
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display with Hover Zoom / Loupe Effect */}
      <div
        className="relative aspect-4/3 w-full bg-[#FAF6EE] border border-[#B8924A]/40 overflow-hidden shadow-md cursor-crosshair group select-none"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsZoomed(true)}
      >
        {/* Normal Image */}
        <Image
          src={activeImage.url}
          alt={activeImage.alt || `${gemName} facet photo`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 750px"
          className={`object-cover transition-transform duration-300 ${
            isHovering ? "scale-130 opacity-90" : "scale-100 opacity-100"
          }`}
          style={{
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
          }}
        />

        {/* Top Floating Origin and Certificate Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 pointer-events-none">
          <Badge variant="maroon" className="text-[9px] py-0.5 px-2.5 shadow-xs">
            {origin}
          </Badge>
          <Badge variant="gold" className="text-[9px] py-0.5 px-2 bg-[#FAF6EE]/90 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-[#B8924A] mr-1 inline" />
            {certificateLab} Certified
          </Badge>
        </div>

        {/* Zoom Hint Button */}
        <div className="absolute bottom-3.5 right-3.5 bg-[#FAF6EE]/90 backdrop-blur-xs border border-[#B8924A]/40 px-3 py-1.5 flex items-center gap-1.5 text-[11px] text-[#5E0F1E] font-medium transition-opacity opacity-85 group-hover:opacity-100">
          <ZoomIn className="w-3.5 h-3.5 text-[#B8924A]" />
          <span>Click to Inspect High-Resolution</span>
        </div>
      </div>

      {/* Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {galleryImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-20 shrink-0 bg-[#FAF6EE] border transition-all cursor-pointer overflow-hidden ${
                  isActive
                    ? "border-[#5E0F1E] ring-2 ring-[#B8924A]/60 shadow-sm"
                    : "border-[#B8924A]/30 hover:border-[#B8924A] opacity-75 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${gemName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal with Full-Screen Optical Inspection */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#2B2B2B]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-gentle-fade"
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 p-2 text-[#FAF6EE] hover:text-[#B8924A] hover:bg-[#FAF6EE]/10 transition-colors cursor-pointer"
            aria-label="Close high-resolution zoom view"
          >
            <X className="w-7 h-7" />
          </button>

          <div className="relative max-w-5xl w-full max-h-[85vh] aspect-4/3 bg-[#FAF6EE] border border-[#B8924A]/50 shadow-2xl overflow-hidden">
            <Image
              src={activeImage.url}
              alt={activeImage.alt || `${gemName} macro zoom inspection`}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-contain"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[#FAF6EE]/95 border border-[#B8924A]/30 p-3.5 flex items-center justify-between text-xs text-[#2B2B2B]">
              <div>
                <span className="font-serif font-medium text-base text-[#5E0F1E] block">
                  {gemName}
                </span>
                <span className="text-[#2B2B2B]/70">
                  Macro Microscopic View • 100% Earth-Mined Natural Ceylon Corundum
                </span>
              </div>
              <Badge variant="unheated">Pure Mineral Provenance</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
