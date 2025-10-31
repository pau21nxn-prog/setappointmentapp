# Supabase Auth Configuration Fix Guide

**Purpose:** Configure Supabase to allow magic links with production URLs

**Last Updated:** 2025-10-31
**Issue:** Magic links redirecting to `localhost:3000` due to incorrect Supabase Auth settings

---

## Quick Fix (Step-by-Step)

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (the one for SetAppointmentApp)
3. Click **Authentication** in the left sidebar
4. Click **URL Configuration** sub-menu

### Step 2: Update Site URL

**What is Site URL?**
The default URL Supabase uses for redirects and email links.

**Current Setting (Incorrect):**

```
http://localhost:3000
```

**Update to Production URL:**

```
https://setappointmentapp-1dnzvh010-paus-projects-dad48fbd.vercel.app
```

**Steps:**

1. Find the **Site URL** field
2. Clear the current value
3. Enter your production URL
4. Click **Save**

### Step 3: Configure Redirect URLs (Allowlist)

**What are Redirect URLs?**
Supabase only allows redirects to URLs in this allowlist for security.

**Current Settings (Likely Missing):**

- May only have `http://localhost:3000/*`

**Add These URLs:**

#### Add Each URL Separately:

1. **Production Callback (Required):**

   ```
   https://setappointmentapp-1dnzvh010-paus-projects-dad48fbd.vercel.app/admin/auth/callback
   ```

2. **Production Wildcard (Recommended):**

   ```
   https://setappointmentapp-1dnzvh010-paus-projects-dad48fbd.vercel.app/**
   ```

3. **Localhost (Keep for Development):**
   ```
   http://localhost:3000/**
   ```

**Steps:**

1. Find **Redirect URLs** section
2. Click **Add URL** button
3. Paste the URL
4. Click **Add** or **Save**
5. Repeat for each URL above

### Step 4: Verify Configuration

After saving, your Redirect URLs list should include:

- ✅ `https://setappointmentapp-1dnzvh010-paus-projects-dad48fbd.vercel.app/admin/auth/callback`
- ✅ `https://setappointmentapp-1dnzvh010-paus-projects-dad48fbd.vercel.app/**`
- ✅ `http://localhost:3000/**`

---

## Complete Configuration Reference

### Site URL Configuration

| Setting      | Value                                                                   | Purpose              |
| ------------ | ----------------------------------------------------------------------- | -------------------- |
| **Site URL** | `https://setappointmentapp-1dnzvh010-paus-projects-dad48fbd.vercel.app` | Default redirect URL |

**Important Notes:**

- Must include protocol (`https://`)
- No trailing slash
- Should be your primary production domain
- Used as fallback when redirect URL not specified

### Redirect URLs (Allowlist)

| URL Pattern                                 | Purpose                   | Required       |
| ------------------------------------------- | ------------------------- | -------------- |
| `https://[your-domain]/admin/auth/callback` | Admin magic link callback | ✅ Yes         |
| `https://[your-domain]/**`                  | Allow all admin routes    | ✅ Recommended |
| `http://localhost:3000/**`                  | Local development         | ✅ Development |

**Security Note:** Supabase rejects any redirect not in this list, preventing phishing attacks.

---

## Testing the Configuration

### Test 1: Request Magic Link from Production

1. Visit: `https://setappointmentapp-1dnzvh010-paus-projects-dad48fbd.vercel.app/admin/login`
2. Enter your admin email
3. Click "Send Magic Link"
4. Wait for email (check spam if not received)

### Test 2: Verify Email Content

Open the magic link email and check the URL:

✅ **Correct:**

```
https://setappointmentapp-1dnzvh010-paus-projects-dad48fbd.vercel.app/admin/auth/callback?code=xxx&token_hash=yyy
```

❌ **Incorrect (Still broken):**

```
http://localhost:3000/admin/auth/callback?code=xxx&token_hash=yyy
```

If you see localhost, double-check:

- Site URL is set correctly
- You saved the changes
- Vercel environment variables are correct (see `VERCEL_ENV_VAR_FIX.md`)

### Test 3: Click the Link

Click the magic link in the email:

✅ **Expected Result:**

- Opens: `https://your-domain/admin/auth/callback?code=...`
- Redirects to: `https://your-domain/admin/dashboard`
- Shows: Admin dashboard with your appointments

❌ **If it fails:**

- Check browser console for errors
- Check Supabase Auth logs (see Troubleshooting below)

---

## Additional Auth Settings (Optional)

While you're in Supabase Auth settings, consider configuring:

### Email Templates

**Path:** Authentication → Email Templates → Magic Link

Customize the magic link email:

```html
<h2>Your Admin Login Link</h2>
<p>Click the link below to securely log in to your dashboard:</p>
<p><a href="{{ .ConfirmationURL }}">Log In to Admin Dashboard</a></p>
<p>This link expires in 1 hour and can only be used once.</p>
<p>If you didn't request this, please ignore this email.</p>
```

### Auth Settings

**Path:** Authentication → Settings

| Setting                        | Recommended Value | Purpose                             |
| ------------------------------ | ----------------- | ----------------------------------- |
| **Enable Email Confirmations** | Off               | Not needed for magic links          |
| **Secure Email Change**        | On                | Prevents unauthorized email changes |
| **Enable Email Signup**        | Off               | Prevent public signups              |
| **Minimum Password Length**    | N/A               | Not using passwords                 |

### Rate Limiting

**Path:** Authentication → Rate Limits

| Action         | Recommended Limit | Purpose            |
| -------------- | ----------------- | ------------------ |
| **Email sent** | 3 per hour        | Prevent email spam |
| **SMS sent**   | N/A               | Not using SMS      |
| **Verify**     | 60 per hour       | Allow retries      |

