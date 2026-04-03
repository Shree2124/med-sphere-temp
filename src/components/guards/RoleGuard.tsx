'use client';

import { useAuthStore } from '@/stores/authStore';
import { Role } from '@/generated/prisma/client';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: Role[];
  permissions?: string[]; // Optional if we want to guard by specific permissions
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
}: RoleGuardProps) {
  const { user, role } = useAuthStore();

  if (!user || !role) {
    return fallback;
  }

  if (allowedRoles && !allowedRoles.includes(role as Role)) {
    return fallback;
  }

  return <>{children}</>;
}
