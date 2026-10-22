import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGemBySlug, getRelatedGems, getGemstones } from "@/actions/gems";
import { formatGemCarats, formatGemPrice, isPriceOnRequest } from "@/lib/utils";
import { GoldDivider } from "@/components/layout/gold-divider";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { GemGallery } from "@/components/gems/gem-gallery";
import { GemInquiryForm } from "@/components/gems/gem-inquiry-form";
import { GemCard } from "@/components/gems/gem-card";
import { Badge } from "@/components/ui/badge";
import {
  JsonLd,
  getProductSchema,
  getBreadcrumbListSchema,
} from "@/lib/seo/schema";
import { getHrefLangAlternates } from "@/lib/seo/hreflang";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  Truck,
  FileCheck2,
  Lock,
} from "lucide-react";

import { DETAIL_ON_REQUEST } from "@/lib/catalog-gems";
import { CATEGORIES_CONFIG } from "@/lib/constants";
import { SEO_CONFIG } from "@/lib/seo-config";

// ISR: Cache page for 1 hour, revalidated on-demand when product updates occur
export const revalidate = 3600;

export async function generateStaticParams() {
  const { gems } = await getGemstones({ limit: 500 });
  return gems.map((gem) => ({
    slug: gem.slug,
  }));
}

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
      title: "Gemstone Specimen Not Found | Isuru Ceylon",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const caratSuffix = gem.carat > 0 ? ` (${formatGemCarats(gem.carat)})` : "";
  const ogImages = gem.images && gem.images.length > 0
    ? gem.images.map((img) => ({
        url: img.url,
        alt: img.alt || `${gem.name}${caratSuffix} - Natural ${gem.variety} from ${gem.origin}`,
        width: 1200,
        height: 800,
      }))
    : [
        {
          url: "/isuru_images/blue1.webp",
          width: 1200,
          height: 630,
          alt: `${gem.name}${caratSuffix} - Natural Ceylon Gemstone`,
        },
      ];

  const labText = gem.certificate?.lab ? `Certified by ${gem.certificate.lab}.` : "NGJA export certified.";
  const priceText = isPriceOnRequest(gem.price)
    ? "Inquire for private viewing and pricing."
    : `Net investment valuation ${formatGemPrice(gem.price, gem.currency)}.`;

  // Craft a natural, high-relevance 145-160 character description from verified attributes
  const descriptionPrefix = `${gem.treatment ? gem.treatment + " " : ""}natural ${gem.variety}${caratSuffix} from ${gem.origin}. ${gem.cut}. ${labText} ${priceText} Armoured courier delivery.`;
  const metaDescription =
    descriptionPrefix.length > 165
      ? `${descriptionPrefix.slice(0, 160).trim()}...`
      : descriptionPrefix;

  return {
    title: `${gem.name}${caratSuffix} | ${SEO_CONFIG.brand.name}`,
    description: metaDescription,
    alternates: {
      canonical: `${SEO_CONFIG.site.url}/gems/${gem.slug}`,
    },
    openGraph: {
      title: `${gem.name}${caratSuffix} | ${SEO_CONFIG.brand.name}`,
      description: gem.description || metaDescription,
      url: `${SEO_CONFIG.site.url}/gems/${gem.slug}`,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${gem.name}${caratSuffix} | ${SEO_CONFIG.brand.name}`,
      description: gem.description || metaDescription,
      images: [ogImages[0].url],
    },
  };
}

export default async function GemDetailPage({ params }: GemDetailPageProps) {
  const { slug } = await params;
  const gem = await getGemBySlug(slug);

  if (!gem) {
    notFound();
  }

  const relatedGems = await getRelatedGems(gem.slug, 3);

  const categoryConfig = gem.category ? CATEGORIES_CONFIG[gem.category] : null;
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Gemstones Vault", url: "/gems" },
    ...(categoryConfig
      ? [{ name: categoryConfig.title, url: `/gems/category/${gem.category}` }]
      : []),
    { name: gem.name, url: `/gems/${gem.slug}` },
  ];

  const productSchema = getProductSchema(gem);
  const breadcrumbSchema = getBreadcrumbListSchema(breadcrumbItems);


  const isCorundum = /sapphire|ruby|padparadscha/i.test(gem.variety);
  const priceOnRequest = isPriceOnRequest(gem.price);

  const specs = [
    ...(isCorundum ? [{ label: "Mineral Species", value: "Natural Corundum (Al₂O₃)" }] : []),
    { label: "Variety", value: gem.variety },
    { label: "Carat Weight", value: formatGemCarats(gem.carat) },
    { label: "Cut & Shape", value: gem.cut },
    { label: "Exact Dimensions", value: gem.dimensions },
    { label: "Color / Saturation", value: gem.color },
    { label: "Clarity Grade", value: gem.clarity },
    { label: "Enhancement / Treatment", value: gem.treatment },
    { label: "Mining Locality", value: gem.origin },
    {
      label: "Certification Report",
      value: gem.certificate.lab ? `${gem.certificate.lab} (${gem.certificate.number})` : DETAIL_ON_REQUEST,
    },
    ...(isCorundum
      ? [
          { label: "Mohs Hardness", value: "9.0 Mohs Scale" },
          { label: "Refractive Index", value: "1.762 – 1.770 (Birefringence 0.008)" },
        ]
      : []),
  ];

  return (
    <div className="py-10 bg-[#FAF6EE] min-h-screen">
      <JsonLd data={[productSchema, breadcrumbSchema]} />
      <div className="container-luxe space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#2B2B2B]/70 flex-wrap">
          <Link href="/" className="hover:text-[#5E0F1E] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/gems" className="hover:text-[#5E0F1E] transition-colors">
            Gemstones Vault
          </Link>
          {categoryConfig && (
            <>
              <span>/</span>
              <Link
                href={`/gems/category/${gem.category}`}
                className="hover:text-[#5E0F1E] transition-colors"
              >
                {categoryConfig.title}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#5E0F1E] font-semibold truncate max-w-xs sm:max-w-md">
            {gem.name}
          </span>
        </nav>


        {/* Back Link */}
        <div>
          <Link
            href="/gems"
            className="inline-flex items-center text-xs uppercase tracking-widest text-[#5E0F1E] hover:text-[#B8924A] transition-colors gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Vault Catalog</span>
          </Link>
        </div>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Visual Gallery with Zoom & Curatorial Provenance */}
          <div className="lg:col-span-7 space-y-8">
            {/* Gallery with Zoom and Lightbox */}
            <GemGallery
              images={gem.images}
              gemName={gem.name}
              origin={gem.origin}
              certificateLab={gem.certificate.lab}
            />

            {/* Curatorial Provenance Note */}
            <div className="bg-[#FDFBF7] border border-[#B8924A]/30 p-8 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
                  Gemological Curatorial Note
                </span>
                <Badge variant="unheated" className="text-[9px]">
                  {gem.treatment}
                </Badge>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-normal leading-snug">
                Origin & Mineralogical Characteristics
              </h2>

              <p className="text-sm text-[#2B2B2B]/80 leading-relaxed">
                {gem.description}
              </p>

              <GoldDivider className="my-4" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#2B2B2B]/75 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#B8924A] shrink-0" />
                  <span>Artisanal Pit Mined</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#B8924A] shrink-0" />
                  <span>NGJA Export Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#B8924A] shrink-0" />
                  <span>Conflict-Free Guaranteed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Specs Table, Add to Cart */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#FDFBF7] border border-[#B8924A]/40 p-6 sm:p-8 space-y-6 shadow-md">
              {/* Variety & Lab Badge Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
                    {gem.variety}
                  </span>
                  {gem.certificate.lab && (
                    <Link href="/certificates" title="View laboratory authentication details">
                      <Badge variant="gold" className="text-[10px] hover:border-[#B8924A] cursor-pointer">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#B8924A] mr-1 inline" />
                        {gem.certificate.lab}
                      </Badge>
                    </Link>
                  )}
                </div>

                {/* Single H1 for the page */}
                <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-medium leading-tight">
                  {gem.name}
                </h1>

                {/* Price Display */}
                <div className="pt-2 flex flex-col space-y-1">
                  <div className="flex items-baseline space-x-3">
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1B3A8A]">
                      {formatGemPrice(gem.price, gem.currency)}
                    </span>
                    {!priceOnRequest && (
                      <span className="text-xs text-[#2B2B2B]/60 uppercase tracking-wider">
                        Net Investment Price
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#2B2B2B]/70 flex items-center gap-1.5 pt-1">
                    <Truck className="w-3.5 h-3.5 text-[#B8924A]" />
                    <span>Complimentary Armoured Courier (Malca-Amit / Brink&apos;s)</span>
                  </span>
                </div>
              </div>

              <GoldDivider className="my-4" />

              {/* Gemological Specs Table using the Table UI Component */}
              <div className="space-y-3">
                <h2 className="text-xs uppercase tracking-[0.2em] text-[#5E0F1E] font-semibold">
                  Official Mineralogical Specifications
                </h2>

                <Table>
                  <TableBody>
                    {specs.map((row) => (
                      <TableRow key={row.label}>
                        <TableCell className="font-medium text-[#2B2B2B]/70 text-xs py-2 w-1/2">
                          {row.label}
                        </TableCell>
                        <TableCell className="font-semibold text-[#2B2B2B] text-xs py-2 text-right">
                          {row.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Acquisition Action Buttons */}
              <div className="space-y-3 pt-3 border-t border-[#B8924A]/20">
                {priceOnRequest ? (
                  <a
                    href="#inquiry-section"
                    className="w-full inline-flex items-center justify-center bg-[#5E0F1E] text-[#FAF6EE] py-4 px-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#7E1529] transition-subtle text-center"
                  >
                    Request Price & Details
                  </a>
                ) : (
                  <>
                    <AddToCartButton
                      gem={gem}
                      className="w-full py-4 text-xs uppercase tracking-[0.2em]"
                    />

                    <a
                      href="#inquiry-section"
                      className="w-full inline-flex items-center justify-center border border-[#B8924A] text-[#5E0F1E] py-3.5 px-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#FAF6EE] transition-subtle text-center"
                    >
                      Enquire About This Specimen Below
                    </a>
                  </>
                )}
              </div>

              {/* Certificate Security Assurance */}
              {gem.certificate.lab && (
                <div className="pt-3 border-t border-[#B8924A]/15 flex items-start gap-2.5 text-xs text-[#2B2B2B]/75 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-[#B8924A] shrink-0 mt-0.5" />
                  <span>
                    Delivered with sealed original gemological report from {gem.certificate.lab} and tamper-proof security cassette.{" "}
                    <Link
                      href="/certificates"
                      className="text-[#5E0F1E] hover:text-[#B8924A] underline underline-offset-2 font-medium"
                    >
                      View laboratory standards & guarantee →
                    </Link>
                  </span>
                </div>
              )}

              {/* GEO / AEO Trust & Last Updated Tag */}
              <div className="pt-3 border-t border-[#B8924A]/15 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#2B2B2B]/60">
                <span>
                  Vault record verified by {SEO_CONFIG.brand.name}
                </span>
                <span>
                  Last updated: <time dateTime="2026-10-22">2026-10-22</time>
                </span>
              </div>

              {/* Contextual Gemological Guide Link */}
              <div className="p-3.5 rounded bg-[#FAF6EE] border border-[#B8924A]/25 text-xs space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#80601C] font-semibold block">
                  Gemological Reading
                </span>
                <p className="text-[#2B2B2B]/80">
                  Curious about unheated certification and color grades? Read our{" "}
                  <Link
                    href={
                      /padparadscha/i.test(gem.variety)
                        ? "/guides/padparadscha-sapphire-guide"
                        : /ruby/i.test(gem.variety)
                        ? "/guides/pigeon-blood-ruby-guide"
                        : "/guides/ceylon-blue-sapphire-buying-guide"
                    }
                    className="text-[#5E0F1E] font-semibold underline underline-offset-2 hover:text-[#80601C]"
                  >
                    {/padparadscha/i.test(gem.variety)
                      ? "Padparadscha Sapphire Guide"
                      : /ruby/i.test(gem.variety)
                      ? "Pigeon Blood Ruby Guide"
                      : "Ceylon Blue Sapphire Buying Guide"}
                  </Link>
                  {" "}or learn{" "}
                  <Link
                    href="/guides/how-to-read-gemstone-certificate"
                    className="text-[#5E0F1E] font-semibold underline underline-offset-2 hover:text-[#80601C]"
                  >
                    how to read a gem certificate
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* "Enquire About This Gem" Form Section */}
        <div id="inquiry-section" className="pt-8">
          <GemInquiryForm gem={gem} />
        </div>

        {/* Related Ceylon Gemstones Section */}
        {relatedGems.length > 0 && (
          <div className="pt-12 space-y-8 border-t border-[#B8924A]/25">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
                From the Same Alluvial Gravels
              </span>
              <h2 className="font-serif text-3xl text-[#5E0F1E] font-normal">
                Complementary Ceylon Masterpieces
              </h2>
              <GoldDivider withOrnament className="my-4 max-w-xs mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedGems.map((related) => (
                <GemCard key={related.id} gem={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
