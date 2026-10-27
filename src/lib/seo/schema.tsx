import React from "react";
import { Gemstone } from "@/types/gem";
import { SEO_CONFIG } from "@/lib/seo-config";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://isuruceylon.com";

/**
 * Schema.org Organization, JewelryStore & LocalBusiness structured data.
 * Rendered server-side for Google Knowledge Graph, Local SEO, and AI engine grounding.
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["JewelryStore", "LocalBusiness", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: SEO_CONFIG.brand.name,
    alternateName: SEO_CONFIG.brand.alternateNames,
    legalName: "Isuru Ceylon (Pvt) Ltd",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: `${SITE_URL}/isuru_images/logo-isuru.webp`,
      caption: `${SEO_CONFIG.brand.name} Official Seal`,
    },
    image: [
      `${SITE_URL}/isuru_images/blue1.webp`,
      `${SITE_URL}/isuru_images/contactus.webp`,
      `${SITE_URL}/isuru_images/categories1.webp`,
    ],
    description: SEO_CONFIG.brand.entityStatement,
    foundingDate: `${SEO_CONFIG.brand.foundingYear}`,
    telephone: SEO_CONFIG.contact.phone,
    email: SEO_CONFIG.contact.email,
    currenciesAccepted: "USD, LKR, EUR, GBP, AUD, SGD",
    paymentAccepted: "Bank Wire Transfer, Escrow, Visa, MasterCard, Amex",
    priceRange: "$$$$",
    identifier: {
      "@type": "PropertyValue",
      name: "NGJA Dealer Registration Number",
      value: SEO_CONFIG.brand.licenseNumber,
    },
    taxID: SEO_CONFIG.brand.licenseNumber,
    address: {
      "@type": "PostalAddress",
      streetAddress: SEO_CONFIG.locations.ratnapura.address.streetAddress,
      addressLocality: SEO_CONFIG.locations.ratnapura.address.addressLocality,
      addressRegion: SEO_CONFIG.locations.ratnapura.address.addressRegion,
      postalCode: SEO_CONFIG.locations.ratnapura.address.postalCode,
      addressCountry: SEO_CONFIG.locations.ratnapura.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SEO_CONFIG.locations.ratnapura.geo.latitude,
      longitude: SEO_CONFIG.locations.ratnapura.geo.longitude,
    },
    hasMap: SEO_CONFIG.locations.ratnapura.hasMap,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Worldwide",
    },
    knowsAbout: SEO_CONFIG.knowsAbout,
    sameAs: SEO_CONFIG.sameAs,
    founder: SEO_CONFIG.founders.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: f.role,
      description: f.description,
    })),
    department: [
      {
        "@type": "LocalBusiness",
        name: SEO_CONFIG.locations.ratnapura.name,
        description: SEO_CONFIG.locations.ratnapura.hubType,
        telephone: SEO_CONFIG.locations.ratnapura.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: SEO_CONFIG.locations.ratnapura.address.streetAddress,
          addressLocality: SEO_CONFIG.locations.ratnapura.address.addressLocality,
          addressRegion: SEO_CONFIG.locations.ratnapura.address.addressRegion,
          postalCode: SEO_CONFIG.locations.ratnapura.address.postalCode,
          addressCountry: SEO_CONFIG.locations.ratnapura.address.addressCountry,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SEO_CONFIG.locations.ratnapura.geo.latitude,
          longitude: SEO_CONFIG.locations.ratnapura.geo.longitude,
        },
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SEO_CONFIG.contact.phone,
        contactType: "customer service",
        availableLanguage: ["English", "Sinhala"],
        areaServed: "Worldwide",
      },
      {
        "@type": "ContactPoint",
        telephone: SEO_CONFIG.contact.whatsapp,
        contactType: "sales concierge",
        availableLanguage: ["English", "Sinhala"],
        areaServed: "Worldwide",
      },
    ],
  };
}

/**
 * Dedicated LocalBusiness Schema for individual location pages (/locations/ratnapura)
 */
