/**
 * Outlook Calendar OAuth Callback Endpoint
 * =============================================================================
 * Handles OAuth callback, exchanges code for tokens, stores in database
 * Phase: 4 - Sprint 4
 * =============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMicrosoftTokensFromCode } from '@/lib/calendar/outlook';
import { getAdminSession, createServiceClient } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
    }

    // Get authorization code from query params
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Microsoft OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/admin/settings?tab=calendar&error=outlook_auth_denied`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(`/admin/settings?tab=calendar&error=missing_code`, request.url)
      );
    }

    // Exchange code for tokens
    const tokens = await getMicrosoftTokensFromCode(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Missing tokens from Microsoft OAuth response');
    }

    // Calculate expiry
    const expiryDate = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

    // Store tokens in database
    const supabase = createServiceClient();
    const { error: dbError } = await supabase.from('calendar_integrations').upsert(
      {
        admin_email: session.user.email,
        provider: 'outlook',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: expiryDate,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'admin_email,provider',
      }
    );

    if (dbError) {
      console.error('Database error storing Outlook tokens:', dbError);
      return NextResponse.redirect(
        new URL(`/admin/settings?tab=calendar&error=db_error`, request.url)
      );
    }

    // Success - redirect back to settings
    return NextResponse.redirect(
      new URL(`/admin/settings?tab=calendar&success=outlook_connected`, request.url)
    );
  } catch (error) {
    console.error('Microsoft OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/admin/settings?tab=calendar&error=callback_failed`, request.url)
    );
  }
}
