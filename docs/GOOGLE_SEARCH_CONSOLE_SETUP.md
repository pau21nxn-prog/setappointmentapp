# Google Search Console Setup Guide

## Overview

Google Search Console is a free tool that helps you monitor, maintain, and troubleshoot your site's presence in Google Search results. This guide walks through the complete setup process.

**Last Updated:** 2025-10-30
**Phase:** 3 - SEO & Analytics

---

## Prerequisites

✅ Production website deployed at: `https://setappointmentapp.vercel.app`
✅ Sitemap created at: `/sitemap.xml`
✅ Robots.txt configured at: `/robots.txt`
✅ Structured data (JSON-LD) implemented
✅ Meta tags and OpenGraph configured

---

## Step 1: Create Google Search Console Account

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **"Add Property"**

---

## Step 2: Choose Verification Method

### Option A: Domain Property (Recommended)

**Verifies all subdomains and protocols (http/https)**

1. Select **"Domain"**
2. Enter: `setappointmentapp.vercel.app`
3. Copy the TXT record provided
4. Add to your DNS settings:
   - **Type:** TXT
   - **Name:** @ (or leave blank)
   - **Value:** `google-site-verification=XXXXXXXXXXXX`
5. Wait 5-10 minutes for DNS propagation
6. Click **"Verify"**

### Option B: URL Prefix (Easier for Vercel)

**Verifies specific URL only**

1. Select **"URL prefix"**
2. Enter: `https://setappointmentapp.vercel.app`
3. Choose verification method:

#### HTML Tag Method (Recommended for Next.js)

**Current Status:** Pre-configured placeholder in `src/app/layout.tsx`

```typescript
verification: {
  google: 'your-google-verification-code', // Replace this value
}
```

**Steps:**

1. Google provides a meta tag like:
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXXXX" />
   ```
2. Copy the content value: `XXXXXXXXXXXX`
3. Update `src/app/layout.tsx`:
   ```typescript
   verification: {
     google: 'XXXXXXXXXXXX', // Paste your code here
   }
   ```
4. Deploy to production
5. Return to Google Search Console and click **"Verify"**

#### Alternative Methods

**HTML File Upload:**

- Download the HTML file from Google
- Place in `public/` folder
- Redeploy
- Click "Verify"

**Google Analytics:**

- If GA is already installed, use this method
- Google verifies via existing GA tracking code

**Google Tag Manager:**

- If GTM is installed, use this method
- Google verifies via existing GTM container

---

## Step 3: Submit Sitemap

After verification:

1. In Google Search Console, go to **"Sitemaps"** (left sidebar)
2. Enter sitemap URL: `sitemap.xml`
3. Click **"Submit"**

**Result:** Google will discover and index:

- Homepage: `/`
- Confirmation page: `/confirmation`
- Error page: `/429`

**Indexing Time:** Usually 24-72 hours for first crawl

---

## Step 4: Monitor Performance

### Key Metrics to Track

1. **Performance Report**
   - Total clicks
   - Total impressions
   - Average CTR (Click-Through Rate)
   - Average position

2. **Coverage Report**
   - Valid pages indexed
   - Errors (pages with issues)
   - Warnings
   - Excluded pages (intentionally not indexed)

3. **Enhancements**
   - Mobile usability
   - Core Web Vitals
   - Structured data validation

4. **Experience**
   - Page experience signals
   - Mobile usability
   - HTTPS security

---

## Step 5: Fix Common Issues

### Issue: Sitemap Not Found

**Solution:**

- Verify sitemap is accessible: `https://setappointmentapp.vercel.app/sitemap.xml`
- Check for 404 errors
- Ensure `sitemap.ts` is in `src/app/` directory

### Issue: Pages Not Indexed

**Solution:**

- Check `robots.txt` isn't blocking pages
- Verify pages are included in sitemap
- Use "URL Inspection Tool" to request indexing
- Check for `noindex` meta tags

### Issue: Structured Data Errors

**Solution:**

