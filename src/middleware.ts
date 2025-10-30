/**
 * Next.js Edge Middleware
 * =============================================================================
 * Runs before every request to apply:
 * - Rate limiting for API routes and form submissions
 * - Security headers
 * - Request logging and monitoring
 *
 * Middleware runs on Vercel Edge Network for optimal performance
 *
 * Last Updated: 2025-10-30
 * Phase: 3 - Enhancement & Security
 * =============================================================================
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  checkFormRateLimit,
  checkApiRateLimit,
  isRateLimitEnabled,
  getClientIdentifier,
  getRateLimitHeaders,
} from '@/lib/supabase/ratelimit';

/**
 * Middleware function
 * Executed on every request that matches the config matcher
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting based on route
  if (isRateLimitEnabled()) {
    let rateLimitResult;
    const clientId = getClientIdentifier(request);

    // Form submission endpoints - stricter limits (3/hour)
    if (pathname === '/api/appointments' && request.method === 'POST') {
      rateLimitResult = await checkFormRateLimit(clientId);

      if (!rateLimitResult.success) {
        // Rate limit exceeded
        return new NextResponse(
          JSON.stringify({
            error: 'Too Many Requests',
            message:
              'You have exceeded the maximum number of booking attempts. Please try again later.',
            retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
              ...getRateLimitHeaders(rateLimitResult),
            },
          }
        );
      }

      // Add rate limit headers to successful response
      const response = NextResponse.next();
      Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // General API routes - moderate limits (10/min)
    if (pathname.startsWith('/api/')) {
      rateLimitResult = await checkApiRateLimit(clientId);

      if (!rateLimitResult.success) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too Many Requests',
            message: 'You are making requests too quickly. Please slow down.',
            retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
              ...getRateLimitHeaders(rateLimitResult),
            },
          }
        );
      }

      // Add rate limit headers to successful response
      const response = NextResponse.next();
      Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }
  }

  // Continue to the requested page
  return NextResponse.next();
}

/**
 * Middleware configuration
 * Specifies which routes this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all API routes
     * Excludes static files and internal Next.js routes
     */
    '/api/:path*',
  ],
};
