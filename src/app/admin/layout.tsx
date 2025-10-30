/**
 * Admin Layout
 * =============================================================================
 * Main layout for admin dashboard pages
 * Includes navigation sidebar and header
 *
 * Last Updated: 2025-10-30
 * Phase: 4 - Admin Dashboard
 * =============================================================================
 */

import { ReactNode } from 'react';
import { getAdminSession } from '@/lib/auth/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogoutButton } from './LogoutButton';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Get admin session
  const session = await getAdminSession();

  // If on login or callback pages, render without layout
  // (These pages have their own layout)
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    if (pathname.includes('/login') || pathname.includes('/callback')) {
      return <>{children}</>;
    }
  }

  // If no session and not on login/callback, this is handled by middleware
  // but we double-check here
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-emerald-500">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-xl font-bold text-white">Admin</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <NavLink href="/admin/dashboard" icon="dashboard">
              Dashboard
            </NavLink>
            <NavLink href="/admin/appointments" icon="calendar">
              Appointments
            </NavLink>
            <NavLink href="/admin/settings" icon="settings">
              Settings
            </NavLink>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-700 font-semibold text-sm">
                  {session.user.email.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{session.user.email}</p>
                <p className="text-xs text-gray-500 capitalize">{session.user.role}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
          <h1 className="text-2xl font-semibold text-gray-900">SetAppointmentApp Admin</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

/**
 * Navigation Link Component
 */
function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: 'dashboard' | 'calendar' | 'settings';
  children: ReactNode;
}) {
  // Note: In a real implementation, you'd use usePathname() from next/navigation
  // to check if the link is active. For now, we'll keep it simple.

  const icons = {
    dashboard: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    ),
    calendar: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
    settings: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
    ),
  };

  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
    >
      <svg
        className="w-5 h-5 text-gray-400 group-hover:text-emerald-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {icons[icon]}
      </svg>
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
}
