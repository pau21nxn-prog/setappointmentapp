# Database Migrations

This directory contains SQL migration files for the Supabase database schema.

## Running Migrations

Execute these SQL files in order in your Supabase SQL Editor:

1. `001_create_appointments_table.sql` - Creates the appointments table
2. `002_create_email_logs_table.sql` - Creates the email_logs table
3. `003_create_rls_policies.sql` - Sets up Row Level Security policies
4. `004_create_rate_limits_table.sql` - Creates rate limiting table (Supabase-based)
5. `005_create_admin_users_table.sql` - Creates admin users table
6. `006_create_status_history_table.sql` - Creates status history tracking (Phase 4)
7. `007_create_appointment_notes_table.sql` - Creates appointment notes system (Phase 4)

## Tables

### appointments

Stores all appointment booking data including:

- Personal information (name, email, phone, company)
- Business details (industry, website, current website status)
- Project details (type, description, budget, timeline)
- Requested features (array)
- Scheduling information (preferred date, time, timezone)
- Status tracking (pending, confirmed, completed, cancelled)

### email_logs

Tracks all email communications:

- Links to appointment via appointment_id
- Email type (confirmation, reminder, admin_notification, cancellation)
- Delivery status (pending, sent, delivered, failed, bounced)
- Provider details from Resend API
- Error tracking and retry logic

### admin_users (Phase 4)

Stores admin user accounts for dashboard access:

- Email-based authentication (magic link)
- Role-based access control (viewer, admin, super_admin)
- Last login tracking
- Active/inactive status

### status_history (Phase 4)

Audit trail for appointment status changes:

- Tracks all status transitions
- Records who made the change
- Optional reason for change
- Immutable audit trail (no updates/deletes)

### appointment_notes (Phase 4)

Internal admin notes for appointments:

- Private notes visible only to admins
- Created by admin email tracking
- Important flag for critical notes
- Editable/deletable by note creator only

## Row Level Security (RLS)

### Appointments Table

- **Public Insert**: Anonymous users can create appointments (booking form)
- **Public Read**: Users can read appointments matching their email (requires JWT)
- **Service Role**: Full access for server-side operations

### Email Logs Table

- **Service Role Only**: Only server-side code can access email logs
- **No Public Access**: Email logs are internal-use only

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema Diagram

```
appointments
├── id (UUID, PK)
├── created_at (TIMESTAMPTZ)
├── updated_at (TIMESTAMPTZ)
├── full_name (VARCHAR)
├── email (VARCHAR) [indexed]
├── phone (VARCHAR)
├── company_name (VARCHAR)
├── industry (VARCHAR)
├── website_url (VARCHAR)
├── current_website (BOOLEAN)
├── project_type (VARCHAR)
├── project_description (TEXT)
├── budget_range (VARCHAR)
├── timeline (VARCHAR)
├── features (TEXT[])
├── additional_notes (TEXT)
├── referral_source (VARCHAR)
├── preferred_date (DATE) [indexed]
├── preferred_time (VARCHAR)
├── timezone (VARCHAR)
├── status (VARCHAR) [indexed]
├── ip_address (INET)
└── user_agent (TEXT)

email_logs
├── id (UUID, PK)
├── created_at (TIMESTAMPTZ) [indexed]
├── appointment_id (UUID, FK → appointments.id)
├── recipient_email (VARCHAR) [indexed]
├── email_type (VARCHAR) [indexed]
├── status (VARCHAR) [indexed]
├── provider_message_id (VARCHAR)
├── provider_response (JSONB)
├── error_message (TEXT)
├── retry_count (INTEGER)
├── last_retry_at (TIMESTAMPTZ)
├── sent_at (TIMESTAMPTZ)
└── delivered_at (TIMESTAMPTZ)
```

## Indexes

Performance indexes are created on:

- `appointments.email`
- `appointments.status`
- `appointments.created_at`
- `appointments.preferred_date`
- `email_logs.appointment_id`
- `email_logs.status`
- `email_logs.email_type`
- `email_logs.created_at`
- `email_logs.recipient_email`

## Triggers

- `update_appointments_updated_at`: Automatically updates the `updated_at` timestamp on row updates
