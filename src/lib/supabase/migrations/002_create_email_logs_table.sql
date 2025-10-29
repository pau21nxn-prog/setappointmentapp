-- Create email_logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Email Details
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  recipient_email VARCHAR(255) NOT NULL,
  email_type VARCHAR(50) NOT NULL,
  -- email_type values: confirmation, reminder, admin_notification, cancellation

  -- Delivery Status
  status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  -- status values: pending, sent, delivered, failed, bounced

  -- Provider Details (Resend)
  provider_message_id VARCHAR(255),
  provider_response JSONB,

  -- Error Tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMPTZ,

  -- Metadata
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX idx_email_logs_appointment_id ON public.email_logs(appointment_id);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);
CREATE INDEX idx_email_logs_email_type ON public.email_logs(email_type);
CREATE INDEX idx_email_logs_created_at ON public.email_logs(created_at DESC);
CREATE INDEX idx_email_logs_recipient_email ON public.email_logs(recipient_email);

-- Add comments
COMMENT ON TABLE public.email_logs IS 'Tracks all email communications sent through the application';
COMMENT ON COLUMN public.email_logs.email_type IS 'Type of email: confirmation, reminder, admin_notification, cancellation';
COMMENT ON COLUMN public.email_logs.status IS 'Delivery status: pending, sent, delivered, failed, bounced';
COMMENT ON COLUMN public.email_logs.provider_response IS 'JSON response from email provider (Resend)';
