"use client";

import { useState } from "react";
import { MapPin, ExternalLink, Clock } from "lucide-react";

export const MAP_EMBEDS = {
  colombo:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3959.791289268509!2d79.8994!3d7.0338!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bd1e3957c5f%3A0xcb102ae7bd88bef5!2sColombo%2000500!5e0!3m2!1sen!2slk!4v1792642043666!5m2!1sen!2slk",
  // TODO: Paste the Ratnapura Google Maps embed URL here when available
  ratnapura:
    "https://maps.google.com/maps?q=Gem%20Market%20Arcade%2C%20Ratnapura%2C%20Sri%20Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed",
};

interface SalonLocation {
  id: "colombo" | "ratnapura";
  title: string;
  shortLabel: string;
  address: string;
  hours: string;
  query: string;
  directionsUrl: string;
}

const SALONS: SalonLocation[] = [
  {
    id: "colombo",
    title: "Colombo Private Salon",
    shortLabel: "Colombo Flagship",
    address: "Colombo 00500, Sri Lanka",
    hours: "Monday – Saturday: 09:30 – 18:30 (By Appointment)",
    query: "Colombo+00500,+Sri+Lanka",
    directionsUrl:
      "https://maps.google.com/maps/search/Colombo%2000500%2C%20Sri%20Lanka/@7.0338,79.8994,17z?hl=en",
  },
  {
    id: "ratnapura",
    title: "Ratnapura Mining Bureau",
    shortLabel: "Ratnapura Bureau",
    address: "Main Gem Market Arcade, Ratnapura, Sri Lanka",
    hours: "Tuesday – Sunday: 08:00 – 16:00",
    query: "Gem+Market+Arcade,+Ratnapura,+Sri+Lanka",
    directionsUrl:
      "https://maps.google.com/maps?q=Gem%20Market%20Arcade%2C%20Ratnapura%2C%20Sri%20Lanka",
  },
];

export function SalonMap() {
  const [selectedSalon, setSelectedSalon] = useState<SalonLocation>(SALONS[0]);

  return (
    <div className="bg-[#FDFBF7] border border-[#B8924A]/35 rounded-xl overflow-hidden shadow-xs">
      {/* Location Selector Header - cleanly structured without overlap */}
      <div className="p-4 sm:p-5 border-b border-[#B8924A]/20 bg-[#FAF6EE] space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#80601C] font-semibold">
            Interactive Salon Map
          </span>

          {/* Tab Switcher */}
          <div className="inline-flex items-center rounded-lg bg-white p-1 border border-[#B8924A]/25 shadow-2xs">
            {SALONS.map((salon) => {
              const isActive = selectedSalon.id === salon.id;
              return (
                <button
                  key={salon.id}
                  type="button"
                  onClick={() => setSelectedSalon(salon)}
                  className={`px-3 py-1 text-xs rounded-md font-serif transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#5E0F1E] text-white shadow-xs font-medium"
                      : "text-[#2B2B2B]/75 hover:text-[#5E0F1E] hover:bg-cream"
                  }`}
                  aria-pressed={isActive}
                >
                  {salon.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        <h3 className="font-serif text-lg text-[#5E0F1E] font-medium leading-tight">
          {selectedSalon.title}
        </h3>
      </div>

      {/* Responsive Map Embed Container - Fixed 300px height */}
      <div className="relative w-full h-[300px] bg-stone-100 overflow-hidden">
        <iframe
          key={selectedSalon.id}
          title={`Google Map for ${selectedSalon.title}`}
          src={MAP_EMBEDS[selectedSalon.id]}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full border-0"
          aria-label={`Interactive map of ${selectedSalon.title}`}
        />
      </div>

      {/* Location Details & Directions Button */}
      <div className="space-y-3 border-t border-[#B8924A]/20 bg-[#FAF6EE] px-4 py-4">
        <div className="flex items-start gap-2.5 text-xs leading-relaxed text-[#2B2B2B]/85">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#80601C]" />
          <span className="font-medium">{selectedSalon.address}</span>
        </div>
        <div className="flex flex-col gap-2.5 border-t border-[#B8924A]/15 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-xs leading-relaxed text-[#2B2B2B]/75">
            <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#80601C]" />
            <span>{selectedSalon.hours}</span>
          </div>
          <a
            href={selectedSalon.directionsUrl}
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
