import type { MetadataRoute } from "next";
import { getSitemapGemstones } from "@/actions/gems";
import { CATEGORIES_CONFIG } from "@/lib/constants";
import { getHrefLangAlternates } from "@/lib/seo/hreflang";

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
      alternates: {
        languages: getHrefLangAlternates(`${baseUrl}/`),
      },
      images: [`${baseUrl}/isuru_images/blue1.webp`],
    },
    {
      url: `${baseUrl}/gems`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
      alternates: {
        languages: getHrefLangAlternates(`${baseUrl}/gems`),
      },
      images: [`${baseUrl}/isuru_images/blue1.webp`],
    },
    {
      url: `${baseUrl}/certificates`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: {
        languages: getHrefLangAlternates(`${baseUrl}/certificates`),
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: getHrefLangAlternates(`${baseUrl}/about`),
      },
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: {
        languages: getHrefLangAlternates(`${baseUrl}/wholesale`),
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: getHrefLangAlternates(`${baseUrl}/contact`),
      },
      images: [`${baseUrl}/isuru_images/contactus.webp`],
    },
  ];

  // 2. Curated gemstone category routes
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
        alternates: {
          languages: getHrefLangAlternates(catUrl),
        },
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
        const gemUrl = `${baseUrl}/gems/${gem.slug}`;
        const images = (gem.images || [])
          .map((img) => (img.url.startsWith("http") ? img.url : `${baseUrl}${img.url}`))
          .filter(Boolean);

        return {
          url: gemUrl,
          lastModified: gem.updated_at ? new Date(gem.updated_at) : (gem.created_at ? new Date(gem.created_at) : now),
          changeFrequency: "weekly" as const,
          priority: 0.9,
          alternates: {
            languages: getHrefLangAlternates(gemUrl),
          },
          ...(images.length > 0 ? { images } : {}),
        };
      });
  } catch (err) {
    console.warn("Could not retrieve dynamic gemstone routes for sitemap:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...gemstoneRoutes];
}

