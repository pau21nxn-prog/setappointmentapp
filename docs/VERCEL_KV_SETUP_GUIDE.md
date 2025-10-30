# Step-by-Step Guide: Create Vercel KV Database

## Overview

This guide will help you create a Vercel KV (Redis) database to enable rate limiting for your SetAppointmentApp. The entire process takes about 5-10 minutes.

**What is Vercel KV?**

- Redis-compatible database
- Global edge network (ultra-fast)
- Automatic scaling
- Free tier: 30 MB storage, 10,000 commands/day
- Perfect for rate limiting

---

## Prerequisites

Before starting, ensure you have:

- ✅ Vercel account (already have this)
- ✅ SetAppointmentApp deployed on Vercel
- ✅ Access to your Vercel Dashboard

---

## Step 1: Access Vercel Dashboard

### 1.1 Log in to Vercel

1. Go to: https://vercel.com
2. Click **"Log In"** (top right)
3. Sign in with your account

### 1.2 Navigate to Your Project

1. You'll see your dashboard with all projects
2. Find and click on **"setappointmentapp"** project
3. You should see the project overview page

**✅ Checkpoint:** You're viewing your project dashboard with tabs like "Deployments", "Settings", "Analytics"

---

## Step 2: Create KV Database

### 2.1 Open Storage Tab

1. In the top navigation bar, click **"Storage"**
   - It's next to "Deployments", "Analytics", etc.
2. You'll see the Storage page with different database options

### 2.2 Select KV (Redis)

1. Look for the **"KV"** card with the Redis icon
2. You'll see:
   ```
   KV
   Durable Redis
   Low-latency data storage and caching
   ```
3. Click **"Create Database"** button on the KV card

**✅ Checkpoint:** You're now on the "Create KV Database" page

---

## Step 3: Configure KV Database

### 3.1 Database Name

1. You'll see a field: **"Database Name"**
2. Enter a descriptive name: `setappointmentapp-ratelimit`
   - Use lowercase letters, numbers, and hyphens only
   - This name is just for identification in your dashboard

### 3.2 Select Region (Important!)

1. You'll see **"Primary Region"** dropdown
2. **Choose the closest region to your users:**
   - **US East (iad)** - East Coast USA (recommended for US)
   - **US West (sfo)** - West Coast USA
   - **Europe (fra)** - Frankfurt, Germany
   - **Asia (hnd)** - Tokyo, Japan

**💡 Tip:** For best performance, choose the region closest to most of your traffic. Since SetAppointmentApp is likely US-focused, choose **US East (iad)**.

### 3.3 Review Settings

You'll see a summary:

```
Database Name: setappointmentapp-ratelimit
Primary Region: US East (iad)
Type: KV (Redis)
```

### 3.4 Create Database

1. Click the green **"Create"** button
2. Wait 5-10 seconds while Vercel provisions the database
3. You'll see a success message and be redirected to the database page

**✅ Checkpoint:** You now have a KV database! You should see the database dashboard.

---

## Step 4: Get Environment Variables

### 4.1 View Database Details

1. You should automatically be on the database page
2. If not, go to: **Storage** → **KV** → **setappointmentapp-ratelimit**

### 4.2 Find .env.local Tab

1. Look for tabs near the top: **"Overview"**, **".env.local"**, **"Settings"**
2. Click on **".env.local"** tab
3. You'll see code that looks like this:

```bash
KV_URL="redis://default:************@********.upstash.io:6379"
KV_REST_API_URL="https://********.kv.vercel-storage.com"
KV_REST_API_TOKEN="************"
KV_REST_API_READ_ONLY_TOKEN="************"
```

### 4.3 Copy Environment Variables

1. Look for the **"Copy Snippet"** button (usually top-right of the code block)
2. Click **"Copy Snippet"**
3. All four environment variables are now copied to your clipboard

**✅ Checkpoint:** You've copied the KV credentials to your clipboard

---

## Step 5: Add Variables to Project

### 5.1 Navigate to Project Settings

1. Click the **"← Back"** or breadcrumb to return to your project
2. Click on your project name: **setappointmentapp**
3. Click on **"Settings"** tab (top navigation)
4. In the left sidebar, click **"Environment Variables"**

### 5.2 Add KV Environment Variables

**Option A: Paste All at Once (Recommended)**

