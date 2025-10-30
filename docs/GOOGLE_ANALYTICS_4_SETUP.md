# Google Analytics 4 (GA4) Setup Guide

## Overview

This guide will walk you through setting up Google Analytics 4 for your SetAppointmentApp. GA4 is already integrated in the codebase - you just need to create a property and add the Measurement ID.

**Time Required:** 15-20 minutes
**Cost:** Free (Google Analytics is free for standard usage)
**Prerequisites:** Google account

---

## Why Google Analytics 4?

**Benefits:**

- ✅ Track visitor behavior and traffic sources
- ✅ Measure conversion rate (form submissions)
- ✅ Understand user demographics and interests
- ✅ Monitor page performance and engagement
- ✅ Make data-driven decisions for improvements

**What's Already Integrated:**

- Google Analytics script component
- Custom event tracking (7 events)
- Conversion tracking for form submissions
- GDPR-compliant configuration
- Production-only tracking (no dev data)

---

## Step 1: Create Google Analytics Account (If Needed)

### 1.1 Visit Google Analytics

Go to: https://analytics.google.com

### 1.2 Sign In

- Click **"Start measuring"** or **"Sign in"**
- Use your Google account (personal or business)
- **Recommended:** Use the same Google account you'll use for Search Console

### 1.3 Accept Terms

- Review and accept the terms of service
- Select your data sharing preferences
- Click **"I Accept"**

**✅ Checkpoint:** You're now on the Google Analytics dashboard

---

## Step 2: Create GA4 Property

### 2.1 Create Account (First Time Only)

If this is your first time:

1. Click **"Start measuring"**
2. **Account name:** Enter your company/website name (e.g., "SetAppointmentApp")
3. **Account Data Sharing Settings:** Check recommended options:
   - ✅ Benchmarking
   - ✅ Technical support
   - ✅ Account specialists
4. Click **"Next"**

### 2.2 Create Property

1. **Property name:** `SetAppointmentApp` (or your preferred name)
2. **Reporting time zone:** Select your timezone
3. **Currency:** Select your currency (USD, EUR, etc.)
4. Click **"Next"**

### 2.3 Business Information

1. **Industry category:** Select "Technology" or "Internet & Telecom"
2. **Business size:** Select your company size
3. **How you plan to use Google Analytics:**
   - ✅ Examine user behavior
   - ✅ Measure advertising ROI
   - ✅ Baseline reports
4. Click **"Create"**

### 2.4 Accept Terms

- Accept Google Analytics Terms of Service
- Accept Data Processing Terms
- Click **"I Accept"**

**✅ Checkpoint:** GA4 property created successfully

---

## Step 3: Set Up Data Stream

### 3.1 Choose Platform

You'll see **"Choose a platform to get started"**

1. Click **"Web"**

### 3.2 Configure Web Stream

1. **Website URL:** `https://setappointmentapp.vercel.app`
   - Or your custom domain if configured
2. **Stream name:** `SetAppointmentApp Website` (or preferred name)
3. **Enhanced measurement:** ✅ **Leave enabled** (recommended)
   - This automatically tracks:
     - Page views
     - Scrolls
     - Outbound clicks
     - Site search
     - Video engagement
     - File downloads
4. Click **"Create stream"**

**✅ Checkpoint:** Web data stream created

---

## Step 4: Get Your Measurement ID

### 4.1 Copy Measurement ID

After creating the stream, you'll see the stream details page.

1. Look for **"Measurement ID"** at the top right
2. Format: `G-XXXXXXXXXX` (starts with "G-")
3. Click the **copy icon** next to it
4. Save this ID - you'll need it for Vercel

**Example:** `G-ABC12DEF34`

**✅ Checkpoint:** Measurement ID copied

---

## Step 5: Add Measurement ID to Vercel

### 5.1 Go to Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click on your project: **setappointmentapp**

### 5.2 Add Environment Variable

1. Click **"Settings"** tab
2. Click **"Environment Variables"** in left sidebar
3. Click **"Add New"** button
4. Configure:
   - **Key:** `NEXT_PUBLIC_GA_ID`
   - **Value:** Paste your Measurement ID (e.g., `G-ABC12DEF34`)
   - **Environments:** Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development (optional - tracking is disabled in dev mode anyway)
