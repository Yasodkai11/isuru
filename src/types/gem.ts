export interface GemImage {
  url: string;
  alt: string;
}

export interface GemCertificate {
  lab: string;
  number: string;
  pdfUrl?: string;
}

export interface Gemstone {
  id: string;
  slug: string;
  name: string;
  variety: string;
  carat: number;
  origin: string;
  cut: string;
  dimensions: string;
  color: string;
  treatment: string;
  clarity: string;
  price: number;
  currency: "USD" | "LKR";
  inStock: boolean;
  certificate: GemCertificate;
  images: GemImage[];
  featured?: boolean;
  description: string;
}

export interface GemFilterOptions {
  variety?: string;
  minCarat?: number;
  maxCarat?: number;
  origin?: string;
  treatment?: string;
  maxPrice?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "carat-desc";
}
