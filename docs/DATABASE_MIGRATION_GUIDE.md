# Database Migration Quick-Start Guide

**Project:** SetAppointmentApp
**Status:** 🔴 CRITICAL - Must be done immediately after deployment

---

## ⚠️ WHY THIS IS CRITICAL

Your production database currently has **NO TABLES**. Without running these migrations:

- ❌ Cannot store appointment bookings
- ❌ Cannot track email delivery
- ❌ Cannot test form submissions
- ❌ Application will crash when trying to access database

**Time Required:** 5-10 minutes
**Difficulty:** Easy (copy-paste SQL)

---

## 📋 MIGRATION FILES

Your project includes 3 migration files that must be run IN ORDER:

1. **001_create_appointments_table.sql** - Creates main appointments table
2. **002_create_email_logs_table.sql** - Creates email tracking table
3. **003_create_rls_policies.sql** - Enables security policies

**Location:** `src/lib/supabase/migrations/`

---

## 🚀 STEP-BY-STEP INSTRUCTIONS

### Step 1: Access Supabase Dashboard

1. **Open Supabase in browser:**

   ```
   https://app.supabase.com
   ```

2. **Log in to your account**

3. **Select your project:**
   - Project name: `admhufdnjkbkdyrfalck`
   - URL: https://admhufdnjkbkdyrfalck.supabase.co

---

### Step 2: Open SQL Editor

1. **Click "SQL Editor" in left sidebar**
   - Icon looks like `</>` or document symbol

2. **Click "+ New Query"** button (top right)
   - This opens a blank SQL editor

---

### Step 3: Run Migration 001 - Create Appointments Table

1. **Open migration file in your code editor:**

   ```
   src/lib/supabase/migrations/001_create_appointments_table.sql
   ```

2. **Copy ENTIRE contents** (Ctrl+A, Ctrl+C)

3. **Paste into Supabase SQL Editor** (Ctrl+V)

4. **Click "Run" button** (bottom right) or press `Ctrl+Enter`

5. **Wait for success message:**

   ```
   Success. No rows returned
   ```

6. **✅ If you see this:** Migration 001 complete!

7. **❌ If you see an error:**
   - Read the error message carefully
   - Common issues:
     - Table already exists → Safe to ignore OR drop table first
     - Syntax error → Check you copied entire file
   - Fix error and re-run

---

### Step 4: Run Migration 002 - Create Email Logs Table

1. **Click "+ New Query" again** (to start fresh editor)

2. **Open second migration file:**

   ```
   src/lib/supabase/migrations/002_create_email_logs_table.sql
   ```

3. **Copy ENTIRE contents** (Ctrl+A, Ctrl+C)

4. **Paste into Supabase SQL Editor** (Ctrl+V)

5. **Click "Run" button** or press `Ctrl+Enter`

6. **Wait for success message:**

   ```
   Success. No rows returned
   ```

7. **✅ If you see this:** Migration 002 complete!

---

### Step 5: Run Migration 003 - Create RLS Policies

1. **Click "+ New Query" again**

2. **Open third migration file:**

   ```
   src/lib/supabase/migrations/003_create_rls_policies.sql
   ```

3. **Copy ENTIRE contents** (Ctrl+A, Ctrl+C)

4. **Paste into Supabase SQL Editor** (Ctrl+V)

5. **Click "Run" button** or press `Ctrl+Enter`

6. **Wait for success message:**

   ```
   Success. No rows returned
   ```

7. **✅ If you see this:** Migration 003 complete!

---

### Step 6: Verify Tables Were Created

1. **Click "Table Editor" in left sidebar**
   - Icon looks like a table/grid

2. **You should see TWO tables:**
   - ✅ `appointments`
   - ✅ `email_logs`

3. **Click on `appointments` table**
   - Should show table structure with columns:
     - id (uuid)
     - full_name (text)
     - email (text)
     - phone (text)
     - company_name (text)
     - website_url (text)
     - industry (text)
     - project_type (text)
     - budget_range (text)
     - timeline (text)
     - project_description (text)
     - preferred_date (date)
     - preferred_time (text)
     - status (text)
     - notes (text)
     - created_at (timestamp)
     - updated_at (timestamp)

4. **Click on `email_logs` table**
   - Should show table structure with columns:
     - id (uuid)
     - appointment_id (uuid)
     - email_type (text)
     - recipient_email (text)
     - subject (text)
     - body_preview (text)
     - delivery_status (text)
     - provider_response (jsonb)
     - sent_at (timestamp)
     - created_at (timestamp)

