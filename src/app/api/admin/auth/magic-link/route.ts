/**
 * Admin Magic Link API Route
 * =============================================================================
 * Sends passwordless login link to registered admin emails
 * POST /api/admin/auth/magic-link
 *
 * Last Updated: 2025-10-31
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
 * Get the application base URL with smart fallback logic
 * Priority: origin header > NEXT_PUBLIC_APP_URL > VERCEL_URL > localhost
 *
 * @param request - Next.js request object
 * @returns Application base URL with protocol
 */
function getAppBaseUrl(request: NextRequest): string {
  // 1. Try origin header from request (most reliable for production)
  const origin = request.headers.get('origin');
  if (origin) {
    console.log('[Magic Link] Using origin from request header:', origin);
    return origin;
  }

  // 2. Try NEXT_PUBLIC_APP_URL environment variable (manually configured)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    console.log('[Magic Link] Using NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // 3. Try VERCEL_URL (automatically set by Vercel in production/preview)
  if (process.env.VERCEL_URL) {
    // VERCEL_URL doesn't include protocol, add https for production
    const vercelUrl = `https://${process.env.VERCEL_URL}`;
    console.log('[Magic Link] Using VERCEL_URL with https:', vercelUrl);
    return vercelUrl;
  }

  // 4. Fallback to localhost for local development
  const fallbackUrl = 'http://localhost:3000';
  console.warn('[Magic Link] No production URL found, falling back to:', fallbackUrl);
  console.warn('[Magic Link] Set NEXT_PUBLIC_APP_URL in Vercel environment variables!');
  return fallbackUrl;
}

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

    // Get base URL with smart fallback logic
    const baseUrl = getAppBaseUrl(request);
    const redirectTo = `${baseUrl}/admin/auth/callback`;

    console.log('[Magic Link] Sending magic link with redirect:', redirectTo);

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
