/**
 * Rate Limiting Configuration
 * =============================================================================
 * Configures rate limits for API routes and form submissions
 * Uses Upstash Redis (Vercel KV) for distributed rate limiting
 *
 * Tiers:
 * - Form submissions: 3 per hour per IP
 * - General API requests: 10 per minute per IP
 * - Bypass in development mode for easier testing
 *
 * Last Updated: 2025-10-30
 * Phase: 3 - Enhancement & Security
 * =============================================================================
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client
// Supports both Vercel KV (Pro plan) and Upstash Marketplace (Hobby plan) variable names
// In development, rate limiting can be bypassed
let redis: Redis | null = null;

try {
  // Check for both naming conventions:
  // - KV_REST_API_URL/TOKEN: Native Vercel KV (Pro plan)
  // - UPSTASH_REDIS_REST_URL/TOKEN: Upstash Marketplace (Hobby plan)
  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  }
} catch (error) {
  console.warn('Redis initialization failed. Rate limiting will be disabled.', error);
}

/**
 * Rate limiter for form submissions (booking form)
 * Limit: 3 submissions per hour per IP address
 *
 * Prevents spam and abuse while allowing legitimate resubmissions
 */
export const formRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
      prefix: 'ratelimit:form',
    })
  : null;

/**
 * Rate limiter for general API requests
 * Limit: 10 requests per minute per IP address
 *
 * Protects API endpoints from excessive requests
 */
export const apiRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'ratelimit:api',
    })
  : null;

/**
 * Check if rate limiting is enabled
 * Returns false in development or if Redis is not configured
 */
export const isRateLimitEnabled = (): boolean => {
  return redis !== null && process.env.NODE_ENV === 'production';
};

/**
 * Get client identifier for rate limiting
 * Uses IP address as the primary identifier
 * Falls back to a default for local development
 *
 * @param request - The incoming request
 * @returns Client identifier string
 */
export const getClientIdentifier = (request: Request): string => {
  // Try to get real IP from various headers (Vercel sets x-real-ip)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare

  // Use the first available IP
  const ip = realIp || forwardedFor?.split(',')[0] || cfConnectingIp || 'anonymous';

  return ip.trim();
};

/**
 * Format rate limit response headers
 * Provides client with rate limit information
 *
 * @param result - Rate limit result from Upstash
 * @returns Headers object with rate limit info
 */
export const getRateLimitHeaders = (result: {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}) => {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
};
