-- ============================================================================
-- Migration: Create Status History Table
-- ============================================================================
-- Purpose: Track all status changes for appointments
-- Author: Claude Code
-- Created: 2025-10-31
-- Phase: 4 - Admin Dashboard (Sprint 2)
-- ============================================================================

-- Create status_history table
CREATE TABLE IF NOT EXISTS public.status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  previous_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255), -- Email of admin who made the change
  change_reason TEXT, -- Optional reason for status change
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_previous_status CHECK (
    previous_status IS NULL OR
    previous_status IN ('pending', 'confirmed', 'completed', 'cancelled')
  ),
  CONSTRAINT valid_new_status CHECK (
    new_status IN ('pending', 'confirmed', 'completed', 'cancelled')
  )
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_status_history_appointment_id
  ON public.status_history(appointment_id);

CREATE INDEX IF NOT EXISTS idx_status_history_created_at
  ON public.status_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_status_history_changed_by
  ON public.status_history(changed_by);

-- Add comments
COMMENT ON TABLE public.status_history IS 'Tracks all status changes for appointments with audit trail';
COMMENT ON COLUMN public.status_history.appointment_id IS 'Reference to the appointment';
COMMENT ON COLUMN public.status_history.previous_status IS 'Status before the change (NULL for initial status)';
COMMENT ON COLUMN public.status_history.new_status IS 'Status after the change';
COMMENT ON COLUMN public.status_history.changed_by IS 'Email of admin who changed the status';
COMMENT ON COLUMN public.status_history.change_reason IS 'Optional reason for the status change';

-- Enable Row Level Security (RLS)
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for status_history
-- Admin users can view all status history
CREATE POLICY "Admin users can view status history"
  ON public.status_history
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin users can insert status history
CREATE POLICY "Admin users can insert status history"
  ON public.status_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- No updates or deletes allowed (audit trail must be immutable)
CREATE POLICY "No updates allowed on status history"
  ON public.status_history
  FOR UPDATE
  USING (false);

CREATE POLICY "No deletes allowed on status history"
  ON public.status_history
  FOR DELETE
  USING (false);

-- Grant permissions
GRANT SELECT, INSERT ON public.status_history TO authenticated;
GRANT SELECT, INSERT ON public.status_history TO anon;

-- ============================================================================
-- Migration Complete
-- ============================================================================
