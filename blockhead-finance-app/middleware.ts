// Edge-safe Supabase middleware: refresh session & gate /create

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// ✅ Restrict to only the paths that need auth checks to minimize edge work.
// Add more paths (e.g., "/dashboard", "/settings") as needed.
export const config = {
  matcher: ["/create"],
}

// ✅ Always edge for middleware
export const runtime = "edge"

export async function middleware(req: NextRequest) {
  // Use a mutable response so the helper can set refreshed cookies if needed.
  const res = NextResponse.next()

  // Create an edge-safe Supabase client bound to request/response cookies.
  const supabase = createMiddlewareClient({ req, res })

  // 1) Refresh session if it’s expired (non-blocking beyond the awaited call).
  //    This ensures RSC/APIs see fresh auth state after this middleware runs.
  await supabase.auth.getSession()

  // 2) Protect /create: redirect unauthenticated users to /login
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("next", req.nextUrl.pathname + (req.nextUrl.search || ""))
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated → continue
  return res
}
