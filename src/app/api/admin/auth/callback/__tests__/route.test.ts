/**
 * Admin Auth Callback API Route Tests
 * =============================================================================
 * Tests for GET /api/admin/auth/callback
 *
 * Tests:
 * - Successful auth code exchange
 * - Expired OTP handling
 * - Access denied errors
 * - Invalid/missing auth code
 * - Session verification
 * - Error handling
 *
 * @jest-environment node
 */

import { GET } from '../route';
import { createAdminClient } from '@/lib/auth/admin';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/auth/admin');

describe('GET /api/admin/auth/callback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully exchange code for session and redirect to dashboard', async () => {
    const mockSupabase = {
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({
          data: {
            session: {
              user: { id: '123', email: 'admin@test.com' },
              access_token: 'token',
            },
          },
          error: null,
        }),
        getSession: jest.fn().mockResolvedValue({
          data: {
            session: {
              user: { id: '123', email: 'admin@test.com' },
            },
          },
          error: null,
        }),
      },
    };

    (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);

    const request = new NextRequest(
      'http://localhost:3000/api/admin/auth/callback?code=valid-auth-code'
    );

    const response = await GET(request);

    expect(response.status).toBe(307); // Redirect
    expect(response.headers.get('Location')).toContain('/admin/dashboard');
    expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('valid-auth-code');
    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
  });

  it('should redirect to login with error for expired OTP', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/admin/auth/callback?error=otp_expired&error_code=otp_expired'
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/admin/login?error=otp_expired');
  });

  it('should redirect to login with error for access denied', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/admin/auth/callback?error=access_denied'
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/admin/login?error=access_denied');
  });

  it('should redirect to login with error for generic auth failure', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/admin/auth/callback?error=unknown_error'
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/admin/login?error=auth_failed');
  });

  it('should redirect to login when no auth code provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/auth/callback');

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/admin/login?error=invalid_token');
  });

  it('should handle code exchange errors', async () => {
    const mockSupabase = {
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Invalid code' },
        }),
      },
    };

    (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);

    const request = new NextRequest(
      'http://localhost:3000/api/admin/auth/callback?code=invalid-code'
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/admin/login?error=code_exchange_failed');
  });

  it('should handle missing session after code exchange', async () => {
    const mockSupabase = {
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
      },
    };

    (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);

    const request = new NextRequest(
      'http://localhost:3000/api/admin/auth/callback?code=valid-code'
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/admin/login?error=no_session');
  });

  it('should handle session verification errors', async () => {
    const mockSupabase = {
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({
          data: {
            session: {
              user: { id: '123', email: 'admin@test.com' },
            },
          },
          error: null,
        }),
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: { message: 'Session error' },
        }),
      },
    };

    (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);

    const request = new NextRequest(
      'http://localhost:3000/api/admin/auth/callback?code=valid-code'
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/admin/login?error=session_error');
  });

  it('should handle session not persisted after creation', async () => {
    const mockSupabase = {
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({
          data: {
            session: {
              user: { id: '123', email: 'admin@test.com' },
            },
          },
          error: null,
        }),
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
      },
    };

    (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);

    const request = new NextRequest(
      'http://localhost:3000/api/admin/auth/callback?code=valid-code'
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/admin/login?error=no_session');
  });

  it('should handle unexpected exceptions', async () => {
    const mockSupabase = {
      auth: {
        exchangeCodeForSession: jest.fn().mockRejectedValue(new Error('Unexpected error')),
      },
    };

    (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);

    const request = new NextRequest(
      'http://localhost:3000/api/admin/auth/callback?code=valid-code'
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toContain('/admin/login?error=auth_failed');
  });
});
