import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { GoldDivider } from "@/components/layout/gold-divider";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Secure Acquisition & Insured Courier | Isuru Gems Ceylon",
    description:
      "Complete your Ceylon gemstone acquisition with fully insured international courier, certified gemological documentation, and escrow protection.",
  };
}

export default function CheckoutPage() {
  return (
    <div className="py-16 bg-[#FAF6EE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold">
            Confidential Transaction
          </span>
          {/* Strictly the single H1 on this page */}
          <h1 className="font-serif text-4xl sm:text-5xl text-[#5E0F1E] font-normal leading-tight">
            Secure Acquisition & Insured Dispatch
          </h1>
          <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
            Every shipment is escorted with comprehensive armoring transit insurance, official NGJA export permits, and original laboratory certificates.
          </p>
          <GoldDivider withOrnament className="my-6 max-w-xs mx-auto" />
        </div>

        <CheckoutForm />
      </div>
    </div>
  );
}
