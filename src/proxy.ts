import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh auth tokens if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protect patron account route
  if (!user && pathname.startsWith("/account")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // SEC-03: Protect admin routes with strict role verification at edge proxy
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const userRole = (user.app_metadata?.role as string) || (user.user_metadata?.role as string);
    const staffRoles = [
      "super_admin",
      "vault_custodian",
      "gemologist",
      "concierge_agent",
      "inventory_clerk",
      "admin",
    ];
    let isStaff = Boolean(userRole && staffRoles.includes(userRole));

    // If role is not yet in JWT metadata, query staff_members via user ID
    if (!isStaff && user.id) {
      try {
        const { data: staffRecord } = await supabase
          .from("staff_members")
          .select("role, status")
          .eq("auth_user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (staffRecord && staffRoles.includes(staffRecord.role)) {
          isStaff = true;
        }
      } catch {
        // Database query failed - fail closed
      }
    }

    // In local development offline mode, allow configured dev admin emails
    if (!isStaff && process.env.NODE_ENV === "development") {
      const email = user.email?.toLowerCase();
      if (email && ["isuru@isurugems.com", "uththiyaisurudewamendis@gmail.com"].includes(email)) {
        isStaff = true;
      }
    }

    if (!isStaff) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "admin_clearance_required");
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset patterns (svg, png, jpg, jpeg, gif, webp, mp4)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};