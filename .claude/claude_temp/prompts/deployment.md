# Deployment - Context7 Prompt Template

## Objective

Guide Claude through the deployment process for the appointment booking website, ensuring smooth releases to staging and production environments with proper testing, monitoring, and rollback capabilities.

---

## Prerequisites

Before deployment:

- [ ] All tests passing (`npm run test:ci`)
- [ ] Code reviewed and approved
- [ ] PR merged to target branch (develop or main)
- [ ] No known critical bugs
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Backup plan ready

---

## Deployment Environments

### 1. Development (Feature Branches)

- **Trigger**: Push to feature/_ or fix/_ branches
- **Deployment**: Automatic via Vercel (preview URL)
- **URL Pattern**: `setappointmentapp-[branch]-[hash].vercel.app`
- **Purpose**: Testing individual features before merge

### 2. Staging (Develop Branch)

- **Trigger**: Push to `develop` branch
- **Deployment**: Automatic via GitHub Actions → Vercel
- **URL**: `develop-setappointmentapp.vercel.app` or `staging.yourdomain.com`
- **Purpose**: Integration testing, QA, stakeholder review

### 3. Production (Main Branch)

- **Trigger**: Push to `main` branch
- **Deployment**: Automatic via GitHub Actions → Vercel → Cloudflare cache purge
- **URL**: `yourdomain.com`
- **Purpose**: Live application for end users

---

## Deployment Workflows

### Feature Branch Deployment (Automatic)

**Trigger**: Push to any branch

**Process**:

1. Push code to GitHub
2. Vercel automatically deploys to preview URL
3. Preview URL available in GitHub PR comments
4. Test feature in isolation

**Commands**:

```bash
git push origin feature/feature-name
# Wait for Vercel deployment
# Check PR for preview URL
```

**No manual steps required** - fully automatic.

---

### Staging Deployment

**Use Context7**:

```
use context7 for Vercel deployment configuration
use context7 for Next.js production build optimization
```

#### Step 1: Merge to Develop

```bash
# Ensure feature branch is up to date
git checkout feature/feature-name
git pull origin develop
git push origin feature/feature-name

# Create PR to develop
# Get approval
# Merge PR via GitHub
```

#### Step 2: Automatic Deployment

Once merged to `develop`:

1. **GitHub Actions workflow triggers** (`.github/workflows/develop.yml`)
2. **Workflow steps**:
   - Checkout code
   - Install dependencies
   - Run linting
   - Run type checking
   - Run tests
   - Build application
   - Deploy to Vercel (staging)
3. **Vercel deploys** to staging URL
4. **Deployment status** visible in GitHub Actions tab

#### Step 3: Verify Staging Deployment

```bash
# Check GitHub Actions logs
# Visit staging URL
# Test deployed features
# Check for console errors
# Verify environment variables loaded
```

**Verification Checklist**:

- [ ] Application loads without errors
- [ ] All pages accessible
- [ ] Forms submit successfully
- [ ] Emails send correctly (test email)
- [ ] Database connections working
- [ ] API routes responding correctly
- [ ] No console errors or warnings
- [ ] Performance acceptable (Lighthouse 90+)

---

### Production Deployment

**⚠️ Critical Process - Follow Carefully**

#### Pre-Deployment Checklist

- [ ] **All staging tests passed**
- [ ] **No known critical bugs**
- [ ] **Stakeholder approval obtained** (if required)
- [ ] **Database migrations prepared** (if needed)
- [ ] **Rollback plan documented**
- [ ] **Monitoring tools ready**
- [ ] **Team notified of deployment**
- [ ] **Low-traffic time chosen** (if possible)

#### Step 1: Create Release PR

```bash
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Create release branch (optional but recommended)
git checkout -b release/v1.0.0

# Update version in package.json
npm version minor # or major/patch

# Generate changelog (if using standard-version)
npm run release

# Push release branch
git push origin release/v1.0.0

# Create PR from release branch to main
```

**PR Description Template**:

```markdown
## Release v1.0.0

### New Features

- [ ] Feature 1: Description
- [ ] Feature 2: Description

### Bug Fixes

- [ ] Fix 1: Description
- [ ] Fix 2: Description

### Breaking Changes

- None / List any breaking changes

### Database Changes

- None / Describe schema changes

### Configuration Changes

- None / List new environment variables

### Testing Performed

- [x] All unit tests pass
- [x] Integration tests pass
- [x] E2E tests pass
- [x] Manual testing on staging
- [x] Performance testing (Lighthouse 90+)
- [x] Cross-browser testing
- [x] Mobile responsiveness verified

### Deployment Plan

1. Merge PR to main
2. Monitor GitHub Actions deployment
3. Verify production deployment
4. Purge Cloudflare cache
5. Monitor for 30 minutes

### Rollback Plan

- Revert commit and push to main
- Or use Vercel rollback feature

### Post-Deployment Verification

- [ ] Application loads
- [ ] Critical user flows work
- [ ] No errors in logs
- [ ] Performance acceptable

Deployment Time Estimate: 15 minutes
```

