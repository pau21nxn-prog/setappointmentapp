# Vercel Production Deployment Guide

**Project:** SetAppointmentApp
**Date:** 2025-10-29
**Environments:** Staging (develop) + Production (main)

---

## 📋 PHASE 1: GATHER REQUIRED INFORMATION

### 1.1 Vercel Account

- **Status:** ✅ Already have account
- **Dashboard:** https://vercel.com/dashboard
- **Action:** Ensure you're logged in

### 1.2 GitHub Repository

- **Repository:** `pau21nxn-prog/setappointmentapp`
- **Status:** ✅ Code is on GitHub
- **Action:** Verify both `main` and `develop` branches exist
- **Check:** https://github.com/pau21nxn-prog/setappointmentapp

### 1.3 Supabase Credentials

Navigate to: https://app.supabase.com/project/_/settings/api

**Required values:**

| Variable Name                   | Description               | Example Format              | Location                                                                   |
| ------------------------------- | ------------------------- | --------------------------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL | `https://xxxxx.supabase.co` | Project Settings → API → Project URL                                       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key      | `eyJhbGc...` (long string)  | Project Settings → API → Project API keys → anon/public                    |
| `SUPABASE_SERVICE_ROLE_KEY`     | Private service role key  | `eyJhbGc...` (long string)  | Project Settings → API → Project API keys → service_role (⚠️ Keep secret!) |

**Action Steps:**

1. Log into your Supabase dashboard
2. Select your project
3. Navigate to Settings → API
4. Copy each value and save them securely (use a password manager or secure notes)

### 1.4 Resend Email API Key

Navigate to: https://resend.com/api-keys

**Required value:**

| Variable Name    | Description          | Example Format | Location             |
| ---------------- | -------------------- | -------------- | -------------------- |
| `RESEND_API_KEY` | Resend email API key | `re_xxxxx...`  | Dashboard → API Keys |

**Action Steps:**

1. If you don't have a Resend account:
   - Go to https://resend.com and sign up (free tier available)
   - Verify your email
   - Add and verify your sending domain (or use the Resend test domain for now)

2. Create an API key:
   - Go to API Keys section
   - Click "Create API Key"
   - Give it a name (e.g., "SetAppointmentApp Production")
   - Select permission: "Sending access"
   - Click "Create"
   - **Copy the key immediately** (shown only once!)

### 1.5 Email Configuration (Optional but Recommended)

| Variable Name | Description              | Example                  | Required? |
| ------------- | ------------------------ | ------------------------ | --------- |
| `EMAIL_FROM`  | Sender email address     | `noreply@yourdomain.com` | Optional  |
| `EMAIL_ADMIN` | Admin notification email | `admin@yourdomain.com`   | Optional  |

**Note:** If using Resend's test domain, use an email like `onboarding@resend.dev`

---

## 🚀 PHASE 2: DEPLOY TO VERCEL (Dashboard Method)

### 2.1 Import Project from GitHub

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/new
   - Or click "Add New" → "Project" from your dashboard

2. **Import Repository**
   - Click "Import" next to `pau21nxn-prog/setappointmentapp`
   - If you don't see it, click "Import Git Repository" and search for it
   - If prompted, grant Vercel access to your GitHub repositories

3. **Configure Project**
   - **Project Name:** `setappointmentapp` (or customize)
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `.` (leave as default)
   - **Build Command:** `npm run build` (should auto-detect)
   - **Output Directory:** `.next` (should auto-detect)
   - **Install Command:** `npm install` (should auto-detect)

4. **Don't deploy yet!** Click "Environment Variables" to configure them first

### 2.2 Configure Environment Variables

**IMPORTANT:** Add these for BOTH "Production" AND "Preview" environments

1. **Click "Environment Variables" section**

2. **Add each variable one by one:**

**Variable 1: Supabase URL**

```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: [Paste your Supabase URL here]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 2: Supabase Anon Key**

```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Paste your anon key here]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 3: Supabase Service Role Key**

```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: [Paste your service role key here]
Environments: ✅ Production ✅ Preview ✅ Development
⚠️ This is a SECRET - ensure it's marked as sensitive
```

**Variable 4: Resend API Key**

```
Key: RESEND_API_KEY
Value: [Paste your Resend API key here]
Environments: ✅ Production ✅ Preview ✅ Development
⚠️ This is a SECRET - ensure it's marked as sensitive
```

**Optional Variable 5: Email From Address**

```
Key: EMAIL_FROM
Value: noreply@yourdomain.com (or your verified Resend email)
Environments: ✅ Production ✅ Preview ✅ Development
```

