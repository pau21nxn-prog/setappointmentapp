/**
 * Admin Authentication Utilities
 * =============================================================================
 * Provides authentication functions for admin dashboard using Supabase Auth
 * Uses magic link (passwordless) authentication for security
 *
 * Last Updated: 2025-10-30
 * Phase: 4 - Admin Dashboard
 * =============================================================================
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin user interface
 */
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin' | 'viewer';
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Admin session interface
 */
export interface AdminSession {
  user: AdminUser;
  authUser: {
    id: string;
    email: string;
  };
}

/**
 * Create a Supabase client for server-side operations
 * Uses cookies for session management
 */
export function createAdminClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie errors (e.g., in middleware)
            console.error('Error setting cookie:', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie errors
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase client with service role (bypasses RLS)
 * Use only for admin operations that require elevated permissions
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Send magic link to admin email for passwordless login
 *
 * @param email - Admin email address
 * @param redirectTo - URL to redirect after authentication (optional)
 * @returns Success status and message
 */
export async function sendAdminMagicLink(
  email: string,
  redirectTo?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createAdminClient();

    // Check if email is registered as admin
    const serviceClient = createServiceClient();
    const { data: adminUser, error: adminError } = await serviceClient
      .from('admin_users')
      .select('email, is_active')
      .eq('email', email)
      .single();

    if (adminError || !adminUser) {
      return {
        success: false,
        message: 'This email is not registered as an admin.',
      };
    }

    if (!adminUser.is_active) {
      return {
        success: false,
        message: 'This admin account is inactive. Please contact support.',
      };
    }

    // Send magic link
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // IMPORTANT: Redirect to API route (not page) so cookies can be set properly
        emailRedirectTo: redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/auth/callback`,
        shouldCreateUser: false, // Don't create new users, only allow existing
      },
    });

    if (signInError) {
      console.error('Magic link error:', signInError);
      return {
        success: false,
        message: 'Failed to send magic link. Please try again.',
      };
    }

    return {
      success: true,
      message: 'Magic link sent! Check your email to login.',
    };
  } catch (error) {
    console.error('Send magic link error:', error);
    return {
      success: false,
      message: 'An error occurred. Please try again.',
    };
  }
}

/**
 * Get current admin session
 * Checks both Supabase auth and admin_users table
 *
 * @returns Admin session or null if not authenticated
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const supabase = createAdminClient();

    // Get Supabase auth session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return null;
    }

    // Check if user is in admin_users table
    const serviceClient = createServiceClient();
    const { data: adminUser, error: adminError } = await serviceClient
      .from('admin_users')
      .select('*')
      .eq('email', session.user.email)
      .eq('is_active', true)
      .single();

    if (adminError || !adminUser) {
      // User is authenticated but not an admin
      return null;
    }

    // Update last login time
    await serviceClient.rpc('update_admin_last_login', {
      admin_email: session.user.email!,
    });

    return {
      user: adminUser as AdminUser,
      authUser: {
        id: session.user.id,
        email: session.user.email!,
      },
    };
  } catch (error) {
    console.error('Get admin session error:', error);
    return null;
  }
}

/**
 * Check if current user is an admin
 * Lightweight check - use getAdminSession() for full details
 *
 * @returns True if user is an authenticated admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

/**
 * Check if current user has a specific role
 *
 * @param requiredRole - Required role to check
 * @returns True if user has the required role or higher
 */
export async function hasAdminRole(
  requiredRole: 'viewer' | 'admin' | 'super_admin'
): Promise<boolean> {
  const session = await getAdminSession();

  if (!session) {
    return false;
  }

  const roleHierarchy = {
    viewer: 0,
    admin: 1,
    super_admin: 2,
  };

  const userLevel = roleHierarchy[session.user.role];
  const requiredLevel = roleHierarchy[requiredRole];

  return userLevel >= requiredLevel;
}

/**
 * Sign out admin user
 * Clears auth session and redirects to login
 *
 * @returns Success status
 */
export async function signOutAdmin(): Promise<{ success: boolean }> {
  try {
    const supabase = createAdminClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false };
  }
}

/**
 * Get admin user by email (service role only)
 * Used for admin management operations
 *
 * @param email - Admin email to look up
 * @returns Admin user or null
 */
export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  try {
    const serviceClient = createServiceClient();

    const { data, error } = await serviceClient
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return data as AdminUser;
  } catch (error) {
    console.error('Get admin by email error:', error);
    return null;
  }
}

/**
 * List all admin users (super admin only)
 *
 * @returns List of admin users
 */
export async function listAdminUsers(): Promise<AdminUser[]> {
  try {
    // Check if current user is super admin
    const hasPermission = await hasAdminRole('super_admin');

    if (!hasPermission) {
      return [];
    }

    const serviceClient = createServiceClient();

    const { data, error } = await serviceClient
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as AdminUser[];
  } catch (error) {
    console.error('List admin users error:', error);
    return [];
  }
}

/**
 * Create new admin user (super admin only)
 *
 * @param email - New admin email
 * @param role - Admin role (default: 'admin')
 * @returns Success status and admin user
 */
export async function createAdminUser(
  email: string,
  role: 'admin' | 'viewer' = 'admin'
): Promise<{ success: boolean; user?: AdminUser; message: string }> {
  try {
    // Check if current user is super admin
    const hasPermission = await hasAdminRole('super_admin');

    if (!hasPermission) {
      return {
        success: false,
        message: 'Permission denied. Only super admins can create admin users.',
      };
    }

    const serviceClient = createServiceClient();

    // Check if admin already exists
    const { data: existing } = await serviceClient
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      return {
        success: false,
        message: 'Admin user with this email already exists.',
      };
    }

    // Create admin user
    const { data, error } = await serviceClient
      .from('admin_users')
      .insert({
        email,
        role,
        is_active: true,
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Create admin error:', error);
      return {
        success: false,
        message: 'Failed to create admin user.',
      };
    }

    return {
      success: true,
      user: data as AdminUser,
      message: 'Admin user created successfully.',
    };
  } catch (error) {
    console.error('Create admin user error:', error);
    return {
      success: false,
      message: 'An error occurred while creating admin user.',
    };
  }
}
