# Vercel KV Setup Guide - Hobby Plan (Marketplace Method)

## Overview

If you're on Vercel's **Hobby (Free) Plan**, KV storage is now available through the **Marketplace** using Upstash Redis integration. This guide shows you how to set it up.

**Status:** Updated for 2025 - Hobby plan users must use Marketplace
**Time Required:** 10-15 minutes
**Cost:** Free (Upstash free tier: 10,000 commands/day)

---

## Why This Is Different

**Old Way (Pro Plan):**

- Storage → KV → Create (native Vercel KV)

**New Way (Hobby Plan):**

- Storage → Marketplace → Upstash/Redis → Create (marketplace integration)

**Important:** Our code works with both! No changes needed.

---

## Step 1: Access Storage Page

1. Go to Vercel Dashboard: https://vercel.com
2. Click on your project: **setappointmentapp**
3. Click **"Storage"** tab in the top navigation

**✅ Checkpoint:** You should see "Create a database" with Edge Config, Blob, and Marketplace Database Providers

---

## Step 2: Choose Marketplace Integration

You have **two options** (both work):

### Option A: Upstash Integration (Recommended)

**Why choose this:**

- More control and options
- Direct Upstash dashboard access
- Additional features (Vector, Queue, etc.) available later

**Steps:**

1. Look for **"Upstash"** in the Marketplace Database Providers section
2. It says: "Serverless DB (Redis, Vector, Queue, Search)"
3. Click the **">"** arrow on the right side (or click anywhere on the Upstash card)

### Option B: Redis Direct (Simpler)

**Why choose this:**

- Faster setup
- Less steps
- Same underlying technology (Upstash)

**Steps:**

1. Look for **"Redis"** in the Marketplace Database Providers section
2. It says: "Serverless Redis"
3. Click the **"Create"** button

---

## Step 3A: Setup via Upstash (Option A)

### 3A.1 Connect Upstash Integration

1. After clicking Upstash, you'll see integration details
2. Click **"Add Integration"** or **"Connect to Upstash"**
3. You'll be redirected to Upstash's website

### 3A.2 Create Upstash Account (If Needed)

1. If you don't have an Upstash account:
   - Click **"Sign Up"**
   - Use GitHub, Google, or Email
   - **Recommended:** Use same email as Vercel
2. If you have an account:
   - Click **"Sign In"**
   - Log in

### 3A.3 Authorize Vercel Integration

1. You'll see: "Vercel wants to connect to your Upstash account"
2. Review permissions (read/write databases)
3. Click **"Authorize"** or **"Allow"**
4. You'll be redirected back to Vercel

### 3A.4 Create Redis Database

1. In the Upstash dashboard or Vercel integration screen
2. Click **"Create Database"**
3. Fill in details:
   - **Name:** `setappointmentapp-ratelimit`
   - **Type:** Redis
   - **Region:** US-East-1 (or closest to your users)
   - **Plan:** Free (10k commands/day)
4. Click **"Create"**
5. Wait 5-10 seconds for provisioning

### 3A.5 Connect to Vercel Project

1. You'll see a screen: "Connect database to Vercel project"
2. Select your project: **setappointmentapp**
3. Click **"Connect"** or **"Add"**
4. Environment variables will be automatically added!

**✅ Checkpoint:** Environment variables are now in your Vercel project settings

---

## Step 3B: Setup via Redis Direct (Option B)

### 3B.1 Click Create on Redis

1. Click **"Create"** button next to Redis option
2. You'll be taken to setup flow

### 3B.2 Configure Database

1. **Database Name:** `setappointmentapp-ratelimit`
2. **Region:** Select US East (or closest)
3. **Plan:** Free tier (should be pre-selected)
4. Click **"Create Database"**

### 3B.3 Connect to Project

1. After creation, you'll see integration options
2. Select your project: **setappointmentapp**
3. Click **"Connect"**
4. Environment variables added automatically

**✅ Checkpoint:** Database created and connected to project

---

## Step 4: Verify Environment Variables

### 4.1 Check Project Settings

1. In Vercel, go to your project: **setappointmentapp**
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in left sidebar

### 4.2 Verify Variables Exist

You should see variables like:

```
UPSTASH_REDIS_REST_URL          Production, Preview, Development
UPSTASH_REDIS_REST_TOKEN        Production, Preview, Development
```

**OR**

```
KV_REST_API_URL                 Production, Preview, Development
KV_REST_API_TOKEN               Production, Preview, Development
```

**Note:** Variable names may differ slightly, but both work!

---

## Step 5: Update Code (If Needed)

### 5.1 Check Variable Names

Our code in `src/lib/ratelimit/config.ts` expects:

```typescript
KV_REST_API_URL;
KV_REST_API_TOKEN;
```

If Upstash created different variable names, we need to update our code.

### 5.2 Check What Variables Were Created

Look at your Environment Variables. If you see:

- ✅ `KV_REST_API_URL` and `KV_REST_API_TOKEN` → **No changes needed!**
- ⚠️ `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` → **Need to update code**

### 5.3 Update Code (Only if Variables Have Different Names)

If your variables are named `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`:

**Open:** `src/lib/ratelimit/config.ts`

**Find this:**

```typescript
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}
```

**Replace with:**

```typescript
// Check for both naming conventions (Vercel KV and Upstash)
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
}
```

**Save the file.**

---

## Step 6: Deploy Changes

### 6.1 Commit Code Changes (If You Made Any)

```bash
git add src/lib/ratelimit/config.ts
git commit -m "fix: support Upstash Redis environment variable names"
git push
```

### 6.2 Or Trigger Redeploy (If No Code Changes)

