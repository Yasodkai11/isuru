import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://isurugems.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/account",
          "/checkout",
          "/cart",
          "/api",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
