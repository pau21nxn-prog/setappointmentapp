# Phase 4: Polish, Optimization & Cloudflare (Week 4-5)

> **File**: `.claude/phases/PHASE-4-OPTIMIZATION.md`
> **Last Updated**: October 29, 2025
> **Status**: ⏳ UPCOMING

---

## Prerequisites

Before starting this phase, ensure:

- Phase 3 is complete
- Read [SEO & Performance](../reference/SEO-PERFORMANCE.md)
- Read [Cloudflare Configuration](../reference/CLOUDFLARE.md)
- Read [Design System](../reference/DESIGN-SYSTEM.md)

## Related Files

- [Testing Strategy](../reference/TESTING.md) - Lighthouse CI setup

---

## Phase Overview

**Duration**: Week 4-5
**Focus**: UI polish, performance optimization, SEO, Cloudflare configuration, analytics setup

**Goals**:

- Polish UI with animations and micro-interactions
- Optimize images, fonts, and code splitting
- Implement SEO best practices
- Configure Cloudflare (DNS, SSL, caching, firewall)
- Set up Google Analytics 4
- Achieve Lighthouse score 90+

---

## Checklist

### UI Polish

- [ ] Add animations and transitions
- [ ] Implement loading states
- [ ] Add skeleton loaders
- [ ] Polish hover effects
- [ ] Add micro-interactions
- [ ] Test accessibility (WCAG 2.1 AA)

### Performance Optimization

- [ ] Optimize images (use Next.js Image component)
- [ ] Implement lazy loading for all images
- [ ] Optimize video loading
- [ ] Code splitting and tree shaking
- [ ] Minimize bundle size
- [ ] Run Lighthouse audit (target: 90+)

### SEO Optimization

- [ ] Add meta tags (title, description)
- [ ] Add Open Graph tags
- [ ] Implement Schema.org markup (LocalBusiness)
- [ ] Generate sitemap.xml
- [ ] Create robots.txt
- [ ] Add canonical URLs
- [ ] Test with Google Search Console

### Google Analytics Setup

- [ ] Create GA4 property
- [ ] Install GA4 tracking code
- [ ] Set up custom events (form_start, form_complete, booking_success)
- [ ] Set up conversion tracking
- [ ] Test event tracking

### Lighthouse CI

- [ ] Add Lighthouse CI to GitHub Actions
- [ ] Set performance budgets
- [ ] Configure assertions (performance, accessibility, SEO)
- [ ] Run Lighthouse on every PR

### Cloudflare Configuration

- [ ] Update nameservers to Cloudflare
- [ ] Configure DNS records for Vercel
- [ ] Enable SSL/TLS (Full Strict mode)
- [ ] Enable Auto Minify (JS, CSS, HTML)
- [ ] Enable Brotli compression
- [ ] Configure caching rules
- [ ] Set up Page Rules (3 free rules)
- [ ] Enable firewall rules (rate limiting, bot protection)
- [ ] Test cache hit ratio

### Automated Cache Purging

- [ ] Add Cloudflare API integration to CI/CD
- [ ] Purge cache on production deployments
- [ ] Test cache purging workflow

### Code Coverage Requirements

- [ ] Set up code coverage reporting
- [ ] Ensure >80% test coverage
- [ ] Add coverage badges to README

---

## Commands

### Install analytics dependencies

```bash
npm install @next/third-parties  # For Google Analytics
```

### Install Lighthouse CI

```bash
npm install -D @lhci/cli
```

### Run Lighthouse locally

```bash
npm run build
npx lhci autorun
```

### Check bundle size

```bash
npm run build
# Check .next/analyze for bundle analysis
```

---

## Context7 Prompts for Phase 4

- `use context7 for Next.js 14 Image optimization and performance`
- `use context7 for SEO best practices in Next.js 14 App Router`
- `use context7 for Google Analytics 4 setup in Next.js`
- `use context7 for Lighthouse CI configuration`
- `use context7 for Cloudflare Page Rules and firewall configuration`

---

## Key Implementations

