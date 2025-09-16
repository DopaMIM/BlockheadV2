// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Keep this file MINIMAL: only next/server and auth-helpers.
// Do NOT import anything that touches 'fs', 'path', 'url', 'stream' or 'next' (root).

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Edge-compatible Supabase client bound to cookies
  const supabase = createMiddlewareClient({ req, res });

  // This will refresh the session cookie if needed (Edge-safe)
  await supabase.auth.getUser(); // ← use getUser() instead of getSession()

  return res;
}

// (Optional) Narrow where middleware runs (avoid static assets)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
