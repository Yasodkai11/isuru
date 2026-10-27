"use client";

import { MapPin, ExternalLink, Clock } from "lucide-react";

export const RATNAPURA_MAP_EMBED =
  "https://maps.google.com/maps?q=Gem%20Market%20Arcade%2C%20Ratnapura%2C%20Sri%20Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed";

export const RATNAPURA_LOCATION = {
  id: "ratnapura",
  title: "Ratnapura Mining Bureau",
  shortLabel: "Ratnapura Bureau",
  address: "Main Gem Market Arcade, Ratnapura, Sri Lanka",
  hours: "Tuesday – Sunday: 08:00 – 16:00",
  directionsUrl:
    "https://maps.google.com/maps?q=Gem%20Market%20Arcade%2C%20Ratnapura%2C%20Sri%20Lanka",
};

export function SalonMap() {
  return (
    <div className="bg-[#FDFBF7] border border-[#B8924A]/35 rounded-xl overflow-hidden shadow-xs">
      {/* Location Header */}
      <div className="p-4 sm:p-5 border-b border-[#B8924A]/20 bg-[#FAF6EE] space-y-1">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[#80601C] font-semibold block">
          Bureau Location Map
        </span>
        <h3 className="font-serif text-lg text-[#5E0F1E] font-medium leading-tight">
          {RATNAPURA_LOCATION.title}
        </h3>
      </div>

      {/* Responsive Map Embed Container - Fixed 300px height */}
      <div className="relative w-full h-[300px] bg-stone-100 overflow-hidden">
        <iframe
          title={`Google Map for ${RATNAPURA_LOCATION.title}`}
          src={RATNAPURA_MAP_EMBED}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full border-0"
          aria-label={`Interactive map of ${RATNAPURA_LOCATION.title}`}
        />
      </div>

      {/* Location Details & Directions Button */}
      <div className="space-y-3 border-t border-[#B8924A]/20 bg-[#FAF6EE] px-4 py-4">
        <div className="flex items-start gap-2.5 text-xs leading-relaxed text-[#2B2B2B]/85">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#80601C]" />
          <span className="font-medium">{RATNAPURA_LOCATION.address}</span>
        </div>
        <div className="flex flex-col gap-2.5 border-t border-[#B8924A]/15 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-xs leading-relaxed text-[#2B2B2B]/75">
            <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#80601C]" />
            <span>{RATNAPURA_LOCATION.hours}</span>
          </div>
          <a
            href={RATNAPURA_LOCATION.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-[#80601C] hover:text-[#5E0F1E] transition-colors sm:self-auto cursor-pointer"
          >
            <span>Directions</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
