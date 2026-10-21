import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyIsAdmin } from "@/actions/auth";

const ALLOWED_PROD_HOSTS = new Set(["isuruceylon.com", "www.isuruceylon.com"]);

function getSafeRedirectBase(request: Request, origin: string): string {
  const isLocalEnv = process.env.NODE_ENV === "development";
  if (isLocalEnv) {
    return origin;
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.toLowerCase()?.trim();
  if (forwardedHost && ALLOWED_PROD_HOSTS.has(forwardedHost)) {
    return `https://${forwardedHost}`;
  }

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredSiteUrl && (configuredSiteUrl.startsWith("https://") || configuredSiteUrl.startsWith("http://"))) {
    return configuredSiteUrl.replace(/\/+$/, "");
  }

  // Fallback to canonical production domain
  return "https://isuruceylon.com";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const redirectBase = getSafeRedirectBase(request, origin);

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

      // STRICT ROLE VERIFICATION:
      // If user attempted to access /admin but is not an authorized administrator,
      // block them and redirect to login with a specific error notice.
      if (target.startsWith("/admin") && !isAdmin) {
        return NextResponse.redirect(
          `${redirectBase}/login?error=admin_unauthorized&role=admin&email=${encodeURIComponent(data.user.email || "")}`
        );
      }

      // If an authorized admin signs in without an explicit target, direct to /admin
      if (isAdmin && !next) {
        target = "/admin";
      }

      return NextResponse.redirect(`${redirectBase}${target}`);
    }
  }

  // If code exchange failed or no code provided, redirect to login with query param
  return NextResponse.redirect(`${redirectBase}/login?error=oauth_exchange_failed`);
}
