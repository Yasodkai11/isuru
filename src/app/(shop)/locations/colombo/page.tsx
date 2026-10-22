import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GoldDivider } from "@/components/layout/gold-divider";
import { JsonLd, getBreadcrumbListSchema, getLocalBusinessSchema } from "@/lib/seo/schema";
import { SEO_CONFIG } from "@/lib/seo-config";
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight, Plane, Lock } from "lucide-react";

export const revalidate = 86400;

const loc = SEO_CONFIG.locations.colombo;

export const metadata: Metadata = {
  title: "Colombo VIP Viewing Salon & Export Bureau | Isuru Ceylon Gems",
  description:
    "Private appointment salon and international export bureau of Isuru Ceylon Gems in Colombo 00500, Sri Lanka. Insured global delivery and certified unheated Ceylon gemstone viewings.",
  alternates: {
    canonical: `${SEO_CONFIG.site.url}/locations/colombo`,
  },
  openGraph: {
    title: "Colombo VIP Viewing Salon & Export Bureau | Isuru Ceylon Gems",
    description:
      "Official Colombo private salon of Isuru Ceylon Gems. Experience unheated Royal Blue Sapphires and custom jewelry commissions in the commercial capital of Sri Lanka.",
    url: `${SEO_CONFIG.site.url}/locations/colombo`,
    images: [{ url: "/isuru_images/contactus.webp", width: 1200, height: 630, alt: "Isuru Ceylon Gems Colombo Salon" }],
  },
};

