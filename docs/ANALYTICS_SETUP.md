# Google Analytics 4 Setup Guide

## Overview

Complete guide for setting up Google Analytics 4 (GA4) with conversion tracking, event monitoring, and GDPR compliance.

**Last Updated:** 2025-10-30
**Phase:** 3 - SEO & Analytics
**Status:** ✅ Code Ready - Needs GA4 Account Setup

---

## Prerequisites

✅ Production website deployed
✅ Google Account for Analytics
✅ Analytics tracking code implemented
✅ Conversion tracking configured
✅ GDPR-compliant consent defaults

---

## Step 1: Create Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon, bottom left)
3. Click **Create Property**
4. Enter property details:
   - **Property name:** SetAppointmentApp
   - **Reporting time zone:** Your timezone
   - **Currency:** USD
5. Click **Next**
6. Select business details:
   - **Industry:** Technology / Software
   - **Business size:** Small (1-10 employees)
7. Select business objectives:
   - ✅ Generate leads
   - ✅ Examine user behavior
8. Click **Create**
9. Accept Terms of Service

---

## Step 2: Set Up Data Stream

1. After property creation, you'll be prompted to add a data stream
2. Select **Web**
3. Enter website details:
   - **Website URL:** `https://setappointmentapp.vercel.app`
   - **Stream name:** SetAppointmentApp Production
   - **Enhanced measurement:** Enable all (default)
4. Click **Create stream**
5. **Copy the Measurement ID** (format: `G-XXXXXXXXXX`)

---

## Step 3: Configure Environment Variables

### Local Development (.env.local)

```bash
# Google Analytics 4 Measurement ID
# Get from: Analytics → Admin → Data Streams → Your Stream
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Vercel Production

1. Go to Vercel Dashboard → Your Project
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Key:** `NEXT_PUBLIC_GA_ID`
   - **Value:** `G-XXXXXXXXXX`
   - **Environments:** Production, Preview, Development
4. Click **Save**
5. Redeploy application

---

## Step 4: Verify Installation

### Test in Development

1. Run: `npm run dev`
2. Open browser DevTools → Console
3. Look for GA initialization messages
4. Note: Analytics won't track in development mode (by design)

### Test in Production

1. Deploy to production
2. Visit your production site
3. Open browser DevTools → Network tab
4. Filter for `google-analytics` or `gtag`
5. Verify requests to `www.google-analytics.com`

### Real-Time Report

1. In Google Analytics, go to **Reports** → **Realtime**
2. Visit your production site
3. Within 30 seconds, you should see activity
4. Verify page views are being tracked

---

## Step 5: Configure Conversions

### Set Up "booking_complete" Conversion

1. In GA4, go to **Admin** → **Events**
2. Wait for `generate_lead` event to appear (may take 24 hours)
3. Once visible, toggle **Mark as conversion**

Alternative method (immediate):

1. Go to **Admin** → **Conversions**
2. Click **New conversion event**
3. Enter event name: `generate_lead`
4. Click **Save**

### Verify Conversion Tracking

1. Submit a test booking on production
2. In GA4, go to **Reports** → **Realtime** → **Event count by Event name**
3. Look for:
   - `generate_lead` (conversion event)
   - `page_view`
   - `cta_click`
4. May take 24-48 hours to appear in standard reports

---

## Step 6: Set Up Goals and Funnels

### Booking Funnel

1. Go to **Explore** → **Funnel exploration**
2. Create funnel steps:
   - Step 1: `page_view` (Homepage)
   - Step 2: `cta_click` (Get Started button)
   - Step 3: `form_interaction` (Form field engagement)
   - Step 4: `generate_lead` (Form submission)
3. Save as **Booking Funnel**

### Conversion Rate Goal

1. Go to **Admin** → **Custom definitions** → **Custom metrics**
2. Create metric:
   - **Name:** Booking Conversion Rate
   - **Description:** Percentage of visitors who book
   - **Calculation:** `conversions / sessions * 100`

---

## Step 7: Enable Enhanced Measurement

Ensure these are enabled (should be default):

1. Go to **Admin** → **Data Streams** → Your stream
2. Click **Enhanced measurement** (gear icon)
3. Verify enabled:
   - ✅ Page views
   - ✅ Scrolls (25%, 50%, 75%, 90%)
   - ✅ Outbound clicks
   - ✅ Site search (when implemented)
   - ✅ Video engagement
   - ✅ File downloads

---

## Tracked Events

### Automatic Events (Built-in)

- `page_view` - Every page load
- `scroll` - 25%, 50%, 75%, 90% scroll depth
- `click` - Outbound link clicks
- `session_start` - New session begins
- `first_visit` - First time visitor

### Custom Events (Implemented)

**1. Form Submission (Conversion)**

```typescript
generate_lead
├─ email: string
├─ company: string
├─ project_type: string
└─ budget: string
```

**2. CTA Clicks**

```typescript
cta_click
├─ category: 'engagement'
├─ label: button_name
└─ location: section_name
```

**3. Form Field Interactions**

```typescript
form_focus | form_blur | form_fill
├─ category: 'form_interaction'
└─ label: field_name
```

**4. Video Interactions**

```typescript
video_play | video_pause | video_complete
├─ category: 'engagement'
└─ label: video_title
```

**5. Errors**

```typescript
page_not_found
├─ category: 'error'
└─ label: path
```

---

## Step 8: Configure Audiences

### High-Intent Visitors

1. Go to **Admin** → **Audiences**
2. Click **New audience**
3. Configure:
   - **Name:** High-Intent Visitors
   - **Conditions:**
     - Visited `/` AND
     - Event `cta_click` AND
     - Session duration > 30 seconds
4. Use for remarketing (if ads enabled)

### Form Abandoners

1. Create audience:
   - **Name:** Form Abandoners
   - **Conditions:**
     - Event `form_focus` AND
     - NOT Event `generate_lead`
     - Within 7 days
2. Use for follow-up campaigns

---

## Step 9: Connect to Other Tools

### Link to Google Search Console

1. In GA4, go to **Admin** → **Product links**
2. Click **Search Console links** → **Link**
3. Select your Search Console property
4. Click **Confirm**
5. Click **Submit**

**Benefits:**

- See search queries driving traffic
- Landing page performance
- Organic search analytics

### Link to Google Ads (Optional)

If running ads:

1. Go to **Admin** → **Google Ads links**
2. Follow linking process
3. Enable auto-tagging

---

## Step 10: Set Up Reporting

### Create Custom Dashboard

1. Go to **Reports** → **Library**
2. Click **Create new collection**
3. Add reports:
   - Acquisition overview
   - Engagement overview
   - Conversions (generate_lead)
   - User demographics
   - Technology (devices, browsers)

### Schedule Email Reports

1. Open any report
2. Click **Share** (top right)
3. Click **Schedule email**
4. Configure:
   - Frequency: Weekly
   - Day: Monday 9 AM
   - Recipients: Your email
5. Click **Save**

---

## Privacy & Compliance

### GDPR Compliance

**Current Implementation:**

- ✅ Analytics consent defaults to DENIED
- ✅ IP anonymization enabled
- ✅ No ad tracking (ad_storage: denied)
- ✅ Secure cookies (SameSite=None; Secure)

**To Enable (After User Consent):**

```typescript
import { updateConsent } from '@/lib/analytics/gtag';

