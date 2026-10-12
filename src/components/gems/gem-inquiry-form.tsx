"use client";

import React, { useState } from "react";
import { Gemstone } from "@/types/gem";
import { submitInquiryAction } from "@/actions/inquiries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BRAND } from "@/lib/constants";
import {
  Mail,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  Clock,
  Sparkles,
} from "lucide-react";

interface GemInquiryFormProps {
  gem: Gemstone;
}

export function GemInquiryForm({ gem }: GemInquiryFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "United States",
    preferredCurrency: "USD" as "USD" | "LKR",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const result = await submitInquiryAction({
      gemId: gem.id,
      gemName: `${gem.name} (${gem.carat} cts)`,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      country: formData.country,
      preferredCurrency: formData.preferredCurrency,
      message:
        formData.message ||
        `I would like to inquire about acquiring ${gem.name} (${gem.carat} cts) - Specimen ID: ${gem.id}. Please send me certification documents and viewing options.`,
    });

    setIsSubmitting(false);
    setStatus(result);
  };

  const handleReset = () => {
    setStatus(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      country: "United States",
      preferredCurrency: "USD",
      message: "",
    });
  };

  return (
    <div className="bg-[#FDFBF7] border border-[#B8924A]/40 p-6 sm:p-8 space-y-6 shadow-md relative">
      {/* Decorative top gold gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B8924A] via-[#D4AF67] to-[#B8924A]" />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Badge variant="gold" className="text-[9px] py-0.5 px-2.5">
            <Sparkles className="w-3 h-3 text-[#B8924A] mr-1 inline" />
            Confidential Concierge
          </Badge>
          <span className="text-[10px] text-[#2B2B2B]/60 font-mono">
            REF: {gem.id}
          </span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-medium leading-tight">
          Enquire About This Gemstone
        </h3>
        <p className="text-xs text-[#2B2B2B]/75 leading-relaxed">
          Direct private consultation with our Chief Gemologist regarding certificate dossiers, microscopic inspection videos, or bespoke jewelry setting.
        </p>
      </div>

      {status?.success ? (
        <div className="p-6 bg-[#FAF6EE] border border-[#B8924A]/30 text-center space-y-4 animate-gentle-fade">
          <div className="w-12 h-12 rounded-full bg-[#B8924A]/20 text-[#5E0F1E] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-[#5E0F1E]" />
          </div>
          <h4 className="font-serif text-2xl text-[#5E0F1E] font-normal">
            Dossier Request Transmitted
          </h4>
          <p className="text-xs sm:text-sm text-[#2B2B2B]/80 max-w-sm mx-auto leading-relaxed">
            {status.message}
          </p>
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Send Additional Question
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                Your Full Name *
              </label>
              <Input
                required
                placeholder="e.g. Eleanor Vance"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                placeholder="client@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#FAF6EE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                Telephone / WhatsApp
              </label>
              <Input
                placeholder="+1 (555) 019-2834"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-[#FAF6EE]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                Country
              </label>
              <Input
                placeholder="e.g. United States, UK"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="bg-[#FAF6EE]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
                Currency
              </label>
              <select
                value={formData.preferredCurrency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferredCurrency: e.target.value as "USD" | "LKR",
                  })
                }
                className="flex h-11 w-full bg-[#FAF6EE] border border-[#B8924A]/40 px-3 py-2 text-xs text-[#2B2B2B] focus:border-[#B8924A] focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="LKR">LKR (Rs)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#2B2B2B]/80 font-medium block mb-1">
              Inquiry Details & Mounting Notes
            </label>
            <textarea
              rows={3}
              placeholder="Ask about microscopic inspection videos, bespoke ring mounting in 18K yellow gold or platinum, or private salon viewing in Colombo / Ratnapura..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#FAF6EE] border border-[#B8924A]/40 p-3 text-xs text-[#2B2B2B] placeholder:text-[#2B2B2B]/40 focus:border-[#B8924A] focus:outline-none transition-subtle"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[11px] text-[#2B2B2B]/70">
              <Clock className="w-3.5 h-3.5 text-[#B8924A]" />
              <span>Response within 24 hours guaranteed</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              Submit Confidential Enquiry
            </Button>
          </div>
        </form>
      )}

      {/* Direct Contact Alternative Links */}
      <div className="pt-4 border-t border-[#B8924A]/15 flex flex-wrap items-center justify-between gap-3 text-xs">
        <a
          href={`https://wa.me/${BRAND.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
            `Hello, I would like to inquire about ${gem.name} (Specimen ID: ${gem.id}).`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[#1B3A8A] font-semibold hover:underline"
        >
          <MessageSquare className="w-4 h-4 text-[#B8924A]" />
          <span>Immediate WhatsApp Concierge</span>
        </a>

        <div className="flex items-center gap-1.5 text-[11px] text-[#2B2B2B]/70">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B8924A]" />
          <span>Direct to Ratnapura & Colombo Vault</span>
        </div>
      </div>
    </div>
  );
}
