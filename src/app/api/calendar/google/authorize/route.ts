/**
 * Google Calendar OAuth Authorization Endpoint
 * =============================================================================
 * Initiates OAuth flow by redirecting to Google's consent screen
 * Phase: 4 - Sprint 4
 * =============================================================================
 */

import { NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/calendar/google';
import { getAdminSession } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate OAuth URL
    const authUrl = getGoogleAuthUrl();

    // Redirect to Google consent screen
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Google OAuth authorization error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google Calendar authorization' },
      { status: 500 }
    );
  }
}
