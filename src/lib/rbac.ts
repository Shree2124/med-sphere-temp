import { Role } from '../generated/prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import { decrypt } from './auth';

export type Permission =
  | 'view_dashboard'
  | 'manage_users'
  | 'view_patients'
  | 'manage_patients'
  | 'view_appointments'
  | 'manage_appointments'
  | 'view_billing'
  | 'manage_billing'
  | 'view_inventory'
  | 'manage_inventory'
  | 'view_reports';

export const PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'view_dashboard',
    'manage_users',
    'view_patients',
    'manage_patients',
    'view_appointments',
    'manage_appointments',
    'view_billing',
    'manage_billing',
    'view_inventory',
    'manage_inventory',
    'view_reports',
  ],
  DOCTOR: [
    'view_dashboard',
    'view_patients',
    'manage_patients',
    'view_appointments',
    'manage_appointments',
    'view_reports',
  ],
  NURSE: [
    'view_dashboard',
    'view_patients',
    'manage_patients',
    'view_appointments',
    'view_reports',
  ],
  RECEPTIONIST: [
    'view_dashboard',
    'view_patients',
    'view_appointments',
    'manage_appointments',
  ],
  PHARMACIST: ['view_dashboard', 'view_inventory', 'manage_inventory'],
  LAB_TECHNICIAN: ['view_dashboard', 'view_reports'],
  RADIOLOGY_TECHNICIAN: ['view_dashboard', 'view_reports'],
  ACCOUNTANT: ['view_dashboard', 'view_billing', 'manage_billing'],
  HR_MANAGER: ['view_dashboard', 'manage_users'],
  PATIENT: ['view_dashboard', 'view_appointments'],
};

export function can(role: Role, permission: Permission): boolean {
  return PERMISSIONS[role]?.includes(permission) ?? false;
}

export function withRole(allowedRoles: Role[]) {
  return (
    handler: (
      req: NextRequest,
      ...args: unknown[]
    ) => Promise<NextResponse> | NextResponse
  ) => {
    return async (req: NextRequest, ...args: unknown[]) => {
      const token = req.cookies.get('token')?.value;
      if (!token) {
        return NextResponse.json(
          { message: 'Unauthenticated' },
          { status: 401 }
        );
      }

      try {
        const payload = await decrypt(token);
        const userRole = payload.role as Role;

        if (!allowedRoles.includes(userRole)) {
          return NextResponse.json(
            { message: 'Forbidden: Insufficient permissions' },
            { status: 403 }
          );
        }

        return handler(req, ...args);
      } catch {
        return NextResponse.json(
          { message: 'Invalid session' },
          { status: 401 }
        );
      }
    };
  };
}
