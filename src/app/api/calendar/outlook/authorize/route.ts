/**
 * Outlook Calendar OAuth Authorization Endpoint
 * =============================================================================
 * Initiates OAuth flow by redirecting to Microsoft's consent screen
 * Phase: 4 - Sprint 4
 * =============================================================================
 */

import { NextResponse } from 'next/server';
import { getMicrosoftAuthUrl } from '@/lib/calendar/outlook';
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
    const authUrl = getMicrosoftAuthUrl();

    // Redirect to Microsoft consent screen
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Microsoft OAuth authorization error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Outlook Calendar authorization' },
      { status: 500 }
    );
  }
}
