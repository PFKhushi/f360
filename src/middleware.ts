import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest){

  const path = request.nextUrl.pathname

  const isStaticFile = /\.(png|jpg|jpeg|gif|svg|webp|ico|txt|xml|ttf)$/.test(path);
  if (isStaticFile) {
    return NextResponse.next();
  }

  return NextResponse.next()
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ]
}