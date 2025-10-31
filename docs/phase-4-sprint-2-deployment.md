# Phase 4 Sprint 2 - Production Deployment Guide

**Deployment Date:** 2025-10-31
**Version:** 0.3.0 (Phase 4 Sprint 2)
**Branch:** main

---

## ⚠️ CRITICAL: Database Migrations Required

**This deployment requires running database migrations BEFORE the code is deployed.**

The new admin dashboard features depend on two new database tables:

- `status_history` - Audit trail for appointment status changes
- `appointment_notes` - Internal admin notes

### Migration Sequence (IMPORTANT)

**Option A: Safe Deployment (Recommended)**

1. Run database migrations FIRST (steps below)
2. Verify tables exist in Supabase
3. Push code to GitHub (triggers Vercel deployment)
4. Verify deployment

**Option B: Quick Deployment (Advanced)**

1. Push code to GitHub (triggers deployment)
2. Immediately run migrations while deployment is building
3. Deployment will be ready when migrations complete

---

## Step 1: Run Database Migrations

### Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Migration 1: Create status_history Table

Copy and paste this SQL:

```sql
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
```

**Verify:** Check that you see "Success. No rows returned" or similar confirmation.

### Migration 2: Create appointment_notes Table

Copy and paste this SQL:

```sql
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
```

**Verify:** Check that you see "Success. No rows returned" or similar confirmation.

### Verify Migrations

After running both migrations, verify the tables exist:

1. Go to **Table Editor** in Supabase dashboard
2. You should see two new tables:
   - `status_history`
   - `appointment_notes`
3. Click each table to verify columns and structure

---

## Step 2: Verify Environment Variables

Ensure these environment variables are set in Vercel Production:

### Existing Variables (Should Already Be Set)

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

### New Variables Required for Email Integration

- ⚠️ `RESEND_API_KEY` - Your Resend API key (re_xxxxxxxxxxxx)
- ⚠️ `EMAIL_FROM` - Sender email (e.g., noreply@yourdomain.com)
- ⚠️ `EMAIL_ADMIN` - Admin reply-to email (e.g., admin@yourdomain.com)

### Add Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add any missing variables
5. Ensure they are set for **Production** environment

---

## Step 3: Deploy to Production

### Push Code to GitHub

The code will be automatically deployed to Vercel when pushed to `main` branch:

```bash
git push origin main
```

This will trigger:

- Vercel automatic deployment
- Build process (~2-3 minutes)
- Deployment to production

---

## Step 4: Monitor Deployment

### Watch Vercel Deployment

1. Go to [Vercel Dashboard](https://vercel.com/)
2. Click on your project
3. Watch the **Deployments** tab
4. Click on the running deployment to see live logs

### Expected Build Output

```
✓ Compiled successfully
Route /admin/appointments/[id]: 4.53 kB (First Load: 101 kB)
✓ Generating static pages (15/15)
✓ Finalizing page optimization
```

### Deployment Time

- **Expected:** 2-3 minutes
- **Build:** ~90 seconds
- **Deploy:** ~60 seconds

---

## Step 5: Verify Production Deployment

### Functional Tests

After deployment completes, test these critical paths:

#### 1. Admin Login

- URL: https://setappointmentapp.vercel.app/admin/login
- Test: Request magic link email
- Verify: Email arrives and login works

#### 2. Admin Dashboard

- URL: https://setappointmentapp.vercel.app/admin/dashboard
- Verify: Dashboard loads with stats

#### 3. Appointments List

- URL: https://setappointmentapp.vercel.app/admin/appointments
- Verify: List displays appointments

#### 4. Appointment Detail (NEW)

- Click any appointment
- Verify: Detail page loads with 6 panels
- Verify: Quick actions sidebar appears

#### 5. Status Management (NEW)

- Click "Update Status" button
- Verify: Modal opens with 4 status options
- Test: Change status with reason
- Verify: Status history updates in timeline

#### 6. Notes System (NEW)

- Click "Add Note" button
- Verify: Modal opens
- Test: Add note with important flag
- Verify: Note appears in notes section
- Test: Edit and delete own notes

#### 7. Email Integration (NEW)

- Click "Send Email" button
- Verify: Modal opens with 4 templates
- Select "Confirmation" template
- Test: Send email
- Verify: Email appears in email history
- Verify: Client receives email

### Database Verification

Check Supabase dashboard:

1. **status_history table**
   - Should have records after status updates
   - Verify RLS policies prevent updates/deletes

2. **appointment_notes table**
   - Should have records after adding notes
   - Verify creator can edit/delete own notes

3. **email_logs table**
   - Should have new records for admin emails
   - Verify status: 'sent' and provider_message_id

### Performance Check

- Run Lighthouse audit on admin pages
- Verify no console errors
- Check Network tab for failed requests

---

## Rollback Plan (If Needed)

If critical issues are found:

### Option 1: Revert Deployment in Vercel

1. Go to Vercel **Deployments**
2. Find previous stable deployment
3. Click **...** menu → **Promote to Production**

### Option 2: Rollback Git Commits

```bash
# Revert to previous commit
git revert HEAD~5..HEAD
git push origin main
```

### Option 3: Keep Tables, Disable Features

- Tables won't cause issues if unused
- Can rollback code without dropping tables
- Data is preserved for when code is redeployed

---

## Post-Deployment Checklist

After successful deployment:

- [ ] All 7 functional tests pass
- [ ] Database tables exist and contain data
- [ ] Email integration works (test email sent/received)
- [ ] No console errors in production
- [ ] Admin dashboard fully functional
- [ ] Performance acceptable (Lighthouse > 85)
- [ ] Update deployment log with timestamp
- [ ] Document any issues encountered
- [ ] Consider announcements if needed

---

## New Features in Production

After this deployment, the following features will be live:

### For Admins

1. **Comprehensive Appointment Details**
   - View all client information in organized panels
   - Access contact information with click-to-call/email

2. **Status Management**
   - Update appointment status with optional reason
   - View complete status history timeline
   - Track who made changes and when

3. **Internal Notes**
   - Add private notes for appointments
   - Flag important notes for visibility
   - Edit and delete own notes

4. **Professional Email Communication**
   - Send confirmation emails
   - Request rescheduling
   - Send project updates
   - Send custom messages
   - Track email history

### Technical Improvements

- Immutable audit trail for status changes
- Row Level Security on all new tables
- Professional email templates
- Real-time updates with optimistic UI
- Modal-based interactions
- Comprehensive error handling

---

## Support & Troubleshooting

### Common Issues

**Issue: Tables don't exist**

- Solution: Run database migrations from Step 1

**Issue: Email sending fails**

- Check RESEND_API_KEY is set in Vercel
- Verify EMAIL_FROM is a valid sender address
- Check Resend dashboard for errors

**Issue: RLS policies block operations**

- Verify admin user is authenticated
- Check Supabase auth logs
- Ensure policies allow authenticated users

**Issue: Deployment fails**

- Check Vercel deployment logs
- Verify build completes locally: `npm run build`
- Check for TypeScript errors

### Contact

- Developer: Claude Code
- Documentation: docs/phase-4-sprint-2-summary.md
- Issues: GitHub Issues

---

## Deployment Log

**Prepared By:** Claude Code
**Prepared Date:** 2025-10-31
**Deployment Status:** Ready for execution
**Estimated Downtime:** None (zero-downtime deployment)

---

**Ready to deploy when migrations are complete!**
