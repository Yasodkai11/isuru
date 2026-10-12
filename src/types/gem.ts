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
  category?: string;
}

export interface GemFilterOptions {
  variety?: string;
  colour?: string;
  shape?: string;
  minCarat?: number;
  maxCarat?: number;
  origin?: string;
  treatment?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  search?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "carat-desc" | "carat-asc" | "newest";
  page?: number;
  limit?: number;
}

export interface PaginatedGemsResult {
  gems: Gemstone[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
