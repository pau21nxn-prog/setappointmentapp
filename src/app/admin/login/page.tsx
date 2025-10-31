'use client';

/**
 * Admin Login Page
 * =============================================================================
 * Passwordless authentication via magic link
 * Sends login link to registered admin emails only
 *
 * Last Updated: 2025-10-31
 * Phase: 4 - Admin Dashboard
 * =============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Error message mapping for auth failures
const ERROR_MESSAGES: Record<string, string> = {
  otp_expired: 'Your magic link has expired. Please request a new one.',
  access_denied: 'Access denied. Please try again.',
  auth_failed: 'Authentication failed. Please try again.',
  code_exchange_failed: 'Failed to authenticate. Please request a new magic link.',
  session_error: 'Session error occurred. Please try again.',
  no_session: 'Could not establish session. Please try again.',
  invalid_token: 'Invalid authentication token. Please request a new magic link.',
};

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Check for authentication errors in URL
  useEffect(() => {
    const error = searchParams.get('error');
    if (error && ERROR_MESSAGES[error]) {
      console.log('[Admin Login] Authentication error from URL:', error);
      setMessage({
        type: 'error',
        text: ERROR_MESSAGES[error],
      });
      // Clear the error from URL
      router.replace('/admin/login', { scroll: false });
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: data.message || 'Check your email for the login link!',
        });
        setEmail(''); // Clear email field
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Failed to send login link. Please try again.',
        });
      }
    } catch (error) {
      console.error('Magic link error:', error);
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-2 text-gray-600">Enter your email to receive a magic link</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={isLoading}
                className="text-lg py-3"
              />
              <p className="mt-2 text-sm text-gray-500">Only registered admin emails can login</p>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <div className="flex items-start">
                  <svg
                    className={`w-5 h-5 mr-2 flex-shrink-0 mt-0.5 ${
                      message.type === 'success' ? 'text-emerald-500' : 'text-red-500'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {message.type === 'success' ? (
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    ) : (
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    )}
                  </svg>
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full py-3 text-lg" disabled={isLoading || !email}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Sending...
                </span>
              ) : (
                'Send Magic Link'
              )}
            </Button>
          </form>

          {/* How It Works */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-3">How it works:</p>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                  1
                </span>
                <span>Enter your registered admin email address</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                  2
                </span>
                <span>Check your inbox for the magic link email</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                  3
                </span>
                <span>Click the link to securely login to your dashboard</span>
              </li>
            </ol>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-gray-600">
                <strong>Security Note:</strong> Magic links expire after 1 hour and can only be used
                once. No passwords are stored.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Site Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            ← Back to main site
          </button>
        </div>
      </div>
    </div>
  );
}
