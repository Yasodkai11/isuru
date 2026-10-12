"use client";

import React, { useState } from "react";
import { GoldDivider } from "@/components/layout/gold-divider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { BRAND } from "@/lib/constants";
import {
  Sparkles,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
} from "lucide-react";

export function EnquiryCTA() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    variety: "Ceylon Royal Blue Sapphire",
    carat: "3.00 - 5.00 carats",
    budget: "$10,000 - $25,000",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      variety: "Ceylon Royal Blue Sapphire",
      carat: "3.00 - 5.00 carats",
      budget: "$10,000 - $25,000",
      message: "",
    });
  };

  return (
    <section className="py-20 bg-[#FAF6EE] relative overflow-hidden border-b border-[#B8924A]/25">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#B8924A]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#5E0F1E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative & Concierge Perks */}
          <div className="lg:col-span-5 space-y-6">
            <Badge variant="gold" className="text-[10px] tracking-[0.25em] py-1 px-3">
              <Sparkles className="w-3.5 h-3.5 text-[#B8924A] mr-1.5 inline" />
              Bespoke Acquisition Desk
            </Badge>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#5E0F1E] font-normal leading-[1.18] tracking-tight">
              Acquire a Ceylon Masterpiece
            </h2>

            <p className="text-sm sm:text-base text-[#2B2B2B]/80 font-normal leading-relaxed">
              Seeking an investment-grade unheated Royal Blue, a rare Padparadscha lotus crystal, or commercial gemstone parcels for haute joaillerie? Our principal gemologists in Ratnapura and Colombo curate stones directly from active alluvial pits.
            </p>

            <GoldDivider className="my-5 max-w-sm" />

            {/* Concierge Benefits */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-none border border-[#B8924A]/40 bg-[#FDFBF7] flex items-center justify-center shrink-0 text-[#5E0F1E] mt-0.5">
                  <Compass className="w-4 h-4 text-[#B8924A]" />
                </div>
                <div>
                  <h3 className="font-serif text-base text-[#5E0F1E] font-semibold">
                    Direct Alluvial Pit Traceability
                  </h3>
                  <p className="text-xs text-[#2B2B2B]/70 leading-relaxed">
                    Single-source extraction documentation with full disclosure of natural origin.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-none border border-[#B8924A]/40 bg-[#FDFBF7] flex items-center justify-center shrink-0 text-[#5E0F1E] mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-[#B8924A]" />
                </div>
                <div>
                  <h3 className="font-serif text-base text-[#5E0F1E] font-semibold">
                    Global Lab Certification on Demand
                  </h3>
                  <p className="text-xs text-[#2B2B2B]/70 leading-relaxed">
                    Facilitated certification from NGJA, GIA, GRS Swisslab, or SSEF prior to dispatch.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-none border border-[#B8924A]/40 bg-[#FDFBF7] flex items-center justify-center shrink-0 text-[#5E0F1E] mt-0.5">
                  <Clock className="w-4 h-4 text-[#B8924A]" />
                </div>
                <div>
                  <h3 className="font-serif text-base text-[#5E0F1E] font-semibold">
                    Confidential 24-Hour Response
                  </h3>
                  <p className="text-xs text-[#2B2B2B]/70 leading-relaxed">
                    Private high-resolution videos, microscopic inclusions inspection, and gemstone appraisals.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-4 flex flex-wrap gap-4 text-xs font-medium">
              <a
                href={`https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#1B3A8A] hover:text-[#5E0F1E] border border-[#B8924A]/40 px-3.5 py-2 bg-[#FDFBF7] transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#B8924A]" />
                <span>WhatsApp Concierge</span>
              </a>

              <a
                href={`tel:${BRAND.phone}`}
                className="inline-flex items-center gap-2 text-[#2B2B2B] hover:text-[#5E0F1E] border border-[#B8924A]/40 px-3.5 py-2 bg-[#FDFBF7] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#B8924A]" />
                <span>{BRAND.phone}</span>
              </a>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 text-[#5E0F1E] underline-offset-4 hover:underline py-2"
              >
                <span>View Acquisition Terms & Security</span>
              </button>
            </div>
          </div>

          {/* Right Column: Private Enquiry Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#FDFBF7] border border-[#B8924A]/40 p-6 sm:p-10 shadow-xl relative">
              {/* Outer decorative gold accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#B8924A] via-[#D4AF67] to-[#B8924A]" />

              <div className="mb-6 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
                  Confidential Dossier
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-medium">
                  Private Sourcing Request
                </h3>
                <p className="text-xs text-[#2B2B2B]/70">
                  Please outline your gemstone criteria. Our head gemologist will review available rough and polished inventory.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center space-y-4 bg-[#FAF6EE] border border-[#B8924A]/30 animate-gentle-fade">
                  <div className="w-12 h-12 rounded-full bg-[#B8924A]/20 text-[#5E0F1E] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-[#5E0F1E]" />
                  </div>
                  <h4 className="font-serif text-2xl text-[#5E0F1E] font-medium">
                    Enquiry Received
                  </h4>
                  <p className="text-xs sm:text-sm text-[#2B2B2B]/80 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name || "valued patron"}. Your private inquiry has been transmitted to our Ratnapura acquisition desk. A dedicated gemologist will connect within 24 hours with certified stone dossiers.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleReset} className="mt-2">
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                        Full Name *
                      </label>
                      <Input
                        required
                        placeholder="Lord / Lady / Dr. / Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        placeholder="client@luxuryportfolio.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-[#FAF6EE]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                        Gemstone Variety
                      </label>
                      <select
                        value={formData.variety}
                        onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                        className="flex h-11 w-full bg-[#FAF6EE] border border-[#B8924A]/40 px-3 py-2 text-xs text-[#2B2B2B] focus:border-[#B8924A] focus:outline-none transition-subtle"
                      >
                        <option value="Ceylon Royal Blue Sapphire">Royal Blue Sapphire</option>
                        <option value="Cornflower Blue Sapphire">Cornflower Blue Sapphire</option>
                        <option value="Ceylon Padparadscha">Padparadscha Sapphire</option>
                        <option value="Ceylon Ruby (Pigeon Blood)">Ceylon Ruby</option>
                        <option value="Pushparaga (Yellow Sapphire)">Yellow Sapphire</option>
                        <option value="Asterism Star Sapphire">Star Sapphire</option>
                        <option value="Chrysoberyl Alexandrite">Alexandrite</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                        Target Carat Weight
                      </label>
                      <select
                        value={formData.carat}
                        onChange={(e) => setFormData({ ...formData, carat: e.target.value })}
                        className="flex h-11 w-full bg-[#FAF6EE] border border-[#B8924A]/40 px-3 py-2 text-xs text-[#2B2B2B] focus:border-[#B8924A] focus:outline-none transition-subtle"
                      >
                        <option value="1.00 - 2.50 carats">1.00 - 2.50 cts</option>
                        <option value="3.00 - 5.00 carats">3.00 - 5.00 cts</option>
                        <option value="5.00 - 10.00 carats">5.00 - 10.00 cts</option>
                        <option value="10.00+ carats (Museum)">10.00+ cts (Museum)</option>
                        <option value="Parcel Lot / Wholesale">Parcel / Wholesale</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                        Target Range (USD)
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="flex h-11 w-full bg-[#FAF6EE] border border-[#B8924A]/40 px-3 py-2 text-xs text-[#2B2B2B] focus:border-[#B8924A] focus:outline-none transition-subtle"
                      >
                        <option value="$5,000 - $10,000">$5,000 – $10,000</option>
                        <option value="$10,000 - $25,000">$10,000 – $25,000</option>
                        <option value="$25,000 - $75,000">$25,000 – $75,000</option>
                        <option value="$75,000+ (High Value)">$75,000+ (Imperial)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                      Cut Preferences & Bespoke Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify preferred shape (Cushion, Oval, Emerald cut), unheated certification requirements (GRS, GIA, NGJA), or intended jewelry mounting..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#FAF6EE] border border-[#B8924A]/40 p-3 text-xs text-[#2B2B2B] placeholder:text-[#2B2B2B]/40 focus:border-[#B8924A] focus:outline-none transition-subtle"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[11px] text-[#2B2B2B]/60 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#B8924A]" />
                      <span>Encrypted • Strictly Confidential</span>
                    </span>

                    <Button
                      type="submit"
                      variant="gold"
                      size="md"
                      isLoading={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      Transmit Sourcing Dossier
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog demonstrating the Modal UI Component */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Acquisition Protocol & Ceylon Provenance"
        description="Official standards, security escrows, and international gem export compliance governed by the National Gem and Jewellery Authority of Sri Lanka."
        size="lg"
        footer={
          <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>
            Acknowledge & Close
          </Button>
        }
      >
        <div className="space-y-4 text-xs sm:text-sm text-[#2B2B2B]/80 leading-relaxed">
          <div className="p-4 bg-[#F2EADB]/50 border border-[#B8924A]/30 space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-[#B8924A] font-bold block">
              Direct Mine-to-Vault Chain of Custody
            </span>
            <p>
              Every stone is extracted through licensed alluvial pits in the Sabaragamuwa province. Isuru Gems adheres strictly to ethical mining practices without open-cast strip damage.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-base text-[#5E0F1E] font-semibold">
              Payment & Armoured Transit
            </h4>
            <p>
              High-value acquisitions are secured via escrow or verified bank wire. Shipments are handled door-to-door by specialized luxury armoured couriers (Malca-Amit / Brink's) with 100% comprehensive maritime and transit insurance.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-base text-[#5E0F1E] font-semibold">
              Laboratory Verification Guarantee
            </h4>
            <p>
              Each gemstone comes with an unconditional lifetime guarantee of natural earth-mined authenticity. Full refunds are provided if any accredited independent gemological laboratory (GIA, GRS, Gubelin, SSEF, or NGJA) contradicts our certificate.
            </p>
          </div>
        </div>
      </Modal>
    </section>
  );
}
