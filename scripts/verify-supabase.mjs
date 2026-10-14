import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Load .env.local
try {
  const envContent = fs.readFileSync(".env.local", "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > -1) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        process.env[k] = v;
      }
    }
  }
} catch (e) {
  console.warn("Could not read .env.local:", e.message);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing supabase credentials");
  process.exit(1);
}

const supabase = createClient(url, key);

async function check() {
  const { data: gems, count: gemCount, error: gemError } = await supabase
    .from("gemstones")
    .select("name, variety, price, carat, in_stock, featured", { count: "exact" });

  if (gemError) {
    console.error("Error fetching gems:", gemError.message);
    return;
  }

  const totalPrice = gems.reduce((acc, g) => acc + Number(g.price), 0);
  const totalCarats = gems.reduce((acc, g) => acc + Number(g.carat), 0);
  const inStockCount = gems.filter((g) => g.in_stock).length;
  const featuredCount = gems.filter((g) => g.featured).length;

  console.log("=== SUPABASE DATABASE LIVE STATUS ===");
  console.log(`Gemstones Count: ${gemCount}`);
  console.log(`Total Vault Valuation: $${totalPrice.toLocaleString()} USD`);
  console.log(`Total Vault Weight: ${totalCarats.toFixed(2)} Carats`);
  console.log(`In-Stock Specimens: ${inStockCount}`);
  console.log(`Featured Showcase Specimens: ${featuredCount}`);

  const { data: orders, count: orderCount } = await supabase
    .from("orders")
    .select("id, customer_name, total_amount, status", { count: "exact" });
  console.log(`\nOrders Count: ${orderCount}`);
  orders?.forEach((o) => console.log(`  - [${o.id}] ${o.customer_name}: $${Number(o.total_amount).toLocaleString()} (${o.status})`));

  const { data: inquiries, count: inqCount } = await supabase
    .from("inquiries")
    .select("id, full_name, gem_name, country, status", { count: "exact" });
  console.log(`\nInquiries Count: ${inqCount}`);
  inquiries?.forEach((i) => console.log(`  - ${i.full_name} (${i.country}): "${i.gem_name || "General"}" [${i.status}]`));
}

check();
