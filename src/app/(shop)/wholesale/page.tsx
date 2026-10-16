import type { Metadata } from "next";
import Link from "next/link";
import { GoldDivider } from "@/components/layout/gold-divider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { ShieldCheck, Truck, Briefcase, FileCheck } from "lucide-react";
import { WholesaleForm } from "@/components/wholesale/wholesale-form";

export const metadata: Metadata = {
  title: "Wholesale & B2B Gemstone Parcels | Isuru Gems Ceylon",
  description:
    "Direct source calibrated parcels, layout pairs, and high-volume unheated Ceylon sapphires for international jewelry ateliers, watchmakers, and gem merchants.",
};

export default function WholesalePage() {
  const parcelLots = [
    {
      lot: "LOT-RB-402",
      variety: "Royal Blue Sapphires (Calibrated)",
      cut: "Round Brilliant (3.0mm – 5.0mm)",
      totalWeight: "48.50 cts (35 stones)",
      clarity: "Eye Clean VVS",
      origin: "Ratnapura",
      treatment: "Unheated Natural",
      availability: "Immediate Export",
    },
    {
      lot: "LOT-CF-119",
      variety: "Cornflower Blue Pairs (Matching)",
      cut: "Cushion Cut (Matched Pairs)",
      totalWeight: "14.20 cts (4 pairs)",
      clarity: "Flawless / Loupe Clean",
      origin: "Elahera",
      treatment: "Gentle Heat Only",
      availability: "In Vault",
    },
    {
      lot: "LOT-PAD-08",
      variety: "Padparadscha Accent Parcel",
      cut: "Oval Mixed (2.5mm – 4.0mm)",
      totalWeight: "18.90 cts (22 stones)",
      clarity: "VS – VVS",
      origin: "Pelmadulla",
      treatment: "Unheated Natural",
      availability: "Reserved / Viewing",
    },
    {
      lot: "LOT-YLW-77",
      variety: "Pushparaga Yellow Sapphires",
      cut: "Baguette & Emerald Step",
      totalWeight: "32.00 cts (16 stones)",
      clarity: "Eye Clean",
      origin: "Balangoda",
      treatment: "Unheated",
      availability: "Immediate Export",
    },
  ];

  return (
    <div className="py-16 bg-[#FAF6EE] min-h-screen">
      <div className="container-luxe space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="gold" className="text-[10px] tracking-[0.25em] py-1 px-3">
            B2B & High-Jewelry Ateliers
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#5E0F1E] font-normal leading-tight">
            Wholesale Ceylon Gemstone Parcels
          </h1>
          <p className="text-sm sm:text-base text-[#2B2B2B]/80 leading-relaxed">
            Direct-from-pit calibrated lots, suites of matching blue sapphires, and rough stone parcels for jewelers, fine watch dials, and international gem merchants.
          </p>
          <GoldDivider withOrnament className="my-5" />
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-[#FDFBF7] border border-[#B8924A]/30 space-y-2">
            <Briefcase className="w-5 h-5 text-[#B8924A]" />
            <h3 className="font-serif text-lg text-[#5E0F1E] font-medium">Mine-Direct Pricing</h3>
            <p className="text-xs text-[#2B2B2B]/70">No brokers or auction premiums. Direct supply from Ratnapura washing plants.</p>
          </div>
          <div className="p-6 bg-[#FDFBF7] border border-[#B8924A]/30 space-y-2">
            <FileCheck className="w-5 h-5 text-[#B8924A]" />
            <h3 className="font-serif text-lg text-[#5E0F1E] font-medium">NGJA Export Lots</h3>
            <p className="text-xs text-[#2B2B2B]/70">Pre-inspected by government gemologists with seal-tagged tamper-proof packs.</p>
          </div>
          <div className="p-6 bg-[#FDFBF7] border border-[#B8924A]/30 space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#B8924A]" />
            <h3 className="font-serif text-lg text-[#5E0F1E] font-medium">Strict Color Sorting</h3>
            <p className="text-xs text-[#2B2B2B]/70">Calibrated within 0.1mm tolerance with uniform saturation and cut geometry.</p>
          </div>
          <div className="p-6 bg-[#FDFBF7] border border-[#B8924A]/30 space-y-2">
            <Truck className="w-5 h-5 text-[#B8924A]" />
            <h3 className="font-serif text-lg text-[#5E0F1E] font-medium">Duty Free Air Freight</h3>
            <p className="text-xs text-[#2B2B2B]/70">Insured express transit to Hong Kong, Zurich, Geneva, New York, and Tokyo.</p>
          </div>
        </div>

        {/* Wholesale Parcel Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-medium">
              Current Available Commercial Parcels
            </h2>
            <Badge variant="unheated">Updated Daily</Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lot Reference</TableHead>
                <TableHead>Variety & Cut</TableHead>
                <TableHead>Total Carats / Count</TableHead>
                <TableHead className="hidden md:table-cell">Clarity</TableHead>
                <TableHead className="hidden sm:table-cell">Origin</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parcelLots.map((lot) => (
                <TableRow key={lot.lot}>
                  <TableCell className="font-mono text-xs font-semibold text-[#5E0F1E]">
                    {lot.lot}
                  </TableCell>
                  <TableCell>
                    <span className="font-serif font-medium block text-sm sm:text-base">{lot.variety}</span>
                    <span className="text-xs text-[#2B2B2B]/60">{lot.cut}</span>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-[#1B3A8A]">
                    {lot.totalWeight}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-[#2B2B2B]/75">
                    {lot.clarity}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-[#2B2B2B]/80">
                    {lot.origin}
                  </TableCell>
                  <TableCell>
                    <Badge variant={lot.availability.includes("Immediate") ? "gold" : "outline"} className="text-[9px]">
                      {lot.availability}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              Commercial lots are subject to prior sale. Custom calibrations cut to order within 7-10 business days.
            </TableCaption>
          </Table>
        </div>

        {/* Interactive B2B Wholesale Inquiry Section */}
        <div id="wholesale-inquiry-form" className="max-w-4xl mx-auto pt-6">
          <WholesaleForm />
        </div>
      </div>
    </div>
  );
}
