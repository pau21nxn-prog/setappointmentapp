/**
 * Admin Auth Callback Route Handler
 * =============================================================================
 * Handles the redirect after clicking magic link
 * Exchanges auth code for session and redirects to dashboard
 *
 * IMPORTANT: This MUST be a Route Handler (not a page) because:
 * - Route Handlers CAN modify cookies
 * - Server Component pages CANNOT modify cookies in Next.js 15+
 * - Session cookies must be set during auth code exchange
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard
 * =============================================================================
 */

import { createAdminClient } from '@/lib/auth/admin';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/auth/callback
 * Handles magic link callback and session creation
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorCode = requestUrl.searchParams.get('error_code');
  const errorDescription = requestUrl.searchParams.get('error_description');

  console.log('[Admin Auth Callback API] Processing authentication callback');
  console.log('[Admin Auth Callback API] Search params:', {
    hasCode: !!code,
    error: error,
    errorCode: errorCode,
  });

  // Check if Supabase returned an error
  if (error) {
    console.error('[Admin Auth Callback API] Auth error from Supabase:', {
      error: error,
      code: errorCode,
      description: errorDescription,
    });

    // Map Supabase errors to user-friendly error codes
    if (errorCode === 'otp_expired') {
      return NextResponse.redirect(new URL('/admin/login?error=otp_expired', request.url));
    }
    if (error === 'access_denied') {
      return NextResponse.redirect(new URL('/admin/login?error=access_denied', request.url));
    }
    return NextResponse.redirect(new URL('/admin/login?error=auth_failed', request.url));
  }

  // Exchange auth code for session
  if (!code) {
    console.warn('[Admin Auth Callback API] No auth code found in URL');
    return NextResponse.redirect(new URL('/admin/login?error=invalid_token', request.url));
  }

  try {
    console.log('[Admin Auth Callback API] Exchanging code for session');

    // Create Supabase client with cookie handling
    const supabase = createAdminClient();

    // Exchange the code for a session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('[Admin Auth Callback API] Code exchange error:', exchangeError);
      return NextResponse.redirect(new URL('/admin/login?error=code_exchange_failed', request.url));
    }

    if (!data.session) {
      console.error('[Admin Auth Callback API] No session returned after code exchange');
      return NextResponse.redirect(new URL('/admin/login?error=no_session', request.url));
    }

    console.log('[Admin Auth Callback API] Session created successfully');
    console.log('[Admin Auth Callback API] User ID:', data.session.user.id);
    console.log('[Admin Auth Callback API] User email:', data.session.user.email);

    // Verify session was persisted by trying to read it back
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('[Admin Auth Callback API] Session verification error:', sessionError);
      return NextResponse.redirect(new URL('/admin/login?error=session_error', request.url));
    }

    if (!session) {
      console.error(
        '[Admin Auth Callback API] Session not found after creation - cookies may not be set'
      );
      return NextResponse.redirect(new URL('/admin/login?error=no_session', request.url));
    }

    console.log('[Admin Auth Callback API] Session verified successfully');
    console.log('[Admin Auth Callback API] Redirecting to admin dashboard');

    // Success! Redirect to dashboard
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  } catch (error) {
    console.error('[Admin Auth Callback API] Unexpected error:', error);
    return NextResponse.redirect(new URL('/admin/login?error=auth_failed', request.url));
  }
}
