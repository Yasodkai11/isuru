import fs from "fs";
import { REAL_PRODUCTS, REAL_ORDERS, REAL_INQUIRIES } from "./seed-real-gemstones.mjs";

let sql = `-- ========================================================
-- ISURU GEMS - CEYLON GEMSTONE E-COMMERCE REAL DATA SEED
-- Real inventory, active orders, and client inquiries
-- ========================================================

insert into public.gemstones (
  id, slug, name, variety, carat, origin, cut, dimensions, color, treatment, clarity, price, currency, in_stock, featured, description, certificate_lab, certificate_number, certificate_pdf_url, images
) values
`;

const rows = REAL_PRODUCTS.map((g) => {
  return (
    "(" +
    [
      `'${g.id}'`,
      `'${g.slug.replace(/'/g, "''")}'`,
      `'${g.name.replace(/'/g, "''")}'`,
      `'${g.variety.replace(/'/g, "''")}'`,
      g.carat,
      `'${g.origin.replace(/'/g, "''")}'`,
      `'${g.cut.replace(/'/g, "''")}'`,
      `'${g.dimensions.replace(/'/g, "''")}'`,
      `'${g.color.replace(/'/g, "''")}'`,
      `'${g.treatment.replace(/'/g, "''")}'`,
      `'${g.clarity.replace(/'/g, "''")}'`,
      g.price.toFixed(2),
      `'${g.currency}'`,
      g.in_stock ? "true" : "false",
      g.featured ? "true" : "false",
      `'${g.description.replace(/'/g, "''")}'`,
      `'${g.certificate_lab.replace(/'/g, "''")}'`,
      `'${g.certificate_number.replace(/'/g, "''")}'`,
      g.certificate_pdf_url ? `'${g.certificate_pdf_url}'` : "null",
      `'${JSON.stringify(g.images).replace(/'/g, "''")}'::jsonb`,
    ].join(", ") +
    ")"
  );
}).join(",\n");

sql += rows + `
on conflict (slug) do update set
  name = excluded.name,
  variety = excluded.variety,
  carat = excluded.carat,
  price = excluded.price,
  dimensions = excluded.dimensions,
  color = excluded.color,
  treatment = excluded.treatment,
  clarity = excluded.clarity,
  images = excluded.images,
  in_stock = excluded.in_stock,
  featured = excluded.featured,
  certificate_lab = excluded.certificate_lab,
  certificate_number = excluded.certificate_number;
`;

fs.writeFileSync("supabase/seed.sql", sql);
console.log("Successfully updated supabase/seed.sql with all 41 real gemstones!");