- Use [Rich Results Test](https://search.google.com/test/rich-results)
- Validate JSON-LD in `src/lib/seo/structuredData.ts`
- Fix schema.org syntax errors

### Issue: Mobile Usability Problems

**Solution:**

- Test with [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- Ensure responsive design
- Check viewport meta tag
- Test on real devices

---

## Step 6: Advanced Configuration

### Set Preferred Domain

1. Go to **Settings** → **Property Settings**
2. Confirm preferred domain is set

### Set Geo-Targeting (Optional)

1. Go to **Settings** → **International Targeting**
2. Select target country (e.g., United States)

### Add Users (Optional)

1. Go to **Settings** → **Users and permissions**
2. Add team members with appropriate access levels:
   - **Owner:** Full control
   - **Full user:** All permissions except managing users
   - **Restricted user:** View data only

### Set Up Email Alerts

1. Google automatically sends alerts for:
   - Critical indexing issues
   - Manual actions (penalties)
   - Security issues
2. Configure in **Settings** → **Email preferences**

---

## Step 7: Submit for Rich Results

### Verify Structured Data

1. Go to [Rich Results Test](https://search.google.com/test/rich-results)
2. Enter URL: `https://setappointmentapp.vercel.app`
3. Check for:
   - ✅ Organization schema
   - ✅ WebSite schema
   - ✅ Service schema
4. Fix any errors found

### Expected Rich Results

**Organization:**

- Business name in Knowledge Panel
- Star ratings (5.0 stars, 50 reviews)
- Contact information
- Social media links (when added)

**Sitelinks:**

- Direct links to key pages
- Enhanced search result display

---

## Step 8: Integration Checklist

After setup, verify:

- [ ] Property verified in Google Search Console
- [ ] Verification code added to `src/app/layout.tsx`
- [ ] Sitemap submitted and processed
- [ ] No critical errors in Coverage report
- [ ] Structured data validated with Rich Results Test
- [ ] Mobile usability test passed
- [ ] Core Web Vitals showing good scores
- [ ] HTTPS reported as secure
- [ ] Email alerts configured
- [ ] Baseline metrics recorded for future comparison

---

## Monitoring Schedule

### Daily (Automated)

- Google automatically crawls and updates data

### Weekly (Manual Review)

- Check Performance report for traffic trends
- Review any new errors or warnings
- Monitor Core Web Vitals

### Monthly (In-Depth Analysis)

- Analyze search queries and CTR
- Review top-performing pages
- Identify opportunities for optimization
- Check structured data enhancements

### As Needed

- Request indexing for new pages via URL Inspection
- Fix critical errors immediately
- Update sitemap when routes change

---

## Useful Resources

**Google Documentation:**

- [Search Console Help](https://support.google.com/webmasters)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Structured Data Guidelines](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)

**Testing Tools:**

- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema Markup Validator](https://validator.schema.org/)

**Verification:**

- Current verification placeholder: `src/app/layout.tsx` line 82
- Replace placeholder with actual code from Google

---

## Troubleshooting

### Verification Failed

1. Clear browser cache and try again
2. Wait 10-15 minutes after DNS changes
3. Ensure verification code is exact (no extra spaces)
4. Check that site is accessible and not blocking Googlebot
5. Try alternative verification method

### Sitemap Status: "Couldn't fetch"

1. Verify sitemap URL returns 200 OK status
2. Check XML is valid (no syntax errors)
3. Ensure URLs in sitemap use absolute paths
4. Verify server isn't rate-limiting Google's crawlers
5. Check robots.txt isn't blocking sitemap

### Pages Not Appearing in Search

**This is normal for new sites. Timeline:**

- Submit sitemap: Day 0
- First crawl: 1-3 days
- Indexed pages: 3-7 days
- Appearing in search: 7-30 days
- Ranking improvements: 30-90 days

**Accelerate indexing:**

1. Request indexing via URL Inspection Tool
2. Share URLs on social media (drives traffic)
3. Build quality backlinks
4. Update content regularly
5. Fix technical SEO issues

---

## Next Steps After Setup

1. **Connect Google Analytics** (if not already done)
2. **Link to Vercel Analytics** for unified dashboard
3. **Set up automated reporting** with Google Data Studio
4. **Create content strategy** based on search query data
5. **Monitor competitors** using Search Console insights
6. **Optimize for featured snippets** and position zero

---

**Status:** Ready for implementation
**Action Required:** Replace verification code placeholder and submit sitemap
**Documentation Location:** `docs/GOOGLE_SEARCH_CONSOLE_SETUP.md`
