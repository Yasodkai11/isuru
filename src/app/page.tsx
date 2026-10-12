import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryCards } from "@/components/home/category-cards";
import { FeaturedGems } from "@/components/home/featured-gems";
import { TrustMarkers } from "@/components/home/trust-markers";
import { HeritageStory } from "@/components/home/heritage-story";
import { EnquiryCTA } from "@/components/home/enquiry-cta";
import { getGemstones } from "@/actions/gems";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Isuru Gems | The Timeless Beauty of Ceylon Sapphires & Rare Precious Stones",
    description:
      "Curators of unheated Ceylon Royal Blue Sapphires, rare Padparadschas, and natural gemstones direct from the alluvial gravels of Ratnapura, Sri Lanka since 1984. Authenticated by NGJA, GRS, and GIA.",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: "Isuru Gems | The Timeless Beauty of Ceylon",
      description: "Direct mine-to-market natural Ceylon gemstones, unheated Royal Blue Sapphires, and certified precious specimens.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85",
          width: 1200,
          height: 630,
          alt: "Isuru Gems - Fine Ceylon Blue Sapphire",
        },
      ],
    },
  };
}

export default async function HomePage() {
  const gems = await getGemstones();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero: "The Timeless Beauty of Ceylon" */}
      <HeroSection />

      {/* 3 Category Cards */}
      <CategoryCards />

      {/* Featured Gems with Interactive Filter & Quick Enquiry Modal */}
      <FeaturedGems gems={gems} />

      {/* Four Pillars of Trust & Ceylon Mineralogical Standards Table */}
      <TrustMarkers />

      {/* Heritage & Ratnapura Story */}
      <HeritageStory />

      {/* Private Acquisition Enquiry CTA & Concierge Desk */}
      <EnquiryCTA />
    </div>
  );
}
