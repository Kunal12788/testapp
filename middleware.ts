import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const protectedPaths = ['/first-admin', '/second-admin', '/third-admin', '/fourth-admin', '/main-admin', '/customer'];

export async function middleware(request: NextRequest) {
  if (!protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p))) return NextResponse.next();

  const token = request.cookies.get('session')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', request.url));

  const session = await verifyToken(token).catch(() => null);
  if (!session) return NextResponse.redirect(new URL('/login', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/first-admin/:path*', '/second-admin/:path*', '/third-admin/:path*', '/fourth-admin/:path*', '/main-admin/:path*', '/customer/:path*']
};
