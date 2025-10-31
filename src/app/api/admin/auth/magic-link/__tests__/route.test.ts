/**
 * Admin Magic Link API Route Tests
 * =============================================================================
 * Tests for POST /api/admin/auth/magic-link
 *
 * Tests:
 * - Valid email sends magic link
 * - Invalid email returns 400
 * - Non-admin email returns 401
 * - Handles Supabase errors
 * - URL generation with proper fallbacks
 *
 * @jest-environment node
 */

import { POST } from '../route';
import { sendAdminMagicLink } from '@/lib/auth/admin';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/auth/admin');

describe('POST /api/admin/auth/magic-link', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send magic link for valid admin email', async () => {
    (sendAdminMagicLink as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Magic link sent! Check your email to login.',
    });

    const request = new NextRequest('http://localhost:3000/api/admin/auth/magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ email: 'admin@test.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain('Magic link sent');
    expect(sendAdminMagicLink).toHaveBeenCalledWith(
      'admin@test.com',
      'http://localhost:3000/api/admin/auth/callback'
    );
  });

  it('should reject invalid email format', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/auth/magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'invalid-email' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toContain('Invalid email');
  });

  it('should return 401 for non-admin email', async () => {
    (sendAdminMagicLink as jest.Mock).mockResolvedValue({
      success: false,
      message: 'This email is not registered as an admin.',
    });

    const request = new NextRequest('http://localhost:3000/api/admin/auth/magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'user@test.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('should use origin header for redirect URL', async () => {
    (sendAdminMagicLink as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Magic link sent',
    });

    const request = new NextRequest('http://localhost:3000/api/admin/auth/magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://production.com',
      },
      body: JSON.stringify({ email: 'admin@test.com' }),
    });

    await POST(request);

    expect(sendAdminMagicLink).toHaveBeenCalledWith(
      'admin@test.com',
      'https://production.com/api/admin/auth/callback'
    );
  });

  it('should fallback to NEXT_PUBLIC_APP_URL if no origin header', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://app.example.com';
    (sendAdminMagicLink as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Magic link sent',
    });

    const request = new NextRequest('http://localhost:3000/api/admin/auth/magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'admin@test.com' }),
    });

    await POST(request);

    expect(sendAdminMagicLink).toHaveBeenCalledWith(
      'admin@test.com',
      'https://app.example.com/api/admin/auth/callback'
    );

    delete process.env.NEXT_PUBLIC_APP_URL;
  });

  it('should fallback to VERCEL_URL if NEXT_PUBLIC_APP_URL not set', async () => {
    process.env.VERCEL_URL = 'my-app-xyz.vercel.app';
    (sendAdminMagicLink as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Magic link sent',
    });

    const request = new NextRequest('http://localhost:3000/api/admin/auth/magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'admin@test.com' }),
    });

    await POST(request);

    expect(sendAdminMagicLink).toHaveBeenCalledWith(
      'admin@test.com',
      'https://my-app-xyz.vercel.app/api/admin/auth/callback'
    );

    delete process.env.VERCEL_URL;
  });

  it('should fallback to localhost if no environment vars set', async () => {
    (sendAdminMagicLink as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Magic link sent',
    });

    const request = new NextRequest('http://localhost:3000/api/admin/auth/magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'admin@test.com' }),
    });

    await POST(request);

    expect(sendAdminMagicLink).toHaveBeenCalledWith(
      'admin@test.com',
      'http://localhost:3000/api/admin/auth/callback'
    );
  });

  it('should handle unexpected errors', async () => {
    (sendAdminMagicLink as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    const request = new NextRequest('http://localhost:3000/api/admin/auth/magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'admin@test.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toContain('error occurred');
  });

  it('should handle malformed JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/auth/magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});
