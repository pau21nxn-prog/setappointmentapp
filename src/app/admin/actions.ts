/**
 * Admin Server Actions
 * =============================================================================
 * Server-side actions for admin operations
 * These actions run on the server and can be called from client components
 *
 * Last Updated: 2025-10-30
 * Phase: 4 - Admin Dashboard
 * =============================================================================
 */

'use server';

import { signOutAdmin } from '@/lib/auth/admin';
import { redirect } from 'next/navigation';

/**
 * Logout Action
 * Logs out the current admin user and redirects to login page
 */
export async function logoutAction() {
  const result = await signOutAdmin();

  if (result.success) {
    redirect('/admin/login');
  }

  return result;
}
