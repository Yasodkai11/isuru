import type { MetadataRoute } from "next";
import { getSitemapGemstones } from "@/actions/gems";
import { CATEGORIES_CONFIG } from "@/lib/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://isuruceylon.com";
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
      url: `${baseUrl}/certificates`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      images: [`${baseUrl}/isuru_images/contactus.webp`],
    },
  ];

  // 2. Curated gemstone category routes
  const categoryRoutes: MetadataRoute.Sitemap = Object.entries(CATEGORIES_CONFIG).map(
    ([catKey, config]) => {
      const catImageUrl = config.image.startsWith("http")
        ? config.image
        : `${baseUrl}${config.image}`;

      return {
        url: `${baseUrl}/gems/category/${catKey}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
        images: [catImageUrl],
      };
    }
  );

  // 3. Dynamic individual gemstone specimen routes (lean projected query)
  let gemstoneRoutes: MetadataRoute.Sitemap = [];
  try {
    const gems = await getSitemapGemstones();

    gemstoneRoutes = gems
      .filter((gem) => Boolean(gem.slug))
      .map((gem) => {
        const images = (gem.images || [])
          .map((img) => (img.url.startsWith("http") ? img.url : `${baseUrl}${img.url}`))
          .filter(Boolean);

        return {
          url: `${baseUrl}/gems/${gem.slug}`,
          lastModified: gem.updated_at ? new Date(gem.updated_at) : (gem.created_at ? new Date(gem.created_at) : now),
          changeFrequency: "weekly" as const,
          priority: 0.9,
          ...(images.length > 0 ? { images } : {}),
        };
      });
  } catch (err) {
    console.warn("Could not retrieve dynamic gemstone routes for sitemap:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...gemstoneRoutes];
}

