export type ClassValue = string | number | boolean | undefined | null | { [key: string]: unknown } | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}

/**
 * Format currency in USD or LKR
 */
export function formatCurrency(amount: number, currency: "USD" | "LKR" = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format gemstone weight in carats
 */
export function formatCarats(weight: number): string {
  return `${weight.toFixed(2)} cts`;
}

/**
 * A price of 0 means the stone is listed without a public price (enquiry only).
 */
export function isPriceOnRequest(price: number): boolean {
  return !(price > 0);
}

export function formatGemPrice(price: number, currency: "USD" | "LKR" = "USD"): string {
  return isPriceOnRequest(price) ? "Price on request" : formatCurrency(price, currency);
}

export function formatGemCarats(weight: number): string {
  return weight > 0 ? formatCarats(weight) : "Weight on request";
}

/**
 * Convert string to URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
