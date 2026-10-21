import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryCards } from "@/components/home/category-cards";
import { FeaturedGems } from "@/components/home/featured-gems";
import { GemMarquee } from "@/components/home/gem-marquee";
import { TrustMarkers } from "@/components/home/trust-markers";
import { getGemstones } from "@/actions/gems";

const CraftJourney = dynamic(
  () => import("@/components/home/craft-journey").then((m) => m.CraftJourney)
);
const OurStory = dynamic(
  () => import("@/components/home/OurStory").then((m) => m.OurStory)
);
const EnquiryCTA = dynamic(
  () => import("@/components/home/enquiry-cta").then((m) => m.EnquiryCTA)
);
import {
  JsonLd,
  getOrganizationSchema,
  getWebSiteSchema,
  getBreadcrumbListSchema,
} from "@/lib/seo/schema";

import { getSEORecordByPath } from "@/actions/seo";
import { getHrefLangAlternates } from "@/lib/seo/hreflang";

// ISR: Statically prerender and cache page for 1 hour, avoiding no-store headers in production
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEORecordByPath("/");

  const metaTitle = seo?.metaTitle || "Isuru Ceylon | Natural Ceylon Sapphires & Rare Precious Island Gemstones";
  const metaDesc = seo?.metaDescription || "Curators of unheated Ceylon Royal Blue Sapphires, rare Padparadschas, and natural gemstones direct from the alluvial gravels of Ratnapura, Sri Lanka since 1964. Authenticated by NGJA, GRS, and GIA.";
  const canonicalUrl = seo?.canonicalUrl || "/";
  const ogImg = seo?.ogImage || "/isuru_images/blue1.webp";

  return {
    title: {
      absolute: metaTitle,
    },
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


export default async function HomePage() {
  const { gems } = await getGemstones({ limit: 16 });

  const homeSchemas = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getBreadcrumbListSchema([{ name: "Home", url: "/" }]),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={homeSchemas} />

      <HeroSection />
      <CategoryCards />
      <FeaturedGems gems={gems} />
      <GemMarquee />
      <CraftJourney />
      <OurStory />
      <TrustMarkers />
      <EnquiryCTA />
    </div>
  );
}

