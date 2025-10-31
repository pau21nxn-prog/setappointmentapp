/**
 * Admin Authentication Tests
 * =============================================================================
 * Tests for admin auth utilities in lib/auth/admin.ts
 *
 * Tests:
 * - sendAdminMagicLink()
 * - getAdminSession()
 * - isAdmin()
 * - hasAdminRole()
 * - signOutAdmin()
 * - getAdminByEmail()
 * - listAdminUsers()
 * - createAdminUser()
 */

import {
  sendAdminMagicLink,
  getAdminSession,
  isAdmin,
  hasAdminRole,
  signOutAdmin,
  getAdminByEmail,
  listAdminUsers,
  createAdminUser,
  createAdminClient,
  createServiceClient,
} from '../admin';

// Mock Supabase clients
jest.mock('../admin', () => {
  const actual = jest.requireActual('../admin');
  return {
    ...actual,
    createAdminClient: jest.fn(),
    createServiceClient: jest.fn(),
  };
});

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
  })),
}));

describe('Admin Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendAdminMagicLink', () => {
    it('should send magic link to registered active admin', async () => {
      const mockSupabase = {
        auth: {
          signInWithOtp: jest.fn().mockResolvedValue({ error: null }),
        },
      };

      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { email: 'admin@test.com', is_active: true },
                error: null,
              }),
            }),
          }),
        }),
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);
      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await sendAdminMagicLink('admin@test.com');

      expect(result.success).toBe(true);
      expect(result.message).toContain('Magic link sent');
      expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
        email: 'admin@test.com',
        options: {
          emailRedirectTo: expect.stringContaining('/api/admin/auth/callback'),
          shouldCreateUser: false,
        },
      });
    });

    it('should reject non-registered email', async () => {
      const mockServiceClient = {
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

      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await sendAdminMagicLink('notadmin@test.com');

      expect(result.success).toBe(false);
      expect(result.message).toContain('not registered');
    });

    it('should reject inactive admin account', async () => {
      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { email: 'admin@test.com', is_active: false },
                error: null,
              }),
            }),
          }),
        }),
      };

      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await sendAdminMagicLink('admin@test.com');

      expect(result.success).toBe(false);
      expect(result.message).toContain('inactive');
    });

    it('should handle Supabase auth errors', async () => {
      const mockSupabase = {
        auth: {
          signInWithOtp: jest.fn().mockResolvedValue({
            error: { message: 'Supabase error' },
          }),
        },
      };

      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { email: 'admin@test.com', is_active: true },
                error: null,
              }),
            }),
          }),
        }),
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);
      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await sendAdminMagicLink('admin@test.com');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Failed to send');
    });
  });

  describe('getAdminSession', () => {
    it('should return admin session for authenticated admin', async () => {
      const mockSupabase = {
        auth: {
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

      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: {
                email: 'admin@test.com',
                role: 'admin',
                is_active: true,
              },
              error: null,
            }),
          }),
        }),
        rpc: jest.fn().mockResolvedValue({}),
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);
      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const session = await getAdminSession();

      expect(session).not.toBeNull();
      expect(session?.user.email).toBe('admin@test.com');
      expect(session?.authUser.id).toBe('123');
    });

    it('should return null for non-authenticated user', async () => {
      const mockSupabase = {
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: { session: null },
            error: null,
          }),
        },
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);

      const session = await getAdminSession();

      expect(session).toBeNull();
    });

    it('should return null for authenticated user who is not admin', async () => {
      const mockSupabase = {
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: {
              session: {
                user: { id: '123', email: 'user@test.com' },
              },
            },
            error: null,
          }),
        },
      };

      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);
      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const session = await getAdminSession();

      expect(session).toBeNull();
    });
  });

  describe('isAdmin', () => {
    it('should return true for valid admin session', async () => {
      const mockSupabase = {
        auth: {
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

      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { email: 'admin@test.com', role: 'admin', is_active: true },
              error: null,
            }),
          }),
        }),
        rpc: jest.fn().mockResolvedValue({}),
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);
      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await isAdmin();

      expect(result).toBe(true);
    });

    it('should return false for no session', async () => {
      const mockSupabase = {
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: { session: null },
            error: null,
          }),
        },
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);

      const result = await isAdmin();

      expect(result).toBe(false);
    });
  });

  describe('hasAdminRole', () => {
    it('should return true for exact role match', async () => {
      const mockSupabase = {
        auth: {
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

      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { email: 'admin@test.com', role: 'admin', is_active: true },
              error: null,
            }),
          }),
        }),
        rpc: jest.fn().mockResolvedValue({}),
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);
      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await hasAdminRole('admin');

      expect(result).toBe(true);
    });

    it('should return true for higher role (super_admin has admin access)', async () => {
      const mockSupabase = {
        auth: {
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

      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { email: 'admin@test.com', role: 'super_admin', is_active: true },
              error: null,
            }),
          }),
        }),
        rpc: jest.fn().mockResolvedValue({}),
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);
      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await hasAdminRole('admin');

      expect(result).toBe(true);
    });

    it('should return false for lower role (viewer cannot access admin)', async () => {
      const mockSupabase = {
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: {
              session: {
                user: { id: '123', email: 'viewer@test.com' },
              },
            },
            error: null,
          }),
        },
      };

      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { email: 'viewer@test.com', role: 'viewer', is_active: true },
              error: null,
            }),
          }),
        }),
        rpc: jest.fn().mockResolvedValue({}),
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);
      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await hasAdminRole('admin');

      expect(result).toBe(false);
    });
  });

  describe('signOutAdmin', () => {
    it('should successfully sign out admin', async () => {
      const mockSupabase = {
        auth: {
          signOut: jest.fn().mockResolvedValue({ error: null }),
        },
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);

      const result = await signOutAdmin();

      expect(result.success).toBe(true);
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out errors', async () => {
      const mockSupabase = {
        auth: {
          signOut: jest.fn().mockResolvedValue({
            error: { message: 'Sign out error' },
          }),
        },
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);

      const result = await signOutAdmin();

      expect(result.success).toBe(false);
    });
  });

  describe('getAdminByEmail', () => {
    it('should return admin user by email', async () => {
      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { email: 'admin@test.com', role: 'admin' },
                error: null,
              }),
            }),
          }),
        }),
      };

      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await getAdminByEmail('admin@test.com');

      expect(result).not.toBeNull();
      expect(result?.email).toBe('admin@test.com');
    });

    it('should return null for non-existent email', async () => {
      const mockServiceClient = {
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

      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await getAdminByEmail('notfound@test.com');

      expect(result).toBeNull();
    });
  });

  describe('listAdminUsers', () => {
    it('should return list of admin users for super_admin', async () => {
      // Mock hasAdminRole to return true
      const mockSupabase = {
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: {
              session: {
                user: { id: '123', email: 'superadmin@test.com' },
              },
            },
            error: null,
          }),
        },
      };

      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { email: 'superadmin@test.com', role: 'super_admin', is_active: true },
            error: null,
          }),
          order: jest.fn().mockResolvedValue({
            data: [
              { email: 'admin1@test.com', role: 'admin' },
              { email: 'admin2@test.com', role: 'viewer' },
            ],
            error: null,
          }),
        }),
        rpc: jest.fn().mockResolvedValue({}),
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);
      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await listAdminUsers();

      expect(result).toHaveLength(2);
      expect(result[0].email).toBe('admin1@test.com');
    });

    it('should return empty array for non-super_admin', async () => {
      const mockSupabase = {
        auth: {
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

      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { email: 'admin@test.com', role: 'admin', is_active: true },
            error: null,
          }),
        }),
        rpc: jest.fn().mockResolvedValue({}),
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);
      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await listAdminUsers();

      expect(result).toHaveLength(0);
    });
  });

  describe('createAdminUser', () => {
    it('should create new admin user as super_admin', async () => {
      const mockSupabase = {
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: {
              session: {
                user: { id: '123', email: 'superadmin@test.com' },
              },
            },
            error: null,
          }),
        },
      };

      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockImplementation(() => {
            // First call: check hasAdminRole (super_admin)
            // Second call: check if admin already exists
            const calls = mockServiceClient.from().select().eq().single.mock.calls.length;
            if (calls === 1) {
              return Promise.resolve({
                data: { email: 'superadmin@test.com', role: 'super_admin', is_active: true },
                error: null,
              });
            }
            return Promise.resolve({ data: null, error: { message: 'Not found' } });
          }),
          insert: jest.fn().mockReturnThis(),
        }),
        rpc: jest.fn().mockResolvedValue({}),
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);
      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await createAdminUser('newadmin@test.com', 'admin');

      expect(result.success).toBe(true);
      expect(result.message).toContain('created successfully');
    });

    it('should reject creating admin for non-super_admin', async () => {
      const mockSupabase = {
        auth: {
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

      const mockServiceClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { email: 'admin@test.com', role: 'admin', is_active: true },
            error: null,
          }),
        }),
        rpc: jest.fn().mockResolvedValue({}),
      };

      (createAdminClient as jest.Mock).mockReturnValue(mockSupabase);
      (createServiceClient as jest.Mock).mockReturnValue(mockServiceClient);

      const result = await createAdminUser('newadmin@test.com');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Permission denied');
    });
  });
});
