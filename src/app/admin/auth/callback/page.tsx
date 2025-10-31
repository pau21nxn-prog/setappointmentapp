/**
 * Admin Auth Callback Loading Page
 * =============================================================================
 * Displays loading state while authentication is processed by the API route
 * The actual authentication logic is handled by /api/admin/auth/callback
 *
 * IMPORTANT: This page exists as a fallback for direct access.
 * The magic link should redirect to the API route, not this page.
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard
 * =============================================================================
 */

'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AdminAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // If this page is accessed directly (shouldn't happen with proper config),
    // redirect to the API route which can properly handle cookies
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (code || error) {
      console.log('[Admin Auth Callback Page] Redirecting to API route for processing');
      const params = new URLSearchParams(searchParams.toString());
      router.replace(`/api/admin/auth/callback?${params.toString()}`);
    } else {
      console.log('[Admin Auth Callback Page] No auth params, redirecting to login');
      router.replace('/admin/login');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500 mb-6">
          <svg
            className="animate-spin h-8 w-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>

        {/* Loading Text */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authenticating...</h1>
        <p className="text-gray-600">Please wait while we verify your login link</p>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm max-w-md mx-auto">
          <p className="text-xs text-gray-500">
            <strong>Secure login in progress:</strong> We're verifying your authentication token and
            creating a secure session.
          </p>
        </div>
      </div>
    </div>
  );
}