#### Step 2: Get Approval & Merge

1. Request review from team lead/senior developer
2. Wait for approval
3. **Merge PR to main** (via GitHub UI or CLI)

```bash
# Via CLI (after approval)
git checkout main
git pull origin main
git merge --no-ff release/v1.0.0
git push origin main
```

#### Step 3: Monitor Automatic Deployment

**GitHub Actions Production Workflow** (`.github/workflows/production.yml`):

1. **Tests Run**:

   ```
   npm run lint
   npm run type-check
   npm run test:ci
   npm run build
   ```

2. **Lighthouse CI** (optional):
   - Performance audit
   - Accessibility audit
   - SEO audit
   - Best practices audit

3. **Vercel Deployment**:
   - Build application
   - Deploy to production
   - Assign to production domain

4. **Cloudflare Cache Purge**:
   ```bash
   curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
     -H "Authorization: Bearer ${API_TOKEN}" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
   ```

**Monitor deployment**:

```bash
# Watch GitHub Actions
# Go to repository → Actions tab
# Click on workflow run
# Monitor each step

# Or use GitHub CLI
gh run watch
```

#### Step 4: Verify Production Deployment

**Immediately after deployment (within 5 minutes)**:

```bash
# 1. Visit production URL
open https://yourdomain.com

# 2. Check application loads
# 3. Test critical user flows
# 4. Check browser console for errors
# 5. Verify Lighthouse score

# Run Lighthouse (if installed)
lighthouse https://yourdomain.com --view
```

**Verification Checklist**:

- [ ] **Homepage loads** without errors
- [ ] **Hero section displays** correctly
- [ ] **Portfolio carousel works**
- [ ] **Booking form accessible**
- [ ] **Form submission works**
- [ ] **Email confirmation sends** (test with real email)
- [ ] **Database saves appointments**
- [ ] **No console errors**
- [ ] **No network errors** (check Network tab)
- [ ] **SSL certificate valid** (green padlock)
- [ ] **Mobile responsive** (test on phone or DevTools)
- [ ] **Performance good** (Lighthouse 90+)

#### Step 5: Post-Deployment Monitoring (30 minutes)

**Monitor these metrics**:

1. **Vercel Logs**:

   ```bash
   # Via Vercel dashboard or CLI
   vercel logs yourdomain.com
   ```

2. **Cloudflare Analytics**:
   - Go to Cloudflare dashboard
   - Check traffic and errors
   - Verify cache hit ratio

3. **Google Analytics** (if set up):
   - Real-time users
   - Page views
   - Error events

4. **Error Monitoring**:
   - Check for JavaScript errors
   - Check for API errors
   - Check for email delivery failures

**Alert team if**:

- Error rate spikes
- Traffic drops significantly
- Performance degrades
- User reports issues
- Critical functionality broken

#### Step 6: Tag Release

```bash
# Create git tag
git tag -a v1.0.0 -m "Release version 1.0.0

Features:
- Booking form with email validation
- Portfolio carousel
- Email confirmation system

Bug Fixes:
- Fixed responsive layout on mobile
- Fixed form validation edge cases

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push tag to remote
git push origin v1.0.0

# Create GitHub release
gh release create v1.0.0 \
  --title "v1.0.0" \
  --notes "See CHANGELOG.md for details"
```

#### Step 7: Update Changelog

```markdown
# Changelog

## [1.0.0] - 2025-10-29

### Added

- Booking form with multi-step wizard
- Email confirmation system
- Portfolio carousel with 12 projects
- Cloudflare CDN integration

### Fixed

- Responsive layout on mobile devices
- Form validation edge cases
- Email delivery reliability

### Changed

- Improved performance (Lighthouse 95+)
- Updated UI design for better accessibility

### Deployment

- Deployed to production: 2025-10-29 14:30 UTC
- No breaking changes
- No database migrations required
```

---

## Emergency Procedures

### Hotfix Deployment (Critical Bugs in Production)

**When to use**: Critical bug discovered in production that affects users.

#### Step 1: Create Hotfix Branch

```bash
# Branch from main (production)
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue-description
```

#### Step 2: Fix Bug Quickly

1. Reproduce bug
2. Write failing test
3. Implement minimal fix
4. Verify test passes
5. Test manually

```bash
# Run tests
npm run test

# Build to verify
npm run build
```

#### Step 3: Deploy Hotfix

