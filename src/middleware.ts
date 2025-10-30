/**
 * Next.js Edge Middleware
 * =============================================================================
 * Runs before every request to apply:
 * - Admin route protection (authentication check)
 * - Rate limiting for API routes and form submissions
 * - Security headers
 * - Request logging and monitoring
 *
 * Middleware runs on Vercel Edge Network for optimal performance
 *
 * Last Updated: 2025-10-30
 * Phase: 4 - Admin Dashboard
 * =============================================================================
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
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

  // Add pathname header for all admin routes (used by layout to determine page)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 1. ADMIN ROUTE PROTECTION
  // Check if accessing admin routes (except login and auth callback)
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/admin/auth/callback')
  ) {
    let response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            });
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If no session, redirect to login
    if (!session) {
      const redirectUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Session exists, allow access
    return response;
  }

  // 2. RATE LIMITING
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

  // Continue to the requested page (pass pathname header for layout)
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Middleware configuration
 * Specifies which routes this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all API routes and admin routes
     * Excludes static files and internal Next.js routes
     */
    '/api/:path*',
    '/admin/:path*',
  ],
};