---

### Step 7: Verify Row Level Security (RLS) is Enabled

1. **Still in Table Editor, click `appointments` table**

2. **Look for "RLS" indicator**
   - Should show: `RLS enabled` or green checkmark
   - If shows `RLS disabled` → Something went wrong with migration 003

3. **Click "View policies" link** (if available)
   - Should see policies created:
     - `allow_insert` - Allows anyone to insert appointments
     - `allow_select` - Allows anyone to read their own appointments
     - `service_role_full_access` - Allows server to do everything

4. **Repeat check for `email_logs` table**
   - RLS should be enabled
   - Should have `service_role_only` policy

---

## ✅ SUCCESS CRITERIA

You've successfully completed migrations if ALL of these are true:

- [ ] All 3 SQL migrations executed without errors
- [ ] `appointments` table exists with 17 columns
- [ ] `email_logs` table exists with 10 columns
- [ ] RLS is ENABLED on `appointments` table
- [ ] RLS is ENABLED on `email_logs` table
- [ ] RLS policies exist on both tables
- [ ] No error messages in SQL Editor

---

## 🆘 TROUBLESHOOTING

### Error: "relation appointments already exists"

**Cause:** Table was already created (maybe from previous attempt)

**Solution Option 1** - Drop and recreate (ONLY if table is empty):

```sql
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;

-- Then re-run migrations 001, 002, 003
```

**Solution Option 2** - Skip to next migration:

- This error is safe to ignore
- Continue with next migration file

---

### Error: "permission denied for schema public"

**Cause:** Current user doesn't have permissions

**Solution:**

1. Check you're logged in with correct account
2. Verify you selected correct project
3. Try running as superuser:

```sql
-- Add this line BEFORE the migration SQL:
SET ROLE postgres;

-- Then paste migration SQL
```

---

### Error: "syntax error at or near..."

**Cause:** SQL syntax issue or incomplete paste

**Solution:**

1. Ensure you copied ENTIRE file (Ctrl+A)
2. Check no characters were cut off at beginning/end
3. Try copying and pasting again
4. Open file in text editor to verify contents

---

### Error: "column XYZ of relation appointments does not exist"

**Cause:** Migration 001 wasn't fully executed

**Solution:**

1. Go back and re-run migration 001
2. Verify ALL columns were created
3. Then re-run migration 003

---

### RLS is not enabled

**Cause:** Migration 003 didn't run properly

**Solution:**

```sql
-- Manually enable RLS:
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Then re-run migration 003
```

---

## 🔍 VERIFICATION COMMANDS

Run these in SQL Editor to verify everything is correct:

### Check Tables Exist

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('appointments', 'email_logs');
```

**Expected Output:** 2 rows showing both table names

---

### Check Appointments Table Structure

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'appointments'
ORDER BY ordinal_position;
```

**Expected Output:** 17 rows showing all columns

---

### Check RLS is Enabled

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('appointments', 'email_logs');
```

**Expected Output:**

```
tablename      | rowsecurity
---------------|------------
appointments   | t
email_logs     | t
```

(t = true = RLS enabled)

---

### Check RLS Policies Exist

```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('appointments', 'email_logs');
```

**Expected Output:** Multiple rows showing policy names

---

## 📝 AFTER MIGRATION CHECKLIST

Once migrations are complete:

- [ ] All 3 migration files executed successfully
- [ ] Tables verified in Supabase Table Editor
- [ ] RLS enabled on both tables
- [ ] RLS policies created
- [ ] Verification SQL commands run successfully
- [ ] No error messages or warnings

**Next Steps:**

1. ✅ Mark "Task 1: Run Database Migrations" as complete in [POST_DEPLOYMENT_CHECKLIST.md](./POST_DEPLOYMENT_CHECKLIST.md)
2. Continue with Task 2: Verify Environment Variables
3. Test database connection from production application

---

## 🎯 QUICK REFERENCE

### Migration Order (MUST follow):

1. 001_create_appointments_table.sql
2. 002_create_email_logs_table.sql
3. 003_create_rls_policies.sql

### Key Tables:

- `appointments` - Stores booking requests
- `email_logs` - Tracks sent emails

### Security:

- RLS MUST be enabled on both tables
- Only service role can access `email_logs`
- Public can insert/read appointments with restrictions

---

**Questions or issues?** Check [POST_DEPLOYMENT_CHECKLIST.md](./POST_DEPLOYMENT_CHECKLIST.md) troubleshooting section.

**Last Updated:** 2025-10-30
