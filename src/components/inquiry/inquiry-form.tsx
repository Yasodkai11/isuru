"use client";

import React, { useState } from "react";
import { submitInquiryAction } from "@/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  AlertCircle,
  Send,
  User,
  Mail,
  Phone,
  Globe,
  Coins,
  MessageSquare,
  ShieldCheck,
  Clock,
} from "lucide-react";

interface InquiryFormProps {
  initialGemName?: string;
  initialGemId?: string;
}

export function InquiryForm({ initialGemName, initialGemId }: InquiryFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState(
    initialGemName ? `I am inquiring regarding the specimen: ${initialGemName}.` : ""
  );
  const [currency, setCurrency] = useState<"USD" | "LKR">("USD");

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    success?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const result = await submitInquiryAction({
      gemId: initialGemId,
      gemName: initialGemName,
      fullName,
      email,
      phone,
      country,
      message,
      preferredCurrency: currency,
    });

    setLoading(false);
    setFeedback(result);

    if (result.success) {
      setFullName("");
      setEmail("");
      setPhone("");
      setCountry("");
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {feedback?.success && (
        <div role="status" aria-live="polite" className="flex items-start gap-3 border border-emerald-300 bg-emerald-50 p-4 text-xs sm:text-sm text-emerald-900 rounded-lg animate-gentle-fade">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block font-serif text-sm">Inquiry Transmitted Securely</span>
            <p className="mt-0.5 text-xs text-emerald-800 leading-relaxed">{feedback.message}</p>
          </div>
        </div>
      )}

      {feedback && !feedback.success && (
        <div role="alert" className="flex items-start gap-3 border border-red-300 bg-red-50 p-4 text-xs sm:text-sm text-red-900 rounded-lg animate-gentle-fade">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block font-serif text-sm">Notice</span>
            <p className="mt-0.5 text-xs text-red-800 leading-relaxed">{feedback.message}</p>
          </div>
        </div>
      )}

      {initialGemName && (
        <div className="p-3 bg-[#FAF6EE] border border-[#B8924A]/35 text-xs rounded-lg">
          <span className="text-[10px] uppercase tracking-wider text-[#80601C] font-semibold block">
            Referenced Specimen
          </span>
          <span className="font-serif text-sm font-medium text-[#5E0F1E]">
            {initialGemName}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="fullName" className="text-xs text-[#2B2B2B] font-medium">Full Name *</Label>
          <div className="mt-1">
            <Input
              id="fullName"
              required
              autoComplete="name"
              startIcon={<User className="w-4 h-4 text-[#80601C]" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              error={feedback?.errors?.fullName?.[0]}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-xs text-[#2B2B2B] font-medium">Email Address *</Label>
          <div className="mt-1">
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              startIcon={<Mail className="w-4 h-4 text-[#80601C]" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={feedback?.errors?.email?.[0]}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone" className="text-xs text-[#2B2B2B] font-medium">Direct Phone / WhatsApp</Label>
          <div className="mt-1">
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              startIcon={<Phone className="w-4 h-4 text-[#80601C]" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +44 20 7946 0912"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="country" className="text-xs text-[#2B2B2B] font-medium">Country / Region *</Label>
          <div className="mt-1">
            <Input
              id="country"
              required
              autoComplete="country-name"
              startIcon={<Globe className="w-4 h-4 text-[#80601C]" />}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Switzerland / United States"
              error={feedback?.errors?.country?.[0]}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="currency" className="text-xs text-[#2B2B2B] font-medium">Preferred Currency</Label>
        <div className="relative mt-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#80601C]">
            <Coins className="w-4 h-4" />
          </div>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "USD" | "LKR")}
            className="h-11 w-full pl-10 pr-3.5 rounded-lg border border-[#B8924A]/40 bg-[#FAF6EE] text-xs text-[#2B2B2B] focus:border-[#B8924A] focus:outline-none focus:ring-2 focus:ring-[#B8924A]/25 focus:shadow-[0_0_12px_rgba(184,146,74,0.15)] transition-all cursor-pointer font-medium"
          >
            <option value="USD">USD - United States Dollar ($)</option>
            <option value="LKR">LKR - Sri Lankan Rupee (Rs)</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="message" className="text-xs text-[#2B2B2B] font-medium">What would you like to discuss? *</Label>
        <div className="relative mt-1">
          <div className="absolute left-3.5 top-3.5 pointer-events-none text-[#80601C]">
            <MessageSquare className="w-4 h-4" />
          </div>
          <textarea
            id="message"
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about the gemstone, commission, or visit you have in mind."
            className="min-h-24 w-full pl-10 pr-3.5 py-3 rounded-lg border border-[#B8924A]/40 bg-[#FAF6EE] text-xs leading-relaxed text-[#2B2B2B] placeholder:text-[#2B2B2B]/40 focus:border-[#B8924A] focus:outline-none focus:ring-2 focus:ring-[#B8924A]/25 focus:shadow-[0_0_12px_rgba(184,146,74,0.15)] transition-all resize-y font-normal"
          />
        </div>
        {feedback?.errors?.message && (
          <p className="text-[11px] text-red-700 mt-1">{feedback.errors.message[0]}</p>
        )}
      </div>

      {/* Trust microcopy */}
      <div className="flex items-center justify-between gap-2 pt-1 text-[11px] text-[#80601C] font-medium">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          We reply within 24 hours
        </span>
        <span className="flex items-center gap-1.5 text-[#2B2B2B]/60 hidden sm:flex">
          <ShieldCheck className="w-3.5 h-3.5 text-[#80601C] shrink-0" />
          Private & Confidential
        </span>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full gap-2 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold h-11 shadow-[0_4px_16px_rgba(94,15,30,0.18)] hover:shadow-[0_8px_24px_rgba(94,15,30,0.28)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      >
        {loading ? (
          "Sending inquiry..."
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Send Private Inquiry
          </>
        )}
      </Button>
    </form>
  );
}

