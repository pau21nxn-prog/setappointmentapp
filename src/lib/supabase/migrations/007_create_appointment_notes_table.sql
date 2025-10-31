-- ============================================================================
-- Migration: Create Appointment Notes Table
-- ============================================================================
-- Purpose: Store internal admin notes for appointments
-- Author: Claude Code
-- Created: 2025-10-31
-- Phase: 4 - Admin Dashboard (Sprint 2)
-- ============================================================================

-- Create appointment_notes table
CREATE TABLE IF NOT EXISTS public.appointment_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  created_by VARCHAR(255) NOT NULL, -- Email of admin who created the note
  is_important BOOLEAN DEFAULT false, -- Flag for important notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT note_not_empty CHECK (LENGTH(TRIM(note_text)) > 0),
  CONSTRAINT note_max_length CHECK (LENGTH(note_text) <= 5000)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointment_notes_appointment_id
  ON public.appointment_notes(appointment_id);

CREATE INDEX IF NOT EXISTS idx_appointment_notes_created_at
  ON public.appointment_notes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_appointment_notes_created_by
  ON public.appointment_notes(created_by);

CREATE INDEX IF NOT EXISTS idx_appointment_notes_important
  ON public.appointment_notes(is_important)
  WHERE is_important = true;

-- Add comments
COMMENT ON TABLE public.appointment_notes IS 'Internal admin notes for appointments (not visible to clients)';
COMMENT ON COLUMN public.appointment_notes.appointment_id IS 'Reference to the appointment';
COMMENT ON COLUMN public.appointment_notes.note_text IS 'The note content (max 5000 characters)';
COMMENT ON COLUMN public.appointment_notes.created_by IS 'Email of admin who created the note';
COMMENT ON COLUMN public.appointment_notes.is_important IS 'Flag to highlight important notes';

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_appointment_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_appointment_notes_updated_at_trigger
  BEFORE UPDATE ON public.appointment_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_appointment_notes_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointment_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appointment_notes
-- Admin users can view all notes
CREATE POLICY "Admin users can view notes"
  ON public.appointment_notes
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin users can insert notes
CREATE POLICY "Admin users can insert notes"
  ON public.appointment_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admin users can update their own notes
CREATE POLICY "Admin users can update their own notes"
  ON public.appointment_notes
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.jwt() ->> 'email')
  WITH CHECK (created_by = auth.jwt() ->> 'email');

-- Admin users can delete their own notes
CREATE POLICY "Admin users can delete their own notes"
  ON public.appointment_notes
  FOR DELETE
  TO authenticated
  USING (created_by = auth.jwt() ->> 'email');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointment_notes TO authenticated;

-- ============================================================================
-- Migration Complete
-- ============================================================================
