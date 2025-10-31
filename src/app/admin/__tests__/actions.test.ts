/**
 * Admin Server Actions Tests
 * =============================================================================
 * Tests for admin server actions in app/admin/actions.ts
 *
 * Tests:
 * - logoutAction()
 * - updateAppointmentStatus()
 * - addAppointmentNote()
 * - updateAppointmentNote()
 * - deleteAppointmentNote()
 * - sendAppointmentEmail()
 *
 * @jest-environment node
 */

import {
  logoutAction,
  updateAppointmentStatus,
  addAppointmentNote,
  updateAppointmentNote,
  deleteAppointmentNote,
  sendAppointmentEmail,
} from '../actions';
import { signOutAdmin, getAdminSession, createServiceClient } from '@/lib/auth/admin';
import { Resend } from 'resend';

// Mock dependencies
jest.mock('@/lib/auth/admin');
jest.mock('resend');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Admin Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logoutAction', () => {
    it('should successfully logout and redirect', async () => {
      const mockRedirect = require('next/navigation').redirect;
      (signOutAdmin as jest.Mock).mockResolvedValue({ success: true });

      await expect(logoutAction()).rejects.toThrow(); // redirect throws

      expect(signOutAdmin).toHaveBeenCalled();
      expect(mockRedirect).toHaveBeenCalledWith('/admin/login');
    });

    it('should return failure if signOut fails', async () => {
      (signOutAdmin as jest.Mock).mockResolvedValue({ success: false });

      const result = await logoutAction();

      expect(result.success).toBe(false);
    });
  });

  describe('updateAppointmentStatus', () => {
    const mockSession = {
      user: { email: 'admin@test.com', role: 'admin' as const },
      authUser: { id: '123', email: 'admin@test.com' },
    };

    it('should update appointment status successfully', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(mockSession);

      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: 'appt-123', status: 'pending' },
                error: null,
              }),
            }),
          }),
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null }),
          }),
          insert: jest.fn().mockResolvedValue({ error: null }),
        }),
      };

      (createServiceClient as jest.Mock).mockReturnValue(mockSupabase);

      const result = await updateAppointmentStatus('appt-123', 'confirmed', 'Client confirmed');

      expect(result.success).toBe(true);
      expect(result.message).toContain('confirmed');
      expect(mockSupabase.from).toHaveBeenCalledWith('appointments');
      expect(mockSupabase.from).toHaveBeenCalledWith('status_history');
    });

    it('should reject unauthorized access', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(null);

      const result = await updateAppointmentStatus('appt-123', 'confirmed');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Unauthorized');
    });

    it('should reject updating to same status', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(mockSession);

      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: 'appt-123', status: 'confirmed' },
                error: null,
              }),
            }),
          }),
        }),
      };

      (createServiceClient as jest.Mock).mockReturnValue(mockSupabase);

      const result = await updateAppointmentStatus('appt-123', 'confirmed');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Status unchanged');
    });

    it('should handle non-existent appointment', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(mockSession);

      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' },
              }),
            }),
          }),
        }),
      };

      (createServiceClient as jest.Mock).mockReturnValue(mockSupabase);

      const result = await updateAppointmentStatus('invalid-id', 'confirmed');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Appointment not found');
    });
  });

  describe('addAppointmentNote', () => {
    const mockSession = {
      user: { email: 'admin@test.com', role: 'admin' as const },
      authUser: { id: '123', email: 'admin@test.com' },
    };

    it('should add note successfully', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(mockSession);

      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: 'appt-123' },
                error: null,
              }),
            }),
          }),
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: 'note-123' },
                error: null,
              }),
            }),
          }),
        }),
      };

      (createServiceClient as jest.Mock).mockReturnValue(mockSupabase);

      const result = await addAppointmentNote('appt-123', 'This is a test note', false);

      expect(result.success).toBe(true);
      expect(result.noteId).toBe('note-123');
    });

    it('should reject empty note', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(mockSession);

      const result = await addAppointmentNote('appt-123', '   ', false);

      expect(result.success).toBe(false);
      expect(result.message).toContain('empty');
    });

    it('should reject note exceeding 5000 characters', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(mockSession);

      const longNote = 'a'.repeat(5001);
      const result = await addAppointmentNote('appt-123', longNote, false);

      expect(result.success).toBe(false);
      expect(result.message).toContain('too long');
    });

    it('should reject unauthorized access', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(null);

      const result = await addAppointmentNote('appt-123', 'Test note');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Unauthorized');
    });
  });

  describe('updateAppointmentNote', () => {
    const mockSession = {
      user: { email: 'admin@test.com', role: 'admin' as const },
      authUser: { id: '123', email: 'admin@test.com' },
    };

    it('should update note successfully', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(mockSession);

      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnThis(),
            mockResolvedValue: { error: null },
          }),
        }),
      };

      (createServiceClient as jest.Mock).mockReturnValue(mockSupabase);

      const result = await updateAppointmentNote('note-123', 'Updated note text', true);

      expect(result.success).toBe(true);
    });

    it('should reject empty note update', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(mockSession);

      const result = await updateAppointmentNote('note-123', '  ', false);

      expect(result.success).toBe(false);
      expect(result.message).toContain('empty');
    });
  });

  describe('deleteAppointmentNote', () => {
    const mockSession = {
      user: { email: 'admin@test.com', role: 'admin' as const },
      authUser: { id: '123', email: 'admin@test.com' },
    };

    it('should delete note successfully', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(mockSession);

      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          delete: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnThis(),
            mockResolvedValue: { error: null },
          }),
        }),
      };

      (createServiceClient as jest.Mock).mockReturnValue(mockSupabase);

      const result = await deleteAppointmentNote('note-123', 'appt-123');

      expect(result.success).toBe(true);
    });

    it('should reject unauthorized access', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(null);

      const result = await deleteAppointmentNote('note-123', 'appt-123');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Unauthorized');
    });
  });

  describe('sendAppointmentEmail', () => {
    const mockSession = {
      user: { email: 'admin@test.com', role: 'admin' as const },
      authUser: { id: '123', email: 'admin@test.com' },
    };

    beforeEach(() => {
      // Set required env var
      process.env.RESEND_API_KEY = 'test-api-key';
      process.env.EMAIL_FROM = 'noreply@test.com';
    });

    it('should send email successfully', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(mockSession);

      const mockResend = {
        emails: {
          send: jest.fn().mockResolvedValue({
            data: { id: 'email-123' },
            error: null,
          }),
        },
      };

      (Resend as jest.Mock).mockImplementation(() => mockResend);

      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  id: 'appt-123',
                  email: 'client@test.com',
                  full_name: 'Test Client',
                },
                error: null,
              }),
            }),
          }),
          insert: jest.fn().mockResolvedValue({ error: null }),
        }),
      };

      (createServiceClient as jest.Mock).mockReturnValue(mockSupabase);

      const result = await sendAppointmentEmail('appt-123', 'confirmation');

      expect(result.success).toBe(true);
      expect(result.emailId).toBe('email-123');
      expect(mockResend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'client@test.com',
          from: 'noreply@test.com',
        })
      );
    });

    it('should reject if Resend API key is missing', async () => {
      delete process.env.RESEND_API_KEY;
      (getAdminSession as jest.Mock).mockResolvedValue(mockSession);

      const result = await sendAppointmentEmail('appt-123', 'confirmation');

      expect(result.success).toBe(false);
      expect(result.message).toContain('not configured');
    });

    it('should handle Resend API errors', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(mockSession);

      const mockResend = {
        emails: {
          send: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Email service error' },
          }),
        },
      };

      (Resend as jest.Mock).mockImplementation(() => mockResend);

      const mockSupabase = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: 'appt-123', email: 'client@test.com' },
                error: null,
              }),
            }),
          }),
          insert: jest.fn().mockResolvedValue({ error: null }),
        }),
      };

      (createServiceClient as jest.Mock).mockReturnValue(mockSupabase);

      const result = await sendAppointmentEmail('appt-123', 'confirmation');

      expect(result.success).toBe(false);
      // Verify error was logged
      expect(mockSupabase.from).toHaveBeenCalledWith('email_logs');
    });

    it('should reject unauthorized access', async () => {
      (getAdminSession as jest.Mock).mockResolvedValue(null);

      const result = await sendAppointmentEmail('appt-123', 'confirmation');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Unauthorized');
    });
  });
});