```bash
# Commit fix
git add .
git commit -m "fix(scope): urgent fix for critical issue

Issue: [Description of critical bug]
Impact: [User impact]
Fix: [What was changed]

Fixes #[issue-number]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push hotfix branch
git push origin hotfix/critical-issue-description

# Create PR to main (expedited review)
gh pr create \
  --base main \
  --title "HOTFIX: Critical issue description" \
  --body "Critical bug fix - expedited review needed"

# Get immediate review and approval

# Merge to main
git checkout main
git merge hotfix/critical-issue-description
git push origin main

# Automatic deployment triggers

# Also merge to develop to keep in sync
git checkout develop
git merge hotfix/critical-issue-description
git push origin develop
```

#### Step 4: Monitor Closely

Watch deployment and verify fix immediately.

---

## Rollback Procedures

### Option 1: Vercel Rollback (Fastest - Recommended)

**When to use**: Recent deployment caused issues, previous version was stable.

**Steps**:

1. **Via Vercel Dashboard**:
   - Go to Vercel dashboard
   - Select project
   - Go to "Deployments" tab
   - Find last stable deployment
   - Click "..." menu
   - Click "Promote to Production"
   - Confirm

2. **Via Vercel CLI**:

```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

**Time**: ~2 minutes

### Option 2: Git Revert (Permanent)

**When to use**: Need to permanently revert changes in git history.

**Steps**:

```bash
# Revert the problematic commit
git checkout main
git pull origin main
git revert HEAD

# Or revert multiple commits
git revert HEAD~3..HEAD

# Push revert commit
git push origin main

# This triggers automatic redeployment
```

**Time**: ~5 minutes (including deployment)

### Option 3: Redeploy Previous Commit

**When to use**: Need to deploy a specific previous version.

**Steps**:

```bash
# Find commit hash of stable version
git log --oneline

# Reset to that commit
git checkout main
git reset --hard [commit-hash]

# Force push (⚠️ use with caution)
git push origin main --force

# This triggers automatic redeployment
```

**⚠️ Warning**: Only use for emergencies. Force push rewrites history.

**Time**: ~5 minutes

### Rollback Decision Matrix

| Issue                          | Recommended Method | Time   |
| ------------------------------ | ------------------ | ------ |
| Recent deploy broken           | Vercel Rollback    | 2 min  |
| Need to keep git history clean | Git Revert         | 5 min  |
| Multiple commits bad           | Git Reset          | 5 min  |
| Database migration involved    | Manual + Rollback  | 15 min |

---

## Database Migrations

**⚠️ Important**: Database changes require extra care.

### Forward Migration (Safe)

**Adding new tables/columns** (non-breaking):

1. **Create migration script**:

```sql
-- migrations/001_add_email_logs_table.sql
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id),
  email_type VARCHAR(50) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL
);
```

2. **Run in Supabase dashboard** before deployment

3. **Deploy code** that uses new schema

4. **Verify** migration successful

### Backward Migration (Risky)

**Removing/changing tables/columns** (breaking):

1. **Plan migration carefully**
2. **Create rollback script**
3. **Test on staging first**
4. **Coordinate with team**
5. **Deploy during low-traffic time**
6. **Monitor closely**
7. **Keep rollback script ready**

**Breaking change checklist**:

- [ ] Rollback script prepared
- [ ] Data backup created
- [ ] Tested on staging
- [ ] Team notified
- [ ] Low-traffic time chosen
- [ ] Monitoring ready

---

## Environment Variables

### Adding New Environment Variables

#### Step 1: Update .env.example

```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
RESEND_API_KEY=your_resend_key
NEW_VARIABLE=your_new_variable  # <-- Add new variable
```

#### Step 2: Add to Vercel

**Via Vercel Dashboard**:

1. Go to project settings
2. Click "Environment Variables"
3. Add variable name and value
4. Select environments (Production, Preview, Development)
5. Click "Save"

**Via Vercel CLI**:

```bash
# Add production variable
vercel env add NEW_VARIABLE production

# Add preview variable
vercel env add NEW_VARIABLE preview

# Add development variable
vercel env add NEW_VARIABLE development
```

#### Step 3: Add to GitHub Secrets (for CI/CD)

1. Go to repository settings
2. Click "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add name and value
5. Click "Add secret"

#### Step 4: Redeploy

```bash
# Trigger redeployment to load new variables
vercel --prod

# Or push a commit to trigger automatic deployment
```

---

## Cloudflare Cache Management

### Manual Cache Purge

**When to purge**:

- After deployment (automatic in CI/CD)
- After fixing static asset issues
- When users see old content

**Via Cloudflare Dashboard**:

1. Login to Cloudflare
2. Select your domain
3. Go to "Caching" → "Configuration"
4. Click "Purge Everything"
5. Confirm

**Via API**:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

**Via selective purge** (specific files):

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "files": [
      "https://yourdomain.com/path/to/file.js",
      "https://yourdomain.com/path/to/image.jpg"
    ]
  }'
```

