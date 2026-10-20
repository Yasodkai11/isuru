import React from "react";
import { Gemstone } from "@/types/gem";
import { BRAND } from "@/lib/constants";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://isuruceylon.com";

/**
 * Schema.org Organization (and JewelryStore) structured data
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["JewelryStore", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: "Isuru Ceylon",
    alternateName: "Isuru Gems",
    legalName: "Isuru Ceylon (Pvt) Ltd",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: `${SITE_URL}/isuru_images/logo-isuru.webp`,
      caption: "Isuru Ceylon Logo",
    },
    image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85",
    description:
      "Curators of unheated natural Ceylon Royal Blue Sapphires, Padparadschas, and precious island gemstones directly from the historic gravels of Ratnapura, Sri Lanka since 1984.",
    foundingDate: `${BRAND.established}`,
    telephone: BRAND.phone,
    email: BRAND.email,
    currenciesAccepted: "USD, LKR, EUR, GBP, AUD, SGD",
    paymentAccepted: "Bank Wire Transfer, Visa, MasterCard, Amex, Escrow",
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.headquarters,
      addressLocality: "Colombo",
      addressRegion: "Western Province",
      postalCode: "00500",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 7.0338,
      longitude: 79.8994,
    },
    hasMap: BRAND.mapUrl,
    sameAs: [
      "https://www.instagram.com/isurugems",
      "https://www.facebook.com/isurugems",
      "https://www.linkedin.com/company/isuru-gems",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: BRAND.phone,
        contactType: "customer service",
        availableLanguage: ["English", "Sinhala"],
        areaServed: "Worldwide",
      },
      {
        "@type": "ContactPoint",
        telephone: BRAND.whatsapp,
        contactType: "sales concierge",
        availableLanguage: ["English", "Sinhala"],
        areaServed: "Worldwide",
      },
    ],
  };
}

/**
 * Schema.org WebSite structured data with SearchAction
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Isuru Ceylon",
    alternateName: "Isuru Gems",
    description: "Finest Natural Ceylon Sapphires & Precious Island Gemstones direct from Ratnapura.",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/gems?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Schema.org Product structured data for a Gemstone
 */
export function getProductSchema(gem: Gemstone) {
  const images =
    gem.images && gem.images.length > 0
      ? gem.images.map((img) =>
          img.url.startsWith("http") ? img.url : `${SITE_URL}${img.url}`
        )
      : [
          "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85",
        ];

  // International luxury courier supported destination country codes (ISO 3166-1 alpha-2)
  const supportedCountries = [
    "US", "GB", "CH", "AE", "AU", "SG", "LK", "FR", "DE", "JP", "HK", "CA", "IT"
  ];

  const offers = {
    "@type": "Offer",
    "@id": `${SITE_URL}/gems/${gem.slug}#offer`,
    url: `${SITE_URL}/gems/${gem.slug}`,
    priceCurrency: gem.currency || "USD",
    price: gem.price > 0 ? gem.price : 0,
    priceValidUntil: "2027-12-31",
    itemCondition: "https://schema.org/NewCondition",
    availability: gem.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    seller: {
      "@type": "Organization",
      name: "Isuru Ceylon",
      url: SITE_URL,
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "0.00",
        currency: gem.currency || "USD",
      },
      shippingDestination: supportedCountries.map((countryCode) => ({
        "@type": "DefinedRegion",
        addressCountry: countryCode,
      })),
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: 2,
          unitCode: "DAY",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 2,
          maxValue: 5,
          unitCode: "DAY",
        },
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: supportedCountries,
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 14,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
  };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/gems/${gem.slug}#product`,
    name: gem.carat > 0 ? `${gem.name} (${gem.carat} cts)` : gem.name,
    image: images,
    description: gem.description,
    sku: `ISURU-${gem.slug.toUpperCase()}`,
    mpn: gem.certificate?.number || `ISURU-${gem.id}`,
    brand: {
      "@type": "Brand",
      name: "Isuru Ceylon",
    },
    category: gem.variety,
    countryOfOrigin: {
      "@type": "Country",
      name: "Sri Lanka",
    },
    ...(gem.price > 0 ? { offers } : {}),
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Mineral Variety",
        value: gem.variety,
      },
      {
        "@type": "PropertyValue",
        name: "Carat Weight",
        value: `${gem.carat} carats`,
      },
      {
        "@type": "PropertyValue",
        name: "Origin / Locality",
        value: gem.origin,
      },
      {
        "@type": "PropertyValue",
        name: "Cut & Shape",
        value: gem.cut,
      },
      {
        "@type": "PropertyValue",
        name: "Dimensions",
        value: gem.dimensions,
      },
      {
        "@type": "PropertyValue",
        name: "Color / Saturation",
        value: gem.color,
      },
      {
        "@type": "PropertyValue",
        name: "Clarity Grade",
        value: gem.clarity,
      },
      {
        "@type": "PropertyValue",
        name: "Thermal Enhancement",
        value: gem.treatment,
      },
      {
        "@type": "PropertyValue",
        name: "Authentication Lab",
        value: gem.certificate?.lab,
      },
      {
        "@type": "PropertyValue",
        name: "Authentication Report Number",
        value: gem.certificate?.number,
      },
    ],
  };
}

/**
 * Schema.org BreadcrumbList structured data
 */
export function getBreadcrumbListSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Schema.org CollectionPage and ItemList structured data for catalog / category pages
 */
export function getCollectionPageSchema({
  title,
  description,
  url,
  gems,
}: {
  title: string;
  description: string;
  url: string;
  gems?: Gemstone[];
}) {
  const pageUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: title,
    description,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    ...(gems && gems.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: gems.slice(0, 24).map((gem, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${SITE_URL}/gems/${gem.slug}`,
              name: gem.name,
            })),
          },
        }
      : {}),
  };
}

/**
 * Helper component to safely render JSON-LD script tag in server or client components
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
