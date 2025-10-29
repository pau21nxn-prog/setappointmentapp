-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Appointments Table RLS Policies

-- Policy: Allow public to insert appointments (for booking form)
CREATE POLICY "Allow public insert on appointments"
  ON public.appointments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow public to read their own appointments by email
CREATE POLICY "Allow users to read their own appointments"
  ON public.appointments
  FOR SELECT
  TO anon
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Service role has full access (for admin operations)
CREATE POLICY "Service role has full access to appointments"
  ON public.appointments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Email Logs Table RLS Policies

-- Policy: Only service role can access email logs (internal use only)
CREATE POLICY "Service role has full access to email_logs"
  ON public.email_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Block all public access to email logs
CREATE POLICY "Block public access to email_logs"
  ON public.email_logs
  FOR ALL
  TO anon
  USING (false);

-- Add additional security constraints
ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_email_check
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));

ALTER TABLE public.email_logs
  ADD CONSTRAINT email_logs_status_check
  CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced'));

ALTER TABLE public.email_logs
  ADD CONSTRAINT email_logs_type_check
  CHECK (email_type IN ('confirmation', 'reminder', 'admin_notification', 'cancellation'));

-- Comments on policies
COMMENT ON POLICY "Allow public insert on appointments" ON public.appointments
  IS 'Allows anonymous users to create appointment bookings through the form';

COMMENT ON POLICY "Service role has full access to appointments" ON public.appointments
  IS 'Allows server-side code with service role to manage all appointments';

COMMENT ON POLICY "Service role has full access to email_logs" ON public.email_logs
  IS 'Restricts email log access to server-side operations only';