// Call after user accepts cookies
updateConsent(true);
```

### Data Retention

1. Go to **Admin** → **Data retention**
2. Set to: **14 months** (recommended)
3. Enable: **Reset user data on new activity**

### User Deletion Requests

1. Go to **Admin** → **Data deletion requests**
2. Create request with user ID
3. Data deleted within 7 days

---

## Monitoring & Maintenance

### Weekly Tasks

- Review Real-time report for issues
- Check conversion rate trends
- Monitor form abandonment rate
- Review top performing pages

### Monthly Tasks

- Analyze traffic sources
- Review conversion funnel drop-off
- Check device/browser performance
- Update audiences based on behavior

### Quarterly Tasks

- Review and update goals
- A/B test landing page variations
- Analyze seasonal trends
- Optimize conversion paths

---

## Troubleshooting

### No Data Appearing

**Check:**

1. ✅ `NEXT_PUBLIC_GA_ID` is set in Vercel
2. ✅ Site is deployed to production
3. ✅ Measurement ID format is correct (`G-XXXXXXXXXX`)
4. ✅ No ad blockers interfering
5. ✅ Browser console shows no errors

**Solution:**

- Redeploy after setting environment variable
- Wait 24 hours for data aggregation
- Check Real-time report (shows immediate data)

### Conversions Not Tracking

**Check:**

1. ✅ `generate_lead` marked as conversion
2. ✅ Form submission completes successfully
3. ✅ Network tab shows gtag requests
4. ✅ No JavaScript errors in console

**Solution:**

- Test form submission in production
- Check browser DevTools → Network → gtag
- Verify `trackFormSubmission` is called
- Wait 24-48 hours for conversion aggregation

### Events Missing

**Check:**

1. Event names match exactly (case-sensitive)
2. Events fire in browser console (if dev mode)
3. No content blockers or privacy extensions

**Solution:**

- Use DebugView in GA4 (Admin → DebugView)
- Add `?debug_mode=true` to URL
- Verify events appear in Real-time

---

## Key Metrics to Track

### Primary KPIs

- **Conversion Rate:** bookings / total visitors
- **Form Completion Rate:** submissions / form starts
- **Average Session Duration:** engagement indicator
- **Bounce Rate:** single-page sessions
- **Top Traffic Sources:** where visitors come from

### Secondary KPIs

- CTA click-through rate
- Form field abandonment points
- Mobile vs Desktop conversion rates
- Time to convert (first visit → booking)
- Returning visitor rate

---

## Resources

**Documentation:**

- [GA4 Help Center](https://support.google.com/analytics/answer/9304153)
- [GA4 Setup Guide](https://developers.google.com/analytics/devguides/collection/ga4)
- [Event Tracking](https://developers.google.com/analytics/devguides/collection/ga4/events)

**Testing Tools:**

- [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger)
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)
- [Tag Assistant](https://tagassistant.google.com/)

**Implementation Files:**

- `src/lib/analytics/gtag.ts` - Analytics functions
- `src/components/analytics/GoogleAnalytics.tsx` - GA component
- `src/app/layout.tsx` - Integration
- `src/components/sections/BookingForm.tsx` - Conversion tracking

---

## Next Steps

1. ✅ Create GA4 property
2. ✅ Get Measurement ID
3. ✅ Add to Vercel environment variables
4. ✅ Deploy to production
5. ✅ Verify tracking in Real-time
6. ✅ Mark `generate_lead` as conversion
7. ✅ Set up custom dashboard
8. ✅ Link Search Console
9. ✅ Create booking funnel
10. ✅ Schedule weekly reports

**Status:** Ready for GA4 account creation
**Action Required:** Create GA4 property and configure Measurement ID

---

**Documentation Location:** `docs/ANALYTICS_SETUP.md`
