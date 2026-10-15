import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryCards } from "@/components/home/category-cards";
import { FeaturedGems } from "@/components/home/featured-gems";
import { TrustMarkers } from "@/components/home/trust-markers";
import { OurStory } from "@/components/home/OurStory";
import { EnquiryCTA } from "@/components/home/enquiry-cta";
import { GemMarquee } from "@/components/home/gem-marquee";
import { CraftJourney } from "@/components/home/craft-journey";
import { getGemstones } from "@/actions/gems";
import {
  JsonLd,
  getOrganizationSchema,
  getWebSiteSchema,
  getBreadcrumbListSchema,
} from "@/lib/seo/schema";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Isuru Ceylon | The Timeless Beauty of Ceylon Sapphires & Rare Precious Stones",
    description:
      "Curators of unheated Ceylon Royal Blue Sapphires, rare Padparadschas, and natural gemstones direct from the alluvial gravels of Ratnapura, Sri Lanka since 1984. Authenticated by NGJA, GRS, and GIA.",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: "Isuru Ceylon | The Timeless Beauty of Ceylon",
      description: "Direct mine-to-market natural Ceylon gemstones, unheated Royal Blue Sapphires, and certified precious specimens.",
      url: "/",
      images: [
        {
          url: "/isuru_images/blue1.jpg",
          width: 1200,
          height: 630,
          alt: "Isuru Ceylon - Fine Ceylon Blue Sapphire",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Isuru Ceylon | Natural Ceylon Sapphires & Rare Gems",
      description: "Direct mine-to-market natural Ceylon gemstones, unheated Royal Blue Sapphires, and certified precious specimens.",
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