5. Click **"Save"**

**✅ Checkpoint:** Environment variable added to Vercel

---

## Step 6: Deploy and Verify

### 6.1 Trigger Redeployment

**Option A: From Vercel Dashboard**

1. Go to **Deployments** tab
2. Find latest deployment
3. Click **"⋯"** (three dots)
4. Click **"Redeploy"**
5. Confirm redeployment

**Option B: Git Push** (if making other changes)

```bash
git commit --allow-empty -m "chore: trigger redeployment for GA4"
git push origin main
```

### 6.2 Wait for Deployment

- Watch the deployment progress in Vercel
- Typically takes 2-3 minutes
- Wait for **"Deployment ready"** status

**✅ Checkpoint:** New deployment completed

---

## Step 7: Test Tracking

### 7.1 Visit Your Site

Go to: https://setappointmentapp.vercel.app

### 7.2 Check Real-Time Reports

Back in Google Analytics:

1. Click **"Reports"** in left sidebar
2. Click **"Realtime"**
3. You should see yourself as an active user!

**What to look for:**

- **Users by...:** Should show 1 user (you)
- **Event count by Event name:** Should show events like:
  - `page_view`
  - `session_start`
  - `first_visit`

### 7.3 Test Custom Events

On your site:

1. **Click a CTA button** → Should trigger `cta_click` event
2. **Focus on a form field** → Should trigger `form_focus` event
3. **Submit the booking form** → Should trigger:
   - `generate_lead` event
   - `conversion` event
   - `form_submit` event

Go back to GA4 Realtime and verify these events appear!

**✅ Checkpoint:** Tracking verified and working

---

## Step 8: Configure Conversions

### 8.1 Mark Events as Conversions

1. In GA4, go to **"Configure"** → **"Events"**
2. You'll see a list of events
3. Find these events and toggle **"Mark as conversion"**:
   - ✅ `generate_lead` (most important - form submissions)
   - ✅ `form_submit`
   - ✅ `conversion` (if it appears)

**Why mark as conversion:**

- Appears in conversion reports
- Can be used for Google Ads
- Helps measure ROI
- Tracks important user actions

**✅ Checkpoint:** Conversions configured

---

## Step 9: Set Up Reports (Optional)

### 9.1 Create Custom Reports

**Engagement Report:**

1. Go to **"Reports"** → **"Engagement"** → **"Events"**
2. View your custom events:
   - `generate_lead`
   - `cta_click`
   - `form_focus`
   - `scroll_depth`

**Conversion Report:**

1. Go to **"Reports"** → **"Engagement"** → **"Conversions"**
2. See conversion rates and counts

**User Acquisition:**

1. Go to **"Reports"** → **"Acquisition"** → **"User acquisition"**
2. See where visitors come from (Direct, Organic, Social, etc.)

### 9.2 Create Exploration (Advanced)

1. Click **"Explore"** in left sidebar
2. Click **"Blank"** template
3. Create custom reports with:
   - Funnel analysis (visitor → form view → submission)
   - Path exploration (user journey through site)
   - Segment overlap (user demographics)

**✅ Checkpoint:** Reports configured

---

## Troubleshooting

### Issue 1: No Data Appearing in GA4

**Possible Causes:**

1. Measurement ID not added to Vercel
2. Environment variable name incorrect
3. Site not redeployed after adding variable
4. Ad blocker preventing tracking
5. Still in development mode

**Solutions:**

1. Verify environment variable:
   ```
   Key: NEXT_PUBLIC_GA_ID
   Value: G-XXXXXXXXXX
   ```
2. Check variable is set for "Production" environment
3. Trigger redeployment in Vercel
4. Disable ad blocker temporarily
5. Test on production URL, not localhost

### Issue 2: Events Not Showing

**Check:**

- Wait 5-10 minutes (real-time can have slight delays)
- Verify you're testing on production site
- Check browser console for errors
- Try incognito/private window

### Issue 3: Wrong Domain in GA4

**If you set up with Vercel URL but now have custom domain:**

1. Go to **"Admin"** → **"Data Streams"**
2. Click your web stream
3. Click **"Configure tag settings"**
4. Click **"List unwanted referrals"**
5. Add both domains so they're tracked as one site:
   - `setappointmentapp.vercel.app`
   - `yourdomain.com`

