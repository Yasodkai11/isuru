import type { Metadata } from "next";
import Image from "next/image";
import { InquiryForm } from "@/components/inquiry/inquiry-form";
import { SalonMap } from "@/components/contact/salon-map";
import { GoldDivider } from "@/components/layout/gold-divider";
import { BRAND } from "@/lib/constants";
import { Mail, Phone, ArrowRight, ExternalLink } from "lucide-react";
import { JsonLd, getBreadcrumbListSchema } from "@/lib/seo/schema";

import { getSEORecordByPath } from "@/actions/seo";
import { getHrefLangAlternates } from "@/lib/seo/hreflang";

interface ContactPageProps {
  searchParams: Promise<{
    gem?: string;
    id?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEORecordByPath("/contact");

  const metaTitle = seo?.metaTitle || "Bespoke Commissions & Concierge";
  const metaDesc =
    seo?.metaDescription ||
    "Contact the gemological concierge at Isuru Gems for loose unheated Ceylon sapphire acquisition, custom ring commissions, or private viewings in Colombo and Ratnapura.";
  const canonicalUrl = seo?.canonicalUrl || "/contact";
  const ogImg = seo?.ogImage || "/isuru_images/contactus.webp";

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: {
      canonical: canonicalUrl,
      languages: getHrefLangAlternates(canonicalUrl),
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

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedParams = await searchParams;

  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Bespoke Concierge & Salons", url: "/contact" },
  ]);

  return (
    <div className="min-h-screen bg-[#FAF6EE] py-8 sm:py-12">
      <JsonLd data={breadcrumbSchema} />
      <div className="container-luxe">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-10">
          {/* Hero Header with Gold Divider and Tightened Spacing */}
          <header className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 pb-2">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="w-5 h-px bg-[#80601C]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#80601C]">
                  Isuru Gems Ceylon · Private Concierge
                </span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight text-[#5E0F1E]">
                Get in touch
              </h1>
              <GoldDivider className="my-2" />
              <p className="text-sm sm:text-base leading-relaxed text-[#2B2B2B]/80 font-normal">
                Talk with our gemological concierge about acquiring loose unheated Ceylon sapphires, commissioning a bespoke high-jewelry piece, or scheduling an appointment at our Colombo salon or Ratnapura bureau.
              </p>
            </div>
            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] max-h-[320px] overflow-hidden rounded-xl border border-[#B8924A]/30 shadow-md">
              <Image
                src="/isuru_images/contactus.webp"
                alt="Ceylon sapphires and fine gemstones beside the historic Galle lighthouse"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-[center_55%]"
              />
            </div>
          </header>

          {/* Balanced 2-Column Section */}
          <div className="grid items-start gap-8 lg:grid-cols-12">
            {/* Left Column: Premium Form Card */}
            <section
              className="lg:col-span-7 border border-[#B8924A]/35 bg-[#FDFBF7] rounded-xl p-5 sm:p-8 shadow-xs relative overflow-hidden"
              aria-labelledby="inquiry-heading"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#B8924A] via-[#D4AF67] to-[#B8924A]" />
              <div className="mb-5 sm:mb-6">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#80601C]">
                  Private Inquiry
                </span>
                <h2
                  id="inquiry-heading"
                  className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-[#5E0F1E]"
                >
                  How can our team assist you?
                </h2>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#2B2B2B]/75">
                  Share your gemstone requirements below and our gemologists will prepare an authenticated portfolio.
                </p>
              </div>

              <InquiryForm
                initialGemName={resolvedParams.gem}
                initialGemId={resolvedParams.id}
              />
            </section>

            {/* Right Column: Clickable Contact Cards + Interactive Map */}
            <aside className="lg:col-span-5 space-y-6">
              <section aria-labelledby="direct-contact-heading" className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#80601C]">
                    Prefer to speak directly?
                  </span>
                  <span className="text-[11px] text-[#2B2B2B]/60 font-medium">Available Mon-Sat</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Telephone Card */}
                  <a
                    href={`tel:${BRAND.phone.replace(/[^\d+]/g, "")}`}
                    className="group flex items-center justify-between p-3.5 bg-[#FDFBF7] border border-[#B8924A]/30 rounded-xl hover:border-[#B8924A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FAF6EE] border border-[#B8924A]/40 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#B8924A] transition-all">
                        <Phone className="w-4 h-4 text-[#80601C]" />
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-[#80601C] font-semibold">
                          Direct Telephone
                        </span>
                        <span className="font-serif text-sm font-medium text-[#5E0F1E] group-hover:text-[#80601C] transition-colors">
                          {BRAND.phone}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B8924A] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>

                  {/* WhatsApp Card */}
                  <a
                    href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-3.5 bg-[#FDFBF7] border border-[#B8924A]/30 rounded-xl hover:border-[#B8924A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FAF6EE] border border-[#B8924A]/40 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#B8924A] transition-all">
                        <Image
                          src="/isuru_images/whatsapp.png"
                          alt="WhatsApp"
                          width={18}
                          height={18}
                          className="h-[18px] w-[18px] object-contain"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-[#80601C] font-semibold">
                          WhatsApp Concierge
                        </span>
                        <span className="font-serif text-sm font-medium text-[#5E0F1E] group-hover:text-[#80601C] transition-colors">
                          {BRAND.whatsapp}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#B8924A] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </a>

                  {/* Email Card */}
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="group flex items-center justify-between p-3.5 bg-[#FDFBF7] border border-[#B8924A]/30 rounded-xl hover:border-[#B8924A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#FAF6EE] border border-[#B8924A]/40 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#B8924A] transition-all">
                        <Mail className="w-4 h-4 text-[#80601C]" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] uppercase tracking-wider text-[#80601C] font-semibold">
                          Confidential Email
                        </span>
                        <span className="font-serif text-xs sm:text-sm font-medium text-[#5E0F1E] group-hover:text-[#80601C] transition-colors truncate block">
                          {BRAND.email}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B8924A] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </a>
                </div>
              </section>

              {/* Interactive Salon Map */}
              <SalonMap />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
