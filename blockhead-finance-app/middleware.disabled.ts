// middleware.ts (Edge-safe)
//comment out this file as it throws errors in productions
/* 
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Protect only the /create route. Add more paths to the matcher if needed.
export const config = {
  matcher: ["/create"],
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const pathname = url.pathname

  // Supabase Auth sets these cookies on the domain.
  const hasAccess = Boolean(req.cookies.get("sb-access-token")?.value)
  const hasRefresh = Boolean(req.cookies.get("sb-refresh-token")?.value)

  // If user isn't logged in, redirect to /login?next=<original>
  if (!hasAccess && !hasRefresh) {
    const loginUrl = url.clone()
    loginUrl.pathname = "/login"
    // preserve where the user wanted to go
    loginUrl.searchParams.set("next", pathname + (url.search || ""))
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated—proceed
  return NextResponse.next()
}
*/
// Middleware disabled in production.
// Keeping this file so TypeScript isolatedModules is happy.
export {}
