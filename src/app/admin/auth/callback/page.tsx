/**
 * Admin Auth Callback Page
 * =============================================================================
 * Handles the redirect after clicking magic link
 * Exchanges auth code for session and redirects to dashboard
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard
 * =============================================================================
 */

import { createAdminClient } from '@/lib/auth/admin';
import { redirect } from 'next/navigation';

interface AdminAuthCallbackPageProps {
  searchParams: {
    code?: string;
    error?: string;
    error_code?: string;
    error_description?: string;
  };
}

export default async function AdminAuthCallbackPage({ searchParams }: AdminAuthCallbackPageProps) {
  console.log('[Admin Auth Callback] Processing authentication callback');
  console.log('[Admin Auth Callback] Search params:', {
    hasCode: !!searchParams.code,
    error: searchParams.error,
    errorCode: searchParams.error_code,
  });

  const supabase = createAdminClient();

  // Check if Supabase returned an error
  if (searchParams.error) {
    console.error('[Admin Auth Callback] Auth error from Supabase:', {
      error: searchParams.error,
      code: searchParams.error_code,
      description: searchParams.error_description,
    });

    // Map Supabase errors to user-friendly error codes
    if (searchParams.error_code === 'otp_expired') {
      redirect('/admin/login?error=otp_expired');
    }
    if (searchParams.error === 'access_denied') {
      redirect('/admin/login?error=access_denied');
    }
    redirect('/admin/login?error=auth_failed');
  }

  // Exchange auth code for session
  const code = searchParams.code;

  if (code) {
    console.log('[Admin Auth Callback] Exchanging code for session');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[Admin Auth Callback] Code exchange error:', error);
      redirect('/admin/login?error=code_exchange_failed');
    }

    if (data.session) {
      console.log('[Admin Auth Callback] Session created successfully');
      console.log('[Admin Auth Callback] User ID:', data.session.user.id);
      console.log('[Admin Auth Callback] User email:', data.session.user.email);
    }
  } else {
    console.warn('[Admin Auth Callback] No auth code found in URL');
  }

  // Verify session was created
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('[Admin Auth Callback] Session verification error:', sessionError);
    redirect('/admin/login?error=session_error');
  }

  if (!session) {
    console.error('[Admin Auth Callback] No session found after authentication');
    redirect('/admin/login?error=no_session');
  }

  console.log('[Admin Auth Callback] Authentication successful, redirecting to dashboard');
  // Auth successful, redirect to dashboard
  redirect('/admin/dashboard');
}
