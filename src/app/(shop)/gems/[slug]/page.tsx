import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGemBySlug } from "@/actions/gems";
import { formatCurrency, formatCarats } from "@/lib/utils";
import { GoldDivider } from "@/components/layout/gold-divider";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ShieldCheck, ArrowLeft, CheckCircle, Mail } from "lucide-react";

interface GemDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: GemDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const gem = await getGemBySlug(slug);

  if (!gem) {
    return {
      title: "Gemstone Not Found | Isuru Gems",
    };
  }

  return {
    title: `${gem.name} (${formatCarats(gem.carat)}) | Isuru Gems Ceylon`,
    description: `Natural ${gem.variety} from ${gem.origin}. ${gem.treatment}, ${gem.dimensions}. Certified by ${gem.certificate.lab}.`,
    openGraph: {
      title: `${gem.name} | Natural Ceylon Gemstone`,
      description: gem.description,
      images: gem.images.map((img) => ({ url: img.url, alt: img.alt })),
    },
  };
}

export default async function GemDetailPage({ params }: GemDetailPageProps) {
  const { slug } = await params;
  const gem = await getGemBySlug(slug);

  if (!gem) {
    notFound();
  }

  return (
    <div className="py-12 bg-[#FAF6EE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            href="/gems"
            className="inline-flex items-center text-xs uppercase tracking-widest text-[#5E0F1E] hover:text-[#B8924A] transition-colors gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Ceylon Gemstone Vault</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Visual Gallery */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Main Image with Alt text */}
            <div className="relative aspect-4/3 w-full bg-[#FAF6EE] border border-[#B8924A]/30 shadow-lg overflow-hidden">
              <Image
                src={gem.images[0]?.url || "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=80"}
                alt={gem.images[0]?.alt || `${gem.name} primary facet photograph`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-[#5E0F1E] text-[#FAF6EE] text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-medium shadow-sm">
                  {gem.origin}
                </span>
              </div>
            </div>

            {/* Secondary angles thumbnail grid if present */}
            {gem.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {gem.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square border border-[#B8924A]/25 bg-[#FAF6EE] overflow-hidden"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `${gem.name} angle ${idx + 1}`}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Gemstone Narrative & Provenance */}
            <div className="bg-[#FDFBF7] border border-[#B8924A]/25 p-8 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
                Gemological Curatorial Note
              </span>
              <h2 className="font-serif text-2xl text-[#5E0F1E] font-normal">
                Origin & Characteristics
              </h2>
              <p className="text-sm text-[#2B2B2B]/80 leading-relaxed">
                {gem.description}
              </p>

              <div className="pt-4 grid grid-cols-2 gap-4 border-t border-[#B8924A]/15 text-xs text-[#2B2B2B]/75">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#B8924A]" />
                  <span>100% Conflict-Free Pit Mined</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#B8924A]" />
                  <span>NGJA Export Certified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Spec Table & Acquisition */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FDFBF7] border border-[#B8924A]/30 p-8 space-y-6 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
                    {gem.variety}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#1B3A8A] font-semibold bg-[#1B3A8A]/10 px-2.5 py-0.5 border border-[#1B3A8A]/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {gem.certificate.lab}
                  </span>
                </div>

                {/* The single H1 for this page */}
                <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-medium leading-tight">
                  {gem.name}
                </h1>

                <div className="flex items-baseline space-x-3 pt-2">
                  <span className="font-serif text-3xl font-bold text-[#1B3A8A]">
                    {formatCurrency(gem.price, gem.currency)}
                  </span>
                  <span className="text-xs text-[#2B2B2B]/60">
                    Complimentary Insured Courier Included
                  </span>
                </div>
              </div>

              <GoldDivider className="my-4" />

              {/* Gemstone Specifications Grid */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#5E0F1E] font-semibold">
                  Gemological Specifications
                </h3>
                <dl className="divide-y divide-[#B8924A]/15 text-xs">
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#2B2B2B]/70">Carat Weight</dt>
                    <dd className="font-semibold text-[#2B2B2B]">{formatCarats(gem.carat)}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#2B2B2B]/70">Cut & Shape</dt>
                    <dd className="font-semibold text-[#2B2B2B]">{gem.cut}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#2B2B2B]/70">Color & Saturation</dt>
                    <dd className="font-semibold text-[#2B2B2B]">{gem.color}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#2B2B2B]/70">Dimensions</dt>
                    <dd className="font-semibold text-[#2B2B2B]">{gem.dimensions}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#2B2B2B]/70">Clarity Grade</dt>
                    <dd className="font-semibold text-[#2B2B2B]">{gem.clarity}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#2B2B2B]/70">Enhancement / Heat</dt>
                    <dd className="font-semibold text-[#5E0F1E]">{gem.treatment}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#2B2B2B]/70">Geographical Origin</dt>
                    <dd className="font-semibold text-[#2B2B2B]">{gem.origin}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#2B2B2B]/70">Certificate Number</dt>
                    <dd className="font-mono font-medium text-[#1B3A8A]">{gem.certificate.number}</dd>
                  </div>
                </dl>
              </div>

              {/* Acquisition Actions */}
              <div className="space-y-3 pt-4 border-t border-[#B8924A]/15">
                <AddToCartButton
                  gem={gem}
                  className="w-full py-4 text-xs uppercase tracking-[0.2em]"
                />

                <Link
                  href={`/contact?gem=${encodeURIComponent(gem.name)}&id=${gem.id}`}
                  className="w-full inline-flex items-center justify-center border border-[#B8924A] text-[#5E0F1E] py-3.5 px-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#FAF6EE] transition-subtle gap-2"
                >
                  <Mail className="w-4 h-4 text-[#B8924A]" />
                  <span>Private Inquire / Bespoke Setting</span>
                </Link>
              </div>

              {/* Assurance block */}
              <div className="pt-4 border-t border-[#B8924A]/15 flex items-center gap-3 text-xs text-[#2B2B2B]/70">
                <ShieldCheck className="w-5 h-5 text-[#B8924A] shrink-0" />
                <span>Original laboratory report delivered with stone in sealed archival folder.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
