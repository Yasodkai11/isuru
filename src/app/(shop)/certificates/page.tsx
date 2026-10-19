import type { Metadata } from "next";
import Link from "next/link";
import { GoldDivider } from "@/components/layout/gold-divider";
import { CERTIFICATIONS } from "@/lib/constants";
import { ShieldCheck, ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Gemstone Certification & Authenticity",
    description:
      "All Isuru Gems stones are certified natural corundum authenticated by the National Gem and Jewellery Authority of Sri Lanka (NGJA), GIA, and GRS Swisslab.",
    alternates: {
      canonical: "/certificates",
    },
  };
}

export default function CertificatesPage() {
  return (
    <div className="py-16 bg-[#FAF6EE] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold">
            Zero Ambiguity Standard
          </span>
          {/* Strictly the single H1 for this page */}
          <h1 className="font-serif text-4xl sm:text-5xl text-[#5E0F1E] font-normal leading-tight">
            Authenticity & Gemological Certification
          </h1>
          <p className="text-base text-[#2B2B2B]/75 leading-relaxed max-w-2xl mx-auto">
            In an international market crowded with synthetic treatments, diffusion enhancements, and glass-filled stones, Isuru Gems upholds absolute gemological transparency.
          </p>
          <GoldDivider withOrnament className="my-8 max-w-xs mx-auto" />
        </div>

        {/* The 4-Tier Verification Process */}
        <div className="bg-[#FDFBF7] border border-[#B8924A]/30 p-8 sm:p-10 space-y-6 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
            Our Strict Protocol
          </span>
          <h2 className="font-serif text-3xl text-[#5E0F1E] font-normal">
            The Isuru 4-Step Verification Mandate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs text-[#2B2B2B]/85">
            <div className="p-4 border border-[#B8924A]/20 bg-[#FAF6EE] space-y-2">
              <span className="font-serif text-lg text-[#1B3A8A] font-medium block">1. Spectroscopic Analysis</span>
              <p>Fourier Transform Infrared (FTIR) and UV-Vis spectroscopy verify natural iron, titanium, and trace elements confirming genuine earth origin.</p>
            </div>
            <div className="p-4 border border-[#B8924A]/20 bg-[#FAF6EE] space-y-2">
              <span className="font-serif text-lg text-[#1B3A8A] font-medium block">2. Inclusions & Heat Testing</span>
              <p>Microscopic examination of un-dissolved rutile silk, intact zircon crystals, and fluid feathers confirms zero thermal enhancement.</p>
            </div>
            <div className="p-4 border border-[#B8924A]/20 bg-[#FAF6EE] space-y-2">
              <span className="font-serif text-lg text-[#1B3A8A] font-medium block">3. NGJA Government Seal</span>
              <p>Physical presentation to Sri Lanka’s state gem testing laboratory for formal certification and laser QR identification.</p>
            </div>
            <div className="p-4 border border-[#B8924A]/20 bg-[#FAF6EE] space-y-2">
              <span className="font-serif text-lg text-[#1B3A8A] font-medium block">4. Swiss / GIA Independent Audit</span>
              <p>All premium stones above $10,000 are submitted to GRS Swisslab, SSEF Basel, or GIA for independent international origin validation.</p>
            </div>
          </div>
        </div>

        {/* Recognized Laboratories */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
              Accredited Partners
            </span>
            <h2 className="font-serif text-3xl text-[#5E0F1E] font-normal mt-1">
              Authorized Testing Authorities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.code}
                className="p-6 bg-[#FDFBF7] border border-[#B8924A]/25 flex items-start gap-4 transition-subtle hover:border-[#B8924A]/60"
              >
                <div className="w-10 h-10 border border-[#B8924A]/40 flex items-center justify-center bg-[#FAF6EE] text-[#5E0F1E] shrink-0 font-serif font-bold text-sm">
                  {cert.code}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#5E0F1E] font-medium">{cert.name}</h3>
                  <p className="text-xs text-[#2B2B2B]/70 mt-1">
                    Internationally honored gemological laboratory offering indisputable proof of natural origin and color grade.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lifetime Guarantee Banner */}
        <div className="bg-[#5E0F1E] text-[#FAF6EE] p-8 sm:p-10 border border-[#B8924A]/50 space-y-4 text-center">
          <ShieldCheck className="w-10 h-10 text-[#B8924A] mx-auto" />
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#FAF6EE]">
            Our Unconditional Lifetime Provenance Guarantee
          </h2>
          <p className="text-xs sm:text-sm text-[#FAF6EE]/80 max-w-xl mx-auto leading-relaxed">
            If any stone purchased from Isuru Gems is ever determined by an accredited international gemological laboratory to be synthetic or inconsistent with its disclosed natural origin, we issue a 100% full refund immediately.
          </p>
          <div className="pt-2">
            <Link
              href="/gems"
              className="inline-flex items-center gap-2 bg-[#B8924A] text-[#FAF6EE] px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-[#967433] transition-colors"
            >
              <span>Explore Certified Stones</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
