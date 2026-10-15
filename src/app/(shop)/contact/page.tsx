import type { Metadata } from "next";
import Image from "next/image";
import { GoldDivider } from "@/components/layout/gold-divider";
import { InquiryForm } from "@/components/inquiry/inquiry-form";
import { BRAND } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface ContactPageProps {
  searchParams: Promise<{
    gem?: string;
    id?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Bespoke Commissions & Concierge | Isuru Gems Ceylon",
    description:
      "Contact the gemological concierge at Isuru Gems for loose unheated Ceylon sapphire acquisition, custom ring commissions, or private viewings in Colombo and Ratnapura.",
  };
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedParams = await searchParams;

  return (
    <div className="py-10 sm:py-14 bg-cream min-h-screen">
      <div className="container-luxe">
        <div className="relative mb-12 sm:mb-14 overflow-hidden border border-gold/30 bg-cream-light">
          <div className="relative aspect-3/2 lg:aspect-16/10">
            <Image
              src="/isuru_images/contactus.webp"
              alt="Ceylon sapphires and fine gemstones beside the historic Galle lighthouse"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 92vw"
              className="object-cover object-center"
            />
          </div>
          <div className="relative px-6 py-8 sm:px-10 sm:py-10 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[48%] lg:flex-col lg:justify-center lg:bg-linear-to-r lg:from-cream-light/95 lg:via-cream-light/85 lg:to-transparent lg:px-12 xl:px-16">
            <span className="text-[10px] uppercase tracking-[0.28em] text-gold-dark font-semibold">
              Private Commissions & Viewings
            </span>
            {/* Strictly the single H1 on this page */}
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl xl:text-5xl text-maroon font-normal leading-tight">
              Let’s find your piece of Ceylon
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base text-charcoal/80 leading-relaxed">
              From a remarkable loose sapphire to a one-of-a-kind heirloom, every good story begins with a conversation. Tell us what you have in mind; our gemologists will guide you personally, from the first question to the final detail.
            </p>
            <GoldDivider withOrnament className="mt-5 max-w-xs" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Inquiry Form Column */}
          <div className="lg:col-span-7 bg-[#FDFBF7] border border-[#B8924A]/30 p-8 sm:p-10 shadow-sm">
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
                Direct Line to Lapidary
              </span>
              <h2 className="font-serif text-2xl text-[#5E0F1E] font-normal">
                Submit Your Commission Request
              </h2>
            </div>

            <InquiryForm
              initialGemName={resolvedParams.gem}
              initialGemId={resolvedParams.id}
            />
          </div>

          {/* Physical Salons & Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Salon 1: Colombo Flagship */}
            <div className="bg-[#FDFBF7] border border-[#B8924A]/25 p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#5E0F1E]">
                <MapPin className="w-5 h-5 text-[#B8924A]" />
                <h3 className="font-serif text-xl font-medium">Colombo Private Salon</h3>
              </div>
              <p className="text-xs text-[#2B2B2B]/70 leading-relaxed">
                42 York Street, Fort, Colombo 01, Sri Lanka
              </p>
              <div className="flex items-center gap-2 text-xs text-[#2B2B2B]/70 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#B8924A]" />
                <span>Monday – Saturday: 09:30 – 18:30 (By Appointment)</span>
              </div>
            </div>

            {/* Salon 2: Ratnapura Mine Office */}
            <div className="bg-[#FDFBF7] border border-[#B8924A]/25 p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#5E0F1E]">
                <MapPin className="w-5 h-5 text-[#B8924A]" />
                <h3 className="font-serif text-xl font-medium">Ratnapura Mining Bureau</h3>
              </div>
              <p className="text-xs text-[#2B2B2B]/70 leading-relaxed">
                Main Gem Market Arcade, Ratnapura (City of Gems), Sabaragamuwa Province
              </p>
              <div className="flex items-center gap-2 text-xs text-[#2B2B2B]/70 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#B8924A]" />
                <span>Mine Sorting Hours: Tuesday – Sunday: 08:00 – 16:00</span>
              </div>
            </div>

            {/* Direct Connect */}
            <div className="bg-[#FAF6EE] border border-[#B8924A]/40 p-6 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
                Immediate Assistance
              </span>
              <div className="space-y-3 text-xs text-[#2B2B2B]/85">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#B8924A]" />
                  <span>Direct Telephone: {BRAND.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/isuru_images/whatsapp.png"
                    alt="WhatsApp"
                    width={16}
                    height={16}
                    className="w-4 h-4 object-contain rounded-full"
                  />
                  <span>WhatsApp Concierge: {BRAND.whatsapp}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#B8924A]" />
                  <span>Private Correspondence: {BRAND.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
