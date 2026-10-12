"use client";

import React from "react";
import { ShieldCheck, Award, Gem, Truck, CheckCircle, FileText } from "lucide-react";
import { GoldDivider } from "@/components/layout/gold-divider";
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

export function TrustMarkers() {
  const pillars = [
    {
      icon: Award,
      title: "NGJA Govt. Certified",
      badge: "Apex License",
      desc: "Licensed under the National Gem and Jewellery Authority of Sri Lanka ensuring strictly verified Ceylon provenance and legal export clearance.",
    },
    {
      icon: Gem,
      title: "100% Natural Earth-Mined",
      badge: "Zero Synthetic",
      desc: "Every sapphire, ruby, and chrysoberyl is 100% natural earth-mined with absolute disclosure of any traditional thermal enhancements.",
    },
    {
      icon: ShieldCheck,
      title: "Independent Lab Pedigree",
      badge: "GRS • GIA • SSEF",
      desc: "Accompanied by recognized independent gemological reports from GRS Swisslab, GIA, Gubelin, or NGJA testing laboratories.",
    },
    {
      icon: Truck,
      title: "Insured Armoured Transit",
      badge: "Malca-Amit / Brink's",
      desc: "Door-to-door high-security transit via specialized luxury handlers with comprehensive maritime insurance included.",
    },
  ];

  const standardsData = [
    {
      variety: "Royal Blue Sapphire",
      species: "Corundum (Al₂O₃)",
      hardness: "9.0 Mohs",
      locality: "Ratnapura Alluvial Gravel",
      optical: "Velvety royal blue; zero dark extinction",
      cert: "GRS / GIA / NGJA",
    },
    {
      variety: "Padparadscha Sapphire",
      species: "Corundum (Al₂O₃)",
      hardness: "9.0 Mohs",
      locality: "Pelmadulla & Balangoda",
      optical: "Delicate lotus pink & sunset orange blend",
      cert: "SSEF / GRS / NGJA",
    },
    {
      variety: "Asterism Star Sapphire",
      species: "Corundum (Al₂O₃)",
      hardness: "9.0 Mohs",
      locality: "Ratnapura Historic Pits",
      optical: "Sharp 6-ray star floating across dome",
      cert: "NGJA / GRS",
    },
    {
      variety: "Ceylon Pigeon Blood Ruby",
      species: "Corundum (Al₂O₃)",
      hardness: "9.0 Mohs",
      locality: "Elahera & Ratnapura",
      optical: "Luminous crimson with strong red fluorescence",
      cert: "GRS / GIA / NGJA",
    },
    {
      variety: "Chrysoberyl Alexandrite",
      species: "Chrysoberyl (BeAl₂O₄)",
      hardness: "8.5 Mohs",
      locality: "Ratnapura & Morawaka",
      optical: "Daylight green to incandescent raspberry red",
      cert: "Gubelin / GIA / NGJA",
    },
  ];

  return (
    <section className="py-20 bg-[#FAF6EE] border-b border-[#B8924A]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold block">
            Government Licensed & Authenticated
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-normal leading-tight">
            The Four Pillars of Trust
          </h2>
          <p className="text-sm text-[#2B2B2B]/75 leading-relaxed">
            Sri Lanka’s gemstone legacy spans over two millennia. Isuru Gems protects this sacred reputation through unyielding standards of integrity.
          </p>
          <GoldDivider withOrnament className="my-5" />
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-7 bg-[#FDFBF7] border border-[#B8924A]/30 space-y-4 transition-all duration-300 hover:border-[#B8924A] hover:shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 border border-[#B8924A]/40 flex items-center justify-center text-[#5E0F1E] bg-[#FAF6EE]">
                      <Icon className="w-5 h-5 text-[#B8924A]" />
                    </div>
                    <Badge variant="gold" className="text-[9px] py-0.5 px-2">
                      {pillar.badge}
                    </Badge>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-[#5E0F1E] pt-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#2B2B2B]/70 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#B8924A]/15 flex items-center gap-1.5 text-[11px] text-[#1B3A8A] font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-[#B8924A]" />
                  <span>Guaranteed Provenance</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gemstone Specifications & Standards Table Section */}
        <div className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
                Official Benchmark Standards
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-medium">
                Ceylon Gemstone Mineralogical Standards
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#2B2B2B]/70">
              <FileText className="w-4 h-4 text-[#B8924A]" />
              <span>Conforms to NGJA & CIBJO Gemological Rules</span>
            </div>
          </div>

          {/* Table UI Component Implementation */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Variety</TableHead>
                <TableHead className="hidden sm:table-cell">Mineral Species</TableHead>
                <TableHead>Hardness</TableHead>
                <TableHead className="hidden md:table-cell">Ceylon Pit Locality</TableHead>
                <TableHead className="hidden lg:table-cell">Optical Quality</TableHead>
                <TableHead className="text-right">Lab Reports</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standardsData.map((row) => (
                <TableRow key={row.variety}>
                  <TableCell className="font-serif font-medium text-[#5E0F1E] text-sm sm:text-base">
                    {row.variety}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-[#2B2B2B]/75 font-mono">
                    {row.species}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-[#1B3A8A]">
                    {row.hardness}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-[#2B2B2B]/80">
                    {row.locality}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-[#2B2B2B]/70 italic">
                    {row.optical}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-[9px] py-0.5 px-2">
                      {row.cert}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              Official mineralogical parameters published by the National Gem and Jewellery Authority of Sri Lanka.
            </TableCaption>
          </Table>
        </div>
      </div>
    </section>
  );
}
