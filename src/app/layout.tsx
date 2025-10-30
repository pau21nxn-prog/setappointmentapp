import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { homepageStructuredData } from '@/lib/seo/structuredData';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

// Base URL for the application
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://setappointmentapp.vercel.app';

export const metadata: Metadata = {
  // Basic Metadata
  title: {
    default: 'SetAppointmentApp | Launch Your Business Website in 15 Days',
    template: '%s | SetAppointmentApp',
  },
  description:
    'Professional web development services with a 15-day delivery guarantee. Book your free consultation to discuss custom websites, e-commerce solutions, and digital transformation projects.',
  keywords: [
    'web development',
    'website design',
    'consultation booking',
    'business website',
    'e-commerce development',
    'custom web applications',
    'responsive design',
    'SEO optimization',
    '15-day delivery',
    'web development consultation',
  ],
  authors: [{ name: 'SetAppointmentApp', url: baseUrl }],
  creator: 'SetAppointmentApp',
  publisher: 'SetAppointmentApp',

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'SetAppointmentApp',
    title: 'Launch Your Business Website in 15 Days or Get Your Money Back',
    description:
      '50+ Five-Star Reviews • 100% Satisfaction • 15-Day Delivery. Book your free consultation for custom web development services.',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SetAppointmentApp - Professional Web Development Services',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Launch Your Business Website in 15 Days',
    description:
      '50+ Five-Star Reviews • 100% Satisfaction • 15-Day Delivery. Book your free consultation today!',
    images: [`${baseUrl}/og-image.png`],
    creator: '@setappointmentapp',
    site: '@setappointmentapp',
  },

  // Verification & Other Meta Tags
  verification: {
    google: 'your-google-verification-code', // TODO: Add Google Search Console verification
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },

  // App & Mobile
  applicationName: 'SetAppointmentApp',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SetAppointmentApp',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  // Alternate URLs (for multi-language support in future)
  alternates: {
    canonical: baseUrl,
  },

  // Category
  category: 'Business Services',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {/* Google Analytics */}
        <GoogleAnalytics />

        {/* JSON-LD Structured Data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }}
        />

        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