**Optional Variable 6: Admin Email**

```
Key: EMAIL_ADMIN
Value: your-email@domain.com
Environments: ✅ Production ✅ Preview ✅ Development
```

3. **Verify all variables are added**
   - You should see 4-6 environment variables listed
   - Each should be checked for Production, Preview, and Development

### 2.3 Deploy the Project

1. **Click "Deploy"**
   - Vercel will start building your project
   - This deploys the default branch (usually `main`)

2. **Wait for deployment to complete**
   - Build logs will show in real-time
   - Takes approximately 2-5 minutes
   - You'll see "Building..." then "Deploying..." then "Completed"

3. **Check for errors**
   - If build fails, check the build logs
   - Common issues: missing dependencies, TypeScript errors, environment variables not set

### 2.4 Configure Branch Deployments

1. **Go to Project Settings**
   - After deployment, click your project name
   - Click "Settings" tab

2. **Navigate to Git section**
   - Click "Git" in the left sidebar

3. **Configure Production Branch**
   - **Production Branch:** `main`
   - This should already be set

4. **Enable Preview Deployments**
   - Ensure "Preview Deployments" is enabled
   - This will automatically deploy the `develop` branch as a preview

5. **Deploy Develop Branch**
   - Go to "Deployments" tab
   - Click "Deploy" → Select branch → Choose `develop`
   - Or push to `develop` branch and it will auto-deploy

---

## 🛠️ PHASE 3: CLI METHOD (ALTERNATIVE)

### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### 3.3 Link Your Project

Navigate to your project directory:

```bash
cd C:\Users\pau\setappointmentapp
```

Link the project:

```bash
vercel link
```

Follow prompts:

