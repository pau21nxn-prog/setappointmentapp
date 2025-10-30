/**
 * Robots.txt Generation
 * =============================================================================
 * Controls search engine crawler access
 * Specifies which pages can/cannot be crawled
 *
 * Last Updated: 2025-10-30
 * Phase: 3 - SEO & Analytics
 * =============================================================================
 */

import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://setappointmentapp.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // Block API endpoints from indexing
          '/_next/', // Block Next.js internals
          '/429', // Block error pages
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI's crawler
        disallow: ['/'], // Block AI training bots if desired
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot', // Common Crawl
        disallow: ['/'], // Block data aggregation bots if desired
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
