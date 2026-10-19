import type { MetadataRoute } from "next";
import { getGemstones } from "@/actions/gems";
import { CATEGORIES_CONFIG } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://isurugems.com";
  // Base release timestamp to avoid spurious lastmod changes on static content
  const staticLastMod = new Date("2026-10-15T00:00:00.000Z");

  // 1. Core static marketing and institutional pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: staticLastMod,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gems`,
      lastModified: staticLastMod,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticLastMod,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/certificates`,
      lastModified: staticLastMod,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: staticLastMod,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticLastMod,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. Curated gemstone category routes
  const categoryKeys = Object.keys(CATEGORIES_CONFIG);
  const categoryRoutes: MetadataRoute.Sitemap = categoryKeys.map((catKey) => ({
    url: `${baseUrl}/gems/category/${catKey}`,
    lastModified: staticLastMod,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 3. Dynamic individual gemstone specimen routes (fetch up to 5000 gems)
  let gemstoneRoutes: MetadataRoute.Sitemap = [];
  try {
    const { gems } = await getGemstones({ limit: 5000 });
    gemstoneRoutes = gems.map((gem) => ({
      url: `${baseUrl}/gems/${gem.slug}`,
      lastModified: staticLastMod,
      changeFrequency: "weekly",
      priority: 0.9,
    }));
  } catch (err) {
    console.warn("Could not retrieve dynamic gemstone routes for sitemap:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...gemstoneRoutes];
}
