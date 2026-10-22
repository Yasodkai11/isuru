import { SEO_CONFIG } from "@/lib/seo-config";

export const SITE_URL = SEO_CONFIG.site.url;

/**
 * Returns alternate language mappings only if multiple localized translations exist.
 * For English-only production deployments, returning undefined prevents Google Search Console
 * "Return tag without alternate" or self-referential hreflang warnings.
 */
export function getHrefLangAlternates(_pathOrUrl: string = "/"): Record<string, string> | undefined {
  // English-only site deployment: hreflang tags omitted per international SEO specifications.
  return undefined;
}

/**
 * Generates the clean alternates metadata object (canonical URL) for Next.js metadata.
 */
export function getPageAlternates(pathOrUrl: string = "/") {
  const isAbsolute = pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://");
  const canonicalUrl = isAbsolute
    ? pathOrUrl
    : `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;

  return {
    canonical: canonicalUrl,
  };
}
