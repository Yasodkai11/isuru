"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { formatCurrency, formatCarats } from "@/lib/utils";
import { X, Trash2, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartSheet() {
  const pathname = usePathname();
  const { items, isOpen, setOpen, removeItem, totalAmount } = useCartStore();

  if (pathname?.startsWith("/admin") || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2B2B2B]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF6EE] border-l border-[#B8924A]/30 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#B8924A]/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-[#B8924A] uppercase font-semibold">
                Private Vault
              </span>
              <h2 className="text-2xl font-serif text-[#5E0F1E] mt-0.5">
                Acquisition Selection
              </h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-[#2B2B2B]/60 hover:text-[#5E0F1E] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full border border-[#B8924A]/40 flex items-center justify-center text-[#B8924A]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="text-base font-serif text-[#5E0F1E]">Your vault is currently empty</p>
                <p className="text-xs text-[#2B2B2B]/60 max-w-xs mx-auto">
                  Explore our curated Ceylon gemstones to reserve an unheated sapphire or rare natural gem.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(false)}
                  >
                    View Gemstone Catalog
                  </Button>
                </div>
              </div>
            ) : (
              items.map(({ gem }) => (
                <div
                  key={gem.id}
                  className="flex gap-4 p-4 bg-[#FDFBF7] border border-[#B8924A]/20 transition-subtle"
                >
                  <div className="relative w-20 h-20 bg-[#FAF6EE] shrink-0 border border-[#B8924A]/20">
                    <Image
                      src={gem.images[0]?.url || "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=600&q=80"}
                      alt={gem.images[0]?.alt || gem.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#B8924A] font-medium block">
                      {gem.origin}
                    </span>
                    <h3 className="text-sm font-serif font-medium text-[#5E0F1E] truncate">
                      {gem.name}
                    </h3>
                    <p className="text-xs text-[#2B2B2B]/70 mt-0.5">
                      {formatCarats(gem.carat)} • {gem.cut}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#B8924A]/10">
                      <span className="text-sm font-semibold text-[#1B3A8A]">
                        {formatCurrency(gem.price, gem.currency)}
                      </span>
                      <button
                        onClick={() => removeItem(gem.id)}
                        className="text-xs text-red-700/70 hover:text-red-900 flex items-center gap-1 transition-colors"
                        title="Remove from vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#B8924A]/20 bg-[#FDFBF7] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#2B2B2B]/70">Insured Worldwide Courier</span>
                <span className="text-emerald-800 font-medium">Complimentary</span>
              </div>
              <div className="flex items-center justify-between text-base border-t border-[#B8924A]/10 pt-3">
                <span className="font-serif text-[#5E0F1E] text-lg font-medium">Total Investment</span>
                <span className="font-serif text-xl font-bold text-[#1B3A8A]">
                  {formatCurrency(totalAmount(), "USD")}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="w-full inline-flex items-center justify-center border border-[#B8924A] text-[#5E0F1E] py-2.5 px-4 text-xs uppercase tracking-wider font-medium hover:bg-[#FAF6EE] transition-subtle"
                >
                  View Full Vault Page
                </Link>

                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="w-full inline-flex items-center justify-center bg-[#5E0F1E] text-[#FAF6EE] py-3.5 px-4 text-sm font-medium tracking-wide hover:bg-[#420A15] transition-subtle shadow-sm gap-2"
                >
                  <span>Proceed to Insured Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-[#2B2B2B]/60 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8924A]" />
                  <span>Escrow & Certified Natural Guarantee</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