export default function ColomboLocationPage() {
  const breadcrumbs = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Locations", url: "/locations/colombo" },
    { name: "Colombo Salon", url: "/locations/colombo" },
  ]);

  const localSchema = getLocalBusinessSchema("colombo");

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2B2B2B] py-10 sm:py-16">
      <JsonLd data={[breadcrumbs, localSchema]} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#2B2B2B]/60 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#5E0F1E] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span>Locations</span>
          <span>/</span>
          <span className="text-[#80601C] font-medium">Colombo VIP Salon</span>
        </nav>

        {/* Hero Section */}
        <header className="space-y-4 border-b border-[#B8924A]/25 pb-8">
          <div className="inline-flex items-center gap-2">
            <span className="w-5 h-px bg-[#B8924A]" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.26em] text-[#80601C]">
              {SEO_CONFIG.brand.name} · Capital Bureau
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#5E0F1E] font-normal leading-tight">
            Colombo VIP Viewing Salon & Export Bureau
          </h1>

          <p className="font-serif text-lg sm:text-xl text-[#2B2B2B]/85 italic leading-relaxed">
            Private international collector consultations, bespoke high-jewelry commissions, and customs-bonded worldwide export.
          </p>
        </header>

        {/* Quick NAP & Viewing Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#FDFBF7] border border-[#B8924A]/35 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#80601C]">
              <MapPin className="w-4 h-4" />
              <h2 className="text-xs uppercase tracking-wider font-semibold">Address & Geo</h2>
            </div>
            <p className="text-sm font-medium text-[#2B2B2B]">
              {loc.address.streetAddress}<br />
              {loc.address.addressLocality}, {loc.address.postalCode}<br />
              {loc.address.addressRegion}, Sri Lanka
            </p>
            <p className="text-xs text-[#2B2B2B]/60">
              Coordinates: {loc.geo.latitude}° N, {loc.geo.longitude}° E
            </p>
            <a
              href={loc.hasMap}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#80601C] hover:text-[#5E0F1E] font-semibold pt-1 underline"
            >
              <span>Open in Google Maps</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="p-6 rounded-xl bg-[#FDFBF7] border border-[#B8924A]/35 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#80601C]">
              <Clock className="w-4 h-4" />
              <h2 className="text-xs uppercase tracking-wider font-semibold">Operating Hours</h2>
            </div>
            <p className="text-sm font-medium text-[#2B2B2B]">
              Monday – Saturday<br />
              10:00 AM – 7:00 PM (SLST)
            </p>
            <p className="text-xs text-[#2B2B2B]/60">
              Discreet private salon viewings arranged 7 days a week for international travelers upon request.
            </p>
            <p className="text-xs font-semibold text-[#5E0F1E] pt-1">
              Strictly by prior appointment.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#FDFBF7] border border-[#B8924A]/35 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#80601C]">
              <Phone className="w-4 h-4" />
              <h2 className="text-xs uppercase tracking-wider font-semibold">Direct Concierge</h2>
            </div>
            <p className="text-sm font-medium text-[#2B2B2B]">
              <a href={`tel:${loc.phone}`} className="hover:text-[#5E0F1E]">
                {loc.phone}
              </a>
            </p>
            <p className="text-xs text-[#2B2B2B]/70 truncate">
              Email: {SEO_CONFIG.contact.email}
            </p>
            <div className="pt-1">
              <span className="inline-block px-2.5 py-1 rounded bg-[#5E0F1E]/10 text-[#5E0F1E] text-[10px] font-semibold tracking-wider uppercase">
                NGJA Lic: {SEO_CONFIG.brand.licenseNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Feature Card */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#B8924A]/30 shadow-md">
          <Image
            src="/isuru_images/contactus.webp"
            alt="Isuru Ceylon Gems private consultation salon and fine Ceylon sapphires"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_55%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF67]">
              Colombo Capital Bureau · Private Concierge
            </span>
            <p className="font-serif text-xl sm:text-2xl font-normal text-[#FAF6EE]">
              Discreet salon viewings and secure international courier dispatch in Colombo
            </p>
          </div>
        </div>

        {/* Narrative & Services */}
        <div className="space-y-6 text-[#2B2B2B]/85 text-base sm:text-[17px] leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
            Private Viewings in Sri Lanka’s Commercial Capital
          </h2>
          <p>
            Conveniently situated in the prestigious residential and commercial district of Colombo 00500, our Colombo VIP Salon is designed specifically for international collectors, visiting dignitaries, and bespoke jewelry ateliers. The salon offers a confidential, luxurious environment equipped with daylight-balanced gemological lamps, refractometers, and stereo zoom microscopes for intimate gemstone evaluation.
          </p>
          <p>
            While our mining and lapidary operations remain rooted in Ratnapura, our Colombo bureau coordinates all global export administration, statutory customs clearing at the National Gem and Jewellery Authority headquarters, and secure courier dispatch through international partners including Brink&apos;s, Malca-Amit, FedEx, and DHL.
          </p>

          <h3 className="font-serif text-xl sm:text-2xl text-[#5E0F1E] font-normal pt-2">
            Airport Transit & International VIP Protocol
          </h3>
          <p>
            Located approximately 40 minutes south of Bandaranaike International Airport (CMB) via the Colombo Airport Expressway, our concierge team regularly hosts clients traveling through Sri Lanka on brief business layovers or holidays. We offer secure chauffeur services between your hotel or airport terminal and our salon, allowing private viewings of newly faceted Royal Blue sapphires or Padparadschas before onward travel.
          </p>
        </div>

        {/* Interactive Map Embed */}
        <section aria-label="Colombo Location Map" className="space-y-3 pt-2">
          <h3 className="font-serif text-xl text-[#5E0F1E] font-normal">
            Colombo Salon Location Map
          </h3>
          <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#B8924A]/30 bg-[#1A1410] relative shadow-inner">
            <iframe
              title="Isuru Ceylon Gems Colombo Salon Map"
              src="https://maps.google.com/maps?q=Colombo%2000500,%20Sri%20Lanka&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* Schedule Consultation Callout */}
        <div className="p-8 rounded-xl bg-gradient-to-r from-[#5E0F1E] to-[#420A15] text-[#FAF6EE] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif text-2xl font-normal">
              Book a Private Appointment in Colombo
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF6EE]/80 max-w-md">
              Review specific investment stones from our reserve, or discuss a bespoke sapphire engagement ring commission with our master concierge.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 bg-[#B8924A] hover:bg-[#D4AF67] text-[#0A1A14] px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-200"
          >
            Schedule Colombo Salon Viewing
          </Link>
        </div>
      </div>
    </div>
  );
}
