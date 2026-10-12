"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gemstone } from "@/types/gem";
import { GoldDivider } from "@/components/layout/gold-divider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatCarats } from "@/lib/utils";
import { ArrowRight, Eye, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

interface FeaturedGemsProps {
  gems: Gemstone[];
}

export function FeaturedGems({ gems }: FeaturedGemsProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedGemForEnquiry, setSelectedGemForEnquiry] = useState<Gemstone | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");

  const filters = [
    { label: "All Masterpieces", key: "all" },
    { label: "Royal Blue", key: "Royal Blue" },
    { label: "Padparadscha", key: "Padparadscha" },
    { label: "Collector Rare", key: "rare" },
  ];

  const filteredGems = gems.filter((gem) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "Royal Blue") return gem.variety.includes("Royal Blue");
    if (selectedFilter === "Padparadscha") return gem.variety.includes("Padparadscha");
    if (selectedFilter === "rare") return gem.variety.includes("Star") || gem.variety.includes("Ruby") || gem.variety.includes("Yellow");
    return true;
  });

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySuccess(true);
    setTimeout(() => {
      setSelectedGemForEnquiry(null);
      setEnquirySuccess(false);
      setEnquiryName("");
      setEnquiryEmail("");
      setEnquiryPhone("");
    }, 2200);
  };

  return (
    <section className="py-20 bg-[#FAF6EE] border-b border-[#B8924A]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold block">
            Rare Specimen Showcase
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-normal leading-tight">
            Featured Ceylon Gemstones
          </h2>
          <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
            Singular, investment-grade corundum crystals cut and polished to maximize optical dispersion, fire, and internal life.
          </p>
          <GoldDivider withOrnament className="my-5" />

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className={`text-xs uppercase tracking-wider px-4 py-2 border transition-all cursor-pointer font-medium ${
                  selectedFilter === f.key
                    ? "bg-[#5E0F1E] text-[#FAF6EE] border-[#5E0F1E] shadow-xs"
                    : "bg-[#FDFBF7] text-[#2B2B2B] border-[#B8924A]/30 hover:border-[#B8924A]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gemstones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGems.slice(0, 6).map((gem) => {
            const primaryImage = gem.images[0] || {
              url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80",
              alt: `${gem.name}`,
            };

            return (
              <article
                key={gem.id}
                className="group bg-[#FDFBF7] border border-[#B8924A]/30 overflow-hidden transition-all duration-300 hover:border-[#B8924A] hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative aspect-4/3 w-full bg-[#FAF6EE] overflow-hidden border-b border-[#B8924A]/20">
                    <Link href={`/gems/${gem.slug}`} className="block w-full h-full relative">
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt || `${gem.name} from ${gem.origin}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                      />
                    </Link>

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                      <Badge variant="maroon" className="text-[9px] py-0.5 px-2">
                        {gem.origin.split(" ")[0]}
                      </Badge>
                      {gem.treatment.toLowerCase().includes("unheated") && (
                        <Badge variant="unheated" className="text-[9px] py-0.5 px-2 bg-[#FAF6EE]/90">
                          100% Unheated
                        </Badge>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 pointer-events-none">
                      <Badge variant="gold" className="text-[9px] py-0.5 px-2 bg-[#FAF6EE]/90">
                        {gem.certificate.lab}
                      </Badge>
                    </div>
                  </div>

                  {/* Gem Details */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-[#B8924A] font-semibold uppercase tracking-wider">
                      <span>{gem.variety}</span>
                      <span className="text-[#1B3A8A] font-bold">{formatCarats(gem.carat)}</span>
                    </div>

                    <h3 className="font-serif text-xl font-medium text-[#5E0F1E] group-hover:text-[#420A15] transition-colors leading-snug">
                      <Link href={`/gems/${gem.slug}`}>{gem.name}</Link>
                    </h3>

                    <p className="text-xs text-[#2B2B2B]/70 line-clamp-2 leading-relaxed">
                      {gem.description}
                    </p>

                    <div className="pt-2 flex items-center space-x-3 text-xs text-[#2B2B2B]/75 border-t border-[#B8924A]/15">
                      <span>{gem.cut}</span>
                      <span>•</span>
                      <span>{gem.color}</span>
                      <span>•</span>
                      <span>{gem.clarity}</span>
                    </div>
                  </div>
                </div>

                {/* Footer with Price and Actions */}
                <div className="p-5 pt-0 mt-3">
                  <div className="pt-3 border-t border-[#B8924A]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#2B2B2B]/60 block font-medium">
                        Investment Value
                      </span>
                      <span className="font-serif text-xl font-bold text-[#1B3A8A]">
                        {formatCurrency(gem.price, gem.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedGemForEnquiry(gem)}
                        className="border border-[#B8924A] text-[#5E0F1E] hover:bg-[#5E0F1E] hover:text-[#FAF6EE] text-[11px] uppercase tracking-wider px-3.5 py-2 font-medium transition-colors cursor-pointer"
                      >
                        Enquire
                      </button>

                      <Link
                        href={`/gems/${gem.slug}`}
                        className="p-2 border border-[#B8924A]/30 text-[#2B2B2B] hover:text-[#5E0F1E] hover:border-[#B8924A] transition-colors"
                        aria-label={`View full details of ${gem.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-14">
          <Link href="/gems">
            <Button variant="outline" size="lg" className="gap-2">
              <span>View All Available Ceylon Gemstones</span>
              <ArrowRight className="w-4 h-4 text-[#B8924A]" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Gemstone Enquiry Modal */}
      {selectedGemForEnquiry && (
        <Modal
          isOpen={!!selectedGemForEnquiry}
          onClose={() => setSelectedGemForEnquiry(null)}
          title={`Enquire: ${selectedGemForEnquiry.name}`}
          description={`Direct confidential inquiry for Specimen #${selectedGemForEnquiry.id} (${selectedGemForEnquiry.carat} cts ${selectedGemForEnquiry.variety}). Verified by ${selectedGemForEnquiry.certificate.lab}.`}
          size="md"
        >
          {enquirySuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#B8924A]/20 text-[#5E0F1E] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#5E0F1E]" />
              </div>
              <h4 className="font-serif text-2xl text-[#5E0F1E]">Dossier Requested</h4>
              <p className="text-xs text-[#2B2B2B]/80 max-w-sm mx-auto">
                Your interest in {selectedGemForEnquiry.name} has been notified to our head gemologist. You will receive microscopic high-resolution video and lab certificate scans shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleEnquirySubmit} className="space-y-4 pt-2">
              <div className="p-3 bg-[#F2EADB]/60 border border-[#B8924A]/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#5E0F1E] block">
                    {formatCarats(selectedGemForEnquiry.carat)} • {selectedGemForEnquiry.cut}
                  </span>
                  <span className="text-[#2B2B2B]/70">Origin: {selectedGemForEnquiry.origin}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#1B3A8A] font-serif text-base block">
                    {formatCurrency(selectedGemForEnquiry.price, selectedGemForEnquiry.currency)}
                  </span>
                  <Badge variant="unheated" className="text-[9px]">
                    {selectedGemForEnquiry.treatment}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                  Your Full Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Dr. Arthur C. Clarke"
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                  className="bg-[#FAF6EE]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  required
                  placeholder="collector@domain.com"
                  value={enquiryEmail}
                  onChange={(e) => setEnquiryEmail(e.target.value)}
                  className="bg-[#FAF6EE]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                  Telephone / WhatsApp (Optional)
                </label>
                <Input
                  placeholder="+1 (555) 019-2834"
                  value={enquiryPhone}
                  onChange={(e) => setEnquiryPhone(e.target.value)}
                  className="bg-[#FAF6EE]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#B8924A]/20">
                <span className="text-[10px] text-[#2B2B2B]/60 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8924A]" />
                  <span>NGJA Licensed Custody</span>
                </span>
                <Button type="submit" variant="primary" size="sm">
                  Send Private Specimen Enquiry
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </section>
  );
}
