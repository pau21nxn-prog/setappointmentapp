# SEO & Performance

> **File**: `.claude/reference/SEO-PERFORMANCE.md`
> **Last Updated**: October 29, 2025

---

## SEO Requirements

### Meta Tags (Next.js 14 Metadata API)

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Your Software Development Consultation | [Company Name]',
  description:
    'Schedule a free consultation to discuss your custom software, web application, or mobile app development needs.',
  keywords: ['software development', 'web development', 'consultation'],
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
    description: 'Schedule a free consultation',
    images: ['https://yourdomain.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

---

## Schema.org Markup

```typescript
// app/layout.tsx or components/StructuredData.tsx
export function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: '[Company Name]',
    description: 'Custom software development services',
    url: 'https://yourdomain.com',
    telephone: '+1-XXX-XXX-XXXX',
    email: 'contact@yourdomain.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    openingHours: 'Mo-Fr 09:00-18:00',
    priceRange: '$$',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## Performance Targets

- **Lighthouse Score**: 90+ (all categories)
- **First Contentful Paint (FCP)**: <1.5s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Time to Interactive (TTI)**: <3.5s
- **Cumulative Layout Shift (CLS)**: <0.1
- **First Input Delay (FID)**: <100ms

---

## Optimization Techniques

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/images/portfolio/project1.jpg"
  alt="Project 1"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Font Optimization

```typescript
// app/layout.tsx
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});
```

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

const BookingForm = dynamic(() => import('@/components/sections/BookingForm'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

---

**Context7**: `use context7 for Next.js 14 SEO and metadata API best practices`

[Return to Main Index](../CLAUDE.md)
