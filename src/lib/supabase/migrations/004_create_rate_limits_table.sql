-- =====================================================
-- Migration: Create Rate Limits Table
-- =====================================================
-- Description: Stores rate limit counters per IP address
-- Used by: Rate limiting middleware
-- Created: 2025-10-30
-- Phase: 3 - Alternative to Redis/Upstash
-- =====================================================

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user identifier
  endpoint TEXT NOT NULL, -- 'form' or 'api'
  count INTEGER NOT NULL DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Composite unique constraint for identifier + endpoint
  CONSTRAINT unique_rate_limit UNIQUE(identifier, endpoint)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_endpoint
ON public.rate_limits(identifier, endpoint);

-- Create index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at
ON public.rate_limits(reset_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow service role to manage rate limits
-- Only server-side code with service role key can access
CREATE POLICY "Service role can manage rate limits"
ON public.rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_rate_limit_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_rate_limit_timestamp
BEFORE UPDATE ON public.rate_limits
FOR EACH ROW
EXECUTE FUNCTION update_rate_limit_updated_at();

-- Create function to clean up expired rate limits
-- This keeps the table small and performant
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.rate_limits
  WHERE reset_at < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION cleanup_expired_rate_limits() TO service_role;

-- Add comment to table
COMMENT ON TABLE public.rate_limits IS 'Stores rate limiting counters for API endpoints and form submissions';
COMMENT ON COLUMN public.rate_limits.identifier IS 'IP address or unique client identifier';
COMMENT ON COLUMN public.rate_limits.endpoint IS 'Endpoint type: form (3/hour) or api (10/min)';
COMMENT ON COLUMN public.rate_limits.count IS 'Number of requests made in current window';
COMMENT ON COLUMN public.rate_limits.reset_at IS 'When the rate limit counter resets';

-- =====================================================
-- Migration Complete
-- =====================================================
-- Next Steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Update middleware to use Supabase rate limiting
-- 3. Optional: Set up pg_cron to run cleanup_expired_rate_limits()
-- =====================================================
