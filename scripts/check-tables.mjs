import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  const { data: gemCols, error: err1 } = await supabase.from("gemstones").select("*").limit(0);
  console.log("gemstones:", err1 ? err1.message : "OK");

  const { data: ordCols, error: err2 } = await supabase.from("orders").select("*").limit(0);
  console.log("orders:", err2 ? err2.message : "OK");

  const { data: inqCols, error: err3 } = await supabase.from("inquiries").select("*").limit(0);
  console.log("inquiries:", err3 ? err3.message : "OK");
}

check();