### Verify Cache Purge

```bash
# Check cache status in response headers
curl -I https://yourdomain.com

# Look for:
# cf-cache-status: HIT (cached) or MISS (not cached)
# age: 0 (freshly cached)
```

---

## Monitoring & Alerts

### What to Monitor

**Performance**:

- Page load time
- API response time
- Core Web Vitals (LCP, FID, CLS)
- Lighthouse scores

**Errors**:

- JavaScript errors
- API errors (4xx, 5xx)
- Build failures
- Failed deployments

**Usage**:

- Traffic volume
- Conversion rate (form submissions)
- Bounce rate
- User demographics

**Infrastructure**:

- CDN cache hit ratio
- Bandwidth usage
- Database connections
- Email delivery rate

### Set Up Alerts

**Vercel Alerts** (via dashboard):

- Deployment failures
- Function timeouts
- High error rates

**Cloudflare Alerts** (via dashboard):

- Traffic spikes
- DDoS attacks
- Origin errors
- SSL expiration

**Google Analytics Alerts** (via GA4):

- Traffic drops
- Conversion rate drops
- High bounce rate

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests pass locally
- [ ] Code reviewed and approved
- [ ] PR merged to target branch
- [ ] Staging environment tested
- [ ] No console errors on staging
- [ ] Performance acceptable (Lighthouse 90+)
- [ ] Cross-browser testing done
- [ ] Mobile responsiveness verified
- [ ] Environment variables configured
- [ ] Database migrations ready (if needed)
- [ ] Rollback plan documented
- [ ] Team notified
- [ ] Documentation updated

### During Deployment

- [ ] Monitor GitHub Actions workflow
- [ ] Check for build errors
- [ ] Verify deployment success message
- [ ] Check Vercel deployment logs

### Post-Deployment

- [ ] Visit production URL
- [ ] Test critical user flows
- [ ] Check for console errors
- [ ] Run Lighthouse audit
- [ ] Monitor error rates (30 min)
- [ ] Check Cloudflare Analytics
- [ ] Verify email delivery
- [ ] Tag release in git
- [ ] Update changelog
- [ ] Notify team of successful deployment

---

## Troubleshooting Deployments

### Issue: Build Failing

**Symptoms**: GitHub Actions shows red X, build fails

**Solutions**:

```bash
# 1. Check build logs in GitHub Actions
# 2. Reproduce build locally
npm run build

# 3. Common issues:
# - TypeScript errors
npm run type-check

# - Missing dependencies
npm install

# - Environment variables missing
# Add to Vercel dashboard

# - Node version mismatch
# Check .nvmrc or package.json engines
```

### Issue: Deployment Succeeds But Site Not Working

**Symptoms**: Deployment green, but site shows errors

**Solutions**:

1. Check browser console for errors
2. Check Vercel function logs
3. Verify environment variables loaded
4. Check API routes responding
5. Check database connections
6. Clear Cloudflare cache

```bash
# Check Vercel logs
vercel logs yourdomain.com --follow

# Test API routes
curl https://yourdomain.com/api/health
```

### Issue: Slow Performance After Deployment

**Symptoms**: Site slow, low Lighthouse scores

**Solutions**:

1. Check Cloudflare cache hit ratio
2. Verify images optimized (using Next.js Image)
3. Check for large bundle sizes
4. Review Core Web Vitals
5. Check for memory leaks
6. Verify CDN enabled

```bash
# Analyze bundle size
npm run build
# Check .next/analyze output

# Run Lighthouse
lighthouse https://yourdomain.com --view
```

### Issue: Users Seeing Old Content

**Symptoms**: Changes deployed but users see old version

**Solutions**:

```bash
# 1. Purge Cloudflare cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  --data '{"purge_everything":true}'

# 2. Hard refresh browser (Cmd+Shift+R)

# 3. Check deployment actually succeeded
vercel ls

# 4. Verify correct version deployed
curl -I https://yourdomain.com
# Check x-vercel-id header
```

---

## Quick Reference

### Deployment Commands

```bash
# Deploy to preview (automatic on push)
git push origin feature/branch-name

# Deploy to staging (merge to develop)
git checkout develop
git merge feature/branch-name
git push origin develop

# Deploy to production (merge to main)
git checkout main
git merge develop
git push origin main

# Manual deployment via Vercel
vercel --prod

# Rollback via Vercel
vercel rollback [deployment-url]

# View logs
vercel logs yourdomain.com

# Purge Cloudflare cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  --data '{"purge_everything":true}'
```

### Emergency Contacts

**When deployment goes wrong**:

1. Roll back immediately (Vercel rollback)
2. Notify team in chat
3. Check monitoring for root cause
4. Create hotfix if needed
5. Document incident for postmortem

---

**End of Deployment Prompt Template**
