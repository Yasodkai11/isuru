import type { MetadataRoute } from "next";
import { getGemstones } from "@/actions/gems";
import { CATEGORIES_CONFIG } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://isurugems.com";
  const now = new Date();

  // 1. Core static marketing and institutional pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gems`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/certificates`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. Curated gemstone category routes
  const categoryKeys = Object.keys(CATEGORIES_CONFIG);
  const categoryRoutes: MetadataRoute.Sitemap = categoryKeys.map((catKey) => ({
    url: `${baseUrl}/gems/category/${catKey}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 3. Dynamic individual gemstone specimen routes
  let gemstoneRoutes: MetadataRoute.Sitemap = [];
  try {
    const { gems } = await getGemstones({ limit: 100 });
    gemstoneRoutes = gems.map((gem) => ({
      url: `${baseUrl}/gems/${gem.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    }));
  } catch (err) {
    console.warn("Could not retrieve dynamic gemstone routes for sitemap:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...gemstoneRoutes];
}
