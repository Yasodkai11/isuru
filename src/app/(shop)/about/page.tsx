import type { Metadata } from "next";
import Link from "next/link";
import { GoldDivider } from "@/components/layout/gold-divider";
import { Compass, HeartHandshake, ShieldCheck, Award, Sparkles, ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { JsonLd, getBreadcrumbListSchema, getAboutPageSchema, getPersonSchema } from "@/lib/seo/schema";
import { SEO_CONFIG } from "@/lib/seo-config";
import { getSEORecordByPath } from "@/actions/seo";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEORecordByPath("/about");

  const metaTitle =
    seo?.metaTitle ||
    "About Isuru Ceylon Gems | Generational Heritage from Ratnapura to the Digital World";
  const metaDesc =
    seo?.metaDescription ||
    "Isuru Ceylon Gems is a registered gemstone dealer in Ratnapura, Sri Lanka, selling natural, unheated Ceylon sapphires, rubies, padparadschas and spinels, founded on gem-mining heritage dating back to the 1920s (NGJA Reg: 202610DL42288).";
  const canonicalUrl = `${SEO_CONFIG.site.url}/about`;
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

export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Our Story & Heritage", url: "/about" },
  ]);

  const aboutSchema = getAboutPageSchema();
  const reginaldSchema = getPersonSchema("reginald");
  const premaratneSchema = getPersonSchema("premaratne");
  const isuruSchema = getPersonSchema("isuru");

  return (
    <div className="py-16 sm:py-20 lg:py-24 bg-[#FAF6EE] min-h-screen">
      <JsonLd data={[breadcrumbSchema, aboutSchema, reginaldSchema, premaratneSchema, isuruSchema]} />
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16 sm:space-y-20 lg:space-y-28">

        {/* Editorial Heading */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold">
            {SEO_CONFIG.brand.name} • OUR STORY & HERITAGE
          </span>
          {/* Strictly the single H1 for this page */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#5E0F1E] font-normal leading-[1.15]">
            From Generational Heritage to the Digital World
          </h1>
          <p className="text-base sm:text-lg text-[#2B2B2B]/80 leading-relaxed max-w-3xl mx-auto font-serif italic">
            “Gemstones are more than just precious stones. They represent generations of experience, knowledge, trust, and heritage.”
          </p>

          {/* Plain-text 2-sentence entity statement for crawlers and visitors */}
          <div className="p-4 sm:p-5 rounded-lg bg-[#F5EFE0] border border-[#B8924A]/40 max-w-3xl mx-auto text-left sm:text-center">
            <p className="text-sm sm:text-base text-[#5E0F1E] font-medium leading-relaxed">
              {SEO_CONFIG.brand.entityStatement}
            </p>
          </div>

          <GoldDivider withOrnament className="my-8 max-w-xs mx-auto" />
        </div>

        {/* Feature Video - Cinematic Gallery Presentation */}
        <div className="max-w-5xl mx-auto w-full">
          <div className="relative p-2 sm:p-3 bg-[#FDFBF7] border border-[#B8924A]/35 shadow-xl">
            {/* Museum Corner Accents */}
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#B8924A]" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#B8924A]" />
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#B8924A]" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#B8924A]" />

            <div className="relative aspect-16/9 w-full bg-black/90 overflow-hidden shadow-inner">
              <video
                className="h-full w-full object-cover"
                src="/isuru_images/our%20story%20video.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
                aria-label="Our story video"
              />
            </div>
          </div>
          {/* Subtle Provenance Hallmark Bar */}
          <div className="mt-3 px-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#B8924A]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#B8924A]" />
              Sabaragamuwa Province, Sri Lanka
            </span>
            <span className="text-[#2B2B2B]/60 hidden sm:inline">
              Documentary Footage • Traditional Mining Extraction on Ancestral Lands
            </span>
          </div>
        </div>

        {/* Machine-Readable Fast Facts / Quotable Entity Profile for GEO & AI Engines */}
        <section
          id="facts"
          aria-labelledby="facts-heading"
          className="p-6 sm:p-8 rounded-xl bg-[#FDFBF7] border border-[#B8924A]/40 shadow-sm max-w-5xl mx-auto space-y-6"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#80601C] font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#80601C]" />
            <h2 id="facts-heading">
              {SEO_CONFIG.brand.name} · Verified Entity Facts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[#2B2B2B]/85">
            {SEO_CONFIG.facts.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded bg-[#FAF6EE] border border-[#B8924A]/20 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#80601C] font-semibold block">
                  {item.topic}
                </span>
                <p className="leading-relaxed text-[#2B2B2B]">
                  {item.fact}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Narrative Chapters - 2-Column Editorial Spreads on Desktop */}
        <div className="space-y-16 lg:space-y-24">
          
          {/* Chapter 1: Generational Legacy */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
                <span className="w-6 h-px bg-[#B8924A]" />
                Chapter 01
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#5E0F1E] font-normal leading-snug">
                A Legacy Passed Down Through Generations
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#2B2B2B]/85 leading-relaxed font-normal">
                <p>
                  My beloved grandfather, the late <strong>Reginald Mendis</strong>, was born in 1922. He was actively involved in politics until 1964, serving as a Central Committee Member and Political Bureau Member of the Lanka Sama Samaja Party, as well as Secretary of its Education Bureau.
                </p>
                <p>
                  After concluding his active political career, he devoted himself wholeheartedly to his own business ventures, which included gemstone mining. When he passed away in January 2000, he had already passed on his knowledge, experience, and business expertise to my father.
                </p>
                <p>
                  My maternal grandfather, the late <strong>Premaratne Pathinayake</strong>, was also a prominent businessman with a long-established commercial history. He was a respected landowner and plantation proprietor. Even today, traditional gemstone mining activities continue on lands that once belonged to him.
                </p>
                <p className="font-serif italic text-[#5E0F1E]">
                  These two family legacies have provided me with a strong foundation and a deep-rooted connection to Sri Lanka’s gemstone industry.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 bg-[#FDFBF7] border border-[#B8924A]/40 rounded-sm shadow-sm space-y-4">
                <span className="text-[10px] uppercase tracking-[0.28em] text-[#B8924A] font-semibold block">
                  HERITAGE ANCHORS
                </span>
                <div className="space-y-4 divide-y divide-[#B8924A]/20 text-xs text-[#2B2B2B]/80">
                  <div className="pt-2">
                    <span className="font-semibold text-[#5E0F1E] block text-sm font-serif">Reginald Mendis (b. 1922)</span>
                    <span>Alluvial mining pioneer in Ratnapura. Passed trade wisdom through three generations.</span>
                  </div>
                  <div className="pt-3">
                    <span className="font-semibold text-[#5E0F1E] block text-sm font-serif">Premaratne Pathinayake</span>
                    <span>Sabaragamuwa plantation proprietor. Ancestral mining lands active to this day.</span>
                  </div>
                  <div className="pt-3">
                    <span className="font-semibold text-[#5E0F1E] block text-sm font-serif">National Licensing</span>
                    <span>National Gem and Jewellery Authority of Sri Lanka (Reg: <strong>{SEO_CONFIG.brand.licenseNumber}</strong>).</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Chapter 2: Childhood Passion & Professional Expertise */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="p-6 sm:p-8 bg-[#FDFBF7] border border-[#B8924A]/40 rounded-sm shadow-sm space-y-3">
                <span className="text-[10px] uppercase tracking-[0.28em] text-[#B8924A] font-semibold block">
                  PROFESSIONAL ACCREDITATION
                </span>
                <p className="font-serif text-lg text-[#5E0F1E]">
                  Registered Gemstone Dealer
                </p>
                <p className="text-xs text-[#2B2B2B]/75 leading-relaxed">
                  Registered under the <strong>National Gem and Jewellery Authority of Sri Lanka</strong> (Registration Number: <strong>{SEO_CONFIG.brand.licenseNumber}</strong>).
                </p>
                <div className="pt-2 border-t border-[#B8924A]/20 flex items-center gap-2 text-xs text-[#80601C] font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Formal Gemological Studies Since 2020</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
                <span className="w-6 h-px bg-[#B8924A]" />
                Chapter 02
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#5E0F1E] font-normal leading-snug">
                From Childhood Passion to Professional Expertise
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#2B2B2B]/85 leading-relaxed font-normal">
                <p>
                  Growing up surrounded by gemstones, I developed a natural passion for this trade from an early age. I closely observed my family members engaged in gemstone mining, rough stone identification, cutting, and trading. This childhood exposure gave me a deep understanding of the industry from its very roots.
                </p>
                <p>
                  To build upon this family legacy, I began studying the gemstone trade professionally and systematically in 2020. I expanded my knowledge through formal gemological training, practical market experience, and continuous research into the global gemstone industry.
                </p>
              </div>
            </div>
          </section>

          {/* Chapter 3: Our Mission and Vision */}
          <section className="space-y-6 max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
              <span className="w-6 h-px bg-[#B8924A]" />
              Chapter 03
              <span className="w-6 h-px bg-[#B8924A]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#5E0F1E] font-normal leading-snug">
              Our Vision: Connecting Ceylon to the Global Market
            </h2>
            <p className="text-sm sm:text-base text-[#2B2B2B]/85 leading-relaxed max-w-3xl mx-auto">
              Our primary goal is to make genuine, high-quality Sri Lankan gemstones easily and transparently accessible to buyers around the world. By using modern digital platforms, we aim to bridge the gap between traditional mining communities and international buyers—reducing dependence on intermediaries and ensuring greater transparency, authenticity, and fair pricing.
            </p>
          </section>

        </div>

        {/* Pillars of Trust */}
        <div className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#B8924A] font-semibold">
              THE PILLARS OF ISURU CEYLON GEMS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E]">
              Heritage, Trust, and Value
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="relative p-8 sm:p-10 bg-[#FDFBF7] border border-[#B8924A]/30 text-center space-y-4 hover:border-[#B8924A] transition-all duration-300 hover:shadow-lg group">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#B8924A]/60 to-transparent group-hover:via-[#B8924A]" />
              <div className="w-14 h-14 rounded-full bg-[#FAF6EE] border border-[#B8924A]/35 mx-auto flex items-center justify-center text-[#B8924A] group-hover:scale-105 transition-transform duration-300 shadow-xs">
                <Compass className="w-6 h-6 text-[#B8924A]" />
              </div>
              <h4 className="font-serif text-xl sm:text-2xl text-[#5E0F1E]">Generational Heritage</h4>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/75 leading-relaxed">
                Roots tracing back to Reginald Mendis (b. 1922) and Premaratne Pathinayake, preserving authentic pit extraction on family lands.
              </p>
            </div>

            <div className="relative p-8 sm:p-10 bg-[#FDFBF7] border border-[#B8924A]/30 text-center space-y-4 hover:border-[#B8924A] transition-all duration-300 hover:shadow-lg group">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#B8924A]/60 to-transparent group-hover:via-[#B8924A]" />
              <div className="w-14 h-14 rounded-full bg-[#FAF6EE] border border-[#B8924A]/35 mx-auto flex items-center justify-center text-[#B8924A] group-hover:scale-105 transition-transform duration-300 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-[#B8924A]" />
              </div>
              <h4 className="font-serif text-xl sm:text-2xl text-[#5E0F1E]">NGJA Registered Trust</h4>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/75 leading-relaxed">
                Officially accredited dealer under the National Gem and Jewellery Authority of Sri Lanka (Reg: <strong>{SEO_CONFIG.brand.licenseNumber}</strong>).
              </p>
            </div>

            <div className="relative p-8 sm:p-10 bg-[#FDFBF7] border border-[#B8924A]/30 text-center space-y-4 hover:border-[#B8924A] transition-all duration-300 hover:shadow-lg group">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#B8924A]/60 to-transparent group-hover:via-[#B8924A]" />
              <div className="w-14 h-14 rounded-full bg-[#FAF6EE] border border-[#B8924A]/35 mx-auto flex items-center justify-center text-[#B8924A] group-hover:scale-105 transition-transform duration-300 shadow-xs">
                <HeartHandshake className="w-6 h-6 text-[#B8924A]" />
              </div>
              <h4 className="font-serif text-xl sm:text-2xl text-[#5E0F1E]">Direct Global Access</h4>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/75 leading-relaxed">
                Eliminating brokers to deliver unheated, certified Ceylon sapphires directly to international clients with complete transparency.
              </p>
            </div>
          </div>
        </div>

        {/* Closing Invitation & CTA Banner */}
        <div className="relative bg-[#FDFBF7] border border-[#B8924A]/40 p-10 sm:p-14 text-center space-y-6 max-w-4xl mx-auto shadow-md">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
            <Sparkles className="w-4 h-4 text-[#B8924A]" />
            {SEO_CONFIG.brand.name} — A LEGACY OF GEMS. A FUTURE OF TRUST.
          </div>
          
          <h3 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-normal leading-tight">
            The pride of a gemstone heritage.<br />The promise of a trusted future.
          </h3>
          
          <p className="text-sm sm:text-base text-[#2B2B2B]/75 max-w-2xl mx-auto leading-relaxed">
            We invite you to explore our certified unheated natural gemstone collection or schedule a viewing with our concierge.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/gems"
              className="inline-flex items-center gap-2.5 bg-[#5E0F1E] text-[#FAF6EE] px-8 sm:px-10 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#420A15] transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 border border-[#B8924A]/40"
            >
              Explore Our Natural Gemstone Collection
              <ArrowRight className="w-4 h-4 text-[#D4AF67]" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-[#B8924A] text-[#5E0F1E] bg-transparent hover:bg-[#B8924A] hover:text-[#5E0F1E] px-8 py-4 text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300"
            >
              Contact Concierge
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