export function getLocalBusinessSchema(locationKey: "ratnapura" | string = "ratnapura") {
  const loc = (SEO_CONFIG.locations as Record<string, any>)[locationKey] || SEO_CONFIG.locations.ratnapura;
  return {
    "@context": "https://schema.org",
    "@type": ["JewelryStore", "LocalBusiness"],
    "@id": `${SITE_URL}/locations/${locationKey}#localbusiness`,
    name: loc.name,
    parentOrganization: {
      "@id": `${SITE_URL}/#organization`,
    },
    url: `${SITE_URL}/locations/${locationKey}`,
    telephone: loc.phone,
    email: SEO_CONFIG.contact.email,
    description: `${loc.name} — ${loc.hubType}. Official bureau of Isuru Ceylon Gems.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.address.streetAddress,
      addressLocality: loc.address.addressLocality,
      addressRegion: loc.address.addressRegion,
      postalCode: loc.address.postalCode,
      addressCountry: loc.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: loc.geo.latitude,
      longitude: loc.geo.longitude,
    },
    hasMap: loc.hasMap,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "$$$$",
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
    name: SEO_CONFIG.brand.name,
    alternateName: SEO_CONFIG.brand.alternateNames,
    description: SEO_CONFIG.site.defaultDescription || SEO_CONFIG.brand.entityStatement,
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
 * Schema.org Person Schema for Founders & Gemologists
 */
export function getPersonSchema(personKey: "reginald" | "premaratne" | "isuru") {
  const map = {
    reginald: SEO_CONFIG.founders[0],
    premaratne: SEO_CONFIG.founders[1],
    isuru: SEO_CONFIG.founders[2],
  };
  const person = map[personKey];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    description: person.description,
    worksFor: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

/**
 * Schema.org Product structured data for a Gemstone specimen
 */
export function getProductSchema(gem: Gemstone) {
  const images =
    gem.images && gem.images.length > 0
      ? gem.images.map((img) =>
          img.url.startsWith("http") ? img.url : `${SITE_URL}${img.url}`
        )
      : [`${SITE_URL}/isuru_images/blue1.webp`];

  const supportedCountries = [
    "US", "GB", "CH", "AE", "AU", "SG", "LK", "FR", "DE", "JP", "HK", "CA", "IT"
  ];

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const priceValidUntil = nextYear.toISOString().split("T")[0];

  const isEnquiry = !gem.price || gem.price <= 0;

  const offers = isEnquiry
    ? {
        "@type": "Offer",
        "@id": `${SITE_URL}/gems/${gem.slug}#offer`,
        url: `${SITE_URL}/gems/${gem.slug}`,
        priceCurrency: "USD",
        price: "0",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
          description: "Price upon private concierge enquiry and viewing request",
        },
        itemCondition: "https://schema.org/NewCondition",
        availability: gem.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@id": `${SITE_URL}/#organization`,
        },
      }
    : {
        "@type": "Offer",
        "@id": `${SITE_URL}/gems/${gem.slug}#offer`,
        url: `${SITE_URL}/gems/${gem.slug}`,
        priceCurrency: gem.currency || "USD",
        price: gem.price,
        priceValidUntil,
        itemCondition: "https://schema.org/NewCondition",
        availability: gem.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@id": `${SITE_URL}/#organization`,
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

  const additionalProperty = [
    gem.variety && {
      "@type": "PropertyValue",
      name: "Mineral Variety",
      value: gem.variety,
    },
    gem.carat > 0 && {
      "@type": "PropertyValue",
      name: "Carat Weight",
      value: `${gem.carat} carats`,
    },
    gem.origin && {
      "@type": "PropertyValue",
      name: "Origin / Locality",
      value: gem.origin,
    },
    gem.cut && {
      "@type": "PropertyValue",
      name: "Cut & Shape",
      value: gem.cut,
    },
    gem.dimensions && {
      "@type": "PropertyValue",
      name: "Dimensions",
      value: gem.dimensions,
    },
    gem.color && {
      "@type": "PropertyValue",
      name: "Color / Saturation",
      value: gem.color,
    },
    gem.clarity && {
      "@type": "PropertyValue",
      name: "Clarity Grade",
      value: gem.clarity,
    },
    gem.treatment && {
      "@type": "PropertyValue",
      name: "Thermal Enhancement",
      value: gem.treatment,
    },
    gem.certificate?.lab && {
      "@type": "PropertyValue",
      name: "Authentication Lab",
      value: gem.certificate.lab,
    },
    gem.certificate?.number && {
      "@type": "PropertyValue",
      name: "Authentication Report Number",
      value: gem.certificate.number,
    },
  ].filter(Boolean);

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
      name: SEO_CONFIG.brand.name,
    },
    category: gem.variety,
    countryOfOrigin: {
      "@type": "Country",
      name: "Sri Lanka",
    },
    offers,
    additionalProperty,
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
 * Schema.org FAQPage structured data for AEO & Google Rich Results
 */
export function getFAQPageSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Schema.org AboutPage structured data
 */
export function getAboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#aboutpage`,
    url: `${SITE_URL}/about`,
    name: `About ${SEO_CONFIG.brand.name} · Generational Ceylon Gemstone Heritage`,
    description: SEO_CONFIG.brand.entityStatement,
    mainEntity: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

/**
 * Schema.org ContactPage structured data
 */
export function getContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#contactpage`,
    url: `${SITE_URL}/contact`,
    name: `Contact Concierge · ${SEO_CONFIG.brand.name}`,
    description: `Connect with the gemological concierge at ${SEO_CONFIG.brand.name} in Ratnapura for private viewings and bespoke commissions.`,
    mainEntity: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

/**
 * Schema.org Article structured data for Evergreen Gemological Guides
 */
export function getArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = "Uththiya Isuru Dewa Mendis",
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
}) {
  const pageUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`
    : `${SITE_URL}/isuru_images/blue1.webp`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: title,
    description,
    url: pageUrl,
    image: [imageUrl],
    datePublished,
    dateModified,
    inLanguage: "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    author: {
      "@type": "Person",
      name: authorName,
      jobTitle: "Registered Gem Dealer & Gemologist",
      worksFor: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
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
 * Helper component to safely render JSON-LD script tag in server or client components.
 * SEC-07: HTML characters (<, >, &) are escaped to unicode equivalents to prevent
 * stored XSS breakouts from user-entered or database strings.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  const jsonString = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: jsonString,
      }}
    />
  );
}
