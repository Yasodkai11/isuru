import type { MetadataRoute } from "next";
import { getSitemapGemstones } from "@/actions/gems";
import { CATEGORIES_CONFIG } from "@/lib/constants";
import { SEO_CONFIG } from "@/lib/seo-config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_CONFIG.site.url;
  const now = new Date();

  // 1. Core static marketing and institutional pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      images: [`${baseUrl}/isuru_images/blue1.webp`],
    },
    {
      url: `${baseUrl}/gems`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
      images: [`${baseUrl}/isuru_images/blue1.webp`],
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
      images: [`${baseUrl}/isuru_images/blue1.webp`],
    },
    {
      url: `${baseUrl}/certificates`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
      images: [`${baseUrl}/isuru_images/contactus.webp`],
    },
  ];

  // 2. Physical Location Hubs (Local SEO)
  const locationRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/locations/ratnapura`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
      images: [`${baseUrl}/isuru_images/work/work-pit-mining.webp`],
    },
  ];

  // 3. Educational & Evergreen Gemological Guides (AEO & GEO)
  const guideRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      images: [`${baseUrl}/isuru_images/blue1.webp`],
    },
    {
      url: `${baseUrl}/guides/ceylon-blue-sapphire-buying-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
      images: [`${baseUrl}/isuru_images/blue1.webp`],
    },
    {
      url: `${baseUrl}/guides/padparadscha-sapphire-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
      images: [`${baseUrl}/isuru_images/Padparadscha%20Sapphire.webp`],
    },
    {
      url: `${baseUrl}/guides/natural-vs-heated-gemstones-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
      images: [`${baseUrl}/isuru_images/categories1.webp`],
    },
    {
      url: `${baseUrl}/guides/pigeon-blood-ruby-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
      images: [`${baseUrl}/isuru_images/ruby%20category.webp`],
    },
    {
      url: `${baseUrl}/guides/how-to-read-gemstone-certificate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
      images: [`${baseUrl}/isuru_images/blue1.webp`],
    },
    {
      url: `${baseUrl}/guides/ratnapura-gem-mining-heritage`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
      images: [`${baseUrl}/isuru_images/work/work-pit-mining.webp`],
    },
  ];

  // 4. Curated gemstone category routes
  const categoryRoutes: MetadataRoute.Sitemap = Object.entries(CATEGORIES_CONFIG).map(
    ([catKey, config]) => {
      const catUrl = `${baseUrl}/gems/category/${catKey}`;
      const catImageUrl = config.image.startsWith("http")
        ? config.image
        : `${baseUrl}${config.image}`;

      return {
        url: catUrl,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
        images: [catImageUrl],
      };
    }
  );

  // 5. Dynamic individual gemstone specimen routes
  let gemstoneRoutes: MetadataRoute.Sitemap = [];
  try {
    const gems = await getSitemapGemstones();

    gemstoneRoutes = gems
      .filter((gem) => Boolean(gem.slug))
      .map((gem) => {
        const gemUrl = `${baseUrl}/gems/${gem.slug}`;
        const images = (gem.images || [])
          .map((img) => (img.url.startsWith("http") ? img.url : `${baseUrl}${img.url}`))
          .filter(Boolean);

        return {
          url: gemUrl,
          lastModified: gem.updated_at
            ? new Date(gem.updated_at)
            : gem.created_at
            ? new Date(gem.created_at)
            : now,
          changeFrequency: "weekly" as const,
          priority: 0.9,
          ...(images.length > 0 ? { images } : {}),
        };
      });
  } catch (err) {
    console.warn("Could not retrieve dynamic gemstone routes for sitemap:", err);
  }

  return [
    ...staticRoutes,
    ...locationRoutes,
    ...guideRoutes,
    ...categoryRoutes,
    ...gemstoneRoutes,
  ];
}
