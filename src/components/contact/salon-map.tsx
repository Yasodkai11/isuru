"use client";

import { useState } from "react";
import { MapPin, ExternalLink, Clock } from "lucide-react";

interface SalonLocation {
  id: "colombo" | "ratnapura";
  title: string;
  shortLabel: string;
  address: string;
  hours: string;
  query: string;
  mapEmbedUrl: string;
}

const SALONS: SalonLocation[] = [
  {
    id: "colombo",
    title: "Colombo Private Salon",
    shortLabel: "Colombo Flagship",
    address: "42 York Street, Fort, Colombo 01, Sri Lanka",
    hours: "Monday – Saturday: 09:30 – 18:30 (By Appointment)",
    query: "42+York+Street,+Fort,+Colombo+01,+Sri+Lanka",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=42%20York%20Street%2C%20Fort%2C%20Colombo%2001%2C%20Sri%20Lanka&t=&z=16&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "ratnapura",
    title: "Ratnapura Mining Bureau",
    shortLabel: "Ratnapura Bureau",
    address: "Main Gem Market Arcade, Ratnapura, Sri Lanka",
    hours: "Tuesday – Sunday: 08:00 – 16:00",
    query: "Gem+Market+Arcade,+Ratnapura,+Sri+Lanka",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Gem%20Market%20Arcade%2C%20Ratnapura%2C%20Sri%20Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
];

export function SalonMap() {
  const [selectedSalon, setSelectedSalon] = useState<SalonLocation>(SALONS[0]);

  return (
    <div className="bg-[#FDFBF7] border border-[#B8924A]/30 overflow-hidden shadow-xs">
      {/* Location Selector Tabs */}
      <div className="p-4 sm:p-5 border-b border-[#B8924A]/20 bg-[#FAF6EE]/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
            Interactive Salon Map
          </span>
          <h3 className="font-serif text-lg text-[#5E0F1E] font-medium mt-0.5">
            {selectedSalon.title}
          </h3>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#B8924A]/20 self-start sm:self-auto">
          {SALONS.map((salon) => {
            const isActive = selectedSalon.id === salon.id;
            return (
              <button
                key={salon.id}
                type="button"
                onClick={() => setSelectedSalon(salon)}
                className={`px-3 py-1 text-xs font-serif transition-all duration-200 ${
                  isActive
                    ? "bg-[#5E0F1E] text-white shadow-xs font-medium"
                    : "text-[#2B2B2B]/75 hover:text-[#5E0F1E] hover:bg-cream/50"
                }`}
                aria-pressed={isActive}
              >
                {salon.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Embed Container */}
      <div className="relative w-full h-64 sm:h-72 bg-stone-100">
        <iframe
          key={selectedSalon.id}
          title={`Google Map for ${selectedSalon.title}`}
          src={selectedSalon.mapEmbedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          aria-label={`Interactive map of ${selectedSalon.title}`}
        />
      </div>

      {/* Location Details & Directions Button */}
      <div className="space-y-3 border-t border-gold/20 bg-cream px-4 py-4">
        <div className="flex items-start gap-2 text-xs leading-relaxed text-charcoal/80">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-dark" />
          <span>{selectedSalon.address}</span>
        </div>
        <div className="flex flex-col gap-3 border-t border-gold/15 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-xs leading-relaxed text-charcoal/75">
            <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-dark" />
            <span>{selectedSalon.hours}</span>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${selectedSalon.query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-gold-dark transition-colors hover:text-maroon sm:self-auto"
          >
            <span>Directions</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
