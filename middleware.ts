import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/dashboard', '/api/products', '/api/allotments', '/api/billing', '/api/gold-collection'];

export function middleware(request: NextRequest) {
  const needsAuth = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));
  if (!needsAuth) return NextResponse.next();

  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
};
