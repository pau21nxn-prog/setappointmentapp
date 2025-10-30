/**
 * Admin Magic Link API Route
 * =============================================================================
 * Sends passwordless login link to registered admin emails
 * POST /api/admin/auth/magic-link
 *
 * Last Updated: 2025-10-30
 * Phase: 4 - Admin Dashboard
 * =============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendAdminMagicLink } from '@/lib/auth/admin';
import { z } from 'zod';

// Request validation schema
const magicLinkSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * POST /api/admin/auth/magic-link
 * Send magic link to admin email
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request
    const validationResult = magicLinkSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email address',
          errors: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Get redirect URL from request (for proper callback after auth)
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL;
    const redirectTo = `${origin}/admin/auth/callback`;

    // Send magic link
    const result = await sendAdminMagicLink(email, redirectTo);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Magic link API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request.',
      },
      { status: 500 }
    );
  }
}