### Next.js Metadata API for SEO

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Your Software Development Consultation | [Company Name]',
  description:
    'Schedule a free consultation to discuss your custom software, web application, or mobile app development needs. Expert development team ready to bring your vision to life.',
  keywords: [
    'software development',
    'web development',
    'mobile app development',
    'custom software',
    'consultation',
  ],
  authors: [{ name: '[Your Name]' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    title: 'Book Your Software Development Consultation',
    description: 'Schedule a free consultation for your software development project',
    siteName: '[Company Name]',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '[Company Name] - Software Development Consultation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Your Software Development Consultation',
    description: 'Schedule a free consultation for your software development project',
    images: ['https://yourdomain.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### Google Analytics 4 Integration

```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
```

```typescript
// Custom event tracking
import { sendGAEvent } from '@next/third-parties/google';

// Track form start
sendGAEvent('event', 'form_start', {
  form_name: 'booking_form',
});

// Track booking completion
sendGAEvent('event', 'booking_completed', {
  value: 1,
  currency: 'USD',
});
```

### Cloudflare Cache Purging in CI/CD

```yaml
# .github/workflows/production.yml
- name: Purge Cloudflare Cache
  run: |
    curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
      -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      --data '{"purge_everything":true}'
```

### Lighthouse CI Configuration

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

---

## Cloudflare Configuration

### DNS Records

```
Type    Name    Content                   Proxy Status
A       @       76.76.21.21              Proxied (Orange)
CNAME   www     cname.vercel-dns.com     Proxied (Orange)
TXT     @       [Vercel verification]     DNS Only
```

### Page Rules (3 Free Rules)

**Rule 1: Force HTTPS**

- URL: `http://*yourdomain.com/*`
- Setting: Always Use HTTPS

**Rule 2: Cache Static Assets**

- URL: `*yourdomain.com/*.{jpg,jpeg,png,gif,css,js,woff,woff2,svg,ico}`
- Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 month

**Rule 3: Bypass Cache for API Routes**

- URL: `*yourdomain.com/api/*`
- Setting: Cache Level: Bypass

### Firewall Rules (5 Free Rules)

**Rule 1: Block Bad Bots**

```
Expression: (cf.client.bot) and not (cf.verified_bot)
Action: Challenge (Managed Challenge)
```

**Rule 2: Rate Limit Form Submissions**

```
Expression: (http.request.uri.path eq "/api/appointments/create")
Action: Challenge (when rate > 5 requests/minute)
```

**Rule 3: Block Known Threats**

```
Expression: (cf.threat_score gt 40)
Action: Block
```

**Rule 4: Allow Only POST to API**

```
Expression: (http.request.uri.path eq "/api/appointments/create") and (http.request.method ne "POST")
Action: Block
```

**Rule 5: Geographic Filtering (Optional)**

```
Expression: (ip.geoip.country in {"CN" "RU"}) and (http.request.uri.path contains "/api/")
Action: Challenge
```

---

## Performance Targets

- **Lighthouse Score**: 90+ (all categories)
- **First Contentful Paint (FCP)**: <1.5s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Time to Interactive (TTI)**: <3.5s
- **Cumulative Layout Shift (CLS)**: <0.1
- **First Input Delay (FID)**: <100ms
- **Cloudflare Cache Hit Ratio**: >85%

---

## Success Criteria

Phase 4 is complete when:

- ✅ Lighthouse score is 90+ in all categories
- ✅ All images are optimized and lazy-loaded
- ✅ SEO meta tags are properly configured
- ✅ Schema.org markup is implemented
- ✅ Google Analytics is tracking events
- ✅ Cloudflare DNS is configured correctly
- ✅ SSL/TLS is enabled (Full Strict mode)
- ✅ Page Rules and Firewall Rules are active
- ✅ Cache hit ratio is >85%
- ✅ Accessibility audit passes WCAG 2.1 AA

---

## Next Phase

Once Phase 4 is complete, proceed to:

- [Phase 5: Testing, Release & Launch](./PHASE-5-LAUNCH.md)

---

[Return to Main Index](../CLAUDE.md)
