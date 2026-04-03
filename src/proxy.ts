import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { can, Permission } from '@/lib/rbac';
import { Role } from '@/generated/prisma/client';

// Map routes to the permissions required to access them
const ROUTE_PERMISSIONS: Record<string, Permission> = {
  '/dashboard/users': 'manage_users',
  '/dashboard/patients': 'view_patients',
  '/dashboard/appointments': 'view_appointments',
  '/dashboard/billing': 'view_billing',
  '/dashboard/inventory': 'view_inventory',
  '/dashboard/reports': 'view_reports',
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasToken = Boolean(req.cookies.get('token')?.value);

  // Skip proxy for well-known or internal devtool paths
  if (pathname.includes('/.well-known/')) {
    return NextResponse.next();
  }

  console.log('[AUTH_DEBUG][proxy] Request incoming:', pathname, { hasToken });

  // Handle the login page separately
  if (pathname.startsWith('/login')) {
    const session = await getSessionFromRequest(req);
    console.log('[AUTH_DEBUG][proxy] Login page session check:', {
      hasSession: Boolean(session),
      role: session?.role,
    });
    
    // If user is already logged in, redirect to dashboard
    if (session) {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      console.log('[AUTH_DEBUG][proxy] Already authenticated, redirecting to /dashboard');
      return NextResponse.redirect(url);
    }
    // Otherwise, allow access to login page
    return NextResponse.next();
  }

  const session = await getSessionFromRequest(req);
  if (!session) {
    console.log('[AUTH_DEBUG][proxy] Protected route access denied (no session), redirecting to /login');
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    // Preserve the original destination for redirect after login
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  console.log('[AUTH_DEBUG][proxy] Protected route access granted for:', session.sub);

  // Find the required permission for the current route
  const requiredPermission = Object.entries(ROUTE_PERMISSIONS).find(([route]) =>
    pathname.startsWith(route)
  )?.[1];

  // If the route requires a permission, check if the user has it
  if (requiredPermission) {
    const userRole = session.role as Role;
    if (!can(userRole, requiredPermission)) {
      console.log('[AUTH_DEBUG][proxy] Permission denied:', { userRole, requiredPermission });
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)'],
};
