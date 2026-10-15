import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyIsAdmin } from "@/actions/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const isAdmin = await verifyIsAdmin(data.user.email, data.user.id);

      // Validate target is a local relative URL, preventing open redirect
      let target = next;
      if (!target || !target.startsWith("/") || target.startsWith("//") || target.includes("\\")) {
        target = isAdmin ? "/admin" : "/account";
      }
      if (isAdmin && !target.startsWith("/admin") && target === "/account") {
        target = "/admin";
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${target}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${target}`);
      } else {
        return NextResponse.redirect(`${origin}${target}`);
      }
    }
  }

  // If code exchange failed or no code provided, redirect to login with query param
  return NextResponse.redirect(`${origin}/login?error=oauth_exchange_failed`);
}
