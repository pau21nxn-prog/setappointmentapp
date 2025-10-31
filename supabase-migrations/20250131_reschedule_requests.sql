-- Reschedule Requests Table
-- =============================================================================
-- Stores client requests to reschedule appointments
-- Phase: 4 - Sprint 5
-- =============================================================================

CREATE TABLE IF NOT EXISTS reschedule_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  requested_by TEXT NOT NULL CHECK (requested_by IN ('client', 'admin')),
  old_date_time TIMESTAMP WITH TIME ZONE,
  new_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  handled_by_email TEXT,
  handled_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_reschedule_requests_appointment
  ON reschedule_requests(appointment_id);

CREATE INDEX IF NOT EXISTS idx_reschedule_requests_status
  ON reschedule_requests(status);

CREATE INDEX IF NOT EXISTS idx_reschedule_requests_created
  ON reschedule_requests(created_at DESC);

-- Add scheduled_date_time to appointments table
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS scheduled_date_time TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS original_scheduled_date_time TIMESTAMP WITH TIME ZONE;

-- Comments
COMMENT ON TABLE reschedule_requests IS 'Tracks requests to reschedule appointments from clients or admins';
COMMENT ON COLUMN reschedule_requests.requested_by IS 'Who initiated the reschedule request';
COMMENT ON COLUMN reschedule_requests.old_date_time IS 'Previous scheduled time (if any)';
COMMENT ON COLUMN reschedule_requests.new_date_time IS 'Requested new time';
COMMENT ON COLUMN reschedule_requests.status IS 'pending, approved, or rejected';
COMMENT ON COLUMN appointments.scheduled_date_time IS 'Actual scheduled date/time for the appointment';
COMMENT ON COLUMN appointments.original_scheduled_date_time IS 'Original scheduled time before any reschedules';
