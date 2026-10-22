import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { GoldDivider } from "@/components/layout/gold-divider";
import { SEO_CONFIG } from "@/lib/seo-config";

export const HOME_FAQS = [
  {
    question: "What is Isuru Ceylon Gems?",
    directAnswer:
      "Isuru Ceylon Gems is an authentic Sri Lankan gemstone dealer headquartered in Ratnapura and Colombo, specializing in natural, unheated Ceylon sapphires, padparadschas, rubies, and spinels. Built upon family mining roots established in the 1920s and officially licensed by the National Gem and Jewellery Authority (NGJA), we supply certified gems directly to international collectors.",
    detail:
      "Unlike retail resellers who purchase pre-cut inventory from brokers, Isuru Ceylon Gems maintains direct mine-head partnerships with artisanal alluvial pit miners, ensuring complete ethical traceability, superior cut proportions, and fair origin pricing.",
  },
  {
    question: "Where does Isuru Ceylon source its gemstones?",
    directAnswer:
      "Isuru Ceylon Gems sources rough and cut gemstones directly from traditional alluvial pits and river illam washing sites in Ratnapura (the historic City of Gems), Pelmadulla, and Balangoda in Sri Lanka. By acquiring stones right at the mine head through generational miner relationships, we ensure complete ethical traceability without intermediary markups.",
    detail:
      "Every raw parcel is hand-graded in our Ratnapura atelier under daylight-balanced gemological lamps before being master-faceted by our lapidary artisans to classical optical symmetry.",
  },
  {
    question: "Is Isuru Ceylon a registered gem dealer?",
    directAnswer:
      "Yes. Isuru Ceylon Gems is an officially licensed and registered gemstone merchant under the National Gem and Jewellery Authority of Sri Lanka (NGJA Dealer Registration Number: 202610DL42288). Every exported gemstone complies with Sri Lankan statutory standards and arrives with official government and independent gemological authentication.",
    detail:
      "Our registrations are on public file with the Ministry of Industries and the state export bureau, guaranteeing that all transactions, export clearances, and gemological certifications are legally authenticated.",
  },
  {
    question: "Does Isuru Ceylon ship worldwide?",
    directAnswer:
      "Yes. Isuru Ceylon Gems provides fully insured, armored door-to-door worldwide courier delivery via specialized luxury logistics partners (including Brink's, Malca-Amit, FedEx, and DHL Express). Every international parcel is dispatched with full NGJA export customs clearance, official appraisal documents, and comprehensive transit insurance.",
    detail:
      "We regularly dispatch high-value parcels to collectors, ateliers, and private clients across the United States, United Kingdom, Switzerland, European Union, Singapore, Australia, and the United Arab Emirates.",
  },
];

export function HomeFaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="home-faq-title"
      className="py-16 sm:py-20 lg:py-24 bg-[#FAF6EE] border-t border-[#B8924A]/25"
    >
      <div className="container-luxe max-w-4xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-5 h-px bg-[#B8924A]" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#80601C]">
              Direct Questions & Verified Facts
            </span>
            <span className="w-5 h-px bg-[#B8924A]" />
          </div>

          <h2
            id="home-faq-title"
            className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-normal leading-tight"
          >
            Frequently Asked Questions About Isuru Ceylon Gems
          </h2>

          <p className="text-sm text-[#2B2B2B]/75 leading-relaxed max-w-xl mx-auto">
            Direct, transparent answers regarding our Sri Lankan gem dealer registration, alluvial sourcing ethics, unheated certification, and global courier delivery.
          </p>

          <GoldDivider withOrnament className="my-6 max-w-xs mx-auto" />
        </div>

        {/* FAQ Answer-First Cards */}
        <div className="space-y-5">
          {HOME_FAQS.map((faq, index) => (
            <div
              key={index}
              className="p-6 sm:p-7 rounded-xl bg-[#FDFBF7] border border-[#B8924A]/30 shadow-xs space-y-3"
            >
              <h3 className="font-serif text-xl sm:text-2xl text-[#5E0F1E] font-medium leading-snug">
                {faq.question}
              </h3>
              {/* Direct answer paragraph: 40-60 words styled prominently for crawlers and readers */}
              <p className="text-sm sm:text-base text-[#2B2B2B] font-medium leading-relaxed bg-[#FAF6EE] p-4 rounded-md border-l-2 border-[#80601C]">
                {faq.directAnswer}
              </p>
              {faq.detail && (
                <p className="text-sm text-[#2B2B2B]/80 leading-relaxed pt-1">
                  {faq.detail}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* More Resources Callout */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#2B2B2B]/60 mb-3">
            Seeking deeper mineralogical and purchasing guidance?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#80601C]">
            <Link
              href="/guides/ceylon-blue-sapphire-buying-guide"
              className="hover:text-[#5E0F1E] underline underline-offset-4"
            >
              Ceylon Sapphire Buying Guide
            </Link>
            <span className="text-[#B8924A]/40">•</span>
            <Link
              href="/guides/padparadscha-sapphire-guide"
              className="hover:text-[#5E0F1E] underline underline-offset-4"
            >
              Padparadscha Guide
            </Link>
            <span className="text-[#B8924A]/40">•</span>
            <Link
              href="/guides/how-to-read-gemstone-certificate"
              className="hover:text-[#5E0F1E] underline underline-offset-4"
            >
              Certificate Verification Guide
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
