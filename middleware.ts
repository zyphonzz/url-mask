import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Let all requests pass through to our catch-all route
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
