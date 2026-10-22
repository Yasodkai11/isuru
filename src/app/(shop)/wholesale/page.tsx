import type { Metadata } from "next";
import Link from "next/link";
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
import { ShieldCheck, Truck, Briefcase, FileCheck, HelpCircle } from "lucide-react";
import { WholesaleForm } from "@/components/wholesale/wholesale-form";
import { JsonLd, getBreadcrumbListSchema, getFAQPageSchema } from "@/lib/seo/schema";
import { SEO_CONFIG } from "@/lib/seo-config";
import { getSEORecordByPath } from "@/actions/seo";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEORecordByPath("/wholesale");

  const metaTitle =
    seo?.metaTitle ||
    "Wholesale Ceylon Gemstone Parcels & Calibrated Lots | Isuru Ceylon Gems";
  const metaDesc =
    seo?.metaDescription ||
    "Direct source calibrated sapphire parcels, layout pairs, and high-volume unheated Ceylon sapphires from Isuru Ceylon Gems for international jewelry ateliers, watchmakers, and merchants.";
  const canonicalUrl = `${SEO_CONFIG.site.url}/wholesale`;
  const ogImg = seo?.ogImage || "/isuru_images/blue1.webp";

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: seo?.indexStatus === "noindex" ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo?.ogTitle || metaTitle,
      description: seo?.ogDescription || metaDesc,
      url: canonicalUrl,
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.ogTitle || metaTitle,
      description: seo?.ogDescription || metaDesc,
      images: [ogImg],
    },
  };
}

const WHOLESALE_FAQS = [
  {
    question: "Do you sell calibrated sapphire parcels?",
    directAnswer:
      "Yes. Isuru Ceylon Gems supplies calibrated sapphire parcels and matched pairs directly to bespoke ateliers, luxury jewelers, and gemstone merchants worldwide. We offer precision-cut rounds, ovals, emerald cuts, and cushions sorted by strict millimeter tolerances (±0.1mm), consistent color saturation, and clarity grading.",
    detail:
      "All calibrated lots are faceted in our Ratnapura atelier from natural, unheated rough crystals and pre-assorted into uniform color bands (such as Royal Blue, Cornflower, or Lotus Padparadscha) for seamless high-jewelry mounting.",
  },
  {
    question: "What is the minimum order for wholesale B2B purchases?",
    directAnswer:
      "Our wholesale B2B program accommodates orders starting from single high-value investment stones ($5,000+) up to commercial parcels of 25 to 500+ carats. We offer tailored pricing tiers, customized selection tranches, and private memo arrangements for accredited trade partners and registered jewelry manufacturers.",
    detail:
      "First-time trade clients can order sample evaluation tranches (e.g. 5 to 10 carats) to verify color consistency, clarity standards, and optical polish before committing to volume consignments.",
  },
  {
    question: "How is shipping and insurance handled for wholesale shipments?",
    directAnswer:
      "Wholesale consignments are securely handled through bonded export couriers with 100% full-value transit insurance. Shipments are processed through the National Gem and Jewellery Authority export division at Colombo airport, with all export declarations, Kimberley Process compliance, and commercial carnets fully prepared.",
    detail:
      "We utilize specialized secure logistics carriers—including Brink's, Malca-Amit, FedEx Priority, and DHL Express—with door-to-door tracking and direct airport-to-vault transit guarantees.",
  },
];

export default function WholesalePage() {
  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Wholesale & B2B Parcels", url: "/wholesale" },
  ]);

  const faqSchema = getFAQPageSchema(
    WHOLESALE_FAQS.map((f) => ({
      question: f.question,
      answer: f.detail ? `${f.directAnswer} ${f.detail}` : f.directAnswer,
    }))
  );

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
      <JsonLd data={[breadcrumbSchema, faqSchema]} />
      <div className="container-luxe space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="gold" className="text-[10px] tracking-[0.25em] py-1 px-3">
            {SEO_CONFIG.brand.name} · B2B & High-Jewelry Ateliers
          </Badge>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#5E0F1E] font-normal leading-tight">
            Wholesale Ceylon Gemstone Parcels
          </h1>
          <p className="text-sm sm:text-base text-[#2B2B2B]/80 leading-relaxed">
            Direct-from-pit calibrated lots, suites of matching blue sapphires, and unheated gemstone parcels for fine jewelers, watchmakers, and international gem merchants.
          </p>
          <GoldDivider withOrnament className="my-5" />
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-[#FDFBF7] border border-[#B8924A]/30 space-y-2">
            <Briefcase className="w-5 h-5 text-[#B8924A]" />
            <h2 className="font-serif text-lg text-[#5E0F1E] font-medium">Mine-Direct Pricing</h2>
            <p className="text-xs text-[#2B2B2B]/70">No brokers or auction premiums. Direct supply from Ratnapura washing plants.</p>
          </div>
          <div className="p-6 bg-[#FDFBF7] border border-[#B8924A]/30 space-y-2">
            <FileCheck className="w-5 h-5 text-[#B8924A]" />
            <h2 className="font-serif text-lg text-[#5E0F1E] font-medium">NGJA Export Lots</h2>
            <p className="text-xs text-[#2B2B2B]/70">Pre-inspected by government gemologists under NGJA license {SEO_CONFIG.brand.licenseNumber}.</p>
          </div>
          <div className="p-6 bg-[#FDFBF7] border border-[#B8924A]/30 space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#B8924A]" />
            <h2 className="font-serif text-lg text-[#5E0F1E] font-medium">Strict Color Sorting</h2>
            <p className="text-xs text-[#2B2B2B]/70">Calibrated within 0.1mm tolerance with uniform saturation and cut geometry.</p>
          </div>
          <div className="p-6 bg-[#FDFBF7] border border-[#B8924A]/30 space-y-2">
            <Truck className="w-5 h-5 text-[#B8924A]" />
            <h2 className="font-serif text-lg text-[#5E0F1E] font-medium">Duty Free Air Freight</h2>
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

        {/* Visible AEO Wholesale FAQ Section */}
        <section aria-labelledby="wholesale-faq-heading" className="space-y-6 pt-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#80601C]" />
            <h2 id="wholesale-faq-heading" className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
              Wholesale & B2B Inquiries: Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {WHOLESALE_FAQS.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-lg bg-[#FDFBF7] border border-[#B8924A]/30 space-y-2">
                <h3 className="font-serif text-lg sm:text-xl text-[#5E0F1E] font-medium">
                  {faq.question}
                </h3>
                <p className="text-sm text-[#2B2B2B] font-medium bg-[#FAF6EE] p-3.5 rounded border-l-2 border-[#80601C] leading-relaxed">
                  {faq.directAnswer}
                </p>
                {faq.detail && (
                  <p className="text-xs sm:text-sm text-[#2B2B2B]/75 leading-relaxed pt-1">
                    {faq.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Interactive B2B Wholesale Inquiry Section */}
        <div id="wholesale-inquiry-form" className="max-w-[780px] mx-auto pt-4">
          <WholesaleForm />
        </div>
      </div>
    </div>
  );
}
