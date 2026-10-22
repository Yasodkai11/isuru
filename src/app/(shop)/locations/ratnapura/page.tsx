import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GoldDivider } from "@/components/layout/gold-divider";
import { JsonLd, getBreadcrumbListSchema, getLocalBusinessSchema } from "@/lib/seo/schema";
import { SEO_CONFIG } from "@/lib/seo-config";
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight, Compass, CalendarCheck } from "lucide-react";

export const revalidate = 86400;

const loc = SEO_CONFIG.locations.ratnapura;

export const metadata: Metadata = {
  title: "Ratnapura Mining Bureau & Lapidary Atelier | Isuru Ceylon Gems",
  description:
    "Visit the Isuru Ceylon Gems mining bureau and lapidary atelier on Main Street, Ratnapura, Sri Lanka. Sourcing directly from traditional alluvial pits and river illam washing operations.",
  alternates: {
    canonical: `${SEO_CONFIG.site.url}/locations/ratnapura`,
  },
  openGraph: {
    title: "Ratnapura Mining Bureau & Lapidary | Isuru Ceylon Gems",
    description:
      "Official Ratnapura bureau of Isuru Ceylon Gems. Experience 2,500 years of gem mining heritage and unheated Ceylon corundum direct from the mine head.",
    url: `${SEO_CONFIG.site.url}/locations/ratnapura`,
    images: [{ url: "/isuru_images/work/work-pit-mining.webp", width: 1200, height: 630, alt: "Isuru Ceylon Gems Ratnapura Bureau" }],
  },
};

export default function RatnapuraLocationPage() {
  const breadcrumbs = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Locations", url: "/locations/ratnapura" },
    { name: "Ratnapura Bureau", url: "/locations/ratnapura" },
  ]);

  const localSchema = getLocalBusinessSchema("ratnapura");

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
          <span className="text-[#80601C] font-medium">Ratnapura Bureau</span>
        </nav>

        {/* Hero Section */}
        <header className="space-y-4 border-b border-[#B8924A]/25 pb-8">
          <div className="inline-flex items-center gap-2">
            <span className="w-5 h-px bg-[#B8924A]" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.26em] text-[#80601C]">
              {SEO_CONFIG.brand.name} · Local Presence
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#5E0F1E] font-normal leading-tight">
            Ratnapura Mining Bureau & Lapidary Atelier
          </h1>

          <p className="font-serif text-lg sm:text-xl text-[#2B2B2B]/85 italic leading-relaxed">
            The beating geological heart of Ceylon corundum: where raw river gravel meets master hand-cutting.
          </p>
        </header>

        {/* Quick NAP (Name, Address, Phone) & Visiting Info Grid */}
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
              9:00 AM – 6:00 PM (SLST)
            </p>
            <p className="text-xs text-[#2B2B2B]/60">
              Closed on Sundays and official Poya full moon holidays.
            </p>
            <p className="text-xs font-semibold text-[#5E0F1E] pt-1">
              Private viewings by advance appointment.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#FDFBF7] border border-[#B8924A]/35 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#80601C]">
              <Phone className="w-4 h-4" />
              <h2 className="text-xs uppercase tracking-wider font-semibold">Direct Bureau Contact</h2>
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
            src="/isuru_images/work/work-pit-mining.webp"
            alt="Traditional gem miner inside a deep timbered alluvial shaft in Ratnapura Sri Lanka"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF67]">
              Field Work · Ratnapura Gem Pit
            </span>
            <p className="font-serif text-xl sm:text-2xl font-normal text-[#FAF6EE]">
              Deep alluvial shaft mining and raw crystal grading in the Sabaragamuwa valley
            </p>
          </div>
        </div>

        {/* Narrative & Visiting Protocol */}
        <div className="space-y-6 text-[#2B2B2B]/85 text-base sm:text-[17px] leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal">
            About Our Ratnapura Bureau
          </h2>
          <p>
            Located along historic Main Street in Ratnapura—the legendary City of Gems—our primary operational bureau serves as the bridge between traditional alluvial miners and international gemstone connoisseurs. Here, raw <em>illam</em> gravels from nearby pits in Pelmadulla, Balangoda, and the Kalu Ganga basin are washed, hand-graded, and prepared for lapidary cutting.
          </p>
          <p>
            Founded on the pioneering mining heritage of Reginald Mendis (born 1922) and licensed by the National Gem and Jewellery Authority of Sri Lanka (License: <strong>{SEO_CONFIG.brand.licenseNumber}</strong>), our Ratnapura bureau maintains daily relationships with generational pit mining collectives. This direct mine-head presence ensures 100% ethical traceability and the complete exclusion of treated or synthetic stones.
          </p>

          <h3 className="font-serif text-xl sm:text-2xl text-[#5E0F1E] font-normal pt-2">
            How to Visit Our Ratnapura Atelier
          </h3>
          <p>
            We welcome serious collectors, jewelry designers, and gemologists for curated private viewings of freshly faceted unheated stones and rough corundum parcels. Due to security protocols and our field expedition schedules, visits to the Ratnapura bureau are conducted by prior appointment.
          </p>
          <p>
            Ratnapura is situated approximately 100 kilometers (a 2.5 to 3-hour drive) southeast of Colombo via the Colombo-Ratnapura highway (A4) or the Southern Expressway. Our concierge team can arrange private chauffeured transport from Colombo or Bandaranaike International Airport.
          </p>
        </div>

        {/* Interactive Map Embed Placeholder */}
        <section aria-label="Ratnapura Location Map" className="space-y-3 pt-2">
          <h3 className="font-serif text-xl text-[#5E0F1E] font-normal">
            Bureau Location Map
          </h3>
          <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#B8924A]/30 bg-[#1A1410] relative shadow-inner">
            <iframe
              title="Isuru Ceylon Gems Ratnapura Bureau Map"
              src="https://maps.google.com/maps?q=Ratnapura,+Sri+Lanka&t=&z=14&ie=UTF8&iwloc=&output=embed"
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
              Schedule an Atelier Appointment in Ratnapura
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF6EE]/80 max-w-md">
              Speak directly with gemologist Uththiya Isuru Dewa Mendis to review unheated sapphire parcels or observe traditional artisanal illam washing.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 bg-[#B8924A] hover:bg-[#D4AF67] text-[#0A1A14] px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-200"
          >
            Request Ratnapura Visit
          </Link>
        </div>
      </div>
    </div>
  );
}
