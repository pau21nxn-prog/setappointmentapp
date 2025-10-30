/**
 * Supabase-Based Rate Limiting
 * =============================================================================
 * Alternative to Redis/Upstash rate limiting using Supabase PostgreSQL
 * Uses the rate_limits table created by migration 004
 *
 * Rate Limits:
 * - Form submissions: 3 per hour per IP
 * - General API requests: 10 per minute per IP
 *
 * Edge Runtime Compatible: Uses fetch API instead of Supabase client
 *
 * Last Updated: 2025-10-30
 * Phase: 3 - Enhancement & Security (Supabase Alternative)
 * =============================================================================
 */

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if Supabase is configured
const isConfigured = Boolean(supabaseUrl && supabaseServiceKey);

/**
 * Rate limit result interface (matches Upstash format)
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Timestamp in milliseconds when the limit resets
  pending: Promise<unknown>;
}

/**
 * Helper to make Supabase REST API calls
 * Edge Runtime compatible - uses fetch instead of client library
 */
async function supabaseQuery(
  method: 'GET' | 'POST' | 'PATCH',
  path: string,
  body?: unknown
): Promise<{ data?: unknown; error?: unknown }> {
  if (!supabaseUrl || !supabaseServiceKey) {
    return { error: 'Supabase not configured' };
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        Prefer: method === 'GET' ? 'return=representation' : 'return=minimal',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      return { error };
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    return { data };
  } catch (error) {
    return { error };
  }
}

/**
 * Check and update rate limit for a given identifier and endpoint
 *
 * @param identifier - Client identifier (usually IP address)
 * @param endpoint - Endpoint type ('form' or 'api')
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  // If Supabase is not configured, allow all requests
  if (!isConfigured) {
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + windowMs,
      pending: Promise.resolve(),
    };
  }

  try {
    const now = new Date();
    const resetAt = new Date(now.getTime() + windowMs);

    // Try to get existing rate limit record
    const { data, error: fetchError } = await supabaseQuery(
      'GET',
      `rate_limits?identifier=eq.${encodeURIComponent(identifier)}&endpoint=eq.${encodeURIComponent(endpoint)}`
    );

    if (fetchError) {
      console.error('Error fetching rate limit:', fetchError);
      // On error, allow the request (fail open)
      return {
        success: true,
        limit,
        remaining: limit,
        reset: Date.now() + windowMs,
        pending: Promise.resolve(),
      };
    }

    const existing = Array.isArray(data) && data.length > 0 ? data[0] : null;

    // If no existing record, create one
    if (!existing) {
      await supabaseQuery('POST', 'rate_limits', {
        identifier,
        endpoint,
        count: 1,
        reset_at: resetAt.toISOString(),
      });

      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: resetAt.getTime(),
        pending: Promise.resolve(),
      };
    }

    // Check if the rate limit has expired
    const resetTime = new Date(existing.reset_at as string).getTime();
    if (now.getTime() > resetTime) {
      // Reset the counter
      await supabaseQuery(
        'PATCH',
        `rate_limits?identifier=eq.${encodeURIComponent(identifier)}&endpoint=eq.${encodeURIComponent(endpoint)}`,
        {
          count: 1,
          reset_at: resetAt.toISOString(),
          updated_at: now.toISOString(),
        }
      );

      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: resetAt.getTime(),
        pending: Promise.resolve(),
      };
    }

    // Check if limit exceeded
    if ((existing.count as number) >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: resetTime,
        pending: Promise.resolve(),
      };
    }

    // Increment the counter
    await supabaseQuery(
      'PATCH',
      `rate_limits?identifier=eq.${encodeURIComponent(identifier)}&endpoint=eq.${encodeURIComponent(endpoint)}`,
      {
        count: (existing.count as number) + 1,
        updated_at: now.toISOString(),
      }
    );

    return {
      success: true,
      limit,
      remaining: limit - ((existing.count as number) + 1),
      reset: resetTime,
      pending: Promise.resolve(),
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // On error, allow the request (fail open)
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + windowMs,
      pending: Promise.resolve(),
    };
  }
}

/**
 * Form rate limiter: 3 submissions per hour
 */
export async function checkFormRateLimit(identifier: string): Promise<RateLimitResult> {
  return checkRateLimit(identifier, 'form', 3, 60 * 60 * 1000); // 1 hour
}

/**
 * API rate limiter: 10 requests per minute
 */
export async function checkApiRateLimit(identifier: string): Promise<RateLimitResult> {
  return checkRateLimit(identifier, 'api', 10, 60 * 1000); // 1 minute
}

/**
 * Clean up expired rate limits (run periodically)
 * This function can be called via a cron job or manually
 *
 * @returns Number of deleted records
 */
export async function cleanupExpiredRateLimits(): Promise<number> {
  if (!isConfigured) {
    return 0;
  }

  try {
    // Call the Supabase RPC function
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/cleanup_expired_rate_limits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseServiceKey!,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });

    if (!response.ok) {
      console.error('Error cleaning up rate limits:', await response.text());
      return 0;
    }

    const data = await response.json();
    return data || 0;
  } catch (error) {
    console.error('Cleanup failed:', error);
    return 0;
  }
}

/**
 * Check if rate limiting is enabled
 */
export function isRateLimitEnabled(): boolean {
  return isConfigured && process.env.NODE_ENV === 'production';
}

/**
 * Get client identifier for rate limiting
 * Uses IP address as the primary identifier
 *
 * @param request - The incoming request
 * @returns Client identifier string
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from various headers (Vercel sets x-real-ip)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare

  // Use the first available IP
  const ip = realIp || forwardedFor?.split(',')[0] || cfConnectingIp || 'anonymous';

  return ip.trim();
}

/**
 * Format rate limit response headers
 * Provides client with rate limit information
 *
 * @param result - Rate limit result
 * @returns Headers object with rate limit info
 */
export function getRateLimitHeaders(result: RateLimitResult) {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
}
