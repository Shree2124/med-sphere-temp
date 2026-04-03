'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/components/ui';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  BedDouble,
  AlertTriangle,
  ClipboardList,
  Stethoscope,
  Heart,
  Scissors,
  TestTube,
  Scan,
  Droplets,
  Pill,
  Package,
  Truck,
  Building2,
  Receipt,
  Shield,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Menu,
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/dashboard/analytics', icon: Activity, label: 'Analytics' },
    ],
  },
  {
    label: 'Patient Admin',
    items: [
      { href: '/dashboard/patients', icon: Users, label: 'Patients' },
      {
        href: '/dashboard/appointments',
        icon: Calendar,
        label: 'Appointments',
      },
      { href: '/dashboard/ipd', icon: BedDouble, label: 'IPD Management' },
      { href: '/dashboard/emergency', icon: AlertTriangle, label: 'Emergency' },
    ],
  },
  {
    label: 'Clinical',
    items: [
      { href: '/dashboard/emr', icon: ClipboardList, label: 'EMR / EHR' },
      { href: '/dashboard/nursing', icon: Heart, label: 'Nurse Module' },
      { href: '/dashboard/doctors', icon: Stethoscope, label: 'Doctor Module' },
      { href: '/dashboard/ot', icon: Scissors, label: 'OT Management' },
    ],
  },
  {
    label: 'Diagnostics',
    items: [
      { href: '/dashboard/lab', icon: TestTube, label: 'Laboratory' },
      { href: '/dashboard/radiology', icon: Scan, label: 'Radiology' },
      { href: '/dashboard/blood-bank', icon: Droplets, label: 'Blood Bank' },
    ],
  },
  {
    label: 'Pharmacy & Ops',
    items: [
      { href: '/dashboard/pharmacy', icon: Pill, label: 'Pharmacy' },
      { href: '/dashboard/inventory', icon: Package, label: 'Inventory' },
      { href: '/dashboard/ambulance', icon: Truck, label: 'Ambulance' },
      { href: '/dashboard/facility', icon: Building2, label: 'Facility' },
    ],
  },
  {
    label: 'Finance & Admin',
    items: [
      { href: '/dashboard/billing', icon: Receipt, label: 'Billing' },
      { href: '/dashboard/insurance', icon: Shield, label: 'Insurance' },
      { href: '/dashboard/users', icon: UserCog, label: 'User Mgmt' },
      { href: '/dashboard/alerts', icon: Bell, label: 'Alerts' },
      { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-brand-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
          M
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-tight">
              MedSphere
            </h1>
            <p className="text-teal-300/70 text-[10px] uppercase tracking-widest">
              HIMS
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-widest text-teal-300/50 font-semibold px-3 mb-1.5">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-teal-100/70 hover:bg-white/8 hover:text-white'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon
                      size={18}
                      className={active ? 'text-brand-300' : ''}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle - desktop only */}
      <div className="hidden lg:block p-3 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 text-teal-300/70 hover:text-white text-xs transition-colors rounded-lg hover:bg-white/8 cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} /> <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-brand-900 text-white rounded-xl shadow-lg cursor-pointer"
        id="mobile-menu-toggle"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'sidebar-gradient fixed lg:sticky top-0 left-0 z-40 h-screen transition-all duration-300',
          collapsed ? 'lg:w-[72px]' : 'lg:w-64',
          mobileOpen
            ? 'w-64 translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
