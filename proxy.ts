import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/session';

// Define protected and public routes
const protectedRoutes = ['/dashboard', '/profile', '/bloodmap'];
const publicRoutes = ['/auth', '/signup', '/auth/doctor', '/'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Proxy /api requests to backend server
  if (path.startsWith('/api/')) {
    // Assuming backend runs on port 5000; adjust if necessary
    return NextResponse.rewrite(new URL(path, 'http://localhost:5000'));
  }

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/auth', req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.userId &&
    path !== '/' // allow authenticated users to view landing page
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|hero.png|auth.png).*)'],
};
