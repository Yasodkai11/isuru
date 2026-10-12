"use client";

import React, { useState } from "react";
import { submitWholesaleInquiryAction, InquiryResult } from "@/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, Sparkles, Building2, Send } from "lucide-react";

const PARCEL_TYPES = [
  "Calibrated Sapphire Lots (Round / Princess 2mm-5mm)",
  "Cornflower & Royal Blue Matching Pairs",
  "High-Jewelry Layout Suites & Graded Lines",
  "Padparadscha & Fancy Color Sapphire Parcels",
  "Unheated Single Investment Stones (5+ carats)",
  "Mine-Direct Rough Crystals (Facet Grade)",
  "Custom Lapidary Cutting to Order",
];

const VOLUME_OPTIONS = [
  "Under 25 carats (Sample lot)",
  "25 – 50 carats",
  "50 – 150 carats",
  "150 – 500 carats",
  "500+ carats (Export parcel)",
  "Recurring Monthly Allocation",
];

export function WholesaleForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    parcelType: PARCEL_TYPES[0],
    targetVolume: VOLUME_OPTIONS[1],
    targetBudget: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<InquiryResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const result = await submitWholesaleInquiryAction({
      companyName: formData.companyName,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      parcelType: formData.parcelType,
      targetVolume: formData.targetVolume,
      targetBudget: formData.targetBudget || undefined,
      notes: formData.notes || undefined,
    });

    setLoading(false);
    setFeedback(result);

    if (result.success) {
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        country: "",
        parcelType: PARCEL_TYPES[0],
        targetVolume: VOLUME_OPTIONS[1],
        targetBudget: "",
        notes: "",
      });
    }
  };

  return (
    <div className="bg-[#FDFBF7] border border-[#B8924A]/40 p-6 sm:p-10 shadow-lg relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B8924A] via-[#D4AF67] to-[#B8924A]" />

      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B8924A]/10 border border-[#B8924A]/30 text-[#5E0F1E] text-[10px] uppercase tracking-widest font-semibold">
          <Building2 className="w-3.5 h-3.5 text-[#B8924A]" />
          B2B & Wholesale Atelier Inquiry
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-medium">
          Request Commercial Parcel Dossier
        </h3>
        <p className="text-xs sm:text-sm text-[#2B2B2B]/75 leading-relaxed">
          Direct mine access for international jewelry houses, watchmakers, and gem dealers. Please specify your parcel calibration and volume requirements below.
        </p>
      </div>

      {feedback?.success && (
        <div className="mb-6 p-6 bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-4 animate-gentle-fade">
          <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-serif text-lg text-emerald-900 font-medium">
              Wholesale Request Transmitted
            </h4>
            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
              {feedback.message}
            </p>
            <p className="text-[11px] text-emerald-700 pt-1">
              Your inquiry has been cataloged in our export records. Our Colombo export director will review current parcel availability.
            </p>
          </div>
        </div>
      )}

      {feedback && !feedback.success && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-950 flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-red-900">Submission Notice</span>
            <p className="mt-0.5 text-red-800">{feedback.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Company / Atelier Name *</Label>
            <Input
              id="companyName"
              required
              placeholder="e.g. Maison de Haute Joaillerie Ltd"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="bg-[#FAF6EE]"
            />
            {feedback?.errors?.companyName && (
              <p className="text-[11px] text-red-700 mt-1">{feedback.errors.companyName[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contactName">Representative / Buyer Name *</Label>
            <Input
              id="contactName"
              required
              placeholder="e.g. Jean-Luc Moreau"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="bg-[#FAF6EE]"
            />
            {feedback?.errors?.contactName && (
              <p className="text-[11px] text-red-700 mt-1">{feedback.errors.contactName[0]}</p>
            )}
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Official Business Email *</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="procurement@atelier.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[#FAF6EE]"
            />
            {feedback?.errors?.email && (
              <p className="text-[11px] text-red-700 mt-1">{feedback.errors.email[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone / WhatsApp *</Label>
            <Input
              id="phone"
              required
              placeholder="+41 22 123 4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-[#FAF6EE]"
            />
            {feedback?.errors?.phone && (
              <p className="text-[11px] text-red-700 mt-1">{feedback.errors.phone[0]}</p>
            )}
          </div>
        </div>

        {/* Country & Parcel Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">Country & Customs Port *</Label>
            <Input
              id="country"
              required
              placeholder="e.g. Geneva, Switzerland / Tokyo, Japan"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="bg-[#FAF6EE]"
            />
            {feedback?.errors?.country && (
              <p className="text-[11px] text-red-700 mt-1">{feedback.errors.country[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="parcelType">Gemstone Parcel Category *</Label>
            <select
              id="parcelType"
              value={formData.parcelType}
              onChange={(e) => setFormData({ ...formData, parcelType: e.target.value })}
              className="flex h-11 w-full bg-[#FAF6EE] border border-[#B8924A]/40 px-3 py-2 text-xs text-[#2B2B2B] focus:border-[#B8924A] focus:outline-none"
            >
              {PARCEL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Volume & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetVolume">Target Volume / Lot Carat Weight *</Label>
            <select
              id="targetVolume"
              value={formData.targetVolume}
              onChange={(e) => setFormData({ ...formData, targetVolume: e.target.value })}
              className="flex h-11 w-full bg-[#FAF6EE] border border-[#B8924A]/40 px-3 py-2 text-xs text-[#2B2B2B] focus:border-[#B8924A] focus:outline-none"
            >
              {VOLUME_OPTIONS.map((vol) => (
                <option key={vol} value={vol}>
                  {vol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="targetBudget">Target Budget Allocation (USD, optional)</Label>
            <Input
              id="targetBudget"
              placeholder="e.g. $15,000 – $40,000 USD"
              value={formData.targetBudget}
              onChange={(e) => setFormData({ ...formData, targetBudget: e.target.value })}
              className="bg-[#FAF6EE]"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">Specific Cut, Calibration Tolerance or Certification Requirements</Label>
          <textarea
            id="notes"
            rows={4}
            placeholder="Please detail required mm tolerances (e.g. +/- 0.05mm), clarity threshold (e.g. eye clean / loupe clean), certificate lab preference (GIA / GRS / GIC), or rough crystal specifications..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-[#FAF6EE] border border-[#B8924A]/40 p-3 text-xs text-[#2B2B2B] placeholder:text-[#2B2B2B]/40 focus:border-[#B8924A] focus:outline-none"
          />
          {feedback?.errors?.notes && (
            <p className="text-[11px] text-red-700 mt-1">{feedback.errors.notes[0]}</p>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#2B2B2B]/75">
            <Sparkles className="w-4 h-4 text-[#B8924A]" />
            <span>NGJA sealed tamper-proof international air freight with insurance.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full sm:w-auto uppercase tracking-wider text-xs px-8"
          >
            {loading ? (
              "Transmitting Dossier..."
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                Submit B2B Inquiry
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
