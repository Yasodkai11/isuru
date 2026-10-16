"use client";

import React, { useState } from "react";
import { submitInquiryAction } from "@/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {feedback?.success && (
        <div role="status" aria-live="polite" className="flex items-start gap-3 border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Inquiry Transmitted Securely</span>
            <p className="mt-0.5">{feedback.message}</p>
          </div>
        </div>
      )}

      {feedback && !feedback.success && (
        <div role="alert" className="flex items-start gap-3 border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Notice</span>
            <p className="mt-0.5">{feedback.message}</p>
          </div>
        </div>
      )}

      {initialGemName && (
        <div className="p-3 bg-[#FAF6EE] border border-[#B8924A]/30 text-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#B8924A] font-semibold block">
            Referenced Specimen
          </span>
          <span className="font-serif text-sm font-medium text-[#5E0F1E]">
            {initialGemName}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
          {feedback?.errors?.fullName && (
            <p className="text-[11px] text-red-700 mt-1">{feedback.errors.fullName[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {feedback?.errors?.email && (
            <p className="text-[11px] text-red-700 mt-1">{feedback.errors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Direct Phone / WhatsApp</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Include your country code"
          />
        </div>

        <div>
          <Label htmlFor="country">Country / Region *</Label>
          <Input
            id="country"
            required
            autoComplete="country-name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country or region"
          />
          {feedback?.errors?.country && (
            <p className="text-[11px] text-red-700 mt-1">{feedback.errors.country[0]}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="currency">Preferred currency</Label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as "USD" | "LKR")}
          className="h-11 w-full border border-gold/40 bg-cream-light px-3.5 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        >
          <option value="USD">USD - US Dollar</option>
          <option value="LKR">LKR - Sri Lankan Rupee</option>
        </select>
      </div>

      <div>
        <Label htmlFor="message">What would you like to discuss? *</Label>
        <textarea
          id="message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about the gemstone, commission, or visit you have in mind."
          className="min-h-32 w-full resize-y border border-gold/40 bg-cream-light px-3.5 py-3 text-sm leading-relaxed text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        {feedback?.errors?.message && (
          <p className="text-[11px] text-red-700 mt-1">{feedback.errors.message[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full gap-2 py-4 text-xs uppercase tracking-[0.16em]"
      >
        {loading ? "Sending inquiry..." : <><Send className="h-4 w-4" aria-hidden="true" /> Send inquiry</>}
      </Button>
    </form>
  );
}
