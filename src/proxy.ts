import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './lib/auth';

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isDashboardRoute = path.startsWith('/dashboard');
  const isLoginRoute = path === '/login';

  const token = req.cookies.get('token')?.value;

  // 1. If trying to access dashboard and no token, redirect to login
  // if (isDashboardRoute && !token) {
  //   return NextResponse.redirect(new URL('/login', req.url));
  // }

  // 2. If trying to access login and have valid token, redirect to dashboard
  // if (isLoginRoute && token) {
  //   try {
  //     await decrypt(token);
  //     return NextResponse.redirect(new URL('/dashboard', req.url));
  //   } catch {
  //     // Invalid token, delete it
  //     const res = NextResponse.next();
  //     res.cookies.delete('token');
  //     return res;
  //   }
  // }

  // 3. Attach payload to headers for protected routes
  // if (isDashboardRoute && token) {
  //   try {
  //     const payload = await decrypt(token);
  //     const requestHeaders = new Headers(req.headers);
  //     requestHeaders.set('x-user-id', payload.sub as string);
  //     requestHeaders.set('x-user-role', payload.role as string);
  //     requestHeaders.set('x-user-name', payload.name as string);

  //     return NextResponse.next({
  //       request: {
  //         headers: requestHeaders,
  //       },
  //     });
  //   } catch {
  //     // Invalid token, redirect to login
  //     const res = NextResponse.redirect(new URL('/login', req.url));
  //     res.cookies.delete('token');
  //     return res;
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/api/dashboard/:path*'],
};