- Set up and deploy? **No** (we'll configure first)
- Link to existing project? **Yes**
- What's your project name? **setappointmentapp**
- Link to it? **Yes**

### 3.4 Add Environment Variables via CLI

**For Production:**

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste your value when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste your value when prompted

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Paste your value when prompted

vercel env add RESEND_API_KEY production
# Paste your value when prompted

vercel env add EMAIL_FROM production
# Paste your value when prompted

vercel env add EMAIL_ADMIN production
# Paste your value when prompted
```

**For Preview (Staging):**

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add SUPABASE_SERVICE_ROLE_KEY preview
vercel env add RESEND_API_KEY preview
vercel env add EMAIL_FROM preview
vercel env add EMAIL_ADMIN preview
```

**For Development:**

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
vercel env add SUPABASE_SERVICE_ROLE_KEY development
vercel env add RESEND_API_KEY development
vercel env add EMAIL_FROM development
vercel env add EMAIL_ADMIN development
```

### 3.5 Deploy to Production

**Deploy the main branch to production:**

```bash
git checkout main
vercel --prod
```

**Deploy the develop branch to preview:**

```bash
git checkout develop
vercel
```

---

## ✅ PHASE 4: VERIFICATION & TESTING

### 4.1 Verify Deployments

**Production URL:**

- Format: `https://setappointmentapp.vercel.app`
- Or: `https://setappointmentapp-[your-username].vercel.app`

**Staging/Preview URL:**

- Format: `https://setappointmentapp-git-develop-[your-username].vercel.app`

**Check in Vercel Dashboard:**

1. Go to your project
2. Click "Deployments" tab
3. You should see deployments for both branches

### 4.2 Test Functionality

**For Each Environment (Production & Staging):**

1. **Homepage loads correctly**
   - Visit the URL
   - Check that the page renders without errors
   - Open browser DevTools console - should be no errors

2. **Supabase Connection**
   - Test any database-dependent features
   - Check that Supabase client initializes correctly
   - Verify no connection errors in console

3. **Form Submission**
   - Test the appointment booking form
   - Fill out all required fields
   - Submit the form

4. **Email Delivery (Resend)**
   - After form submission, check if email is sent
   - Check Resend dashboard for delivery logs
   - Verify email arrives in inbox (check spam folder too)

5. **Environment Variables**
   - In browser console, check: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
   - Should show your Supabase URL (only public vars visible in browser)

### 4.3 Verify Build Information

```bash
# Check deployment info via CLI
vercel ls

# Get deployment URL
vercel inspect [deployment-url]
```

### 4.4 Monitor Build Logs

1. **Via Dashboard:**
   - Go to Deployments tab
   - Click on a deployment
   - View build logs in real-time

2. **Via CLI:**
   ```bash
   vercel logs [deployment-url]
   ```

---

## 🔧 PHASE 5: CONFIGURE AUTOMATIC DEPLOYMENTS

### 5.1 Enable Git Integration

1. **Go to Project Settings → Git**

2. **Configure automatic deployments:**
   - ✅ **Auto-deploy on push:** Enabled
   - ✅ **Production Branch:** `main`
   - ✅ **Preview Branches:** All branches (or specify `develop`)

3. **Deployment Protection (Optional):**
   - Enable Vercel Authentication for preview deployments
   - Require approval for production deployments

### 5.2 Set Up Deployment Notifications

1. **Go to Project Settings → Notifications**

2. **Configure notifications for:**
   - Deployment started
   - Deployment ready
   - Deployment failed

3. **Choose notification channels:**
   - Email
   - Slack (if integrated)
   - Discord (if integrated)

### 5.3 Test Automatic Deployment

**Test with a small change:**

```bash
# Make a small change to README or a component
git checkout develop
# Edit a file
git add .
git commit -m "test: verify automatic deployment"
git push origin develop
```

**Verify:**

- Vercel should automatically detect the push
- A new preview deployment should start
- You'll receive notifications (if configured)
- Check dashboard to see the new deployment

---

## 🌐 PHASE 6: CUSTOM DOMAIN SETUP (OPTIONAL)

### 6.1 Add Custom Domain

1. **Go to Project Settings → Domains**

2. **Add your domain:**
   - Enter your domain name (e.g., `yourdomain.com`)
   - Click "Add"

3. **Configure DNS:**
   - Vercel will provide DNS records to add
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Add the A/CNAME records as instructed

4. **Verify Domain:**
   - Wait for DNS propagation (can take 24-48 hours)
   - Vercel will automatically verify and issue SSL certificate

### 6.2 Configure www Subdomain

```
Add: www.yourdomain.com
Redirect to: yourdomain.com
```

### 6.3 Environment-Specific Domains

**Production:**

- Main domain: `yourdomain.com`

**Staging:**

- Subdomain: `staging.yourdomain.com`
- Or use default: `[project]-git-develop.vercel.app`

---

## 📊 PHASE 7: POST-DEPLOYMENT CHECKLIST

### 7.1 Security Verification

- ✅ All secret environment variables are marked as sensitive
- ✅ Service role keys are not exposed in client-side code
- ✅ HTTPS is enabled (automatic with Vercel)
- ✅ Security headers are configured (check vercel.json)
- ✅ CORS is properly configured if using API routes

### 7.2 Performance Checks

- ✅ Check Lighthouse scores (aim for 90+)
- ✅ Verify image optimization is working
- ✅ Check bundle size (Next.js build output)
- ✅ Test page load times from different locations

### 7.3 Monitoring Setup

1. **Vercel Analytics (Built-in):**
   - Automatically enabled for all deployments
   - View in project dashboard

2. **Optional: External Monitoring**
   - Set up error tracking (Sentry, LogRocket, etc.)
   - Configure uptime monitoring
   - Set up performance monitoring

### 7.4 Database Verification

1. **Check Supabase Dashboard:**
   - Verify connections are being made
   - Check for any errors in logs
   - Verify RLS policies are working

2. **Test Database Operations:**
   - Create an appointment
   - Verify data is saved in Supabase
   - Check that RLS policies allow proper access

### 7.5 Email Verification

1. **Check Resend Dashboard:**
   - Verify emails are being sent
   - Check delivery rates
   - Look for bounces or errors

2. **Test Email Templates:**
   - Send test emails
   - Check formatting
   - Verify links work correctly

---

## 🐛 TROUBLESHOOTING

### Build Failures

**Error: "Module not found"**

- **Cause:** Missing dependency
- **Fix:**
  ```bash
  npm install [missing-package]
  git commit -am "fix: add missing dependency"
  git push
  ```

**Error: "Environment variable not defined"**

- **Cause:** Missing environment variable
- **Fix:** Add the variable in Vercel dashboard or via CLI
- **Verify:** Check that variable is added to correct environment (Production/Preview)

**Error: TypeScript build errors**

- **Cause:** Type errors in code
- **Fix:** Run `npm run type-check` locally and fix errors
- **Test:** Run `npm run build` locally before pushing

### Runtime Errors

**Error: "Failed to connect to Supabase"**

- **Check:** Environment variables are set correctly
- **Verify:** Supabase project is active and accessible
- **Test:** Check Supabase API keys are valid and not expired

**Error: "Resend API error"**

- **Check:** API key is correct and active
- **Verify:** Sending domain is verified in Resend
- **Test:** Check API key permissions (needs sending access)

### Deployment Issues

**Preview deployment not triggering**

- **Check:** Auto-deploy is enabled in Git settings
- **Verify:** Branch is not in ignored branches list
- **Fix:** Manually trigger deployment from dashboard

**Production deployment went to wrong branch**

- **Check:** Production branch setting
- **Fix:** Settings → Git → Change production branch to `main`
- **Redeploy:** Trigger new deployment from correct branch

### Environment Variable Issues

**Variable not updating**

- **Cause:** Cached build
- **Fix:** Redeploy the project after changing variables
- **Note:** Changes to env vars require redeployment

**Secret variables showing in logs**

- **Cause:** Variable not marked as sensitive
- **Fix:** Edit variable and mark as sensitive
- **Security:** Rotate the exposed secret immediately

---

## 📚 USEFUL COMMANDS REFERENCE

### Vercel CLI Commands

```bash
# Login
vercel login

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# View logs
vercel logs [deployment-url]

# Add environment variable
vercel env add [VAR_NAME] [environment]

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm [VAR_NAME] [environment]

# Pull environment variables to local
vercel env pull .env.local

# Inspect deployment
vercel inspect [deployment-url]

# Redeploy
vercel redeploy [deployment-url] --prod

# Remove deployment
vercel rm [deployment-url]
```

### Git Commands for Deployment

```bash
# Deploy to production (main branch)
git checkout main
git pull origin main
# Make your changes
git add .
git commit -m "feat: your changes"
git push origin main
# Vercel auto-deploys

# Deploy to staging (develop branch)
git checkout develop
git pull origin develop
# Make your changes
git add .
git commit -m "feat: your changes"
git push origin develop
# Vercel auto-deploys preview
```

---

## 🎯 DEPLOYMENT WORKFLOW

### Standard Development Flow

1. **Local Development**

   ```bash
   git checkout develop
   git pull origin develop
   npm run dev
   # Make changes
   npm run type-check
   npm run test
   npm run build  # Verify build works
   ```

2. **Push to Staging**

   ```bash
   git add .
   git commit -m "feat: your feature"
   git push origin develop
   # Automatic preview deployment
   ```

3. **Test on Staging**
   - Visit preview URL
   - Test all functionality
   - Verify email delivery
   - Check database operations

4. **Merge to Production**

   ```bash
   git checkout main
   git merge develop
   git push origin main
   # Automatic production deployment
   ```

5. **Verify Production**
   - Visit production URL
   - Smoke test critical functionality
   - Monitor for errors

---

## 📞 SUPPORT & RESOURCES

### Documentation Links

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase Docs:** https://supabase.com/docs
- **Resend Docs:** https://resend.com/docs

### Dashboard Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **Resend Dashboard:** https://resend.com/dashboard
- **GitHub Repository:** https://github.com/pau21nxn-prog/setappointmentapp

### Getting Help

1. **Vercel Support:**
   - Community: https://github.com/vercel/vercel/discussions
   - Documentation: https://vercel.com/docs
   - Status page: https://www.vercel-status.com

2. **Check Build Logs:**
   - Always check deployment logs for errors
   - Look for specific error messages
   - Search Vercel docs for error codes

3. **Common Issues:**
   - 95% of issues are environment variable related
   - Always verify env vars are set correctly
   - Remember to redeploy after changing env vars

---

## ✅ FINAL CHECKLIST

Before considering deployment complete:

- [ ] Production deployment successful
- [ ] Staging deployment successful
- [ ] All environment variables configured for both environments
- [ ] Production URL accessible: `https://setappointmentapp.vercel.app`
- [ ] Staging URL accessible: `https://setappointmentapp-git-develop.vercel.app`
- [ ] Homepage loads without errors
- [ ] Supabase connection working
- [ ] Form submission working
- [ ] Email delivery working (Resend)
- [ ] Automatic deployments enabled
- [ ] Build notifications configured
- [ ] DNS configured (if using custom domain)
- [ ] SSL certificate issued (automatic)
- [ ] Performance check passed (Lighthouse)
- [ ] Security headers verified
- [ ] Database migrations run in Supabase
- [ ] RLS policies verified
- [ ] Error monitoring set up (optional)
- [ ] Team members granted access (if applicable)

---

**Deployment Guide Complete!** 🎉

If you encounter any issues not covered in this guide, refer to the troubleshooting section or check the Vercel documentation.
