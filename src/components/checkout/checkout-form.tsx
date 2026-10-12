"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { processOrderAction } from "@/actions/checkout";
import { formatCurrency, formatCarats } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export function CheckoutForm() {
  const { items, clearCart, totalAmount } = useCartStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "bank_wire" | "secure_escrow" | "crypto" | "concierge_card"
  >("bank_wire");

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{
    orderId: string;
    message: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    setGeneralError(null);

    const result = await processOrderAction({
      fullName,
      email,
      phone,
      address,
      city,
      country,
      postalCode,
      specialInstructions,
      itemIds: items.map((i) => i.gem.id),
      paymentMethod,
    });

    setLoading(false);

    if (result.success && result.orderId) {
      setOrderComplete({
        orderId: result.orderId,
        message: result.message || "Your order has been recorded.",
      });
      clearCart();
    } else {
      setGeneralError(result.message || "Please correct the required fields.");
      if (result.errors) {
        setErrors(result.errors);
      }
    }
  };

  if (orderComplete) {
    return (
      <div className="bg-[#FDFBF7] border border-[#B8924A]/40 p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-md">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
            Acquisition Confirmed
          </span>
          <h2 className="font-serif text-3xl text-[#5E0F1E] font-medium">
            Order Reference: {orderComplete.orderId}
          </h2>
          <p className="text-sm text-[#2B2B2B]/75 leading-relaxed max-w-md mx-auto">
            {orderComplete.message}
          </p>
        </div>

        <div className="p-4 bg-[#FAF6EE] border border-[#B8924A]/20 text-xs text-[#2B2B2B]/70 space-y-1">
          <p>A formal proforma invoice with insured shipping documentation has been dispatched to <strong>{email}</strong>.</p>
          <p>Our senior gemologist will contact you within 24 business hours to coordinate delivery.</p>
        </div>

        <div className="pt-4">
          <Link
            href="/gems"
            className="inline-flex items-center justify-center bg-[#5E0F1E] text-[#FAF6EE] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#420A15] transition-colors"
          >
            Return to Gemstone Vault
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#FDFBF7] border border-[#B8924A]/25 p-12 text-center space-y-4 max-w-xl mx-auto">
        <h2 className="font-serif text-2xl text-[#5E0F1E]">Your Private Vault is Empty</h2>
        <p className="text-xs text-[#2B2B2B]/70">
          Please select a gemstone from our certified catalog to proceed with secure acquisition.
        </p>
        <div className="pt-2">
          <Link
            href="/gems"
            className="inline-flex items-center gap-2 border border-[#B8924A] text-[#5E0F1E] px-6 py-2.5 text-xs uppercase tracking-wider font-medium hover:bg-[#FAF6EE]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Ceylon Gemstones</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Checkout Form */}
      <div className="lg:col-span-7 bg-[#FDFBF7] border border-[#B8924A]/30 p-8 sm:p-10 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
            Insured Armoured Courier
          </span>
          <h2 className="font-serif text-2xl text-[#5E0F1E] font-normal">
            Recipient & Delivery Coordinates
          </h2>
        </div>

        {generalError && (
          <div className="p-4 bg-red-50 border border-red-300 text-red-900 flex items-start gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Submission Error</span>
              <p className="mt-0.5">{generalError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name (As on Passport/ID) *</Label>
              <Input
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Legal Name"
              />
              {errors?.fullName && (
                <p className="text-[11px] text-red-700 mt-1">{errors.fullName[0]}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email for Insurance Paperwork *</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@private.com"
              />
              {errors?.email && (
                <p className="text-[11px] text-red-700 mt-1">{errors.email[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone / WhatsApp (For Courier Security) *</Label>
              <Input
                id="phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 0192 38"
              />
              {errors?.phone && (
                <p className="text-[11px] text-red-700 mt-1">{errors.phone[0]}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Destination Country *</Label>
              <Input
                id="country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Switzerland / United States / UK"
              />
              {errors?.country && (
                <p className="text-[11px] text-red-700 mt-1">{errors.country[0]}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address">Physical Street Address *</Label>
            <Input
              id="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Suite, Building, Street"
            />
            {errors?.address && (
              <p className="text-[11px] text-red-700 mt-1">{errors.address[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City / Canton / State *</Label>
              <Input
                id="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Geneva / London / New York"
              />
              {errors?.city && (
                <p className="text-[11px] text-red-700 mt-1">{errors.city[0]}</p>
              )}
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Postal or ZIP code"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-4 border-t border-[#B8924A]/20 space-y-3">
            <Label>Preferred Acquisition Settlement Method</Label>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-3 p-3 border border-[#B8924A]/30 bg-[#FAF6EE] cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_wire"
                  checked={paymentMethod === "bank_wire"}
                  onChange={() => setPaymentMethod("bank_wire")}
                />
                <div>
                  <span className="font-semibold text-[#5E0F1E] block">Bank Wire Transfer (SWIFT / IBAN)</span>
                  <span className="text-[#2B2B2B]/60 text-[11px]">Recommended for high-value gemstones; processed through Hatton National Bank Colombo.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-[#B8924A]/30 bg-[#FAF6EE] cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="secure_escrow"
                  checked={paymentMethod === "secure_escrow"}
                  onChange={() => setPaymentMethod("secure_escrow")}
                />
                <div>
                  <span className="font-semibold text-[#5E0F1E] block">Independent Escrow.com Settlement</span>
                  <span className="text-[#2B2B2B]/60 text-[11px]">Funds held in neutral licensed escrow until you inspect and approve the stone.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-[#B8924A]/30 bg-[#FAF6EE] cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="concierge_card"
                  checked={paymentMethod === "concierge_card"}
                  onChange={() => setPaymentMethod("concierge_card")}
                />
                <div>
                  <span className="font-semibold text-[#5E0F1E] block">Concierge Invoice & Card Payment</span>
                  <span className="text-[#2B2B2B]/60 text-[11px]">Private encrypted payment link emailed directly to you.</span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="specialInstructions">Delivery or Setting Notes (Optional)</Label>
            <textarea
              id="specialInstructions"
              rows={3}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Custom laser inscription requests, mounting specifications, or specific delivery date..."
              className="w-full bg-transparent border border-[#B8924A]/40 px-3.5 py-2 text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/40 focus:border-[#B8924A] focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full py-4 text-xs uppercase tracking-[0.2em]"
          >
            {loading ? "Locking Vault & Reserving..." : `Confirm Acquisition (${formatCurrency(totalAmount(), "USD")})`}
          </Button>

          <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-[#2B2B2B]/60">
            <Lock className="w-3.5 h-3.5 text-[#B8924A]" />
            <span>Encrypted with 256-bit TLS • Complete confidentiality preserved</span>
          </div>
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#FDFBF7] border border-[#B8924A]/30 p-6 sm:p-8 space-y-6 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
            Acquisition Summary
          </span>
          <h3 className="font-serif text-2xl text-[#5E0F1E]">Selected Pieces ({items.length})</h3>

          <div className="divide-y divide-[#B8924A]/15 space-y-4">
            {items.map(({ gem }) => (
              <div key={gem.id} className="pt-4 flex gap-4">
                <div className="relative w-16 h-16 bg-[#FAF6EE] shrink-0 border border-[#B8924A]/20">
                  <Image
                    src={gem.images[0]?.url || "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=600&q=80"}
                    alt={gem.images[0]?.alt || gem.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-serif font-medium text-[#5E0F1E] truncate">
                    {gem.name}
                  </h4>
                  <p className="text-xs text-[#2B2B2B]/60">
                    {formatCarats(gem.carat)} • {gem.origin}
                  </p>
                  <p className="text-xs font-semibold text-[#1B3A8A] mt-1">
                    {formatCurrency(gem.price, gem.currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#B8924A]/20 space-y-2 text-xs">
            <div className="flex justify-between text-[#2B2B2B]/70">
              <span>Subtotal</span>
              <span>{formatCurrency(totalAmount(), "USD")}</span>
            </div>
            <div className="flex justify-between text-[#2B2B2B]/70">
              <span>Insured Armoured Shipping</span>
              <span className="text-emerald-800 font-semibold">Complimentary</span>
            </div>
            <div className="flex justify-between text-[#2B2B2B]/70">
              <span>Laboratory Verification Dossier</span>
              <span className="text-emerald-800 font-semibold">Included</span>
            </div>
            <div className="pt-3 border-t border-[#B8924A]/20 flex justify-between text-base">
              <span className="font-serif text-[#5E0F1E] font-medium text-lg">Total Investment</span>
              <span className="font-serif text-xl font-bold text-[#1B3A8A]">
                {formatCurrency(totalAmount(), "USD")}
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#FAF6EE] border border-[#B8924A]/20 flex items-start gap-3 text-xs text-[#2B2B2B]/75">
            <ShieldCheck className="w-5 h-5 text-[#B8924A] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#5E0F1E] block">Inspection Period</span>
              <span>You enjoy a 7-day private examination period upon courier arrival with our full authenticity guarantee.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
