import { Gemstone, GemImage } from "@/types/gem";

function determineCategory(color: string, variety: string): string {
  const c = (color || "").toLowerCase();
  const v = (variety || "").toLowerCase();
  if (v.includes("parcel") || v.includes("lot") || v.includes("tray") || v.includes("grid")) {
    return "gem-collections";
  }
  if (c.includes("blue")) return "blue-gems";
  if (c.includes("pink") || c.includes("purple") || c.includes("magenta") || c.includes("violet")) {
    return "pink-purple-gems";
  }
  if (c.includes("red") || c.includes("crimson") || c.includes("maroon") || v.includes("ruby") || v.includes("spinel")) {
    return "red-gems";
  }
  if (c.includes("yellow") || c.includes("gold") || c.includes("orange") || c.includes("honey") || v.includes("pushparaga")) {
    return "yellow-gems";
  }
  if (c.includes("green") || c.includes("olive")) return "green-gems";
  return "blue-gems";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbRowToGemstone(row: any): Gemstone {
  const color = row.color || "Ceylon Blue";
  const variety = row.variety || "Ceylon Sapphire";
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    variety,
    category: row.category || determineCategory(color, variety),
    carat: Number(row.carat) || 0,
    origin: row.origin || "Ratnapura, Sri Lanka",
    cut: row.cut || "Oval Mixed Cut",
    dimensions: row.dimensions || "Available on request",
    color,
    treatment: row.treatment || "None / Unheated (100% Natural)",
    clarity: row.clarity || "Eye Clean",
    price: Number(row.price) || 0,
    currency: (row.currency as "USD" | "LKR") || "USD",
    inStock: Boolean(row.in_stock),
    featured: Boolean(row.featured),
    description: row.description || "",
    certificate: {
      lab: row.certificate_lab || "NGJA",
      number: row.certificate_number || "NGJA-CERT",
      pdfUrl: row.certificate_pdf_url || undefined,
    },
    images: Array.isArray(row.images) ? (row.images as unknown as GemImage[]) : [],
  };
}
