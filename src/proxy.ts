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

  // Allow login page and public assets
  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  const session = await getSessionFromRequest(req);

  // If no session, redirect to login
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Find the required permission for the current route
  const requiredPermission = Object.entries(ROUTE_PERMISSIONS).find(([route]) =>
    pathname.startsWith(route)
  )?.[1];

  // If the route requires a permission, check if the user has it
  if (requiredPermission) {
    const userRole = session.role as Role;
    if (!can(userRole, requiredPermission)) {
      // If user doesn't have permission, redirect to the main dashboard
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
