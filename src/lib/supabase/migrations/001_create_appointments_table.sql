-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Personal Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company_name VARCHAR(255),

  -- Business Details
  industry VARCHAR(100),
  website_url VARCHAR(500),
  current_website BOOLEAN DEFAULT false,

  -- Project Details
  project_type VARCHAR(100) NOT NULL,
  project_description TEXT NOT NULL,
  budget_range VARCHAR(50) NOT NULL,
  timeline VARCHAR(50) NOT NULL,

  -- Additional Information
  features TEXT[], -- Array of requested features
  additional_notes TEXT,
  referral_source VARCHAR(100),

  -- Scheduling
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(50) NOT NULL,
  timezone VARCHAR(100) NOT NULL,

  -- Status
  status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  -- status values: pending, confirmed, completed, cancelled

  -- Metadata
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_appointments_email ON public.appointments(email);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_created_at ON public.appointments(created_at DESC);
CREATE INDEX idx_appointments_preferred_date ON public.appointments(preferred_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.appointments IS 'Stores appointment booking information for client consultations';
COMMENT ON COLUMN public.appointments.status IS 'Appointment status: pending, confirmed, completed, cancelled';
COMMENT ON COLUMN public.appointments.features IS 'Array of requested features for the project';
