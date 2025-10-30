-- =====================================================
-- Migration: Create Admin Users Table
-- =====================================================
-- Description: Stores admin user information and roles
-- Used by: Admin authentication system
-- Created: 2025-10-30
-- Phase: 4 - Admin Dashboard
-- =====================================================

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Email validation
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),

  -- Role validation
  CONSTRAINT valid_role CHECK (role IN ('admin', 'super_admin', 'viewer'))
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email
ON public.admin_users(email);

-- Create index for active admins
CREATE INDEX IF NOT EXISTS idx_admin_users_active
ON public.admin_users(is_active)
WHERE is_active = true;

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admin users can read their own data
CREATE POLICY "Admin users can read their own data"
ON public.admin_users
FOR SELECT
TO authenticated
USING (auth.email() = email AND is_active = true);

-- RLS Policy: Super admins can manage all admin users
CREATE POLICY "Super admins can manage admin users"
ON public.admin_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = auth.email()
    AND role = 'super_admin'
    AND is_active = true
  )
);

-- RLS Policy: Service role has full access (for API routes)
CREATE POLICY "Service role can manage admin users"
ON public.admin_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_admin_user_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_admin_user_timestamp
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION update_admin_user_updated_at();

-- Create function to update last_login_at
CREATE OR REPLACE FUNCTION update_admin_last_login(admin_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.admin_users
  SET last_login_at = NOW()
  WHERE email = admin_email AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_admin_last_login(TEXT) TO authenticated;

-- Add comments to table and columns
COMMENT ON TABLE public.admin_users IS 'Stores admin user information for dashboard access';
COMMENT ON COLUMN public.admin_users.email IS 'Admin email address (must match Supabase Auth email)';
COMMENT ON COLUMN public.admin_users.role IS 'Admin role: admin (default), super_admin (full access), viewer (read-only)';
COMMENT ON COLUMN public.admin_users.is_active IS 'Whether admin account is active';
COMMENT ON COLUMN public.admin_users.last_login_at IS 'Last successful login timestamp';

-- =====================================================
-- Initial Data: Insert Admin User
-- =====================================================
-- Insert the first admin user (using EMAIL_ADMIN from env)
-- Replace 'admin@yourdomain.com' with your actual admin email
-- This user will be created with 'super_admin' role

-- IMPORTANT: Update this email to match your EMAIL_ADMIN environment variable
-- INSERT INTO public.admin_users (email, role)
-- VALUES ('admin@yourdomain.com', 'super_admin')
-- ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- Migration Complete
-- =====================================================
-- Next Steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Manually insert your admin email (uncomment INSERT above)
-- 3. Create Supabase Auth user with same email via magic link
-- 4. Test admin authentication
-- =====================================================
