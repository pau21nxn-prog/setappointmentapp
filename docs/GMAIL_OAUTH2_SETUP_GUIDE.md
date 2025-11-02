# Gmail OAuth2 Setup Guide for Nodemailer

This guide will walk you through setting up Gmail with OAuth2 authentication for sending emails from your Next.js application using Nodemailer.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Create Google Cloud Project](#step-1-create-google-cloud-project)
3. [Step 2: Enable Gmail API](#step-2-enable-gmail-api)
4. [Step 3: Configure OAuth Consent Screen](#step-3-configure-oauth-consent-screen)
5. [Step 4: Create OAuth 2.0 Credentials](#step-4-create-oauth-20-credentials)
6. [Step 5: Generate Refresh Token](#step-5-generate-refresh-token)
7. [Step 6: Configure Environment Variables](#step-6-configure-environment-variables)
8. [Step 7: Test Email Sending](#step-7-test-email-sending)
9. [Troubleshooting](#troubleshooting)
10. [Security Best Practices](#security-best-practices)

---

## Prerequisites

- A Google account (Gmail or Google Workspace)
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- Node.js and npm installed locally
- Your Next.js application running

**Important Limits:**

- **Personal Gmail:** 500 emails per day
- **Google Workspace:** 2,000 emails per day

---

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project**
   - Click the project dropdown at the top
   - Click "New Project"
   - Enter project name: `appointment-app-mailer` (or your preferred name)
   - Click "Create"
   - Wait for the project to be created (1-2 minutes)

3. **Select Your Project**
   - Click the project dropdown again
   - Select your newly created project

---

## Step 2: Enable Gmail API

1. **Navigate to APIs & Services**
   - From the hamburger menu (☰), go to: **APIs & Services** → **Library**
   - Or visit: https://console.cloud.google.com/apis/library

2. **Search for Gmail API**
   - In the search bar, type: `Gmail API`
   - Click on "Gmail API" from the results

3. **Enable the API**
   - Click the blue "Enable" button
   - Wait for the API to be enabled (a few seconds)

---

## Step 3: Configure OAuth Consent Screen

1. **Navigate to OAuth Consent Screen**
   - Go to: **APIs & Services** → **OAuth consent screen**
   - Or visit: https://console.cloud.google.com/apis/credentials/consent

2. **Choose User Type**
   - Select **External** (for personal Gmail accounts)
   - Select **Internal** (only if using Google Workspace with organization domain)
   - Click "Create"

3. **Fill Out App Information**

   **App Information:**
   - **App name:** `Appointment App Mailer`
   - **User support email:** Your Gmail address
   - **App logo:** (Optional) Upload your app logo

   **Developer Contact Information:**
   - **Email addresses:** Your Gmail address

   Click "Save and Continue"

4. **Configure Scopes**
   - Click "Add or Remove Scopes"
   - Search for and select: `https://mail.google.com/`
   - Or manually add: `https://www.googleapis.com/auth/gmail.send`
   - Click "Update"
   - Click "Save and Continue"

5. **Add Test Users (for External apps only)**
   - Click "Add Users"
   - Enter your Gmail address (the one you'll use for sending emails)
   - Click "Add"
   - Click "Save and Continue"

6. **Review and Confirm**
   - Review your settings
   - Click "Back to Dashboard"

---

## Step 4: Create OAuth 2.0 Credentials

1. **Navigate to Credentials**
   - Go to: **APIs & Services** → **Credentials**
   - Or visit: https://console.cloud.google.com/apis/credentials

2. **Create Credentials**
   - Click "+ Create Credentials" at the top
   - Select "OAuth client ID"

3. **Configure OAuth Client**
   - **Application type:** Select "Web application"
   - **Name:** `Appointment App - Nodemailer`

   **Authorized JavaScript origins:**
   - Add: `http://localhost:3000` (for local development)
   - Add: `https://yourdomain.com` (for production, if needed)

   **Authorized redirect URIs:**
   - Add: `https://developers.google.com/oauthplayground`
   - Add: `http://localhost:3000` (optional, for local testing)
   - Add: `https://yourdomain.com/api/auth/callback` (optional, for production)

   Click "Create"

4. **Save Your Credentials**
   - A popup will show your credentials:
     - **Client ID:** `xxxxx.apps.googleusercontent.com`
     - **Client Secret:** `GOCSPX-xxxxx`
   - **IMPORTANT:** Copy these and save them securely
   - You can always retrieve them later from the Credentials page
   - Click "OK"

---

## Step 5: Generate Refresh Token

You'll use the OAuth 2.0 Playground to generate a refresh token.

### Method A: Using OAuth 2.0 Playground (Recommended)

1. **Open OAuth 2.0 Playground**
   - Visit: https://developers.google.com/oauthplayground

2. **Configure Settings**
   - Click the gear icon (⚙️) in the top-right
   - Check "Use your own OAuth credentials"
   - **OAuth Client ID:** Paste your Client ID from Step 4
   - **OAuth Client Secret:** Paste your Client Secret from Step 4
   - Click "Close"

3. **Select Gmail API Scope**
   - In the left panel, scroll down to "Gmail API v1"
   - Expand it and check: `https://mail.google.com/`
   - Or manually enter in "Input your own scopes": `https://mail.google.com/`
   - Click "Authorize APIs" (blue button)

4. **Authorize Access**
   - You'll be redirected to Google sign-in
   - Sign in with your Gmail account (the one you'll use for sending emails)
   - Click "Allow" to grant permissions
   - You'll see a warning if using an external app - click "Continue"
   - You'll be redirected back to the Playground

5. **Exchange Authorization Code**
   - You should see "Authorization code" in Step 2
   - Click "Exchange authorization code for tokens" (blue button)

6. **Get Your Refresh Token**
   - You'll see a response with:
     - **Access token:** (expires in 1 hour)
     - **Refresh token:** (long-lived, this is what you need!)
   - **IMPORTANT:** Copy the **Refresh Token** and save it securely
   - Example format: `1//0gXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

### Method B: Using Node.js Script (Alternative)

If you prefer to generate tokens programmatically:

```javascript
// generate-token.js
const { google } = require('googleapis');
const readline = require('readline');

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  'YOUR_CLIENT_ID.apps.googleusercontent.com',
  'YOUR_CLIENT_SECRET',
  'https://developers.google.com/oauthplayground'
);

const scopes = ['https://mail.google.com/'];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Authorize this app by visiting this URL:', url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the code from that page here: ', (code) => {
  rl.close();
  oauth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving token', err);
    console.log('Refresh Token:', token.refresh_token);
    console.log('Access Token:', token.access_token);
  });
});
```

Run with:

```bash
npm install googleapis
node generate-token.js
```

---

## Step 6: Configure Environment Variables

### Local Development

1. **Create `.env.local` file** (if it doesn't exist)

   ```bash
   # In your project root
   touch .env.local
   ```

2. **Add Gmail OAuth2 Variables**

   ```bash
   # Gmail OAuth2 Configuration
   GMAIL_USER=your-email@gmail.com
   GMAIL_CLIENT_ID=xxxxx.apps.googleusercontent.com
   GMAIL_CLIENT_SECRET=GOCSPX-xxxxx
   GMAIL_REFRESH_TOKEN=1//0gXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

   # Optional: Access token (will be auto-generated from refresh token)
   # GMAIL_ACCESS_TOKEN=ya29.xxxxx

   # Email Configuration
   EMAIL_FROM=your-email@gmail.com
   EMAIL_ADMIN=admin@yourdomain.com
   ```

3. **Replace placeholders:**
   - `GMAIL_USER`: Your Gmail email address
   - `GMAIL_CLIENT_ID`: Client ID from Step 4
   - `GMAIL_CLIENT_SECRET`: Client Secret from Step 4
   - `GMAIL_REFRESH_TOKEN`: Refresh token from Step 5
   - `EMAIL_FROM`: Email address to send from (usually same as GMAIL_USER)
   - `EMAIL_ADMIN`: Email to receive appointment notifications

### Production Deployment (Vercel)

1. **Navigate to Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Select your project

2. **Add Environment Variables**
   - Go to: **Settings** → **Environment Variables**
   - Add each variable:
     - `GMAIL_USER`
     - `GMAIL_CLIENT_ID`
     - `GMAIL_CLIENT_SECRET`
     - `GMAIL_REFRESH_TOKEN`
     - `EMAIL_FROM`
     - `EMAIL_ADMIN`

3. **Select Environments**
   - Check: Production, Preview, and Development
   - Click "Save"

4. **Redeploy**
   - Go to: **Deployments**
   - Click "..." on the latest deployment → "Redeploy"

---

## Step 7: Test Email Sending

### Test 1: Run the Application

```bash
npm run dev
```

Visit: http://localhost:3000

### Test 2: Submit a Test Booking

1. Fill out the booking form
2. Submit it
3. Check your email inbox (the address you entered in the form)
4. Check the admin email inbox (EMAIL_ADMIN)

### Test 3: Check Application Logs

Look for log messages like:

```
📧 Sending appointment confirmation emails: { client: 'client@example.com', admin: 'admin@yourdomain.com' }
✅ Emails sent successfully: { clientSuccess: true, adminSuccess: true }
```

### Test 4: Verify in Supabase

Check the `email_logs` table:

```sql
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 10;
```

Should show:

- `status`: `'sent'`
- `message_id`: `<unique-id@gmail.com>`

---

## Troubleshooting

### Issue 1: "Gmail OAuth2 not configured" Error

**Problem:** Missing or incorrect environment variables

**Solution:**

1. Verify all required env vars are set in `.env.local`:
   ```bash
   echo $GMAIL_USER
   echo $GMAIL_CLIENT_ID
   echo $GMAIL_CLIENT_SECRET
   echo $GMAIL_REFRESH_TOKEN
   ```
2. Restart your dev server after adding env vars
3. Check for typos in variable names

### Issue 2: "Invalid credentials" Error

**Problem:** Client ID or Client Secret is incorrect

**Solution:**

1. Double-check credentials in Google Cloud Console
2. Re-copy Client ID and Client Secret
3. Ensure no extra spaces or line breaks
4. Regenerate credentials if needed

### Issue 3: "Invalid grant" or "Token expired" Error

**Problem:** Refresh token is invalid or revoked

**Solution:**

1. Generate a new refresh token (repeat Step 5)
2. Ensure you selected "offline" access type
3. Check if you revoked access in Google Account settings
4. Visit: https://myaccount.google.com/permissions
5. Remove the app and re-authorize

### Issue 4: "Insufficient permissions" Error

**Problem:** Missing Gmail API scope

**Solution:**

1. Go back to OAuth Consent Screen in Google Cloud Console
2. Verify `https://mail.google.com/` scope is added
3. Re-generate refresh token with correct scope

### Issue 5: "Daily sending quota exceeded"

**Problem:** You've reached Gmail's daily sending limit

**Solution:**

1. **Personal Gmail:** 500 emails/day limit
2. **Google Workspace:** 2,000 emails/day limit
3. Wait 24 hours for quota to reset
4. Consider upgrading to Google Workspace for higher limits
5. Implement email queuing/batching

### Issue 6: Emails Going to Spam

**Problem:** Emails are being marked as spam

**Solution:**

1. **Add SPF record to your domain:**
   ```
   v=spf1 include:_spf.google.com ~all
   ```
2. **Add DKIM signature** (Google Workspace only)
3. **Verify sender email** matches GMAIL_USER
4. **Warm up your email address:**
   - Start with low volume (10-20 emails/day)
   - Gradually increase over 2-3 weeks
5. **Improve email content:**
   - Avoid spam trigger words
   - Include unsubscribe link
   - Use proper HTML formatting

### Issue 7: "Error: connect ETIMEDOUT" or Network Errors

**Problem:** Cannot connect to Gmail SMTP servers

**Solution:**

1. Check your internet connection
2. Verify firewall allows outbound connections on port 465/587
3. Check if your ISP blocks SMTP
4. Try using a VPN
5. Test with a different network

---

## Security Best Practices

### 1. Protect Your Credentials

- ✅ **NEVER** commit `.env.local` to Git
- ✅ Add `.env.local` to `.gitignore`
- ✅ Use Vercel/environment variables for production
- ✅ Rotate credentials if exposed
- ✅ Use separate credentials for dev/staging/production

### 2. Restrict OAuth Scopes

- ✅ Only request `https://mail.google.com/` scope
- ✅ Don't request more permissions than needed
- ✅ Review and remove unused scopes

### 3. Monitor Usage

- ✅ Check email logs regularly in Supabase
- ✅ Set up alerts for failed emails
- ✅ Monitor daily sending quota
- ✅ Review OAuth consent screen periodically

### 4. Implement Rate Limiting

Already implemented in your app via:

- Upstash Redis rate limiting
- Supabase duplicate detection
- Honeypot spam protection

### 5. Regular Audits

- ✅ Review authorized apps: https://myaccount.google.com/permissions
- ✅ Check Google Cloud Console activity logs
- ✅ Rotate credentials every 90 days
- ✅ Remove test users after development

---

## Useful Resources

### Official Documentation

- [Gmail API Overview](https://developers.google.com/gmail/api/guides)
- [OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Nodemailer Documentation](https://nodemailer.com/about/)
- [Nodemailer OAuth2 Guide](https://nodemailer.com/smtp/oauth2/)

### Google Cloud Console Links

- [API Dashboard](https://console.cloud.google.com/apis/dashboard)
- [Credentials](https://console.cloud.google.com/apis/credentials)
- [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
- [Quotas](https://console.cloud.google.com/apis/api/gmail.googleapis.com/quotas)

### Tools

- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
- [Google Account Permissions](https://myaccount.google.com/permissions)
- [Google Workspace Admin Console](https://admin.google.com/) (for Workspace users)

---

## Quick Reference

### Environment Variables Summary

```bash
# Required
GMAIL_USER=your-email@gmail.com
GMAIL_CLIENT_ID=xxxxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-xxxxx
GMAIL_REFRESH_TOKEN=1//0gXXXXXXXXXXXXXXXXXX
EMAIL_FROM=your-email@gmail.com
EMAIL_ADMIN=admin@yourdomain.com

# Optional
GMAIL_ACCESS_TOKEN=ya29.xxxxx (auto-generated)
```

### Gmail Sending Limits

| Account Type     | Daily Limit | Per Minute |
| ---------------- | ----------- | ---------- |
| Personal Gmail   | 500         | ~2         |
| Google Workspace | 2,000       | ~10        |

### OAuth 2.0 Scopes

| Scope                                        | Permission                  |
| -------------------------------------------- | --------------------------- |
| `https://mail.google.com/`                   | Full Gmail access           |
| `https://www.googleapis.com/auth/gmail.send` | Send emails only (narrower) |

---

## Next Steps

After completing this setup:

1. ✅ Test email sending in development
2. ✅ Deploy to Vercel with production credentials
3. ✅ Monitor email logs in Supabase
4. ✅ Set up email templates customization (if needed)
5. ✅ Consider implementing:
   - Email queuing for bulk sends
   - Retry logic for failed emails
   - Email analytics/tracking
   - Unsubscribe functionality

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review application logs: `npm run dev` output
3. Check Supabase `email_logs` table for error messages
4. Verify Google Cloud Console settings
5. Test OAuth credentials with OAuth Playground

---

**Last Updated:** 2025-11-02
**Version:** 1.0.0
**Compatible with:** Next.js 14.x, Nodemailer 6.x
