"use client";

import React, { useState } from "react";
import { submitInquiryAction } from "@/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {feedback?.success && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Inquiry Transmitted Securely</span>
            <p className="mt-0.5">{feedback.message}</p>
          </div>
        </div>
      )}

      {feedback && !feedback.success && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-900 flex items-start gap-3 text-xs">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Lord / Lady / Dr. / Name"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="collector@domain.com"
          />
          {feedback?.errors?.email && (
            <p className="text-[11px] text-red-700 mt-1">{feedback.errors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Direct Phone / WhatsApp</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 / +44 / +94 ..."
          />
        </div>

        <div>
          <Label htmlFor="country">Country / Region *</Label>
          <Input
            id="country"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Switzerland, United Kingdom, USA..."
          />
          {feedback?.errors?.country && (
            <p className="text-[11px] text-red-700 mt-1">{feedback.errors.country[0]}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="currency">Preferred Currency Reference</Label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as "USD" | "LKR")}
          className="w-full bg-transparent border border-[#B8924A]/40 px-3.5 py-2 text-sm text-[#2B2B2B] focus:outline-none focus:border-[#B8924A]"
        >
          <option value="USD">USD ($ - United States Dollar)</option>
          <option value="LKR">LKR (Rs - Sri Lankan Rupee)</option>
        </select>
      </div>

      <div>
        <Label htmlFor="message">Inquiry Details / Bespoke Requests *</Label>
        <textarea
          id="message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe your requirements (e.g. platinum ring setting, loose investment stone, certificate preference)..."
          className="w-full bg-transparent border border-[#B8924A]/40 px-3.5 py-2 text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/40 focus:border-[#B8924A] focus:outline-none"
        />
        {feedback?.errors?.message && (
          <p className="text-[11px] text-red-700 mt-1">{feedback.errors.message[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full py-4 text-xs uppercase tracking-[0.2em]"
      >
        {loading ? "Transmitting to Concierge..." : "Send Private Inquiry"}
      </Button>
    </form>
  );
}
