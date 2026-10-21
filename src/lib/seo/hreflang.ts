export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://isuruceylon.com";

/**
 * Standard international locale alternates for high-jewelry international export.
 * Targets major collectors and atelier markets worldwide.
 */
export const SUPPORTED_LOCALES = [
  "en-US", // United States
  "en-GB", // United Kingdom
  "en-AU", // Australia
  "en-SG", // Singapore
  "en-AE", // United Arab Emirates / Gulf
  "en-LK", // Sri Lanka (Origin)
  "x-default", // Global fallback
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Generates an alternates languages mapping (hreflang) for a given path or absolute URL.
 * Produces clean absolute URLs required by Google and search engine crawlers.
 */
export function getHrefLangAlternates(pathOrUrl: string = "/") {
  const isAbsolute = pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://");
  const fullUrl = isAbsolute
    ? pathOrUrl
    : `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;

  return {
    "en-US": fullUrl,
    "en-GB": fullUrl,
    "en-AU": fullUrl,
    "en-SG": fullUrl,
    "en-AE": fullUrl,
    "en-LK": fullUrl,
    "x-default": fullUrl,
  };
}

/**
 * Generates the complete alternates metadata object (canonical + hreflang languages).
 */
export function getPageAlternates(pathOrUrl: string = "/") {
  const isAbsolute = pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://");
  const canonicalUrl = isAbsolute
    ? pathOrUrl
    : `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;

  return {
    canonical: canonicalUrl,
    languages: getHrefLangAlternates(canonicalUrl),
  };
}
