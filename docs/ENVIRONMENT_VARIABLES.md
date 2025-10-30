# Environment Variables Setup

Complete list of required environment variables for SetAppointmentApp.

**Last Updated:** 2025-10-30
**Phase:** 4 - Admin Dashboard

---

## Required Environment Variables

### Supabase Configuration

#### `NEXT_PUBLIC_SUPABASE_URL` (Public)

- **Description:** Your Supabase project URL
- **Example:** `https://your-project.supabase.co`
- **Where to find:** Supabase Dashboard → Settings → API → Project URL
- **Required in:** All environments (Development, Preview, Production)

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Public)

- **Description:** Supabase anonymous/public API key
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find:** Supabase Dashboard → Settings → API → Project API keys → `anon` `public`
- **Required in:** All environments (Development, Preview, Production)
- **Security:** Safe to expose in client-side code (respects RLS policies)

#### `SUPABASE_SERVICE_ROLE_KEY` (Secret) ⚠️

- **Description:** Supabase service role key with elevated permissions
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find:** Supabase Dashboard → Settings → API → Project API keys → `service_role` `secret`
- **Required in:** All environments (Development, Preview, Production)
- **Security:** **NEVER expose in client-side code!** Bypasses all RLS policies
- **Used for:** Admin user validation, bypassing RLS for admin operations

### Email Configuration (Resend)

#### `RESEND_API_KEY` (Secret)

- **Description:** Resend API key for sending emails
- **Example:** `re_123456789`
- **Where to find:** Resend Dashboard → API Keys
- **Required in:** Production (optional in Development)

#### `EMAIL_FROM` (Configuration)

- **Description:** Sender email address for notifications
- **Example:** `noreply@yourdomain.com`
- **Required in:** Production

#### `EMAIL_ADMIN` (Configuration)

- **Description:** Admin email to receive booking notifications
- **Example:** `admin@yourdomain.com`
- **Required in:** Production

### Application Configuration

#### `NEXT_PUBLIC_APP_URL` (Public)

- **Description:** Base URL of your deployed application
- **Example:** `https://setappointmentapp.vercel.app`
- **Required in:** Production, Preview
- **Used for:** Generating absolute URLs, OAuth redirects

#### `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Public, Optional)

- **Description:** Google Analytics 4 Measurement ID
- **Example:** `G-XXXXXXXXXX`
- **Required in:** Optional (enables Google Analytics tracking)
- **Where to find:** Google Analytics → Admin → Data Streams

---

## How to Set Environment Variables

### Local Development (.env.local)

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Email (Resend)
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=noreply@yourdomain.com
EMAIL_ADMIN=admin@yourdomain.com

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Note:** `.env.local` is gitignored and never committed to version control.

### Vercel Deployment

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with:
   - **Key:** Variable name (e.g., `SUPABASE_SERVICE_ROLE_KEY`)
   - **Value:** The actual value
   - **Environment:** Select all that apply (Production, Preview, Development)

### After Adding Variables

**Vercel:** Variables are applied to new deployments only. To apply immediately:

- Go to **Deployments** tab
- Click **⋯** on latest deployment
- Select **Redeploy**

**Local:** Restart your development server:

```bash
npm run dev
```

---

## Security Best Practices

### Public vs Secret Variables

**Public variables** (prefix: `NEXT_PUBLIC_`):

- ✅ Safe to expose in client-side JavaScript
- ✅ Can be used in browser code
- ✅ Should still follow least-privilege principle

**Secret variables** (no prefix):

- ❌ NEVER expose in client-side code
- ✅ Only accessible in server-side code (API routes, Server Components)
- ✅ Provide elevated permissions or sensitive data

### Service Role Key Security

The `SUPABASE_SERVICE_ROLE_KEY` is extremely sensitive:

**DO:**

- ✅ Store only in environment variables
- ✅ Use only in server-side code
- ✅ Rotate periodically
- ✅ Restrict to necessary operations

**DON'T:**

- ❌ Commit to version control
- ❌ Expose in client-side code
- ❌ Share in public documentation
- ❌ Use in development unless necessary

### If a Secret is Exposed

If you accidentally expose the service role key:

1. Immediately go to Supabase Dashboard → Settings → API
2. Click **Regenerate** next to service_role key
3. Update the key in all environments
4. Redeploy all applications

---

## Troubleshooting

### "Failed to send magic link" Error

**Symptom:** Admin login returns 401 error
**Cause:** Missing `SUPABASE_SERVICE_ROLE_KEY`
**Solution:** Add the service role key to Vercel environment variables and redeploy

### "Supabase client not configured" Error

**Symptom:** Database operations fail
**Cause:** Missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**Solution:** Ensure both public Supabase variables are set

### Environment Variables Not Taking Effect

**Vercel:**

- Variables are applied to NEW deployments only
- Redeploy to apply changes

**Local:**

- Restart the development server
- Check `.env.local` exists in project root
- Verify no typos in variable names

---

## Verification Checklist

Use this checklist to verify all required variables are set:

### Vercel Production Environment

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **CRITICAL FOR ADMIN LOGIN**
- [ ] `RESEND_API_KEY`
- [ ] `EMAIL_FROM`
- [ ] `EMAIL_ADMIN`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)

### Local Development (.env.local)

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (for testing admin features)
- [ ] `NEXT_PUBLIC_APP_URL=http://localhost:3000`

---

## Quick Reference

| Variable                        | Type   | Required   | Used For               |
| ------------------------------- | ------ | ---------- | ---------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Public | Yes        | Supabase connection    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Yes        | Client authentication  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Secret | Yes        | Admin operations       |
| `RESEND_API_KEY`                | Secret | Production | Email sending          |
| `EMAIL_FROM`                    | Config | Production | Email sender           |
| `EMAIL_ADMIN`                   | Config | Production | Notification recipient |
| `NEXT_PUBLIC_APP_URL`           | Public | Production | OAuth redirects        |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public | Optional   | Analytics              |

---

**Document Version:** 1.0
**Last Updated:** 2025-10-30
**Maintained By:** SetAppointmentApp Development Team
