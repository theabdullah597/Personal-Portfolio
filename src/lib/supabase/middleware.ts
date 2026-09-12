import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isRequestAdminAuthenticated } from "@/lib/auth-session";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/admin/login");
  const isAdminPage = pathname.startsWith("/admin");

  // If not accessing an admin route, continue immediately
  if (!isAdminPage) {
    return supabaseResponse;
  }

  // 1. Check cryptographic admin session
  const adminSession = await isRequestAdminAuthenticated(request);
  let isUserAuthenticated = adminSession.authenticated;

  // 2. If not already verified and Supabase is configured, check Supabase Auth
  if (!isUserAuthenticated && supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("placeholder-project")) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        isUserAuthenticated = true;
      }
    } catch {
      // Supabase verification error
    }
  }

  // STRICT ACCESS CONTROL:
  // If attempting to access any /admin page (including /admin/skills, /admin/projects, etc.) without valid authentication
  if (!isAuthPage && !isUserAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    
    const response = NextResponse.redirect(loginUrl);
    // Explicitly delete any stale/legacy demo cookie
    response.cookies.delete("demo_admin_session");
    return response;
  }

  // If already authenticated and visiting the login page, redirect to dashboard
  if (isAuthPage && isUserAuthenticated) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/admin";
    dashboardUrl.searchParams.delete("redirectTo");
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}
