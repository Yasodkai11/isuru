import type { Metadata } from "next";
import Link from "next/link";
import { GoldDivider } from "@/components/layout/gold-divider";
import { CERTIFICATIONS } from "@/lib/constants";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { JsonLd, getBreadcrumbListSchema } from "@/lib/seo/schema";
import { getSEORecordByPath } from "@/actions/seo";
import { getHrefLangAlternates } from "@/lib/seo/hreflang";
import { SEO_CONFIG } from "@/lib/seo-config";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEORecordByPath("/certificates");

  const metaTitle =
    seo?.metaTitle ||
    `Gemstone Certification & Laboratory Authenticity | ${SEO_CONFIG.brand.name}`;
  const metaDesc =
    seo?.metaDescription ||
    `Every gemstone from ${SEO_CONFIG.brand.name} is guaranteed natural unheated corundum authenticated by the National Gem and Jewellery Authority of Sri Lanka (NGJA Reg: ${SEO_CONFIG.brand.licenseNumber}), GIA, and GRS Swisslab.`;
  const canonicalUrl = `${SEO_CONFIG.site.url}/certificates`;
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


export default function CertificatesPage() {
  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Certification & Authenticity", url: "/certificates" },
  ]);

  return (
    <div className="py-16 bg-[#FAF6EE] min-h-screen">
      <JsonLd data={breadcrumbSchema} />
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
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/gems"
              className="inline-flex items-center gap-2 bg-[#B8924A] text-[#0A1A14] px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#D4AF67] transition-colors"
            >
              <span>Explore Certified Stones</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/guides/how-to-read-gemstone-certificate"
              className="inline-flex items-center gap-2 border border-[#B8924A] text-[#FAF6EE] px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-white/10 transition-colors"
            >
              <span>How to Read a Certificate Guide</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
