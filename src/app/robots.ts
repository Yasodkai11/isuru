import type { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SEO_CONFIG.site.url;

  const disallowedPaths = [
    "/admin",
    "/admin/*",
    "/account",
    "/account/*",
    "/checkout",
    "/checkout/*",
    "/cart",
    "/cart/*",
    "/api",
    "/api/*",
    "/auth",
    "/auth/*",
    "/login",
    "/login/*",
    "/register",
    "/register/*",
    // Crawl budget controls: prevent spiders from traversing combinatorial filter parameter traps
    "/*?*search=*",
    "/*?*sort=*",
    "/*?*minPrice=*",
    "/*?*maxPrice=*",
    "/*?*minCarat=*",
    "/*?*maxCarat=*",
    "/*?*colour=*",
    "/*?*shape=*",
    "/*?*variety=*",
  ];

  // Dedicated rules for Generative AI engines & LLM indexers (GEO)
  const aiBotRules = SEO_CONFIG.aiCrawlers.map((botName) => ({
    userAgent: botName,
    allow: [
      "/",
      "/about",
      "/gems",
      "/certificates",
      "/wholesale",
      "/contact",
      "/locations/*",
      "/guides/*",
      "/llms.txt",
      "/llms-full.txt",
    ],
    disallow: disallowedPaths,
  }));

  // Standard global search bot rule
  const defaultRule = {
    userAgent: "*",
    allow: "/",
    disallow: disallowedPaths,
  };

  return {
    rules: [defaultRule, ...aiBotRules],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
