import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/admin/login";

function redirectToLogin(
  response: NextResponse,
  request: NextRequest,
  reason?: string,
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = "";
  if (reason) url.searchParams.set("error", reason);

  const redirect = NextResponse.redirect(url);
  for (const cookie of response.cookies.getAll()) {
    redirect.cookies.set(cookie.name, cookie.value, {
      path: cookie.path,
      domain: cookie.domain,
      expires: cookie.expires,
      maxAge: cookie.maxAge,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
    });
  }
  return redirect;
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return redirectToLogin(NextResponse.next({ request }), request, "auth_not_configured");
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data, error: userError } = await supabase.auth.getUser();
  const user = data.user;

  if (userError) {
    console.error("Admin auth check failed:", userError.message);
    return redirectToLogin(supabaseResponse, request, "auth_check_failed");
  }

  if (!user?.email) {
    return redirectToLogin(supabaseResponse, request);
  }

  const email = user.email.toLowerCase();
  const { data: adminRow, error: adminError } = await supabase
    .from("admin_users")
    .select("email")
    .ilike("email", email)
    .maybeSingle();

  if (adminError) {
    console.error("Admin allowlist lookup failed:", adminError.message);
    await supabase.auth.signOut();
    return redirectToLogin(supabaseResponse, request, "admin_check_failed");
  }

  if (!adminRow) {
    await supabase.auth.signOut();
    return redirectToLogin(supabaseResponse, request, "not_authorized");
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