1. Click **"Add New"** button
2. Look for small text that says **"Paste .env"** (next to Add New)
3. Click **"Paste .env"**
4. A text box appears
5. Paste the copied snippet (Ctrl+V or Cmd+V)
6. Click **"Add"** button
7. You'll see all 4 variables added automatically!

**Option B: Add One by One (If Paste Doesn't Work)**

For each of these 4 variables:

**Variable 1: KV_REST_API_URL**

1. Click **"Add New"** button
2. **Key:** `KV_REST_API_URL`
3. **Value:** Paste the URL from your snippet (starts with `https://`)
4. **Environments:** Select all three:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **"Save"**

**Variable 2: KV_REST_API_TOKEN**

1. Click **"Add New"** button
2. **Key:** `KV_REST_API_TOKEN`
3. **Value:** Paste the token (long alphanumeric string)
4. **Environments:** Select all three
5. Click **"Save"**

**Variable 3: KV_REST_API_READ_ONLY_TOKEN** (Optional but recommended)

1. Click **"Add New"** button
2. **Key:** `KV_REST_API_READ_ONLY_TOKEN`
3. **Value:** Paste the read-only token
4. **Environments:** Select all three
5. Click **"Save"**

**Variable 4: KV_URL** (Optional - not used by our app but good to have)

1. Click **"Add New"** button
2. **Key:** `KV_URL`
3. **Value:** Paste the Redis URL (starts with `redis://`)
4. **Environments:** Select all three
5. Click **"Save"**

### 5.3 Verify Variables Added

You should now see in your Environment Variables list:

```
KV_REST_API_URL          Production, Preview, Development
KV_REST_API_TOKEN        Production, Preview, Development
KV_REST_API_READ_ONLY_TOKEN   Production, Preview, Development
KV_URL                   Production, Preview, Development
```

**✅ Checkpoint:** All KV environment variables are added to your project

---

## Step 6: Redeploy Application

### 6.1 Why Redeploy?

Environment variables are only applied to **new deployments**. Your currently running app doesn't have the KV credentials yet.

### 6.2 Trigger Redeployment

**Option A: Via Deployments Tab (Easiest)**

1. Click **"Deployments"** tab (top navigation)
2. Find your latest deployment (top of the list)
3. Click the **"⋯"** (three dots) menu on the right
4. Click **"Redeploy"**
5. In the popup, click **"Redeploy"** button
6. Wait 1-2 minutes for the deployment to complete

**Option B: Via Git Push (Alternative)**

1. Make any small change to your code (e.g., add a comment)
2. Commit and push:
   ```bash
   git add .
   git commit -m "chore: trigger redeploy for KV environment variables"
   git push
   ```
3. Vercel automatically deploys

### 6.3 Wait for Deployment

1. You'll see the deployment progress with a spinner
2. Status changes: **Building** → **Deploying** → **Ready**
3. When you see **"Ready"** with a green checkmark, it's done!

**✅ Checkpoint:** Your app is redeployed with KV credentials

---

## Step 7: Verify Rate Limiting Works

### 7.1 Visit Your Live Site

1. In your Vercel dashboard, find your deployment
2. Click **"Visit"** or go to: `https://setappointmentapp.vercel.app`

### 7.2 Test Rate Limiting

**Test 1: Normal Usage (Should Work)**

1. Fill out the booking form
2. Submit it
3. ✅ Should succeed normally

**Test 2: Rate Limit (Should Block)**

1. Submit the form again immediately
2. Submit a 3rd time
3. Submit a 4th time (within the same hour)
4. On the 4th submission, you should see:
   ```json
   {
     "error": "Too Many Requests",
     "message": "You have exceeded the maximum number of booking attempts..."
   }
   ```
5. Or be redirected to `/429` page

**✅ Checkpoint:** Rate limiting is working! You can only submit 3 forms per hour.

---

## Step 8: Monitor KV Usage

### 8.1 View Database Metrics

1. Go to Vercel Dashboard
2. Click **"Storage"** tab
3. Click on **"setappointmentapp-ratelimit"**
4. You'll see metrics:
   - **Commands:** Number of Redis operations
   - **Storage:** Data size (should be minimal)
   - **Bandwidth:** Network usage

### 8.2 Check Rate Limit Keys

1. On the KV database page, click **"Data Browser"** tab
2. You'll see keys that look like:
   ```
   ratelimit:form:123.456.789.0
   ratelimit:api:123.456.789.0
   ```
3. These are the rate limit counters per IP address
4. They automatically expire after the time window (1 hour for forms)

**✅ Checkpoint:** You can monitor rate limiting activity

---

## Troubleshooting

### Problem 1: Variables Not Showing Up

**Solution:**

- Make sure you selected all environments (Production, Preview, Development)
- Redeploy the application
- Wait 2-3 minutes after redeployment

### Problem 2: Rate Limiting Not Working

**Symptoms:** Can submit more than 3 forms per hour

**Check:**

1. Verify environment variables are set:
   - Settings → Environment Variables
   - Confirm `KV_REST_API_URL` and `KV_REST_API_TOKEN` exist
2. Check if you recently redeployed (needed for variables to apply)
3. Open browser DevTools → Network tab
4. Submit form and look for response headers:
   ```
   X-RateLimit-Limit: 3
   X-RateLimit-Remaining: 2
   ```
   If you don't see these headers, rate limiting isn't active

**Solution:**

- Redeploy your application
- Clear your browser cache
- Try from incognito/private window

### Problem 3: Error Creating Database

**Error:** "Failed to create database"

**Solutions:**

- Check if you're on the free plan (might need to remove old KV databases)
- Try a different database name
- Contact Vercel support if issue persists

### Problem 4: KV Database Not Connecting

**Error in logs:** "Failed to connect to Redis"

**Solutions:**

1. Verify the `KV_REST_API_URL` format:
   - Should start with `https://`
   - Should end with `.kv.vercel-storage.com`
2. Check the token isn't truncated when copying
3. Recreate the KV database if needed

---

## Free Tier Limits

Vercel KV Free Tier includes:

- ✅ **30 MB storage** (plenty for rate limiting)
- ✅ **10,000 commands/day** (more than enough)
- ✅ **100 GB bandwidth/month**

**For SetAppointmentApp:**

- Each form submission = 2-3 Redis commands
- 10,000 commands = ~3,000-5,000 form submissions/day
- **You're well within limits!**

If you exceed limits:

- Vercel will email you
- You can upgrade to Pro tier ($20/month for 256 MB)

---

## Security Best Practices

### ✅ Do:

- Keep your KV tokens secret (never commit to Git)
- Use environment variables (already done)
- Monitor usage regularly
- Set up Vercel alerting

### ❌ Don't:

- Share your `KV_REST_API_TOKEN` publicly
- Commit `.env.local` file to Git
- Use same token for multiple projects
- Disable rate limiting in production

---

## Summary Checklist

- [ ] **Step 1:** Logged into Vercel Dashboard
- [ ] **Step 2:** Created KV database named `setappointmentapp-ratelimit`
- [ ] **Step 3:** Chose primary region (US East recommended)
- [ ] **Step 4:** Copied environment variables from `.env.local` tab
- [ ] **Step 5:** Added KV variables to project settings
- [ ] **Step 6:** Redeployed application
- [ ] **Step 7:** Tested rate limiting (submit 4 forms)
- [ ] **Step 8:** Verified in KV dashboard

**Estimated Time:** 5-10 minutes
**Status:** Ready to complete!

---

## Next Steps

After completing this guide:

1. **Test Rate Limiting:**
   - Submit 4 forms within an hour
   - Confirm 4th submission is blocked

2. **Monitor Usage:**
   - Check KV dashboard daily for first week
   - Ensure you're within free tier limits

3. **Complete Remaining Setup:**
   - Create Google Analytics 4 property
   - Design social sharing image
   - Add Google Search Console verification

4. **Documentation:**
   - Mark KV setup as complete in Phase 3 checklist
   - Update deployment documentation

---

## Help & Support

**Vercel KV Documentation:**

- https://vercel.com/docs/storage/vercel-kv

**Rate Limiting Setup:**

- `src/lib/ratelimit/config.ts` - Configuration file
- `src/middleware.ts` - Middleware implementation

**Questions?**

- Vercel Support: https://vercel.com/support
- Vercel Community: https://github.com/vercel/vercel/discussions

---

**Document Location:** `docs/VERCEL_KV_SETUP_GUIDE.md`
**Last Updated:** 2025-10-30
**Phase:** 3 - Enhancement & Polish

Your SetAppointmentApp now has enterprise-grade rate limiting protection. Users can only submit 3 bookings per hour, and API requests are limited to 10 per minute. This protects against spam, abuse, and ensures fair usage for all visitors.
