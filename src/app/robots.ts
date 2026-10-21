import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://isuruceylon.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
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
          // Crawl budget controls: prevent spiders from traversing combinatorial filter/search query parameter traps
          "/*?*search=*",
          "/*?*sort=*",
          "/*?*minPrice=*",
          "/*?*maxPrice=*",
          "/*?*minCarat=*",
          "/*?*maxCarat=*",
          "/*?*colour=*",
          "/*?*shape=*",
          "/*?*variety=*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

