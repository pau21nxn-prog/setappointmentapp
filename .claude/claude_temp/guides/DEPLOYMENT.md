# Deployment Strategy

> **File**: `.claude/guides/DEPLOYMENT.md`
> **Last Updated**: October 29, 2025

---

## Environments

### 1. Development (Feature Branches)

- Auto-deploy to Vercel preview URLs
- URL pattern: `setappointmentapp-[branch]-[hash].vercel.app`
- Purpose: Testing individual features

### 2. Staging (Develop Branch)

- Auto-deploy to staging subdomain
- URL: `staging.yourdomain.com` or `develop-setappointmentapp.vercel.app`
- Purpose: Integration testing, QA

### 3. Production (Main Branch)

- Auto-deploy to production
- URL: `yourdomain.com`
- Cloudflare cache purge on deployment
- Purpose: Live application

---

## Deployment Workflow

```
Feature Branch → Develop Branch → Main Branch
     ↓               ↓                ↓
Preview URL    Staging URL     Production URL
```

---

## Rollback Procedures

### Option 1: Vercel Rollback (Instant)

```bash
vercel rollback [deployment-url]
```

### Option 2: Git Revert

```bash
git revert HEAD~1
git push origin main
# Triggers automatic redeployment
```

### Option 3: Redeploy Previous Version

```bash
# In Vercel dashboard:
# Select previous successful deployment
# Click "Promote to Production"
```

---

## Monitoring Post-Deployment

After each production deployment:

1. Check Vercel deployment logs
2. Verify application loads correctly
3. Test critical user flows (booking form)
4. Check Cloudflare Analytics for errors
5. Monitor Google Analytics for traffic
6. Verify email delivery working
7. Check Lighthouse scores maintained

---

[Return to Main Index](../CLAUDE.md)
