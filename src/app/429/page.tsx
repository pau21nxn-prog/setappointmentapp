/**
 * 429 Too Many Requests Error Page
 * =============================================================================
 * Displayed when users exceed rate limits
 * Provides helpful information and guidance
 *
 * Last Updated: 2025-10-30
 * Phase: 3 - Enhancement & Security
 * =============================================================================
 */

import Link from 'next/link';
import { ShieldAlert, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Too Many Requests | SetAppointmentApp',
  description: 'You have exceeded the rate limit. Please try again later.',
  robots: 'noindex, nofollow',
};

export default function RateLimitedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
            <ShieldAlert className="relative w-24 h-24 text-red-500 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Whoa there! Slow down</h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-8">
          You&apos;ve exceeded the maximum number of requests.
        </p>

        {/* Explanation Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-left">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-600" />
            Why am I seeing this?
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              To ensure a great experience for all users and protect our services from abuse, we
              limit the number of requests you can make:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Form submissions:</strong> Maximum 3 booking attempts per hour
              </li>
              <li>
                <strong>API requests:</strong> Maximum 10 requests per minute
              </li>
            </ul>
            <p>
              These limits help us maintain service quality and prevent spam. Don&apos;t worry -
              most users never hit these limits during normal use.
            </p>
          </div>
        </div>

        {/* What to do next */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-lg font-semibold text-emerald-900 mb-3">What should I do?</h3>
          <ul className="space-y-2 text-emerald-800">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">✓</span>
              <span>Wait a few minutes before trying again</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">✓</span>
              <span>Check if you have multiple browser tabs or windows open</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">✓</span>
              <span>If you need urgent assistance, contact us directly</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </Button>
          </Link>
          <Link href="/#contact">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Contact Support
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-sm text-gray-500">
          Rate limits reset automatically. No action needed from your side.
        </p>
      </div>
    </div>
  );
}
