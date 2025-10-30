/**
 * Admin Auth Callback Page
 * =============================================================================
 * Handles the redirect after clicking magic link
 * Exchanges auth code for session and redirects to dashboard
 *
 * Last Updated: 2025-10-30
 * Phase: 4 - Admin Dashboard
 * =============================================================================
 */

import { createAdminClient } from '@/lib/auth/admin';
import { redirect } from 'next/navigation';

export default async function AdminAuthCallbackPage() {
  const supabase = createAdminClient();

  // Exchange auth code for session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    // Auth failed, redirect back to login
    redirect('/admin/login?error=invalid_token');
  }

  // Auth successful, redirect to dashboard
  redirect('/admin/dashboard');
}
