-- Calendar Integrations Table
-- =============================================================================
-- Stores Google Calendar and Outlook Calendar OAuth tokens for admins
-- Phase: 4 - Sprint 4
-- =============================================================================

CREATE TABLE IF NOT EXISTS calendar_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook')),
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (admin_email, provider)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_calendar_integrations_admin_email
  ON calendar_integrations(admin_email);

CREATE INDEX IF NOT EXISTS idx_calendar_integrations_provider
  ON calendar_integrations(provider);

-- Add calendar event IDs to appointments table
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS google_calendar_event_id TEXT,
  ADD COLUMN IF NOT EXISTS outlook_calendar_event_id TEXT,
  ADD COLUMN IF NOT EXISTS calendar_synced_at TIMESTAMP WITH TIME ZONE;

-- Add index for calendar event lookups
CREATE INDEX IF NOT EXISTS idx_appointments_google_event
  ON appointments(google_calendar_event_id) WHERE google_calendar_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_appointments_outlook_event
  ON appointments(outlook_calendar_event_id) WHERE outlook_calendar_event_id IS NOT NULL;

-- Comments
COMMENT ON TABLE calendar_integrations IS 'Stores OAuth tokens for Google/Outlook Calendar integration';
COMMENT ON COLUMN appointments.google_calendar_event_id IS 'Google Calendar event ID for synced appointments';
COMMENT ON COLUMN appointments.outlook_calendar_event_id IS 'Outlook Calendar event ID for synced appointments';
COMMENT ON COLUMN appointments.calendar_synced_at IS 'Last time appointment was synced to calendar';
