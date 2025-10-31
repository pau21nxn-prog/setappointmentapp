# Vercel Environment Variables Configuration Guide

**Purpose:** Fix magic link redirect issues by configuring correct production URLs

**Last Updated:** 2025-10-31
**Issue:** Magic links redirecting to `localhost:3000` instead of production URL

---

## Quick Fix (Step-by-Step)

### Step 1: Access Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **setappointmentapp**
3. Click **Settings** tab (top navigation)
4. Click **Environment Variables** in the left sidebar

### Step 2: Find or Create NEXT_PUBLIC_APP_URL

**Check if variable exists:**

- Look for `NEXT_PUBLIC_APP_URL` in the list
- If it exists and shows `http://localhost:3000` → **Update it**
- If it doesn't exist → **Create it**

### Step 3: Set the Correct Value

#### For Current Deployment:

```
NEXT_PUBLIC_APP_URL=https://setappointmentapp-1dnzvh010-paus-projects-dad48fbd.vercel.app
```

#### For Future (Custom Domain):

```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Step 4: Select Environment

**Important:** Choose where this variable applies

- ✅ **Production** - Check this (Required!)
- ⬜ **Preview** - Optional (recommended for testing)
- ⬜ **Development** - Optional (keep localhost for local dev)

**Recommended Settings:**

```
Production:  https://setappointmentapp-1dnzvh010-paus-projects-dad48fbd.vercel.app
Preview:     https://setappointmentapp-1dnzvh010-paus-projects-dad48fbd.vercel.app
Development: http://localhost:3000
```

### Step 5: Save Changes

1. Click **Save** button
2. You should see: "Environment variable saved"

### Step 6: Redeploy Application

**Critical:** Changes only apply to NEW deployments!

**Option A: Trigger new deployment (Recommended)**

1. Go to **Deployments** tab
2. Click the three dots (**...**) on the latest deployment
3. Click **Redeploy**
4. Confirm the redeployment

**Option B: Push a commit to trigger deployment**

```bash
git commit --allow-empty -m "chore: trigger redeploy for env var update"
git push
```

### Step 7: Verify Configuration

After redeployment completes:

1. Go to your deployment
2. Click **View Function Logs** or **Runtime Logs**
3. Look for log entries when requesting magic link
4. Should see: `[Magic Link] Using origin from request header: https://...`
5. Should NOT see: `localhost:3000`

---

## Verification Checklist

After completing the steps above, verify the fix:

- [ ] Variable `NEXT_PUBLIC_APP_URL` exists in Vercel
- [ ] Value is set to your production URL (not localhost)
- [ ] Applied to **Production** environment
- [ ] New deployment triggered and completed successfully
- [ ] Requested a new magic link from production
- [ ] Email received with production URL (not localhost)
- [ ] Clicking link redirects to production dashboard
- [ ] Successfully authenticated

---

## Troubleshooting

### Issue: Changes not taking effect

**Cause:** Using old deployment
**Solution:** Force a new deployment (see Step 6)

### Issue: Still seeing localhost in logs

**Cause:** Multiple possible reasons
**Solutions:**

1. Check the logs are from the NEW deployment (check timestamp)
2. Verify the variable is set for **Production** environment
3. Clear browser cache and try again
4. Check Supabase Auth settings (see SUPABASE_AUTH_FIX.md)

### Issue: Variable not showing in runtime

**Cause:** `NEXT_PUBLIC_` prefix is required for client-side access
**Solution:** Ensure variable name starts with `NEXT_PUBLIC_APP_URL` (not just `APP_URL`)

---

## Additional Environment Variables (Reference)

While you're in environment variables, verify these are also set:

### Required Variables

| Variable                        | Example                     | Environment    |
| ------------------------------- | --------------------------- | -------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxxxx.supabase.co` | All            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...`                | All            |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJhbGc...`                | All            |
| `RESEND_API_KEY`                | `re_xxxxx`                  | All            |
| `EMAIL_FROM`                    | `noreply@yourdomain.com`    | All            |
| `EMAIL_ADMIN`                   | `admin@yourdomain.com`      | All            |
| **`NEXT_PUBLIC_APP_URL`**       | **Production URL**          | **Production** |

### Optional Variables

| Variable            | Purpose                   | Example         |
| ------------------- | ------------------------- | --------------- |
| `NEXT_PUBLIC_GA_ID` | Google Analytics          | `G-XXXXXXXXXX`  |
| `KV_REST_API_URL`   | Rate limiting (Vercel KV) | Auto-configured |
| `KV_REST_API_TOKEN` | Rate limiting (Vercel KV) | Auto-configured |

---

## Understanding VERCEL_URL vs NEXT_PUBLIC_APP_URL

### VERCEL_URL

- Automatically set by Vercel
- Available at **build time** and **runtime**
- Changes with each deployment
- Format: `project-name-xyz123.vercel.app` (no protocol)
- **Not public** (server-side only)

### NEXT_PUBLIC_APP_URL

- Manually set by you
- Available on **client and server**
- Stays consistent across deployments
- Format: `https://yourdomain.com` (with protocol)
- **Public** (exposed to browser)

**Our Fix:** The updated code now automatically uses `VERCEL_URL` when `NEXT_PUBLIC_APP_URL` is not set, providing a smart fallback!

---

## Best Practices

### 1. Use Different URLs per Environment

```
Production:  https://yourdomain.com
Preview:     https://preview-setappointmentapp.vercel.app
Development: http://localhost:3000
```

### 2. Always Include Protocol

✅ Correct: `https://yourdomain.com`
❌ Wrong: `yourdomain.com`
❌ Wrong: `http://yourdomain.com` (use https in production)

### 3. No Trailing Slash

✅ Correct: `https://yourdomain.com`
❌ Wrong: `https://yourdomain.com/`

### 4. Test After Every Change

Don't assume it works - always test:

1. Request magic link
2. Check email
3. Click link
4. Verify authentication

---

## Next Steps

After fixing Vercel environment variables:

1. ✅ **Configure Supabase Auth Settings**
   - See: `docs/SUPABASE_AUTH_FIX.md`
   - Update Site URL and Redirect URLs

2. ✅ **Test the Complete Flow**
   - Request magic link from production
   - Verify email contains production URL
   - Click link and authenticate

3. ✅ **Update Deployment Checklist**
   - Document this fix for future deployments
   - Add to onboarding process

---

## Related Documentation

- **Supabase Auth Fix:** `docs/SUPABASE_AUTH_FIX.md`
- **Environment Variables:** `docs/ENVIRONMENT_VARIABLES.md`
- **Deployment Guide:** `docs/VERCEL_DEPLOYMENT_GUIDE.md`
- **Deployment Checklist:** `docs/POST_DEPLOYMENT_CHECKLIST.md`
- **Admin Setup:** `docs/ADMIN_USER_SETUP.md`

---

**Need Help?**

1. Check Vercel deployment logs for errors
2. Check browser console for JavaScript errors
3. Verify Supabase Auth configuration
4. Review `src/app/api/admin/auth/magic-link/route.ts` logs

---

**Document Version:** 1.0
**Created:** 2025-10-31
**Maintained By:** SetAppointmentApp Development Team
