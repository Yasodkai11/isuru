import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero-section";
import { EntityStatement } from "@/components/home/entity-statement";
import { CategoryCards } from "@/components/home/category-cards";
import { FeaturedGems } from "@/components/home/featured-gems";
import { GemMarquee } from "@/components/home/gem-marquee";
import { TrustMarkers } from "@/components/home/trust-markers";
import { HomeFaqSection, HOME_FAQS } from "@/components/home/home-faq-section";
import { getGemstones } from "@/actions/gems";
import { SEO_CONFIG } from "@/lib/seo-config";

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
  getFAQPageSchema,
} from "@/lib/seo/schema";

import { getSEORecordByPath } from "@/actions/seo";

// ISR: Statically prerender and cache page for 1 hour, avoiding no-store headers in production
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEORecordByPath("/");

  const metaTitle =
    seo?.metaTitle ||
    "Isuru Ceylon Gems | Natural Unheated Ceylon Sapphires from Ratnapura, Sri Lanka";
  const metaDesc =
    seo?.metaDescription ||
    "Isuru Ceylon Gems is a registered gemstone dealer in Ratnapura and Colombo, Sri Lanka (NGJA Reg: 202610DL42288). Direct source of natural unheated Ceylon royal blue sapphires, padparadschas, rubies and spinels with GIA, GRS and NGJA certification.";
  const canonicalUrl = `${SEO_CONFIG.site.url}/`;
  const ogImg = seo?.ogImage || "/isuru_images/blue1.webp";

  return {
    title: {
      absolute: metaTitle,
    },
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

export default async function HomePage() {
  const { gems } = await getGemstones({ limit: 16 });

  const homeSchemas = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getBreadcrumbListSchema([{ name: "Home", url: "/" }]),
    getFAQPageSchema(
      HOME_FAQS.map((faq) => ({
        question: faq.question,
        answer: faq.detail ? `${faq.directAnswer} ${faq.detail}` : faq.directAnswer,
      }))
    ),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={homeSchemas} />

      <HeroSection />
      {/* 2-Sentence Plain Text Brand Statement for Human Visitors & AI/Bot Crawlers */}
      <EntityStatement />
      <CategoryCards />
      <FeaturedGems gems={gems} />
      <GemMarquee />
      <CraftJourney />
      <OurStory />
      <TrustMarkers />
      {/* Visible, Crawlable Direct-Answer AEO FAQ Section */}
      <HomeFaqSection />
      <EnquiryCTA />
    </div>
  );
}
