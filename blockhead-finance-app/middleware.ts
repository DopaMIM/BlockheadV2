// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// ✅ Force Node runtime so you don't have to deal with Edge locally
export const runtime = "nodejs";

// (optional) limit where middleware runs (skip static assets)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Supabase client bound to cookies for auth session refresh
  const supabase = createMiddlewareClient({ req, res });

  // Keep the session fresh for server components / RLS
  await supabase.auth.getSession();

  return res;
}