---

## Troubleshooting

### Issue: Magic link still shows localhost

**Possible Causes:**

1. **Site URL not saved properly**
   - Go back to Supabase → Authentication → URL Configuration
   - Verify Site URL shows production domain
   - Try saving again

2. **Vercel environment variable not set**
   - Check `NEXT_PUBLIC_APP_URL` in Vercel
   - See: `docs/VERCEL_ENV_VAR_FIX.md`

3. **Cached email template**
   - Supabase may cache email templates
   - Wait 5 minutes and try again
   - Or update email template manually

### Issue: "Redirect URL not allowed" error

**Cause:** Requested redirect URL not in allowlist

**Solution:**

1. Check the exact URL in the error message
2. Add it to Redirect URLs in Supabase
3. Use wildcard `/**` to allow all paths

**Example Error:**

```
Error: redirect_to URL is not allowed: https://example.com/admin/auth/callback
```

**Fix:** Add `https://example.com/**` to allowlist

### Issue: Magic link expired

**Cause:** Links expire after a set time (default: 1 hour)

**Solution:**

1. Request a new magic link
2. Click it immediately
3. To extend expiration time:
   - Go to Authentication → Settings
   - Find "Magic Link Expiry"
   - Increase from 3600s (1h) to higher value

### Issue: Magic link used multiple times

**Cause:** Each link can only be used once

**Solution:**
Request a new magic link - you cannot reuse old links

### Issue: Email not received

**Possible Causes:**

1. **Email in spam folder**
   - Check spam/junk folder
   - Mark as "Not Spam"
   - Add `noreply@mail.app.supabase.co` to contacts

2. **Supabase email quota exceeded**
   - Free tier: Limited emails per hour
   - Check: Authentication → Logs
   - Upgrade plan if needed

3. **Email provider blocking**
   - Some providers block automated emails
   - Try different email address
   - Configure custom SMTP (see below)

### Issue: Can't find URL Configuration

**Path Changed?** Try:

1. Authentication → Settings
2. Look for "URL Configuration" section
3. Or check: Project Settings → API

---

## Custom SMTP Configuration (Advanced)

To use your own email server instead of Supabase default:

### Step 1: Enable Custom SMTP

**Path:** Authentication → Settings → SMTP Settings

### Step 2: Configure SMTP

| Setting          | Example                  | Notes                     |
| ---------------- | ------------------------ | ------------------------- |
| **Host**         | `smtp.gmail.com`         | Your mail server          |
| **Port**         | `587`                    | TLS port (or 465 for SSL) |
| **Username**     | `your-email@gmail.com`   | SMTP username             |
| **Password**     | `app-specific-password`  | SMTP password             |
| **Sender Email** | `noreply@yourdomain.com` | From address              |
| **Sender Name**  | `SetAppointment Admin`   | Display name              |

### Step 3: Test SMTP

1. Click **Send Test Email**
2. Enter your email
3. Check if received
4. Verify it's not in spam

**Gmail SMTP Settings:**

```
Host: smtp.gmail.com
Port: 587
Security: TLS
Username: your-email@gmail.com
Password: [App-specific password from Google]
```

**Note:** Don't use your regular Gmail password - create an app-specific password in Google Account settings.

---

## Checking Supabase Auth Logs

To debug authentication issues:

### Access Logs

**Path:** Authentication → Logs

### What to Look For

1. **Magic link requests:**

   ```
   Event: user.otp.sent
   Email: admin@example.com
   Status: success
   ```

2. **Failed redirects:**

   ```
   Event: user.signin.failed
   Error: redirect_to URL is not allowed
   ```

3. **Expired tokens:**
   ```
   Event: user.token.expired
   Token: xxx-yyy-zzz
   ```

### Filter Logs

- **By email:** Find specific user's auth events
- **By event type:** Filter to only errors
- **By time:** Last hour, last day, etc.

---

## Security Best Practices

### 1. Use HTTPS Only in Production

❌ Never use: `http://yourdomain.com`
✅ Always use: `https://yourdomain.com`

### 2. Minimize Redirect URLs

Only add URLs you actually need:

- Production domain
- Preview deployment (if needed)
- Localhost (for development)

Don't add:

- Old/unused domains
- Test domains in production
- Wildcard `*` (too permissive)

### 3. Monitor Auth Logs

Regularly check for:

- Failed login attempts
- Unusual email patterns
- Suspicious redirect requests

### 4. Rotate Secrets Regularly

If you suspect compromise:

1. Rotate `SUPABASE_SERVICE_ROLE_KEY`
2. Revoke all active sessions
3. Force users to re-authenticate

---

## Next Steps

After fixing Supabase Auth:

1. ✅ **Test Complete Auth Flow**
   - Request magic link
   - Check email
   - Click link
   - Verify authentication

2. ✅ **Update Documentation**
   - Add to deployment checklist
   - Share with team

3. ✅ **Set Up Monitoring**
   - Monitor auth logs weekly
   - Set up alerts for failures

---

## Related Documentation

- **Vercel Environment Variables:** `docs/VERCEL_ENV_VAR_FIX.md`
- **Admin User Setup:** `docs/ADMIN_USER_SETUP.md`
- **Environment Variables:** `docs/ENVIRONMENT_VARIABLES.md`
- **Deployment Checklist:** `docs/POST_DEPLOYMENT_CHECKLIST.md`

---

**Need Help?**

1. Check Supabase Auth Logs for specific errors
2. Verify all URLs use HTTPS (not HTTP)
3. Ensure Vercel environment variables are set
4. Review browser console for JavaScript errors

---

**Document Version:** 1.0
**Created:** 2025-10-31
**Maintained By:** SetAppointmentApp Development Team
