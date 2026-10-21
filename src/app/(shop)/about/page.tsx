import type { Metadata } from "next";
import Link from "next/link";
import { GoldDivider } from "@/components/layout/gold-divider";
import { Compass, HeartHandshake, ShieldCheck, Award, Sparkles, ArrowRight } from "lucide-react";
import { JsonLd, getBreadcrumbListSchema } from "@/lib/seo/schema";

import { getSEORecordByPath } from "@/actions/seo";
import { getHrefLangAlternates } from "@/lib/seo/hreflang";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEORecordByPath("/about");

  const metaTitle = seo?.metaTitle || "Our Story: From Generational Heritage to the Digital World";
  const metaDesc =
    seo?.metaDescription ||
    "The authentic story of Isuru Gems. Rooted in the legacies of Reginald Mendis (b. 1922) and Premaratne Pathinayake, combining family mining heritage with modern gemology and official NGJA licensing (Reg: 202610DL42288).";
  const canonicalUrl = seo?.canonicalUrl || "/about";
  const ogImg = seo?.ogImage || "/isuru_images/blue1.webp";

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


export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Our Story & Heritage", url: "/about" },
  ]);

  return (
    <div className="py-16 sm:py-20 lg:py-24 bg-[#FAF6EE] min-h-screen">
      <JsonLd data={breadcrumbSchema} />
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-20 lg:space-y-28">

        
        {/* Editorial Heading */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold">
            ISURU GEMS • OUR STORY
          </span>
          {/* Strictly the single H1 for this page */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#5E0F1E] font-normal leading-[1.15]">
            From Generational Heritage to the Digital World
          </h1>
          <p className="text-base sm:text-lg text-[#2B2B2B]/80 leading-relaxed max-w-3xl mx-auto font-serif italic">
            “Gemstones are more than just precious stones. They represent generations of experience, knowledge, trust, and heritage.”
          </p>
          <p className="text-sm sm:text-base text-[#2B2B2B]/75 leading-relaxed max-w-2xl mx-auto">
            Isuru Gems is a distinctive gemstone business that connects a rich family heritage with the opportunities of the modern digital world.
          </p>
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
              <div className="relative bg-[#FDFBF7] border border-[#B8924A]/30 p-8 sm:p-10 shadow-sm space-y-5">
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#B8924A]/60" />
                <div className="text-[#B8924A]/40 font-serif text-5xl leading-none select-none">“</div>
                <blockquote className="font-serif text-lg sm:text-xl text-[#5E0F1E] leading-relaxed -mt-3 italic">
                  When he passed away in January 2000, he had already passed on his knowledge, experience, and business expertise to my father... Traditional mining continues on lands that once belonged to him.
                </blockquote>
                <div className="pt-3 border-t border-[#B8924A]/20 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#B8924A] font-medium">
                  <span>Reginald Mendis (b. 1922)</span>
                  <span>Premaratne Pathinayake</span>
                </div>
              </div>
            </div>
          </section>

          <GoldDivider withOrnament className="opacity-40" />

          {/* Chapter 2: Passion to Professional Knowledge */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative bg-[#FDFBF7] border border-[#B8924A]/30 p-8 sm:p-10 shadow-sm space-y-5">
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#B8924A]/60" />
                <div className="text-[#B8924A]/40 font-serif text-5xl leading-none select-none">“</div>
                <blockquote className="font-serif text-lg sm:text-xl text-[#5E0F1E] leading-relaxed -mt-3 italic">
                  By combining inherited family experience with modern education, I aim to establish a trusted and forward-looking presence in the gemstone industry.
                </blockquote>
                <div className="pt-3 border-t border-[#B8924A]/20 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#B8924A] font-medium">
                  <span>Gemology Study</span>
                  <span>Since 2020</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
                <span className="w-6 h-px bg-[#B8924A]" />
                Chapter 02
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#5E0F1E] font-normal leading-snug">
                From a Childhood Passion to Professional Knowledge
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#2B2B2B]/85 leading-relaxed font-normal">
                <p>
                  My interest in gemstones began during my childhood, when I pursued them as a personal hobby, fascinated by the crystalline brilliance unearthed from the gravels of Sabaragamuwa.
                </p>
                <p>
                  Since <strong>2020</strong>, I have devoted myself to studying gemology in greater depth, developing my scientific knowledge of gemstones and gaining a thorough understanding of their technical aspects, optical properties, crystal structures, and laboratory evaluation practices.
                </p>
                <p>
                  By synthesizing generations of practical family wisdom with modern gemological standards, I am committed to establishing a trusted, transparent, and forward-looking presence in the gemstone industry.
                </p>
              </div>
            </div>
          </section>

          <GoldDivider withOrnament className="opacity-40" />

          {/* Chapter 3: Official Registration and Trust */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
                <span className="w-6 h-px bg-[#B8924A]" />
                Chapter 03
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#5E0F1E] font-normal leading-snug">
                Official Registration and Trust
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#2B2B2B]/85 leading-relaxed font-normal">
                <p>
                  I am a fully registered gemstone dealer accredited under the <strong>National Gem and Jewellery Authority (NGJA) of Sri Lanka</strong>.
                </p>
                <div className="p-4 sm:p-5 bg-[#FAF6EE] border-l-4 border-[#B8924A] shadow-xs space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#B8924A] font-bold block">
                    Official Regulatory Accreditation
                  </span>
                  <div className="text-base sm:text-lg font-mono font-semibold text-[#5E0F1E]">
                    NGJA Registration Number: 202610DL42288
                  </div>
                  <p className="text-xs text-[#2B2B2B]/70">
                    National Gem and Jewellery Authority of Sri Lanka • Licensed Gemstone Dealer
                  </p>
                </div>
                <p>
                  Building on this official governmental accreditation and my family&apos;s generations of experience, I am dedicated to providing clients and international collectors with a reliable, legally verified, and trustworthy service.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative bg-[#FDFBF7] border border-[#B8924A]/40 p-8 sm:p-10 shadow-md space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#FAF6EE] border-2 border-[#B8924A] mx-auto flex items-center justify-center text-[#B8924A] shadow-xs">
                  <Award className="w-8 h-8 text-[#B8924A]" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-bold block">
                  Sri Lanka State Verified
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#5E0F1E] font-normal">
                  Registered Dealer
                </h3>
                <p className="text-xs font-mono font-bold text-[#5E0F1E] bg-[#FAF6EE] py-2 px-3 border border-[#B8924A]/30 inline-block">
                  Reg No: 202610DL42288
                </p>
                <p className="text-xs text-[#2B2B2B]/75 leading-relaxed pt-2">
                  Zero ambiguity standard. Every specimen authenticated with verified mine-to-market provenance.
                </p>
              </div>
            </div>
          </section>

          <GoldDivider withOrnament className="opacity-40" />

          {/* Chapter 4: From Tradition to the Digital World */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative bg-[#FDFBF7] border border-[#B8924A]/30 p-8 sm:p-10 shadow-sm space-y-5">
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#B8924A]/60" />
                <div className="text-[#B8924A]/40 font-serif text-5xl leading-none select-none">“</div>
                <blockquote className="font-serif text-lg sm:text-xl text-[#5E0F1E] leading-relaxed -mt-3 italic">
                  Our primary objective is to connect gemstones directly with buyers, reducing dependence on intermediaries and creating opportunities to access these valuable treasures more directly.
                </blockquote>
                <div className="pt-3 border-t border-[#B8924A]/20 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#B8924A] font-medium">
                  <span>Direct to Buyer</span>
                  <span>Zero Intermediaries</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
                <span className="w-6 h-px bg-[#B8924A]" />
                Chapter 04
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#5E0F1E] font-normal leading-snug">
                From Tradition to the Digital World
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#2B2B2B]/85 leading-relaxed font-normal">
                <p>
                  Until now, our family gemstone business has operated largely through traditional trading methods rooted in local markets and multi-tiered broker networks.
                </p>
                <p>
                  My vision is to move beyond these limitations by harnessing modern digital technology to bring Sri Lanka&apos;s most precious gemstones closer to customers around the globe.
                </p>
                <p>
                  Our primary objective is to connect gemstones directly with buyers, reducing dependence on intermediaries and creating opportunities for customers to access these valuable treasures directly at fair, transparent value.
                </p>
                <p className="font-serif text-base sm:text-lg text-[#5E0F1E] italic">
                  At Isuru Gems, we believe that authenticity, transparency, trust, and customer satisfaction are the foundations of a successful gemstone business.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Pillars Grid - Architectural Pledges */}
        <div className="pt-6">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#B8924A] font-semibold">
              ISURU GEMS — CORE FOUNDATIONS
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
              <h3 className="font-serif text-xl sm:text-2xl text-[#5E0F1E]">Generational Heritage</h3>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/75 leading-relaxed">
                Roots tracing back to Reginald Mendis (b. 1922) and Premaratne Pathinayake, preserving authentic pit extraction on family lands.
              </p>
            </div>

            <div className="relative p-8 sm:p-10 bg-[#FDFBF7] border border-[#B8924A]/30 text-center space-y-4 hover:border-[#B8924A] transition-all duration-300 hover:shadow-lg group">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#B8924A]/60 to-transparent group-hover:via-[#B8924A]" />
              <div className="w-14 h-14 rounded-full bg-[#FAF6EE] border border-[#B8924A]/35 mx-auto flex items-center justify-center text-[#B8924A] group-hover:scale-105 transition-transform duration-300 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-[#B8924A]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#5E0F1E]">NGJA Registered Trust</h3>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/75 leading-relaxed">
                Officially accredited dealer under the National Gem and Jewellery Authority of Sri Lanka (Reg: 202610DL42288).
              </p>
            </div>

            <div className="relative p-8 sm:p-10 bg-[#FDFBF7] border border-[#B8924A]/30 text-center space-y-4 hover:border-[#B8924A] transition-all duration-300 hover:shadow-lg group">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#B8924A]/60 to-transparent group-hover:via-[#B8924A]" />
              <div className="w-14 h-14 rounded-full bg-[#FAF6EE] border border-[#B8924A]/35 mx-auto flex items-center justify-center text-[#B8924A] group-hover:scale-105 transition-transform duration-300 shadow-xs">
                <HeartHandshake className="w-6 h-6 text-[#B8924A]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#5E0F1E]">Direct Global Access</h3>
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
            ISURU GEMS — A LEGACY OF GEMS. A FUTURE OF TRUST.
          </div>
          
          <h3 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-normal leading-tight">
            The pride of a gemstone heritage.<br />The promise of a trusted future.
          </h3>
          
          <p className="text-sm sm:text-base text-[#2B2B2B]/75 max-w-2xl mx-auto leading-relaxed">
            We invite you to become part of our journey as we combine generations of traditional knowledge with modern technology to shape the future of gemstone trading.
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