1. Go to **Deployments** tab
2. Find latest deployment
3. Click **"⋯"** (three dots)
4. Click **"Redeploy"**
5. Wait for deployment to complete

**✅ Checkpoint:** Application deployed with Redis credentials

---

## Step 7: Test Rate Limiting

### 7.1 Visit Your Site

Go to: https://setappointmentapp.vercel.app

### 7.2 Test Submissions

1. Fill out booking form
2. Submit (1st time - ✅ should work)
3. Submit again (2nd time - ✅ should work)
4. Submit again (3rd time - ✅ should work)
5. Submit again (4th time - ❌ should be blocked!)

### 7.3 Expected Behavior on 4th Submission

You should see:

```json
{
  "error": "Too Many Requests",
  "message": "You have exceeded the maximum number of booking attempts. Please try again later.",
  "retryAfter": 3600
}
```

**OR** be redirected to `/429` error page.

**✅ Checkpoint:** Rate limiting is working!

---

## Step 8: Monitor Usage

### 8.1 Access Upstash Dashboard

**Option 1: Via Vercel**

1. Go to **Storage** tab
2. Find your Redis database
3. Click to open (may redirect to Upstash)

**Option 2: Direct**

1. Go to: https://console.upstash.com
2. Sign in with your account
3. Click on `setappointmentapp-ratelimit` database

### 8.2 View Metrics

You'll see:

- **Daily Requests:** Number of Redis commands
- **Storage:** Data size (very small for rate limiting)
- **Top Keys:** Most accessed rate limit keys

### 8.3 Check Data Browser

1. Click **"Data Browser"** or **"CLI"** tab
2. Run command: `KEYS ratelimit:*`
3. You'll see keys like:
   ```
   ratelimit:form:123.456.789.0
   ratelimit:api:123.456.789.0
   ```
4. These auto-expire after the time window

---

## Troubleshooting

### Issue 1: Environment Variables Not Found

**Symptom:** Rate limiting doesn't work, no 429 errors

**Check:**

```bash
# In Vercel dashboard
Settings → Environment Variables

# Should see either:
KV_REST_API_URL + KV_REST_API_TOKEN
# OR
UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
```

**Solution:**

- Verify integration is connected
- Check if variables are set for Production environment
- Redeploy application

### Issue 2: Can Still Submit More Than 3 Forms

**Possible Causes:**

1. Using different IP addresses (mobile vs wifi)
2. Browser cache
3. Variables not loaded yet

**Solutions:**

1. Test from same device/network
2. Clear browser cache
3. Try incognito/private window
4. Wait 5 minutes after redeployment

### Issue 3: Integration Failed

**Error:** "Could not connect to Upstash"

**Solutions:**

1. Remove integration and try again
2. Clear browser cookies
3. Try different browser
4. Contact Vercel support

### Issue 4: Variable Names Different

**If code doesn't recognize variable names:**

Update `src/lib/ratelimit/config.ts` to support both:

```typescript
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
```

---

## Free Tier Limits - Upstash

**Upstash Free Tier:**

- ✅ 10,000 commands per day
- ✅ 256 MB storage
- ✅ Global regions
- ✅ No credit card required

**For SetAppointmentApp:**

- Each form submission = ~2-3 commands
- 10,000 commands = 3,000-5,000 submissions/day
- **More than enough for most apps!**

**If you exceed:**

- Upstash will email you
- Can upgrade to pay-as-you-go ($0.20 per 100k commands)

---

## Comparison: Native KV vs Upstash Redis

| Feature          | Native KV (Pro Plan) | Upstash (Hobby Plan)     |
| ---------------- | -------------------- | ------------------------ |
| **Cost**         | $20/mo Vercel Pro    | Free (10k/day)           |
| **Setup**        | Simpler (2 clicks)   | More steps (integration) |
| **Performance**  | Same (uses Upstash)  | Same (same technology)   |
| **Dashboard**    | Vercel dashboard     | Upstash dashboard        |
| **Commands/day** | Based on plan        | 10,000 (free tier)       |
| **Code Changes** | None                 | Possibly variable names  |

**Bottom Line:** Both work great! Hobby plan users just use marketplace integration.

---

## Complete Checklist

- [ ] Access Storage → Marketplace
- [ ] Choose Upstash or Redis option
- [ ] Create account (if needed)
- [ ] Authorize integration
- [ ] Create Redis database `setappointmentapp-ratelimit`
- [ ] Select region (US East)
- [ ] Connect to Vercel project
- [ ] Verify environment variables exist
- [ ] Update code if variable names differ
- [ ] Deploy/redeploy application
- [ ] Test rate limiting (submit 4 forms)
- [ ] Verify 4th submission blocked
- [ ] Check Upstash dashboard

**Estimated Time:** 10-15 minutes
**Difficulty:** Easy (just a few extra steps vs Pro plan)

---

## Next Steps

After completing this setup:

1. ✅ **Rate limiting is active!**
2. Monitor Upstash dashboard for first few days
3. Continue with Google Analytics setup
4. Create social sharing image
5. Add Google Search Console verification

---

## Summary

**What You Did:**

- Created Upstash Redis database via Marketplace
- Connected to Vercel project automatically
- Environment variables added automatically
- Rate limiting now protects your forms (3/hour max)

**What's Working:**

- 3 form submissions per hour per IP
- 10 API requests per minute per IP
- Automatic rate limit headers
- Custom 429 error page

**Status:** ✅ Complete - Rate limiting enabled via Upstash!

---

**Document Location:** `docs/VERCEL_KV_SETUP_HOBBY_PLAN.md`
**Last Updated:** 2025-10-30
**Plan Support:** Hobby (Free) Plan
**Alternative:** See `VERCEL_KV_SETUP_GUIDE.md` for Pro plan native KV setup
