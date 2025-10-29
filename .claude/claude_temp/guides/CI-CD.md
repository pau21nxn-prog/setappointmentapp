# CI/CD Pipeline

> **File**: `.claude/guides/CI-CD.md`
> **Last Updated**: October 29, 2025

---

## GitHub Actions Workflows

### 1. Development Workflow

**File**: `.github/workflows/develop.yml`

Runs on push to `develop` branch and PRs targeting `develop`.

**Steps**:

1. Checkout code
2. Setup Node.js 18
3. Install dependencies (`npm ci`)
4. Run linting (`npm run lint`)
5. Run type checking (`npm run type-check`)
6. Run tests (`npm run test`)
7. Build application (`npm run build`)
8. Deploy to Vercel preview

---

### 2. Production Workflow

**File**: `.github/workflows/production.yml`

Runs on push to `main` branch.

**Steps**:

1. Checkout code
2. Setup Node.js 18
3. Install dependencies
4. Run full test suite (`npm run test:ci`)
5. Run Lighthouse CI performance tests
6. Build application
7. Deploy to Vercel production
8. Purge Cloudflare cache

---

### 3. Pull Request Checks

**File**: `.github/workflows/pr-checks.yml`

Runs on all pull requests.

**Steps**:

1. Lint code
2. Type check
3. Run tests with coverage
4. Build application
5. Generate preview deployment
6. Comment preview URL on PR

---

## Environment Variables

**Local Development** (`.env.local`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend Email
RESEND_API_KEY=your_resend_api_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Google Analytics
NEXT_PUBLIC_GA_ID=your_ga_id

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**GitHub Secrets** (for CI/CD):

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ZONE_ID
SUPABASE_URL
SUPABASE_ANON_KEY
RESEND_API_KEY
GOOGLE_ANALYTICS_ID
```

---

**Context7**: `use context7 for GitHub Actions workflow syntax and best practices`

[Return to Main Index](../CLAUDE.md)
