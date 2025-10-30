# Admin User Setup Guide

Complete guide for creating and managing admin users in SetAppointmentApp.

**Last Updated:** 2025-10-30
**Phase:** 4 - Admin Dashboard
**Prerequisites:** Database migration 005 must be completed first

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Understanding Admin Roles](#understanding-admin-roles)
3. [Method 1: Direct SQL Insert (Recommended)](#method-1-direct-sql-insert-recommended)
4. [Method 2: Using Supabase Dashboard](#method-2-using-supabase-dashboard)
5. [Method 3: Bulk Import Multiple Admins](#method-3-bulk-import-multiple-admins)
6. [Verification Steps](#verification-steps)
7. [Managing Admin Users](#managing-admin-users)
8. [Troubleshooting](#troubleshooting)
9. [Security Best Practices](#security-best-practices)

---

## Prerequisites

Before creating admin users, ensure you have:

### ✅ Completed Database Migration

The `admin_users` table must exist. If you haven't run the migration yet:

1. Open your Supabase project dashboard: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Open a new query
4. Copy the contents of `src/lib/supabase/migrations/005_create_admin_users_table.sql`
5. Paste and execute the SQL

**Verify the table exists:**

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'admin_users'
);
```

Expected result: `true`

### ✅ Have Your Admin Email Address

You'll need a valid email address that:

- You have access to (for receiving magic link emails)
- Matches your `EMAIL_ADMIN` environment variable (if configured)
- Is a professional/work email (recommended for security)

---

## Understanding Admin Roles

The system supports three role levels with hierarchical permissions:

### 1. **viewer** (Lowest Access)

- View-only access to dashboard and appointments
- Cannot modify appointment status
- Cannot access admin settings
- Ideal for: Stakeholders, clients, read-only monitors

### 2. **admin** (Standard Access)

- Full access to dashboard and appointments
- Can view, search, filter, and manage appointments
- Can update appointment statuses
- Cannot manage other admin users
- Ideal for: Daily operations, customer service team

### 3. **super_admin** (Highest Access)

- All admin privileges
- Can manage other admin users (future feature)
- Can access all settings and configurations
- Full system access
- Ideal for: System owners, technical administrators

**Recommendation:** Create your first user as `super_admin`.

---

## Method 1: Direct SQL Insert (Recommended)

The fastest and most reliable method for creating your first admin user.

### Step 1: Open Supabase SQL Editor

1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**

### Step 2: Insert Your Admin User

Copy and paste the following SQL, replacing the email and role:

```sql
-- Create a single admin user
INSERT INTO public.admin_users (email, role, is_active)
VALUES ('your-email@example.com', 'super_admin', true);
```

**Customization:**

| Field       | Description                    | Example                                   |
| ----------- | ------------------------------ | ----------------------------------------- |
| `email`     | Your admin email address       | `'admin@yourcompany.com'`                 |
| `role`      | Access level (see roles above) | `'super_admin'`, `'admin'`, or `'viewer'` |
| `is_active` | Whether account is enabled     | `true` or `false`                         |

### Step 3: Execute the Query

1. Click the **Run** button (or press Ctrl+Enter / Cmd+Enter)
2. You should see: **Success. 1 row inserted.**

### Step 4: Verify the Insert

```sql
-- Check your newly created admin user
SELECT id, email, role, is_active, created_at
FROM public.admin_users
WHERE email = 'your-email@example.com';
```

Expected output:

```
id                                   | email                    | role        | is_active | created_at
-------------------------------------|--------------------------|-------------|-----------|-------------------
a1b2c3d4-e5f6-7890-abcd-ef1234567890 | your-email@example.com   | super_admin | true      | 2025-10-30 14:30:00
```

✅ **Success!** Your admin user is created and ready to use.

---

## Method 2: Using Supabase Dashboard

Visual method using Supabase's table editor interface.

### Step 1: Navigate to Table Editor

1. Open Supabase dashboard: https://app.supabase.com
2. Select your project
3. Click **Table Editor** in the left sidebar
4. Find and click the **admin_users** table

### Step 2: Insert New Row

1. Click the **Insert** button (usually at the top or bottom of the table)
2. A form will appear with fields

### Step 3: Fill in the Form

| Field             | Value                    | Notes                            |
| ----------------- | ------------------------ | -------------------------------- |
| **id**            | Leave empty              | Auto-generated UUID              |
| **email**         | `your-email@example.com` | Your admin email                 |
| **role**          | `super_admin`            | Select from dropdown             |
| **is_active**     | `true`                   | Check the box                    |
| **last_login_at** | Leave empty              | Set automatically on first login |
| **created_at**    | Leave empty              | Auto-set to current timestamp    |
| **updated_at**    | Leave empty              | Auto-set to current timestamp    |

### Step 4: Save

1. Click **Save** or **Insert row**
2. The new row should appear in the table

### Step 5: Verify

Look for your email in the table. The row should have:

- A generated UUID in the `id` column
- Your email address
- The role you selected
- `is_active` checked/true
- A timestamp in `created_at`

✅ **Success!** Your admin user is created.

---

## Method 3: Bulk Import Multiple Admins

Create multiple admin users at once (useful for teams).

### Example: Create Multiple Admins

```sql
-- Insert multiple admin users in one query
INSERT INTO public.admin_users (email, role, is_active)
VALUES
  ('owner@yourcompany.com', 'super_admin', true),
  ('manager@yourcompany.com', 'admin', true),
  ('support@yourcompany.com', 'admin', true),
  ('viewer@yourcompany.com', 'viewer', true);
```

### Verify All Inserts

```sql
-- View all admin users
SELECT email, role, is_active, created_at
FROM public.admin_users
ORDER BY created_at DESC;
```

Expected output:

```
email                    | role        | is_active | created_at
-------------------------|-------------|-----------|-------------------
viewer@yourcompany.com   | viewer      | true      | 2025-10-30 14:35:00
support@yourcompany.com  | admin       | true      | 2025-10-30 14:35:00
manager@yourcompany.com  | admin       | true      | 2025-10-30 14:35:00
owner@yourcompany.com    | super_admin | true      | 2025-10-30 14:35:00
```

✅ **Success!** All admin users created.

---

## Verification Steps

After creating admin users, verify the setup is working correctly.

### Test 1: Check Email Format Validation

The table enforces valid email formats. Try inserting an invalid email (should fail):

```sql
-- This should FAIL with a constraint violation
INSERT INTO public.admin_users (email, role, is_active)
VALUES ('invalid-email', 'admin', true);
```

Expected error: `violates check constraint "valid_email"`

✅ **Pass:** Email validation is working.

### Test 2: Check Role Validation

The table only accepts specific roles. Try an invalid role (should fail):

```sql
-- This should FAIL with a constraint violation
INSERT INTO public.admin_users (email, role, is_active)
VALUES ('test@example.com', 'invalid_role', true);
```

Expected error: `violates check constraint "valid_role"`

✅ **Pass:** Role validation is working.

### Test 3: Check Unique Email Constraint

You cannot create duplicate admin users. Try inserting the same email twice (should fail):

```sql
-- First insert (should succeed)
INSERT INTO public.admin_users (email, role, is_active)
VALUES ('duplicate@example.com', 'admin', true);

-- Second insert (should FAIL)
INSERT INTO public.admin_users (email, role, is_active)
VALUES ('duplicate@example.com', 'admin', true);
```

Expected error: `duplicate key value violates unique constraint "admin_users_email_key"`

✅ **Pass:** Unique constraint is working.

### Test 4: Test Admin Login Flow

1. Open your deployed site: `https://your-domain.com/admin/login`
2. Enter the email address you created
3. Click "Send Magic Link"
4. Check your email inbox for the magic link
5. Click the link in the email
6. You should be redirected to `/admin/dashboard`

✅ **Pass:** Authentication flow is working.

### Test 5: Verify Session Tracking

After logging in, check that `last_login_at` is updated:

```sql
-- Check last login timestamp
SELECT email, last_login_at
FROM public.admin_users
WHERE email = 'your-email@example.com';
```

Expected result: `last_login_at` should show a recent timestamp.

✅ **Pass:** Session tracking is working.

---

## Managing Admin Users

Common operations for managing admin users.

### View All Admin Users

```sql
SELECT
  email,
  role,
  is_active,
  last_login_at,
  created_at
FROM public.admin_users
ORDER BY created_at DESC;
```

### Update Admin Role

Change a user's access level:

```sql
-- Promote user to super_admin
UPDATE public.admin_users
SET role = 'super_admin', updated_at = NOW()
WHERE email = 'user@example.com';

-- Demote user to viewer
UPDATE public.admin_users
SET role = 'viewer', updated_at = NOW()
WHERE email = 'user@example.com';
```

### Deactivate Admin User

Disable access without deleting the record:

```sql
-- Deactivate user (they won't be able to log in)
UPDATE public.admin_users
SET is_active = false, updated_at = NOW()
WHERE email = 'user@example.com';
```

### Reactivate Admin User

Re-enable a deactivated user:

```sql
-- Reactivate user
UPDATE public.admin_users
SET is_active = true, updated_at = NOW()
WHERE email = 'user@example.com';
```

### Delete Admin User

Permanently remove an admin user:

```sql
-- ⚠️ WARNING: This is permanent!
DELETE FROM public.admin_users
WHERE email = 'user@example.com';
```

**Important:** Deletion is permanent and cannot be undone. Consider deactivating instead.

### Check Active Sessions

View users who have logged in recently:

```sql
-- Users who logged in within the last 24 hours
SELECT
  email,
  role,
  last_login_at,
  NOW() - last_login_at AS time_since_login
FROM public.admin_users
WHERE last_login_at > NOW() - INTERVAL '24 hours'
ORDER BY last_login_at DESC;
```

### Find Inactive Admins

Identify admin users who haven't logged in:

```sql
-- Users who have never logged in
SELECT email, role, created_at
FROM public.admin_users
WHERE last_login_at IS NULL
ORDER BY created_at DESC;

-- Users who haven't logged in for 30+ days
SELECT
  email,
  role,
  last_login_at,
  NOW() - last_login_at AS inactive_duration
FROM public.admin_users
WHERE last_login_at < NOW() - INTERVAL '30 days'
ORDER BY last_login_at ASC;
```

---

## Troubleshooting

Common issues and solutions.

### Issue 1: "Table admin_users doesn't exist"

**Cause:** Migration not run yet.

**Solution:**

1. Run the migration from `src/lib/supabase/migrations/005_create_admin_users_table.sql`
2. Verify with: `SELECT * FROM public.admin_users LIMIT 1;`

### Issue 2: "Email validation failed"

**Cause:** Invalid email format.

**Solution:** Ensure email follows standard format: `username@domain.com`

Valid examples:

- ✅ `admin@company.com`
- ✅ `john.doe@example.co.uk`
- ✅ `admin+test@subdomain.example.com`

Invalid examples:

- ❌ `admin` (no domain)
- ❌ `admin@` (incomplete)
- ❌ `@company.com` (no username)

### Issue 3: "Role validation failed"

**Cause:** Invalid role name.

**Solution:** Use exactly one of these three roles:

- `viewer`
- `admin`
- `super_admin`

Note: Role names are case-sensitive and must be lowercase.

### Issue 4: "Duplicate key error"

**Cause:** Email already exists in admin_users table.

**Solution:**

1. Check existing users: `SELECT email FROM public.admin_users;`
2. Either use a different email or update the existing record
3. To update: `UPDATE public.admin_users SET role = 'super_admin' WHERE email = 'your@email.com';`

### Issue 5: "Can't log in after creating user"

**Possible causes and solutions:**

**A. User is inactive:**

```sql
-- Check if user is active
SELECT email, is_active FROM public.admin_users WHERE email = 'your@email.com';

-- If is_active is false, activate it:
UPDATE public.admin_users SET is_active = true WHERE email = 'your@email.com';
```

**B. Email doesn't match:**

- Verify the email in admin_users matches exactly what you're entering at login
- Check for extra spaces or typos

**C. Magic link expired:**

- Magic links expire after a certain time (usually 60 minutes)
- Request a new magic link

**D. Email not being received:**

- Check spam/junk folder
- Verify Supabase email settings are configured
- Check Supabase Auth logs for email delivery status

### Issue 6: "RLS policy blocking access"

**Cause:** Row Level Security policies may prevent access.

**Solution:** The migration includes proper RLS policies, but verify:

```sql
-- Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'admin_users';

-- View existing policies
SELECT * FROM pg_policies WHERE tablename = 'admin_users';
```

The table should have `rowsecurity = true` and at least one policy for SELECT operations.

### Issue 7: "Session expires immediately"

**Cause:** Cookie/session configuration issue.

**Solution:**

1. Ensure you're using HTTPS in production
2. Check browser cookie settings (allow cookies from your domain)
3. Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly in environment variables
4. Clear browser cookies and try again

---

## Security Best Practices

Important security considerations for admin user management.

### 1. Use Strong Email Security

✅ **Do:**

- Use work/business email addresses
- Enable 2FA on email accounts
- Use password managers for email account passwords
- Regularly review email security settings

❌ **Don't:**

- Use personal email addresses for admin access
- Share admin email credentials
- Use disposable/temporary email addresses
- Use compromised email accounts

### 2. Follow the Principle of Least Privilege

✅ **Do:**

- Assign the minimum role needed for each user
- Use `viewer` role for stakeholders who only need to see data
- Reserve `super_admin` for 1-2 trusted individuals
- Regularly audit admin roles

❌ **Don't:**

- Make everyone a `super_admin` "just in case"
- Give admin access to users who don't need it
- Leave test/temporary admin accounts active

### 3. Monitor Admin Activity

```sql
-- Regular audit: Check recent admin logins
SELECT
  email,
  role,
  last_login_at,
  CASE
    WHEN last_login_at > NOW() - INTERVAL '7 days' THEN 'Active'
    WHEN last_login_at > NOW() - INTERVAL '30 days' THEN 'Inactive'
    ELSE 'Very Inactive'
  END AS activity_status
FROM public.admin_users
ORDER BY last_login_at DESC NULLS LAST;
```

### 4. Deactivate Unused Accounts

Regularly review and deactivate admin accounts that:

- Haven't logged in for 90+ days
- Belong to former employees
- Were created for testing
- Are no longer needed

```sql
-- Deactivate accounts inactive for 90+ days
UPDATE public.admin_users
SET is_active = false, updated_at = NOW()
WHERE last_login_at < NOW() - INTERVAL '90 days';
```

### 5. Protect Against Email Enumeration

The magic link system is designed to prevent attackers from discovering valid admin emails. When an invalid email is used:

- The system responds with success message (doesn't reveal if email exists)
- No email is actually sent
- No error is logged that reveals valid vs invalid emails

### 6. Review Supabase Auth Settings

In your Supabase dashboard:

1. **Email Templates:** Customize magic link email to match your branding
2. **Email Rate Limiting:** Prevent email bombing attacks
3. **Link Expiration:** Set appropriate magic link timeout (default 60 min)
4. **Redirect URLs:** Whitelist only your domain for auth callbacks

### 7. Use Environment Variables

Never hardcode admin emails in your codebase:

```bash
# .env.local (not committed to git)
EMAIL_ADMIN=your-admin@company.com
```

### 8. Enable Database Backups

In Supabase dashboard:

1. Go to **Settings** → **Database**
2. Enable automated daily backups
3. Regularly test backup restoration

### 9. Audit Trail (Future Enhancement)

Consider creating an audit log table to track:

- Admin login attempts
- Appointment status changes
- User role modifications
- Account activations/deactivations

---

## Next Steps

After creating your admin user:

### 1. Test the Complete Flow

- [ ] Visit `/admin/login`
- [ ] Request magic link
- [ ] Check email and click link
- [ ] Verify redirect to `/admin/dashboard`
- [ ] Browse to `/admin/appointments`
- [ ] Test search and filtering features
- [ ] Check `/admin/settings` page

### 2. Document Your Admin Credentials

Store admin email addresses securely:

- Use a password manager (1Password, Bitwarden, etc.)
- Create a secure document for your team
- Include role assignments and permissions

### 3. Set Up Additional Admins (Optional)

If you have a team:

- Create accounts for team members
- Assign appropriate roles
- Share this guide with them

### 4. Configure Email Customization (Optional)

Customize the magic link email in Supabase:

1. Go to **Authentication** → **Email Templates**
2. Select **Magic Link**
3. Customize subject and body to match your brand

### 5. Enable Production Features

- Set up custom domain for admin portal (optional)
- Configure email rate limiting
- Set up monitoring/alerting for admin logins
- Create backup admin accounts (in case primary is unavailable)

---

## Additional Resources

- **Project README:** `README.md` - Overall project documentation
- **Migration File:** `src/lib/supabase/migrations/005_create_admin_users_table.sql`
- **Auth Utilities:** `src/lib/auth/admin.ts` - Admin authentication functions
- **Admin Layout:** `src/app/admin/layout.tsx` - Admin UI structure
- **Supabase Docs:** https://supabase.com/docs/guides/auth/auth-magic-link
- **Next.js Auth:** https://nextjs.org/docs/app/building-your-application/authentication

---

## Support

If you encounter issues not covered in this guide:

1. Check Supabase logs for errors
2. Review browser console for JavaScript errors
3. Verify environment variables are set correctly
4. Check that migration was run successfully
5. Ensure Supabase project is active and not paused

---

**Document Version:** 1.0
**Last Updated:** 2025-10-30
**Maintained By:** SetAppointmentApp Development Team
