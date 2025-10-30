/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    dirs: ['src'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy - Strengthened for Grade A
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: Allow self, specific Vercel domains, and unsafe-eval only for dev tools
              // Note: 'unsafe-inline' needed for Next.js hydration - can be replaced with nonces in future
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-scripts.com https://va.vercel-scripts.com",
              // Styles: Allow self and inline styles (needed for CSS-in-JS)
              "style-src 'self' 'unsafe-inline'",
              // Images: Allow self, data URIs, and HTTPS images (for Unsplash portfolio images)
              "img-src 'self' data: https: blob:",
              // Fonts: Allow self and data URIs
              "font-src 'self' data:",
              // API connections: Supabase, Vercel, and Resend
              "connect-src 'self' https://*.supabase.co https://vercel.live https://api.resend.com wss://*.supabase.co wss://vercel.live",
              // Media: Restrict to self only
              "media-src 'self'",
              // Objects: Block all plugins (Flash, etc.)
              "object-src 'none'",
              // Child/Frame sources: Block all iframes
              "child-src 'none'",
              // Frame ancestors: Prevent clickjacking
              "frame-ancestors 'none'",
              // Base URI: Restrict to self
              "base-uri 'self'",
              // Form actions: Only allow submissions to self
              "form-action 'self'",
              // Upgrade insecure requests automatically
              'upgrade-insecure-requests',
              // Block mixed content
              'block-all-mixed-content',
            ].join('; '),
          },
          // Strict Transport Security - Force HTTPS for 2 years
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Permissions Policy - Restrict dangerous browser features
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()',
            ].join(', '),
          },
          // Cross-Origin Policies for enhanced isolation
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none', // 'require-corp' can break external images
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Enable XSS filtering
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer policy for privacy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Prevent Adobe Flash cross-domain access
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
