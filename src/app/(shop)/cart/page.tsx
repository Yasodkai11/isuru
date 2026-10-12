"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { formatCurrency, formatCarats } from "@/lib/utils";
import { GoldDivider } from "@/components/layout/gold-divider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  FileCheck,
} from "lucide-react";

export default function CartPage() {
  const { items, removeItem, clearCart, totalAmount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-20 bg-[#FAF6EE] min-h-[70vh] flex items-center justify-center">
        <div className="text-xs uppercase tracking-widest text-[#B8924A] animate-pulse">
          Opening Acquisition Vault...
        </div>
      </div>
    );
  }

  const subtotal = totalAmount();

  return (
    <div className="py-14 bg-[#FAF6EE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="gold" className="text-[10px] tracking-[0.25em] py-1 px-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B8924A] mr-1.5 inline" />
            Confidential Acquisition Vault
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#5E0F1E] font-normal leading-tight">
            Your Gemstone Vault
          </h1>
          <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
            Review your curated Ceylon gemstones reserved for private acquisition and insured courier dispatch.
          </p>
          <GoldDivider withOrnament className="my-5 max-w-xs mx-auto" />
        </div>

        {items.length === 0 ? (
          /* Empty Vault State */
          <div className="bg-[#FDFBF7] border border-[#B8924A]/30 p-12 sm:p-16 text-center space-y-6 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FAF6EE] border border-[#B8924A]/40 flex items-center justify-center mx-auto text-[#5E0F1E]">
              <ShoppingBag className="w-8 h-8 text-[#B8924A]" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
                Your Vault is Currently Empty
              </h2>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/70 max-w-md mx-auto leading-relaxed">
                You have not yet reserved any natural unheated Ceylon gemstones. Explore our catalog of certified Royal Blue sapphires, rare Padparadschas, and island crystals.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/gems">
                <Button variant="primary" size="lg" className="gap-2">
                  <span>Explore The Ceylon Vault</span>
                  <ArrowRight className="w-4 h-4 text-[#B8924A]" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#B8924A]/20 text-xs">
                <span className="uppercase tracking-wider font-semibold text-[#5E0F1E]">
                  Reserved Specimen ({items.length})
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-[#B8924A] hover:text-[#5E0F1E] transition-colors cursor-pointer"
                >
                  Clear Entire Vault
                </button>
              </div>

              {items.map(({ gem }) => (
                <div
                  key={gem.id}
                  className="p-5 sm:p-6 bg-[#FDFBF7] border border-[#B8924A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all hover:border-[#B8924A]"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#FAF6EE] border border-[#B8924A]/30 shrink-0 overflow-hidden">
                      <Image
                        src={gem.images[0]?.url || "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=400&q=80"}
                        alt={gem.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="maroon" className="text-[9px] py-0 px-2">
                          {gem.variety}
                        </Badge>
                        <Badge variant="gold" className="text-[9px] py-0 px-2">
                          {gem.certificate.lab}
                        </Badge>
                      </div>

                      <h3 className="font-serif text-lg sm:text-xl font-medium text-[#5E0F1E]">
                        <Link href={`/gems/${gem.slug}`} className="hover:underline">
                          {gem.name}
                        </Link>
                      </h3>

                      <div className="text-xs text-[#2B2B2B]/70 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[#2B2B2B]">{formatCarats(gem.carat)}</span>
                        <span>•</span>
                        <span>{gem.cut}</span>
                        <span>•</span>
                        <span>{gem.origin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#B8924A]/15 gap-2">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-[#1B3A8A]">
                      {formatCurrency(gem.price, gem.currency)}
                    </span>

                    <button
                      onClick={() => removeItem(gem.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-red-700 hover:text-red-900 transition-colors p-1 cursor-pointer"
                      title="Remove from vault"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sm:hidden">Remove</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Link */}
              <div className="pt-4">
                <Link
                  href="/gems"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#5E0F1E] hover:text-[#B8924A] transition-colors font-medium"
                >
                  <span>← Add More Ceylon Specimens</span>
                </Link>
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4">
              <div className="bg-[#FDFBF7] border border-[#B8924A]/40 p-6 sm:p-8 space-y-6 shadow-md sticky top-28">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
                    Acquisition Summary
                  </span>
                  <h2 className="font-serif text-2xl text-[#5E0F1E] font-medium">
                    Order Overview
                  </h2>
                </div>

                <div className="space-y-3 text-xs divide-y divide-[#B8924A]/15 pt-2">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#2B2B2B]/70">Specimens Subtotal</span>
                    <span className="font-semibold text-[#2B2B2B]">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#2B2B2B]/70 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#B8924A]" />
                      <span>Armoured Courier (Malca-Amit)</span>
                    </span>
                    <span className="font-semibold text-emerald-700 uppercase tracking-wider text-[11px]">
                      Complimentary ($0)
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#2B2B2B]/70 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-[#B8924A]" />
                      <span>NGJA Export Permit & Seals</span>
                    </span>
                    <span className="font-semibold text-emerald-700 uppercase tracking-wider text-[11px]">
                      Included
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 pb-1">
                    <span className="text-sm font-semibold text-[#5E0F1E] uppercase tracking-wider">
                      Grand Total
                    </span>
                    <div className="text-right">
                      <span className="font-serif text-2xl font-bold text-[#1B3A8A] block">
                        {formatCurrency(subtotal)}
                      </span>
                      <span className="text-[10px] text-[#2B2B2B]/60">
                        ≈ {formatCurrency(subtotal * 305, "LKR")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-3 pt-2">
                  <Link href="/checkout">
                    <Button variant="primary" size="lg" className="w-full gap-2">
                      <span>Proceed to Insured Checkout</span>
                      <ArrowRight className="w-4 h-4 text-[#B8924A]" />
                    </Button>
                  </Link>

                  <div className="p-3 bg-[#FAF6EE] border border-[#B8924A]/25 space-y-1.5 text-[11px] text-[#2B2B2B]/75 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-semibold text-[#5E0F1E]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#B8924A]" />
                      <span>Escrow & Transit Protection</span>
                    </div>
                    <p>
                      Transactions are held in escrow until physical delivery and laboratory verification report receipt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
