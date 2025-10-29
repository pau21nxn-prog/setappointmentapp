# Database Schema

> **File**: `.claude/reference/DATABASE.md`
> **Last Updated**: October 29, 2025

---

## Tables Overview

The database consists of two main tables:

1. **appointments** - Stores appointment bookings
2. **email_logs** - Tracks email delivery

---

## Appointments Table

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company_name VARCHAR(255),
  business_nature TEXT NOT NULL,
  system_request VARCHAR(255) NOT NULL,
  custom_request TEXT,
  video_platform VARCHAR(50) NOT NULL,
  budget_range VARCHAR(50),
  appointment_date DATE NOT NULL,
  time_slot VARCHAR(20) NOT NULL CHECK (time_slot IN ('morning', 'afternoon', 'evening')),
  timezone VARCHAR(100) NOT NULL,
  additional_notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_appointments_email ON appointments(email);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
```

---

## Email Logs Table

```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL CHECK (email_type IN ('confirmation', 'reminder', 'admin_notification')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- Index
CREATE INDEX idx_email_logs_appointment ON email_logs(appointment_id);
```

---

## TypeScript Types

```typescript
// types/database.ts
export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          company_name: string | null;
          business_nature: string;
          system_request: string;
          custom_request: string | null;
          video_platform: string;
          budget_range: string | null;
          appointment_date: string;
          time_slot: 'morning' | 'afternoon' | 'evening';
          timezone: string;
          additional_notes: string | null;
          status: 'scheduled' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Insert>;
      };
      email_logs: {
        Row: {
          id: string;
          appointment_id: string;
          email_type: 'confirmation' | 'reminder' | 'admin_notification';
          sent_at: string;
          status: 'sent' | 'failed';
          error_message: string | null;
        };
        Insert: Omit<Row, 'id' | 'sent_at'>;
        Update: Partial<Insert>;
      };
    };
  };
}
```

---

## Supabase Queries

```typescript
// lib/supabase/queries.ts
import { supabase } from './client';
import type { Database } from '@/types/database';

type Appointment = Database['public']['Tables']['appointments']['Row'];
type CreateAppointmentInput = Database['public']['Tables']['appointments']['Insert'];

/**
 * Creates a new appointment in the database
 */
export async function createAppointment(data: CreateAppointmentInput): Promise<Appointment> {
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create appointment: ${error.message}`);
  }

  return appointment;
}

/**
 * Retrieves all appointments
 */
export async function getAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch appointments: ${error.message}`);
  }

  return data || [];
}

/**
 * Logs email sending attempt
 */
export async function logEmail(
  appointmentId: string,
  emailType: 'confirmation' | 'reminder' | 'admin_notification',
  status: 'sent' | 'failed',
  errorMessage?: string
) {
  const { error } = await supabase.from('email_logs').insert({
    appointment_id: appointmentId,
    email_type: emailType,
    status,
    error_message: errorMessage || null,
  });

  if (error) {
    console.error('Failed to log email:', error);
  }
}
```

---

[Return to Main Index](../CLAUDE.md)