---

## What Gets Tracked

### Automatic Events (Enhanced Measurement)

These are tracked automatically by GA4:

- **page_view:** Every page visit
- **scroll:** When user scrolls 90% down page
- **click:** Outbound links
- **file_download:** Any PDF/file downloads
- **video_start / video_complete:** Video interactions

### Custom Events (Our Implementation)

These are custom events we coded:

- **generate_lead:** When form is submitted (conversion)
- **form_submit:** Form submission success
- **cta_click:** Call-to-action button clicks
- **form_focus:** When user focuses on form input
- **scroll_depth:** Tracks 25%, 50%, 75%, 100% scroll
- **navigation_click:** Menu/navigation clicks
- **outbound_link:** External link clicks

### User Properties

We track these user attributes:

- Email (hashed for privacy)
- Company name
- Project type
- Budget range

**Privacy Note:** All data is anonymized and GDPR-compliant.

---

## Privacy & GDPR Compliance

### What We Do for Privacy:

1. **IP Anonymization:** Enabled by default
2. **Consent Mode:** Default consent is DENIED
3. **No Personal Data:** Email is hashed before sending
4. **Production Only:** No tracking in development
5. **User Control:** Visitors can opt out via browser settings

### Compliance Checklist:

- [ ] Add Privacy Policy page (mention Google Analytics)
- [ ] Add Cookie Notice banner (optional but recommended)
- [ ] Update Terms of Service to mention tracking
- [ ] Provide opt-out link in footer

**Resources:**

- Google Analytics Privacy Policy: https://policies.google.com/privacy
- GDPR Guide: https://support.google.com/analytics/answer/9019185

---

## Best Practices

### 1. Check Reports Weekly

- Monitor conversion rates
- Identify top traffic sources
- Find pages with high bounce rates

### 2. Set Up Goals

Create specific conversion goals:

- **Primary:** Form submissions
- **Secondary:** CTA button clicks
- **Tertiary:** Scroll depth (engagement)

### 3. Use Annotations

Mark important dates:

- Site launches
- Major updates
- Marketing campaigns
- Seasonal trends

### 4. Create Alerts

Set up custom alerts for:

- Spike in traffic
- Drop in conversions
- Unusual bounce rates

### 5. Regular Audits

Monthly checklist:

- Review top landing pages
- Check conversion funnel
- Analyze user demographics
- Identify technical issues

---

## Next Steps After Setup

1. **Link Google Search Console:**
   - Helps with SEO tracking
   - See search queries driving traffic
   - Guide: `docs/GOOGLE_SEARCH_CONSOLE_SETUP.md`

2. **Set Up Google Ads (Optional):**
   - Link GA4 to Google Ads account
   - Track ad performance
   - Optimize ad spend based on conversions

3. **Create Dashboard:**
   - Use Looker Studio (free)
   - Create custom dashboards
   - Share with team/stakeholders

4. **Monitor Regularly:**
   - Check weekly reports
   - Adjust strategy based on data
   - A/B test changes

---

## Summary

**What You Did:**

- ✅ Created Google Analytics 4 property
- ✅ Set up web data stream
- ✅ Added Measurement ID to Vercel
- ✅ Deployed and verified tracking
- ✅ Configured conversions

**What's Working:**

- Page view tracking on all pages
- Form submission tracking (conversions)
- Custom event tracking (7 events)
- Real-time user monitoring
- GDPR-compliant privacy settings

**What's Tracked:**

- Visitor count and sources
- Page views and engagement
- Form submissions (conversions)
- Button clicks and interactions
- Scroll depth and time on site
- User demographics and interests

**Status:** ✅ Complete - Google Analytics 4 fully operational!

---

**Document Location:** `docs/GOOGLE_ANALYTICS_4_SETUP.md`
**Last Updated:** 2025-10-30
**Related Docs:**

- `docs/ANALYTICS_SETUP.md` (detailed technical setup)
- `docs/GOOGLE_SEARCH_CONSOLE_SETUP.md` (SEO tracking)
- `src/lib/analytics/gtag.ts` (implementation code)
